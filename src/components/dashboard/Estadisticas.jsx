import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import { FaBuilding, FaLayerGroup, FaCogs, FaClipboardList } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

// Importar las funciones que cuentan los registros
import { contarEdificios } from '../../api/edificios';
import { contarEspacios } from '../../api/espacios';
import { contarRecursos } from '../../api/recursos';
import { contarInventarios } from '../../api/inventarios';

const Estadisticas = () => {
  const theme = useTheme();

  // Estado para cada estadística
  const [edificios, setEdificios] = useState(0);
  const [espacios, setEspacios] = useState(0);
  const [recursos, setRecursos] = useState(0);
  const [inventarios, setInventarios] = useState(0);
  console.log(espacios, edificios, recursos, inventarios);
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
        setEspacios(espaciosRes);
        setRecursos(recursosRes.data);
        setInventarios(inventariosRes.data);
      } catch (error) {
        console.error('Error al obtener las estadísticas:', error);
      }
    };

    fetchData();
  }, []);

  console.log(contarEspacios());
  
  const stats = [
    { title: 'Edificios', value: edificios, icon: <FaBuilding size={24} />, color: theme.palette.primary.main },
    { title: 'Espacios', value: contarEspacios(), icon: <FaLayerGroup size={24} />, color: theme.palette.secondary.main },
    { title: 'Recursos', value: recursos, icon: <FaCogs size={24} />, color: theme.palette.success.main },
    { title: 'Inventarios', value: inventarios, icon: <FaClipboardList size={24} />, color: theme.palette.warning.main },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${stat.color}15`,
                  p: 1.5,
                  borderRadius: '50%',
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
  );
};

export default Estadisticas;
