import React, { useState, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { storageService } from '../services/storage';
import { MahoganyInput } from '../components/MahoganyInput';
import { MahoganyButton } from '../components/MahoganyButton';
import { MessageBox } from '../components/MessageBox';
import { AlertState, ServiceType } from '../types';
import { Wrench, Upload, Image as ImageIcon, Calendar, X } from 'lucide-react';

interface ServiceAddScreenProps {
  onBack: () => void;
}

const SERVICE_OPTIONS: ServiceType[] = [
  'Cambio de aceite',
  'Sincronización',
  'Alineación',
  'Lavado',
];

export const ServiceAddScreen: React.FC<ServiceAddScreenProps> = ({ onBack }) => {
  const { t } = useAccessibility();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [plate, setPlate] = useState('');
  const [clientIdentification, setClientIdentification] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const [alert, setAlert] = useState<AlertState | null>(null);

  // Registered cars & clients for auto-completion / quick picks
  const registeredCars = storageService.getCars();
  const registeredClients = storageService.getClients();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory empty fields validation
    if (!plate.trim() || !clientIdentification.trim() || !serviceDate.trim() || !serviceType) {
      setAlert({
        type: 'error',
        title: t('alert.errorTitle', '¡Error!'),
        message: t('alert.emptyFields', 'Debe llenar todos los espacios en blanco'),
      });
      return;
    }

    // 2. Relational validation: car plate and client ID must exist
    const relationCheck = storageService.validateRelationship(plate.trim(), clientIdentification.trim());
    if (!relationCheck.valid) {
      const errMsg = relationCheck.errorKey ? t(relationCheck.errorKey) : t('alert.notFoundRelational', 'La placa o la identificación no se encuentran registradas');
      setAlert({
        type: 'error',
        title: t('alert.errorTitle', '¡Error!'),
        message: errMsg,
      });
      return;
    }

    // 3. Save service record
    storageService.addService({
      plate: plate.trim().toUpperCase(),
      clientIdentification: clientIdentification.trim(),
      serviceDate: serviceDate.trim(),
      serviceType: serviceType as ServiceType,
      imageUrl: imageUrl || undefined,
    });

    setAlert({
      type: 'success',
      title: t('alert.successTitle', '¡Guardado!'),
      message: t('alert.savedSuccess', 'Se han guardado los datos con éxito'),
    });

    // Reset form
    setPlate('');
    setClientIdentification('');
    setServiceDate('');
    setServiceType('');
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      {/* Panel Dark Green ~1070 x 600 px */}
      <div 
        className="w-full max-w-[1070px] min-h-[580px] bg-[#2E7D32] rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#236327] flex flex-col justify-between"
        role="region"
        aria-labelledby="service-form-heading"
      >
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-8">
            <div className="p-2 rounded-lg bg-black/25 text-white">
              <Wrench className="w-8 h-8" />
            </div>
            <h2 id="service-form-heading" className="text-3xl font-bold text-white tracking-wide">
              {t('service.addTitle', 'Registrar servicio')}
            </h2>
          </div>

          {/* Form and Image container side-by-side */}
          <form id="service-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left side: Inputs */}
            <div className="flex flex-col gap-5 max-w-md">
              {/* Placa del carro with datalist */}
              <div>
                <MahoganyInput
                  label={t('service.carPlate', 'Placa del carro')}
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="Ej: NFSMW"
                  list="cars-datalist"
                  autoComplete="off"
                />
                <datalist id="cars-datalist">
                  {registeredCars.map((c) => (
                    <option key={c.id} value={c.plate}>
                      {c.brand} {c.model}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Identificación del cliente with datalist */}
              <div>
                <MahoganyInput
                  label={t('service.clientId', 'Identificación del cliente')}
                  value={clientIdentification}
                  onChange={(e) => setClientIdentification(e.target.value)}
                  placeholder="Ej: 10203040"
                  list="clients-datalist"
                  autoComplete="off"
                />
                <datalist id="clients-datalist">
                  {registeredClients.map((c) => (
                    <option key={c.id} value={c.identification}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Fecha del servicio: real date picker with calendar */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="service-date" className="text-white text-base font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{t('service.date', 'Fecha del servicio')}</span>
                </label>
                <input
                  id="service-date"
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="bg-[#8B3A1E] text-white px-3 py-2 rounded-lg text-base border border-[#6e2b14] focus:outline-none focus:ring-2 focus:ring-white transition-colors cursor-pointer"
                />
              </div>

              {/* Tipo de servicio: light green (#5AC135) dropdown */}
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="service-type" className="text-white text-base font-medium">
                  {t('service.type', 'Tipo de servicio')}
                </label>
                <select
                  id="service-type"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceType)}
                  className="bg-[#5AC135] text-black font-bold px-3 py-2 rounded-lg text-base border-2 border-[#459d24] focus:outline-none focus:ring-2 focus:ring-white cursor-pointer shadow-sm"
                >
                  <option value="" disabled className="bg-white text-black font-normal">
                    -- {t('service.selectType', 'Seleccione un tipo de servicio')} --
                  </option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-white text-black font-bold">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional image upload */}
              <div className="pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-[#8B3A1E] text-white px-4 py-2 rounded-lg border border-[#6e2b14] hover:bg-[#9e4324] font-semibold text-sm cursor-pointer transition-colors shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>{t('service.uploadImageOptional', 'Subir imagen (opcional)')}</span>
                </button>
              </div>
            </div>

            {/* Right side: Optional image preview */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-white text-base font-medium mb-1 self-start">
                {t('car.preview', 'Vista previa')}:
              </span>
              <div 
                className="w-full max-w-[360px] h-[260px] bg-[#8B3A1E] rounded-2xl border-2 border-[#6e2b14] flex flex-col items-center justify-center relative overflow-hidden shadow-inner p-3"
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Foto opcional del servicio"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer transition-colors"
                      title="Quitar imagen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-stone-300 gap-2 text-center p-4">
                    <ImageIcon className="w-16 h-16 opacity-40 text-white" />
                    <span className="text-sm font-semibold opacity-70">
                      Imagen opcional del servicio
                    </span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Right: Regresar y Guardar */}
        <div className="flex justify-end items-center gap-5 pt-8 mt-6 border-t border-white/20">
          <MahoganyButton
            type="button"
            onClick={onBack}
            className="min-w-32 text-lg py-2.5"
          >
            {t('btn.back', 'Regresar')}
          </MahoganyButton>

          <MahoganyButton
            type="submit"
            form="service-form"
            className="min-w-32 text-lg py-2.5 shadow-md"
          >
            {t('btn.save', 'Guardar')}
          </MahoganyButton>
        </div>
      </div>

      {/* Alert Message Box */}
      {alert && (
        <MessageBox
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};
