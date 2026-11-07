import React, { useState } from 'react';
import { RestrictionAlert } from '../types';
import { NETWORK_CONFIGS } from '../utils/networkStyles';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  FileText, 
  Send, 
  HelpCircle,
  X
} from 'lucide-react';
import { NetworkIcon } from './NetworkIcon';

interface RestrictionsTabProps {
  restrictions: RestrictionAlert[];
  onRequestReview: (restrictionId: string, reason: string) => void;
}

export const RestrictionsTab: React.FC<RestrictionsTabProps> = ({
  restrictions,
  onRequestReview
}) => {
  // Modal state for dispute / appeal
  const [selectedAlert, setSelectedAlert] = useState<RestrictionAlert | null>(null);
  const [justification, setJustification] = useState('');
  const [presetSelected, setPresetSelected] = useState('Remoção completa de links de afiliados ou encurtadores não verificados.');

  // Checkbox state for recommendations
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'step-0': true,
    'step-1': false,
    'step-2': false
  });

  const toggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const handleOpenAppealModal = (alertItem: RestrictionAlert) => {
    setSelectedAlert(alertItem);
    setJustification(`Solicitamos a revisão da restrição para a conta ${alertItem.conta} (${alertItem.handle}). Confirmamos que a política comercial foi restabelecida e todos os links externos agora apontam estritamente para o domínio corporativo verificado no Meta Business Suite.`);
  };

  const handleSubmitAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert) return;

    onRequestReview(selectedAlert.id, justification);
    setSelectedAlert(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Active Restrictions Panel */}
      <div className="bg-[#111827] border border-[#374151] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#374151] gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Painel de Restrições e Alertas Ativos</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Monitore avisos de integridade das APIs, limites de uso e recursos de moderação.
            </p>
          </div>
          
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            {restrictions.length} Alerta(s) Ativo(s)
          </span>
        </div>

        {/* Restrictions Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#374151] text-gray-400 font-semibold uppercase tracking-wider bg-[#1f2937]/40">
                <th className="py-2.5 px-3">Rede / Conta</th>
                <th className="py-2.5 px-3">Tipo de Alerta</th>
                <th className="py-2.5 px-3">Motivo / Detalhes</th>
                <th className="py-2.5 px-3">Prazo / Status</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {restrictions.map((item) => {
                const config = NETWORK_CONFIGS[item.rede];
                const isUnderReview = item.status === 'Em Revisão';

                return (
                  <tr key={item.id} className="hover:bg-[#1f2937]/30 transition-colors">
                    {/* Rede / Conta */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5"
                          style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                        >
                          <NetworkIcon network={item.rede} className="w-3.5 h-3.5 shrink-0" colored />
                          <span>{item.rede}</span>
                        </span>
                      </div>
                      <div className="font-semibold text-white">{item.conta}</div>
                      <div className="text-[11px] font-mono text-gray-400">{item.handle}</div>
                    </td>

                    {/* Tipo de Alerta */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                        isUnderReview
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        <AlertTriangle className="w-3 h-3" />
                        {item.tipoAlerta}
                      </span>
                    </td>

                    {/* Motivo / Detalhes */}
                    <td className="py-3.5 px-3 max-w-sm">
                      <div className="text-gray-200 font-medium leading-relaxed">
                        {item.motivo}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {item.detalhes}
                      </div>
                    </td>

                    {/* Prazo / Status */}
                    <td className="py-3.5 px-3">
                      <div className="font-mono text-gray-300 font-medium">
                        {item.prazo}
                      </div>
                      <div className="text-[11px] mt-0.5">
                        {isUnderReview ? (
                          <span className="text-blue-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Em Revisão (Meta Support)
                          </span>
                        ) : (
                          <span className="text-amber-400 font-medium">
                            Pode pedir revisão
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Ação */}
                    <td className="py-3.5 px-3 text-right">
                      {isUnderReview ? (
                        <button
                          disabled
                          className="px-3 py-1.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold cursor-not-allowed opacity-80"
                        >
                          Recurso Enviado
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenAppealModal(item)}
                          className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Solicitar Revisão</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Interactive Action Plan & Remediation Checklist */}
        <div className="bg-[#0b0f19] border border-[#374151] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Plano de Remediação & Checklist Recomendado (Instagram)</span>
            </h4>
            <span className="text-xs text-gray-400 font-mono">
              Passos Obrigatórios para Aprovação de Recurso
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'step-0',
                title: '1. Remoção de Links Não Verificados',
                desc: 'Remover links encurtados de domínios públicos (bit.ly, linktree gratuito) e afiliados diretos da bio do perfil @engajaempresas.'
              },
              {
                id: 'step-1',
                title: '2. Verificação de Domínio no Meta Business Suite',
                desc: 'Adicionar a entrada DNS TXT no registro do domínio corporativo oficial para comprovação de titularidade e conformidade de comércio.'
              },
              {
                id: 'step-2',
                title: '3. Atualização dos Fluxos de Automação de DM',
                desc: 'Garantir que respostas automáticas enviadas via Direct contenham mensagem contextualizada e link apenas para páginas protegidas por SSL.'
              }
            ].map((step) => {
              const checked = completedSteps[step.id];
              return (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    checked
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-gray-200'
                      : 'bg-[#111827] border-[#374151] hover:border-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <div className={`text-xs font-semibold ${checked ? 'text-emerald-300' : 'text-white'}`}>
                      {step.title}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL: SOLICITAR REVISÃO / RECURSO FORMAL */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#111827] border border-[#374151] rounded-xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#374151] mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Solicitar Revisão de Restrição ({selectedAlert.rede})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAppeal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Conta e Motivo Sinalizado:
                </label>
                <div className="p-2.5 rounded bg-[#0b0f19] border border-[#374151] text-xs text-gray-300">
                  <strong>{selectedAlert.conta} ({selectedAlert.handle})</strong> — {selectedAlert.motivo}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Justificativa / Comprovação de Ajustes:
                </label>
                <textarea
                  rows={4}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full p-3 text-xs bg-[#0b0f19] border border-[#374151] rounded-md text-white focus:outline-hidden focus:border-blue-500 leading-relaxed"
                  placeholder="Explique os ajustes realizados em conformidade com as diretrizes da Meta..."
                  required
                />
              </div>

              <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
                O pedido será transmitido aos canais de moderação da plataforma. O prazo padrão de análise é de 24 a 48 horas úteis.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 rounded-md bg-[#1f2937] hover:bg-[#374151] text-gray-300 text-xs font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Recurso Oficial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
