import {
  validateBitInt,
  validateString,
  validateDate,
} from "@/pages/api/utils/sanitize";

describe("validateBitInt", () => {
  it("correctly rejects empty input", () => {
    expect(validateBitInt()).rejects.toThrow();
  });

  it("correctly rejects string", () => {
    const unsafe_text = "10a";
    expect(validateBitInt(unsafe_text)).rejects.toThrow();
  });

  it("correctly rejects string with bypass 1", () => {
    const unsafe_text = "10''; SELECT * FROM information_schema.tables;";
    expect(validateBitInt(unsafe_text)).rejects.toThrow();
  });

  it("correctly rejects string with bypass 2", () => {
    const unsafe_text = "11 ; TRUNCATE TABLE customers;";
    expect(validateBitInt(unsafe_text)).rejects.toThrow();
  });

  it("correctly accept input with the correct digits", () => {
    const bigInt = Number.MAX_SAFE_INTEGER;
    expect(validateBitInt(`${bigInt}`)).resolves.toEqual(BigInt(bigInt));
  });
});

describe("validateString", () => {
  it("correctly rejects empty input", () => {
    expect(validateString()).rejects.toThrow();
  });

  it("correctly rejects string with bypass", () => {
    const unsafe_text = "something more like 123 @";
    expect(validateString(unsafe_text)).rejects.toThrow();
  });

  it("correctly rejects string with bypass 1", () => {
    const unsafe_text = "something more like 123 '' ";
    expect(validateString(unsafe_text)).rejects.toThrow();
  });

  it("correctly rejects string with bypass 2", () => {
    const unsafe_text = "something''; SELECT * FROM information_schema.tables;";
    expect(validateString(unsafe_text)).rejects.toThrow();
  });

  it("correctly rejects string with bypass 3", () => {
    const unsafe_text = "algolikethat; TRUNCATE TABLE customers;";
    expect(validateString(unsafe_text)).rejects.toThrow();
  });

  it("correctly accept input with the correct digits", () => {
    const safe_text = "123Meu te123xto 123";
    expect(validateString(safe_text)).resolves.toEqual(safe_text);
  });
});

describe("validateDate", () => {
  it("correctly rejects empty input", () => {
    expect(validateDate()).rejects.toThrow();
  });

  it("correctly rejects string with bypass", () => {
    const unsafe_text = "123 @";
    expect(validateDate(unsafe_text)).rejects.toThrow();
  });

  it("correctly rejects string with bypass 1", () => {
    const unsafe_text = "123 ''";
    expect(validateDate(unsafe_text)).rejects.toThrow();
  });

  it("correctly rejects string with bypass 2", () => {
    const unsafe_text = "1234; SELECT * FROM information_schema.tables;";
    expect(validateDate(unsafe_text)).rejects.toThrow();
  });

  it("correctly rejects string with bypass 3", () => {
    const unsafe_text = "31145; TRUNCATE TABLE customers;";
    expect(validateDate(unsafe_text)).rejects.toThrow();
  });

  it("correctly accept input with the correct digits", () => {
    const safe_text = "1714258375601";
    expect(validateDate(safe_text)).resolves.toEqual(
      new Date(parseInt(safe_text))
    );
  });
});
