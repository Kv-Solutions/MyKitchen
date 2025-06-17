import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail } from 'lucide-react';

type LoginFormInputs = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onShowRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onShowRegister }) => {
  const { signIn, loading } = useAuth();
  const { 
    register, 
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginFormInputs>();
  
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Error al iniciar sesión'
      });
    }
  };
  
  return (
    <div className="w-full max-w-sm p-8 space-y-5 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Iniciar Sesión
        </h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="p-3 text-sm text-danger-800 bg-danger-100 rounded-md dark:text-danger-400 dark:bg-danger-900/30">
            {errors.root.message}
          </div>
        )}
        
        <div className="space-y-1">
          <label htmlFor="email" className="label">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              className={`input pl-10 w-full ${errors.email ? 'border-red-500' : ''}`}
              placeholder="ejemplo@correo.com"
              disabled={loading}
              {...register('email', { 
                required: 'El correo es requerido',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Formato de correo inválido'
                }
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="password" className="label">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              className={`input pl-10 w-full ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
              disabled={loading}
              {...register('password', { 
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-green-300 text-green-600 focus:ring-green-500"
              disabled={loading}
            />
            <label htmlFor="remember-me" className="ml-1 block text-sm text-gray-700 dark:text-gray-300">
              Recordarme
            </label>
          </div>
          
          <a href="#" className="ml-13 text-xs md:text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onShowRegister}
            className="btn-secondary w-full flex items-center justify-center"
            disabled={loading}
          >
            Regístrate
          </button>
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};