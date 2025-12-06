import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Edit, Trash2, QrCode, AlertCircle, CheckCircle, Clock, Download, X, Camera, Upload, Send } from 'lucide-react'
import QRCode from 'qrcode' //ignore that shit cus it work and idk why it still red
import './attendance.css'

interface Attendance {
  id: string
  profile?: string
  name: string
  staffId: string
  role: string
  organization: string
  room: string
  shift: string
  checkInTime: string
  checkOutTime?: string
  date: string
  status: "present" | "absent" | "late"
  approval?: "pending" | "accepted" | "rejected"
}

interface Organization {
  id: string
  name: string
  type: string
  recordType: string
  network: string
  logo?: string
}

interface OrganizationNetwork {
  id: string
  name: string
  ipAddress: string
}

const initialAttendance: Attendance[] = [
  {
    id: "1",
    profile: "👨‍⚕️",
    name: "Dr. Sarah Johnson",
    staffId: "S001",
    role: "General Physician",
    organization: "Main Clinic",
    room: "101",
    shift: "Morning",
    checkInTime: "08:45 AM",
    checkOutTime: undefined,
    date: new Date().toISOString().split("T")[0],
    status: "present",
  },
  {
    id: "2",
    profile: "👨‍⚕️",
    name: "Dr. Michael Chen",
    staffId: "S002",
    role: "Cardiologist",
    organization: "Main Clinic",
    room: "202",
    shift: "Morning",
    checkInTime: "09:15 AM",
    checkOutTime: undefined,
    date: new Date().toISOString().split("T")[0],
    status: "late",
  },
  {
    id: "3",
    profile: "👩‍⚕️",
    name: "Nurse Emma Wilson",
    staffId: "S003",
    role: "Registered Nurse",
    organization: "Main Clinic",
    room: "103",
    shift: "Morning",
    checkInTime: "08:30 AM",
    checkOutTime: "05:30 PM",
    date: new Date().toISOString().split("T")[0],
    status: "present",
  },
]

const staffRoles = [
  "General Physician",
  "Cardiologist",
  "Pediatrician",
  "Dermatologist",
  "Registered Nurse",
  "Receptionist",
]

const shifts = ["Morning", "Afternoon", "Evening", "Night"]

const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:3000'

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance)
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: "1", name: "Main Clinic", type: "Primary Care", recordType: "Hospital", network: "net1", logo: "🏥" },
    { id: "2", name: "Dental Center", type: "Dental", recordType: "Clinic", network: "net2", logo: "🦷" },
  ])
  const [networks, setNetworks] = useState<OrganizationNetwork[]>([
    { id: "1", name: "Main Network", ipAddress: "192.168.1.1" },
    { id: "2", name: "Secondary Network", ipAddress: "192.168.1.50" },
  ])

  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)
  const [qrInput, setQrInput] = useState("")
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false)
  const [isEditingAttendance, setIsEditingAttendance] = useState(false)
  const [editingAttendanceId, setEditingAttendanceId] = useState<string | null>(null)
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false)
  const [isEditingOrg, setIsEditingOrg] = useState(false)
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null)
  const [isNetworkDialogOpen, setIsNetworkDialogOpen] = useState(false)
  const [isEditingNetwork, setIsEditingNetwork] = useState(false)
  const [editingNetworkId, setEditingNetworkId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null)
  const [generatingQR, setGeneratingQR] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("attendance")
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [manualData, setManualData] = useState({
    profile: "👤",
    name: "",
    staffId: "",
    role: "",
    organization: "",
    room: "",
    shift: "",
  })

  const [orgData, setOrgData] = useState({
    name: "",
    type: "",
    recordType: "",
    network: "",
    logo: "",
  })

  const [networkData, setNetworkData] = useState({
    name: "",
    ipAddress: "",
  })

  const determineStatus = (checkInTime: string): "present" | "late" => {
  // Parse check-in time (format: "HH:MM AM/PM")
  const timeParts = checkInTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  
  if (!timeParts) return "present"; // default if parsing fails
  
  let hours = parseInt(timeParts[1]);
  const minutes = parseInt(timeParts[2]);
  const period = timeParts[3].toUpperCase();
  
  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  
  // Create time in minutes for comparison
  const checkInMinutes = hours * 60 + minutes;
  const cutoffMinutes = 8 * 60 + 30; // 8:30 AM = 510 minutes
  
  // If check-in is after 8:30 AM, mark as late
  return checkInMinutes > cutoffMinutes ? "late" : "present";
};

  const [statusFilter, setStatusFilter] = useState<"all" | "present" | "late" | "absent">("all")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [currentDeviceIP, setCurrentDeviceIP] = useState<string>("")
  const [ipValidationError, setIPValidationError] = useState<string>("")
  const [scannedOrgData, setScannedOrgData] = useState<{
    orgId: string
    orgName: string
    networkId: string
    isScanned: boolean
  } | null>(null)

  const [searchParams] = useSearchParams()

  // load attendance from backend on mount
  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/attendance`)
        if (!res.ok) {
          console.error('Failed to load attendance:', res.statusText)
          return
        }
        const json = await res.json()
        if (Array.isArray(json.data)) {
          setAttendance(json.data as Attendance[])
        }
      } catch (err) {
        console.error('Failed to fetch attendance', err)
      }
    }

    fetchAttendances()
    // fetchDeviceIP is already declared below in the file; keep calling it
    const fetchDeviceIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        if (response.ok) {
          const data = await response.json()
          setCurrentDeviceIP(data.ip)
        }
      } catch (error) {
        console.error('Failed to fetch device IP:', error)
      }
    }
    fetchDeviceIP()

    // fetch organizations and networks
    ;(async () => {
      try {
        const orgs = await fetchOrganizationsAPI()
        setOrganizations(orgs)
      } catch (err) {
        console.error('load orgs', err)
      }
      try {
        const nets = await fetchNetworksAPI()
        setNetworks(nets)
      } catch (err) {
        console.error('load networks', err)
      }
    })()
  }, [])

  // Auto-open QR modal when URL contains ?mode=scan
  useEffect(() => {
    if (searchParams.get('mode') === 'scan') {
      setIsQRDialogOpen(true)
      setCameraActive(true)
    }
  }, [searchParams])

  // Update attendance filter to use selected date
  useEffect(() => {
    const filtered = attendance.filter((a) => a.date === selectedDate)
    setTodayAttendance(filtered)
  }, [attendance, selectedDate])

  // API helpers
  const normalizeNetwork = (n: any) => ({ id: n?.id ?? n?._id, name: n?.name, ipAddress: n?.ipAddress })

  const createAttendanceAPI = async (payload: Partial<Attendance>) => {
    const res = await fetch(`${API_BASE}/api/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Create failed')
    const json = await res.json()
    return json.data as Attendance
  }

  const updateAttendanceAPI = async (id: string, payload: Partial<Attendance>) => {
    const res = await fetch(`${API_BASE}/api/attendance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Update failed')
    const json = await res.json()
    return json.data as Attendance
  }

  const deleteAttendanceAPI = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/attendance/${id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) throw new Error('Delete failed')
    return true
  }

  const fetchOrganizationsAPI = async () => {
    const res = await fetch(`${API_BASE}/api/organizations`)
    if (!res.ok) throw new Error('Failed to fetch organizations')
    const json = await res.json()
    return json.data as Organization[]
  }
  const createOrganizationAPI = async (payload: Partial<Organization>) => {
    const res = await fetch(`${API_BASE}/api/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Create organization failed')
    return (await res.json()).data as Organization
  }
  const updateOrganizationAPI = async (id: string, payload: Partial<Organization>) => {
    const res = await fetch(`${API_BASE}/api/organizations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Update organization failed')
    return (await res.json()).data as Organization
  }
  const deleteOrganizationAPI = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/organizations/${id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) throw new Error('Delete organization failed')
    return true
  }

  // networks helpers (normalized)
  const fetchNetworksAPI = async () => {
    const res = await fetch(`${API_BASE}/api/networks`)
    if (!res.ok) throw new Error('Failed to fetch networks')
    const json = await res.json()
    const list = Array.isArray(json?.data) ? json.data : []
    return list.map(normalizeNetwork) as OrganizationNetwork[]
  }
  const createNetworkAPI = async (payload: Partial<OrganizationNetwork>) => {
    const res = await fetch(`${API_BASE}/api/networks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Create network failed')
    const json = await res.json()
    return normalizeNetwork(json.data) as OrganizationNetwork
  }
  const updateNetworkAPI = async (id: string, payload: Partial<OrganizationNetwork>) => {
    const res = await fetch(`${API_BASE}/api/networks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Update network failed')
    const json = await res.json()
    return normalizeNetwork(json.data) as OrganizationNetwork
  }
  const deleteNetworkAPI = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/networks/${id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) throw new Error('Delete network failed')
    return true
  }

  // network UI helpers
  const handleEditNetwork = (network: any) => {
    setNetworkData({ name: network.name || '', ipAddress: network.ipAddress || '' })
    setEditingNetworkId(network.id ?? network._id ?? null)
    setIsEditingNetwork(true)
    setIsNetworkDialogOpen(true)
  }

  const handleFetchIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      if (response.ok) {
        const data = await response.json()
        setNetworkData((prev) => ({ ...prev, ipAddress: data.ip }))
      } else {
        setIPValidationError('Failed to fetch device IP')
      }
    } catch (err) {
      console.error('Failed to fetch IP:', err)
      setIPValidationError('Failed to fetch device IP')
    }
  }

  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([])

  // Camera scanning logic
  useEffect(() => {
    if (!cameraActive || !isQRDialogOpen) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            canvasRef.current!.width = videoRef.current!.videoWidth
            canvasRef.current!.height = videoRef.current!.videoHeight
          }
          setCameraError(null)
          // startQRScanning is now async but we intentionally don't await to let camera play immediately
          startQRScanning()
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Camera not available'
        setCameraError(errorMessage)
        setIPValidationError(`Camera Error: ${errorMessage}`)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [cameraActive, isQRDialogOpen])

  // load jsqr dynamically once per scan session and run loop
  const startQRScanning = async () => {
    let jsQR: any = null
    try {
      const mod = await import('jsqr')
      jsQR = (mod as any).default ?? mod
    } catch (e) {
      console.debug('jsqr import failed', e)
      return
    }

    const scanFrame = () => {
      if (!videoRef.current || !canvasRef.current || !cameraActive) return

      const context = canvasRef.current.getContext('2d')
      if (!context) return

      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)

      try {
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          setQrInput(code.data)
          setCameraActive(false)
          handleQRScan(code.data)
          return
        }
      } catch (error) {
        console.debug('QR scanning error', error)
      }

      requestAnimationFrame(scanFrame)
    }

    scanFrame()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const img = new Image()
        img.onload = async () => {
          if (!canvasRef.current) return

          const context = canvasRef.current.getContext('2d')
          if (!context) return

          canvasRef.current.width = img.width
          canvasRef.current.height = img.height
          context.drawImage(img, 0, 0)
          const imageData = context.getImageData(0, 0, img.width, img.height)

          try {
            const mod = await import('jsqr')
            const jsQR = (mod as any).default ?? mod
            const code = jsQR(imageData.data, imageData.width, imageData.height)

            if (code) {
              setQrInput(code.data)
              handleQRScan(code.data)
            } else {
              setIPValidationError('No QR code found in image')
            }
          } catch (error) {
            setIPValidationError('Error processing image')
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIPValidationError('Error reading file')
    }
  }

  const handleQRScan = (data?: string) => {
    const qrData = data || qrInput
    
    if (!qrData.trim()) {
      setIPValidationError("Please enter QR code data")
      return
    }

    try {
      const parts = qrData.split("|")
      if (parts[0] !== "ORG" || parts.length < 4) {
        setIPValidationError("Invalid QR code format")
        return
      }

      const orgId = parts[1]
      const orgName = parts[2]
      const networkId = parts[3]

      const org = organizations.find((o) => o.id === orgId)
      const network = networks.find((n) => n.id === networkId)

      if (!org || !network) {
        setIPValidationError("Organization or network not found")
        return
      }

      if (currentDeviceIP !== network.ipAddress) {
        setIPValidationError(
          `IP Mismatch! Device IP: ${currentDeviceIP}, Required IP: ${network.ipAddress}`
        )
        return
      }

      setScannedOrgData({ orgId, orgName, networkId, isScanned: true })
      setManualData({
        ...manualData,
        organization: orgName,
      })
      setIPValidationError("")
      setQrInput("")
    } catch (error) {
      setIPValidationError("Error processing QR code: " + String(error))
    }
  }

  // replace handleManualEntry to persist to backend
  const handleManualEntry = async () => {
    if (!manualData.name || !manualData.staffId) return

    try {
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const autoStatus = determineStatus(currentTime);
      
      if (isEditingAttendance && editingAttendanceId) {
        const updated = await updateAttendanceAPI(editingAttendanceId, {
          ...manualData,
          date: new Date().toISOString().split('T')[0],
        })
        setAttendance((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
        setIsEditingAttendance(false)
        setEditingAttendanceId(null)
      } else {
        const newRecordPayload: Partial<Attendance> = {
          ...manualData,
          checkInTime: currentTime,
          date: new Date().toISOString().split('T')[0],
          status: autoStatus, // Use automatic status detection

          approval: "pending",
        }
        const created = await createAttendanceAPI(newRecordPayload)
        setAttendance((prev) => [created, ...prev])
      }
      setManualData({ profile: '👤', name: '', staffId: '', role: '', organization: '', room: '', shift: '' })
      setScannedOrgData(null)
      setIsManualDialogOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const updateStatusBasedOnTime = (checkInTime: string): "present" | "late" => {
    return determineStatus(checkInTime);
  };

  // replace delete handler to call backend
  const handleDeleteAttendance = async (id: string) => {
    try {
      await deleteAttendanceAPI(id)
      setAttendance((prev) => prev.filter((a) => a.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Delete failed', err)
    }
  }


  // NEW: Check-out handler — set checkOutTime to current time and persist
  const handleCheckOut = async (id: string) => {
    try {
      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      const updated = await updateAttendanceAPI(id, { checkOutTime: now })
      setAttendance((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
    } catch (err) {
      console.error('Check-out failed', err)
      alert('Failed to check out')
    }
  }

  const handleUpdateApproval = async (id: string, newStatus: "pending" | "accepted" | "rejected") => {
  try {
    // SAVE TO BACKEND
    await updateAttendanceAPI(id, { approval: newStatus })

    // UPDATE UI STATE
    setAttendance((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, approval: newStatus } : a
      )
    )
  } catch (err) {
    console.error("Approval update failed", err)
    alert("Failed to update approval status")
  }
}

const handleAskPermission = async (id: string) => {
  try {
    // Set approval to pending (requesting permission)
    await updateAttendanceAPI(id, { approval: "pending" })
    
    // UPDATE UI STATE
    setAttendance((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, approval: "pending" } : a
      )
    )
    
    alert("Permission request sent successfully!")
  } catch (err) {
    console.error("Ask permission failed", err)
    alert("Failed to send permission request")
  }
}


  const handleEditAttendance = (record: Attendance) => {
    setManualData({
      profile: record.profile || "👤",
      name: record.name,
      staffId: record.staffId,
      role: record.role,
      organization: record.organization,
      room: record.room,
      shift: record.shift,
    })
    setEditingAttendanceId(record.id)
    setIsEditingAttendance(true)
    setIsManualDialogOpen(true)
  }

  // call backend when deleting organization
  const handleDeleteOrg = async (id: string) => {
    if (!confirm('Delete this organization?')) return
    try {
      await deleteOrganizationAPI(id)
      setOrganizations((prev) => prev.filter((o) => o.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Delete org failed', err)
      alert('Delete failed')
    }
  }

  const handleGenerateQR = (orgId: string) => {
    setGeneratingQR(orgId)
    setTimeout(async () => {
      const org = organizations.find((o) => o.id === orgId)
      if (org) {
        const qrData = `ORG|${org.id}|${org.name}|${org.network}`
        setQrCodeData(qrData)
        setShowQRModal(true)
        
        // Generate QR code after modal shows
        setTimeout(() => {
          const canvas = document.getElementById('qrcanvas') as HTMLCanvasElement
          if (canvas) {
            QRCode.toCanvas(canvas, qrData, {
              errorCorrectionLevel: 'H',
              type: 'image/png',
              quality: 0.95,
              margin: 1,
              width: 256,
            })
          }
        }, 100)
      }
      setGeneratingQR(null)
    }, 500)
  }

  const handleSaveOrganization = async () => {
    try {
      if (isEditingOrg && editingOrgId) {
        const updated = await updateOrganizationAPI(editingOrgId, orgData)
        setOrganizations((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
        setIsEditingOrg(false)
        setEditingOrgId(null)
      } else {
        const created = await createOrganizationAPI(orgData)
        setOrganizations((prev) => [created, ...prev])
      }
      setOrgData({ name: '', type: '', recordType: '', network: '', logo: '' })
      setIsOrgDialogOpen(false)
    } catch (err) {
      console.error('save org', err)
      alert('Organization save failed')
    }
  }

  const handleEditOrg = (org: Organization) => {
    setOrgData({ name: org.name, type: org.type, recordType: org.recordType, network: org.network, logo: org.logo || '' })
    setEditingOrgId(org.id)
    setIsEditingOrg(true)
    setIsOrgDialogOpen(true)
  }

  const handleDeleteNetwork = async (id: string) => {
    try {
      await deleteNetworkAPI(id)
      setNetworks((prev) => prev.filter((n) => n.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      console.error('delete network', err)
      alert('Delete failed')
    }
  }

  // when saving networks via existing UI, call createNetworkAPI/updateNetworkAPI:
  const handleSaveNetwork = async () => {
    if (!networkData.name || !networkData.ipAddress) return
    try {
      if (isEditingNetwork && editingNetworkId) {
        const updated = await updateNetworkAPI(editingNetworkId, networkData)
        setNetworks((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
        setIsEditingNetwork(false)
        setEditingNetworkId(null)
      } else {
        const created = await createNetworkAPI(networkData)
        setNetworks((prev) => [created, ...prev])
      }
      setNetworkData({ name: '', ipAddress: '' })
      setIsNetworkDialogOpen(false)
    } catch (err) {
      console.error('save network', err)
      alert('Network save failed')
    }
  }

  const filteredAttendance =
    statusFilter === "all" ? todayAttendance : todayAttendance.filter((a) => a.status === statusFilter)

  const stats = {
    total: todayAttendance.length,
    present: todayAttendance.filter((a) => a.status === "present").length,
    late: todayAttendance.filter((a) => a.status === "late").length,
  }

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br min-h-screen w-full">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Staff Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track attendance, manage organizations, and configure networks</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "attendance"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Attendance List
            </button>
            <button
              onClick={() => setActiveTab("organizations")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "organizations"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Organizations
            </button>
            <button
              onClick={() => setActiveTab("networks")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "networks"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Networks
            </button>
          </div>
        </div>

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm mb-2">
                  {selectedDate === new Date().toISOString().split('T')[0] 
                    ? "Today's Check-ins" 
                    : `Check-ins on ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm mb-2">Present</p>
                <p className="text-3xl font-bold text-green-600">{stats.present}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm mb-2">Late</p>
                <p className="text-3xl font-bold text-orange-600">{stats.late}</p>
              </div>
            </div>

            {/* Attendance Records */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Attendance Records</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsQRDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    Scan QR
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingAttendance(false)
                      setManualData({ profile: "👤", name: "", staffId: "", role: "", organization: "", room: "", shift: "" })
                      setIsManualDialogOpen(true)
                    }}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Record
                  </button>
                  <button
                    onClick={() => {
                      const pendingRecords = todayAttendance.filter(a => !a.approval || a.approval === 'pending')
                      if (pendingRecords.length === 0) {
                        alert('No pending attendance records to request permission for.')
                        return
                      }
                      pendingRecords.forEach(record => handleAskPermission(record.id))
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Ask Permission
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-4 flex gap-3 items-center flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                  />
                  <button
                    onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>

              {/* Records List */}
              <div className="overflow-x-auto">
                {filteredAttendance.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No attendance records found</p>
                  </div>
                ) : (
                  <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PROFILE</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NAME</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>STAFF ID</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROLE</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ORGANIZATION</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROOM</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>STATUS</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SHIFT</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CHECK IN/OUT</th>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>APPROVAL</th>
                        <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIONS</th>
                      </tr>
                    </thead>
<tbody style={{ backgroundColor: '#ffffff' }}>
  {filteredAttendance.map((record) => (
    <tr
      key={record.id}
      style={{ borderBottom: '1px solid #e2e8f0' }}
      className="hover:bg-gray-50 transition-colors"
    >
      <td style={{ padding: '16px', fontSize: '28px' }}>{record.profile}</td>

      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '400', color: '#0f172a' }}>
        {record.name}
      </td>

      <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
        {record.staffId}
      </td>

      <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
        {record.role}
      </td>

      <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
        {record.organization}
      </td>

      <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
        {record.room}
      </td>

      {/* ✅ STATUS BADGE */}
      <td style={{ padding: '16px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.025em',
            ...(record.status === "present"
              ? { backgroundColor: '#d1fae5', color: '#065f46' }
              : record.status === "late"
                ? { backgroundColor: '#fed7aa', color: '#9a3412' }
                : { backgroundColor: '#fee2e2', color: '#991b1b' })
          }}
        >
          {record.status === "present" && (
            <CheckCircle style={{ height: '12px', width: '12px', marginRight: '4px' }} />
          )}
          {record.status === "late" && (
            <AlertCircle style={{ height: '12px', width: '12px', marginRight: '4px' }} />
          )}
          {record.status}
        </span>
      </td>

      <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
        {record.shift}
      </td>

      <td style={{ padding: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>
          {record.checkInTime}
        </div>
        {record.checkOutTime && (
          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            {record.checkOutTime}
          </div>
        )}
      </td>

      {/* ✅ ADMIN APPROVAL DROPDOWN */}
      <td style={{ padding: '16px', textAlign: 'center' }}>
        <select
          value={record.approval || "pending"}
          onChange={(e) =>
            handleUpdateApproval(
              record.id,
              e.target.value as "pending" | "accepted" | "rejected"
            )
          }
          style={{
            padding: '5px 10px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor:
              record.approval === "accepted"
                ? "#dcfce7"
                : record.approval === "rejected"
                  ? "#fee2e2"
                  : "#ffedd5",
            color:
              record.approval === "accepted"
                ? "#166534"
                : record.approval === "rejected"
                  ? "#7f1d1d"
                  : "#9a3412",
            border: "1px solid #cbd5f5"
          }}
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </td>

      {/* ACTION BUTTONS */}
      <td style={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px'
          }}
        >
          <button
            onClick={() => handleEditAttendance(record)}
            style={{
              padding: '8px',
              color: '#9ca3af',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            className="hover:text-blue-600 hover:bg-blue-50"
            title="Edit"
          >
            <Edit style={{ height: '16px', width: '16px' }} />
          </button>

          {/* Ask Permission Button */}
          <button
            onClick={() => handleAskPermission(record.id)}
            style={{
              padding: '8px',
              color: record.approval === 'pending' ? '#f59e0b' : '#9ca3af',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              backgroundColor: record.approval === 'pending' ? '#fef3c7' : 'transparent'
            }}
            className="hover:text-orange-600 hover:bg-orange-50"
            title="Ask Permission"
          >
            <Send style={{ height: '16px', width: '16px' }} />
          </button>

          {!record.checkOutTime && (
            <button
              onClick={() => handleCheckOut(record.id)}
              style={{
                padding: '8px',
                color: '#9ca3af',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              className="hover:text-yellow-600 hover:bg-yellow-50"
              title="Check-Out"
            >
              <Clock style={{ height: '16px', width: '16px' }} />
            </button>
          )}

          <button
            onClick={() =>
              setDeleteConfirm({ type: "attendance", id: record.id })
            }
            style={{
              padding: '8px',
              color: '#9ca3af',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            className="hover:text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 style={{ height: '16px', width: '16px' }} />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === "organizations" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Organizations</h2>
              <button
                onClick={() => {
                  setIsEditingOrg(false)
                  setOrgData({ name: "", type: "", recordType: "", network: "", logo: "" })
                  setIsOrgDialogOpen(true)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Organization
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {organizations.map((org) => (
                <div key={org.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-2xl mb-2">{org.logo}</p>
                      <h3 className="font-semibold">{org.name}</h3>
                      <p className="text-sm text-gray-500">{org.type}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm mb-4">
                    <p>
                      <span className="font-medium">Record Type:</span> {org.recordType}
                    </p>
                    <p>
                      <span className="font-medium">Network:</span>{" "}
                      {networks.find((n) => n.id === org.network)?.name || org.network}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditOrg(org)}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1 justify-center"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleGenerateQR(org.id)}
                      disabled={generatingQR === org.id}
                      className="flex-1 px-3 py-1 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-50 flex items-center gap-1 justify-center"
                    >
                      <QrCode className="h-3 w-3" />
                      {generatingQR === org.id ? "..." : "QR"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: "organization", id: org.id })}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Networks Tab */}
        {activeTab === "networks" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Organization Networks</h2>
              <button
                onClick={() => {
                  setIsEditingNetwork(false)
                  setNetworkData({ name: "", ipAddress: "" })
                  setIsNetworkDialogOpen(true)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Network
              </button>
            </div>

            <div className="space-y-3">
              {networks.map((network) => (
                <div key={network.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{network.name}</h3>
                      <p className="text-sm text-gray-500">IP: {network.ipAddress}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditNetwork(network)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: "network", id: network.id })}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Scan Modal with Camera */}
      {isQRDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Scan Staff QR Code</h2>
              <button
                onClick={() => {
                  setIsQRDialogOpen(false)
                  setCameraActive(false)
                  setIPValidationError("")
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Use your camera or upload an image to scan the organization QR code
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Current Device IP</p>
                <p className="font-mono text-sm text-gray-900">{currentDeviceIP || 'Fetching...'}</p>
              </div>

              {scannedOrgData?.isScanned && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-1">✓ Organization Detected</p>
                  <p className="text-sm text-green-800">{scannedOrgData.orgName}</p>
                  <p className="text-xs text-green-700 mt-1">Network validated successfully</p>
                </div>
              )}

              {ipValidationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">⚠ Validation Error</p>
                    <p className="text-sm text-red-800">{ipValidationError}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  cameraActive
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Camera className="h-4 w-4" />
                {cameraActive ? 'Stop Camera' : 'Start Camera'}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Camera Feed */}
            {cameraActive && (
              <div className="mb-4">
                <p className="text-xs text-gray-600 text-center mb-2">Point camera at QR code</p>
                <video
                  ref={videoRef}
                  className="w-full rounded-lg bg-black"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            {/* Manual QR Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Or enter QR code data manually:</label>
              <input
                type="text"
                placeholder="ORG|1|Main Clinic|net1"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Format: ORG|orgId|orgName|networkId</p>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-2">
              <button
                onClick={() => handleQRScan()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Scan / Validate
              </button>
              <button
                onClick={() => {
                  setIsQRDialogOpen(false)
                  setCameraActive(false)
                  if (scannedOrgData?.isScanned) {
                    setIsManualDialogOpen(true)
                  }
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                {scannedOrgData?.isScanned ? 'Continue' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Display Modal */}
      {showQRModal && qrCodeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Generated QR Code</h2>
              <button
                onClick={() => {
                  setShowQRModal(false)
                  setQrCodeData(null)
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Scan this QR code during staff check-in
            </p>

            <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg">
              <canvas id="qrcanvas" />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-600 mb-1">QR Data:</p>
              <p className="text-xs font-mono text-gray-900 break-all">{qrCodeData}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const canvas = document.getElementById('qrcanvas') as HTMLCanvasElement
                  if (canvas) {
                    const link = document.createElement('a')
                    link.href = canvas.toDataURL()
                    link.download = `qr-code-${qrCodeData.split('|')[2]}.png`
                    link.click()
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={() => {
                  setShowQRModal(false)
                  setQrCodeData(null)
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {isManualDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditingAttendance ? "Edit Attendance" : "Add Attendance Record"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Profile Icon</label>
                <input
                  type="text"
                  value={manualData.profile}
                  onChange={(e) => setManualData({ ...manualData, profile: e.target.value })}
                  placeholder="👤"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={manualData.name}
                  onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Staff ID</label>
                <input
                  type="text"
                  value={manualData.staffId}
                  onChange={(e) => setManualData({ ...manualData, staffId: e.target.value })}
                  placeholder="S001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={manualData.role}
                  onChange={(e) => setManualData({ ...manualData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select role</option>
                  {staffRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Organization</label>
                <select
                  value={manualData.organization}
                  onChange={(e) => setManualData({ ...manualData, organization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.name}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Room</label>
                <input
                  type="text"
                  value={manualData.room}
                  onChange={(e) => setManualData({ ...manualData, room: e.target.value })}
                  placeholder="101"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shift</label>
                <select
                  value={manualData.shift}
                  onChange={(e) => setManualData({ ...manualData, shift: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select shift</option>
                  {shifts.map((shift) => (
                    <option key={shift} value={shift}>
                      {shift}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleManualEntry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {isEditingAttendance ? "Update Record" : "Add Record"}
              </button>
              <button
                onClick={() => setIsManualDialogOpen(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organization Modal */}
      {isOrgDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{isEditingOrg ? "Edit Organization" : "Add Organization"}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={orgData.name}
                  onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                  placeholder="Organization name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={orgData.type}
                  onChange={(e) => setOrgData({ ...orgData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select type</option>
                  <option value="Primary Care">Primary Care</option>
                  <option value="Dental">Dental</option>
                  <option value="Specialist">Specialist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Network</label>
                <select
                  value={orgData.network}
                  onChange={(e) => setOrgData({ ...orgData, network: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select network</option>
                  {networks.map((net) => (
                    <option key={net.id} value={net.id}>
                      {net.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Logo (emoji)</label>
                <input
                  type="text"
                  value={orgData.logo}
                  onChange={(e) => setOrgData({ ...orgData, logo: e.target.value })}
                  placeholder="🏥"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveOrganization}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {isEditingOrg ? "Update" : "Add"}
              </button>
              <button
                onClick={() => setIsOrgDialogOpen(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Network Modal */}
      {isNetworkDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{isEditingNetwork ? "Edit Network" : "Add Network"}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Network Name</label>
                <input
                  type="text"
                  value={networkData.name}
                  onChange={(e) => setNetworkData({ ...networkData, name: e.target.value })}
                  placeholder="Network name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IP Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={networkData.ipAddress}
                    onChange={(e) => setNetworkData({ ...networkData, ipAddress: e.target.value })}
                    placeholder="192.168.1.1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleFetchIP}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-2 rounded-lg"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveNetwork}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {isEditingNetwork ? "Update" : "Add"}
              </button>
              <button
                onClick={() => setIsNetworkDialogOpen(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h2 className="text-xl font-bold mb-4">Delete Record?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone. The record will be permanently deleted.</p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === "attendance") {
                    handleDeleteAttendance(deleteConfirm.id)
                  } else if (deleteConfirm.type === "organization") {
                    handleDeleteOrg(deleteConfirm.id)
                  } else if (deleteConfirm.type === "network") {
                    handleDeleteNetwork(deleteConfirm.id)
                  }
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}