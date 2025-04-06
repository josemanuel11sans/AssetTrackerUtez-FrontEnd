import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  TablePagination,
  IconButton,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getInventariosEspacios, saveInventario, changeStatusInventario } from "../api/inventarios";

const Inventarios = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventarios, setInventarios] = useState([]);
  const [filteredInventarios, setFilteredInventarios] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("all");

  const formatFecha = (fecha) => {
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    return new Date(fecha).toLocaleDateString("es-ES", opciones);
  };

  const fetchInventarios = async () => {
    try {
      const response = await getInventariosEspacios(id);
      const inventariosData = response.data.result;

      // Filtrar inventarios por fecha y estado
      let filtered = inventariosData;

      if (fechaFiltro) {
        filtered = filtered.filter((inventario) => {
          const inventarioFecha = new Date(inventario.fechaCreacion).toISOString().split("T")[0];
          return inventarioFecha === fechaFiltro;
        });
      }

      if (estadoFiltro !== "all") {
        const isActive = estadoFiltro === "active";
        filtered = filtered.filter((inventario) => inventario.status === isActive);
      }

      setInventarios(inventariosData);
      setFilteredInventarios(filtered);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los inventarios");
    }
  };

  useEffect(() => {
    fetchInventarios();
  }, [id, fechaFiltro, estadoFiltro]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddInventario = () => {
    setOpenAddModal(true);
    setFile(null);
    setPreviewImage("");
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      if (file) {
        formData.append("file", file);
      }

      await saveInventario(formData);
      toast.success("Inventario creado correctamente");
      setOpenAddModal(false);
      await fetchInventarios(); // Recargar la tabla tras guardar
    } catch (error) {
      toast.error("Error al crear el inventario");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStatusModal = (inventario) => {
    setSelectedInventario(inventario);
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedInventario(null);
  };

  const handleChangeStatus = async () => {
    try {
      await changeStatusInventario(selectedInventario.id);
      toast.success("Estado del inventario actualizado correctamente");
      await fetchInventarios(); // Recargar la tabla tras cambiar el estado
      handleCloseStatusModal();
    } catch (error) {
      toast.error("Error al cambiar el estado del inventario");
      console.error("Error:", error);
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
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
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
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
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
      <div
        style={{
          marginBottom: "10px",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          align="left"
          color="#133e87"
          fontFamily={"sans-serif"}
          fontSize={30}
        >
          Inventarios
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddInventario}
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
          Agregar inventario
        </Button>
      </div>

      <div
        style={{
          maxWidth: "1350px",
          margin: "auto",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
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
              <TableRow sx={{ backgroundColor: "#133e87", zIndex: 1 }}>
                {["#", "Imagen", "Fecha de Creación", "Estado", "Acciones"].map((header) => (
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
              {filteredInventarios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((inventario, index) => (
                  <TableRow
                    key={inventario.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.3s",
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <img
                        src={inventario.imagenUrl}
                        alt="Inventario"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "5px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {formatFecha(inventario.fechaCreacion)}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={inventario.status ? "Activo" : "Inactivo"}
                        color={inventario.status ? "success" : "default"}
                        size="small"
                        onClick={() => handleOpenStatusModal(inventario)}
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
                        onClick={() =>
                          navigate(`/gestion-inventarios/espacios/${id}/inventarios/${inventario.id}/recursos`)
                        }
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredInventarios.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>

      {/* Modal para agregar inventario */}
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
            Agregar Inventario
          </Typography>

          <IconButton
            onClick={handleCloseAddModal}
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
            <CloseIcon sx={{ fontSize: "1.8rem" }} />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{ mb: 3 }}>
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                name="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="contained-button-file">
                <Box
                  sx={{
                    border: "2px dashed #ced4da",
                    borderRadius: "10px",
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: "#133e87",
                      backgroundColor: "#f8f0ff",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6c757d",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                    }}
                  >
                    Arrastra o haz clic para subir una imagen
                  </Typography>
                </Box>
              </label>
            </Box>

            {previewImage && (
              <Box
                sx={{
                  mb: 3,
                  border: "2px solid #e9ecef",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={previewImage}
                  alt="Vista previa"
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}

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
              {isLoading ? "Guardando..." : "Guardar Inventario"}
            </button>
          </Box>
        </Box>
      </Dialog>

      {/* Modal para confirmar cambio de estado */}
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
              ¿Estás seguro que deseas cambiar el estado del inventario?
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
              onClick={handleChangeStatus}
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

export default Inventarios;
