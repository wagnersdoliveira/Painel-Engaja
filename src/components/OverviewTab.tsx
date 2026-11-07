import React, { useState, useMemo } from 'react';
import { Post, NetworkType, SocialAccount, RestrictionAlert } from '../types';
import { NETWORK_CONFIGS } from '../utils/networkStyles';
import { 
  Users, 
  CalendarClock, 
  Eye, 
  AlertTriangle, 
  Search, 
  Filter, 
  Calendar, 
  List, 
  ExternalLink, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldAlert,
  Play,
  RotateCcw,
  Zap,
  Activity,
  Radio,
  RefreshCw
} from 'lucide-react';
import { NetworkIcon } from './NetworkIcon';
import { PerformanceSummary } from './PerformanceSummary';
import { MetricRow } from '../types';

interface OverviewTabProps {
  posts: Post[];
  accounts: SocialAccount[];
  restrictions: RestrictionAlert[];
  metrics?: MetricRow[];
  onNewSchedule: () => void;
  onDeletePost: (id: number) => void;
  onDuplicatePost: (post: Post) => void;
  onSelectPostToSimulate: (post: Post) => void;
  onNavigateTab: (tabId: any) => void;
  isPollingActive?: boolean;
  nextPollIn?: number;
  isCheckingAPI?: boolean;
  onTriggerPollNow?: () => void;
  onRevertToPlanejado?: (postId: number) => void;
  onCreateTestPlanejadoPost?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  posts,
  accounts,
  restrictions,
  metrics,
  onNewSchedule,
  onDeletePost,
  onDuplicatePost,
  onSelectPostToSimulate,
  onNavigateTab,
  isPollingActive = true,
  nextPollIn = 30,
  isCheckingAPI = false,
  onTriggerPollNow,
  onRevertToPlanejado,
  onCreateTestPlanejadoPost
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchNetwork = selectedNetwork === 'TODAS' || post.rede === selectedNetwork;
      const matchStatus = statusFilter === 'TODOS' || post.status === statusFilter;
      const matchSearch = searchQuery === '' || 
        post.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.legenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.conta.toLowerCase().includes(searchQuery.toLowerCase());
      return matchNetwork && matchStatus && matchSearch;
    });
  }, [posts, selectedNetwork, statusFilter, searchQuery]);

  // Network API health status data
  const networkStatuses: { network: NetworkType; platformName: string; status: string; statusType: 'success' | 'warning' | 'info'; ping: string }[] = [
    { network: 'Instagram', platformName: 'Instagram (Meta)', status: 'Restrição de Links', statusType: 'warning', ping: '142ms' },
    { network: 'Facebook', platformName: 'Facebook (Meta)', status: 'Conectado (API v21)', statusType: 'success', ping: '115ms' },
    { network: 'TikTok', platformName: 'TikTok Content API', status: 'Conectado', statusType: 'success', ping: '89ms' },
    { network: 'LinkedIn', platformName: 'LinkedIn API v2', status: 'Conectado', statusType: 'success', ping: '160ms' },
    { network: 'YouTube', platformName: 'YouTube Data v3', status: 'Conectado', statusType: 'success', ping: '94ms' },
    { network: 'Kwai', platformName: 'Kwai Open Platform', status: 'Conectado', statusType: 'success', ping: '185ms' }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. COMPONENTE DE RESUMO DE PERFORMANCE (RECHARTS AREA CHART) */}
      <PerformanceSummary metrics={metrics} />

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Contas */}
        <div 
          onClick={() => onNavigateTab('contas')}
          className="bg-[#111827] border border-[#374151] rounded-lg p-5 relative hover:border-gray-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Contas Conectadas
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% Online
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-mono">
            {accounts.length}
          </div>
          <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
            <span>6 redes ativas</span>
            <span className="text-blue-400 group-hover:underline text-[11px] flex items-center gap-0.5">
              Gerenciar <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* KPI 2: Posts Agendados */}
        <div 
          onClick={() => onNavigateTab('agendamento')}
          className="bg-[#111827] border border-[#374151] rounded-lg p-5 relative hover:border-gray-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Posts Agendados
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Próx. 30 dias
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-mono">
            {posts.length}
          </div>
          <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
            <span>Fila distribuída</span>
            <span className="text-blue-400 group-hover:underline text-[11px] flex items-center gap-0.5">
              + Novo Post <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* KPI 3: Alcance Total */}
        <div 
          onClick={() => onNavigateTab('metricas')}
          className="bg-[#111827] border border-[#374151] rounded-lg p-5 relative hover:border-gray-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Alcance Total (Mês)
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +18.4%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-mono">
            142.8K
          </div>
          <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
            <span>112.5k impressões únicas</span>
            <span className="text-blue-400 group-hover:underline text-[11px] flex items-center gap-0.5">
              Ver Relatório <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* KPI 4: Alertas / Restrições */}
        <div 
          onClick={() => onNavigateTab('restricoes')}
          className="bg-[#111827] border border-[#374151] rounded-lg p-5 relative hover:border-amber-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Alertas / Restrições
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Ação Requerida
            </span>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-3 font-mono">
            {restrictions.length}
          </div>
          <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
            <span className="truncate max-w-[150px]">Instagram (Links)</span>
            <span className="text-amber-400 group-hover:underline text-[11px] flex items-center gap-0.5">
              Ver Detalhes <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

      </div>

      {/* MAIN DASHBOARD SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: POST QUEUE TABLE / CALENDAR (2 Cols) */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#374151] rounded-lg p-5 flex flex-col justify-between">
          <div>
            {/* Header with Title and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#374151] mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Fila de Publicações Programadas</span>
                  <span className="text-xs font-mono font-normal text-gray-400">
                    ({filteredPosts.length} itens)
                  </span>
                </h3>
              </div>

              {/* View switch & New Schedule */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-[#0b0f19] p-0.5 rounded-md border border-[#374151]">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 transition-colors ${
                      viewMode === 'list' ? 'bg-[#1f2937] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Lista</span>
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 transition-colors ${
                      viewMode === 'calendar' ? 'bg-[#1f2937] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Semana</span>
                  </button>
                </div>

                <button
                  onClick={onNewSchedule}
                  className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>+ Novo Agendamento</span>
                </button>
              </div>
            </div>

            {/* BANNER DE POLLING AUTOMÁTICO (30s) */}
            <div className="mb-4 p-3.5 rounded-lg bg-[#0b0f19] border border-[#374151] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
                  <Radio className={`w-4 h-4 ${isCheckingAPI ? 'text-amber-400 animate-spin' : 'animate-pulse'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">Polling Automático de Agendamentos</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      Ciclo: 30s
                    </span>
                    {isCheckingAPI && (
                      <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1 animate-pulse">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Verificando API...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Checa a cada 30 segundos o status dos agendamentos na API simulada e promove de <span className="text-amber-400 font-semibold">'Planejado'</span> para <span className="text-emerald-400 font-semibold">'Publicado'</span> automaticamente.
                  </p>
                  {/* Barra de contagem regressiva */}
                  <div className="w-full bg-[#1f2937] h-1 rounded-full overflow-hidden mt-2 max-w-xs">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${Math.max(0, Math.min(100, ((30 - (nextPollIn ?? 30)) / 30) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <div className="text-right hidden sm:block mr-1">
                  <span className="text-[10px] text-gray-400 block font-mono">Próxima checagem:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{nextPollIn}s</span>
                </div>

                {onTriggerPollNow && (
                  <button
                    onClick={onTriggerPollNow}
                    disabled={isCheckingAPI}
                    className="px-2.5 py-1.5 rounded bg-[#1f2937] hover:bg-[#374151] border border-[#374151] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title="Executar verificação agora mesmo sem esperar o timer"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Checar Agora</span>
                  </button>
                )}

                {onCreateTestPlanejadoPost && (
                  <button
                    onClick={onCreateTestPlanejadoPost}
                    className="px-2.5 py-1.5 rounded bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Adicionar post de teste com status 'Planejado' para ver o polling funcionar"
                  >
                    <span>+ Testar 'Planejado'</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Filters bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-4">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tema ou legenda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Network Filter */}
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-gray-200 focus:outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="TODAS">Todas as Redes</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="TikTok">TikTok</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="YouTube">YouTube</option>
                <option value="Kwai">Kwai</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-gray-200 focus:outline-hidden focus:border-blue-500 cursor-pointer"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="Agendado">Agendado</option>
                <option value="Planejado">Planejado</option>
                <option value="Publicado">Publicado</option>
              </select>
            </div>

            {/* CONTENT: TABLE VIEW */}
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#374151] text-gray-400 font-semibold uppercase tracking-wider bg-[#1f2937]/40">
                      <th className="py-2.5 px-3">Rede</th>
                      <th className="py-2.5 px-3">Conta</th>
                      <th className="py-2.5 px-3">Título / Tema</th>
                      <th className="py-2.5 px-3">Data/Hora</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2937]">
                    {filteredPosts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          Nenhum post agendado encontrado para os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredPosts.map((post) => {
                        const config = NETWORK_CONFIGS[post.rede];
                        return (
                          <tr key={post.id} className="hover:bg-[#1f2937]/30 transition-colors">
                            {/* Rede */}
                            <td className="py-3 px-3">
                              <span
                                className="px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5 w-fit"
                                style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                              >
                                <NetworkIcon network={post.rede} className="w-3.5 h-3.5 shrink-0" />
                                <span>{post.rede}</span>
                              </span>
                            </td>

                            {/* Conta */}
                            <td className="py-3 px-3 text-gray-300 font-medium">
                              <span className="truncate block max-w-[120px]" title={post.conta}>
                                {post.handle}
                              </span>
                            </td>

                            {/* Título / Tema */}
                            <td className="py-3 px-3">
                              <div className="font-semibold text-white truncate max-w-[180px] sm:max-w-[220px]" title={post.titulo}>
                                {post.titulo}
                              </div>
                              <div className="text-[11px] text-gray-500 truncate max-w-[200px]">
                                {post.legenda}
                              </div>
                            </td>

                            {/* Data/Hora */}
                            <td className="py-3 px-3 font-mono text-gray-300 whitespace-nowrap">
                              {post.data}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3">
                              {post.status === 'Planejado' ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                  <span>Planejado (Polling)</span>
                                </span>
                              ) : post.status === 'Publicado' ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>Publicado</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  <Clock className="w-3 h-3" />
                                  <span>Agendado</span>
                                </span>
                              )}
                            </td>

                            {/* Ações */}
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onSelectPostToSimulate(post)}
                                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Ver Prévia e Card do Post no Celular"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Ver Prévia</span>
                                </button>
                                
                                {onRevertToPlanejado && post.status === 'Publicado' && (
                                  <button
                                    onClick={() => onRevertToPlanejado(post.id)}
                                    className="p-1.5 rounded hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                                    title="Reverter para 'Planejado' para testar o polling da API novamente"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => onDuplicatePost(post)}
                                  className="p-1.5 rounded hover:bg-[#374151] text-gray-300 hover:text-white transition-colors cursor-pointer"
                                  title="Duplicar Post"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeletePost(post.id)}
                                  className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                  title="Cancelar e Excluir"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* CALENDAR WEEKLY SCHEDULE VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {['08/11 (Dom)', '09/11 (Seg)', '10/11 (Ter)', '11/11 (Qua)', '12/11 (Qui)', '13/11 (Sex)'].map((dayStr, idx) => {
                  const dayPosts = posts.filter(p => p.data.includes(dayStr.split(' ')[0]));
                  return (
                    <div key={idx} className="bg-[#0b0f19] border border-[#374151] rounded-lg p-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#1f2937] text-xs font-semibold text-gray-300">
                        <span>{dayStr}</span>
                        <span className="font-mono text-[11px] text-gray-500">{dayPosts.length} post(s)</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        {dayPosts.length === 0 ? (
                          <div className="text-[11px] text-gray-600 py-3 text-center">Nenhum post</div>
                        ) : (
                          dayPosts.map(p => {
                            const config = NETWORK_CONFIGS[p.rede];
                            return (
                              <div
                                key={p.id}
                                onClick={() => onSelectPostToSimulate(p)}
                                className="p-2 rounded bg-[#111827] border border-[#374151] hover:border-blue-500/50 cursor-pointer transition-all text-[11px]"
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span
                                    className="px-1.5 py-0.2 rounded font-bold text-[10px] flex items-center gap-1"
                                    style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                                  >
                                    <NetworkIcon network={p.rede} className="w-3 h-3 shrink-0" />
                                    <span>{p.rede}</span>
                                  </span>
                                  <span className="font-mono text-gray-400 text-[10px]">
                                    {p.data.split('-')[1]?.trim() || ''}
                                  </span>
                                </div>
                                <div className="font-medium text-white truncate">{p.titulo}</div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#374151] text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
            <span>Dica: Clique no botão "Ver Prévia" em qualquer publicação para ver o simulador de tela real.</span>
            <span className="font-mono text-emerald-400">Total na fila: {posts.length}</span>
          </div>
        </div>

        {/* RIGHT: PLATFORM STATUS & INTEGRITY (1 Col) */}
        <div className="space-y-6">
          
          {/* Status das Redes Panel */}
          <div className="bg-[#111827] border border-[#374151] rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#374151] mb-3">
              <h3 className="text-base font-bold text-white">Status das Redes</h3>
              <span className="text-[11px] text-emerald-400 font-mono">Live Sync</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#374151] text-gray-400 bg-[#1f2937]/40">
                  <th className="py-2 px-2.5">Plataforma</th>
                  <th className="py-2 px-2.5">Status</th>
                  <th className="py-2 px-2.5 text-right">Ping</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2937]">
                {networkStatuses.map((item, idx) => {
                  return (
                    <tr key={idx} className="hover:bg-[#1f2937]/20 transition-colors">
                      <td className="py-2.5 px-2.5">
                        <div className="flex items-center gap-2">
                          <NetworkIcon network={item.network} className="w-4 h-4 shrink-0" colored />
                          <span className="font-medium text-gray-200">{item.platformName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2.5">
                        {item.statusType === 'warning' ? (
                          <span className="text-amber-400 font-medium flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 shrink-0" />
                            {item.status}
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            {item.status}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2.5 text-right font-mono text-gray-400 text-[11px]">
                        {item.ping}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 p-3 rounded bg-[#0b0f19] border border-[#374151] text-[11px] text-gray-400 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Atenção ao Instagram:</strong> Restrição ativa para inserção direta de links em mensagens automáticas. Clique na aba de Restrições para conferir o recurso.
              </div>
            </div>
          </div>

          {/* Quick Best Posting Times Widget */}
          <div className="bg-[#111827] border border-[#374151] rounded-lg p-5">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Horários Nobres por Canal</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#1f2937]">
                <span className="text-gray-400">Instagram / Facebook:</span>
                <span className="font-mono text-gray-200">11h - 13h & 18h - 20h</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#1f2937]">
                <span className="text-gray-400">TikTok & Kwai:</span>
                <span className="font-mono text-gray-200">12h - 14h & 19h - 22h</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-400">LinkedIn B2B:</span>
                <span className="font-mono text-gray-200">07:30 - 09:30 & 12h - 14h</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
