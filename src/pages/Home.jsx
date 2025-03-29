"use client"

import React, { useState,useEffect } from "react"
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material"
import { Building2, LayoutGrid, Package, ClipboardList, Plus, Edit, Trash2 } from "lucide-react"
// Eliminar la importación de Sidebar
import Grafico from "../components/dashboard/Grafico"
import Pastel from "../components/dashboard/Pastel"
import HeaderDashboard from "../components/dashboard/HeaderDashboard"


// Importar las funciones que cuentan los registros
import { contarEdificios } from '../api/edificios';
import { contarEspacios } from '../api/espacios';
import { contarRecursos } from '../api/recursos';
import { contarInventarios } from '../api/inventarios';

// Datos de ejemplo para el dashboard
const buildingsData = [
  { id: 1, nombre: "Edificio A", pisos: 3, numEspacios: 15, estado: "true" },
  { id: 2, nombre: "Edificio B", pisos: 2, numEspacios: 10, estado: "Activo" },
  { id: 3, nombre: "Edificio C", pisos: 4, numEspacios: 20, estado: "Inactivo" },
  { id: 4, nombre: "Edificio D", pisos: 1, numEspacios: 5, estado: "Activo" },
  
]

const spacesData = [
  { id: 1, nombre: "Aula 101", planta: 1, edificio: "Edificio A", categoria: "Aula", estado: "Activo" },
  { id: 2, nombre: "Laboratorio 201", planta: 2, edificio: "Edificio A", categoria: "Laboratorio", estado: "Activo" },
  { id: 3, nombre: "Oficina 301", planta: 3, edificio: "Edificio B", categoria: "Oficina", estado: "Inactivo" },
  { id: 4, nombre: "Auditorio", planta: 1, edificio: "Edificio C", categoria: "Auditorio", estado: "Activo" },
]

const resourcesData = [
  {
    id: 1,
    codigo: "PC001",
    descripcion: "Computadora de escritorio",
    marca: "Dell",
    modelo: "Optiplex 7090",
    serie: "DL7090123",
    edificio: "Edificio A",
    categoria: "Equipo de cómputo",
    responsable: "Juan Pérez",
    estado: "Activo",
  },
  {
    id: 2,
    codigo: "PRY002",
    descripcion: "Proyector",
    marca: "Epson",
    modelo: "PowerLite 118",
    serie: "EP118456",
    edificio: "Edificio B",
    categoria: "Equipo audiovisual",
    responsable: "María López",
    estado: "Activo",
  },
  {
    id: 3,
    codigo: "IMP003",
    descripcion: "Impresora láser",
    marca: "HP",
    modelo: "LaserJet Pro",
    serie: "HP789012",
    edificio: "Edificio A",
    categoria: "Equipo de oficina",
    responsable: "Carlos Ruiz",
    estado: "Inactivo",
  },
]

const inventoryData = [
  { id: 1, fecha: "2023-05-15", edificio: "Edificio A", espacio: "Aula 101", numRecursos: 12, estado: "Completado" },
  {
    id: 2,
    fecha: "2023-06-20",
    edificio: "Edificio B",
    espacio: "Laboratorio 201",
    numRecursos: 8,
    estado: "En proceso",
  },
  { id: 3, fecha: "2023-07-10", edificio: "Edificio C", espacio: "Oficina 301", numRecursos: 5, estado: "Completado" },
]

const Home = () => {
  const [tabValue, setTabValue] = useState(0)
  const theme = useTheme()

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

   // Estado para cada estadística
    const [edificios, setEdificios] = useState(0);
    const [espacios, setEspacios] = useState(0);
    const [recursos, setRecursos] = useState(0);
    const [inventarios, setInventarios] = useState(0);

   useEffect(() => {
      const fetchData = async () => {
        try {
          const [edificiosRes, espaciosRes, recursosRes, inventariosRes] = await Promise.all([
            contarEdificios(),
            contarEspacios(),
            contarRecursos(),
            contarInventarios(),
          ]);
  
          setEdificios(edificiosRes.data);
          setEspacios(espaciosRes.data);
          setRecursos(recursosRes.data);
          setInventarios(inventariosRes.data);
        } catch (error) {
          console.error('Error al obtener las estadísticas:', error);
        }
      };
  
      fetchData();
    }, []);



  // Estadísticas generales
  const stats = [
    { title: "Edificios", value: edificios, icon: <Building2 size={24} />, color: theme.palette.primary.main },
    { title: "Espacios", value: espacios, icon: <LayoutGrid size={24} />, color: theme.palette.secondary.main },
    { title: "Recursos", value: recursos, icon: <Package size={24} />, color: theme.palette.success.main },
    { title: "Inventarios", value: inventarios, icon: <ClipboardList size={24} />, color: theme.palette.warning.main },
  ]

  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      <Grid container spacing={0}>
        {/* Encabezado */}
        <HeaderDashboard />

        {/* Tarjetas de estadísticas */}
        <Grid container spacing={0}>
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
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={0}>
          <Grid item xs={12} md={8}>
            <Grafico />
          </Grid>
          <Grid item xs={12} md={4}>
            <Pastel />
          </Grid>
        </Grid>

        {/* Pestañas para diferentes módulos */}
        <Grid item xs={12} sx={{ mt: 0 }}>
          <Paper sx={{ width: "100%", borderRadius: 0, boxShadow: "none", border: "1px solid #e0e0e0" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab icon={<Building2 size={16} />} iconPosition="start" label="Edificios" />
              <Tab icon={<LayoutGrid size={16} />} iconPosition="start" label="Espacios" />
              <Tab icon={<Package size={16} />} iconPosition="start" label="Recursos" />
              <Tab icon={<ClipboardList size={16} />} iconPosition="start" label="Inventarios" />
            </Tabs>

            {/* Contenido de la pestaña Edificios */}
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">Lista de Edificios</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Plus size={16} />}
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
                    Nuevo Edificio
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Pisos</TableCell>
                        <TableCell>Espacios</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {buildingsData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.nombre}</TableCell>
                          <TableCell>{row.pisos}</TableCell>
                          <TableCell>{row.numEspacios}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.estado}
                              color={row.estado === "Activo" ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <Edit size={16} />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Contenido de la pestaña Espacios */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">Lista de Espacios</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Plus size={16} />}
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
                    Nuevo Espacio
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Planta/Piso</TableCell>
                        <TableCell>Edificio</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {spacesData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.nombre}</TableCell>
                          <TableCell>{row.planta}</TableCell>
                          <TableCell>{row.edificio}</TableCell>
                          <TableCell>{row.categoria}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.estado}
                              color={row.estado === "Activo" ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <Edit size={16} />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Contenido de la pestaña Recursos */}
            {tabValue === 2 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">Lista de Recursos</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Plus size={16} />}
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
                    Nuevo Recurso
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Marca/Modelo</TableCell>
                        <TableCell>Edificio</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell>Responsable</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resourcesData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.codigo}</TableCell>
                          <TableCell>{row.descripcion}</TableCell>
                          <TableCell>{`${row.marca} ${row.modelo}`}</TableCell>
                          <TableCell>{row.edificio}</TableCell>
                          <TableCell>{row.categoria}</TableCell>
                          <TableCell>{row.responsable}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.estado}
                              color={row.estado === "Activo" ? "success" : "default"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <Edit size={16} />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Contenido de la pestaña Inventarios */}
            {tabValue === 3 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">Lista de Inventarios</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Plus size={16} />}
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
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Edificio</TableCell>
                        <TableCell>Espacio</TableCell>
                        <TableCell>Recursos</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inventoryData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.fecha}</TableCell>
                          <TableCell>{row.edificio}</TableCell>
                          <TableCell>{row.espacio}</TableCell>
                          <TableCell>{row.numRecursos}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.estado}
                              color={row.estado === "Completado" ? "success" : "warning"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <Edit size={16} />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Trash2 size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Home

