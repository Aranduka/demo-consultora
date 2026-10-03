import { AppBar, Box, Button, Card, CardContent, Chip, Container, Stack, Toolbar, Typography } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import VerifiedIcon from "@mui/icons-material/Verified";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import catalogo from "@/data/servicios.json";
import { LOGIN_URL, SITE } from "@/lib/site";

const gs = (n: number) => `Gs. ${n.toLocaleString("es-PY")}`;

const pasos = [
  { icon: <PhoneIphoneIcon fontSize="large" />, titulo: "Ingrese a la app", texto: "Acceda con el usuario que le entregamos al darle de alta como cliente." },
  { icon: <EventAvailableIcon fontSize="large" />, titulo: "Agende la recogida", texto: "Elija el día y la franja horaria que le quede cómoda." },
  { icon: <VerifiedIcon fontSize="large" />, titulo: "Nosotros retiramos", texto: "Un encargado pasa por sus documentos y usted se despreocupa." },
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
    itemListElement: catalogo.flatMap((c) =>
      c.servicios.map((s) => ({ "@type": "Offer", priceCurrency: "PYG", price: s.precio, itemOffered: { "@type": "Service", name: s.nombre, description: s.descripcion } })),
    ),
  },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar sx={{ maxWidth: 1100, width: "100%", mx: "auto" }}>
          <CalculateIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }} component="p">{SITE.nombre}</Typography>
          <Button href="#servicios" color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" } }}>Servicios</Button>
          <Button href={LOGIN_URL} variant="contained">Ingresar</Button>
        </Toolbar>
      </AppBar>

      <Box component="header" sx={{ color: "#fff", py: { xs: 8, md: 12 }, backgroundImage: "linear-gradient(150deg,#002171,#0D47A1 55%,#1976D2)" }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight={500} sx={{ fontSize: { xs: "2.2rem", md: "3.4rem" } }}>
            Su contabilidad en orden, sin moverse de su oficina
          </Typography>
          <Typography variant="h6" component="p" sx={{ mt: 2, opacity: 0.9, fontWeight: 300 }}>
            Contabilidad, impuestos y asesoría para empresas y profesionales. Agende desde su celular y retiramos sus documentos.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} gap={2} mt={4}>
            <Button href={LOGIN_URL} size="large" variant="contained" sx={{ bgcolor: "#fff", color: "primary.main", "&:hover": { bgcolor: "#E8EEF8" } }}>Ingresar a la app de clientes</Button>
            <Button href="#servicios" size="large" variant="outlined" sx={{ color: "#fff", borderColor: "#fff" }}>Ver servicios y precios</Button>
          </Stack>
        </Container>
      </Box>

      <Container component="main" maxWidth="lg">
        <Box component="section" id="servicios" sx={{ py: 8 }}>
          <Typography variant="h4" component="h2" fontWeight={500} color="primary" textAlign="center">Servicios y precios</Typography>
          <Typography color="text.secondary" textAlign="center" mb={5}>Precios referenciales. Consulte por paquetes a medida.</Typography>
          {catalogo.map((c) => (
            <Box key={c.categoria} mb={4}>
              <Typography variant="h5" component="h3" fontWeight={500} mb={2}>{c.categoria}</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 2 }}>
                {c.servicios.map((s) => (
                  <Card key={s.nombre} variant="outlined">
                    <CardContent>
                      <Typography variant="h6" component="h4" fontSize="1.05rem">{s.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>{s.descripcion}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                        <Typography variant="h6" color="primary" fontWeight={600}>{gs(s.precio)}</Typography>
                        <Chip size="small" label={s.periodicidad} />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      <Box sx={{ bgcolor: "#E8EEF8", py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" fontWeight={500} color="primary" textAlign="center" mb={5}>Así de simple</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 3 }}>
            {pasos.map((p, i) => (
              <Stack key={p.titulo} alignItems="center" textAlign="center" spacing={1}>
                <Box sx={{ color: "primary.main" }}>{p.icon}</Box>
                <Typography variant="h6" component="h3">{i + 1}. {p.titulo}</Typography>
                <Typography color="text.secondary">{p.texto}</Typography>
              </Stack>
            ))}
          </Box>
          <Box textAlign="center" mt={5}><Button href={LOGIN_URL} variant="contained" size="large">Ingresar</Button></Box>
        </Container>
      </Box>

      <Box component="footer" id="contacto" sx={{ bgcolor: "primary.dark", color: "#fff", py: 5 }}>
        <Container maxWidth="md">
          <Typography variant="h6" component="h2">{SITE.nombre}</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} gap={{ xs: 1, sm: 4 }} mt={1.5} sx={{ opacity: 0.9 }}>
            <Stack direction="row" gap={1}><PlaceIcon fontSize="small" />{SITE.direccion}</Stack>
            <Stack direction="row" gap={1}><PhoneIcon fontSize="small" />{SITE.telefono}</Stack>
            <Stack direction="row" gap={1}><EmailIcon fontSize="small" />{SITE.email}</Stack>
          </Stack>
          <Typography variant="caption" display="block" mt={3} sx={{ opacity: 0.7 }}>© {new Date().getFullYear()} {SITE.nombre}. Todos los derechos reservados.</Typography>
        </Container>
      </Box>
    </>
  );
}
