import crypto from "crypto";

export function generateVoterCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const rawLength = 8;
  let code = "";

  const randomBytes = crypto.randomBytes(rawLength);

  for (let i = 0; i < rawLength; i++) {
    code += alphabet[randomBytes[i] % alphabet.length];
  }

  return `${code.slice(0, 4)}-${code.slice(4)}`;
}