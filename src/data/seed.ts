import type { AttendanceEntry, Employee, User } from '../types'
import { formatISO } from 'date-fns'

export const seedUsers: Array<User & { password: string }> = [
  { id: 'u1', name: 'Alice Admin', email: 'admin@demo.com', role: 'admin', password: 'admin123' },
  { id: 'u2', name: 'Manny Manager', email: 'manager@demo.com', role: 'manager', password: 'manager123' },
  { id: 'u3', name: 'Eve Employee', email: 'employee@demo.com', role: 'employee', password: 'employee123' },
]

export const seedEmployees: Employee[] = [
  {
    id: 'e1',
    name: 'Eve Employee',
    email: 'employee@demo.com',
    department: 'Engineering',
    title: 'Frontend Developer',
    status: 'active',
    joinDate: '2023-02-15',
    manager: 'Manny Manager',
  },
  {
    id: 'e2',
    name: 'Sam Support',
    email: 'sam.support@demo.com',
    department: 'Customer Success',
    title: 'Support Specialist',
    status: 'active',
    joinDate: '2022-07-01',
    manager: 'Manny Manager',
  },
  {
    id: 'e3',
    name: 'Pat People',
    email: 'pat.people@demo.com',
    department: 'HR',
    title: 'HR Business Partner',
    status: 'inactive',
    joinDate: '2021-11-20',
    manager: 'Alice Admin',
  },
]

export const seedAttendance: AttendanceEntry[] = [
  {
    id: 'a1',
    employeeId: 'e1',
    date: formatISO(new Date(), { representation: 'date' }),
    status: 'present',
    notes: 'Onsite',
    recordedBy: 'u2',
  },
  {
    id: 'a2',
    employeeId: 'e2',
    date: formatISO(new Date(), { representation: 'date' }),
    status: 'remote',
    notes: 'Working from home',
    recordedBy: 'u2',
  },
]
