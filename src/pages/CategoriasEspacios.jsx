import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getCategoriasEspacios, chageStatus, saveCategoriaEspacio, updateCategoriaEspacio } from "../api/categoriasEspacios";
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
import CloseIcon from "@mui/icons-material/Close";

const CategoriasEspacios = () => {
  // Estados para la tabla y búsqueda
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // Cambia el valor inicial a "active"
  const [shouldReload, setShouldReload] = useState(true); // Estado para controlar la recarga

  // Estados para el modal de agregar/editar categoría
  const [openModal, setOpenModal] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el modal de confirmación de cambio de estado
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  // Efectos
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await getCategoriasEspacios();
        const newData = response.data.result;
        setCategorias(newData);
        setFilteredCategorias(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar las categorías");
      }
    };

    if (shouldReload || categorias.length === 0) { // Carga inicial o cuando se requiere recargar
      fetchCategorias();
      setShouldReload(false); // Restablece el estado después de recargar
    }
  }, [shouldReload, categorias.length]);

  useEffect(() => {
    let filtered = categorias.filter((categoria) =>
      categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (categoria) => categoria.estado === (statusFilter === "active")
      );
    }

    setFilteredCategorias(filtered);
  }, [searchQuery, statusFilter, categorias]);

  // Manejadores de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejadores del modal de categoría
  const handleOpenModal = (categoria = null) => {
    setCurrentCategoria(categoria);
    if (categoria) {
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion);
    } else {
      setNombre("");
      setDescripcion("");
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentCategoria(null);
  };

  // Manejadores del modal de estado
  const handleOpenStatusModal = (categoria) => {
    setSelectedCategoria(categoria);
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedCategoria(null);
  };

  const handleChangeStatus = async () => {
    try {
      if (!selectedCategoria) return;

      const response = await chageStatus(selectedCategoria.id);

      if (response.type === "SUCCESS") {
        toast.success(response.text);
        setShouldReload(true); // Marca que se debe recargar la tabla
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

  // Manejador del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (currentCategoria) {
        // Actualizar categoría existente
        await updateCategoriaEspacio(currentCategoria.id, nombre, descripcion);
        toast.success("Categoría actualizada correctamente");
      } else {
        // Guardar nueva categoría
        await saveCategoriaEspacio(nombre, descripcion);
        toast.success("Categoría creada correctamente");
      }
      setShouldReload(true); // Marca que se debe recargar la tabla
      handleCloseModal();
    } catch (error) {
      toast.error("Error al guardar la categoría");
      console.error("Error:", error);
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
          Categorías de espacios
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
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
                {["#", "Nombre", "Descripción", "Estado", "Acciones"].map((header) => (
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
                      {categoria.descripcion}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={categoria.estado ? "Activo" : "Inactivo"}
                        color={categoria.estado ? "success" : "default"}
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
                          marginRight: "5px",
                        }}
                        onClick={() => handleOpenModal(categoria)}
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

        {/* Modal para agregar/editar categoría */}
        <Dialog
  open={openModal}
  onClose={handleCloseModal}
  PaperProps={{
    sx: {
      borderRadius: '16px',
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
      width: '90%',
      maxWidth: '800px',
      minWidth: '600px'
    }
  }}
>
  <Box sx={{
    position: 'relative',
    bgcolor: '#f8f9fa',
    p: 3,
    borderBottom: '2px solid #e9ecef'
  }}>
    <Typography variant="h5" sx={{ 
      fontWeight: 600,
      color: '#2b2d42',
      textAlign: 'center',
      fontSize: '1.8rem'
    }}>
      {currentCategoria ? "Editar Categoría" : "Agregar Nueva Categoría"}
    </Typography>
    
    <IconButton
      onClick={handleCloseModal}
      sx={{
        position: 'absolute',
        right: 16,
        top: 16,
        color: '#133e87',
        '&:hover': {
          bgcolor: '#dee2e6'
        }
      }}
    >
      <CloseIcon sx={{ fontSize: '1.8rem' }} />
    </IconButton>
  </Box>

  <Box sx={{ p: 3 }}>
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Box sx={{ mb: 3 }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          color: '#133e87',
          fontWeight: 500,
          fontSize: '1.1rem'
        }}>Nombre de la categoría *</label>
        <input
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: '2px solid #ced4da',
            fontSize: '1rem',
            transition: 'all 0.3s'
          }}
          sx={{
            '&:focus': {
              outline: 'none',
              borderColor: '#133e87',
              boxShadow: '0 0 0 3px rgba(157, 78, 221, 0.1)'
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          color: '#133e87',
          fontWeight: 500,
          fontSize: '1.1rem'
        }}>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: '2px solid #ced4da',
            fontSize: '1rem',
            minHeight: '120px',
            resize: 'vertical',
            transition: 'all 0.3s'
          }}
          sx={{
            '&:focus': {
              outline: 'none',
              borderColor: '#9d4edd',
              boxShadow: '0 0 0 3px rgba(157, 78, 221, 0.1)'
            }
          }}
        />
      </Box>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: isLoading ? '#133e87' : '#133e87',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1.1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        sx={{
          '&:hover:not(:disabled)': {
            backgroundColor: '#133e87',
            transform: 'translateY(-1px)'
          }
        }}
      >
        {isLoading ? (
          <span>Cargando...</span>
        ) : currentCategoria ? (
          "Actualizar Categoría"
        ) : (
          "Guardar Nueva Categoría"
        )}
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
                ¿Estás seguro que deseas cambiar el estado de la categoría
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

export default CategoriasEspacios;