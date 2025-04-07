import React, { useEffect, useState } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { getEdificios, updateInventario, changeStatusEdificio } from "../api/edificios";
import { saveInventario } from "../api/inventarios";

const GestionInventarios = () => {
  const navigate = useNavigate();
  const [edificios, setEdificios] = useState([]);
  const [filteredEdificios, setFilteredEdificios] = useState([]);
  const [shouldReload, setShouldReload] = useState(true); // Estado para controlar la recarga
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // Cambia el valor inicial a "active"
  const [openAddModal, setOpenAddModal] = useState(false);
  const [currentEdificio, setCurrentEdificio] = useState(null);
  const [nombre, setNombre] = useState("");
  const [numeroPisos, setNumeroPisos] = useState("");
  const [imagen, setImagen] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedEdificio, setSelectedEdificio] = useState(null);

  // Estados para el modal de imagen
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Manejar imagen seleccionada
  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImage("");
  };

  useEffect(() => {
    const fetchEdificios = async () => {
      try {
        const response = await getEdificios();
        const newData = response.data.result;
        setEdificios(newData);
        setFilteredEdificios(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los edificios");
      }
    };

    if (shouldReload) {
      fetchEdificios();
      setShouldReload(false); // Restablece el estado después de recargar
    }
  }, [shouldReload]);

  useEffect(() => {
    let filtered = edificios.filter((edificio) =>
      edificio.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (edificio) => edificio.status === (statusFilter === "active")
      );
    }

    setFilteredEdificios(filtered);
  }, [searchQuery, statusFilter, edificios]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddEdificio = () => {
    setCurrentEdificio(null);
    setNombre("");
    setNumeroPisos("");
    setImagen(null);
    setPreviewImage(null);
    setOpenAddModal(true);
  };

  const handleEditEdificio = (edificio) => {
    setCurrentEdificio(edificio);
    setNombre(edificio.nombre);
    setNumeroPisos(edificio.numeroPisos);
    setImagen(null);
    setPreviewImage(null);
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setCurrentEdificio(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("numeroPisos", numeroPisos);
      if (imagen) {
        formData.append("file", imagen);
      }

      if (currentEdificio) {
        formData.append("id", currentEdificio.id);
        await updateInventario(formData);
        toast.success("Edificio actualizado correctamente");
      } else {
        await saveInventario(formData);
        toast.success("Edificio creado correctamente");
      }
      setOpenAddModal(false);
      setShouldReload(true); // Marca que se debe recargar la tabla
    } catch (error) {
      toast.error("Error al guardar el edificio");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenStatusModal = (edificio) => {
    setSelectedEdificio(edificio);
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedEdificio(null);
  };

  const handleConfirmChangeStatus = async () => {
    try {
      await changeStatusEdificio(selectedEdificio.id);
      toast.success("Estado del edificio actualizado correctamente");
      setShouldReload(true); // Marca que se debe recargar la tabla
    } catch (error) {
      console.error("Error al cambiar el estado del edificio:", error);
      toast.error("Error al cambiar el estado del edificio");
    } finally {
      handleCloseStatusModal();
    }
  };

  return (
    <>
      {/* Barra de búsqueda y filtros */}
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

      {/* Título y botón de agregar */}
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
          Gestión de Edificios
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEdificio}
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
          Agregar Edificio
        </Button>
      </div>

      {/* Tabla de edificios */}
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
              <TableRow sx={{ backgroundColor: "#133e87" }}>
                {["#", "Nombre", "Número de Pisos", "Imagen", "Estado", "Editar","Espacios"].map(
                  (header) => (
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
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEdificios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((edificio, index) => (
                  <TableRow
                    key={edificio.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.3s",
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {edificio.nombre}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {edificio.numeroPisos}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {edificio.urlImagen ? (
                        <img
                          src={edificio.urlImagen}
                          alt={edificio.nombre}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "5px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenImageModal(edificio.urlImagen)}
                        />
                      ) : (
                        "Sin imagen"
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={edificio.status ? "Activo" : "Inactivo"}
                        color={edificio.status ? "success" : "default"} // Verde para activos, gris para inactivos
                        size="small"
                        onClick={() => handleOpenStatusModal(edificio)}
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
                        onClick={() => handleEditEdificio(edificio)}
                      >
                        <EditIcon />
                      </IconButton>
                     
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                        sx={{
                          backgroundColor: "#133E87",
                          color: "white",
                          borderRadius: "50%",
                          padding: "6px",
                          marginLeft: "8px",
                        }}
                        onClick={() => navigate(`/gestion-inventarios/espacios/${edificio.id}`)}
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
            count={filteredEdificios.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>

      {/* Modales para agregar/editar y cambiar estado */}
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
            {currentEdificio ? "Editar Edificio" : "Agregar Edificio"}
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
                Nombre del edificio *
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
                Número de pisos *
              </label>
              <input
                required
                type="number"
                value={numeroPisos}
                onChange={(e) => setNumeroPisos(e.target.value)}
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
              {isLoading ? "Guardando..." : "Guardar Edificio"}
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
              ¿Estás seguro que deseas cambiar el estado del edificio
              <span style={{ fontWeight: 600, color: "#2b2d42" }}>
                {" "}
                "{selectedEdificio?.nombre}"
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

      {/* Modal para ver imagen */}
      <Dialog open={openImageModal} onClose={handleCloseImageModal} maxWidth="md" fullWidth>
        <DialogTitle>
          Imagen del edificio
          <IconButton
            aria-label="close"
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img
            src={selectedImage}
            alt="Imagen seleccionada"
            style={{ width: "100%" }}
          />
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default GestionInventarios;
