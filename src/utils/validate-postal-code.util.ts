export const validatePostalCode = async (postalCode: string): Promise<void> => {
  const postalCodePattern = /^\d{8}$/;

  if (!postalCode) {
    throw new Error('Postal code is required');
  };

  if (!postalCodePattern.test(postalCode)) {
    throw new Error('Invalid postal code format');
  };
}