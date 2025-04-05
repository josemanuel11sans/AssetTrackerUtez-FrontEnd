import { useParams } from "react-router-dom";;
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { jsPDF } from "jspdf";

import {  autoTable  }  from  'jspdf-autotable'
import {
  getRecursosInventarioId
} from "../api/recursos";
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
  const [edificio, setEdificio] = useState({  });
  const [filteredEspacios, setFilteredEspacios] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [numeroPlanta, setNumeroPlanta] = useState("");
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  console.log(id+ "id ")
  useEffect(() => {
    if (!id) return;
    
    const fetchEdificio = async () => {
      try {
        const response = await getRecursosInventarioId(id);
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
    setNombre("");
    setNumeroPlanta("");
    setFile(null);
    setPreviewImage("");
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
        text: "Estado cambiado correctamente"
      };

      if (response.type === "SUCCESS") {
        toast.success(response.text);
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
 
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    // const  = "../assets/logo.png"; // Ruta del logo

    // Agregar el logo en la esquina superior derecha
    const imgWidth = 20; // Ancho del logo
    const imgHeight = 15; // Alto del logo
    const marginRight = 10; // Margen derecho
    const marginTop = 10; // Margen superior

    doc.addImage(logoUrl, "PNG", doc.internal.pageSize.width - imgWidth - marginRight, marginTop, imgWidth, imgHeight);

    // Título del reporte
    doc.text("Reporte de Recursos", 14, 20);

    // Generar tabla
    autoTable(doc, {
      startY: 40,
      head: [["#", "Código", "Descripción", "Marca", "Modelo", "Num Serie", "Observaciones", "Estado"]],
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
          color="#133e87"
          fontFamily={"sans-serif"}
          fontSize={30}
        >
          {edificio.nombre} - Recursos
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
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
            Agregar Recurso
          </Button>
          <Button
            variant="outlined"
            color="primary"
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
                  "Status",
                "Editar"
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
                  Nombre del recurso *
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