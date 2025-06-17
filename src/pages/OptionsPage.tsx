import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { RiAlarmFill } from 'react-icons/ri';
import { MdOutlineDriveFileRenameOutline, MdDelete } from 'react-icons/md';
import { IoMdBusiness } from 'react-icons/io';
import { FaMapLocationDot, FaTreeCity } from 'react-icons/fa6';
import { BiWorld, BiSolidBank } from 'react-icons/bi';
import { MdOutlineEmail } from 'react-icons/md';
import { HiColorSwatch } from 'react-icons/hi';
import { BsCurrencyExchange, BsFillInfoCircleFill, BsCalendarDateFill } from 'react-icons/bs';
import { FaUserGear, FaUserPlus } from 'react-icons/fa6';
import { FaPhoneAlt, FaUpload } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import ColorPicker from '../components/ui/ColorPicker';

interface Employee {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'cashier' | 'chef';
  is_active: boolean;
  created_at: string;
}

const OptionsPage: React.FC = () => {
  const { user } = useAuth();
  const [isBusinessInfoOpen, setIsBusinessInfoOpen] = useState(false);
  const [hasBusinessInfoChanged, setHasBusinessInfoChanged] = useState(false);
  const [hasRegionalFormatChanged, setHasRegionalFormatChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  // Business info states
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessLogo, setBusinessLogo] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState('');
  
  // Employee config states
  const [isEmployeeConfigOpen, setIsEmployeeConfigOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeRole, setEmployeeRole] = useState<string>('');
  const [employeeEmail, setEmployeeEmail] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);

  // Regional format states
  const [isRegionalFormatOpen, setIsRegionalFormatOpen] = useState(false);
  const saveRegionalFormatData = async () => {
    if (!user?.business_id) {
      toast.error('No se encontró información del negocio');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        date_format: dateFormat || null,
        time_format: timeFormat || null,
        currency_format: currencyFormat || null,
      };

      const { error } = await supabase
        .from('businesses')
        .update(updateData)
        .eq('id', user.business_id);

      if (error) {
        console.error('Error saving regional format data:', error);
        toast.error('Error al guardar los datos de formato regional');
        return;
      }

      toast.success('Datos de formato regional guardados correctamente');
      setHasRegionalFormatChanged(false);
    } catch (error) {
      console.error('Error saving regional format data:', error);
      toast.error('Error al guardar los datos de formato regional');
    } finally {
      setSaving(false);
    }
  };

  // Customize App states
  const [isCustomizeAppOpen, setIsCustomizeAppOpen] = useState(false);
  const [isRecordatoriosOpen, setIsRecordatoriosOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [reminders, setReminders] = useState<{ name: string; date: string }[]>([]);

  const handleDeleteReminder = (indexToDelete: number) => {
    setReminders(currentReminders => currentReminders.filter((_, index) => index !== indexToDelete));
  };
  const [appThemeColor, setAppThemeColor] = useState<string>('#000000');
  const [notificationType, setNotificationType] = useState('');
  const [voiceType, setVoiceType] = useState('');

  const toggleCustomizeApp = () => {
    setIsCustomizeAppOpen(!isCustomizeAppOpen);
  };

  const toggleRecordatorios = () => {
    setIsRecordatoriosOpen(!isRecordatoriosOpen);
  };

  const handleAppThemeColorChange = (color: string) => {
    setAppThemeColor(color);
    setHasBusinessInfoChanged(true);
  };
  const [dateFormat, setDateFormat] = useState<string>('');
  const [timeFormat, setTimeFormat] = useState<string>('');
  const [currencyFormat, setCurrencyFormat] = useState<string>('');

  const countryPrefixes: { [key: string]: string } = {
    "Canadá": "+1",
    "Estados Unidos": "+1",
    "México": "+52",
    "Belice": "+501",
    "Costa Rica": "+506",
    "El Salvador": "+503",
    "Guatemala": "+502",
    "Honduras": "+504",
    "Nicaragua": "+505",
    "Panamá": "+507",
    "Argentina": "+54",
    "Bolivia": "+591",
    "Brasil": "+55",
    "Chile": "+56",
    "Colombia": "+57",
    "Ecuador": "+593",
    "Paraguay": "+595",
    "Perú": "+51",
    "Uruguay": "+598",
    "Venezuela": "+58",
  };

  const countryCurrencies: { [key: string]: { symbol: string; name: string; region: string }[] } = {
    "Canadá": [{ symbol: "CA$", name: "Dólar Canadiense", region: "Norteamérica" }],
    "Estados Unidos": [{ symbol: "US$", name: "Dólar Estadounidense", region: "Norteamérica" }],
    "México": [{ symbol: "MX$", name: "Peso Mexicano", region: "Norteamérica" }],
    "Belice": [{ symbol: "BZ$", name: "Dólar Beliceño", region: "Centroamérica" }],
    "Costa Rica": [{ symbol: "₡", name: "Colón Costarricense", region: "Centroamérica" }],
    "El Salvador": [{ symbol: "$", name: "Dólar Estadounidense", region: "Centroamérica" }],
    "Guatemala": [{ symbol: "Q", name: "Quetzal Guatemalteco", region: "Centroamérica" }],
    "Honduras": [{ symbol: "L", name: "Lempira Hondureña", region: "Centroamérica" }],
    "Nicaragua": [{ symbol: "C$", name: "Córdoba Nicaragüense", region: "Centroamérica" }],
    "Panamá": [{ symbol: "B/.", name: "Balboa Panameño", region: "Centroamérica" }],
    "Argentina": [{ symbol: "$", name: "Peso Argentino", region: "Sudamérica" }],
    "Bolivia": [{ symbol: "Bs.", name: "Boliviano", region: "Sudamérica" }],
    "Brasil": [{ symbol: "R$", name: "Real Brasileño", region: "Sudamérica" }],
    "Chile": [{ symbol: "$", name: "Peso Chileno", region: "Sudamérica" }],
    "Colombia": [{ symbol: "$", name: "Peso Colombiano", region: "Sudamérica" }],
    "Ecuador": [{ symbol: "$", name: "Dólar Estadounidense", region: "Sudamérica" }],
    "Paraguay": [{ symbol: "₲", name: "Guaraní Paraguayo", region: "Sudamérica" }],
    "Perú": [{ symbol: "S/.", name: "Sol Peruano", region: "Sudamérica" }],
    "Uruguay": [{ symbol: "$", name: "Peso Uruguayo", region: "Sudamérica" }],
    "Venezuela": [{ symbol: "Bs.S", name: "Bolívar Soberano", region: "Sudamérica" }],
  };

  // Load business data when component mounts
  useEffect(() => {
    if (user?.business_id) {
      loadBusinessData();
      loadEmployees();
    }
  }, [user?.business_id]);

  const loadBusinessData = async () => {
    if (!user?.business_id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user.business_id)
        .single();

      if (error) {
        console.error('Error loading business data:', error);
        toast.error('Error al cargar los datos del negocio');
        return;
      }

      if (data) {
        setBusinessName(data.name || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setCity(data.city || '');
        setCountry(data.country || '');
        setBankAccount(data.bank_account || '');
        setBusinessLogo(data.logo_url || '');
        setAppThemeColor(data.primary_color || '#000000');
        setNotificationType(data.notification_type || '');
        setVoiceType(data.voice_type || '');
        setDateFormat(data.date_format || '');
        setTimeFormat(data.time_format || '');
        setCurrencyFormat(data.currency || '');
        setHasRegionalFormatChanged(false);
        
        // Handle phone number - extract prefix and number
        if (data.phone) {
          const phoneStr = data.phone;
          // Find matching prefix
          const matchingCountry = Object.entries(countryPrefixes).find(([_, prefix]) => 
            phoneStr.startsWith(prefix)
          );
          
          if (matchingCountry) {
            const [countryName, prefix] = matchingCountry;
            setPhoneNumberPrefix(prefix);
            setPhoneNumber(phoneStr.substring(prefix.length));
            if (!country) setCountry(countryName);
          } else {
            setPhoneNumber(phoneStr);
          }
        }
        
        // Set prefix based on country if not already set
        if (data.country && countryPrefixes[data.country] && !phoneNumberPrefix) {
          setPhoneNumberPrefix(countryPrefixes[data.country]);
        }
      }
    } catch (error) {
      console.error('Error loading business data:', error);
      toast.error('Error al cargar los datos del negocio');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    if (!user?.business_id) return;

    setLoadingEmployees(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, is_active, created_at')
        .eq('business_id', user.business_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading employees:', error);
        toast.error('Error al cargar los empleados');
        return;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Error al cargar los empleados');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleAddEmployee = async () => {
    if (!employeeName.trim() || !employeeRole || !employeeEmail.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (!user?.business_id) {
      toast.error('No se encontró información del negocio');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employeeEmail)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setSavingEmployee(true);
    try {
      // Check if email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', employeeEmail.trim())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        toast.error('Error al verificar el usuario');
        return;
      }

      if (existingUser) {
        toast.error('Ya existe un usuario con este email');
        return;
      }

      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: employeeEmail.trim(),
        password: 'TempPassword123!', // Temporary password - user should change it
        options: {
          data: {
            full_name: employeeName.trim(),
          }
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        toast.error('Error al crear el usuario: ' + authError.message);
        return;
      }

      if (!authData.user) {
        toast.error('No se pudo crear el usuario');
        return;
      }

      // Create user profile
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: employeeEmail.trim(),
          full_name: employeeName.trim(),
          role: employeeRole as 'admin' | 'cashier' | 'chef',
          business_id: user.business_id,
          is_active: true,
        })
        .select('id, email, full_name, role, is_active, created_at')
        .single();

      if (userError) {
        console.error('Error creating user profile:', userError);
        toast.error('Error al crear el perfil del usuario');
        return;
      }

      // Add to local state
      setEmployees(prev => [newUser, ...prev]);
      
      // Clear form
      setEmployeeName('');
      setEmployeeRole('');
      setEmployeeEmail('');
      
      toast.success('Empleado agregado correctamente');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Error al agregar el empleado');
    } finally {
      setSavingEmployee(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', employeeId);

      if (error) {
        console.error('Error deactivating employee:', error);
        toast.error('Error al desactivar el empleado');
        return;
      }

      // Update local state
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      toast.success('Empleado desactivado correctamente');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Error al eliminar el empleado');
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!user?.business_id) return null;

    try {
      setUploadingLogo(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.business_id}/logo.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading logo:', error);
        toast.error('Error al subir el logo');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Error al subir el logo');
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es muy grande. Máximo 5MB');
      return;
    }

    setLogoFile(file);
    setHasBusinessInfoChanged(true);
  };

  const saveBusinessData = async () => {
    if (!user?.business_id) {
      toast.error('No se encontró información del negocio');
      return;
    }

    setSaving(true);
    try {
      let logoUrl = businessLogo;

      // Upload logo if a new file was selected
      if (logoFile) {
        const uploadedUrl = await uploadLogo(logoFile);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      // Combine phone prefix and number
      const fullPhoneNumber = phoneNumberPrefix && phoneNumber 
        ? `${phoneNumberPrefix}${phoneNumber}` 
        : phoneNumber;

      const updateData = {
        name: businessName,
        email: email,
        address: address || null,
        city: city || null,
        country: country || null,
        phone: fullPhoneNumber || null,
        bank_account: bankAccount || null,
        logo_url: logoUrl || null,
        primary_color: appThemeColor || null,
        notification_type: notificationType || null,
      };

      const { error } = await supabase
        .from('businesses')
        .update(updateData)
        .eq('id', user.business_id);

      if (error) {
        console.error('Error saving business data:', error);
        toast.error('Error al guardar los datos del negocio');
        return;
      }

      setBusinessLogo(logoUrl);
      setLogoFile(null);
      toast.success('Datos del negocio guardados correctamente');
      setHasBusinessInfoChanged(false);
    } catch (error) {
      console.error('Error saving business data:', error);
      toast.error('Error al guardar los datos del negocio');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (setter: (value: string) => void, setChanged?: (value: boolean) => void) => (value: string) => {
    setter(value);
    if (setChanged) {
      setChanged(true);
    } else {
      setHasBusinessInfoChanged(true);
    }
  };

  const toggleBusinessInfo = () => {
    setIsBusinessInfoOpen(!isBusinessInfoOpen);
  };

  const toggleEmployeeConfig = () => {
    setIsEmployeeConfigOpen(!isEmployeeConfigOpen);
  };

  const toggleRegionalFormat = () => {
    setIsRegionalFormatOpen(!isRegionalFormatOpen);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'cashier':
        return 'Cajero';
      case 'chef':
        return 'Cocinero';
      default:
        return role;
    }
  };

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
            return formattedDate; // Fallback if split fails
          })()}
        </h1>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 mt-6">
        <button
          onClick={toggleBusinessInfo}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <div className="flex items-center">
            <BsFillInfoCircleFill className="h-5 w-5 mr-2" />
            <span>Información del Negocio</span>
          </div>
          {isBusinessInfoOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {isBusinessInfoOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando datos...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre del Negocio
                      </label>
                      <div className="relative mt-1">
                        <MdOutlineDriveFileRenameOutline className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input 
                          type="text" 
                          id="businessName" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                          value={businessName} 
                          onChange={(e) => handleFieldChange(setBusinessName)(e.target.value)}
                          placeholder="Nombre de tu negocio"
                        />
                      </div>
                    </div>
                    
                  <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tipo de Negocio
                      </label>
                      <div className="relative mt-1">
                        <IoMdBusiness className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          id="businessType" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                          value={businessType} 
                          onChange={(e) => handleFieldChange(setBusinessType)(e.target.value)}
                          placeholder="Ej: Restaurante, Cafetería"
                        />
                      </div>
                    </div>
                    
                  <div>
                    <label htmlFor="businessLogo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Logo del Negocio
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      {businessLogo && (
                        <img 
                          src={businessLogo} 
                          alt="Logo del negocio" 
                          className="h-10 w-10 object-cover rounded-md border border-gray-300"
                        />
                      )}
                      <div className="flex-1">
                        <label htmlFor="logoUpload" className="cursor-pointer inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                          <FaUpload className="h-3 w-3 mr-2" />
                          {uploadingLogo ? 'Subiendo...' : 'Subir Logo'}
                        </label>
                        <input
                          id="logoUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                          disabled={uploadingLogo}
                        />
                      </div>
                    </div>
                    {logoFile && (
                      <p className="mt-1 text-xs text-gray-500">
                        Archivo seleccionado: {logoFile.name}
                      </p>
                    )}
                  </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dirección
                    </label>
                    <div className="relative mt-1">
                      <FaMapLocationDot className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        id="address" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                        value={address} 
                        onChange={(e) => handleFieldChange(setAddress)(e.target.value)}
                        placeholder="Dirección completa"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ciudad
                    </label>
                    <div className="relative mt-1">
                      <FaTreeCity className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        id="city" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                        value={city} 
                        onChange={(e) => handleFieldChange(setCity)(e.target.value)}
                        placeholder="Ciudad"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      País
                    </label>
                    <div className="relative mt-1">
                      <BiWorld className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        id="country" 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-5 text-sm py-1" 
                        value={country} 
                        onChange={(e) => {
                          const selectedCountry = e.target.value;
                          handleFieldChange(setCountry)(selectedCountry);
                          setPhoneNumberPrefix(countryPrefixes[selectedCountry] || '');
                        }}
                      >
                        <option value="">Seleccione un país</option>
                        <optgroup label="Norteamérica">
                          <option value="Canadá">Canadá</option>
                          <option value="Estados Unidos">Estados Unidos</option>
                          <option value="México">México</option>
                        </optgroup>
                        <optgroup label="Centroamérica">
                          <option value="Belice">Belice</option>
                          <option value="Costa Rica">Costa Rica</option>
                          <option value="El Salvador">El Salvador</option>
                          <option value="Guatemala">Guatemala</option>
                          <option value="Honduras">Honduras</option>
                          <option value="Nicaragua">Nicaragua</option>
                          <option value="Panamá">Panamá</option>
                        </optgroup>
                        <optgroup label="Suramérica">
                          <option value="Argentina">Argentina</option>
                          <option value="Bolivia">Bolivia</option>
                          <option value="Brasil">Brasil</option>
                          <option value="Chile">Chile</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Ecuador">Ecuador</option>
                          <option value="Paraguay">Paraguay</option>
                          <option value="Perú">Perú</option>
                          <option value="Uruguay">Uruguay</option>
                          <option value="Venezuela">Venezuela</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cuenta Bancaria
                      </label>
                      <div className="relative mt-1">
                        <BiSolidBank className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="text" 
                          id="bankAccount" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                          value={bankAccount} 
                          onChange={(e) => handleFieldChange(setBankAccount)(e.target.value)}
                          placeholder="Número de cuenta"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        E-mail
                      </label>
                      <div className="relative mt-1">
                        <MdOutlineEmail className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                          type="email" 
                          id="email" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                          value={email} 
                          onChange={(e) => handleFieldChange(setEmail)(e.target.value)}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Número Telefónico
                      </label>
                      <div className="relative mt-1 flex items-center">
                        {phoneNumberPrefix && (
                            <span className="text-gray-500 dark:text-gray-200 text-sm bg-gray-100 dark:bg-gray-700 px-1.5 py-1 rounded-md mr-0.5">
                              {phoneNumberPrefix}
                            </span>
                          )}
                          <div className="relative flex-1">
                            <FaPhoneAlt className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                              type="tel" 
                              id="phoneNumber" 
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                              value={phoneNumber} 
                              onChange={(e) => handleFieldChange(setPhoneNumber)(e.target.value)}
                              placeholder="Ej: 9876-5432"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
                
                {hasBusinessInfoChanged && (
                  <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={saveBusinessData}
                      disabled={saving || !businessName || !email}
                      className="text-green-500 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
        <button
          onClick={toggleEmployeeConfig}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <div className="flex items-center">
            <FaUserPlus className="h-5 w-5 mr-2" />
            <span>Configurar Empleados</span>
          </div>
          {isEmployeeConfigOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {isEmployeeConfigOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre del Usuario
                </label>
                <div className="relative mt-1">
                  <MdOutlineDriveFileRenameOutline className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    id="employeeName" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                    value={employeeName} 
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Nombre completo"
                    disabled={savingEmployee}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="employeeRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rol
                </label>
                <div className="relative mt-1">
                  <FaUserGear className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select 
                    id="employeeRole" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                    value={employeeRole} 
                    onChange={(e) => setEmployeeRole(e.target.value)}
                    disabled={savingEmployee}
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="admin">Administrador</option>
                    <option value="cashier">Cajero</option>
                    <option value="chef">Cocinero</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative mt-1">
                  <MdOutlineEmail className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    id="employeeEmail" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-sm py-1" 
                    value={employeeEmail} 
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    disabled={savingEmployee}
                  />
                </div>
              </div>
            </div>
            
            {/* Employee Table */}
            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Lista de Empleados</h3>
                {(employeeName && employeeRole && employeeEmail) && (
                  <button 
                    onClick={handleAddEmployee}
                    disabled={savingEmployee}
                    className="text-green-500 hover:text-green-600 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingEmployee ? 'Agregando...' : 'Agregar'}
                  </button>
                )}
              </div>
              
              {loadingEmployees ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando empleados...</span>
                </div>
              ) : (
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:w-1/3">
                          Nombre
                        </th>
                        <th scope="col" className="px-0 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:w-1/6">
                          Rol
                        </th>
                        <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:w-1/3">
                          Email
                        </th>
                        <th scope="col" className="px-0 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:w-1/12">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {employee.full_name}
                          </td>
                          <td className="px-0 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {getRoleDisplayName(employee.role)}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {employee.email}
                          </td>
                          <td className="px-0 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Desactivar empleado"
                            >
                              <MdDelete className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {employees.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                            No hay empleados registrados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Regional Format Accordion */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
        <button
          onClick={toggleRegionalFormat}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <div className="flex items-center">
            <BsCalendarDateFill className="h-5 w-5 mr-2" />
            <span>Formato Regional</span>
          </div>
          {isRegionalFormatOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {isRegionalFormatOpen && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formato de fecha
                </label>
                <div className="relative mt-1">
                  <BsCalendarDateFill className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    id="dateFormat"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-xs py-1"
                    value={dateFormat}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue !== dateFormat) {
                        setDateFormat(newValue);
                        setHasRegionalFormatChanged(true);
                      }
                    }}
                  >
                    <option value="">Tipo de Fecha</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formato de hora
                </label>
                <div className="relative mt-1">
                  <Clock className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    id="timeFormat"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-6 text-xs py-1"
                    value={timeFormat}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue !== timeFormat) {
                        setTimeFormat(newValue);
                        setHasRegionalFormatChanged(true);
                      }
                    }}
                  >
                    <option value="">Tpo de Hora</option>
                    <option value="HH:mm">HH:mm (24h)</option>
                    <option value="hh:mm A">hh:mm AM/PM (12h)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="currencyFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moneda de cobro
                </label>
                <div className="relative mt-1">
                  <BsCurrencyExchange className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select 
                          id="currencyFormat" 
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-5 text-xs py-1" 
                          value={currencyFormat} 
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (newValue !== currencyFormat) {
                              setCurrencyFormat(newValue);
                              setHasRegionalFormatChanged(true);
                            }
                          }}
                        >
                          <option value="">Tipo de Moneda</option>
                          {Object.entries(countryCurrencies).reduce((acc, [countryName, currencies]) => {
                              const region = currencies[0]?.region; // Assuming all currencies for a country have the same region
                              if (region) {
                                if (!acc[region]) {
                                  acc[region] = [];
                                }
                                acc[region].push(...currencies);
                              }
                              return acc;
                            }, {} as Record<string, { symbol: string; name: string; region: string }[]>)
                            ? Object.entries(Object.entries(countryCurrencies).reduce((acc, [countryName, currencies]) => {
                                const region = currencies[0]?.region; // Assuming all currencies for a country have the same region
                                if (region) {
                                  if (!acc[region]) {
                                    acc[region] = [];
                                  }
                                  acc[region].push(...currencies);
                                }
                                return acc;
                              }, {} as Record<string, { symbol: string; name: string; region: string }[]>)).map(([region, currencies]) => (
                                <optgroup key={region} label={region}>
                                  {currencies.map((currency, index) => (
                                    <option key={index} value={currency.symbol}>
                                      {`${currency.symbol} (${currency.name})`}
                                    </option>
                                  ))}
                                </optgroup>
                              ))
                            : null}
                        </select>
                </div>
              </div>
            </div>
            {hasRegionalFormatChanged && (
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={saveRegionalFormatData}
                  disabled={saving}
                  className="text-green-500 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}
          </div>)}
        </div>

        {/* Recordatorios Accordion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
          <button
            onClick={toggleRecordatorios}
            className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
          >
            <div className="flex items-center">
              <RiAlarmFill className="h-5 w-5 mr-2" />
              <span>Configurar Recordatorios</span>
            </div>
            {isRecordatoriosOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {isRecordatoriosOpen && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Evento
                  </label>
                  <input
                    type="text"
                    id="eventName"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-3 text-sm py-1"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Nombre del evento"
                  />
                </div>
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-3 text-sm py-1"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>
              {/* Tabla y botón de Recordatorios movidos aquí */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Eventos agregados</h3>
                  {eventName && eventDate && (
                    <button
                      onClick={() => {
                        setReminders([...reminders, { name: eventName, date: eventDate }]);
                        setEventName('');
                        setEventDate('');
                      }}
                      className="text-green-600 focus:outline-none"
                      style={{ textDecoration: 'none' }}
                    >
                      Agregar
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-5 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sm:w-1/3">
                          Evento
                        </th>
                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th scope="col" className="px-1 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {reminders.map((reminder, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {reminder.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {new Date(reminder.date + 'T00:00:00').toLocaleDateString(navigator.language, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteReminder(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <MdDelete className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Customize App Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4">
          <button
          onClick={toggleCustomizeApp}
          className="flex items-center justify-between w-full p-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
        >
          <div className="flex items-center">
            <HiColorSwatch className="h-5 w-5 mr-2" />
            <span>Personalizar App</span>
          </div>
            {isCustomizeAppOpen ? (
              <ChevronUp className="text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="text-gray-600 dark:text-gray-400" />
            )}
          </button>
          {isCustomizeAppOpen && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* App Theme Color Picker */}
                <div className="w-full">
                  <label htmlFor="appThemeColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color del sidebar
                  </label>
                  <ColorPicker color={appThemeColor} onChange={handleAppThemeColorChange} />
                </div>

                {/* Notification Type */} 
                <div>
                  <label htmlFor="notificationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Notificaciones
                  </label>
                  <select
                    id="notificationType"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-3 text-xs py-1"
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value)}
                  >
                    <option value="">Seleccionar Tipo</option>
                    <option value="email">Sonidos</option>
                    <option value="sms">Voz</option>
                  </select>
                </div>

                {/* Voice Type */}
                <div>
                  <label htmlFor="voiceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Voz
                  </label>
                  <select
                    id="voiceType"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-3 text-xs py-1"
                    value={voiceType}
                    onChange={(e) => setVoiceType(e.target.value)}
                  >
                    <option value="">Seleccionar Tipo</option>
                    <option value="male">Masculina</option>
                    <option value="female">Femenina</option>
                  </select>
                </div>
              </div>

            </div>
          )}
        </div>
    </div>
  );
};

export default OptionsPage;