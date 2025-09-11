import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import ReportForm from '../components/ReportForm';
import { reportService } from '../services/reportService';


const Reports: React.FC = () => {
    const { user, token } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);


    // Crear nuevo reporte
    const handleSubmitReport = async (formData: FormData) => {
        if (!token) return;

        try {
            setIsSubmitting(true);
            setMessage(null);

            await reportService.createReport(token, formData);
            setMessage({ type: 'success', text: 'Reporte creado exitosamente' });

            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        } catch (error) {
            console.error('Error creating report:', error);
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Error al crear el reporte'
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-100 mb-4">Acceso Denegado</h1>
                    <p className="text-gray-300">Debes iniciar sesión para ver los reportes</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-100">Reportes</h1>
                    <p className="mt-2 text-gray-300">Gestiona y crea reportes de empleados</p>
                </div>

                {/* Mensaje de estado */}
                {message && (
                    <div className={`mb-6 p-4 rounded-md ${message.type === 'success'
                        ? 'bg-green-900/50 border border-green-700 text-green-300'
                        : 'bg-red-900/50 border border-red-700 text-red-300'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="max-w-4xl mx-auto">
                    <ReportForm onSubmit={handleSubmitReport} isLoading={isSubmitting} />
                </div>
            </div>
        </div>
    );
};

export default Reports;
