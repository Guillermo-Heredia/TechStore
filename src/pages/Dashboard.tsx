import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card, CardContent, CardActions,
  TextField, Button, Typography, Dialog,
  DialogTitle, DialogContent, DialogContentText,
  DialogActions, Alert, Box
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import type { Product } from '../types'

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products', {
          params: { page, search }
        })
        setProducts(data.products ?? data)
        setTotalPages(data.totalPages ?? 1)
      } catch {
        setError('Error al cargar productos')
      }
    }
    fetchProducts()
  }, [page, search])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/products/${deleteTarget.id}`)
      setDeleteTarget(null)
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id))
    } catch {
      setError('Error al eliminar producto')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography>{user?.username}</Typography>
          <Button variant="outlined" onClick={handleLogout}>Cerrar Sesión</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar productos"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
        />
        <Button variant="contained" onClick={() => navigate('/products/crear')}>
          Crear Producto
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {products.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>
          No hay productos
        </Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent>
                <Typography variant="h6">{product.nombre}</Typography>
                <Typography color="text.secondary">CATEGORIA: {product.categoria}</Typography>
                <Typography color="text.secondary">Precio: S/ {product.precio}</Typography>
                <Typography color="text.secondary">Stock: {product.stock}</Typography>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-white text-xs font-medium ${
                  product.estado === 'DISPONIBLE' ? 'bg-green-600' :
                  product.estado === 'AGOTADO' ? 'bg-red-600' : 'bg-gray-500'
                }`}>
                  {product.estado.replace('_', ' ')}
                </span>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/products/${product.id}`)}>
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => setDeleteTarget(product)}>
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-medium">Pág {page} de {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Eliminar producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de eliminar "{deleteTarget?.nombre}"? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
