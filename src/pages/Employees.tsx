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
import type { Employee } from '../types'
import { useAuthStore } from '../state/authStore'

interface FormState extends Omit<Employee, 'id'> {}

const emptyForm: FormState = {
  name: '',
  email: '',
  department: '',
  title: '',
  status: 'active',
  joinDate: format(new Date(), 'yyyy-MM-dd'),
  manager: '',
}

export function EmployeesPage() {
  const { user } = useAuthStore()
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useDataStore()
  const [filter, setFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const filtered = useMemo(() => {
    const lower = filter.toLowerCase()
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(lower) ||
        e.email.toLowerCase().includes(lower) ||
        e.department.toLowerCase().includes(lower),
    )
  }, [employees, filter])

  const canEdit = user?.role === 'admin' || user?.role === 'manager'

  const openModal = (emp?: Employee) => {
    if (emp) {
      setEditing(emp)
      setForm({ ...emp })
    } else {
      setEditing(null)
      setForm(emptyForm)
    }
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email) return
    if (editing) {
      updateEmployee(editing.id, form)
    } else {
      addEmployee(form)
    }
    setModalOpen(false)
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Employees</Typography>
        {canEdit && (
          <Button variant="contained" onClick={() => openModal()}>
            Add employee
          </Button>
        )}
      </Stack>
      <Paper sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
          <TextField
            label="Search by name, email, or department"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            fullWidth
            size="small"
          />
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              {canEdit && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.title}</TableCell>
                <TableCell>
                  <Chip label={emp.status} color={emp.status === 'active' ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>{emp.joinDate}</TableCell>
                {canEdit && (
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" onClick={() => openModal(emp)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => deleteEmployee(emp.id)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={canEdit ? 7 : 6} align="center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit employee' : 'Add employee'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="Department"
            value={form.department}
            onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Manager"
            value={form.manager}
            onChange={(e) => setForm((p) => ({ ...p, manager: e.target.value }))}
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Employee['status'] }))}
            fullWidth
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
          <TextField
            label="Join date"
            type="date"
            value={form.joinDate}
            onChange={(e) => setForm((p) => ({ ...p, joinDate: e.target.value }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
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
