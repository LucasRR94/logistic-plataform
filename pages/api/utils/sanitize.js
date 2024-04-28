import { z } from "zod";

// Define the schema for validating BigInt values
const stringSchemaBigInt = z
  .string()
  .regex(/^\d+$/)
  .refine((bigInt) => /^\d+$/.test(bigInt.trim()), {
    message: "Input must contain only digits (0-9) with no whitespace",
  })
  .transform((bigInt) => BigInt(bigInt.trim(), 10));

// Define the schema for validating string
const stringSchemaString = z
  .string()
  .regex(/^[a-zA-Z0-9\s]*$/)
  .refine((text) => /^[a-zA-Z0-9\s]*$/.test(text.trim()), {
    message:
      "Input must contain only characters and white space with no whitespace",
  })
  .transform(
    (text) =>
      text
        .replace(/&/g, "&amp;") // Replace '&' with '&amp;'
        .replace(/</g, "&lt;") // Replace '<' with '&lt;'
        .replace(/>/g, "&gt;") // Replace '>' with '&gt;'
        .replace(/"/g, "&quot;") // Replace '"' with '&quot;'
        .replace(/'/g, "&#x27;") // Replace "'" with '&#x27;'
        .replace(/\\/g, "&#x5C;") // Replace '\' with '&#x5C;'
  );

// Define the schema for validating for dates
const stringSchemaDate = z
  .string()
  .regex(/^[0-9]*$/)
  .refine((text) => /^[0-9]*$/.test(text.trim()), {
    message: "Input must contain only alphanumerics with no whitespace",
  })
  .transform(
    (textDate) => new Date(parseInt(textDate)) // convert the date in millisecods for new Date
  );

export const validateBitInt = async (bigInt) =>
  stringSchemaBigInt.parse(bigInt);

export const validateString = async (text) => stringSchemaString.parse(text);

export const validateDate = async (newDate) => stringSchemaDate.parse(newDate);
