import React, { useState, useEffect } from 'react';
import { NetworkType, MediaType, Post } from '../types';
import { NETWORK_CONFIGS } from '../utils/networkStyles';
import { 
  Rocket, 
  Calendar, 
  Clock, 
  Hash, 
  Smile, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone,
  Info,
  Sparkles
} from 'lucide-react';
import { NetworkIcon } from './NetworkIcon';

interface SchedulerTabProps {
  onScheduleBatch: (newPosts: Omit<Post, 'id'>[]) => void;
  initialSelectedNetwork?: NetworkType | null;
}

const POPULAR_HASHTAGS = [
  '#engaja',
  '#vendas',
  '#marketingdigital',
  '#automacao',
  '#whatsapp',
  '#b2b',
  '#sucesso',
  '#estrategia',
  '#empreendedorismo',
  '#conteudo'
];

const EMOJI_SHORTCUTS = ['🚀', '💡', '📊', '🔥', '📲', '✅', '🎯', '✨', '👉', '💼'];

export const SchedulerTab: React.FC<SchedulerTabProps> = ({
  onScheduleBatch,
  initialSelectedNetwork
}) => {
  // Network selection state
  const [selectedNetworks, setSelectedNetworks] = useState<NetworkType[]>(
    initialSelectedNetwork ? [initialSelectedNetwork] : ['Instagram', 'Facebook', 'TikTok']
  );

  // Form fields
  const [titulo, setTitulo] = useState('');
  const [legenda, setLegenda] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('Carrossel');
  const [slidesCount, setSlidesCount] = useState<number>(4);
  const [initialStatusChoice, setInitialStatusChoice] = useState<'Agendado' | 'Planejado'>('Agendado');

  // Live preview platform tab
  const [previewPlatform, setPreviewPlatform] = useState<NetworkType>('Instagram');

  // Set default datetime to tomorrow 09:00
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const defaultIso = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`;
    setDataHora(defaultIso);
  }, []);

  // Update preview platform if selection changes
  useEffect(() => {
    if (selectedNetworks.length > 0 && !selectedNetworks.includes(previewPlatform)) {
      setPreviewPlatform(selectedNetworks[0]);
    }
  }, [selectedNetworks]);

  // Toggle network selection
  const toggleNetwork = (net: NetworkType) => {
    if (selectedNetworks.includes(net)) {
      if (selectedNetworks.length === 1) {
        alert('Selecione pelo menos uma rede social para o agendamento.');
        return;
      }
      setSelectedNetworks(selectedNetworks.filter(n => n !== net));
    } else {
      setSelectedNetworks([...selectedNetworks, net]);
    }
  };

  const selectAllNetworks = () => {
    setSelectedNetworks(['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'Kwai']);
  };

  const selectOnlyMeta = () => {
    setSelectedNetworks(['Instagram', 'Facebook']);
  };

  // Add hashtag to caption
  const addHashtag = (tag: string) => {
    if (legenda.includes(tag)) return;
    setLegenda(prev => (prev ? `${prev.trim()} ${tag}` : tag));
  };

  // Add emoji
  const addEmoji = (emoji: string) => {
    setLegenda(prev => `${prev}${emoji}`);
  };

  // Quick date presets
  const setQuickDate = (offsetDays: number, hour: number, minute: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hour, minute, 0, 0);

    const pad = (n: number) => n.toString().padStart(2, '0');
    setDataHora(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
  };

  // Check 29-day Meta limit
  const daysDifference = (() => {
    if (!dataHora) return 0;
    const target = new Date(dataHora);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  })();

  const isMetaSelected = selectedNetworks.includes('Instagram') || selectedNetworks.includes('Facebook');
  const exceedsMeta29Days = isMetaSelected && daysDifference > 29;

  // Smallest char limit among selected
  const lowestCharLimit = Math.min(...selectedNetworks.map(n => NETWORK_CONFIGS[n].charLimit));
  const isOverCharLimit = legenda.length > lowestCharLimit;

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      alert('Por favor, informe o Título / Tema interno da publicação.');
      return;
    }

    if (!dataHora) {
      alert('Por favor, escolha uma data e horário de agendamento.');
      return;
    }

    if (selectedNetworks.length === 0) {
      alert('Selecione pelo menos uma rede social!');
      return;
    }

    // Format human-readable date "DD/MM/YYYY - HH:MM"
    const parsedDate = new Date(dataHora);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedData = `${pad(parsedDate.getDate())}/${pad(parsedDate.getMonth() + 1)}/${parsedDate.getFullYear()} - ${pad(parsedDate.getHours())}:${pad(parsedDate.getMinutes())}`;

    // Create a post for each selected network
    const newPostsBatch: Omit<Post, 'id'>[] = selectedNetworks.map(rede => {
      let conta = 'Engaja Empresas';
      let handle = '@engajaempresas';

      if (rede === 'LinkedIn') {
        conta = 'Wagner Oliveira';
        handle = '/in/wagner-oliveira';
      } else if (rede === 'Facebook') {
        conta = 'Engaja Empresas Page';
        handle = 'ID: 709990407';
      } else if (rede === 'YouTube') {
        conta = 'Engaja TV Oficial';
        handle = '@engajatv';
      } else if (rede === 'Kwai') {
        conta = 'Fashion Store Campinas';
        handle = '@fashionstorecampinas';
      }

      // If exceeds 29 days for Meta, status is 'Planejado' (stored queue)
      const status = (exceedsMeta29Days && (rede === 'Instagram' || rede === 'Facebook')) 
        ? 'Planejado' 
        : initialStatusChoice;

      return {
        rede,
        conta,
        handle,
        titulo: titulo.trim(),
        legenda: legenda.trim() || 'Sem legenda informada.',
        data: formattedData,
        isoDate: dataHora,
        status,
        mediaType,
        slidesCount: mediaType === 'Carrossel' ? slidesCount : undefined
      };
    });

    onScheduleBatch(newPostsBatch);

    // Reset fields
    setTitulo('');
    setLegenda('');
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: SCHEDULING FORM (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#374151] rounded-lg p-5">
          <div className="pb-4 border-b border-[#374151] mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Rocket className="w-4 h-4 text-blue-400" />
              <span>Criar & Agendar Nova Publicação em Lote</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Defina o conteúdo uma vez e dispare simultaneamente com adaptação inteligente.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. SELEÇÃO DE REDES SOCIAIS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-300">
                  Selecione a(s) Rede(s) de Destino:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllNetworks}
                    className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                  >
                    Marcar Todas (6)
                  </button>
                  <span className="text-gray-600">|</span>
                  <button
                    type="button"
                    onClick={selectOnlyMeta}
                    className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                  >
                    Somente Meta
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'Kwai'] as NetworkType[]).map((net) => {
                  const isChecked = selectedNetworks.includes(net);
                  const config = NETWORK_CONFIGS[net];

                  return (
                    <label
                      key={net}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#1f2937] border-blue-500 shadow-xs'
                          : 'bg-[#0b0f19] border-[#374151] hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleNetwork(net)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:outline-hidden cursor-pointer"
                      />
                      <div className="flex items-center justify-between w-full">
                        <span 
                          className="text-xs font-semibold flex items-center gap-1.5"
                          style={{ color: isChecked ? config.color : '#9ca3af' }}
                        >
                          <NetworkIcon network={net} className="w-3.5 h-3.5 shrink-0" colored={isChecked} />
                          <span>{net}</span>
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {config.charLimit > 10000 ? '60k+' : `${config.charLimit}`}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. TÍTULO / TEMA INTERNO */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Título / Tema Interno da Campanha:
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Lançamento Coleção Natal ou Anúncio Diagnóstico B2B"
                className="w-full px-3.5 py-2 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500"
                required
              />
            </div>

            {/* 3. FORMATO DE MÍDIA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Tipo de Mídia / Formato:
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as MediaType)}
                  className="w-full px-3 py-2 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="Carrossel">Carrossel de Imagens (Multi-slides)</option>
                  <option value="Reels / Vídeo Curto">Reels / TikTok / Shorts (Vídeo 9:16)</option>
                  <option value="Imagem Única">Imagem Única (Feed 1:1 / 4:5)</option>
                  <option value="Artigo / Texto">Artigo / Post Textual com Link</option>
                </select>
              </div>

              {mediaType === 'Carrossel' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Quantidade de Slides:
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={slidesCount}
                    onChange={(e) => setSlidesCount(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              )}
            </div>

            {/* 4. LEGENDA / TEXTO DA PUBLICAÇÃO */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-300">
                  Legenda / Texto da Publicação:
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono ${isOverCharLimit ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                    {legenda.length} / {lowestCharLimit} caracteres
                  </span>
                </div>
              </div>

              <textarea
                value={legenda}
                onChange={(e) => setLegenda(e.target.value)}
                rows={5}
                placeholder="Digite a legenda da publicação formatada com quebras de linha e call to action..."
                className={`w-full p-3 text-xs bg-[#0b0f19] border rounded-md text-white placeholder-gray-500 focus:outline-hidden ${
                  isOverCharLimit ? 'border-red-500' : 'border-[#374151] focus:border-blue-500'
                }`}
              />

              {/* Hashtag suggestions & emoji bar */}
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                    <Smile className="w-3 h-3 text-yellow-400" /> Emojis:
                  </span>
                  {EMOJI_SHORTCUTS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="px-1.5 py-0.5 rounded bg-[#0b0f19] hover:bg-[#1f2937] border border-[#374151] text-xs cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                    <Hash className="w-3 h-3 text-blue-400" /> Hashtags:
                  </span>
                  {POPULAR_HASHTAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addHashtag(tag)}
                      className="px-2 py-0.5 rounded bg-[#0b0f19] hover:bg-blue-600/20 text-gray-300 hover:text-blue-400 border border-[#374151] text-[11px] font-mono cursor-pointer transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. DATA E HORA COM ATALHOS */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Data e Hora do Agendamento:
              </label>
              
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  type="datetime-local"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white focus:outline-hidden focus:border-blue-500 font-mono flex-1"
                  required
                />
              </div>

              {/* Quick Date Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-gray-500 font-medium">Atalhos:</span>
                <button
                  type="button"
                  onClick={() => setQuickDate(0, 19, 0)}
                  className="px-2 py-0.5 text-[11px] rounded bg-[#0b0f19] border border-[#374151] text-gray-300 hover:text-white cursor-pointer"
                >
                  Hoje 19:00
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1, 8, 0)}
                  className="px-2 py-0.5 text-[11px] rounded bg-[#0b0f19] border border-[#374151] text-gray-300 hover:text-white cursor-pointer"
                >
                  Amanhã 08:00
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1, 12, 30)}
                  className="px-2 py-0.5 text-[11px] rounded bg-[#0b0f19] border border-[#374151] text-gray-300 hover:text-white cursor-pointer"
                >
                  Amanhã 12:30
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1, 18, 0)}
                  className="px-2 py-0.5 text-[11px] rounded bg-[#0b0f19] border border-[#374151] text-gray-300 hover:text-white cursor-pointer"
                >
                  Amanhã 18:00
                </button>
              </div>

              {/* Meta 29-Day Policy Alert */}
              {exceedsMeta29Days && (
                <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-200">Atenção ao limite de 29 dias da Meta:</strong>
                    A data escolhida está a {daysDifference} dias à frente. A Meta Graph API só aceita agendamento direto de até 29 dias. O post será registrado no Engaja Empresas com status <em>"Planejado"</em> e transmitido à Meta automaticamente assim que a janela permitida abrir.
                  </div>
                </div>
              )}
            </div>

            {/* 6. STATUS INICIAL DO POST */}
            <div className="p-3 rounded-lg bg-[#0b0f19] border border-[#374151]">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Status Inicial do Post na Fila:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInitialStatusChoice('Agendado')}
                  className={`p-2.5 rounded-md border text-left cursor-pointer transition-all ${
                    initialStatusChoice === 'Agendado'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs'
                      : 'bg-[#111827] border-[#374151] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Agendado (Cronograma)</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Programado para envio direto no horário estipulado.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setInitialStatusChoice('Planejado')}
                  className={`p-2.5 rounded-md border text-left cursor-pointer transition-all ${
                    initialStatusChoice === 'Planejado'
                      ? 'bg-amber-600/20 border-amber-500 text-white shadow-xs'
                      : 'bg-[#111827] border-[#374151] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Planejado (Polling Automático 30s)</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    O polling da API a cada 30s publicará automaticamente.
                  </p>
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>🚀 Agendar em Lote nas Redes ({selectedNetworks.length} selecionadas)</span>
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT: LIVE SIMULATOR + OPERATIONAL GUIDELINES (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Smartphone Feed Mockup */}
          <div className="bg-[#111827] border border-[#374151] rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#374151] mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-white">Simulador em Tempo Real</h4>
              </div>
              
              {/* Toggle platform preview */}
              <div className="flex gap-1">
                {selectedNetworks.slice(0, 4).map(net => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setPreviewPlatform(net)}
                    className={`px-2 py-0.5 text-[10px] rounded font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                      previewPlatform === net 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-[#0b0f19] text-gray-400 hover:text-white'
                    }`}
                  >
                    <NetworkIcon network={net} className="w-3 h-3 shrink-0" colored={previewPlatform === net} />
                    <span>{net}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mockup Card */}
            <div className="bg-black border border-gray-800 rounded-2xl p-3 text-xs text-white max-w-sm mx-auto shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]"
                    style={{ backgroundColor: NETWORK_CONFIGS[previewPlatform].badgeBg, color: NETWORK_CONFIGS[previewPlatform].badgeText }}
                  >
                    <NetworkIcon network={previewPlatform} className="w-3.5 h-3.5 shrink-0" colored />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-[11px]">
                      Engaja Empresas
                    </div>
                    <div className="text-[9px] text-gray-400">@engajaempresas</div>
                  </div>
                </div>
                <span 
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1"
                  style={{ backgroundColor: NETWORK_CONFIGS[previewPlatform].badgeBg, color: NETWORK_CONFIGS[previewPlatform].badgeText }}
                >
                  <NetworkIcon network={previewPlatform} className="w-2.5 h-2.5 shrink-0" />
                  <span>{previewPlatform}</span>
                </span>
              </div>

              {/* Mockup Media Frame */}
              <div className="relative rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 aspect-video flex flex-col items-center justify-center p-3 text-center border border-gray-800 mb-2">
                <Layers className="w-5 h-5 text-blue-400 mb-1" />
                <div className="font-bold text-white text-xs line-clamp-1">
                  {titulo || 'Título da Publicação'}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  Formato: {mediaType}
                </div>
              </div>

              {/* Mockup Caption */}
              <div className="text-[11px] text-gray-200 leading-snug line-clamp-4 bg-gray-950 p-2 rounded border border-gray-900">
                <span className="font-bold mr-1">engajaempresas</span>
                {legenda || 'A sua legenda em tempo real aparecerá aqui formatada com hashtags...'}
              </div>
            </div>
          </div>

          {/* Operational Guidelines Panel */}
          <div className="bg-[#111827] border border-[#374151] rounded-lg p-5">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>Instruções Operacionais e Boas Práticas</span>
            </h4>
            
            <ul className="space-y-2.5 text-xs text-gray-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Disparo em Lote:</strong> O agendamento é disparado em lote para todas as contas marcadas, respeitando os fusos e limites de upload de cada API.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Regra de 29 Dias da Meta:</strong> A API oficial da Meta (Instagram/Facebook) restringe programações a um horizonte máximo de 29 dias. Posts além deste intervalo são mantidos no Engaja Empresas até a liberação do intervalo.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>
                  <strong>Inspeção Visual de Cards:</strong> Use o botão <em>Ver Prévia e Agendamentos</em> na aba de Contas para inspecionar os cards resumidos e fazer ajustes pontuais.
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
