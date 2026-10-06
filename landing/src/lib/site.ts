export const SITE = {
  nombre: "Consultora Contable",
  descripcion: "Servicios contables, impuestos y asesoría para empresas y profesionales. Agende el retiro de sus documentos desde su celular.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:13002",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:13000",
  telefono: "+595 21 000 000",
  email: "contacto@consultora.demo",
  direccion: "Asunción, Paraguay",
};
export const LOGIN_URL = `${SITE.appUrl}/cliente/login`;
