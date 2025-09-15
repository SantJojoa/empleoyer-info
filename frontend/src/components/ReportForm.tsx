import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { reportService, type Employee } from '../services/reportService';
import { useDebounce } from '../hooks/useDebounce';

interface ReportFormData {
    documentNumber: string;
    firstName: string;
    lastName: string;
    industry: string;
    description: string;
    incidentDate: string;
    city: string;
    evidence: File | null;
}

interface ReportFormErrors {
    documentNumber?: string;
    firstName?: string;
    lastName?: string;
    industry?: string;
    description?: string;
    incidentDate?: string;
    city?: string;
    evidence?: string;
}

interface ReportFormProps {
    onSubmit: (data: FormData) => void;
    isLoading?: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, isLoading = false }) => {
    const { user, token } = useUser();
    const [formData, setFormData] = useState<ReportFormData>({
        documentNumber: '',
        firstName: '',
        lastName: '',
        industry: '',
        description: '',
        incidentDate: '',
        city: '',
        evidence: null
    });
    const [errors, setErrors] = useState<ReportFormErrors>({});
    const [isSearching, setIsSearching] = useState(false);
    const [employeeFound, setEmployeeFound] = useState<Employee | null>(null);

    // Debounce para la búsqueda de empleados
    const debouncedDocumentNumber = useDebounce(formData.documentNumber, 500);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error cuando el usuario empiece a escribir
        if (errors[name as keyof ReportFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            evidence: file
        }));

        if (errors.evidence) {
            setErrors(prev => ({
                ...prev,
                evidence: undefined
            }));
        }
    };

    const searchEmployee = useCallback(async (documentNumber: string) => {
        if (!token || !documentNumber.trim()) return;

        try {
            setIsSearching(true);
            const employee = await reportService.searchEmployee(token, documentNumber);

            if (employee) {
                // Empleado encontrado, autocompletar datos
                setFormData(prev => ({
                    ...prev,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    city: employee.city,
                    industry: employee.industry || ''
                }));
                setEmployeeFound(employee);
            } else {
                // Empleado no encontrado, limpiar campos
                setFormData(prev => ({
                    ...prev,
                    firstName: '',
                    lastName: '',
                    city: '',
                    industry: ''
                }));
                setEmployeeFound(null);
            }
        } catch (error) {
            console.error('Error buscando empleado:', error);
            setEmployeeFound(null);
        } finally {
            setIsSearching(false);
        }
    }, [token]);

    // Efecto para buscar empleado cuando cambie la cédula (con debounce)
    useEffect(() => {
        if (debouncedDocumentNumber.trim().length >= 5) {
            searchEmployee(debouncedDocumentNumber);
        } else if (debouncedDocumentNumber.trim().length === 0) {
            // Si la cédula está vacía, limpiar datos
            setFormData(prev => ({
                ...prev,
                firstName: '',
                lastName: '',
                city: '',
                industry: ''
            }));
            setEmployeeFound(null);
        }
    }, [debouncedDocumentNumber, token, searchEmployee]);

    const handleDocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            documentNumber: value
        }));

        // Limpiar error
        if (errors.documentNumber) {
            setErrors(prev => ({
                ...prev,
                documentNumber: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ReportFormErrors = {};

        if (!formData.documentNumber.trim()) {
            newErrors.documentNumber = 'La cédula del empleado es requerida';
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'El nombre del empleado es requerido';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'El apellido del empleado es requerido';
        }

        if (!formData.industry.trim()) {
            newErrors.industry = 'La industria del empleado es requerida';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es requerida';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'La descripción debe tener al menos 10 caracteres';
        }

        if (!formData.incidentDate) {
            newErrors.incidentDate = 'La fecha del incidente es requerida';
        } else {
            const incidentDate = new Date(formData.incidentDate);
            const today = new Date();
            if (incidentDate > today) {
                newErrors.incidentDate = 'La fecha del incidente no puede ser futura';
            }
        }

        if (!formData.city.trim()) {
            newErrors.city = 'La ciudad es requerida';
        }

        if (!formData.evidence) {
            newErrors.evidence = 'Debe adjuntar evidencia del incidente';
        } else {
            // Validar tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
            if (!allowedTypes.includes(formData.evidence.type)) {
                newErrors.evidence = 'Solo se permiten archivos JPG, PNG, GIF o PDF';
            }

            // Validar tamaño (máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (formData.evidence.size > maxSize) {
                newErrors.evidence = 'El archivo no puede ser mayor a 5MB';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Crear FormData para enviar archivos
        const submitData = new FormData();
        submitData.append('documentNumber', formData.documentNumber);
        submitData.append('firstName', formData.firstName);
        submitData.append('lastName', formData.lastName);
        submitData.append('industry', formData.industry);
        submitData.append('description', formData.description);
        submitData.append('incidentDate', formData.incidentDate);
        submitData.append('city', formData.city);
        if (formData.evidence) {
            submitData.append('evidence', formData.evidence);
        }


        onSubmit(submitData);
    };

    if (!user) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-300">Debes iniciar sesión para crear un reporte</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700/50 p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Crear Nuevo Reporte</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cédula del Empleado */}
                <div>
                    <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-300 mb-2">
                        Cédula del Empleado *
                    </label>
                    <div className="relative flex gap-2">
                        <input
                            type="text"
                            id="documentNumber"
                            name="documentNumber"
                            value={formData.documentNumber}
                            onChange={handleDocumentNumberChange}
                            className={`flex-1 px-3 py-2 bg-gray-700/50 border rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.documentNumber ? 'border-red-500' : 'border-gray-600'
                                }`}
                            placeholder="Ingresa la cédula del empleado"
                        />


                        <button
                            type="button"
                            onClick={() => searchEmployee(formData.documentNumber)}
                            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer'
                            disabled={isSearching || !formData.documentNumber.trim()}
                            title='Buscar empleado'
                            aria-label='Buscar empleado por cédula'
                        >
                            {isSearching ? 'Buscando...' : 'Buscar'}
                        </button>

                        {isSearching && (
                            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
                            </div>
                        )}


                    </div>
                    {errors.documentNumber && (
                        <p className="mt-1 text-sm text-red-400">{errors.documentNumber}</p>
                    )}
                    {employeeFound && (
                        <p className="mt-1 text-sm text-green-400">✓ Empleado encontrado en la base de datos</p>
                    )}
                </div>

                {/* Nombre del Empleado */}
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre del Empleado *
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-700/50 border rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-600'
                            }`}
                        placeholder="Nombre del empleado"
                    />
                    {errors.firstName && (
                        <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                    )}
                </div>

                {/* Apellido del Empleado */}
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                        Apellido del Empleado *
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-700/50 border rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-600'
                            }`}
                        placeholder="Apellido del empleado"
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                    )}
                </div>

                {/* Industria del Empleado */}
                <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                        Industria del Empleado *
                    </label>
                    <input
                        type="text"
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-700/50 border rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.industry ? 'border-red-500' : 'border-gray-600'
                            }`}
                        placeholder="Industria o sector del empleado"
                    />
                    {errors.industry && (
                        <p className="mt-1 text-sm text-red-400">{errors.industry}</p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción del Incidente *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-3 py-2 bg-gray-700/50 border rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-600'
                            }`}
                        placeholder="Describe detalladamente el incidente ocurrido..."
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                    )}
                </div>

                {/* Fecha del Incidente */}
                <div>
                    <label htmlFor="incidentDate" className="block text-sm font-medium text-gray-300 mb-2">
                        Fecha del Incidente *
                    </label>
                    <input
                        type="date"
                        id="incidentDate"
                        name="incidentDate"
                        value={formData.incidentDate}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-700/50 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.incidentDate ? 'border-red-500' : 'border-gray-600'
                            }`}
                    />
                    {errors.incidentDate && (
                        <p className="mt-1 text-sm text-red-400">{errors.incidentDate}</p>
                    )}
                </div>

                {/* Ciudad */}
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                        Ciudad *
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-700/50 border rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-600'
                            }`}
                        placeholder="Ciudad donde ocurrió el incidente"
                    />
                    {errors.city && (
                        <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                    )}
                </div>

                {/* Evidencia */}
                <div>
                    <label htmlFor="evidence" className="block text-sm font-medium text-gray-300 mb-2">
                        Evidencia (Imagen o PDF) *
                    </label>
                    <input
                        type="file"
                        id="evidence"
                        name="evidence"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className={`w-full px-3 py-2 bg-gray-700/50 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.evidence ? 'border-red-500' : 'border-gray-600'
                            }`}
                    />
                    <p className="mt-1 text-sm text-gray-400">
                        Formatos permitidos: JPG, PNG, GIF, PDF. Tamaño máximo: 5MB
                    </p>
                    {errors.evidence && (
                        <p className="mt-1 text-sm text-red-400">{errors.evidence}</p>
                    )}
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                documentNumber: '',
                                firstName: '',
                                lastName: '',
                                industry: '',
                                description: '',
                                incidentDate: '',
                                city: '',
                                evidence: null
                            });
                            setErrors({});
                            setEmployeeFound(null);
                            // Limpiar el input de archivo
                            const fileInput = document.getElementById('evidence') as HTMLInputElement;
                            if (fileInput) {
                                fileInput.value = '';
                            }
                        }}
                        className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        Limpiar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? 'Enviando...' : 'Crear Reporte'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportForm;
