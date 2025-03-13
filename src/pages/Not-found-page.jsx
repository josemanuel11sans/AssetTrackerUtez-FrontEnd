

import { Box, Button, Container, Paper, Typography } from "@mui/material"
import { MessageSquareDashedIcon as SentimentDissatisfied } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 2,
            maxWidth: "100%",
          }}
        >
          <SentimentDissatisfied size={80} className="mx-auto mb-4 text-primary" />

          <Typography
            variant="h1"
            component="h1"
            sx={{ fontSize: { xs: "4rem", sm: "6rem" }, fontWeight: "bold", mb: 2 }}
          >
            404
          </Typography>

          <Typography variant="h4" component="h2" gutterBottom>
            Página no encontrada
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/home")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Volver al inicio
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

