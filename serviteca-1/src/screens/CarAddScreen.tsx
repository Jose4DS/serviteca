import React, { useState, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { storageService } from '../services/storage';
import { MahoganyInput } from '../components/MahoganyInput';
import { MahoganyButton } from '../components/MahoganyButton';
import { MessageBox } from '../components/MessageBox';
import { AlertState } from '../types';
import { Car, Upload, Image as ImageIcon, X } from 'lucide-react';

interface CarAddScreenProps {
  onBack: () => void;
}

export const CarAddScreen: React.FC<CarAddScreenProps> = ({ onBack }) => {
  const { t } = useAccessibility();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const [alert, setAlert] = useState<AlertState | null>(null);

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

    if (!plate.trim() || !brand.trim() || !model.trim()) {
      setAlert({
        type: 'error',
        title: t('alert.errorTitle', '¡Error!'),
        message: t('alert.emptyFields', 'Debe llenar todos los espacios en blanco'),
      });
      return;
    }

    storageService.addCar({
      plate: plate.trim().toUpperCase(),
      brand: brand.trim(),
      model: model.trim(),
      imageUrl: imageUrl || undefined,
    });

    setAlert({
      type: 'success',
      title: t('alert.successTitle', '¡Guardado!'),
      message: t('alert.savedSuccess', 'Se han guardado los datos con éxito'),
    });

    // Clear
    setPlate('');
    setBrand('');
    setModel('');
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      {/* Panel Dark Green ~1070 x 600 px */}
      <div 
        className="w-full max-w-[1070px] min-h-[580px] bg-[#2E7D32] rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#236327] flex flex-col justify-between"
        role="region"
        aria-labelledby="car-form-heading"
      >
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-8">
            <div className="p-2 rounded-lg bg-black/25 text-white">
              <Car className="w-8 h-8" />
            </div>
            <h2 id="car-form-heading" className="text-3xl font-bold text-white tracking-wide">
              {t('car.addTitle', 'Registrar carro')}
            </h2>
          </div>

          {/* Form and Image container side-by-side */}
          <form id="car-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left side: Input fields */}
            <div className="flex flex-col gap-6 max-w-md">
              <MahoganyInput
                label={t('car.plate', 'Placa')}
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="Ej: NFSMW"
                maxLength={10}
                autoComplete="off"
              />

              <MahoganyInput
                label={t('car.brand', 'Marca')}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: BMW"
                autoComplete="off"
              />

              <MahoganyInput
                label={t('car.model', 'Modelo')}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ej: M3 GTR"
                autoComplete="off"
              />

              <div className="pt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                  id="car-image-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2.5 bg-[#8B3A1E] text-white px-5 py-2.5 rounded-lg border border-[#6e2b14] hover:bg-[#9e4324] font-bold cursor-pointer transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <Upload className="w-5 h-5" />
                  <span>{t('car.uploadImage', 'Subir imagen')}</span>
                </button>
              </div>
            </div>

            {/* Right side: Image preview in a Mahogany box */}
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
                      alt="Vista previa del carro"
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
                      Sin imagen seleccionada
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
            form="car-form"
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
