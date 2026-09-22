export const assertValidObjectId = (value: string, label: string): void => {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    const error = new Error(`Invalid ${label}`);
    (error as any).statusCode = 400;
    throw error;
  }
};