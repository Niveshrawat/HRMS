import { useMemo, useState } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import { format } from 'date-fns'
import { useDataStore } from '../state/dataStore'
import type { AttendanceEntry } from '../types'
import { useAuthStore } from '../state/authStore'

type FormState = Omit<AttendanceEntry, 'id' | 'recordedBy'>

const emptyAttendance: FormState = {
  employeeId: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  status: 'present',
  notes: '',
}

export function AttendancePage() {
  const { user } = useAuthStore()
  const { employees, attendance, recordAttendance } = useDataStore()
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyAttendance)

  const filtered = useMemo(
    () => attendance.filter((a) => (filterDate ? a.date === filterDate : true)),
    [attendance, filterDate],
  )

  const handleSave = () => {
    if (!form.employeeId) return
    recordAttendance({ ...form, recordedBy: user?.id ?? 'system' })
    setModalOpen(false)
    setForm(emptyAttendance)
  }

  const canRecord = user?.role === 'admin' || user?.role === 'manager'

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Attendance</Typography>
        {canRecord && (
          <Button variant="contained" onClick={() => setModalOpen(true)}>
            Record attendance
          </Button>
        )}
      </Stack>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} alignItems="center">
          <TextField
            label="Date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Recorded by</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((entry) => {
              const employee = employees.find((e) => e.id === entry.employeeId)
              const recordedBy = entry.recordedBy
              return (
                <TableRow key={entry.id} hover>
                  <TableCell>{employee?.name ?? entry.employeeId}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={entry.status}
                      color={entry.status === 'present' ? 'success' : entry.status === 'remote' ? 'info' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{entry.notes}</TableCell>
                  <TableCell>{recordedBy}</TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No attendance records for this date.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record attendance</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField
            select
            label="Employee"
            value={form.employeeId}
            onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
            fullWidth
            required
          >
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.name} · {emp.department}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as AttendanceEntry['status'] }))}
            fullWidth
          >
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="remote">Remote</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
          </TextField>
          <TextField
            label="Notes"
            multiline
            minRows={2}
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
