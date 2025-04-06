import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getEspaciosEdificiosid, saveEspacio, updateEspacio, changeStatusEspacio } from "../api/espacios";
import { getEdificios } from "../api/edificios";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { Navigate, useNavigate } from "react-router-dom";

const Espacios = () => {
  // Estados para la tabla y búsqueda
  const [edificio, setEdificio] = useState(null);
  const [filteredEspacios, setFilteredEspacios] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  // Estados para el modal de imagen
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Estados para el modal de agregar espacio
  const [openAddModal, setOpenAddModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [numeroPlanta, setNumeroPlanta] = useState("");
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el modal de edición de espacio
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editNombre, setEditNombre] = useState("");
  const [editNumeroPlanta, setEditNumeroPlanta] = useState("");
  const [editEspacio, setEditEspacio] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Obtener edificio y sus espacios
  useEffect(() => {
    const fetchEdificio = async () => {
      try {
        const response = await getEdificios();
        const edificioData = response.data.result.find((e) => e.id === parseInt(id));
        setEdificio(edificioData);
      } catch (error) {
        console.error("Error al obtener el edificio:", error);
      }
    };

    fetchEdificio();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchEspacios = async () => {
      try {
        const response = await getEspaciosEdificiosid(id);
        setFilteredEspacios(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los datos del edificio");
      }
    };

    fetchEspacios();
    const interval = setInterval(fetchEspacios, 5000);

    return () => clearInterval(interval);
  }, [id]);

  // Filtrar espacios
  useEffect(() => {
    if (!edificio || !Array.isArray(edificio.espacios)) return;

    let filtered = edificio.espacios.filter((espacio) =>
      espacio.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (espacio) => espacio.status === (statusFilter === "active")
      );
    }

    setFilteredEspacios(filtered);
  }, [searchQuery, statusFilter, edificio]);

  const handleClickOpen = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

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

  // Manejar modal de agregar espacio
  const handleAddSpace = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    resetForm();
  };

  // Resetear formulario
  const resetForm = () => {
    setNombre("");
    setNumeroPlanta("");
    setFile(null);
    setPreviewImage("");
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  // Enviar formulario para crear o actualizar un espacio
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editEspacio) {
        // Actualizar espacio existente
        await updateEspacio(editEspacio.id, nombre, numeroPlanta, file, id);
        toast.success("Espacio actualizado correctamente");
      } else {
        // Crear nuevo espacio
        await saveEspacio(nombre, numeroPlanta, file, id);
        toast.success("Espacio creado correctamente");
      }
      setOpenAddModal(false);
      resetForm();
    } catch (error) {
      toast.error("Error al guardar el espacio");
      console.error("Error al guardar el espacio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Estados para el modal de confirmación de cambio de status
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedEspacio, setSelectedEspacio] = useState(null);

  // Función para abrir el modal de confirmación
  const handleOpenStatusModal = (espacio) => {
    setSelectedEspacio(espacio);
    setOpenStatusModal(true);
  };

  // Función para cerrar el modal de confirmación
  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedEspacio(null);
  };

  // Cambiar estado del espacio
  const handleChangeStatus = async () => {
    try {
      if (!selectedEspacio) return;

      await changeStatusEspacio(selectedEspacio.id);
      toast.success("Estado del espacio actualizado correctamente");

      setFilteredEspacios((prev) =>
        prev.map((esp) =>
          esp.id === selectedEspacio.id ? { ...esp, status: !esp.status } : esp
        )
      );

      setEdificio((prev) => ({
        ...prev,
        espacios: Array.isArray(prev.espacios)
          ? prev.espacios.map((esp) =>
              esp.id === selectedEspacio.id ? { ...esp, status: !esp.status } : esp
            )
          : [],
      }));

      handleCloseStatusModal();
    } catch (error) {
      console.error("Error al cambiar el estado del espacio:", error);
      toast.error("Error al cambiar el estado del espacio");
      handleCloseStatusModal();
    }
  };

  // Función para abrir el modal de edición
  const handleOpenEditModal = (espacio) => {
    setEditEspacio(espacio);
    setEditNombre(espacio.nombre);
    setEditNumeroPlanta(espacio.numeroPlanta);
    setPreviewImage(espacio.urlImagen || ""); // Muestra la imagen actual como vista previa
    setOpenEditModal(true);
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditNombre("");
    setEditNumeroPlanta("");
    setEditEspacio(null);
  };

  // Función para manejar la edición del espacio
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateEspacio(editEspacio.id, editNombre, editNumeroPlanta, file, id);
      toast.success("Espacio actualizado correctamente");

      setFilteredEspacios((prev) =>
        prev.map((esp) =>
          esp.id === editEspacio.id
            ? { ...esp, nombre: editNombre, numeroPlanta: editNumeroPlanta, urlImagen: previewImage }
            : esp
        )
      );

      handleCloseEditModal();
    } catch (error) {
      console.error("Error al editar el espacio:", error);
      toast.error("Error al editar el espacio");
    } finally {
      setIsLoading(false);
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
            placeholder="Buscar espacios..."
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
          Espacios en {edificio?.nombre || "Cargando..."}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSpace}
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
          Agregar Espacio
        </Button>
      </div>

      {/* Tabla de espacios */}
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
                  "Planta",
                  "Imagen",
                  "Status",
                  "Fecha de creación",
                  "Editar",
                  "Inventarios",
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
              {Array.isArray(filteredEspacios) &&
                filteredEspacios
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((espacio) => (
                    <TableRow
                      key={espacio.id}
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        transition: "background-color 0.3s",
                      }}
                    >
                      <TableCell sx={{ textAlign: "center" }}>{espacio.id}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{espacio.nombre}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{espacio.numeroPlanta}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {espacio.urlImagen && (
                          <img
                            src={espacio.urlImagen}
                            alt={espacio.nombre}
                            width="40"
                            style={{ borderRadius: "5px", cursor: "pointer" }}
                            onClick={() => handleClickOpen(espacio.urlImagen)}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Chip
                          label={espacio.status ? "Activo" : "Inactivo"}
                          color={espacio.status ? "success" : "default"}
                          size="small"
                          onClick={() => handleOpenStatusModal(espacio)}
                          style={{ cursor: "pointer" }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {new Date(espacio.fechaCreacion).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <IconButton
                          sx={{
                            backgroundColor: "#133E87",
                            color: "white",
                            borderRadius: "50%",
                            padding: "6px",
                          }}
                          onClick={() => handleOpenEditModal(espacio)}
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
                          onClick={() =>
                            navigate(`/gestion-inventarios/espacios/${id}/inventarios/${espacio.id}`)
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
            count={filteredEspacios.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Modal para ver imagen */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            Imagen del espacio
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

        {/* Modal para agregar nuevo espacio */}
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
              Agregar Nuevo Espacio
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
                  Nombre del espacio *
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
                  Número de planta *
                </label>
                <input
                  required
                  value={numeroPlanta}
                  onChange={(e) => setNumeroPlanta(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "2px solid #ced4da",
                    fontSize: "1rem",
                    transition: "all 0.3s",
                  }}
                  type="number"
                  min={1}
                  max={edificio?.numeroPisos || 10}
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
                    <CloudUploadIcon
                      sx={{
                        color: "#133e87",
                        fontSize: "2.5rem",
                        mb: 2,
                      }}
                    />
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
                {isLoading ? "Guardando..." : "Guardar Espacio"}
              </button>
            </Box>
          </Box>
        </Dialog>

        {/* Modal para editar espacio */}
        <Dialog
          open={openEditModal}
          onClose={handleCloseEditModal}
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
              Editar Espacio
            </Typography>

            <IconButton
              onClick={handleCloseEditModal}
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
            <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 1 }}>
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
                  Nombre del espacio *
                </label>
                <input
                  required
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
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
                  Número de planta *
                </label>
                <input
                  required
                  value={editNumeroPlanta}
                  onChange={(e) => setEditNumeroPlanta(e.target.value)}
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

              <Box sx={{ mb: 3 }}>
                <input
                  accept="image/*"
                  id="edit-file-input"
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="edit-file-input">
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
                    <CloudUploadIcon
                      sx={{
                        color: "#133e87",
                        fontSize: "2.5rem",
                        mb: 2,
                      }}
                    />
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
                {isLoading ? "Guardando..." : "Guardar Cambios"}
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
                ¿Estás seguro que deseas cambiar el estado del espacio
                <span style={{ fontWeight: 600, color: "#2b2d42" }}>
                  {" "}
                  "{selectedEspacio?.nombre}"
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

export default Espacios;