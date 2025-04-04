"use client"

import { useState, useEffect } from "react"
import { Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { FaChartBar, FaExpand } from "react-icons/fa"
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts"
import { getEdificios } from "../../api/edificios" // Ajusta la ruta según tu proyecto

const Grafico = () => {
  const [openModal, setOpenModal] = useState(false)
  const [buildingChartData, setBuildingChartData] = useState([])

  const handleToggleModal = () => {
    setOpenModal(!openModal)
  }

  // 🔁 Cargar datos cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEdificios()
        const edificios = response.data.result
  
        // Mapear los datos al formato que espera el gráfico
        const chartData = edificios.map((e) => ({
          name: e.nombre,
          espacios: e.numeroPisos // o cualquier otro dato que quieras mostrar
        }))
  
        setBuildingChartData(chartData)
      } catch (error) {
        console.error("Error al obtener los edificios:", error)
      }
    }
  
    fetchData()
  }, [])
  

  return (
    <>
      <Paper sx={{ p: 3, height: "100%", borderRadius: 0, boxShadow: "none", border: "1px solid #e0e0e0" }}>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center" color="#133e87">
          <FaChartBar size={20} style={{ marginRight: "8px" }} />
          Edificios
          <FaExpand size={20} style={{ marginLeft: "auto", cursor: "pointer" }} onClick={handleToggleModal} />
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={buildingChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="espacios" fill="#133e87" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Dialog
        open={openModal}
        onClose={handleToggleModal}
        fullScreen
        maxWidth="false"
        sx={{ "& .MuiDialog-paper": { height: "100%", width: "100%" } }}
      >
        <DialogTitle>Espacios por Edificio</DialogTitle>
        <DialogContent sx={{ padding: 0, height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={buildingChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="espacios" fill="#133e87" />
            </BarChart>
          </ResponsiveContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleModal} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Grafico
