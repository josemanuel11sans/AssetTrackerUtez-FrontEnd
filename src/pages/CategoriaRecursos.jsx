import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getCategoriasRecursos, crearCategoriaRecursos } from '../api/caregoriasRecursos';
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
  TextField,
  CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

const CategoriaRecursos = () => {
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
  const [material, setMaterial] = useState("");
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados para notificaciones
  const [showtoas, setShowtoas] = useState(false);

  // Obtener categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getCategoriasRecursos();
        const newData = response.data.result;

        // Verificar si las categorías han cambiado
        if (JSON.stringify(newData) !== JSON.stringify(categorias)) {
          setCategorias(newData);
          setFilteredCategorias(newData);

          // Mostrar toast de nuevos datos si las categorías han cambiado
          if (!showtoas) {
            toast.success("Nuevos datos cargados");
            setShowtoas(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!showtoas) {
          toast.error("Error al cargar las categorias.");
          setShowtoas(true);
        }
      }
    };

    fetchCategorias();
    const interval = setInterval(fetchCategorias, 5000);

    return () => clearInterval(interval);
  }, [categorias, showtoas]);

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

  // Manejar imagen seleccionada
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
    setMaterial("");
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

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      await crearCategoriaRecursos(nombre, material, file);
      toast.success("Categoría creada exitosamente");
      handleCloseAddModal();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      toast.error(error.response?.data?.message || "Error al crear categoría");
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
      <div style={{ marginBottom: "10px", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" align="left" color="#133e87" fontFamily={'sans-serif'} fontSize={30}>
          Categorías de recursos
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
          Agregar categoría
        </Button>
      </div>

      {/* Tabla de categorías */}
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
                {["ID", "Nombre", "Material", "Imagen", "Status", "Acciones"].map((header) => (
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
                    <TableCell sx={{ textAlign: "center" }}>{categoria.id}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{categoria.nombre}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{categoria.material}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <img
                        src={categoria.imagenUrl}
                        alt={categoria.nombre}
                        width="40"
                        style={{ borderRadius: "5px", cursor: "pointer" }}
                        onClick={() => handleClickOpen(categoria.imagenUrl)}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          backgroundColor: categoria.status ? "green" : "red",
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
                position: 'absolute',
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

        {/* Modal para agregar nueva categoría */}
        <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
          <DialogTitle>
            Agregar Nueva Categoría
            <IconButton
              aria-label="close"
              onClick={handleCloseAddModal}
              sx={{
                position: 'absolute',
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
                label="Nombre de la categoría"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoFocus
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="material"
                label="Material"
                name="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
              
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
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
                    style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
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
      </div>

      {/* Contenedor de Toast */}
      <ToastContainer />
    </>
  );
};

export default CategoriaRecursos;
