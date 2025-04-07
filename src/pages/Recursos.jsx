import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { jsPDF } from "jspdf";

import { autoTable } from "jspdf-autotable";
import { getRecursosInventarioId } from "../api/recursos";
import { getCategoriasRecursos } from "../api/caregoriasRecursos";
import { getResponsables } from "../api/responsablesApi";
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
import logoUrl from "../assets/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { Navigate, useNavigate } from "react-router-dom";

const Recursos = () => {
  const [edificio, setEdificio] = useState({});
  const [filteredEspacios, setFilteredEspacios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [responsableSeleccionado, setResponsableSeleccionado] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  console.log(id + "id");
  useEffect(() => {
    if (!id) return;

    const fetchRecursos = async () => {
      try {
        const response = await getRecursosInventarioId(id);
        const recursosData = response?.result || []; // Ajustar para recibir datos directamente desde `result`
        setEdificio({ espacios: recursosData }); // Asignar los recursos al estado `espacios`
        setFilteredEspacios(recursosData);
      } catch (error) {
        console.error("Error al obtener los recursos:", error);
        toast.error("Error al cargar los recursos del inventario");
      }
    };

    fetchRecursos();
    const interval = setInterval(fetchRecursos, 5000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        console.log("Iniciando la carga de categorías...");
        const response = await getCategoriasRecursos(); // Consume /categoriaRecurso/all
        console.log("Respuesta de categorías:", response);
        const categoriasActivas = response.filter((cat) => cat.status === true);
        console.log("Categorías activas filtradas:", categoriasActivas);
        setCategorias(categoriasActivas);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };

    const fetchResponsables = async () => {
      try {
        console.log("Iniciando la carga de responsables...");
        const response = await getResponsables(); // Consume /responsables/all
        console.log("Respuesta de responsables:", response);
        const responsablesActivos = response.result.filter(
          (res) => res.estado === true
        );
        console.log("Responsables activos filtrados:", responsablesActivos);
        console.log("Responsables activos filtrados:", responsablesActivos);
        setResponsables(responsablesActivos);
      } catch (error) {
        console.error("Error al cargar los responsables:", error);
      }
    };

    fetchCategorias();
    fetchResponsables();
  }, []);

  useEffect(() => {
    if (!edificio || !Array.isArray(edificio.espacios)) return;

    let filtered = edificio.espacios.filter((espacio) =>
      espacio.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddSpace = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setCodigo("");
    setDescripcion("");
    setMarca("");
    setModelo("");
    setNumeroSerie("");
    setObservaciones("");
    setCategoriaSeleccionada("");
    setResponsableSeleccionado("");
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      codigo,
      descripcion,
      marca,
      modelo,
      numeroSerie,
      observaciones,
      invetarioLevantadoid: parseInt(id),
      categoriaRecursoid: parseInt(categoriaSeleccionada),
      responsableid: parseInt(responsableSeleccionado),
    };

    try {
      // Call the API to save the resource (replace with actual API call)
      console.log("Payload:", payload);
      toast.success("Recurso agregado correctamente");
      setOpenAddModal(false);
      resetForm();
    } catch (error) {
      toast.error("Error al agregar el recurso");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedEspacio, setSelectedEspacio] = useState(null);

  const handleOpenStatusModal = (espacio) => {
    setSelectedEspacio(espacio);
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedEspacio(null);
  };

  const handleChangeStatus = async () => {
    try {
      if (!selectedEspacio) return;

      const response = {
        type: "SUCCESS",
        text: "Estado cambiado correctamente",
      };

      if (response.type === "SUCCESS") {
        toast.success(response.text);
        setEdificio((prev) => ({
          ...prev,
          espacios: prev.espacios.map((esp) =>
            esp.id === selectedEspacio.id
              ? { ...esp, status: !esp.status }
              : esp
          ),
        }));
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

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    // const  = "../assets/logo.png"; // Ruta del logo

    // Agregar el logo en la esquina superior derecha
    const imgWidth = 20; // Ancho del logo
    const imgHeight = 15; // Alto del logo
    const marginRight = 10; // Margen derecho
    const marginTop = 10; // Margen superior

    doc.addImage(
      logoUrl,
      "PNG",
      doc.internal.pageSize.width - imgWidth - marginRight,
      marginTop,
      imgWidth,
      imgHeight
    );

    // Título del reporte
    doc.text("Reporte de Recursos", 14, 20);

    // Generar tabla
    autoTable(doc, {
      startY: 40,
      head: [
        [
          "#",
          "Código",
          "Descripción",
          "Marca",
          "Modelo",
          "Num Serie",
          "Observaciones",
          "Estado",
        ],
      ],
      body: filteredEspacios.map((espacio, index) => [
        index + 1,
        espacio.codigo,
        espacio.descripcion,
        espacio.marca,
        espacio.modelo,
        espacio.numeroSerie,
        espacio.observaciones,
        espacio.status ? "Activo" : "Inactivo",
      ]),
    });

    doc.save("reporte_recursos.pdf");
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
          marginLeft={5}
          color="#133e87"
          fontFamily={"sans-serif"}
          fontSize={30}
        >
          {edificio.nombre} Recursos
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* <Button
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
            Agregar Recurso
          </Button> */}
          <Button
            variant="outlined"
            color="primary"
            // marginRight={5}
            onClick={handleGeneratePDF}
            sx={{
              display: "flex",
              alignItems: "center",
              borderColor: "#133E87",
              color: "#133E87",
              borderRadius: "20px",
              padding: "8px 20px",
            }}
          >
            Generar PDF
          </Button>
        </Box>
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
              <TableRow
                sx={{
                  backgroundColor: "#133e87",
                  zIndex: 1,
                }}
              >
                {[
                  "#",
                  "Codigo",
                  "Descripcion",
                  "Marca",
                  "Modelo",
                  "Num Serie",
                  "Observaciones",
                  "Categoría",
                  "Responsable",
                  "Status",
                  "Editar",
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
              {filteredEspacios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((espacio, index) => {
                  console.log("Procesando espacio:", espacio.responsable?.id);

                  // Obtener la categoría asociada
                  const categoria = Array.isArray(categorias)
                    ? categorias.find(
                        (cat) => cat.id === espacio.categoriaRecurso?.id
                      )
                    : null;

                  // Obtener el responsable asociado
                  const responsable = Array.isArray(responsables)
                    ? responsables.find((res) => res.id === espacio.responsable?.id)
                    : null;

                  console.log("Categoría asociada:", categoria?.nombre || "Sin categoría");
                  console.log("Responsable asociado:", responsables?.nombre || "Sin responsable");

                  return (
                    <TableRow
                      key={espacio.codigo}
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        transition: "background-color 0.3s",
                      }}
                    >
                      <TableCell sx={{ textAlign: "center" }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {espacio.codigo}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {espacio.descripcion}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {espacio.marca}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {espacio.modelo}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {espacio.numeroSerie}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {espacio.observaciones}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {categoria?.nombre || "Sin categoría"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {responsable?.nombre || "Sin responsable"}
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
                  );
                })}
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
              Agregar Nuevo Recurso
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
            <Box component="form" onSubmit={handleAddResource} sx={{ mt: 1 }}>
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
                  Código *
                </label>
                <input
                  required
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
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
                  Descripción *
                </label>
                <input
                  required
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
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
                  Marca *
                </label>
                <input
                  required
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
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
                  Modelo *
                </label>
                <input
                  required
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
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
                  Número de Serie *
                </label>
                <input
                  required
                  value={numeroSerie}
                  onChange={(e) => setNumeroSerie(e.target.value)}
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
                  Observaciones
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
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
                  Categoría *
                </label>
                <select
                  required
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "2px solid #ced4da",
                    fontSize: "1rem",
                    transition: "all 0.3s",
                  }}
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
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
                  Responsable *
                </label>
                <select
                  required
                  value={responsableSeleccionado}
                  onChange={(e) => setResponsableSeleccionado(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "10px",
                    border: "2px solid #ced4da",
                    fontSize: "1rem",
                    transition: "all 0.3s",
                  }}
                >
                  <option value="">Seleccione un responsable</option>
                  {responsables.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.nombre}
                    </option>
                  ))}
                </select>
              </Box>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#133e87",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                {isLoading ? "Guardando..." : "Guardar Recurso"}
              </button>
            </Box>
          </Box>
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

      <ToastContainer />
    </>
  );
};

export default Recursos;