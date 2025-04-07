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
  Chip,
  TablePagination,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import { getUsuarios, saveUsuario, updateUsuario, changeStatusUsuario } from "../api/usuariosApi";
import { aprobarCuenta, getNotificaciones, rechazarCuenta } from "../api/notificaciones";

const NuevasCuentas = () => {
  const [nuevasCuentas, setNuevasCuentas] = useState([]);
  const [filteredNuevasCuentas, setFilteredNuevasCuentas] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null); // Para almacenar la acción seleccionada (aprobar o rechazar)

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const response = await getNotificaciones();
        console.log(response.data.result);

        const newData = response.data.result;

        if (JSON.stringify(newData) !== JSON.stringify(nuevasCuentas)) {
          setNuevasCuentas(newData);
          setFilteredNuevasCuentas(newData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 5000);

    return () => clearInterval(interval);
  }, [nuevasCuentas]);

  useEffect(() => {
    let filtered = nuevasCuentas.filter((usuario) =>
    (usuario.usuario.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usuario.usuario.apellidos.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (statusFilter !== "all") {
      if (statusFilter === "pendientes") {
        filtered = filtered.filter((usuario) => usuario.status === "PENDIENTE");
      } else if (statusFilter === "aprobados") {
        filtered = filtered.filter((usuario) => usuario.status === "APROBADO");
      } else if (statusFilter === "rechazados") {
        filtered = filtered.filter((usuario) => usuario.status === "RECHAZADO");
      }
    }

    setFilteredNuevasCuentas(filtered);
  }, [searchQuery, statusFilter, nuevasCuentas]);

  const handleAprobarCuenta = async (idNoti, idUser) => {
    console.log(idNoti, idUser);
    try {
      await aprobarCuenta(idNoti, idUser);
      toast.success("Cuenta aprobada correctamente");
    } catch (error) {
      toast.error("Error al aprobar la cuenta");
    }
  };

  const handleRechazarCuenta = async (idNoti, idUser) => {
    try {
      await rechazarCuenta(idNoti, idUser);
      toast.success("Cuenta rechazada correctamente");
    } catch (error) {
      toast.error("Error al rechazar la cuenta");
    }
  };
  const handleOpenStatusModal = (usuario, action) => {
    setSelectedUsuario(usuario);
    setSelectedAction(action);  // Establecer acción de 'approve' o 'reject'
    setOpenStatusModal(true);
  };

  const handleConfirmChangeStatus = async () => {
    if (selectedAction === "approve") {
      await handleAprobarCuenta(selectedUsuario.id, selectedUsuario.usuario.id);
    } else if (selectedAction === "reject") {
      await handleRechazarCuenta(selectedUsuario.id, selectedUsuario.usuario.id);
    }
    handleCloseStatusModal(); // Cerrar modal después de la acción
  };
  

  const handleCloseStatusModal = () => {
    
    setOpenStatusModal(false);
  };
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

  const handleAddUser = () => {
    setOpenAddModal(true);
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
            <option value="pendientes">Pendientes</option>
            <option value="aprobados">Aprobados</option>
            <option value="rechazados">Rechazados</option>
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
          Solicitudes de Nuevas Cuentas
        </Typography>

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
                  "ID",
                  "Nombre",
                  "Correo",
                  "Estado de la solicitud",
                  "Fecha de solicitud",
                  "Acciones",
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
              {filteredNuevasCuentas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cuenta) => (
                  <TableRow
                    key={cuenta.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.3s",
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {cuenta.id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {cuenta.usuario.nombre} {cuenta.usuario.apellidos}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {cuenta.usuario.correo}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {cuenta.status}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {new Date(cuenta.fechaSolicitud).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", }}>
                      <IconButton
                        sx={{
                          backgroundColor: "#133E87",
                          color: "white",
                          borderRadius: "50%",
                          padding: "6px",
                          "&:hover": {
                            backgroundColor: "#0f2f68",
                          },
                        }}
                        onClick={() => handleOpenStatusModal(cuenta, 'approve')}  // Cambiado
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        sx={{
                          backgroundColor: "#133E87",
                          color: "white",
                          borderRadius: "50%",
                          padding: "6px",
                          "&:hover": {
                            backgroundColor: "#0f2f68",
                          },
                          marginLeft: "10px",
                        }}
                        onClick={() => handleOpenStatusModal(cuenta, 'reject')}  // Cambiado
                      >
                        <ClearIcon />
                      </IconButton>

                    </TableCell>


                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredNuevasCuentas.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
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
              Confirmar acción
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
                ¿Estás seguro que deseas{" "}
                <span style={{ fontWeight: 600, color: "#2b2d42" }}>
                  {selectedAction === "approve" ? "aprobar" : "rechazar"}{" "}
                </span>
                la cuenta de{" "}
                <span style={{ fontWeight: 600, color: "#2b2d42" }}>
                  {selectedUsuario?.nombre} {selectedUsuario?.apellidos}
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
      </div>
    </>
  );
};

export default NuevasCuentas;
