
import { useParams } from "react-router-dom";;
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
// import {
//   getEdificios,
//   chageStatus,
//   crearEdificio,
//   getEdificiosid,
// } from "../api/edificios";
import {
  getEspaciosEdificiosid
} from "../api/espacios";
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

const Recursos = () => {
  // Estados para la tabla y búsqueda
  const [edificio, setEdificio] = useState({  });
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

  const navigate = useNavigate();
  const { id } = useParams();
  // const [idInventario,setidInventario] = useState(0);
  // setidInventario(id);

  console.log(id+ "id ")
  // Obtener edificio y sus espacios
  useEffect(() => {
    if (!id) return;
    
    const fetchEdificio = async () => {
      try {
        const response = await getEspaciosEdificiosid(id);
        console.log(response)
        setEdificio(response.data.result);
       
        setFilteredEspacios(response.data.result);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los datos del edificio");
      }
    };

    fetchEdificio();
    const interval = setInterval(fetchEdificio, 5000);

    return () => clearInterval(interval);
  }, [id]);

  console.log(edificio.espacio)
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

  // Enviar formulario para crear nuevo espacio
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí deberías llamar a la API para crear un nuevo espacio
      // var response = await crearEspacio(id, nombre, numeroPlanta, file);
      // console.log("Respuesta de la API:", response);

      // Simulando una respuesta exitosa
      const response = {
        type: "SUCCESS",
        text: "Espacio creado correctamente"
      };

      if (response.type === "ERROR") {
        toast.error(response.text);
      } else if (response.type === "SUCCESS") {
        toast.success(response.text);
      } else if (response.type === "WARNING") {
        toast.warning(response.text);
      }

      setOpenAddModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear espacio");
      console.error("Error al crear espacio:", error);
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

  // Función para cambiar el estado
  const handleChangeStatus = async () => {
    try {
      if (!selectedEspacio) return;

      // Aquí deberías llamar a la API para cambiar el estado
      // const response = await changeStatusEspacio(selectedEspacio.id);

      // Simulando una respuesta exitosa
      const response = {
        type: "SUCCESS",
        text: "Estado cambiado correctamente"
      };

      if (response.type === "SUCCESS") {
        toast.success(response.text);
        // Actualizar el estado local
        setEdificio(prev => ({
          ...prev,
          espacios: prev.espacios.map(esp => 
            esp.id === selectedEspacio.id 
              ? { ...esp, status: !esp.status } 
              : esp
          )
        }));
      } else {
        toast.error(response.text || "Error al cambiar el estado");
      }

      handleCloseStatusModal();
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      toast.error(error.response?.data?.message || "Error al cambiar el estado");
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
          {edificio.nombre} - Espacios
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
                  "Inventarios"
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
              {console.log(filteredEspacios)}
              {filteredEspacios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((espacio) => (
                  <TableRow
                    key={espacio.id}

                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.3s",
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {espacio.id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {espacio.nombre}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {espacio.numeroPlanta}
                    </TableCell>
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
                      {new Date(
                        espacio.fechaCreacion
                      ).toLocaleDateString("es-ES", {
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
                          // marginRight: "5px",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      </TableCell>
                      <TableCell sx={{textAlign:"center"}}>
                      <IconButton
                        sx={{
                          backgroundColor: "#133E87",
                          color: "white",
                          borderRadius: "50%",
                          padding: "6px",
                        }}
                        onClick={() => navigate(`/gestion-inventarios/espacios/${id}/inventarios/${espacio.id}`)}
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
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Agregar Nuevo Espacio
            <IconButton
              aria-label="close"
              onClick={handleCloseAddModal}
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
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre del espacio"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoFocus
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="numeroPlanta"
                label="Número de planta"
                name="numeroPlanta"
                value={numeroPlanta}
                onChange={(e) => setNumeroPlanta(e.target.value)}
                type="number"
                inputProps={{
                  min: 1,
                  max: edificio.numeroPisos || 10
                }}
              />

              <input
                accept="image/*"
                style={{ display: "none" }}
                id="contained-button-file"
                type="file"
                name="file"
                onChange={handleFileChange}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 2, mb: 2 }}
                >
                  Subir Imagen
                </Button>
              </label>
              {previewImage && (
                <Box>
                  <img
                    src={previewImage}
                    alt="Vista previa"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Guardar"}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog open={openStatusModal} onClose={handleCloseStatusModal}>
          <DialogTitle>
            Confirmar cambio de estado
            <IconButton
              aria-label="close"
              onClick={handleCloseStatusModal}
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
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>
                ¿Estás seguro que deseas cambiar el estado del espacio "
                {selectedEspacio?.nombre}"?
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  onClick={handleCloseStatusModal}
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleChangeStatus}
                  color="primary"
                  variant="contained"
                >
                  Confirmar
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contenedor de Toast */}
      <ToastContainer />
    </>
  );
};

export default Recursos;