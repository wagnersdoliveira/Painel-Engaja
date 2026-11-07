import React from 'react';
import { 
  BarChart3, 
  Link2, 
  CalendarClock, 
  TrendingUp, 
  AlertTriangle,
  Layers
} from 'lucide-react';

export type TabId = 'visao-geral' | 'contas' | 'agendamento' | 'metricas' | 'restricoes';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  accountsCount: number;
  scheduledPostsCount: number;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  accountsCount,
  scheduledPostsCount,
  activeAlertsCount,
}) => {
  const navItems: { id: TabId; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'visao-geral',
      label: 'Visão Geral & KPIs',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: scheduledPostsCount > 0 ? scheduledPostsCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-400'
    },
    {
      id: 'contas',
      label: 'Contas & Conexões',
      icon: <Link2 className="w-4 h-4" />,
      badge: accountsCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-400'
    },
    {
      id: 'agendamento',
      label: 'Agendamento & Editor',
      icon: <CalendarClock className="w-4 h-4" />
    },
    {
      id: 'metricas',
      label: 'Métricas & Desempenho',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'restricoes',
      label: 'Restrições & Alertas',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400'
    }
  ];

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#374151] flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#374151] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-[#f3f4f6] text-base leading-tight tracking-tight">
            Engaja Empresas
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Central Multi-Redes
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="p-3 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                isActive
                  ? 'bg-[#1f2937] text-white border-l-4 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f2937]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-blue-400' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                    item.badgeColor || 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Footer Info */}
      <div className="p-4 border-t border-[#374151] bg-[#0b0f19]/40 text-xs text-gray-400">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-gray-300 font-medium">Ambiente Operacional</span>
          <span className="text-emerald-400 font-mono text-[11px]">v2.4 Online</span>
        </div>
        <p className="text-[11px] leading-relaxed text-gray-400">
          Publicação simultânea para Instagram, TikTok, Facebook, LinkedIn, YouTube e Kwai.
        </p>
      </div>
    </aside>
  );
};
