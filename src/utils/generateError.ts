/**
 * @description Generate custom error
 * @param {string} message
 * @param {number} statusCode
 * @param {any} data
 */

class CustomError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number, data: any) {
    super(message);
    super(this.stack);
    this.statusCode = statusCode;
    this.data = data || {};
    // Set the prototype explicitly to ensure correct inheritance
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const generateError = function (
  message: string,
  statusCode: number,
  data?: any
): Error {
  return new CustomError(message, statusCode, data);
};
