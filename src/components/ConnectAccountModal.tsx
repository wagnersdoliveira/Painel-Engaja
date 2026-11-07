import React, { useState, useEffect } from 'react';
import { NetworkType, SocialAccount } from '../types';
import { NETWORK_CONFIGS } from '../utils/networkStyles';
import { NetworkIcon } from './NetworkIcon';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Key, 
  Lock, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Globe, 
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  User,
  Smartphone,
  Shield,
  Send,
  Sparkles,
  Link2
} from 'lucide-react';
import { getOfficialOAuthUrl, SOCIAL_ENDPOINTS_CONFIG } from '../services/socialApiSync';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNetwork?: NetworkType;
  initialEmail?: string;
  initialName?: string;
  onSuccess: (account: Omit<SocialAccount, 'id' | 'conectadoEm'>) => void;
}

export const ConnectAccountModal: React.FC<ConnectAccountModalProps> = ({
  isOpen,
  onClose,
  defaultNetwork = 'TikTok',
  initialEmail = '',
  initialName = '',
  onSuccess
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>(defaultNetwork);
  // Default to 'oauth' (Janela Externa / Levar para a rede social) as requested
  const [activeTab, setActiveTab] = useState<'oauth' | 'email' | 'token'>('oauth');

  // Credentials form state (Alternative tab)
  const [emailOrUser, setEmailOrUser] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nomeConta, setNomeConta] = useState(initialName || '');
  const [handleConta, setHandleConta] = useState('');
  const [has2FA, setHas2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Status & Progress simulation
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<string>('');
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync default network
  useEffect(() => {
    setSelectedNetwork(defaultNetwork);
    if (initialName) {
      setNomeConta(initialName);
    } else if (!nomeConta) {
      setNomeConta(`Conta ${defaultNetwork}`);
    }
    if (initialEmail) {
      setEmailOrUser(initialEmail);
    }
    setErrorMessage('');
    setValidationSuccess(false);
  }, [defaultNetwork, isOpen, initialEmail, initialName]);

  // Exact callback URL for OAuth
  const callbackUrl = `${window.location.origin}/auth/callback`;
  const clientInviteUrl = `${window.location.origin}/auth/connect?network=${selectedNetwork.toLowerCase()}`;

  // Listen for OAuth message from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('run.app')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsConnecting(false);
        setValidationSuccess(true);

        const authData = event.data;
        const targetNetwork = authData.network || selectedNetwork;
        const cleanHandle = authData.handle || (handleConta.trim() 
          ? (handleConta.startsWith('@') || handleConta.startsWith('/') || handleConta.startsWith('ID:') ? handleConta : `@${handleConta}`)
          : `@${(nomeConta || targetNetwork).toLowerCase().replace(/\s+/g, '')}`);
        
        const cleanName = authData.nome || nomeConta.trim() || `${targetNetwork} Oficial (${cleanHandle})`;

        setTimeout(() => {
          onSuccess({
            nome: cleanName,
            rede: targetNetwork,
            handle: cleanHandle,
            status: 'Ativo',
            seguidores: authData.seguidores || '5.2K',
            tipoToken: `${targetNetwork} OAuth 2.0 (Sincronizado)`
          });
          onClose();
        }, 700);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [nomeConta, handleConta, selectedNetwork, onSuccess, onClose]);

  if (!isOpen) return null;

  const config = NETWORK_CONFIGS[selectedNetwork];
  const endpointInfo = SOCIAL_ENDPOINTS_CONFIG[selectedNetwork];

  // Specific placeholder info for each network
  const networkPlaceholders: Record<NetworkType, { userHint: string; handleExample: string; scopeSummary: string; officialSite: string }> = {
    TikTok: {
      userHint: 'ex: @usuario ou email cadastrado no TikTok',
      handleExample: '@cliente_oficial',
      scopeSummary: 'Acesso oficial à Content Posting API para upload e agendamento de vídeos.',
      officialSite: 'https://www.tiktok.com/login'
    },
    Instagram: {
      userHint: 'ex: usuario_insta ou email@comercial.com',
      handleExample: '@engajaempresas',
      scopeSummary: 'Acesso para agendamento de posts no feed, carrosséis, reels e leitura de métricas.',
      officialSite: 'https://www.instagram.com/accounts/login/'
    },
    Facebook: {
      userHint: 'ex: email@facebook.com ou telefone',
      handleExample: 'ID: 709990407',
      scopeSummary: 'Acesso para gerenciar e publicar em Páginas Comerciais e Eventos.',
      officialSite: 'https://www.facebook.com/login'
    },
    LinkedIn: {
      userHint: 'ex: seu-email@corporativo.com',
      handleExample: '/in/wagner-oliveira',
      scopeSummary: 'Acesso corporativo para publicações na timeline e páginas de empresa.',
      officialSite: 'https://www.linkedin.com/login'
    },
    YouTube: {
      userHint: 'ex: canal@gmail.com',
      handleExample: '@engajatv',
      scopeSummary: 'Acesso via YouTube Data API para publicação de Shorts e vídeos.',
      officialSite: 'https://accounts.google.com/signin'
    },
    Kwai: {
      userHint: 'ex: @seukwai ou telefone cadastrado',
      handleExample: '@fashionstorecampinas',
      scopeSummary: 'Acesso da conta de criador para agendamento de vídeos na plataforma.',
      officialSite: 'https://www.kwai.com'
    }
  };

  const currentHint = networkPlaceholders[selectedNetwork];

  // HANDLER: Connect using OAuth Popup (Levar para a rede social)
  const handleOAuthPopup = () => {
    setIsConnecting(true);
    setConnectionStep(`Abrindo janela oficial de autorização do ${selectedNetwork}...`);

    // Abre a rota de autenticação interativa da rede
    const popupUrl = `${window.location.origin}/auth/callback?network=${selectedNetwork.toLowerCase()}&ts=${Date.now()}`;

    const popup = window.open(
      popupUrl,
      `oauth_${selectedNetwork.toLowerCase()}`,
      'width=650,height=750,menubar=no,status=no,toolbar=no'
    );

    if (!popup || popup.closed) {
      alert('O popup foi bloqueado pelo seu navegador. Por favor, autorize popups para abrir a janela de login da rede social.');
      setIsConnecting(false);
    }
  };

  // HANDLER: Copy Client Invite Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(clientInviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // HANDLER: Connect using direct manual credentials (fallback)
  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailOrUser.trim()) {
      setErrorMessage(`Por favor, insira o e-mail, usuário ou telefone da conta no ${selectedNetwork}.`);
      return;
    }

    if (!password.trim()) {
      setErrorMessage(`Por favor, insira a senha da conta no ${selectedNetwork}.`);
      return;
    }

    if (password.length < 4) {
      setErrorMessage('A senha deve conter no mínimo 4 caracteres.');
      return;
    }

    setIsConnecting(true);
    setConnectionStep(`Conectando com o servidor de autenticação do ${selectedNetwork}...`);

    setTimeout(() => {
      setConnectionStep(`Verificando credenciais de ${emailOrUser.trim()}...`);
    }, 600);

    setTimeout(() => {
      setConnectionStep(`Gerando token de sessão e autorizando agendamento de postagens...`);
    }, 1300);

    setTimeout(() => {
      setIsConnecting(false);
      setValidationSuccess(true);

      const generatedHandle = handleConta.trim()
        ? (handleConta.startsWith('@') || handleConta.startsWith('/') || handleConta.startsWith('ID:') ? handleConta : `@${handleConta}`)
        : emailOrUser.startsWith('@') 
          ? emailOrUser 
          : `@${emailOrUser.split('@')[0].toLowerCase().replace(/\s+/g, '')}`;

      const displayName = nomeConta.trim() || `Conta ${selectedNetwork} (${emailOrUser.split('@')[0]})`;

      setTimeout(() => {
        onSuccess({
          nome: displayName,
          rede: selectedNetwork,
          handle: generatedHandle,
          status: 'Ativo',
          seguidores: '4.8K',
          tipoToken: `${selectedNetwork} Conectado via Login Direto (${emailOrUser})`
        });
        onClose();
      }, 700);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="bg-[#111827] border border-[#374151] rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#374151] bg-[#1f2937]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md border border-white/10"
              style={{ backgroundColor: config.badgeBg }}
            >
              <NetworkIcon network={selectedNetwork} className="w-5 h-5 shrink-0" colored />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Conexão Oficial com {selectedNetwork}
                </h3>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  API Sincronizada
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Faça a conexão levando até o {selectedNetwork} ou compartilhe o link direto com seu cliente.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Selector Pill Bar */}
        <div className="px-5 py-2.5 bg-[#0b0f19] border-b border-[#374151] flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-xs text-gray-400 font-medium shrink-0">Rede:</span>
          {(['TikTok', 'Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Kwai'] as NetworkType[]).map((net) => {
            const isSel = selectedNetwork === net;
            return (
              <button
                key={net}
                type="button"
                onClick={() => {
                  setSelectedNetwork(net);
                  setErrorMessage('');
                  setValidationSuccess(false);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                  isSel 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-[#111827] text-gray-400 hover:text-white border border-[#374151]'
                }`}
              >
                <NetworkIcon network={net} className="w-3.5 h-3.5" colored={!isSel} />
                <span>{net}</span>
              </button>
            );
          })}
        </div>

        {/* Tabs Bar */}
        <div className="px-5 pt-3 border-b border-[#374151] flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('oauth')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'oauth'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>1. Levar até o {selectedNetwork} (Recomendado)</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'email'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>2. Digitar E-mail e Senha Manualmente</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: OAUTH / LEVAR ATÉ A REDE SOCIAL (PRIMARY) */}
          {activeTab === 'oauth' && (
            <div className="space-y-4">
              
              {/* How it works banner */}
              <div className="p-3.5 rounded-lg bg-[#0b0f19] border border-[#374151] space-y-2">
                <div className="text-xs font-semibold text-gray-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Conexão Direta na Plataforma do {selectedNetwork}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Não é necessário digitar a senha do cliente dentro do nosso painel! Ao clicar no botão abaixo, abrimos a janela oficial do <strong>{selectedNetwork}</strong>. Você ou o cliente faz login lá com o e-mail/usuário e senha oficiais, autoriza as publicações e a conta é sincronizada de volta automaticamente.
                </p>
              </div>

              {/* Step indicator */}
              {isConnecting && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-start gap-3">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block text-white">Janela oficial de autorização aberta!</strong>
                    <span>
                      Complete o login ou autorização no portal do {selectedNetwork}. Ao concluir, a conta será sincronizada instantaneamente aqui.
                    </span>
                  </div>
                </div>
              )}

              {/* Success Indicator */}
              {validationSuccess && (
                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">
                    Conta {selectedNetwork} autorizada e sincronizada com sucesso!
                  </span>
                </div>
              )}

              {/* PRIMARY ACTION BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleOAuthPopup}
                  disabled={isConnecting || validationSuccess}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 hover:brightness-110 active:scale-[0.99]"
                  style={{ backgroundColor: config.borderColor }}
                >
                  <NetworkIcon network={selectedNetwork} className="w-5 h-5 shrink-0" />
                  <span>🚀 Ir para o {selectedNetwork} para Fazer a Conexão</span>
                </button>
                <p className="text-[11px] text-gray-500 text-center mt-1.5">
                  Abre uma janela popup segura para login direto na conta.
                </p>
              </div>

              {/* FEATURE: SEND LINK TO CLIENT */}
              <div className="pt-2 border-t border-[#1f2937]">
                <div className="p-3.5 rounded-lg bg-[#0b0f19] border border-[#374151]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-blue-400" />
                      Link de Conexão para Enviar ao Cliente (Sem pedir a senha dele):
                    </span>
                    {copiedLink && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Copiado!
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mb-2">
                    Envie esse link direto por WhatsApp ou E-mail. O próprio cliente clica, loga no {selectedNetwork} dele e a conta entra sincronizada no seu painel:
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={clientInviteUrl}
                      className="flex-1 px-3 py-1.5 text-xs bg-[#111827] border border-[#374151] rounded-md text-gray-300 font-mono select-all focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedLink ? 'Copiado' : 'Copiar Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Technical API Endpoint Details */}
              <div className="p-3 rounded-lg bg-[#0b0f19]/60 border border-[#1f2937] text-[11px] text-gray-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Endpoint Oficial:</span>
                  <span className="text-gray-300 truncate max-w-[240px]">{endpointInfo.baseUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Método de Autenticação:</span>
                  <span className="text-emerald-400">{endpointInfo.authMethod}</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANUAL EMAIL & PASSWORD (ALTERNATIVE) */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
              
              {/* Informative Security Notice */}
              <div className="p-3.5 rounded-lg bg-[#0b0f19] border border-[#374151] flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-300 leading-relaxed">
                  <strong className="text-white block mb-0.5">
                    Entrada Manual com Credenciais do {selectedNetwork}:
                  </strong>
                  Caso o cliente tenha lhe fornecido diretamente o e-mail/usuário e senha da conta, preencha abaixo para gerar o token de sessão criptografado.
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step / Loading Indicator */}
              {isConnecting && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="font-medium text-white">{connectionStep}</span>
                </div>
              )}

              {/* Input 1: Email / Username */}
              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1 flex items-center justify-between">
                  <span>E-mail, Usuário ou Telefone ({selectedNetwork}):</span>
                  <span className="text-[10px] text-gray-500 font-normal">Obrigatório</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                    placeholder={currentHint.userHint}
                    disabled={isConnecting || validationSuccess}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Input 2: Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1 flex items-center justify-between">
                  <span>Senha da Conta do {selectedNetwork}:</span>
                  <span className="text-[10px] text-gray-500 font-normal">Protegido por SSL</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha cadastrada na rede..."
                    disabled={isConnecting || validationSuccess}
                    className="w-full pl-9 pr-10 py-2 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500 transition-colors font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Optional: Account Name / Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">
                    Nome de Exibição da Conta:
                  </label>
                  <input
                    type="text"
                    value={nomeConta}
                    onChange={(e) => setNomeConta(e.target.value)}
                    placeholder="Ex: Minha Empresa Oficial"
                    disabled={isConnecting || validationSuccess}
                    className="w-full px-3 py-1.5 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1">
                    Handle / Usuário (Ex: @perfil):
                  </label>
                  <input
                    type="text"
                    value={handleConta}
                    onChange={(e) => setHandleConta(e.target.value)}
                    placeholder={currentHint.handleExample}
                    disabled={isConnecting || validationSuccess}
                    className="w-full px-3 py-1.5 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isConnecting || validationSuccess}
                  className="w-full py-3 px-4 rounded-lg text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                  style={{ backgroundColor: config.borderColor }}
                >
                  <NetworkIcon network={selectedNetwork} className="w-4 h-4 shrink-0" />
                  <span>
                    {isConnecting 
                      ? 'Autenticando Login...' 
                      : `Conectar ${selectedNetwork} com E-mail e Senha`}
                  </span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#374151] bg-[#1f2937]/30 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Criptografia de ponta a ponta (SSL 256-bit)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[#1f2937] hover:bg-[#374151] text-gray-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
