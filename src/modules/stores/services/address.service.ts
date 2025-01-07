import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { LoggerService } from "src/common/logger/logger.service";
import axios from "axios";

export interface ViaCepResponseProps {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  estado: string;
}

@Injectable()
export class AddressService {
  constructor (
    private readonly logger: LoggerService
  ) {}

  async getAddressByPostalCode(postalCode: string, req: Request): Promise<ViaCepResponseProps> {
    const correlationId = req['correlationId'];

    this.logger.log(`Requesting address from ViaCep API through postal code: ${postalCode}`, correlationId);

    try {
      const response = await axios.get<ViaCepResponseProps>(`https://viacep.com.br/ws/${postalCode}/json/`);

      this.logger.log(`Address successfully retrieved from ViaCep API. Response data: ${JSON.stringify(response.data)}`, correlationId);
      return response.data;

    } catch (error) {
      this.logger.error(`Error requesting address from ViaCep API: ${error.message}`, correlationId);
      throw new HttpException(`Error requesting address from ViaCep API: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }



}