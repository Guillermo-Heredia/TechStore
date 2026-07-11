import { useState, useEffect, type SubmitEventHandler } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  TextField, Button, Alert, Container, Typography, Box, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material'
import api from '../api/axios'
import type { Product, Estado } from '../types'

const ESTADOS: Estado[] = ['DISPONIBLE', 'AGOTADO', 'PRÓXIMAMENTE']

export default function EditProduct() {
  const { id } = useParams()
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [estado, setEstado] = useState<Estado>('DISPONIBLE')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get<Product>(`/products/${id}`)
        setNombre(data.nombre)
        setCategoria(data.categoria)
        setPrecio(String(data.precio))
        setStock(String(data.stock))
        setEstado(data.estado)
      } catch {
        setError('Error al cargar producto')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError('')

    if (!categoria || !precio || !stock || !estado) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      await api.put(`/products/${id}`, {
        categoria,
        precio: Number(precio),
        stock: Number(stock),
        estado
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch {
      setError('Error al actualizar producto')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${id}`)
      navigate('/dashboard')
    } catch {
      setError('Error al eliminar producto')
      setDeleteOpen(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h6">Cargando producto...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Editar Producto</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Producto actualizado exitosamente</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Nombre" value={nombre} disabled sx={{ mb: 2 }} />
          <TextField fullWidth label="CATERGORIA" value={categoria} disabled sx={{ mb: 2 }} />
          <TextField fullWidth label="Precio" type="number" value={precio}
            onChange={(e) => setPrecio(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Stock" type="number" value={stock}
            onChange={(e) => setStock(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Estado" select value={estado}
            onChange={(e) => setEstado(e.target.value as Estado)} sx={{ mb: 2 }}>
            {ESTADOS.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt.replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button fullWidth variant="contained" type="submit" disabled={success}>
              Guardar Cambios
            </Button>
            <Button fullWidth variant="outlined" onClick={() => navigate('/dashboard')}>
              Cancelar
            </Button>
          </Box>
          <Button fullWidth variant="outlined" color="error" sx={{ mt: 2 }}
            onClick={() => setDeleteOpen(true)}>
            Eliminar Producto
          </Button>
        </Box>
      </Box>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Eliminar producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de eliminar "{nombre}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
