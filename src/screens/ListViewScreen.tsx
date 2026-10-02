import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { storageService } from '../services/storage';
import { MahoganyButton } from '../components/MahoganyButton';
import { ScreenType } from '../types';
import { Users, Car, Wrench, PlusCircle } from 'lucide-react';

interface ListViewScreenProps {
  type: 'client_list' | 'car_list' | 'service_list';
  onBack: () => void;
  onNavigateToAdd: (screen: ScreenType) => void;
}

export const ListViewScreen: React.FC<ListViewScreenProps> = ({
  type,
  onBack,
  onNavigateToAdd,
}) => {
  const { t, renderText } = useAccessibility();

  const clients = storageService.getClients();
  const cars = storageService.getCars();
  const services = storageService.getServices();

  const isClient = type === 'client_list';
  const isCar = type === 'car_list';
  const isService = type === 'service_list';

  const title = isClient
    ? t('client.listTitle', 'Listado de Clientes')
    : isCar
    ? t('car.listTitle', 'Listado de Carros')
    : t('query.allServicesTitle', 'Listado General de Servicios');

  const addScreen: ScreenType = isClient
    ? 'client_add'
    : isCar
    ? 'car_add'
    : 'service_add';

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      {/* Panel Dark Green ~1070 x 600 px */}
      <div 
        className="w-full max-w-[1070px] min-h-[580px] bg-[#2E7D32] rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#236327] flex flex-col justify-between"
        role="region"
        aria-labelledby="list-heading"
      >
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/20 pb-4 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-black/25 text-white">
                {isClient ? (
                  <Users className="w-8 h-8" />
                ) : isCar ? (
                  <Car className="w-8 h-8" />
                ) : (
                  <Wrench className="w-8 h-8" />
                )}
              </div>
              <h2 id="list-heading" className="text-3xl font-bold text-white tracking-wide">
                {title}
              </h2>
            </div>

            <button
              onClick={() => onNavigateToAdd(addScreen)}
              className="flex items-center gap-2 bg-[#5AC135] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#6edc46] cursor-pointer self-start sm:self-auto transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t('menu.add', 'Agregar')}</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-hidden rounded-xl border-2 border-[#1e5822] shadow-inner bg-black/10 max-h-[380px] overflow-y-auto">
            {isClient && (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#8B3A1E] text-white">
                  <tr>
                    <th className="py-3 px-4 font-bold">{t('client.id', 'Identificación')}</th>
                    <th className="py-3 px-4 font-bold">{t('client.firstName', 'Nombres')}</th>
                    <th className="py-3 px-4 font-bold">{t('client.lastName', 'Apellidos')}</th>
                    <th className="py-3 px-4 font-bold">{t('client.email', 'Correo electrónico')}</th>
                    <th className="py-3 px-4 font-bold">{t('client.phone', 'Celular')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white font-medium">
                  {clients.length > 0 ? (
                    clients.map((c) => (
                      <tr key={c.id} className="hover:bg-white/10 transition-colors">
                        <td className="py-3 px-4 font-bold">{renderText(c.identification)}</td>
                        <td className="py-3 px-4">{renderText(c.firstName)}</td>
                        <td className="py-3 px-4">{renderText(c.lastName)}</td>
                        <td className="py-3 px-4 text-stone-200">{renderText(c.email)}</td>
                        <td className="py-3 px-4">{renderText(c.phone)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-200 font-bold">
                        {t('client.noClients', 'No hay clientes registrados en el sistema.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {isCar && (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#8B3A1E] text-white">
                  <tr>
                    <th className="py-3 px-4 font-bold">{t('car.plate', 'Placa')}</th>
                    <th className="py-3 px-4 font-bold">{t('car.brand', 'Marca')}</th>
                    <th className="py-3 px-4 font-bold">{t('car.model', 'Modelo')}</th>
                    <th className="py-3 px-4 font-bold">{t('car.preview', 'Vista previa')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white font-medium">
                  {cars.length > 0 ? (
                    cars.map((car) => (
                      <tr key={car.id} className="hover:bg-white/10 transition-colors">
                        <td className="py-3 px-4 font-bold">{renderText(car.plate)}</td>
                        <td className="py-3 px-4">{renderText(car.brand)}</td>
                        <td className="py-3 px-4">{renderText(car.model)}</td>
                        <td className="py-2 px-4">
                          {car.imageUrl ? (
                            <img
                              src={car.imageUrl}
                              alt={car.plate}
                              className="w-12 h-10 object-cover rounded border border-white/30"
                            />
                          ) : (
                            <span className="text-xs text-stone-300 italic">Sin imagen</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-stone-200 font-bold">
                        {t('car.noCars', 'No hay carros registrados en el sistema.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {isService && (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#8B3A1E] text-white">
                  <tr>
                    <th className="py-3 px-4 font-bold">{t('query.colPlate', 'Placa del carro')}</th>
                    <th className="py-3 px-4 font-bold">{t('service.clientId', 'Identificación cliente')}</th>
                    <th className="py-3 px-4 font-bold">{t('query.colService', 'Servicio prestado')}</th>
                    <th className="py-3 px-4 font-bold">{t('query.colDate', 'Fecha del servicio')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white font-medium">
                  {services.length > 0 ? (
                    services.map((s) => (
                      <tr key={s.id} className="hover:bg-white/10 transition-colors">
                        <td className="py-3 px-4 font-bold">{renderText(s.plate)}</td>
                        <td className="py-3 px-4">{renderText(s.clientIdentification)}</td>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#5AC135]"></span>
                          <span>{renderText(s.serviceType)}</span>
                        </td>
                        <td className="py-3 px-4">{renderText(s.serviceDate)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-stone-200 font-bold">
                        No hay servicios registrados en el sistema.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
