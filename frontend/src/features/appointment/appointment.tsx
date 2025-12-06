import React, { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Plus,
  Search,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import "./appointment.css"

const API_BASE = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3000"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  service?: string
  date: string
  time: string
  room: string
  reason?: string
  notes?: string
}

const initialAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    patientId: "P001",
    doctorName: "Dr. Sarah Johnson",
    service: "General Consultation",
    date: "2025-01-20",
    time: "09:00 AM",
    room: "Room 101",
    reason: "Regular checkup",
  },
  {
    id: "2",
    patientName: "Emily Brown",
    patientId: "P002",
    doctorName: "Dr. Michael Chen",
    service: "ECG",
    date: "2025-01-20",
    time: "10:30 AM",
    room: "Room 203",
    reason: "Heart consultation",
  },
  {
    id: "3",
    patientName: "Robert Wilson",
    patientId: "P003",
    doctorName: "Dr. Sarah Johnson",
    service: "Follow-up Consultation",
    date: "2025-01-20",
    time: "02:00 PM",
    room: "Room 101",
    reason: "Follow-up visit",
  },
  {
    id: "4",
    patientName: "Lisa Anderson",
    patientId: "P004",
    doctorName: "Dr. James Martinez",
    service: "Vaccination",
    date: "2025-01-21",
    time: "11:00 AM",
    room: "Room 105",
    reason: "Child vaccination",
  },
  {
    id: "5",
    patientName: "David Lee",
    patientId: "P005",
    doctorName: "Dr. Michael Chen",
    service: "Post-op Check",
    date: "2025-01-19",
    time: "03:00 PM",
    room: "Room 203",
    reason: "Post-surgery checkup",
  },
]

const rooms = ["Room 101", "Room 102", "Room 203", "Room 105", "Room 204"]
const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

const doctors = ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. James Martinez", "Dr. Emily White"]

// services list (clinic services)
const services = [
  "General Consultation",
  "X-Ray",
  "Laboratory",
  "Physiotherapy",
  "Vaccination",
  "Ultrasound",
  "ECG",
  "Minor Procedures",
]

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar")
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    doctorName: "",
    service: "", // <- now service
    date: "",
    time: "",
    room: "",
    reason: "",
    notes: "",
  })

  const [loading, setLoading] = useState(true)

  // --- API helpers ---
  const normalizeAppointment = (a: any): Appointment => ({
    id: a.id ?? a._id,
    patientName: a.patientName,
    patientId: a.patientId,
    doctorName: a.doctorName,
    service: a.service ?? "",
    date: a.date,
    time: a.time,
    room: a.room ?? "",
    reason: a.reason ?? "",
    notes: a.notes ?? "",
  })

  const fetchAppointmentsAPI = async (): Promise<Appointment[]> => {
    const res = await fetch(`${API_BASE}/api/appointments`)
    if (!res.ok) throw new Error("Failed to fetch appointments")
    const json = await res.json()
    const list = Array.isArray(json?.data) ? json.data : []
    return list.map(normalizeAppointment)
  }

  const createAppointmentAPI = async (payload: Partial<Appointment>) => {
    const res = await fetch(`${API_BASE}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Create failed")
    const json = await res.json()
    return normalizeAppointment(json.data)
  }

  const updateAppointmentAPI = async (id: string, payload: Partial<Appointment>) => {
    const res = await fetch(`${API_BASE}/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Update failed")
    const json = await res.json()
    return normalizeAppointment(json.data)
  }

  const deleteAppointmentAPI = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/appointments/${id}`, { method: "DELETE" })
    if (!res.ok && res.status !== 204) throw new Error("Delete failed")
    return true
  }
  // --- end API helpers ---

  // fetch appointments on mount
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchAppointmentsAPI()
      .then((list) => {
        if (mounted) setAppointments(list)
      })
      .catch((err) => {
        console.error("Failed to load appointments", err)
        // fallback to initial data if you want:
        setAppointments(initialAppointments)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const isSlotAvailable = (doctorName: string, patientId: string, date: string, time: string, excludeId?: string) => {
  return !appointments.some((apt) => {
    if (excludeId && apt.id === excludeId) return false; // skip current appointment when updating
    return (
      apt.date === date &&
      apt.time === time &&
      (apt.doctorName === doctorName || apt.patientId === patientId)
    );
  });
}

  // create appointment -> persist
const handleCreateAppointment = async () => {
  const { doctorName, patientId, date, time } = formData;

  if (!isSlotAvailable(doctorName, patientId, date, time)) {
    alert("This doctor or patient already has an appointment at this time!");
    return;
  }

  try {
    const payload = { ...formData };
    const created = await createAppointmentAPI(payload);
    setAppointments((prev) => [created, ...prev]);
    setIsDialogOpen(false);
    resetForm();
  } catch (err) {
    console.error("Create appointment failed", err);
    alert("Failed to create appointment");
  }
}


  // update appointment -> persist
const handleUpdateAppointment = async () => {
  if (!selectedAppointment) return;

  const { doctorName, patientId, date, time } = formData;

  if (!isSlotAvailable(doctorName, patientId, date, time, selectedAppointment.id)) {
    alert("This doctor or patient already has an appointment at this time!");
    return;
  }

  try {
    const payload = { ...formData };
    const updated = await updateAppointmentAPI(selectedAppointment.id, payload);
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setIsDialogOpen(false);
    resetForm();
  } catch (err) {
    console.error("Update appointment failed", err);
    alert("Failed to update appointment");
  }
}

  // delete appointment
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Delete this appointment?")) return
    try {
      await deleteAppointmentAPI(id)
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      console.error("Delete appointment failed", err)
      alert("Failed to delete appointment")
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      apt.patientName.toLowerCase().includes(q) ||
      apt.doctorName.toLowerCase().includes(q) ||
      apt.patientId.toLowerCase().includes(q) ||
      (apt.service ?? "").toLowerCase().includes(q)
    return matchesSearch
  })

  const getAppointmentForSlot = (room: string, time: string, date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return appointments.find((apt) => apt.room === room && apt.time === time && apt.date === dateStr)
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  const openBookingDialog = (room: string, time: string) => {
    resetForm()
    setFormData((prev) => ({
      ...prev,
      room,
      time,
      date: selectedDate.toISOString().split("T")[0],
    }))
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      patientName: "",
      patientId: "",
      doctorName: "",
      service: "",
      date: "",
      time: "",
      room: "",
      reason: "",
      notes: "",
    })
    setSelectedAppointment(null)
  }

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setFormData({
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      doctorName: appointment.doctorName,
      service: appointment.service ?? "",
      date: appointment.date,
      time: appointment.time,
      room: appointment.room,
      reason: appointment.reason ?? "",
      notes: appointment.notes ?? "",
    })
    setIsDialogOpen(true)
  }

  const stats = {
    total: appointments.length,
    today: appointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length,
  }

  return (
    <div className="appointments-container">
      <div className="content-wrapper">
        <h1 className="page-title">Appointment Management</h1>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-label">Total Appointments</h3>
            <p className="stat-value">{appointments.length}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-label">Today's Appointments</h3>
            <p className="stat-value">{appointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length}</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="main-card">
          <div className="card-header">
            <div className="header-left">
              <h2 className="card-title">Appointments</h2>

              {/* View Toggle */}
              <div className="view-toggle">
                <button
                  className={`view-button ${viewMode === "calendar" ? "active" : ""}`}
                  onClick={() => setViewMode("calendar")}
                >
                  <CalendarDays className="w-5 h-5" />
                  Calendar
                </button>
                <button
                  className={`view-button ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-5 h-5" />
                  List
                </button>
              </div>
            </div>

            <button className="new-appointment-btn" onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="w-5 h-5" />
              New Appointment
            </button>
          </div>

          {viewMode === "calendar" && (
            <div className="calendar-view">
              <div className="date-navigation">
                <button className="date-nav-btn" onClick={() => changeDate(-1)}><ChevronLeft className="w-5 h-5" /></button>
                <h3 className="current-date">{selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h3>
                <button className="date-nav-btn" onClick={() => changeDate(1)}><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="calendar-grid">
                <div className="calendar-table">
                  <div className="calendar-header">
                    <div className="time-header">Time</div>
                    {rooms.map((room) => (<div key={room} className="room-header">{room}</div>))}
                  </div>
                  {timeSlots.map((time) => (
                    <div key={time} className="calendar-row">
                      <div className="time-cell">{time}</div>
                      {rooms.map((room) => {
                        const appointment = getAppointmentForSlot(room, time, selectedDate)
                        return (
                          <div key={`${room}-${time}`} className={`appointment-slot ${appointment ? "booked" : "available"}`} onClick={() => appointment ? openEditDialog(appointment) : openBookingDialog(room, time)}>
                            {appointment ? (
                              <div className="appointment-card-mini">
                                <div className="appointment-card-patient">
                                  <span>{appointment.patientName}</span>
                                  <span className="appointment-status-badge">Booked</span>
                                </div>
                                <div className="appointment-card-doctor">
                                  <User className="w-3.5 h-3.5" />
                                  <span>{appointment.doctorName}</span>
                                </div>
                                <div className="appointment-card-time">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{time}</span>
                                </div>
                                <div className="appointment-hover-indicator">
                                  <p>View details →</p>
                                </div>
                              </div>
                            ) : (<div className="available-text">Available</div>)}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="legend">
                <div className="legend-item"><div className="legend-box booked"></div><span>Booked</span></div>
                <div className="legend-item"><div className="legend-box available"></div><span>Available</span></div>
              </div>
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="list-view">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by patient name, doctor, service or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="appointments-list">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-card-content">
                      <div className="appointment-details">
                        <h3 className="appointment-title">
                          {appointment.patientName}
                          <span className="patient-id-badge">({appointment.patientId})</span>
                        </h3>

                        <p className="doctor-info">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{appointment.doctorName}</span>{appointment.service ? ` - ${appointment.service}` : ""}
                        </p>

                        <div className="appointment-meta">
                          <span className="meta-item date">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                              {new Date(appointment.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </span>
                          <span className="meta-item time">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{appointment.time}</span>
                          </span>
                          <span className="meta-item location">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{appointment.room}</span>
                          </span>
                        </div>

                        <p className="appointment-reason-text">
                          <strong>Reason:</strong> {appointment.reason}
                        </p>
                      </div>

                      <div className="appointment-actions">
                        <button className="edit-button" onClick={() => openEditDialog(appointment)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDeleteAppointment(appointment.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2 className="dialog-title">
                {selectedAppointment ? "Edit Appointment" : "Schedule New Appointment"}
              </h2>
              <p className="dialog-description">
                {selectedAppointment ? "Update appointment details" : "Fill in the details to schedule a new appointment"}
              </p>
            </div>

            <div className="form-grid">
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Patient Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Patient ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    placeholder="e.g., P001"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Doctor Name</label>
                  <select
                    className="form-select"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor} value={doctor}>{doctor}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  {/* Label is Service now */}
                  <label className="form-label">Service</label>
                  <select
                    className="form-select"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="">Select service</option>
                    {services.map((svc) => (
                      <option key={svc} value={svc}>{svc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row triple">
                <div className="form-field">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Time</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 09:00 AM"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Room</label>
                  <select
                    className="form-select"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  >
                    <option value="">Select room</option>
                    {rooms.map((room) => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Reason for Visit</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Regular checkup"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>

            <div className="dialog-actions">
              <button className="cancel-button" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </button>
              <button
                className="submit-button"
                onClick={selectedAppointment ? handleUpdateAppointment : handleCreateAppointment}
              >
                {selectedAppointment ? "Update" : "Create"} Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentsPage
