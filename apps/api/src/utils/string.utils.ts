import crypto from "crypto"

export async function randomString(length:number = 10) {
  return crypto.randomBytes(length).toString('hex');
}