import {
  exchangeNpssoForCode,
  exchangeCodeForAccessToken,
} from "psn-api";
import { prisma } from "./prisma";

export async function getPsnAccessToken(): Promise<string> {
  // Try DB first, then env var
  const setting = await prisma.setting.findUnique({ where: { key: "npsso" } });
  const npsso = setting?.value ?? process.env.NPSSO ?? "";
  if (!npsso) throw new Error("NPSSO token not configured");

  const code = await exchangeNpssoForCode(npsso);
  const { accessToken } = await exchangeCodeForAccessToken(code);
  return accessToken;
}
