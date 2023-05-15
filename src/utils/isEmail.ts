/**
 * Checks if the input is a valid email
 * @param input 
 * @returns a boolean
 */
export const isEmail = function (input: string): Boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};
