import { useState, type SubmitEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Alert, Container, Typography, Box, MenuItem } from '@mui/material'
import api from '../api/axios'
import type { Estado } from '../types'

const ESTADOS: Estado[] = ['DISPONIBLE', 'AGOTADO', 'PRÓXIMAMENTE']

export default function CreateProduct() {
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [estado, setEstado] = useState<Estado>('DISPONIBLE')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError('')

    if (!nombre || !categoria || !precio || !stock) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      await api.post('/products', {
        nombre,
        categoria,
        precio: Number(precio),
        stock: Number(stock),
        estado
      })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch {
      setError('Error al crear producto')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Crear Producto</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Producto creado exitosamente</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Nombre" value={nombre}
            onChange={(e) => setNombre(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="CATEGORIA" value={categoria}
            onChange={(e) => setCategoria(e.target.value)} sx={{ mb: 2 }} />
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
              Crear
            </Button>
            <Button fullWidth variant="outlined" onClick={() => navigate('/dashboard')}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
