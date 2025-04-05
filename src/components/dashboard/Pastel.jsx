"use client"

import { useState } from "react"
import { Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { FaChartPie, FaExpand } from "react-icons/fa"
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const resourceTypeData = [
  { name: "Equipo de cómputo", value: 45 },
  { name: "Mobiliario", value: 30 },
  { name: "Equipo audiovisual", value: 15 },
  { name: "Equipo de oficina", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#133e87", "#8884d8"]

const Pastel = () => {
  const [openModal, setOpenModal] = useState(false)

  const handleToggleModal = () => {
    setOpenModal(!openModal)
  }

  return (
    <Paper sx={{ p: 3, minHeight: "100vh", borderRadius: 0, boxShadow: "none", border: "1px solid #e0e0e0" }}>
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
          Recursos por Categoría
        </div>
        <FaExpand size={20} style={{ cursor: "pointer" }} onClick={handleToggleModal} />
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <RePieChart>
          <Pie
            data={resourceTypeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={150}
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
  )
}

export default Pastel

