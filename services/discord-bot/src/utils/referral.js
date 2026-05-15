import crypto from "node:crypto";
import { config } from "../config.js";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const TOKEN_LENGTH = 16;

export function generateReferralToken() {
  const bytes = crypto.randomBytes(TOKEN_LENGTH);
  let token = "";
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return token;
}

export function buildReferralLink(token) {
  const url = new URL(config.baseUrl);
  url.pathname = "/resume-builder";
  url.searchParams.set("ref", token);
  return url.toString();
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
