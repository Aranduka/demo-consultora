import { NextRequest } from "next/server";
import { ZodType } from "zod";
import { guard, handle, ok } from "./api";
import { prisma } from "./prisma";

type Ctx = { params: Promise<{ id: string }> };

/** Handlers CRUD genéricos para entidades simples del admin. */
export function crud(model: string, schema: ZodType<any>, opts: { orderBy?: any; include?: any } = {}) {
  const delegate = () => (prisma as any)[model];
  return {
    list: () =>
      handle(async () => {
        await guard("ADMIN");
        return ok(await delegate().findMany({ orderBy: opts.orderBy, include: opts.include }));
      }),
    create: (req: NextRequest) =>
      handle(async () => {
        await guard("ADMIN");
        const data = schema.parse(await req.json());
        return ok(await delegate().create({ data, include: opts.include }), 201);
      }),
    update: (req: NextRequest, { params }: Ctx) =>
      handle(async () => {
        await guard("ADMIN");
        const { id } = await params;
        const data = schema.parse(await req.json());
        return ok(await delegate().update({ where: { id: Number(id) }, data, include: opts.include }));
      }),
    remove: (_req: NextRequest, { params }: Ctx) =>
      handle(async () => {
        await guard("ADMIN");
        const { id } = await params;
        await delegate().delete({ where: { id: Number(id) } });
        return ok({ id: Number(id) });
      }),
  };
}
