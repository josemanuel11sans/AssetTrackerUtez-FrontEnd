import React from 'react';
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import { FaBuilding, FaLayerGroup, FaCogs, FaClipboardList } from 'react-icons/fa'; // Cambié Building2 a FaBuilding
import { useTheme } from '@mui/material/styles';

const Estadisticas = () => {
  const theme = useTheme();

  const stats = [
    { title: "Edificios", value: 4, icon: <FaBuilding size={24} />, color: theme.palette.primary.main },
    { title: "Espacios", value: 50, icon: <FaLayerGroup size={24} />, color: theme.palette.secondary.main },
    { title: "Recursos", value: 120, icon: <FaCogs size={24} />, color: theme.palette.success.main },
    { title: "Inventarios", value: 8, icon: <FaClipboardList size={24} />, color: theme.palette.warning.main },
  ];

  return (
    <Grid container spacing={3}>
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
    </Grid>
  );
};

export default Estadisticas;
