import { validatePassword } from '../utils/validations';

interface PasswordStrengthIndicatorProps {
    password: string;
    className?: string;
}

export default function PasswordStrengthIndicator({ password, className = '' }: PasswordStrengthIndicatorProps) {
    const { strength, message } = validatePassword(password);

    if (!password) return null;

    const getStrengthColor = (strength: number) => {
        if (strength < 2) return 'bg-red-500';
        if (strength < 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = (strength: number) => {
        if (strength < 2) return 'Muy débil';
        if (strength < 4) return 'Débil';
        if (strength < 5) return 'Media';
        return 'Fuerte';
    };

    const getTextColor = (strength: number) => {
        if (strength < 2) return 'text-red-400';
        if (strength < 4) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <div className={`mt-2 ${className}`}>
            <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                        <div
                            key={level}
                            className={`h-1 w-8 rounded-full transition-all duration-300 ${level <= strength ? getStrengthColor(strength) : 'bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
                <span className={`text-xs font-medium ${getTextColor(strength)}`}>
                    {getStrengthText(strength)}
                </span>
            </div>
            <p className={`text-xs mt-1 ${getTextColor(strength)}`}>
                {message}
            </p>
        </div>
    );
}
