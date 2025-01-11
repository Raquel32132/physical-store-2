import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { LoggerService } from "src/common/logger/logger.service";
import axios from "axios";
import { validatePostalCode } from "src/utils/validate-postal-code.util";
import { Client } from "@googlemaps/google-maps-services-js";
import { CorreiosResponseProps } from "src/common/interfaces/correios-response.interface";

@Injectable()
export class AddressService {
  private readonly googleMapsClient: Client;
  
  constructor (
    private readonly logger: LoggerService
  ) {
    this.googleMapsClient = new Client({});
  }

  // ajustar metodo para adicionar dados de endereço ao criar loja
  // async getAddressByPostalCode(postalCode: string, req: Request): Promise<ViaCepResponseProps> {
  //   const correlationId = req['correlationId'];
  //   this.logger.log(`Requesting address from ViaCep API through postal code: ${postalCode}`, correlationId);

  //   try {
  //     this.logger.log(`Validating postal code: ${postalCode}`, correlationId);
  //     await validatePostalCode(postalCode);

  //     const response = await axios.get<ViaCepResponseProps>(`${process.env.VIA_CEP_API_URL}${postalCode}/json/`);

  //     this.logger.log(`Address successfully retrieved from ViaCep API. Response data: ${JSON.stringify(response.data)}`, correlationId);
  //     return response.data;

  //   } catch (error) {
  //     this.logger.error(`Error requesting address from ViaCep API: ${error.message}`, error.stack, correlationId);
  //     throw new HttpException(`Error requesting address from ViaCep API: ${error.message}`, HttpStatus.BAD_REQUEST);
  //   }
  // }

  async getCoordinates(postalCode: string, req: Request): Promise<{ lat: number; lng: number }> {
    const correlationId = req['correlationId'];
    this.logger.log(`Requesting coordinates from Google Maps API through postal code: ${postalCode}`, correlationId);

    try {
      this.logger.log(`Validating postal code: ${postalCode}`, correlationId);
      await validatePostalCode(postalCode);
      
      const response = await this.googleMapsClient.geocode({
        params: {
          address: postalCode,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK') {
        this.logger.log(`Coordinates successfully retrieved from Google Maps API. Response data: ${JSON.stringify(response.data)}`, correlationId);
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

    const payload = {
      cepOrigem: originPostalCode,
      cepDestino: destinationPostalCode,
      comprimento: "20",
      largura: "15",
      altura: "10",
    };

    try {
      this.logger.log(`Validating postal codes: ${originPostalCode}, ${destinationPostalCode}`, correlationId);
      await validatePostalCode(originPostalCode);
      await validatePostalCode(destinationPostalCode);

      const response = await axios.post<CorreiosResponseProps[]>(`${process.env.CORREIOS_API_URL}`, payload, {
        headers: {'Content-Type': 'application/json',},
      });

      this.logger.log(`Shipping calculated successfully: ${JSON.stringify(response.data)}`, correlationId);

      if (response.status !== 200) {
        this.logger.error(`Failed to calculate shipping. Response: ${JSON.stringify(response.data)}`, correlationId);
        throw new HttpException('Failed to calculate shipping.', HttpStatus.BAD_REQUEST);
      }

      return response.data;

    } catch (error) {
      this.logger.error(`Error calculating shipping: ${error.message}`, error.stack, correlationId);
      throw error;
    }
  }

  // função para calcular a distancia da loja ate o cep

}