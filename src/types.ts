export type Role = 'admin' | 'manager' | 'employee'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface AuthUser extends User {
  token: string
}

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  title: string
  status: 'active' | 'inactive'
  joinDate: string
  manager?: string
}

export interface AttendanceEntry {
  id: string
  employeeId: string
  date: string
  status: 'present' | 'absent' | 'remote'
  notes?: string
  recordedBy: string
}
