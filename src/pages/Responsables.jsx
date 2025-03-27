import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
  IconButton,
  Typography,
  Button, // Importa el componente Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Ícono de lupa
import EditIcon from "@mui/icons-material/Edit"; // Ícono de lápiz
import AddIcon from "@mui/icons-material/Add"; // Ícono de más
import { getResponsables } from "../api/responsablesApi";

const Responsables = () => {
  const [responsables, setResponsables] = useState([]);
  const [filteredResponsables, setFilteredResponsables] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const i = 1;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getResponsables();
        const newData = response.data.result;
        console.log(newData)
        // Solo actualiza si los datos han cambiado
        if (JSON.stringify(newData) !== JSON.stringify(responsables)) {
          setResponsables(newData);
          setFilteredResponsables(newData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategorias();
    const interval = setInterval(fetchCategorias, 50000);

    return () => clearInterval(interval);
  }, [responsables]);

  useEffect(() => {
    let filtered = responsables.filter((responsable) =>
      responsable.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (responsable) => responsable.estado === (statusFilter === "active")
      );
    }

    setFilteredResponsables(filtered);
  }, [searchQuery, statusFilter, responsables]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCategory = () => {
    // Aquí puedes manejar la lógica para agregar una nueva categoría.
    console.log("Agregar nuevo responsable");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          marginBottom: "10px",
          alignItems: "center",
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 1,
          padding: "10px 20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        {/* Buscador con icono de lupa */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            border: "1px solid #ccc",
            padding: "5px 10px",
            marginRight: "20px", // Agregado un margen a la derecha para separar el buscador y el selector
          }}
        >
          <SearchIcon style={{ marginRight: "5px" }} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "200px",
              padding: "5px",
            }}
          />
        </div>

        {/* Selector de estado sin MUI */}
        <div
          style={{
            borderRadius: "20px",
            border: "1px solid #ccc",
            padding: "5px 10px",
          }}
        >
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              fontSize: "14px",
              padding: "5px",
              borderRadius: "10px",
            }}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>
      {/* Título con el botón "Agregar categoría" */}
      <div style={{ marginBottom: "10px", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" align="left" color="#133e87" fontFamily={'sans-serif'} fontSize={30}>
          Responsables
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCategory}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#133E87",
            color: "white",
            borderRadius: "20px",
            padding: "8px 20px",
          }}
        >
          <AddIcon sx={{ marginRight: "8px" }} />
          Agregar responsable
        </Button>
      </div>
    <div style={{ maxWidth: "1350px", margin: "auto", textAlign: "center", padding: "0 20px" }}>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          overflowX: "auto",
          width: "100%",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#133e87", // Color de fondo de los encabezados
                zIndex: 1,
              }}
            >
              {["#", "Nombre", "División Académica", "Estado", "Acciones"].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "12px 16px",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResponsables
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((responsable, index) => (
                <TableRow
                  key={responsable.id }
                  sx={{
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    transition: "background-color 0.3s",
                  }}
                >
                  <TableCell sx={{ textAlign: "center" }}>{responsable.id}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{responsable.nombre}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{responsable.divisionAcademica}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: responsable.estado ? "green" : "red",
                        display: "inline-block",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                      sx={{
                        backgroundColor: "#133E87",
                        color: "white",
                        borderRadius: "50%",
                        padding: "6px",
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      
         <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredResponsables.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>
    </div>

    </>
  );
};

export default Responsables;
