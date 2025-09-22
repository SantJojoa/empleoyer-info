const API_BASE_URL = 'http://localhost:3000';

export interface Employee {
    id: number;
    documentNumber: string;
    firstName: string;
    lastName: string;
    city: string;
    status: string;
    industry: string;
}

export interface Report {
    id: number;
    employeeId: number;
    description: string;
    incidentDate: string;
    city: string;
    evidenceUrl: string;
    status: string;
    createdAt: string;
    User: {
        firstName: string;
        lastName: string;
    };
    Employee: {
        firstName: string;
        lastName: string;
    } | null;
}

export interface CreateReportData {
    documentNumber: string;
    firstName: string;
    lastName: string;
    industry: string;
    description: string;
    incidentDate: string;
    city: string;
    evidence: File;
}

export interface ReportWithEmployer {
    id: number;
    description: string;
    incidentDate: string;
    city: string;
    evidenceUrl: string | null;
    status: string;
    createdAt: string;
    User: {
        firstName: string;
        lastName: string;
        documentNumber: string;
        email: string;
    };
}

export interface EmployeeWithReports extends Employee {
    Reports: ReportWithEmployer[];
}



class ReportService {
    private getAuthHeaders(token: string) {
        return {
            'Authorization': `Bearer ${token}`,
        };
    }

    async getReports(token: string): Promise<Report[]> {
        const response = await fetch(`${API_BASE_URL}/reports`, {
            headers: {
                ...this.getAuthHeaders(token),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al cargar los reportes');
        }

        return response.json();
    }

    async searchEmployee(token: string, documentNumber: string): Promise<Employee | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/search/${documentNumber}`, {
                headers: this.getAuthHeaders(token),
            });

            if (response.status === 404) {
                return null; // Empleado no encontrado
            }

            if (!response.ok) {
                throw new Error('Error al buscar empleado');
            }

            return response.json();
        } catch (error) {
            throw error;
        }
    }

    async createReport(token: string, formData: FormData): Promise<Report> {
        const response = await fetch(`${API_BASE_URL}/reports`, {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear el reporte');
        }

        return response.json();
    }

    async searchEmployeeWithReports(token: string, documentNumber: string): Promise<EmployeeWithReports | null> {
        const response = await fetch(`${API_BASE_URL}/employees/search/${documentNumber}/reports`, {
            headers: this.getAuthHeaders(token),
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Error al buscar empleado con reportes');
        }

        return response.json();
    }
}

export const reportService = new ReportService();
