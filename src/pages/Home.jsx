"use client"

import React, { useState } from "react"
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
import {
  Building2,
  LayoutGrid,
  Package,
  ClipboardList,
  Plus,
  Search,
  Edit,
  Trash2,
  BarChart3,
  PieChart as LucidePieChart,
} from "lucide-react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts"

// Datos de ejemplo para el dashboard
const buildingsData = [
  { id: 1, nombre: "Edificio A", pisos: 3, numEspacios: 15, estado: "Activo" },
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

// Datos para gráficos
const buildingChartData = [
  { name: "Edificio A", espacios: 15 },
  { name: "Edificio B", espacios: 10 },
  { name: "Edificio C", espacios: 20 },
  { name: "Edificio D", espacios: 5 },
]

const resourceTypeData = [
  { name: "Equipo de cómputo", value: 45 },
  { name: "Mobiliario", value: 30 },
  { name: "Equipo audiovisual", value: 15 },
  { name: "Equipo de oficina", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const Home = () => {
  const [tabValue, setTabValue] = useState(0)
  const theme = useTheme()

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Estadísticas generales
  const stats = [
    { title: "Edificios", value: 4, icon: <Building2 size={24} />, color: theme.palette.primary.main },
    { title: "Espacios", value: 50, icon: <LayoutGrid size={24} />, color: theme.palette.secondary.main },
    { title: "Recursos", value: 120, icon: <Package size={24} />, color: theme.palette.success.main },
    { title: "Inventarios", value: 8, icon: <ClipboardList size={24} />, color: theme.palette.warning.main },
  ]

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Encabezado */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" component="h1">
              ASSET TRACKER UTEZ
            </Typography>
            <Box>
              <Button variant="contained" startIcon={<Plus size={18} />} sx={{ mr: 1 }}>
                Nuevo Inventario
              </Button>
              <Button variant="outlined" startIcon={<Search size={18} />}>
                Buscar
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Tarjetas de estadísticas */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
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

        {/* Gráficos */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <BarChart3 size={20} style={{ marginRight: "8px" }} />
              Espacios por Edificio
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={buildingChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="espacios" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <LucidePieChart size={20} style={{ marginRight: "8px" }} />
              Recursos por Categoría
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={resourceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resourceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pestañas para diferentes módulos */}
        <Grid item xs={12}>
          <Paper sx={{ width: "100%" }}>
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
                  <Button variant="contained" size="small" startIcon={<Plus size={16} />}>
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
                  <Button variant="contained" size="small" startIcon={<Plus size={16} />}>
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
                  <Button variant="contained" size="small" startIcon={<Plus size={16} />}>
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
                  <Button variant="contained" size="small" startIcon={<Plus size={16} />}>
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