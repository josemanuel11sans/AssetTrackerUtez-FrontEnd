import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getEdificios, chageStatus, crearEdificio } from "../api/edificios";
// import { crearCategoriaRecursos } from "../api/caregoriasRecursos";
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
  TextField,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import LinkIcon from "@mui/icons-material/Link";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { Navigate, useNavigate } from "react-router-dom";

const GestionInventarios = () => {
  // Estados para la tabla y búsqueda
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  // Estados para el modal de imagen
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Estados para el modal de agregar categoría
  const [openAddModal, setOpenAddModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [numeroPisos, setNumeroPisos] = useState("");
  // const [file, setFile] = useState(null);
  // const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //para la nevegacion hacia espaccios
  const navigate = useNavigate();

  // Estados para notificaciones
  // const [showtoas, setShowtoas] = useState(false);

  // Obtener edificios
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getEdificios();
        const newData = response.data.result;
        // Verificar si las categorías han cambiado
        if (JSON.stringify(newData) !== JSON.stringify(categorias)) {
          setCategorias(newData);
          setFilteredCategorias(newData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // if (!showtoas) {
        //   // toast.error("Error al cargar las categorias.");
        //   // setShowtoas(true);
        // }
      }
    };

    fetchCategorias();
    const interval = setInterval(fetchCategorias, 5000);

    return () => clearInterval(interval);
  }, [categorias]);

  // Filtrar categorías
  useEffect(() => {
    let filtered = categorias.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (categoria) => categoria.status === (statusFilter === "active")
      );
    }

    setFilteredCategorias(filtered);
  }, [searchQuery, statusFilter, categorias]);

  const handleClose = () => {
    setOpen(false);
    setSelectedImage("");
  };

  // Manejar paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar modal de agregar categoría
  const handleAddCategory = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    resetForm();
  };

  // Resetear formulario
  const resetForm = () => {
    setNombre("");
    setNumeroPisos("");
  };

  // Manejar selección de archivo
  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //     setPreviewImage(URL.createObjectURL(selectedFile));
  //   }
  // };

  // Enviar formulario
  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      var response = await crearEdificio(nombre, numeroPisos);
      console.log("Respuesta de la API:", response);

      if (response.type === "ERROR") {
        toast.error(response.text);
      } else if (response.type === "SUCCESS") {
        toast.success(response.text);
      } else if (response.type === "WARNING") {
        toast.warning(response.text);
      }

      setOpenAddModal(false);
      setNombre("");
      // setMaterial("");
      // setFile(null);
      // setPreviewImage("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear categoría");
      console.error("Error al crear categoría:", error);
      // Handle the error and display the appropriate toast for the error
    } finally {
      setIsLoading(false);
    }
  };

  // Estados para el modal de confirmación de cambio de status
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  // Función para abrir el modal de confirmación
  const handleOpenStatusModal = (categoria) => {
    setSelectedCategoria(categoria);
    setOpenStatusModal(true);
  };

  // Función para cerrar el modal de confirmación
  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedCategoria(null);
  };

  // Función para cambiar el estado
  const handleChangeStatus = async () => {
    try {
      if (!selectedCategoria) return;

      const response = await chageStatus(selectedCategoria.id);

      if (response.type === "SUCCESS") {
        toast.success(response.text);
        // Actualizar el estado local
        setCategorias(
          categorias.map((cat) =>
            cat.id === selectedCategoria.id
              ? { ...cat, status: !cat.status }
              : cat
          )
        );
      } else {
        toast.error(response.text || "Error al cambiar el estado");
      }

      handleCloseStatusModal();
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      toast.error(
        error.response?.data?.message || "Error al cambiar el estado"
      );
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
          Inventarios / Edificios
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
          Agregar Edificios
        </Button>
      </div>

      {/* Tabla de edificios  */}
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
              <TableRow
                sx={{
                  backgroundColor: "#133e87",
                  zIndex: 1,
                }}
              >
                {[
                  "#",
                  "Nombre",
                  "Num de pisos",
                  "Fecha de creacio",
                  "Status",
                  "Editar",
                  "Espacios",
                ].map((header) => (
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
              {filteredCategorias
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((categoria) => (
                  <TableRow
                    key={categoria.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.3s",
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {categoria.id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {categoria.nombre}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {categoria.numeroPisos}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {new Date(categoria.fechaCreacion).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={categoria.status ? "Activo" : "No activo"}
                        color={categoria.status ? "success" : "default"}
                        size="small"
                        onClick={() => handleOpenStatusModal(categoria)}
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
                        }}
                        onClick={() => navigate(`/gestion-inventarios/espacios/${categoria.id}`)}
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
            count={filteredCategorias.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Modal para ver imagen */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            Imagen de la categoría
            <IconButton
              aria-label="close"
              onClick={handleClose}
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

        {/* Modal para agregar/editar edificio */}
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
              {selectedCategoria ? "Editar Edificio" : "Agregar Nuevo Edificio"}
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
                  type="number"
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
                {isLoading ? "Guardando..." : "Guardar Edificio"}
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
                ¿Estás seguro que deseas cambiar el estado del edificio
                <span style={{ fontWeight: 600, color: "#2b2d42" }}>
                  {" "}
                  "{selectedCategoria?.nombre}"
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
      </div>

      {/* Contenedor de Toast */}
      <ToastContainer />
    </>
  );
};

export default GestionInventarios;
