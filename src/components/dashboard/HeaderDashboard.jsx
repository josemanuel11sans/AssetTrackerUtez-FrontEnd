import React from "react";
import { Grid, Paper, Typography, Box, Button } from "@mui/material";
import { Plus, Search } from "lucide-react"; // Importa los íconos adecuados
import ZenDotsTTF from "../../assets/fonts/ZenDots-Regular.ttf";

// Crea el tema y agrega la fuente

const HeaderDashboard = () => {
  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <samp
          style={{
            fontSize: "3rem",
            fontWeight: "extrabold",
            letterSpacing: "10px",
            color: "#133e87"
          }}
        >
          ASSET TRACKER UTEZ
        </samp>

        <Box>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            sx={{
              mr: 1,
              backgroundColor: "#133e87",
              borderRadius: "20px",
              color: "#fff",
              padding: "8px 20px",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#133e87",
              },
            }}
          >
            Nuevo Inventario
          </Button>
          <Button
            variant="outlined"
            startIcon={<Search size={18} />}
            sx={{
              backgroundColor: "#133e87",
              borderRadius: "20px",
              color: "#fff",
              padding: "8px 20px",
              "&:hover": {
                backgroundColor: "#fff",
                color: "#133e87",
              },
            }}
          >
            Buscar
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default HeaderDashboard;
