import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { storageService } from '../services/storage';
import { MahoganyInput } from '../components/MahoganyInput';
import { MahoganyButton } from '../components/MahoganyButton';
import { ServiceRecord } from '../types';
import { Search, Wrench, AlertCircle } from 'lucide-react';

interface ServiceQueryScreenProps {
  onBack: () => void;
}

export const ServiceQueryScreen: React.FC<ServiceQueryScreenProps> = ({ onBack }) => {
  const { t, speak, renderText } = useAccessibility();

  const [plateQuery, setPlateQuery] = useState('');
  const [results, setResults] = useState<ServiceRecord[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Available cars for quick suggestions
  const registeredCars = storageService.getCars();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!plateQuery.trim()) {
      return;
    }

    const services = storageService.getServicesByPlate(plateQuery.trim());
    setResults(services);
    setHasSearched(true);

    if (services.length === 0) {
      speak(t('query.noServices', 'Este carro no tiene servicios registrados'));
    } else {
      speak(`Se encontraron ${services.length} servicios para la placa ${plateQuery}`);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      {/* Panel Dark Green ~1070 x 600 px */}
      <div 
        className="w-full max-w-[1070px] min-h-[580px] bg-[#2E7D32] rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#236327] flex flex-col justify-between"
        role="region"
        aria-labelledby="service-query-heading"
      >
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-8">
            <div className="p-2 rounded-lg bg-black/25 text-white">
              <Search className="w-8 h-8" />
            </div>
            <h2 id="service-query-heading" className="text-3xl font-bold text-white tracking-wide">
              {t('query.title', 'Consultar servicios')}
            </h2>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end gap-4 max-w-xl mb-8">
            <div className="flex-1 w-full">
              <MahoganyInput
                label={t('query.colPlate', 'Placa del carro')}
                value={plateQuery}
                onChange={(e) => setPlateQuery(e.target.value.toUpperCase())}
                placeholder="Ej: NFSMW"
                list="query-cars-list"
                autoComplete="off"
                required
              />
              <datalist id="query-cars-list">
                {registeredCars.map((c) => (
                  <option key={c.id} value={c.plate}>
                    {c.brand} {c.model}
                  </option>
                ))}
              </datalist>
            </div>

            <MahoganyButton
              type="submit"
              className="flex items-center justify-center gap-2 min-w-36 py-2.5 shadow-md"
            >
              <Search className="w-5 h-5" />
              <span>{t('query.button', 'Consultar')}</span>
            </MahoganyButton>
          </form>

          {/* Results Table Area */}
          <div className="w-full overflow-hidden rounded-xl border-2 border-[#1e5822] shadow-inner bg-black/10 min-h-[220px]">
            {hasSearched ? (
              results && results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#8B3A1E] text-white border-b-2 border-[#6e2b14]">
                        <th className="py-3 px-5 font-bold text-lg tracking-wider">
                          {t('query.colPlate', 'Placa del carro')}
                        </th>
                        <th className="py-3 px-5 font-bold text-lg tracking-wider">
                          {t('query.colService', 'Servicio prestado')}
                        </th>
                        <th className="py-3 px-5 font-bold text-lg tracking-wider">
                          {t('query.colDate', 'Fecha del servicio')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white font-medium">
                      {results.map((srv, idx) => (
                        <tr 
                          key={srv.id || idx}
                          className="hover:bg-white/10 transition-colors"
                        >
                          <td className="py-3.5 px-5 font-bold tracking-wide">
                            {renderText(srv.plate)}
                          </td>
                          <td className="py-3.5 px-5 flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#5AC135]"></span>
                            <span>{renderText(srv.serviceType)}</span>
                          </td>
                          <td className="py-3.5 px-5">
                            {renderText(srv.serviceDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-14 px-6 flex flex-col items-center justify-center text-center">
                  <AlertCircle className="w-12 h-12 text-[#FFFF00] mb-3 opacity-90" />
                  <p className="text-2xl font-bold text-white tracking-wide">
                    {t('query.noServices', 'Este carro no tiene servicios registrados')}
                  </p>
                </div>
              )
            ) : (
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center text-stone-200">
                <Wrench className="w-12 h-12 text-[#5AC135] mb-3 opacity-70" />
                <p className="text-lg font-medium">
                  {t('query.enterPlatePrompt', 'Ingrese una placa para consultar los servicios prestados')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Right: Regresar Button */}
        <div className="flex justify-end pt-8 mt-6 border-t border-white/20">
          <MahoganyButton
            type="button"
            onClick={onBack}
            className="min-w-32 text-lg py-2.5"
          >
            {t('btn.back', 'Regresar')}
          </MahoganyButton>
        </div>
      </div>
    </div>
  );
};
