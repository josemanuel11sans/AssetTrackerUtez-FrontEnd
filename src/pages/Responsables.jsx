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
  Chip,
  TablePagination,
  IconButton,
  Typography,
  Button,
  Dialog,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { getResponsables, saveResponsable, changeStatusResponsable } from "../api/responsablesApi";
// import { toast } from "react-toastify";

const Responsables = () => {
  const [responsables, setResponsables] = useState([]);
  const [filteredResponsables, setFilteredResponsables] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [currentResponsable, setCurrentResponsable] = useState(null);
  const [selectedResponsable, setSelectedResponsable] = useState(null);
  const [nombre, setNombre] = useState("");
  const [divisionAcademica, setDivisionAcademica] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getResponsables();
        const newData = response.data.result;
        console.log(newData);
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

  const handleAddResponsable = () => {
    setCurrentResponsable(null);
    setNombre("");
    setDivisionAcademica("");
    setOpenAddModal(true);
  };

  const handleEditResponsable = (responsable) => {
    setCurrentResponsable(responsable);
    setNombre(responsable.nombre);
    setDivisionAcademica(responsable.divisionAcademica);
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setCurrentResponsable(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        id: currentResponsable?.id, // Asegúrate de incluir el ID si existe
        nombre,
        divisionAcademica,
      };

      await saveResponsable(payload);

      if (currentResponsable) {
        toast.success("Responsable actualizado correctamente");
      } else {
        toast.success("Responsable creado correctamente");
      }

      // Recargar la tabla
      const response = await getResponsables();
      setResponsables(response.data.result);
      setFilteredResponsables(response.data.result);

      setOpenAddModal(false);
    } catch (error) {
      toast.error("Error al guardar el responsable");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStatusModal = (responsable) => {
    setSelectedResponsable(responsable);
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedResponsable(null);
  };

  const handleConfirmChangeStatus = async () => {
    try {
      await changeStatusResponsable(selectedResponsable.id);
      toast.success("Estado del responsable actualizado correctamente");
      setResponsables(
        responsables.map((r) =>
          r.id === selectedResponsable.id ? { ...r, estado: !r.estado } : r
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado del responsable:", error);
      toast.error("Error al cambiar el estado del responsable");
    } finally {
      handleCloseStatusModal();
    }
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            border: "1px solid #ccc",
            padding: "5px 10px",
            marginRight: "20px",
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
      <div style={{ marginBottom: "10px", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" align="left" color="#133e87" fontFamily={'sans-serif'} fontSize={30}>
          Responsables
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddResponsable}
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
                  backgroundColor: "#133e87",
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
                    key={responsable.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.3s",
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {page * rowsPerPage + index + 1} {/* Número secuencial */}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{responsable.nombre}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{responsable.divisionAcademica}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={responsable.estado ? "Activo" : "No activo"}
                        color={responsable.estado ? "success" : "default"}
                        size="small"
                        onClick={() => handleOpenStatusModal(responsable)}
                        style={{ cursor: "pointer" }}
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
                        onClick={() => handleEditResponsable(responsable)}
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

      <Dialog
        open={openAddModal}
        onClose={handleCloseAddModal}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            width: "90%",
            maxWidth: "800px",
            minWidth: "600px",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: "#f8f9fa",
            p: 3,
            borderBottom: "2px solid #e9ecef",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#2b2d42",
              textAlign: "center",
              fontSize: "1.8rem",
            }}
          >
            {currentResponsable ? "Editar Responsable" : "Agregar Responsable"}
          </Typography>

          <IconButton
            onClick={handleCloseAddModal}
            sx={{
              position: "absolute",
              right: 24,
              top: 24,
              color: "#133e87",
              "&:hover": {
                bgcolor: "#dee2e6",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "1.8rem" }} />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{ mb: 3 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#133e87",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                }}
              >
                Nombre *
              </label>
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "2px solid #ced4da",
                  fontSize: "1rem",
                  transition: "all 0.3s",
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#133e87",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                }}
              >
                División Académica *
              </label>
              <input
                required
                value={divisionAcademica}
                onChange={(e) => setDivisionAcademica(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "2px solid #ced4da",
                  fontSize: "1rem",
                  transition: "all 0.3s",
                }}
              />
            </Box>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: isLoading ? "#133e87" : "#133e87",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              {isLoading ? "Guardando..." : "Guardar Responsable"}
            </button>
          </Box>
        </Box>
      </Dialog>

      <Dialog
        open={openStatusModal}
        onClose={handleCloseStatusModal}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            width: "90%",
            maxWidth: "500px",
            minWidth: "400px",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: "#f8f9fa",
            p: 3,
            borderBottom: "2px solid #e9ecef",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#2b2d42",
              textAlign: "center",
              fontSize: "1.6rem",
            }}
          >
            Confirmar cambio de estado
          </Typography>

          <IconButton
            onClick={handleCloseStatusModal}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "#133e87",
              "&:hover": {
                bgcolor: "#dee2e6",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body1"
              sx={{
                color: "#495057",
                fontSize: "1.1rem",
                lineHeight: 1.5,
                textAlign: "center",
              }}
            >
                ¿Estás seguro que deseas cambiar el estado del responsable
                <span style={{ fontWeight: 600, color: "#2b2d42" }}>
                    {" "}
                    "{selectedResponsable?.nombre}"
                </span>
                ?
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              mt: 3,
            }}
          >
            <Button
              onClick={handleCloseStatusModal}
              sx={{
                px: 3,
                py: 1,
                border: "1px solid #ced4da",
                borderRadius: "8px",
                color: "#6c757d",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#133e87",
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmChangeStatus}
              sx={{
                px: 3,
                py: 1,
                bgcolor: "#133e87",
                color: "white",
                borderRadius: "8px",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#133e87",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s",
              }}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default Responsables;
