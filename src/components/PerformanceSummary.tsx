import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Users, 
  Sparkles, 
  Calendar,
  Activity,
  Layers
} from 'lucide-react';
import { MetricRow } from '../types';

interface PerformanceSummaryProps {
  metrics?: MetricRow[];
}

interface DayReachData {
  dia: string;
  dataCompleta: string;
  alcance: number; // em milhares (ex: 24.5 => 24.500)
  engajamento: number; // porcentagem ou valor absoluto
  posts: number;
}

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ metrics }) => {
  const [metricType, setMetricType] = useState<'alcance' | 'engajamento'>('alcance');

  // Dados consolidados dos últimos 7 dias (terminando hoje, 07/11/2026)
  const data7Dias: DayReachData[] = [
    { dia: 'Dom', dataCompleta: '01/11', alcance: 14.8, engajamento: 4.2, posts: 2 },
    { dia: 'Seg', dataCompleta: '02/11', alcance: 19.4, engajamento: 5.1, posts: 4 },
    { dia: 'Ter', dataCompleta: '03/11', alcance: 22.1, engajamento: 6.0, posts: 5 },
    { dia: 'Qua', dataCompleta: '04/11', alcance: 20.7, engajamento: 5.4, posts: 3 },
    { dia: 'Qui', dataCompleta: '05/11', alcance: 27.5, engajamento: 6.8, posts: 6 },
    { dia: 'Sex', dataCompleta: '06/11', alcance: 29.8, engajamento: 7.3, posts: 7 },
    { dia: 'Hoje (Sáb)', dataCompleta: '07/11', alcance: 34.6, engajamento: 8.1, posts: 5 }
  ];

  const totalAlcance7d = data7Dias.reduce((acc, item) => acc + item.alcance, 0).toFixed(1);
  const mediaDiaria = (parseFloat(totalAlcance7d) / 7).toFixed(1);
  const picoDia = data7Dias.reduce((prev, curr) => (curr.alcance > prev.alcance ? curr : prev), data7Dias[0]);
  const totalPosts7d = data7Dias.reduce((acc, item) => acc + item.posts, 0);

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DayReachData = payload[0].payload;
      return (
        <div className="bg-[#0b0f19] border border-[#374151] p-3 rounded-lg shadow-xl text-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 border-b border-[#1f2937] pb-1.5 mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              {data.dia} ({data.dataCompleta})
            </span>
            <span className="font-mono text-[10px] text-gray-400">
              {data.posts} posts disparados
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Alcance Total:
              </span>
              <span className="font-mono font-bold text-white">
                {data.alcance.toLocaleString('pt-BR')}K pessoas
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Taxa de Engajamento:
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {data.engajamento}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-lg p-5 shadow-xs">
      {/* Top Header of Component */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-[#374151] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Resumo de Performance & Tendência de Alcance
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +24.6% vs semana anterior
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Mapeamento dinâmico do alcance orgânico total acumulado em todas as 6 redes nos últimos 7 dias.
          </p>
        </div>

        {/* View Switcher / Quick Filter */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-[#0b0f19] p-0.5 rounded-md border border-[#374151]">
            <button
              onClick={() => setMetricType('alcance')}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                metricType === 'alcance'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Alcance (Pessoas)
            </button>
            <button
              onClick={() => setMetricType('engajamento')}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                metricType === 'engajamento'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Engajamento (%)
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[#1f2937]">
        <div className="bg-[#0b0f19] border border-[#1f2937] rounded-md p-3">
          <span className="text-[11px] text-gray-400 font-medium block">
            Alcance Total (7 dias)
          </span>
          <div className="text-xl font-mono font-bold text-white mt-1">
            {totalAlcance7d}K
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> Pico crescente
          </span>
        </div>

        <div className="bg-[#0b0f19] border border-[#1f2937] rounded-md p-3">
          <span className="text-[11px] text-gray-400 font-medium block">
            Média Diária
          </span>
          <div className="text-xl font-mono font-bold text-blue-400 mt-1">
            {mediaDiaria}K <span className="text-xs text-gray-400 font-normal">/dia</span>
          </div>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            Ritmo contínuo de audiência
          </span>
        </div>

        <div className="bg-[#0b0f19] border border-[#1f2937] rounded-md p-3">
          <span className="text-[11px] text-gray-400 font-medium block">
            Pico de Visualizações
          </span>
          <div className="text-xl font-mono font-bold text-amber-300 mt-1">
            {picoDia.alcance}K
          </div>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            Registrado em {picoDia.dia} ({picoDia.dataCompleta})
          </span>
        </div>

        <div className="bg-[#0b0f19] border border-[#1f2937] rounded-md p-3">
          <span className="text-[11px] text-gray-400 font-medium block">
            Publicações no Período
          </span>
          <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
            {totalPosts7d} posts
          </div>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            Distribuídos nas 6 redes
          </span>
        </div>
      </div>

      {/* RECHARTS AREA CHART */}
      <div className="pt-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span className="font-mono text-[11px] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            Curva de {metricType === 'alcance' ? 'Alcance Orgânico Diário (em Milhares)' : 'Engajamento Médio Diário (%)'}
          </span>
          <span className="text-[11px] text-gray-500 font-mono">
            01 Nov 2026 — 07 Nov 2026
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data7Dias}
              margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
            >
              <defs>
                {/* Gradiente azul para Alcance */}
                <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>

                {/* Gradiente verde para Engajamento */}
                <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#1f2937" 
                vertical={false}
              />

              <XAxis 
                dataKey="dia" 
                stroke="#6b7280" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />

              <YAxis 
                stroke="#6b7280" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
                tickFormatter={(val) => metricType === 'alcance' ? `${val}k` : `${val}%`}
              />

              <Tooltip content={<CustomTooltip />} />

              {metricType === 'alcance' ? (
                <Area
                  type="monotone"
                  dataKey="alcance"
                  name="Alcance Total"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#reachGradient)"
                  activeDot={{ r: 6, fill: '#60a5fa', stroke: '#1d4ed8', strokeWidth: 2 }}
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="engajamento"
                  name="Engajamento"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#engagementGradient)"
                  activeDot={{ r: 6, fill: '#34d399', stroke: '#047857', strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-gray-500 gap-2 border-t border-[#1f2937] pt-2">
          <span>
            💡 <strong>Insights de IA:</strong> O melhor desempenho de alcance ocorreu entre Quinta e Sábado, alinhado com formatos de vídeo curto (Reels, TikTok e Kwai).
          </span>
          <span className="font-mono text-blue-400">
            Atualizado em tempo real
          </span>
        </div>
      </div>
    </div>
  );
};
