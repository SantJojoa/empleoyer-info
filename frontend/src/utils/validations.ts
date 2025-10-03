// Utilidades de validación para formularios

// Regex patterns
export const VALIDATION_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    cedulaColombia: /^[0-9]{6,10}$/,
    phone: /^(\+57|57)?[0-9]{10}$/,
    onlyLetters: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
};

// Validaciones de email
export const validateEmail = (email: string): { isValid: boolean; message: string } => {
    if (!email.trim()) {
        return { isValid: false, message: 'El email es requerido' };
    }

    if (!VALIDATION_PATTERNS.email.test(email)) {
        return { isValid: false, message: 'Formato de email inválido' };
    }

    return { isValid: true, message: '' };
};

// Validaciones de contraseña
export const validatePassword = (password: string): { isValid: boolean; message: string; strength: number } => {
    if (!password.trim()) {
        return { isValid: false, message: 'La contraseña es requerida', strength: 0 };
    }

    if (password.length < 8) {
        return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres', strength: 0 };
    }

    let strength = 0;
    let message = '';

    // Verificar longitud
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Verificar caracteres
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    // Determinar mensaje basado en fortaleza
    if (strength < 3) {
        message = 'Contraseña débil';
    } else if (strength < 5) {
        message = 'Contraseña media';
    } else {
        message = 'Contraseña fuerte';
    }

    const isValid = strength >= 3;

    return { isValid, message, strength };
};

// Validación de confirmación de contraseña
export const validatePasswordConfirmation = (password: string, confirmPassword: string): { isValid: boolean; message: string } => {
    if (!confirmPassword.trim()) {
        return { isValid: false, message: 'Confirma tu contraseña' };
    }

    if (password !== confirmPassword) {
        return { isValid: false, message: 'Las contraseñas no coinciden' };
    }

    return { isValid: true, message: '' };
};

// Validaciones de datos personales
export const validateName = (name: string, fieldName: string): { isValid: boolean; message: string } => {
    if (!name.trim()) {
        return { isValid: false, message: `${fieldName} es requerido` };
    }

    if (!VALIDATION_PATTERNS.onlyLetters.test(name)) {
        return { isValid: false, message: `${fieldName} solo puede contener letras` };
    }

    if (name.trim().length < 2) {
        return { isValid: false, message: `${fieldName} debe tener al menos 2 caracteres` };
    }

    return { isValid: true, message: '' };
};

// Validación de cédula colombiana
export const validateCedula = (cedula: string): { isValid: boolean; message: string } => {
    if (!cedula.trim()) {
        return { isValid: false, message: 'La cédula es requerida' };
    }

    // Remover espacios y guiones
    const cleanCedula = cedula.replace(/[\s-]/g, '');

    if (!VALIDATION_PATTERNS.cedulaColombia.test(cleanCedula)) {
        return { isValid: false, message: 'Formato de cédula inválido (6-10 dígitos)' };
    }

    return { isValid: true, message: '' };
};

// Validación de teléfono colombiano
export const validatePhone = (phone: string): { isValid: boolean; message: string } => {
    if (!phone.trim()) {
        return { isValid: false, message: 'El teléfono es requerido' };
    }

    // Remover espacios, guiones y paréntesis
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    if (!VALIDATION_PATTERNS.phone.test(cleanPhone)) {
        return { isValid: false, message: 'Formato de teléfono inválido (ej: +57 300 123 4567)' };
    }

    return { isValid: true, message: '' };
};

// Validación de fecha de nacimiento
export const validateBirthDate = (birthDate: string): { isValid: boolean; message: string } => {
    if (!birthDate) {
        return { isValid: false, message: 'La fecha de nacimiento es requerida' };
    }

    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Ajustar edad si el cumpleaños no ha pasado este año
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;

    if (birth > today) {
        return { isValid: false, message: 'La fecha de nacimiento no puede ser futura' };
    }

    if (actualAge < 18) {
        return { isValid: false, message: 'Debes tener al menos 18 años para registrarte' };
    }

    return { isValid: true, message: '' };
};

// Sanitización de entrada
export const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
};

// Función para verificar si un email ya está registrado
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; message: string }> => {
    try {
        // Aquí harías la llamada al backend para verificar si el email existe
        // Por ahora retornamos false para no bloquear el desarrollo
        return { exists: false, message: '' };
    } catch (error) {
        return { exists: false, message: 'Error al verificar el email' };
    }
};

// Función para verificar si una cédula ya está registrada
export const checkCedulaExists = async (cedula: string): Promise<{ exists: boolean; message: string }> => {
    try {
        // Aquí harías la llamada al backend para verificar si la cédula existe
        // Por ahora retornamos false para no bloquear el desarrollo
        return { exists: false, message: '' };
    } catch (error) {
        return { exists: false, message: 'Error al verificar la cédula' };
    }
};
