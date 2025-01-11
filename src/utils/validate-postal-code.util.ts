import { ViaCepResponseProps } from "src/common/interfaces/via-cep-response.interface";

export const validatePostalCode = async (postalCode: string): Promise<void> => {
  const postalCodePattern = /^\d{8}$/;

  if (!postalCode) {
    throw new Error('Postal code is required');
  };

  if (!postalCodePattern.test(postalCode)) {
    throw new Error('Invalid postal code format');
  };

  const response = await axios.get<ViaCepResponseProps>(`${process.env.VIA_CEP_API_URL}${postalCode}/json/`);
  if (response.data.cep !== postalCode) {
    throw new Error('Postal code not found');
  }
}