import React, { useState } from 'react';
import { MetricRow } from '../types';
import { NETWORK_CONFIGS } from '../utils/networkStyles';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointerClick, 
  Users, 
  Download, 
  Calendar,
  Layers,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { NetworkIcon } from './NetworkIcon';

interface MetricsTabProps {
  metrics: MetricRow[];
  onExportReport: () => void;
}

export const MetricsTab: React.FC<MetricsTabProps> = ({
  metrics,
  onExportReport
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Scaling multiplier based on period
  const multiplier = selectedPeriod === '7d' ? 0.28 : selectedPeriod === '90d' ? 2.85 : 1.0;

  // Aggregate totals
  const totalAlcance = metrics.reduce((sum, m) => sum + Math.round(m.alcanceNum * multiplier), 0);
  const totalCliques = metrics.reduce((sum, m) => {
    const rawVal = parseInt(m.cliquesLink.replace('K', '000').replace('.', '')) || 0;
    return sum + Math.round(rawVal * multiplier);
  }, 0);
  const avgEngajamento = (metrics.reduce((sum, m) => sum + m.engajamentoNum, 0) / metrics.length).toFixed(1);

  // Highest reach network
  const maxReach = Math.max(...metrics.map(m => m.alcanceNum));

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Period Switch & Aggregate Cards */}
      <div className="bg-[#111827] border border-[#374151] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#374151] gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Painel de Desempenho e Inteligência de Audiência</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Dados consolidados de impressões, engajamento orgânico e conversão nas 6 redes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#0b0f19] p-0.5 rounded-md border border-[#374151]">
              <button
                onClick={() => setSelectedPeriod('7d')}
                className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  selectedPeriod === '7d' ? 'bg-[#1f2937] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setSelectedPeriod('30d')}
                className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  selectedPeriod === '30d' ? 'bg-[#1f2937] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                30 Dias
              </button>
              <button
                onClick={() => setSelectedPeriod('90d')}
                className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  selectedPeriod === '90d' ? 'bg-[#1f2937] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                90 Dias
              </button>
            </div>

            <button
              onClick={onExportReport}
              className="px-3 py-1.5 rounded-md bg-[#1f2937] hover:bg-[#374151] text-gray-200 border border-[#374151] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gray-400" />
              <span>Exportar PDF/CSV</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Mini-cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-lg bg-[#0b0f19] border border-[#374151]">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Alcance Consolidado Total</span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1.5 font-mono">
              {(totalAlcance / 1000).toFixed(1)}K
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span>+18.4% vs período anterior</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0b0f19] border border-[#374151]">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cliques Totais no Link</span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1.5 font-mono">
              {totalCliques.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span>Taxa CTR média de 2.4%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0b0f19] border border-[#374151]">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Média de Engajamento</span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1.5 font-mono">
              {avgEngajamento}%
            </div>
            <div className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
              <span>Liderado por YouTube (7.0%) e TikTok (6.2%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table: Desempenho Consolidado por Rede */}
      <div className="bg-[#111827] border border-[#374151] rounded-lg p-5">
        <div className="pb-3 border-b border-[#374151] mb-4">
          <h3 className="text-base font-bold text-white">
            Desempenho Consolidado por Rede
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#374151] text-gray-400 font-semibold uppercase tracking-wider bg-[#1f2937]/40">
                <th className="py-2.5 px-3">Plataforma</th>
                <th className="py-2.5 px-3">Impressões / Alcance</th>
                <th className="py-2.5 px-3">Engajamento (%)</th>
                <th className="py-2.5 px-3">Cliques no Link</th>
                <th className="py-2.5 px-3">Crescimento (Mês)</th>
                <th className="py-2.5 px-3 text-right">Participação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {metrics.map((row) => {
                const config = NETWORK_CONFIGS[row.rede];
                const scaledReach = (row.alcanceNum * multiplier / 1000).toFixed(1) + 'K';
                const sharePercent = Math.round((row.alcanceNum / maxReach) * 100);

                return (
                  <tr key={row.rede} className="hover:bg-[#1f2937]/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5"
                          style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                        >
                          <NetworkIcon network={row.rede} className="w-3.5 h-3.5 shrink-0" colored />
                          <span>{row.rede}</span>
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {scaledReach}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                        {row.engajamento}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-gray-300">
                      {row.cliquesLink}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-emerald-400 font-bold">
                        {row.crescimento}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-[#0b0f19] h-2 rounded-full overflow-hidden border border-[#374151]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${sharePercent}%`,
                              backgroundColor: config.color
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-gray-400 w-8 text-right">
                          {sharePercent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Format Comparison Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Carrossel de Imagens</span>
            <span className="text-emerald-400 font-bold font-mono">+64% Retenção</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">5.8% de Engajamento</div>
          <p className="text-[11px] text-gray-400 mt-1">
            Melhor formato para salvamentos e envio no direct no Instagram e LinkedIn.
          </p>
        </div>

        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Reels / TikTok / Shorts</span>
            <span className="text-emerald-400 font-bold font-mono">+142% Descoberta</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">6.2% de Engajamento</div>
          <p className="text-[11px] text-gray-400 mt-1">
            Máxima tração para alcançar usuários fora da base de seguidores atual.
          </p>
        </div>

        <div className="bg-[#111827] border border-[#374151] rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Texto + Link Direto</span>
            <span className="text-blue-400 font-bold font-mono">Alta Conversão</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">3.4% de CTR</div>
          <p className="text-[11px] text-gray-400 mt-1">
            Forte taxa de conversão direta em páginas corporativas do LinkedIn e Facebook.
          </p>
        </div>
      </div>

    </div>
  );
};
