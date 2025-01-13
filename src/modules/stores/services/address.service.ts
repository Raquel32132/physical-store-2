import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import axios from "axios";
import { LoggerService } from "../../../common/logger/logger.service";
import { Client, DistanceMatrixResponseData } from "@googlemaps/google-maps-services-js";
import { CorreiosResponseProps } from "src/common/interfaces/correios-response.interface";
import { formatPostalCode } from "../../../utils/format-postal-code.util";
import { ViaCepResponseProps } from "src/common/interfaces/via-cep-response.interface";
import { OpenCageProps } from "src/common/interfaces/open-cage.interface";

@Injectable()
export class AddressService {
  private readonly googleMapsClient: Client;
  
  constructor (
    private readonly logger: LoggerService
  ) {
    this.googleMapsClient = new Client({});
  }

  async validatePostalCode(postalCode: string, req: Request): Promise<void> {
    const correlationId = req['correlationId'];
    this.logger.log(`Validating postal code: : ${postalCode} with ViaCEP API`, correlationId);

    const postalCodePattern = /^\d{8}$/;

    if (!postalCode) {
      this.logger.log('Postal code is required', correlationId);
      throw new HttpException('Postal code is required', HttpStatus.BAD_GATEWAY);
    };
  
    if (!postalCodePattern.test(postalCode)) {
      this.logger.log(`Invalid postal code format: ${postalCode}`, correlationId);
      throw new HttpException(`Invalid postal code format: ${postalCode}`, HttpStatus.BAD_REQUEST);
    };

    try {
      const response = await axios.get<ViaCepResponseProps>(`${process.env.VIA_CEP_API_URL}${postalCode}/json/`);

      if (response.status !== 200 || response.data.erro === true) {
        this.logger.log(`Postal code not found: ${postalCode}`, correlationId);
        throw new HttpException(`Postal code not found: ${postalCode}`, HttpStatus.NOT_FOUND);
      }

    } catch (error) {
      this.logger.error(`Error validating postal code with ViaCEP API: ${error.message}`, error.stack, correlationId);
      throw new HttpException(`Faield to validate postal code with ViaCEP API: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCoordinatesWithOpenCage(postalCode: string, req: Request): Promise<{ latitude: number; longitude: number }> {
    const correlationId = req['correlationId'];
    this.logger.log(`Requesting coordinates from OpenCage API through postal code: ${postalCode}`, correlationId);

    const formmatedPostalCode = formatPostalCode(postalCode);
    const viaCEPUrl = `${process.env.VIA_CEP_API_URL}/${formmatedPostalCode}/json/`;

    this.logger.log(`Getting address of the postal code with ViaCEP API: ${postalCode}`, correlationId);
    const viaCepResponse = await axios.get<ViaCepResponseProps>(viaCEPUrl);

    const formattedAddress = (`${viaCepResponse.data.logradouro},${viaCepResponse.data.uf},${viaCepResponse.data.localidade}`).replace(/ /g, '+');
    const url = `${process.env.OPENCAGE_URL}?q=${encodeURIComponent(formattedAddress)}&key=${process.env.OPENCAGE_API_KEY}`;

    try {
      const response = await axios.get<OpenCageProps>(url);
      
      const { lat, lng } = response.data.results[0].geometry;
      
      if (!lat || !lng) {
        throw new HttpException('Error searching for coordinates with OpenCage API', HttpStatus.NOT_FOUND);
      }
      
      this.logger.log(`Coordinates requested successfully: ${postalCode}`, correlationId);
      return { latitude: lat, longitude: lng };

    } catch (error) {
      this.logger.error(`Error searching for coodinates with OpenCage API: ${error.message}`, error.stack, correlationId);
      throw new HttpException(`Error searching for coordinates with OpenCage API: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
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

      if (response.status !== 200) {
        this.logger.error("Failed to calculate shipping.", correlationId);
        throw new HttpException('Failed to calculate shipping.', HttpStatus.BAD_REQUEST);
      }
      
      this.logger.log(`Shipping calculated successfully: ${JSON.stringify(response.data)}`, correlationId);
      return response.data;

    } catch (error) {
      this.logger.error(`Error calculating shipping: ${error.message}`, error.stack, correlationId);
      throw new HttpException(`Error calculating coordinates from Correios API: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDistance(originPostalCode: string, destinationPostalCode: string, req: Request): Promise<{ distanceText: string, distanceValue: number }> {
    const correlationId = req['correlationId'];
    this.logger.log(`Calculating distance from ${originPostalCode} to ${destinationPostalCode}`, correlationId);
  
    const payload = {
      origins: [originPostalCode],
      destinations: [destinationPostalCode],
      key: process.env.GOOGLE_MAPS_API_KEY,
    };
  
    try {
      const response = await this.googleMapsClient.distancematrix({ params: payload });
      const data: DistanceMatrixResponseData = response.data;
  
      if (data.rows[0].elements[0].status === 'NOT_FOUND') {
        this.logger.warn('Google Maps returned NOT_FOUND, falling back to try with OpenCage API to get coordinates.', correlationId);

        const originCoordinates = await this.getCoordinatesWithOpenCage(originPostalCode, req);
        const destinationCoordinates = await this.getCoordinatesWithOpenCage(destinationPostalCode, req);
  
        const newPayload = {
          origins: [`${originCoordinates.latitude},${originCoordinates.longitude}`],
          destinations: [`${destinationCoordinates.latitude},${destinationCoordinates.longitude}`],
          key: process.env.GOOGLE_MAPS_API_KEY,
        };
  
        this.logger.log('Calculating distance with coordinates.', correlationId);
        const newResponse = await this.googleMapsClient.distancematrix({ params: newPayload });
        const newData: DistanceMatrixResponseData = newResponse.data;
  
        if (newData.status === 'OK') {
          const distanceText = newData.rows[0].elements[0].distance.text;
          const distanceValue = newData.rows[0].elements[0].distance.value;

          this.logger.log('Distance calculated successfully.', correlationId);
          return { distanceText, distanceValue };

        } else {
          this.logger.error(`Failed to calculate distance. Response: ${newData.error_message}`, correlationId);
          throw new HttpException('Failed to calculate distance using coordinates.', HttpStatus.BAD_REQUEST);
        }

      } else if (data.status === 'OK') {
        const distanceText = data.rows[0].elements[0].distance.text;
        const distanceValue = data.rows[0].elements[0].distance.value;
  
        this.logger.log('Distance calculated successfully.', correlationId);
        return { distanceText, distanceValue };

      } else {
        this.logger.error(`Failed to calculate distance: ${data.error_message}`, correlationId);
        throw new HttpException('Failed to calculate distance.', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      this.logger.error(`Error calculating distance: ${error.message}`, error.stack, correlationId);
      throw new HttpException(`Error calculating distances with Google Maps API: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}