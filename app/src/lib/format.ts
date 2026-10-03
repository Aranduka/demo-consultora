export const formatMonto = (n: number | string, moneda = "PYG") =>
  moneda === "PYG"
    ? `Gs. ${Math.round(Number(n)).toLocaleString("es-PY")}`
    : `${moneda} ${Number(n).toLocaleString("es-PY", { minimumFractionDigits: 2 })}`;

export const formatFecha = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

export const diaLargo = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString("es-PY", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

export const ESTADOS = {
  PENDIENTE: { label: "Pendiente", color: "warning" },
  CONFIRMADA: { label: "Confirmada", color: "info" },
  COMPLETADA: { label: "Completada", color: "success" },
  CANCELADA: { label: "Cancelada", color: "default" },
} as const;
