import { Box, Button, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SpeedIcon from "@mui/icons-material/Speed";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import Brand from "@/components/Brand";
import catalogo from "@/data/servicios.json";
import { LOGIN_URL, SITE } from "@/lib/site";

const gs = (n: number) => `Gs. ${n.toLocaleString("es-PY")}`;
const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");

const pasos = [
  { icon: <PhoneIphoneIcon />, titulo: "Ingrese a la app", texto: "Acceda con el usuario que le entregamos al darle de alta como cliente." },
  { icon: <EventAvailableIcon />, titulo: "Agende en segundos", texto: "Elija el día y la franja horaria que le quede cómoda." },
  { icon: <LocalShippingOutlinedIcon />, titulo: "Nosotros retiramos", texto: "Un encargado pasa por sus documentos. Usted se despreocupa." },
];
const ventajas = [
  { icon: <SpeedIcon />, t: "Ahorre tiempo", d: "Sin traslados ni filas: retiramos los documentos donde esté." },
  { icon: <ShieldOutlinedIcon />, t: "Información segura", d: "Acceso con usuario propio y datos tratados con confidencialidad." },
  { icon: <SupportAgentIcon />, t: "Atención cercana", d: "Un equipo contable que conoce su caso y le responde rápido." },
];
const faqs = [
  { q: "¿Cómo obtengo mi usuario para la app?", a: "Lo crea la consultora al darle de alta como cliente. Le entregamos una contraseña temporal que cambia en su primer ingreso." },
  { q: "¿Qué documentos puedo entregar?", a: "Facturas, extractos, comprobantes y cualquier documentación contable. Puede detallarlo al agendar." },
  { q: "¿Los precios son finales?", a: "Son referenciales. Según la complejidad de cada caso le confirmamos el valor exacto antes de comenzar." },
  { q: "¿Puedo cancelar o cambiar una visita?", a: "Sí, desde la sección Mis visitas de la app, mientras esté pendiente o confirmada." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: SITE.nombre,
  description: SITE.descripcion,
  url: SITE.url,
  telephone: SITE.telefono,
  email: SITE.email,
  address: { "@type": "PostalAddress", addressLocality: "Asunción", addressCountry: "PY" },
  areaServed: "PY",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios contables",
    itemListElement: catalogo.flatMap((c) => c.servicios.map((s) => ({ "@type": "Offer", priceCurrency: "PYG", price: s.precio, itemOffered: { "@type": "Service", name: s.nombre, description: s.descripcion } }))),
  },
  mainEntity: { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
};

const Titulo = ({ k, t, s }: { k: string; t: string; s?: string }) => (
  <Box textAlign="center" mb={6} maxWidth={620} mx="auto">
    <Typography variant="overline" color="primary" fontWeight={800} letterSpacing=".12em">{k}</Typography>
    <Typography variant="h3" component="h2" fontWeight={800} letterSpacing="-0.03em" sx={{ fontSize: { xs: "1.9rem", md: "2.5rem" } }}>{t}</Typography>
    {s && <Typography color="text.secondary" mt={1.5} fontSize="1.05rem">{s}</Typography>}
  </Box>
);

function Telefono() {
  return (
    <Box aria-hidden sx={{ width: 270, height: 520, borderRadius: "36px", p: 1.25, bgcolor: "#0B1B3A", boxShadow: "0 40px 80px rgba(2,6,23,.45)", transform: { md: "rotate(4deg)" }, mx: "auto" }}>
      <Box sx={{ height: "100%", borderRadius: "28px", bgcolor: "#F4F7FB", color: "#0F172A", overflow: "hidden", position: "relative" }}>
        <Box sx={{ m: 1.5, p: 2, borderRadius: "16px", color: "#fff", background: "linear-gradient(145deg,#0D47A1,#1976D2)" }}>
          <Typography variant="overline" sx={{ opacity: 0.85 }}>Próximo retiro</Typography>
          <Typography fontWeight={800} fontSize="1.1rem">Lunes 12 de octubre</Typography>
          <Typography sx={{ opacity: 0.9 }} fontSize=".9rem">09:00 – 11:00</Typography>
          <Chip size="small" label="Confirmada" sx={{ mt: 1, bgcolor: "#DBEAFE", color: "#1E40AF", fontWeight: 700 }} />
        </Box>
        <Stack spacing={1.25} sx={{ px: 1.5 }}>
          {["Elija el día", "Elija la franja", "Confirme"].map((t, i) => (
            <Stack key={t} direction="row" spacing={1.25} alignItems="center" sx={{ p: 1.5, bgcolor: "#fff", borderRadius: "12px", border: "1px solid #E3E8F0" }}>
              <Box sx={{ width: 26, height: 26, borderRadius: "50%", bgcolor: "primary.main", color: "#fff", display: "grid", placeItems: "center", fontSize: ".8rem", fontWeight: 800 }}>{i + 1}</Box>
              <Typography fontWeight={600} fontSize=".9rem">{t}</Typography>
            </Stack>
          ))}
        </Stack>
        <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 56, bgcolor: "#fff", borderTop: "1px solid #E3E8F0" }} />
      </Box>
    </Box>
  );
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Box component="a" href="#contenido" sx={{ position: "absolute", left: -9999, "&:focus": { left: 16, top: 16, zIndex: 100, bgcolor: "#fff", p: 1.5, borderRadius: "8px" } }}>Saltar al contenido</Box>

      <Box component="header" sx={{ position: "sticky", top: 0, zIndex: 50, bgcolor: "rgba(255,255,255,.88)", backdropFilter: "blur(10px)", borderBottom: "1px solid #E3E8F0" }}>
        <Container maxWidth="lg" sx={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Brand />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button href="#servicios" color="inherit" sx={{ display: { xs: "none", md: "inline-flex" } }}>Servicios</Button>
            <Button href="#como-funciona" color="inherit" sx={{ display: { xs: "none", md: "inline-flex" } }}>Cómo funciona</Button>
            <Button href="#faq" color="inherit" sx={{ display: { xs: "none", md: "inline-flex" } }}>Preguntas</Button>
            <Button href={LOGIN_URL} variant="contained">Ingresar</Button>
          </Stack>
        </Container>
      </Box>

      <Box component="main" id="contenido">
        <Box sx={{ color: "#fff", overflow: "hidden", background: "radial-gradient(900px 500px at 85% 10%,#1976D255,transparent),linear-gradient(155deg,#0B1B3A 0%,#0D47A1 70%,#1565C0 100%)" }}>
          <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" }, gap: 6, alignItems: "center" }}>
            <Box>
              <Chip label="Contabilidad · Impuestos · Asesoría" sx={{ bgcolor: "rgba(255,255,255,.14)", color: "#fff", mb: 3, fontWeight: 600 }} />
              <Typography variant="h1" fontWeight={800} letterSpacing="-0.04em" lineHeight={1.05} sx={{ fontSize: { xs: "2.4rem", md: "3.6rem" } }}>
                Su contabilidad en orden, sin moverse de su oficina.
              </Typography>
              <Typography sx={{ mt: 3, opacity: 0.9, maxWidth: 520, fontSize: { xs: "1.05rem", md: "1.2rem" } }}>
                Agende desde su celular y retiramos sus documentos. Nos ocupamos de los números para que usted se ocupe de su negocio.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} gap={2} mt={5}>
                <Button href={LOGIN_URL} size="large" endIcon={<ArrowForwardIcon />} sx={{ bgcolor: "#fff", color: "primary.main", px: 4, "&:hover": { bgcolor: "#E8F0FE" } }}>Ingresar a la app</Button>
                <Button href="#servicios" size="large" sx={{ color: "#fff", border: "1.5px solid rgba(255,255,255,.5)", px: 4, "&:hover": { bgcolor: "rgba(255,255,255,.1)" } }}>Ver servicios y precios</Button>
              </Stack>
              <Stack direction="row" gap={3} mt={5} flexWrap="wrap" sx={{ opacity: 0.9 }}>
                {["Sin traslados", "Estado en tiempo real", "Atención personalizada"].map((t) => (
                  <Stack key={t} direction="row" gap={0.75} alignItems="center"><CheckIcon fontSize="small" sx={{ color: "#93C5FD" }} /><Typography fontSize=".95rem">{t}</Typography></Stack>
                ))}
              </Stack>
            </Box>
            <Box sx={{ display: { xs: "none", md: "block" } }}><Telefono /></Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 3 }}>
            {ventajas.map((v) => (
              <Stack key={v.t} direction="row" spacing={2}>
                <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: "12px", bgcolor: "#E8F0FE", color: "primary.main", display: "grid", placeItems: "center" }}>{v.icon}</Box>
                <Box><Typography fontWeight={700}>{v.t}</Typography><Typography color="text.secondary">{v.d}</Typography></Box>
              </Stack>
            ))}
          </Box>
        </Container>

        <Box id="servicios" sx={{ bgcolor: "#F4F7FB", py: { xs: 8, md: 11 }, scrollMarginTop: 68 }}>
          <Container maxWidth="lg">
            <Titulo k="SERVICIOS" t="Servicios y precios claros" s="Precios referenciales. Consulte por paquetes a medida para su empresa." />
            <Stack direction="row" gap={1} justifyContent="center" flexWrap="wrap" mb={5} component="nav" aria-label="Categorías">
              {catalogo.map((c) => <Chip key={c.categoria} component="a" href={`#${slug(c.categoria)}`} clickable label={c.categoria} sx={{ bgcolor: "#fff", border: "1px solid #E3E8F0", height: 40, px: 1, fontSize: ".95rem" }} />)}
            </Stack>
            {catalogo.map((c) => (
              <Box key={c.categoria} id={slug(c.categoria)} mb={5} sx={{ scrollMarginTop: 90 }}>
                <Typography variant="h5" component="h3" fontWeight={800} mb={2}>{c.categoria}</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 2.5 }}>
                  {c.servicios.map((s) => (
                    <Card key={s.nombre} sx={{ transition: "transform .2s, box-shadow .2s", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 12px 32px rgba(15,23,42,.1)" } }}>
                      <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                        <Typography variant="h6" component="h4" fontSize="1.05rem" fontWeight={700}>{s.nombre}</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1, flex: 1 }}>{s.descripcion}</Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3} pt={2} sx={{ borderTop: "1px solid #E3E8F0" }}>
                          <Typography variant="h6" component="p" color="primary" fontWeight={800}>{gs(s.precio)}</Typography>
                          <Chip size="small" label={s.periodicidad} sx={{ bgcolor: "#E8F0FE", color: "#0A2E6E" }} />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            ))}
          </Container>
        </Box>

        <Container id="como-funciona" maxWidth="lg" sx={{ py: { xs: 8, md: 11 }, scrollMarginTop: 68 }}>
          <Titulo k="CÓMO FUNCIONA" t="Así de simple" s="Tres pasos y sus documentos están en nuestras manos." />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 3 }}>
            {pasos.map((p, i) => (
              <Card key={p.titulo} sx={{ p: 3.5, position: "relative" }}>
                <Typography sx={{ position: "absolute", top: 16, right: 24, fontSize: "3.5rem", fontWeight: 800, color: "#E8F0FE", lineHeight: 1 }} aria-hidden>{i + 1}</Typography>
                <Box sx={{ width: 52, height: 52, borderRadius: "14px", color: "#fff", display: "grid", placeItems: "center", mb: 2.5, background: "linear-gradient(140deg,#1976D2,#0D47A1)" }}>{p.icon}</Box>
                <Typography variant="h6" component="h3" fontWeight={700}>{p.titulo}</Typography>
                <Typography color="text.secondary" mt={1}>{p.texto}</Typography>
              </Card>
            ))}
          </Box>
        </Container>

        <Box id="faq" sx={{ bgcolor: "#F4F7FB", py: { xs: 8, md: 11 }, scrollMarginTop: 68 }}>
          <Container maxWidth="md">
            <Titulo k="PREGUNTAS FRECUENTES" t="Resolvemos sus dudas" />
            <Stack gap={1.5}>
              {faqs.map((f) => (
                <Box key={f.q} component="details" sx={{ bgcolor: "#fff", border: "1px solid #E3E8F0", borderRadius: "16px", px: 3, py: 2, "& summary": { cursor: "pointer", fontWeight: 700, listStyle: "none", display: "flex", justifyContent: "space-between", gap: 2, minHeight: 28 }, "& summary::-webkit-details-marker": { display: "none" }, "& summary::after": { content: '"+"', color: "#0D47A1", fontSize: "1.4rem", lineHeight: 1 }, "&[open] summary::after": { content: '"–"' }, "&:focus-within": { borderColor: "#0D47A1" } }}>
                  <summary>{f.q}</summary>
                  <Typography color="text.secondary" mt={1.5}>{f.a}</Typography>
                </Box>
              ))}
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
          <Box sx={{ borderRadius: "24px", p: { xs: 4, md: 8 }, textAlign: "center", color: "#fff", background: "linear-gradient(155deg,#0B1B3A,#0D47A1)" }}>
            <Typography variant="h3" component="h2" fontWeight={800} letterSpacing="-0.03em" sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}>¿Ya es cliente? Agende su próximo retiro.</Typography>
            <Typography sx={{ opacity: 0.85, mt: 1.5 }}>Ingrese a la app y reserve día y horario en menos de un minuto.</Typography>
            <Button href={LOGIN_URL} size="large" endIcon={<ArrowForwardIcon />} sx={{ mt: 4, bgcolor: "#fff", color: "primary.main", px: 4, "&:hover": { bgcolor: "#E8F0FE" } }}>Ingresar</Button>
          </Box>
        </Container>
      </Box>

      <Box component="footer" id="contacto" sx={{ bgcolor: "#0B1B3A", color: "#fff", py: 6 }}>
        <Container maxWidth="lg">
          <Brand light />
          <Stack direction={{ xs: "column", sm: "row" }} gap={{ xs: 1.5, sm: 5 }} mt={3} sx={{ opacity: 0.9 }}>
            <Stack direction="row" gap={1} alignItems="center"><PlaceIcon fontSize="small" />{SITE.direccion}</Stack>
            <Stack direction="row" gap={1} alignItems="center"><PhoneIcon fontSize="small" />{SITE.telefono}</Stack>
            <Stack direction="row" gap={1} alignItems="center"><EmailIcon fontSize="small" />{SITE.email}</Stack>
          </Stack>
          <Typography variant="caption" display="block" mt={4} sx={{ opacity: 0.6 }}>© {new Date().getFullYear()} {SITE.nombre}. Todos los derechos reservados.</Typography>
        </Container>
      </Box>
    </>
  );
}
