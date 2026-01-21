import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { format } from 'date-fns'
import { useDataStore } from '../state/dataStore'
import { useAuthStore } from '../state/authStore'

export function DashboardPage() {
  const { employees, attendance } = useDataStore()
  const { user } = useAuthStore()
  const activeEmployees = employees.filter((e) => e.status === 'active').length
  const todays = attendance.filter((a) => a.date === format(new Date(), 'yyyy-MM-dd'))

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Welcome back, {user?.name}</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Active Employees
          </Typography>
          <Typography variant="h4">{activeEmployees}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Total Employees
          </Typography>
          <Typography variant="h4">{employees.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Attendance Today
          </Typography>
          <Typography variant="h4">{todays.length}</Typography>
        </Paper>
      </Stack>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Today&apos;s attendance
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          {todays.map((entry) => {
            const employee = employees.find((e) => e.id === entry.employeeId)
            return (
              <Stack
                key={entry.id}
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 1, borderRadius: 1, bgcolor: '#f8f9fb' }}
              >
                <Stack>
                  <Typography variant="body1">{employee?.name ?? entry.employeeId}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {employee?.department} · {employee?.title}
                  </Typography>
                </Stack>
                <Chip
                  label={entry.status}
                  color={entry.status === 'present' ? 'success' : entry.status === 'remote' ? 'info' : 'warning'}
                  variant="outlined"
                />
              </Stack>
            )
          })}
          {todays.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No attendance recorded today yet.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}
