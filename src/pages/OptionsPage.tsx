import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { supabase } from '../lib/supabase';
import { useThemeStore } from '../stores/themeStore';
import ColorPicker from '../components/ui/ColorPicker';
import toast from 'react-hot-toast';
import { 
  Building2, 
  User, 
  Palette, 
  Globe, 
  Clock, 
  DollarSign,
  Save,
  Upload,
  Camera
} from 'lucide-react';

const OptionsPage: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useBusinessSettings();
  const { theme, setTheme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('business');
  
  // Business settings state
  const [businessData, setBusinessData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    logo_url: '',
    primary_color: '#0d9488',
    currency: 'HNL',
    language: 'es',
    date_format: 'DD/MM/YYYY',
    time_format: 'HH:mm',
    theme: 'light',
    notification_type: 'sound'
  });

  // User profile state
  const [userProfile, setUserProfile] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user?.business) {
      setBusinessData({
        name: user.business.name || '',
        email: user.business.email || '',
        phone: user.business.phone || '',
        address: user.business.address || '',
        city: user.business.city || '',
        country: user.business.country || '',
        logo_url: user.business.logo_url || '',
        primary_color: user.business.primary_color || '#0d9488',
        currency: user.business.currency || 'HNL',
        language: user.business.language || 'es',
        date_format: user.business.date_format || 'DD/MM/YYYY',
        time_format: user.business.time_format || 'HH:mm',
        theme: user.business.theme || 'light',
        notification_type: user.business.notification_type || 'sound'
      });
    }

    if (user) {
      setUserProfile({
        full_name: user.full_name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);

  const handleBusinessUpdate = async () => {
    if (!user?.business_id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', user.business_id);

      if (error) throw error;

      toast.success('Configuración del negocio actualizada');
    } catch (error: any) {
      toast.error('Error al actualizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: userProfile.full_name,
          avatar_url: userProfile.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Perfil actualizado');
    } catch (error: any) {
      toast.error('Error al actualizar perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'business', label: 'Negocio', icon: Building2 },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'localization', label: 'Localización', icon: Globe }
  ];

  return (
    <div className="space-y-6 md:ml-32 pt-4 md:pt-0 md:-mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">
          {(() => {
            const formattedDate = format(new Date(), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es });
            const parts = formattedDate.split(',');
            if (parts.length > 0) {
              const day = parts[0];
              const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
              return [capitalizedDay, ...parts.slice(1)].join(',');
            }
            return formattedDate;
          })()}
        </h1>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="card">
            {activeTab === 'business' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Información del Negocio</h2>
                  <button
                    onClick={handleBusinessUpdate}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Nombre del Negocio</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={businessData.name}
                      onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Correo Electrónico</label>
                    <input
                      type="email"
                      className="input w-full"
                      value={businessData.email}
                      onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Teléfono</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={businessData.phone}
                      onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Dirección</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={businessData.address}
                      onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Ciudad</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={businessData.city}
                      onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">País</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={businessData.country}
                      onChange={(e) => setBusinessData({ ...businessData, country: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Logo del Negocio</label>
                  <div className="flex items-center gap-4">
                    {businessData.logo_url && (
                      <img
                        src={businessData.logo_url}
                        alt="Logo"
                        className="h-16 w-16 object-cover rounded-md border"
                      />
                    )}
                    <button className="btn-outline flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Subir Logo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Perfil de Usuario</h2>
                  <button
                    onClick={handleUserUpdate}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Nombre Completo</label>
                    <input
                      type="text"
                      className="input w-full"
                      value={userProfile.full_name}
                      onChange={(e) => setUserProfile({ ...userProfile, full_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Correo Electrónico</label>
                    <input
                      type="email"
                      className="input w-full"
                      value={userProfile.email}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      El correo no se puede cambiar desde aquí
                    </p>
                  </div>
                </div>

                <div>
                  <label className="label">Foto de Perfil</label>
                  <div className="flex items-center gap-4">
                    {userProfile.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt="Avatar"
                        className="h-16 w-16 object-cover rounded-full border"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <button className="btn-outline flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Subir Foto
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Información del Rol</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rol actual: <span className="font-medium capitalize">{user?.role}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Para cambiar roles, contacta a un administrador.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Apariencia</h2>
                  <button
                    onClick={handleBusinessUpdate}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="label">Tema</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setTheme('light');
                          setBusinessData({ ...businessData, theme: 'light' });
                        }}
                        className={`p-4 border rounded-md flex items-center gap-2 ${
                          theme === 'light' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                        Claro
                      </button>
                      <button
                        onClick={() => {
                          setTheme('dark');
                          setBusinessData({ ...businessData, theme: 'dark' });
                        }}
                        className={`p-4 border rounded-md flex items-center gap-2 ${
                          theme === 'dark' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded"></div>
                        Oscuro
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="label">Color Principal</label>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-md border"
                        style={{ backgroundColor: businessData.primary_color }}
                      ></div>
                      <div className="w-64">
                        <ColorPicker
                          color={businessData.primary_color}
                          onChange={(color) => setBusinessData({ ...businessData, primary_color: color })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label">Tipo de Notificación</label>
                    <select
                      className="input w-full"
                      value={businessData.notification_type}
                      onChange={(e) => setBusinessData({ ...businessData, notification_type: e.target.value })}
                    >
                      <option value="sound">Sonido</option>
                      <option value="visual">Visual</option>
                      <option value="both">Ambos</option>
                      <option value="none">Ninguno</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'localization' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Configuración Regional</h2>
                  <button
                    onClick={handleBusinessUpdate}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Moneda
                    </label>
                    <select
                      className="input w-full"
                      value={businessData.currency}
                      onChange={(e) => setBusinessData({ ...businessData, currency: e.target.value })}
                    >
                      <option value="HNL">Lempira (HNL)</option>
                      <option value="USD">Dólar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="MXN">Peso Mexicano (MXN)</option>
                      <option value="GTQ">Quetzal (GTQ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="label flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Idioma
                    </label>
                    <select
                      className="input w-full"
                      value={businessData.language}
                      onChange={(e) => setBusinessData({ ...businessData, language: e.target.value })}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Formato de Fecha</label>
                    <select
                      className="input w-full"
                      value={businessData.date_format}
                      onChange={(e) => setBusinessData({ ...businessData, date_format: e.target.value })}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="label flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Formato de Hora
                    </label>
                    <select
                      className="input w-full"
                      value={businessData.time_format}
                      onChange={(e) => setBusinessData({ ...businessData, time_format: e.target.value })}
                    >
                      <option value="HH:mm">24 horas (HH:mm)</option>
                      <option value="hh:mm A">12 horas (hh:mm AM/PM)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Vista Previa
                  </h3>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <p>Fecha: {format(new Date(), businessData.date_format === 'DD/MM/YYYY' ? 'dd/MM/yyyy' : businessData.date_format === 'MM/DD/YYYY' ? 'MM/dd/yyyy' : 'yyyy-MM-dd')}</p>
                    <p>Hora: {format(new Date(), businessData.time_format === 'HH:mm' ? 'HH:mm' : 'hh:mm a')}</p>
                    <p>Moneda: {new Intl.NumberFormat('es-HN', { style: 'currency', currency: businessData.currency }).format(1234.56)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsPage;