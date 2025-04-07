"use client"

import React, { useState, useEffect } from "react"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material"
import { Building2, LayoutGrid, Package, ClipboardList } from "lucide-react"
import Grafico from "../components/dashboard/Grafico"
import Pastel from "../components/dashboard/Pastel"
import HeaderDashboard from "../components/dashboard/HeaderDashboard"

// Importar las funciones que cuentan los registros
import { contarEdificios } from "../api/edificios"
import { contarEspacios } from "../api/espacios"
import { contarRecursos } from "../api/recursos"
import { contarInventarios } from "../api/inventarios"

const Home = () => {
  const theme = useTheme()

  // Estado para cada estadística
  const [edificiosCount, setEdificiosCount] = useState(0)
  const [espaciosCount, setEspaciosCount] = useState(0)
  const [recursosCount, setRecursosCount] = useState(0)
  const [inventariosCount, setInventariosCount] = useState(0)
   
    
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [edificiosRes, espaciosRes, recursosRes, inventariosRes] = await Promise.all([
          contarEdificios(),
          contarEspacios(),
          contarRecursos(),
          contarInventarios(),
        ])
      console.log(espaciosRes);
      
        setEdificiosCount(edificiosRes.data)
        setEspaciosCount(espaciosRes)
        setRecursosCount(recursosRes.data)
        setInventariosCount(inventariosRes.data)
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error)
      }
    }

    fetchData()
  }, [])

  // Estadísticas generales
  const stats = [
    { title: "Edificios", value: edificiosCount, icon: <Building2 size={24} />, color: theme.palette.primary.main },
    { title: "Espacios", value: espaciosCount, icon: <LayoutGrid size={24} />, color: theme.palette.secondary.main },
    { title: "Recursos", value: recursosCount, icon: <Package size={24} />, color: theme.palette.success.main },
    { title: "Inventarios", value: inventariosCount, icon: <ClipboardList size={24} />, color: theme.palette.warning.main },
  ]

  return (
    <Box sx={{ flexGrow: 1, p: 0, minHeight: "100vh" }}> {/* Ajuste para ocupar toda la altura */}
      <Grid container spacing={0} sx={{ p: 1, bgcolor: theme.palette.background.default, minHeight: "100vh", borderRadius: 0, boxShadow: "none", border: "none", }}>
        {/* Sidebar */}
        {/* Encabezado */}
        <HeaderDashboard />

        {/* Tarjetas de estadísticas */}
        <Grid container spacing={1} sx={{ p: 1 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #ddd",
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: `${stat.color}20`,
                      p: 2,
                      borderRadius: "50%",
                    }}
                  >
                    {React.cloneElement(stat.icon, { color: stat.color })}
                  </Box>
                  <Box>
                    <Typography variant="h6" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* <Grid container spacing={1} sx={{ p:1,borderRadius:5 }} >
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ m: 0, height: "100%", borderRadius: 0, boxShadow: "none", border: "1px solid #e0e0e0" }}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: `${stat.color}15`,
                      p: 1.5,
                      borderRadius: "50%",
                    }}
                  >
                    {React.cloneElement(stat.icon, { color: stat.color })}
                  </Box>
                  <Box>
                    <Typography variant="h5" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid> */}

        {/* Gráficos */}
        <Grid container spacing={1} sx={{ p:1 }}  >
          <Grid item xs={12} md={8}>
            <Grafico />
          </Grid>
          <Grid item xs={12} md={4}>
            <Pastel />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home

