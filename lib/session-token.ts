import crypto from "crypto";
import { Participant, Attempt } from "@/types/game";

const SECRET = process.env.SESSION_SECRET || "mech-mania-2026-serverless-secret-key-v1";

export interface SessionPayload {
  participant: Participant;
  attempt: Attempt;
  timestamp: number;
}

export function createSessionToken(participant: Participant, attempt: Attempt): string {
  const payload: SessionPayload = {
    participant,
    attempt,
    timestamp: Date.now(),
  };

  const payloadString = JSON.stringify(payload);
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payloadString);
  const signature = hmac.digest("hex");

  const combined = JSON.stringify({ p: payloadString, s: signature });
  return Buffer.from(combined).toString("base64");
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.p || !parsed.s) return null;

    const hmac = crypto.createHmac("sha256", SECRET);
    hmac.update(parsed.p);
    const expectedSignature = hmac.digest("hex");

    if (crypto.timingSafeEqual(Buffer.from(parsed.s), Buffer.from(expectedSignature))) {
      return JSON.parse(parsed.p) as SessionPayload;
    }
  } catch (e) {
    console.error("Session token verification failed:", e);
  }
  return null;
}

export function decodeSessionToken(token: string): SessionPayload | null {
  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.p) {
      return JSON.parse(parsed.p) as SessionPayload;
    }
  } catch (e) {
    // Ignore error
  }
  return null;
}

