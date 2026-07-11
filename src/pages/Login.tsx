import { useState, type SubmitEventHandler } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Alert, Container, Typography, Box } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Todos los campos son obligatorios')
      return
    }

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      const apiError = err as { message: string }
      setError(apiError.message)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>Iniciar Sesión</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" type="submit">
            Iniciar Sesión
          </Button>
        </Box>

        <Typography sx={{ mt: 2 }}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </Typography>
      </Box>
    </Container>
  )
}
