import React, { useState } from 'react';
import { SocialAccount, NetworkType, Post } from '../types';
import { NETWORK_CONFIGS } from '../utils/networkStyles';
import { 
  PlusCircle, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  RefreshCw, 
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Layers,
  Heart,
  MessageCircle,
  Share2,
  Maximize2,
  Key,
  Lock
} from 'lucide-react';
import { NetworkIcon } from './NetworkIcon';
import { ConnectAccountModal } from './ConnectAccountModal';

interface AccountsTabProps {
  accounts: SocialAccount[];
  posts: Post[];
  onConnectAccount: (account: Omit<SocialAccount, 'id' | 'conectadoEm'>) => void;
  onDisconnectAccount: (accountId: string) => void;
  onDeletePost: (postId: number) => void;
  onSelectPostToSimulate: (post: Post) => void;
  onScheduleForAccount: (network: NetworkType) => void;
}

export const AccountsTab: React.FC<AccountsTabProps> = ({
  accounts,
  posts,
  onConnectAccount,
  onDisconnectAccount,
  onDeletePost,
  onSelectPostToSimulate,
  onScheduleForAccount
}) => {
  // New account form state
  const [nomeConta, setNomeConta] = useState('');
  const [handleConta, setHandleConta] = useState('');
  const [redeConta, setRedeConta] = useState<NetworkType>('Instagram');
  const [seguidores, setSeguidores] = useState('');

  // Selected account for card preview
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(accounts[0] || null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [justSelectedNotice, setJustSelectedNotice] = useState<string | null>(null);

  // Form Email & Credentials state
  const [formEmail, setFormEmail] = useState('');

  // Connection Gateway Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [modalNetwork, setModalNetwork] = useState<NetworkType>('Instagram');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setModalNetwork(redeConta);
    setIsConnectModalOpen(true);
  };

  // Filter posts for the selected account with fallback to network or all posts (matching user's prototype logic)
  const postsConta = selectedAccount
    ? posts.filter(
        p =>
          p.rede.toLowerCase() === selectedAccount.rede.toLowerCase() ||
          p.conta.toLowerCase().includes(selectedAccount.nome.toLowerCase()) ||
          selectedAccount.nome.toLowerCase().includes(p.conta.toLowerCase())
      )
    : [];

  // Fallback: if no direct match, show posts of that network or all posts so cards are always visible
  const postsParaExibir = postsConta.length > 0 
    ? postsConta 
    : (selectedAccount && posts.filter(p => p.rede.toLowerCase() === selectedAccount.rede.toLowerCase()).length > 0)
      ? posts.filter(p => p.rede.toLowerCase() === selectedAccount.rede.toLowerCase())
      : posts;

  const handleVerPreviewConta = (acc: SocialAccount, openDirectSimulator = false) => {
    setSelectedAccount(acc);
    setJustSelectedNotice(`Exibindo ${postsParaExibir.length} card(s) para ${acc.nome}`);
    
    // Smooth scroll to cards panel
    const el = document.getElementById('painel-previa-conta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    // If requested, open the first post directly in the full simulator
    if (openDirectSimulator) {
      const targetPost = postsParaExibir[0] || posts[0];
      if (targetPost) {
        onSelectPostToSimulate(targetPost);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PAINEL DE GERENCIAMENTO DE CONTAS */}
      <div className="bg-[#111827] border border-[#374151] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#374151] gap-2 mb-5">
          <div>
            <h3 className="text-base font-bold text-white">
              Gerenciamento de Contas Conectadas
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Conecte perfis comerciais, páginas e canais para automação e disparo em lote.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            {accounts.length} Contas Integradas
          </span>
        </div>

        {/* Conexão com Redes Oficiais por E-mail & Login */}
        <div className="bg-[#0b0f19] border border-[#374151] rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div>
              <div className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Conexão Oficial por E-mail e Login das Redes</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Autentique seu perfil comercial usando o e-mail/usuário e senha cadastrados na respectiva plataforma.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono flex items-center gap-1 self-start sm:self-auto">
              <ShieldCheck className="w-3 h-3" />
              Ambiente Criptografado SSL
            </span>
          </div>

          {/* 6 Botões Rápidos de Conexão com E-mail & Login */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {(['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'Kwai'] as NetworkType[]).map((net) => (
              <button
                key={net}
                type="button"
                onClick={() => {
                  setModalNetwork(net);
                  setNomeConta(`Minha Conta ${net}`);
                  setFormEmail('');
                  setIsConnectModalOpen(true);
                }}
                className="p-3 rounded-lg bg-[#111827] hover:bg-[#1f2937] border border-[#374151] hover:border-blue-500 transition-all text-xs font-semibold text-white flex flex-col items-center justify-center gap-1.5 shadow-xs cursor-pointer group"
              >
                <NetworkIcon network={net} className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" colored />
                <span className="text-[11px] text-center">Login {net}</span>
              </button>
            ))}
          </div>

          {/* Formulário Rápido com E-mail e Login */}
          <form onSubmit={handleConnect} className="pt-3 border-t border-[#1f2937]">
            <div className="text-[11px] font-medium text-gray-400 mb-2.5 flex items-center gap-1.5">
              <span>Ou insira os dados para autenticar diretamente:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Rede Social:
                </label>
                <select
                  value={redeConta}
                  onChange={(e) => setRedeConta(e.target.value as NetworkType)}
                  className="w-full px-3 py-2 text-xs bg-[#111827] border border-[#374151] rounded-md text-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Kwai">Kwai</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  E-mail ou Usuário da Rede:
                </label>
                <input
                  type="text"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="ex: conta@email.com ou @usuario"
                  className="w-full px-3 py-2 text-xs bg-[#111827] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Nome / Marca de Exibição:
                </label>
                <input
                  type="text"
                  value={nomeConta}
                  onChange={(e) => setNomeConta(e.target.value)}
                  placeholder="Ex: Smart Care Saúde"
                  className="w-full px-3 py-2 text-xs bg-[#111827] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Conectar por E-mail & Login</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tabela de Contas Conectadas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#374151] text-gray-400 font-semibold uppercase tracking-wider bg-[#1f2937]/40">
                <th className="py-2.5 px-3">Plataforma</th>
                <th className="py-2.5 px-3">Nome da Conta</th>
                <th className="py-2.5 px-3">Handle / ID</th>
                <th className="py-2.5 px-3">Seguidores</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {accounts.map((acc) => {
                const config = NETWORK_CONFIGS[acc.rede];
                const isSelected = selectedAccount?.id === acc.id;

                return (
                  <tr 
                    key={acc.id} 
                    className={`transition-colors ${isSelected ? 'bg-blue-600/10' : 'hover:bg-[#1f2937]/30'}`}
                  >
                    <td className="py-3 px-3">
                      <span
                        className="px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 w-fit"
                        style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                      >
                        <NetworkIcon network={acc.rede} className="w-3.5 h-3.5 shrink-0" />
                        <span>{acc.rede}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>{acc.nome}</span>
                        {isSelected && (
                          <span className="text-[10px] text-blue-400 font-mono">(Selecionada)</span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {acc.tipoToken}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-gray-300">
                      {acc.handle}
                    </td>

                    <td className="py-3 px-3 font-mono text-gray-300">
                      {acc.seguidores}
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        {acc.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botão Principal: Ver Prévia e Agendamentos */}
                        <button
                          onClick={() => handleVerPreviewConta(acc, false)}
                          className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            isSelected 
                              ? 'bg-blue-600 hover:bg-blue-500 text-white ring-2 ring-blue-400/50' 
                              : 'bg-[#1f2937] hover:bg-blue-600 text-gray-200 hover:text-white border border-[#374151]'
                          }`}
                          title="Exibir os cards de agendamento desta conta no painel abaixo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Prévia e Agendamentos</span>
                        </button>

                        {/* Botão Secundário: Abrir Card Direto no Mockup */}
                        <button
                          onClick={() => handleVerPreviewConta(acc, true)}
                          className="px-2 py-1.5 rounded bg-[#1f2937] hover:bg-[#374151] text-gray-300 hover:text-white text-xs border border-[#374151] transition-colors"
                          title="Abrir diretamente o simulador do primeiro card no celular"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDisconnectAccount(acc.id)}
                          className="px-2 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors"
                          title="Desconectar esta conta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. PAINEL DE PRÉVIA DE CARDS POR CONTA SELECIONADA */}
      <div 
        id="painel-previa-conta" 
        className="bg-[#111827] border border-[#374151] rounded-lg p-5 scroll-mt-20 shadow-md transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#374151] gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span id="titulo-previa">Prévia de Cards e Agendamentos</span>
              {selectedAccount && (
                <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {selectedAccount.nome} ({selectedAccount.rede})
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Visualização dos cards programados com prévia de layout, mídia, legenda e horário de disparo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedAccount && (
              <button
                onClick={() => onScheduleForAccount(selectedAccount.rede)}
                className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>+ Agendar para {selectedAccount.rede}</span>
              </button>
            )}
          </div>
        </div>

        {/* Account Selector Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin">
          <span className="text-xs text-gray-400 font-medium shrink-0">Filtrar por conta:</span>
          {accounts.map(acc => {
            const isSelected = selectedAccount?.id === acc.id;
            const config = NETWORK_CONFIGS[acc.rede];
            return (
              <button
                key={acc.id}
                onClick={() => handleVerPreviewConta(acc, false)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border border-blue-400 shadow-sm'
                    : 'bg-[#0b0f19] text-gray-400 hover:text-white border border-[#374151]'
                }`}
              >
                <NetworkIcon network={acc.rede} className="w-3.5 h-3.5 shrink-0" colored={!isSelected} />
                <span>{acc.nome}</span>
                <span className="text-[10px] opacity-80">({acc.rede})</span>
              </button>
            );
          })}
        </div>

        {/* Toast / Notice banner when account is selected */}
        {justSelectedNotice && (
          <div className="mb-4 px-3.5 py-2 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              {justSelectedNotice}
            </span>
            <button 
              onClick={() => setJustSelectedNotice(null)}
              className="text-[10px] text-gray-400 hover:text-white"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Card Grid Container */}
        {postsParaExibir.length === 0 ? (
          <div className="bg-[#0b0f19] border border-[#374151] rounded-lg p-10 text-center text-gray-400">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <div className="text-sm font-semibold text-gray-300">
              Nenhum post agendado especificamente para esta conta.
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Utilize o botão acima ou a aba de Agendamento para programar publicações para {selectedAccount?.nome || 'esta conta'}.
            </p>
            {selectedAccount && (
              <button
                onClick={() => onScheduleForAccount(selectedAccount.rede)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Criar Primeiro Agendamento</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="grid-previa-cards">
            {postsParaExibir.map((post) => {
              const config = NETWORK_CONFIGS[post.rede];
              const isExpanded = expandedCardId === post.id;
              const shortText = post.legenda.length > 90 ? post.legenda.substring(0, 90) + '...' : post.legenda;

              return (
                <div
                  key={post.id}
                  className="bg-[#0b0f19] border border-[#374151] rounded-xl p-4 flex flex-col justify-between hover:border-gray-500 transition-all shadow-md group relative overflow-hidden"
                  style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
                >
                  <div>
                    {/* Header: Network badge + Status */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className="px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5"
                        style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                      >
                        <NetworkIcon network={post.rede} className="w-3.5 h-3.5 shrink-0" />
                        <span>{post.rede}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {post.status}
                      </span>
                    </div>

                    {/* Visual Media Miniature Banner on the Card */}
                    <div 
                      onClick={() => onSelectPostToSimulate(post)}
                      className="relative w-full rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 p-3 mb-3 flex items-center justify-between cursor-pointer hover:border-blue-500/50 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                        >
                          <NetworkIcon network={post.rede} className="w-4 h-4 shrink-0" colored />
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            {post.mediaType || 'Mídia Digital'}
                          </div>
                          <div className="text-xs font-bold text-white line-clamp-1 max-w-[170px]">
                            {post.titulo}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-blue-400 opacity-80 group-hover:opacity-100 flex items-center gap-0.5 font-medium">
                        <Eye className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Title */}
                    <div 
                      onClick={() => onSelectPostToSimulate(post)}
                      className="font-bold text-white text-sm mb-1.5 line-clamp-1 cursor-pointer hover:text-blue-400 transition-colors" 
                      title={post.titulo}
                    >
                      {post.titulo}
                    </div>

                    {/* Short Legenda Box (Matches prototype compact & clean style) */}
                    <div className="bg-[#111827] border border-[#1f2937] p-2.5 rounded-lg text-xs text-gray-300 leading-relaxed mb-3">
                      <p className="text-[11px] text-gray-300">
                        {isExpanded ? post.legenda : shortText}
                      </p>
                      {post.legenda.length > 90 && (
                        <button
                          onClick={() => setExpandedCardId(isExpanded ? null : post.id)}
                          className="text-[10px] text-blue-400 hover:underline mt-1.5 block font-medium cursor-pointer"
                        >
                          {isExpanded ? 'Mostrar menos' : 'Expandir legenda completa'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Date + Actions */}
                  <div className="pt-2.5 border-t border-[#1f2937] flex items-center justify-between text-xs text-gray-400">
                    <span className="font-mono text-[11px] flex items-center gap-1 text-gray-300">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      {post.data}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectPostToSimulate(post)}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                        title="Ver card completo no simulador de celular"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver Card</span>
                      </button>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] transition-colors cursor-pointer"
                        title="Excluir este agendamento"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Real OAuth & Official API Connection Gateway Modal */}
      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        defaultNetwork={modalNetwork}
        onSuccess={(accountData) => {
          onConnectAccount(accountData);
          setNomeConta('');
          setHandleConta('');
        }}
      />

    </div>
  );
};
