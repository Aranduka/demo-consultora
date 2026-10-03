import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";

export const claveTemporal = () => `Cl-${randomBytes(4).toString("hex")}`;

export const clienteInclude = { usuario: { select: { email: true, activo: true } } } satisfies Prisma.ClienteInclude;

type ClienteConUsuario = Prisma.ClienteGetPayload<{ include: typeof clienteInclude }>;
export const aplanarCliente = ({ usuario, ...c }: ClienteConUsuario) => ({ ...c, email: usuario.email, activo: usuario.activo });
