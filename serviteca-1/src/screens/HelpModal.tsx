import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { MahoganyButton } from '../components/MahoganyButton';
import { HelpCircle, PhoneCall, AlertTriangle, ChevronDown, Check } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const { t, speak } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'faq' | 'call' | 'report'>('faq');
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReportSubmitted(true);
    speak(t('help.reportSent', 'Reporte registrado para revisión técnica.'));
    setTimeout(() => {
      setReportText('');
      setReportSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div className="bg-[#2E7D32] text-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#236327] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black/25 text-white">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h2 id="help-title" className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {t('help.title', 'Menú de Ayuda')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white text-2xl font-bold px-2 py-1 cursor-pointer"
            aria-label="Cerrar ayuda"
          >
            ✕
          </button>
        </div>

        {/* Tab options in Mahogany/Green */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-base transition-colors cursor-pointer border ${
              activeTab === 'faq'
                ? 'bg-[#5AC135] text-black border-[#459d24]'
                : 'bg-[#8B3A1E] text-white border-[#6e2b14] hover:bg-[#9e4324]'
            }`}
          >
            <HelpCircle className="w-5 h-5 shrink-0" />
            <span className="truncate">{t('help.faq', 'Preguntas frecuentes')}</span>
          </button>

          <button
            onClick={() => setActiveTab('call')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-base transition-colors cursor-pointer border ${
              activeTab === 'call'
                ? 'bg-[#5AC135] text-black border-[#459d24]'
                : 'bg-[#8B3A1E] text-white border-[#6e2b14] hover:bg-[#9e4324]'
            }`}
          >
            <PhoneCall className="w-5 h-5 shrink-0" />
            <span className="truncate">{t('help.callTech', 'Llamar a un técnico')}</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-base transition-colors cursor-pointer border ${
              activeTab === 'report'
                ? 'bg-[#5AC135] text-black border-[#459d24]'
                : 'bg-[#8B3A1E] text-white border-[#6e2b14] hover:bg-[#9e4324]'
            }`}
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="truncate">{t('help.report', 'Reportar un problema')}</span>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto pr-2 min-h-[220px]">
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                <h4 className="text-lg font-bold text-yellow-300 mb-1">
                  1. {t('help.faqQ1', '¿Cómo registro un servicio?')}
                </h4>
                <p className="text-base text-stone-100">
                  {t('help.faqA1', 'Primero registre el cliente y el carro. Luego en Servicios > Agregar, ingrese la placa y la identificación correspondientes.')}
                </p>
              </div>

              <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                <h4 className="text-lg font-bold text-yellow-300 mb-1">
                  2. {t('help.faqQ2', '¿Cómo consulto el historial de un vehículo?')}
                </h4>
                <p className="text-base text-stone-100">
                  {t('help.faqA2', 'Vaya a Servicios > Consultar e ingrese la placa del vehículo para ver todos los servicios realizados.')}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'call' && (
            <div className="bg-black/20 p-6 rounded-xl border border-white/10 flex flex-col items-center text-center gap-4">
              <div className="p-3 rounded-full bg-[#5AC135] text-black">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {t('help.callTech', 'Llamar a un técnico')}
              </h4>
              <p className="text-base text-stone-200 max-w-md">
                {t('help.callTechDesc', 'Canal de soporte técnico interno para fallas de sistema o asistencia en operaciones de la serviteca.')}
              </p>
              <div className="p-3 bg-[#5AC135] text-black rounded-lg font-bold text-sm">
                ℹ️ {t('help.callTechNote', 'Póngase en contacto con el personal de soporte técnico designado en su sede.')}
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <form onSubmit={handleSendReport} className="bg-black/20 p-5 rounded-xl border border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-300" />
                <h4 className="text-lg font-bold text-white">
                  {t('help.report', 'Reportar un problema')}
                </h4>
              </div>
              <p className="text-sm text-stone-200">
                {t('help.reportPrompt', 'Describa el incidente ocurrido:')}
              </p>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows={4}
                required
                placeholder="Detalle de la falla o requerimiento..."
                className="w-full bg-[#8B3A1E] text-white p-3 rounded-lg border border-[#6e2b14] focus:outline-none focus:ring-2 focus:ring-white resize-none text-base placeholder:text-stone-300"
              />

              {reportSubmitted && (
                <div className="p-2.5 bg-[#5AC135] text-black rounded-lg font-bold text-center flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>{t('help.reportSent', 'Reporte registrado para revisión técnica.')}</span>
                </div>
              )}

              <div className="flex justify-end">
                <MahoganyButton type="submit" disabled={!reportText.trim() || reportSubmitted}>
                  {t('help.reportSend', 'Enviar reporte')}
                </MahoganyButton>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/20 flex justify-end">
          <MahoganyButton onClick={onClose} className="min-w-28">
            {t('btn.close', 'Cerrar')}
          </MahoganyButton>
        </div>
      </div>
    </div>
  );
};
