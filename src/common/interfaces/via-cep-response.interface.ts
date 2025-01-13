export interface ViaCepResponseProps {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  estado: string;
  uf: string;
  erro?: boolean;
}