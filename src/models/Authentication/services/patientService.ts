// lib/services/patientService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  status: "active" | "inactive";
  lastVisit: string;
  address?: string;
  gender?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  medicalHistory?: Array<{
    condition: string;
    diagnosis: string;
    date: string;
  }>;
}

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  recentPatients: number;
  genderStats: Record<string, number>;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationData;
}

class PatientService {
  private async fetchAPI<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Patient CRUD operations
  async getPatients(params?: {
    search?: string;
    status?: "all" | "active" | "inactive";
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Patient[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status && params.status !== "all") queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    
    const queryString = queryParams.toString();
    return this.fetchAPI<Patient[]>(`/patients${queryString ? `?${queryString}` : ""}`);
  }

  async getPatient(id: string): Promise<ApiResponse<Patient>> {
    return this.fetchAPI<Patient>(`/patients/${id}`);
  }

  async createPatient(patientData: Partial<Patient> & { userId: string }): Promise<ApiResponse<Patient>> {
    const patientCode = `P${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
    
    return this.fetchAPI<Patient>("/patients", {
      method: "POST",
      body: JSON.stringify({
        patientCode,
        ...patientData,
      }),
    });
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<ApiResponse<Patient>> {
    return this.fetchAPI<Patient>(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id: string): Promise<ApiResponse<void>> {
    return this.fetchAPI<void>(`/patients/${id}`, {
      method: "DELETE",
    });
  }

  async getPatientStats(): Promise<ApiResponse<PatientStats>> {
    return this.fetchAPI<PatientStats>("/patients/stats");
  }

  // User operations for patients
  async createPatientUser(userData: {
    username: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse<any>> {
    return this.fetchAPI<any>("/users/patients", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getPatientUsers(params?: {
    search?: string;
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append("search", params.search);
    if (params?.isVerified !== undefined) queryParams.append("isVerified", params.isVerified.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    
    const queryString = queryParams.toString();
    return this.fetchAPI<any[]>(`/users/patients${queryString ? `?${queryString}` : ""}`);
  }
}

export const patientService = new PatientService();