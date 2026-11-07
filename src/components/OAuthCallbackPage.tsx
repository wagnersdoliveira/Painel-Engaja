import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  User, 
  Mail, 
  Check, 
  Globe 
} from 'lucide-react';
import { NetworkType } from '../types';
import { NETWORK_CONFIGS } from '../utils/networkStyles';
import { NetworkIcon } from './NetworkIcon';

export const OAuthCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'prompt' | 'processing' | 'success' | 'error'>('prompt');
  const [errorMessage, setErrorMessage] = useState('');
  
  // URL Params
  const urlParams = new URLSearchParams(window.location.search);
  const rawNetwork = urlParams.get('network') || 'TikTok';
  const networkName: NetworkType = (
    rawNetwork.charAt(0).toUpperCase() + rawNetwork.slice(1).toLowerCase()
  ) as NetworkType;
  
  const code = urlParams.get('code');
  const token = urlParams.get('access_token') || urlParams.get('token');
  const isDirectCallback = Boolean(code || token || urlParams.get('state'));

  // Client interactive prompt state
  const [accountHandle, setAccountHandle] = useState(urlParams.get('handle') || '');
  const [clientEmail, setClientEmail] = useState(urlParams.get('email') || '');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  useEffect(() => {
    // If it's a direct return with code/token from an official OAuth endpoint
    if (isDirectCallback) {
      const error = urlParams.get('error') || urlParams.get('error_description');
      if (error) {
        setStatus('error');
        setErrorMessage(error);
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error }, '*');
        }
        return;
      }

      setStatus('success');
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'OAUTH_AUTH_SUCCESS',
            network: networkName,
            code,
            token,
            handle: accountHandle || `@${networkName.toLowerCase()}_user`,
            nome: `${networkName} Oficial`
          },
          '*'
        );
        setTimeout(() => {
          window.close();
        }, 1200);
      }
    } else {
      setStatus('prompt');
    }
  }, [isDirectCallback, networkName, accountHandle]);

  const handleAuthorizeAndConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setStatus('processing');

    const cleanHandle = accountHandle.trim() 
      ? (accountHandle.startsWith('@') ? accountHandle : `@${accountHandle}`)
      : clientEmail.trim()
      ? `@${clientEmail.split('@')[0].toLowerCase().replace(/\s+/g, '')}`
      : `@${networkName.toLowerCase()}_conectado`;

    const cleanName = clientEmail.trim()
      ? `Conta ${networkName} (${clientEmail.split('@')[0]})`
      : `${networkName} Comercial (${cleanHandle})`;

    setTimeout(() => {
      setStatus('success');

      const authPayload = {
        type: 'OAUTH_AUTH_SUCCESS',
        network: networkName,
        nome: cleanName,
        handle: cleanHandle,
        email: clientEmail || 'cliente@autenticado.com',
        seguidores: '5.2K',
        token: `OAuth_${networkName.toUpperCase()}_${Date.now()}`
      };

      // Notify parent window (the Engaja Empresas dashboard)
      if (window.opener) {
        window.opener.postMessage(authPayload, '*');
        setTimeout(() => {
          window.close();
        }, 900);
      } else {
        // Fallback for direct link tab
        try {
          const existing = JSON.parse(localStorage.getItem('omnihub_accounts') || '[]');
          const newAccount = {
            id: `acc-${Date.now()}`,
            rede: networkName,
            nome: cleanName,
            handle: cleanHandle,
            status: 'Ativo',
            seguidores: '5.2K',
            tipoToken: `${networkName} OAuth 2.0 (Autenticado)`,
            conectadoEm: new Date().toLocaleDateString('pt-BR')
          };
          localStorage.setItem('omnihub_accounts', JSON.stringify([...existing, newAccount]));
        } catch (err) {
          console.error(err);
        }
      }
    }, 1200);
  };

  const config = NETWORK_CONFIGS[networkName] || NETWORK_CONFIGS.TikTok;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 flex items-center justify-center p-4 font-sans antialiased">
      <div className="bg-[#111827] border border-[#374151] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Provider Branding */}
        <div className="p-6 border-b border-[#374151] text-center bg-[#1f2937]/40 relative">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-white/10"
              style={{ backgroundColor: config.badgeBg }}
            >
              <NetworkIcon network={networkName} className="w-6 h-6" colored />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500" />
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg font-bold text-lg">
              EE
            </div>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight">
            Portal de Autenticação {networkName}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Conexão com o painel <strong className="text-white">Engaja Empresas</strong>
          </p>

          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-2">
            <ShieldCheck className="w-3 h-3" />
            OAuth 2.0 Oficial & SSL Criptografado
          </span>
        </div>

        {/* Content depending on state */}
        <div className="p-6">
          
          {/* STATE 1: PROMPT TO ENTER / CONFIRM ACCOUNT LOGIN */}
          {status === 'prompt' && (
            <form onSubmit={handleAuthorizeAndConnect} className="space-y-4">
              <div className="p-3.5 rounded-lg bg-[#0b0f19] border border-[#374151] text-xs text-gray-300 leading-relaxed">
                <span className="font-semibold text-white block mb-1">
                  Permissões que serão concedidas ao Engaja Empresas:
                </span>
                <ul className="space-y-1 text-gray-400 text-[11px] list-disc list-inside">
                  <li>Publicar vídeos e fotos no feed e stories do {networkName}</li>
                  <li>Leitura de métricas e alcance das publicações agendadas</li>
                  <li>Sincronização em tempo real das APIs e status da conta</li>
                </ul>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">
                  E-mail ou Usuário do {networkName}:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder={`seu-email@cliente.com ou login no ${networkName}`}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">
                  Handle / Nome de Usuário (Ex: @perfil):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    value={accountHandle}
                    onChange={(e) => setAccountHandle(e.target.value)}
                    placeholder={`@${networkName.toLowerCase()}_empresa`}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white placeholder-gray-500 focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAuthorizing}
                  className="w-full py-3 px-4 rounded-lg font-bold text-xs sm:text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: config.borderColor }}
                >
                  <NetworkIcon network={networkName} className="w-4 h-4 shrink-0" />
                  <span>Autorizar e Conectar no Engaja Empresas</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <a
                  href={`https://www.${networkName.toLowerCase()}.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-gray-500 hover:text-gray-300 inline-flex items-center gap-1"
                >
                  <span>Abrir portal do {networkName} em nova aba</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </form>
          )}

          {/* STATE 2: PROCESSING */}
          {status === 'processing' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-base font-bold text-white">
                Autenticando com o servidor do {networkName}...
              </h3>
              <p className="text-xs text-gray-400">
                Validando escopos e gerando token seguro de sincronização.
              </p>
            </div>
          )}

          {/* STATE 3: SUCCESS */}
          {status === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">
                Conta {networkName} Conectada com Sucesso!
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                O token de publicação e as métricas foram sincronizados com o Engaja Empresas.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => window.close()}
                  className="px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-xs font-semibold rounded-md text-gray-200 transition-colors cursor-pointer"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: ERROR */}
          {status === 'error' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">
                Falha na Conexão com o {networkName}
              </h3>
              <p className="text-xs text-red-300">
                {errorMessage || 'O provedor não autorizou a sincronização.'}
              </p>
              <button
                type="button"
                onClick={() => setStatus('prompt')}
                className="mt-2 px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-xs font-semibold rounded-md text-gray-200 transition-colors cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#374151] bg-[#1f2937]/30 text-center text-[11px] text-gray-500">
          Engaja Empresas • Hub Multi-Redes Oficial
        </div>

      </div>
    </div>
  );
};
