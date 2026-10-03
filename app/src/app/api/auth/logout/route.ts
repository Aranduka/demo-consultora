import { cookies } from "next/headers";
import { handle, ok } from "@/lib/api";
import { COOKIE } from "@/lib/session";

export const POST = () =>
  handle(async () => {
    (await cookies()).delete(COOKIE);
    return ok({ ok: true });
  });
