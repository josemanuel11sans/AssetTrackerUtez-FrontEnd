import React, { useState } from 'react';
import { Grid, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FaChartBar, FaExpand } from 'react-icons/fa';  // Importa los íconos FaChartBar y FaExpand
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';

const Grafico = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };

  const buildingChartData = [
    { name: "Edificio A", espacios: 15 },
    { name: "Edificio B", espacios: 10 },
    { name: "Edificio C", espacios: 20 },
    { name: "Edificio D", espacios: 5 },
    { name: "Edificio E", espacios: 12 },
    { name: "Edificio E", espacios: 11 },
    { name: "Edificio E", espacios: 110 },
    { name: "Edificio E", espacios: 19 },
    { name: "Edificio E", espacios: 30 },
    { name: "Edificio E", espacios: 12 },
  ];

  return (
    <>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom display="flex" alignItems="center" color='#133e87'>
            <FaChartBar size={20} style={{ marginRight: "8px" }} /> {/* Ícono de barras */}
            Espacios por Edificio

            {/* Ícono de pantalla completa a la derecha */}
            <FaExpand 
              size={20} 
              style={{ marginLeft: 'auto', cursor: 'pointer' }} 
              onClick={handleToggleModal} 
            />
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
      </Grid>

      {/* Modal de Pantalla Completa */}
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
          <Button onClick={handleToggleModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Grafico;
