import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogContent, DialogTitle, Box, TablePagination, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Ícono de lupa
import EditIcon from '@mui/icons-material/Edit'; // Ícono de lápiz

const CategoriaRecursos = () => {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:8080/categoriasRecursos/all');
        const newData = response.data.result;

        // Solo actualiza si los datos han cambiado
        if (JSON.stringify(newData) !== JSON.stringify(categorias)) {
          setCategorias(newData);
          setFilteredCategorias(newData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCategorias();
    const interval = setInterval(fetchCategorias, 5000);

    return () => clearInterval(interval);
  }, [categorias]);

  useEffect(() => {
    let filtered = categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(categoria => categoria.status === (statusFilter === 'active'));
    }

    setFilteredCategorias(filtered);
  }, [searchQuery, statusFilter, categorias]);

  const handleClickOpen = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div style={{
  display: 'flex',
  justifyContent: 'start',
  marginBottom: '10px',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  backgroundColor: 'white',
  zIndex: 1,
  padding: '10px 20px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
}}>
  {/* Buscador con icono de lupa */}
  <div style={{
    display: 'flex',
    alignItems: 'center',
    borderRadius: '20px',
    border: '1px solid #ccc',
    padding: '5px 10px',
    marginRight: '20px'  // Agregado un margen a la derecha para separar el buscador y el selector
  }}>
    <SearchIcon style={{ marginRight: '5px' }} />
    <input
      type="text"
      placeholder="Buscar..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{
        border: 'none',
        outline: 'none',
        width: '200px',
        padding: '5px'
      }}
    />
  </div>

  {/* Selector de estado sin MUI */}
  <div style={{
    borderRadius: '20px',
    border: '1px solid #ccc',
    padding: '5px 10px'
  }}>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      style={{
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        padding: '5px',
        borderRadius: '10px'
      }}
    >
      <option value="all">Todos</option>
      <option value="active">Activos</option>
      <option value="inactive">Inactivos</option>
    </select>
  </div>
</div>

      <div style={{ maxWidth: '1350px', margin: 'auto', textAlign: 'center' }}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, overflowX: 'auto', width: '100%' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#133E87', position: 'sticky', top: 0, zIndex: 1 }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Material</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Imagen</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategorias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((categoria) => (
                <TableRow key={categoria.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell sx={{ textAlign: 'center' }}>{categoria.id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{categoria.nombre}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{categoria.material}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <img
                      src={categoria.imagenUrl}
                      alt={categoria.nombre}
                      width="40"
                      style={{ borderRadius: '5px', cursor: 'pointer' }}
                      onClick={() => handleClickOpen(categoria.imagenUrl)}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: categoria.status ? 'green' : 'red',
                        display: 'inline-block'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton sx={{ backgroundColor: '#133E87', color: 'white', borderRadius: '30%', padding: '5px' }}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCategorias.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Imagen</DialogTitle>
          <DialogContent>
            <img src={selectedImage} alt="Imagen seleccionada" style={{ width: '100%' }} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CategoriaRecursos;