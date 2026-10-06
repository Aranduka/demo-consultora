export const formatMonto = (n: number | string, moneda = "PYG") =>
  moneda === "PYG"
    ? `Gs. ${Math.round(Number(n)).toLocaleString("es-PY")}`
    : `${moneda} ${Number(n).toLocaleString("es-PY", { minimumFractionDigits: 2 })}`;

export const formatFecha = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

const at = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00Z`);
export const diaLargo = (iso: string) => {
  const t = at(iso).toLocaleDateString("es-PY", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
  return t[0].toUpperCase() + t.slice(1);
};
export const diaCorto = (iso: string) => at(iso).toLocaleDateString("es-PY", { weekday: "short", timeZone: "UTC" }).replace(".", "");
export const diaNum = (iso: string) => Number(iso.slice(8, 10));
export const mesCorto = (iso: string) => at(iso).toLocaleDateString("es-PY", { month: "short", timeZone: "UTC" }).replace(".", "");

export const hoyAsu = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Asuncion" }).format(new Date());

export const ESTADOS = {
  PENDIENTE: { label: "Pendiente", color: "warning", bg: "#FEF3C7", fg: "#92400E" },
  CONFIRMADA: { label: "Confirmada", color: "info", bg: "#DBEAFE", fg: "#1E40AF" },
  COMPLETADA: { label: "Completada", color: "success", bg: "#DCFCE7", fg: "#166534" },
  CANCELADA: { label: "Cancelada", color: "default", bg: "#E2E8F0", fg: "#475569" },
} as const;
export type Estado = keyof typeof ESTADOS;
