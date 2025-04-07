"use client"

import { useState, useEffect } from "react"
import { Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { FaChartPie, FaExpand } from "react-icons/fa"
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { getUsuarios } from "../../api/usuariosApi"

const COLORS = ["#0088FE", "#FF8042"]

const Pastel = () => {
  const [openModal, setOpenModal] = useState(false)
  const [userData, setUserData] = useState([])

  const handleToggleModal = () => {
    setOpenModal(!openModal)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsuarios()
        const usuarios = response.data.result

        const adminCount = usuarios.filter(user => user.rol === "ROLE_ADMIN_ACCESS").length
        const inspectorCount = usuarios.filter(user => user.rol === "ROLE_INSPECTOR_ACCESS").length

        setUserData([
          { name: "Administradores", value: adminCount },
          { name: "Inspectores", value: inspectorCount },
        ])
      } catch (error) {
        console.error("Error al obtener los datos del gráfico:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Paper
        sx={{
          p: 3,
          height: "100%",
          borderRadius: 0,
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          color="#133e87"
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaChartPie size={20} style={{ marginRight: "8px" }} />
            Usuarios por Rol
          </div>
          <FaExpand size={20} style={{ cursor: "pointer" }} onClick={handleToggleModal} />
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <RePieChart>
            <Pie
              data={userData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {userData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </RePieChart>
        </ResponsiveContainer>
      </Paper>

      <Dialog
        open={openModal}
        onClose={handleToggleModal}
        fullScreen
        maxWidth="false"
        sx={{ "& .MuiDialog-paper": { height: "100%", width: "100%" } }}
      >
        <DialogTitle>Usuarios por Rol</DialogTitle>
        <DialogContent sx={{ padding: 0, height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={userData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Pastel

