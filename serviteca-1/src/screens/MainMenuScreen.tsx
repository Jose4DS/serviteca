import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ScreenType } from '../types';
import { 
  Users, 
  Car, 
  Wrench, 
  HelpCircle, 
  LogOut, 
  PlusCircle, 
  Search, 
  ListFilter,
  ChevronRight
} from 'lucide-react';

interface MainMenuScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
  onOpenHelp: () => void;
}

type MenuCategory = 'clientes' | 'carros' | 'servicios' | null;

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  onNavigate,
  onLogout,
  onOpenHelp,
}) => {
  const { t, speak } = useAccessibility();
  const [activeSubmenu, setActiveSubmenu] = useState<MenuCategory>(null);

  const handleCategoryClick = (category: MenuCategory, name: string) => {
    if (activeSubmenu === category) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(category);
      speak(`${name}. Opciones: Agregar, Consultar, Listar.`);
    }
  };

  const handleSubmenuAction = (action: 'add' | 'query' | 'list', category: MenuCategory) => {
    if (!category) return;

    if (category === 'clientes') {
      if (action === 'add') onNavigate('client_add');
      else if (action === 'query') onNavigate('client_list');
      else if (action === 'list') onNavigate('client_list');
    } else if (category === 'carros') {
      if (action === 'add') onNavigate('car_add');
      else if (action === 'query') onNavigate('car_list');
      else if (action === 'list') onNavigate('car_list');
    } else if (category === 'servicios') {
      if (action === 'add') onNavigate('service_add');
      else if (action === 'query') onNavigate('service_query');
      else if (action === 'list') onNavigate('service_list');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      {/* Large Dark Green Panel ~1070 x 600 px */}
      <div 
        className="w-full max-w-[1070px] min-h-[580px] bg-[#2E7D32] rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#236327] flex flex-col justify-between relative"
        role="region"
        aria-label="Menú principal de SERVITECA"
      >
        {/* Left Column Navigation with flyout submenus */}
        <div className="flex flex-col gap-6 max-w-md">
          {/* 1. Clientes */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveSubmenu('clientes')}
          >
            <button
              onClick={() => handleCategoryClick('clientes', t('menu.clients', 'Clientes'))}
              className={`
                w-72 flex items-center justify-between
                bg-[#8B3A1E] text-white px-5 py-4 rounded-xl
                border border-[#6e2b14] shadow-md
                hover:bg-[#9e4324] hover:shadow-lg
                active:bg-[#783017]
                focus:outline-none focus:ring-2 focus:ring-white
                transition-all duration-150 cursor-pointer
              `}
              aria-expanded={activeSubmenu === 'clientes'}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-black/25 text-white">
                  <Users className="w-7 h-7" />
                </div>
                <span className="text-2xl font-bold tracking-wide">
                  {t('menu.clients', 'Clientes')}
                </span>
              </div>
              <ChevronRight className={`w-6 h-6 transition-transform ${activeSubmenu === 'clientes' ? 'rotate-90 sm:rotate-0' : ''}`} />
            </button>

            {/* Submenu for Clientes */}
            {activeSubmenu === 'clientes' && (
              <div 
                className="sm:absolute sm:left-[304px] sm:top-0 mt-2 sm:mt-0 w-64 bg-[#5AC135] text-black rounded-xl p-3 shadow-2xl border-2 border-[#459d24] z-30 animate-in fade-in duration-150"
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSubmenuAction('add', 'clientes')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-bold text-lg hover:bg-black/10 transition-colors text-left cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5 text-black" />
                    <span>{t('menu.add', 'Agregar')}</span>
                  </button>
                  <button
                    onClick={() => handleSubmenuAction('query', 'clientes')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-bold text-lg hover:bg-black/10 transition-colors text-left cursor-pointer"
                  >
                    <Search className="w-5 h-5 text-black" />
                    <span>{t('menu.query', 'Consultar')}</span>
                  </button>
                  <button
                    onClick={() => handleSubmenuAction('list', 'clientes')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-bold text-lg hover:bg-black/10 transition-colors text-left cursor-pointer"
                  >
                    <ListFilter className="w-5 h-5 text-black" />
                    <span>{t('menu.list', 'Listar')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Carros */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveSubmenu('carros')}
          >
            <button
              onClick={() => handleCategoryClick('carros', t('menu.cars', 'Carros'))}
              className={`
                w-72 flex items-center justify-between
                bg-[#8B3A1E] text-white px-5 py-4 rounded-xl
                border border-[#6e2b14] shadow-md
                hover:bg-[#9e4324] hover:shadow-lg
                active:bg-[#783017]
                focus:outline-none focus:ring-2 focus:ring-white
                transition-all duration-150 cursor-pointer
              `}
              aria-expanded={activeSubmenu === 'carros'}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-black/25 text-white">
                  <Car className="w-7 h-7" />
                </div>
                <span className="text-2xl font-bold tracking-wide">
                  {t('menu.cars', 'Carros')}
                </span>
              </div>
              <ChevronRight className={`w-6 h-6 transition-transform ${activeSubmenu === 'carros' ? 'rotate-90 sm:rotate-0' : ''}`} />
            </button>

            {/* Submenu for Carros */}
            {activeSubmenu === 'carros' && (
              <div 
                className="sm:absolute sm:left-[304px] sm:top-0 mt-2 sm:mt-0 w-64 bg-[#5AC135] text-black rounded-xl p-3 shadow-2xl border-2 border-[#459d24] z-30 animate-in fade-in duration-150"
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSubmenuAction('add', 'carros')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-bold text-lg hover:bg-black/10 transition-colors text-left cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5 text-black" />
                    <span>{t('menu.add', 'Agregar')}</span>
                  </button>
                  <button
                    onClick={() => handleSubmenuAction('query', 'carros')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-bold text-lg hover:bg-black/10 transition-colors text-left cursor-pointer"
                  >
                    <Search className="w-5 h-5 text-black" />
                    <span>{t('menu.query', 'Consultar')}</span>
                  </button>
                  <button
                    onClick={() => handleSubmenuAction('list', 'carros')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-bold text-lg hover:bg-black/10 transition-colors text-left cursor-pointer"
                  >
                    <ListFilter className="w-5 h-5 text-black" />
                    <span>{t('menu.list', 'Listar')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Servicios */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveSubmenu('servicios')}
          >
            <button
              onClick={() => handleCategoryClick('servicios', t('menu.services', 'Servicios'))}
              className={`
                w-72 flex items-center justify-between
                bg-[#8B3A1E] text-white px-5 py-4 rounded-xl
                border border-[#6e2b14] shadow-md
                hover:bg-[#9e4324] hover:shadow-lg
                active:bg-[#783017]
                focus:outline-none focus:ring-2 focus:ring-white
                transition-all duration-150 cursor-pointer
              `}
              aria-expanded={activeSubmenu === 'servicios'}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-black/25 text-white">
                  <Wrench className="w-7 h-7" />
                </div>
                <span className="text-2xl font-bold tracking-wide">
                  {t('menu.services', 'Servicios')}
                </span>
              </div>
              <ChevronRight className={`w-6 h-6 transition-transform ${activeSubmenu === 'servicios' ? 'rotate-90 sm:rotate-0' : ''}`} />
            </button>

            {/* Submenu for Servicios */}
            {activeSubmenu === 'servicios' && (
              <div 
                className="sm:absolute sm:left-[304px] sm:top-0 mt-2 sm:mt-0 w-64 bg-[#5AC135] text-black rounded-xl p-3 shadow-2xl border-2 border-[#459d24] z-30 animate-in fade-in duration-150"
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSubmenuAction('add', 'servicios')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-bold text-lg hover:bg-black/10 transition-colors text-left cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5 text-black" />
                    <span>{t('menu.add', 'Agregar')}</span>
                  </button>
                  <button
                    onClick={() => handleSubmenuAction('query', 'servicios')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-bold text-lg hover:bg-black/10 transition-colors text-left cursor-pointer"
                  >
                    <Search className="w-5 h-5 text-black" />
                    <span>{t('menu.query', 'Consultar')}</span>
                  </button>
                  <button
                    onClick={() => handleSubmenuAction('list', 'servicios')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-bold text-lg hover:bg-black/10 transition-colors text-left cursor-pointer"
                  >
                    <ListFilter className="w-5 h-5 text-black" />
                    <span>{t('menu.list', 'Listar')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lower Section: Ayuda & Salir in the same mahogany box style */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-8 mt-8 border-t border-white/20">
          {/* Ayuda */}
          <button
            onClick={onOpenHelp}
            className={`
              w-72 flex items-center justify-between
              bg-[#8B3A1E] text-white px-5 py-4 rounded-xl
              border border-[#6e2b14] shadow-md
              hover:bg-[#9e4324] hover:shadow-lg
              active:bg-[#783017]
              focus:outline-none focus:ring-2 focus:ring-white
              transition-all duration-150 cursor-pointer
            `}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-black/25 text-white">
                <HelpCircle className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold tracking-wide">
                {t('menu.help', 'Ayuda')}
              </span>
            </div>
          </button>

          {/* Salir */}
          <button
            onClick={() => {
              speak('Cerrando sesión');
              onLogout();
            }}
            className={`
              w-72 flex items-center justify-between
              bg-[#8B3A1E] text-white px-5 py-4 rounded-xl
              border border-[#6e2b14] shadow-md
              hover:bg-[#9e4324] hover:shadow-lg
              active:bg-[#783017]
              focus:outline-none focus:ring-2 focus:ring-white
              transition-all duration-150 cursor-pointer
            `}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-black/25 text-white">
                <LogOut className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold tracking-wide">
                {t('menu.logout', 'Salir')}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
