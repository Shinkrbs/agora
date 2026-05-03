import crypto from "crypto";

const ENCRYPTION_KEY = process.env.VOTER_SESSION_KEY || "default-key-do-not-use-in-production";

function getKey(): Buffer {
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

export function encryptVoterId(voterId: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(voterId, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptVoterId(encryptedData: string): string | null {
  try {
    const key = getKey();
    const [ivHex, encrypted] = encryptedData.split(":");

    if (!ivHex || !encrypted) return null;

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Error decrypting voter ID:", error);
    return null;
  }
}
