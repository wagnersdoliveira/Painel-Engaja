import React from 'react';
import { TabId } from './Sidebar';
import { PlusCircle, RefreshCw, Download, CheckCircle2, Radio, Activity, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: TabId;
  onNewSchedule: () => void;
  onExport: () => void;
  onSync: () => void;
  isSyncing: boolean;
  isPollingActive?: boolean;
  nextPollIn?: number;
  isCheckingAPI?: boolean;
  onTriggerPollNow?: () => void;
  planejadosCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNewSchedule,
  onExport,
  onSync,
  isSyncing,
  isPollingActive = true,
  nextPollIn = 30,
  isCheckingAPI = false,
  onTriggerPollNow,
  planejadosCount = 0
}) => {
  const titles: Record<TabId, { title: string; subtitle: string }> = {
    'visao-geral': {
      title: 'Visão Geral & KPIs',
      subtitle: 'Monitoramento em tempo real de publicações agendadas e performance das redes'
    },
    'contas': {
      title: 'Contas & Conexões',
      subtitle: 'Gerenciamento de canais conectados e prévia de cards programados'
    },
    'agendamento': {
      title: 'Agendamento & Editor em Lote',
      subtitle: 'Componha e distribua publicações simultâneas com validação de regras de API'
    },
    'metricas': {
      title: 'Métricas & Desempenho',
      subtitle: 'Desempenho consolidado de alcance, engajamento e conversão de cliques'
    },
    'restricoes': {
      title: 'Restrições & Alertas de Contas',
      subtitle: 'Central de integridade, avisos de políticas de plataforma e recursos'
    }
  };

  const current = titles[activeTab];

  return (
    <header className="bg-[#111827] border-b border-[#374151] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-30 shadow-xs">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-[#f3f4f6] text-xl font-bold tracking-tight">
            {current.title}
          </h1>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sistema Ativo & Conectado
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Widget de Polling 30s da API */}
        <div className="flex items-center bg-[#0b0f19] border border-[#374151] rounded-md px-2.5 py-1 text-xs gap-2 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCheckingAPI ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isCheckingAPI ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-[11px] font-mono text-gray-300">
              {isCheckingAPI ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Verificando API...
                </span>
              ) : (
                <span>Polling API (30s): <strong className="text-emerald-400">{nextPollIn}s</strong></span>
              )}
            </span>
          </div>

          {planejadosCount > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {planejadosCount} Planejado{planejadosCount > 1 ? 's' : ''}
            </span>
          )}

          {onTriggerPollNow && (
            <button
              onClick={onTriggerPollNow}
              disabled={isCheckingAPI}
              className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 underline pl-1 border-l border-[#374151] cursor-pointer disabled:opacity-50"
              title="Executar checagem do polling agora mesmo"
            >
              Checar agora
            </button>
          )}
        </div>
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#1f2937] hover:bg-[#374151] text-gray-200 border border-[#374151] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          title="Verificar tokens e sincronizar dados com as APIs das redes"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : 'text-gray-400'}`} />
          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar APIs'}</span>
        </button>

        <button
          onClick={onExport}
          className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#1f2937] hover:bg-[#374151] text-gray-200 border border-[#374151] transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Exportar fila de agendamentos em CSV"
        >
          <Download className="w-3.5 h-3.5 text-gray-400" />
          <span>Exportar Fila</span>
        </button>

        {activeTab !== 'agendamento' && (
          <button
            onClick={onNewSchedule}
            className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Novo Agendamento</span>
          </button>
        )}
      </div>
    </header>
  );
};
