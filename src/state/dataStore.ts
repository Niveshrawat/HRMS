import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { AttendanceEntry, Employee } from '../types'
import { seedAttendance, seedEmployees } from '../data/seed'
import { loadState, saveState } from '../utils/storage'

interface DataState {
  employees: Employee[]
  attendance: AttendanceEntry[]
  addEmployee: (payload: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, payload: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  recordAttendance: (payload: Omit<AttendanceEntry, 'id'>) => void
}

const VERSION = 1

interface PersistedShape {
  employees: Employee[]
  attendance: AttendanceEntry[]
}

const initial = loadState<PersistedShape>(VERSION, {
  employees: seedEmployees,
  attendance: seedAttendance,
})

export const useDataStore = create<DataState>((set) => ({
  employees: initial.employees,
  attendance: initial.attendance,
  addEmployee(payload) {
    const next: Employee = { ...payload, id: nanoid() }
    set((state) => {
      const employees = [...state.employees, next]
      persist({ employees, attendance: state.attendance })
      return { employees }
    })
  },
  updateEmployee(id, payload) {
    set((state) => {
      const employees = state.employees.map((emp) => (emp.id === id ? { ...emp, ...payload } : emp))
      persist({ employees, attendance: state.attendance })
      return { employees }
    })
  },
  deleteEmployee(id) {
    set((state) => {
      const employees = state.employees.filter((emp) => emp.id !== id)
      const attendance = state.attendance.filter((a) => a.employeeId !== id)
      persist({ employees, attendance })
      return { employees, attendance }
    })
  },
  recordAttendance(payload) {
    const entry: AttendanceEntry = { ...payload, id: nanoid() }
    set((state) => {
      const attendance = [entry, ...state.attendance]
      persist({ employees: state.employees, attendance })
      return { attendance }
    })
  },
}))

function persist(data: PersistedShape) {
  saveState(VERSION, data)
}
