import { Grid, Paper, Box, Button } from "@mui/material"
import { Plus, Search } from "lucide-react" // Importa los íconos adecuados

const HeaderDashboard = () => {
  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}
      >
        <samp
          style={{
            fontSize: "50px",
            fontWeight: "extrabold",
            letterSpacing: "10px",
            color: "#133e87",
          }}
        >
          ASSETTRACKER UTEZ
        </samp>

        {/* <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            sx={{
              backgroundColor: "#133e87",
              borderRadius: "20px",
              color: "#fff",
              padding: "8px 20px",
              "&:hover": {
                backgroundColor: "#0d2c61",
              },
            }}
          >
            Nuevo Inventario
          </Button>
          <Button
            variant="outlined"
            startIcon={<Search size={18} />}
            sx={{
              borderColor: "#133e87",
              borderRadius: "20px",
              color: "#133e87",
              padding: "8px 20px",
              "&:hover": {
                backgroundColor: "#f0f4fa",
                borderColor: "#0d2c61",
              },
            }}
          >
            Buscar
          </Button>
        </Box> */}
      </Paper>
    </Grid>
  )
}

export default HeaderDashboard

