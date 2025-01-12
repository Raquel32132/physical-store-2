import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import axios from "axios";
import { LoggerService } from "src/common/logger/logger.service";
import { Client, DistanceMatrixResponseData } from "@googlemaps/google-maps-services-js";
import { CorreiosResponseProps } from "src/common/interfaces/correios-response.interface";
import { formatPostalCode } from "src/utils/validate-postal-code.util";


@Injectable()
export class AddressService {
  private readonly googleMapsClient: Client;
  
  constructor (
    private readonly logger: LoggerService
  ) {
    this.googleMapsClient = new Client({});
  }

  async getCoordinates(postalCode: string, req: Request): Promise<{ lat: number; lng: number }> {
    const correlationId = req['correlationId'];
    this.logger.log(`Requesting coordinates from Google Maps API through postal code: ${postalCode}`, correlationId);

    try {      
      const response = await this.googleMapsClient.geocode({
        params: {
          address: postalCode,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK') {
        this.logger.log(`Coordinates successfully retrieved from Google Maps API. Response data: ${JSON.stringify(response.data.results[0].geometry.location)}`, correlationId);
        const { lat, lng } = response.data.results[0].geometry.location;

        return { lat, lng };

      } else {
        this.logger.error(`Failed requesting coordinates for postal code: ${postalCode}. Status: ${response.data.status}`, correlationId);
        throw new HttpException(`Failed requesting coordinates from Google Maps API: ${response.data.status}`, HttpStatus.BAD_REQUEST);
      }

    } catch (error) {
      this.logger.error(`Error requesting coordinates from Google Maps API: ${error.message}`, error.stack, correlationId);
      throw new HttpException(`Error requesting coordinates from Google Maps API: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getShipping(originPostalCode: string, destinationPostalCode: string, req: Request): Promise<CorreiosResponseProps[]> {
    const correlationId = req['correlationId'];
    this.logger.log(`Calculating shipping from ${originPostalCode} to ${destinationPostalCode}`, correlationId);

    const formmatedOriginPostalCode = formatPostalCode(originPostalCode)
    const formmatedDestinationPostalCode = formatPostalCode(destinationPostalCode)

    const payload = {
      cepOrigem: formmatedOriginPostalCode,
      cepDestino: formmatedDestinationPostalCode,
      comprimento: "20",
      largura: "15",
      altura: "10",
    };

    try {
      const response = await axios.post<CorreiosResponseProps[]>(`${process.env.CORREIOS_API_URL}`, payload, {
        headers: {'Content-Type': 'application/json',},
      });

      this.logger.log(`Shipping calculated successfully: ${JSON.stringify(response.data)}`, correlationId);

      if (response.status !== 200) {
        this.logger.error("Failed to calculate shipping.", correlationId);
        throw new HttpException('Failed to calculate shipping.', HttpStatus.BAD_REQUEST);
      }

      return response.data;

    } catch (error) {
      this.logger.error(`Error calculating shipping: ${error.message}`, error.stack, correlationId);
      throw error;
    }
  }

  async getDistance(originPostalCode: string, destinationPostalCode: string, req: Request): Promise<{ distanceText: string, distanceValue: number}> {
    const correlationId = req['correlationId'];
    this.logger.log(`Calculating distance from ${originPostalCode} to ${destinationPostalCode}`, correlationId);

    const payload = {
      origins: [originPostalCode],
      destinations: [destinationPostalCode],
      key: process.env.GOOGLE_MAPS_API_KEY,
    };

    try {
      const response = await this.googleMapsClient.distancematrix({ params: payload })
      const data: DistanceMatrixResponseData = response.data;

      if (data.status !== 'OK') {
        this.logger.error(`Failed to calculate distance. Response: ${data.error_message}`, correlationId);
        throw new HttpException('Failed to calculate distance.', HttpStatus.BAD_REQUEST);
      }

      this.logger.log(`Distance calculated successfully: ${data.rows[0].elements[0].distance.text}`, correlationId);
      const distanceText =  data.rows[0].elements[0].distance.text
      const distanceValue = data.rows[0].elements[0].distance.value
      return { distanceText, distanceValue };

    } catch (error) {
      this.logger.error(`Error calculating distance: ${error.message}`, error.stack, correlationId);
      throw error;
    }
  }

}