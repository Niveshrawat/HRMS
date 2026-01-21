import type { ReactNode } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../state/authStore'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: ['admin', 'manager', 'employee'] },
  { to: '/employees', label: 'Employees', roles: ['admin', 'manager'] },
  { to: '/attendance', label: 'Attendance', roles: ['admin', 'manager'] },
]

export function Layout({ children }: { children?: ReactNode }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  return (
    <Box minHeight="100vh" bgcolor="#f4f6f8">
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HRMS
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {navItems
              .filter((item) => item.roles.includes(user?.role ?? 'employee'))
              .map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  color="primary"
                  sx={{
                    '&.active': { fontWeight: 700, color: 'primary.main' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">{user?.name}</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box p={3}>{children ?? <Outlet />}</Box>
    </Box>
  )
}
