import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TabId, Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { AccountsTab } from './components/AccountsTab';
import { SchedulerTab } from './components/SchedulerTab';
import { MetricsTab } from './components/MetricsTab';
import { RestrictionsTab } from './components/RestrictionsTab';
import { PostSimulatorModal } from './components/PostSimulatorModal';
import { Toast, ToastMessage } from './components/Toast';
import { 
  INITIAL_POSTS, 
  INITIAL_ACCOUNTS, 
  INITIAL_METRICS, 
  INITIAL_RESTRICTIONS 
} from './data/initialData';
import { Post, SocialAccount, MetricRow, RestrictionAlert, NetworkType } from './types';
import { checkScheduledStatusAPI, setPostToPlanejado } from './services/schedulerApiService';
import { syncAllSocialAPIs } from './services/socialApiSync';

export default function App() {
  // Active Tab
  const [activeTab, setActiveTab] = useState<TabId>('visao-geral');

  // Persistence with LocalStorage
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('omnihub_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [accounts, setAccounts] = useState<SocialAccount[]>(() => {
    try {
      const saved = localStorage.getItem('omnihub_accounts');
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [metrics, setMetrics] = useState<MetricRow[]>(() => {
    try {
      const saved = localStorage.getItem('omnihub_metrics');
      return saved ? JSON.parse(saved) : INITIAL_METRICS;
    } catch {
      return INITIAL_METRICS;
    }
  });

  const [restrictions, setRestrictions] = useState<RestrictionAlert[]>(() => {
    try {
      const saved = localStorage.getItem('omnihub_restrictions');
      return saved ? JSON.parse(saved) : INITIAL_RESTRICTIONS;
    } catch {
      return INITIAL_RESTRICTIONS;
    }
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('omnihub_posts', JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('omnihub_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('omnihub_restrictions', JSON.stringify(restrictions));
    } catch (e) {
      console.error(e);
    }
  }, [restrictions]);

  // Modal Simulator Post
  const [selectedPostForSimulation, setSelectedPostForSimulation] = useState<Post | null>(null);

  // Pre-selected network when navigating to scheduler
  const [preSelectedNetwork, setPreSelectedNetwork] = useState<NetworkType | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  // Polling State (Verificação a cada 30 segundos)
  const [isPollingActive, setIsPollingActive] = useState(true);
  const [nextPollIn, setNextPollIn] = useState(30);
  const [isCheckingAPI, setIsCheckingAPI] = useState(false);
  const [lastPollTime, setLastPollTime] = useState<string>('');

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Referência atualizada para evitar closures antigas dentro do timer
  const postsRef = useRef(posts);
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  // Função central de Polling da API Simulada
  const executePollingCheck = useCallback(async (isManualTrigger = false) => {
    setIsCheckingAPI(true);
    try {
      const currentPosts = postsRef.current;
      const result = await checkScheduledStatusAPI(currentPosts);

      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      setLastPollTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);

      if (result.publishedCount > 0) {
        setPosts(result.updatedPosts);

        // Atualiza as métricas de forma reativa para as redes dos posts publicados
        setMetrics(prevMetrics => {
          return prevMetrics.map(metric => {
            const publishedForNetwork = result.publishedPosts.filter(p => p.rede === metric.rede);
            if (publishedForNetwork.length > 0) {
              const addedReach = publishedForNetwork.length * 1520;
              const newReachNum = metric.alcanceNum + addedReach;
              return {
                ...metric,
                postsPublicados: metric.postsPublicados + publishedForNetwork.length,
                alcanceNum: newReachNum,
                alcance: `${(newReachNum / 1000).toFixed(1)}K`
              };
            }
            return metric;
          });
        });

        const titulos = result.publishedPosts.map(p => `"${p.titulo}" (${p.rede})`).join(', ');
        showToast(
          `📡 Polling API (30s): ${result.publishedCount} agendamento(s) promovido(s) de 'Planejado' para 'Publicado'! [${titulos}]`,
          'success'
        );
      } else if (isManualTrigger) {
        showToast(
          '📡 Polling API: Verificação concluída. Nenhuma publicação com status "Planejado" pendente no momento.',
          'info'
        );
      }
    } catch (error) {
      console.error('Erro no polling da API:', error);
    } finally {
      setIsCheckingAPI(false);
      setNextPollIn(30);
    }
  }, []);

  // Hook de Polling: decrementa a cada 1 segundo e dispara a API a cada 30 segundos
  useEffect(() => {
    if (!isPollingActive) return;

    const intervalId = setInterval(() => {
      setNextPollIn(prev => {
        if (prev <= 1) {
          executePollingCheck(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPollingActive, executePollingCheck]);

  // Handler: Reverter post para 'Planejado' para testes do usuário
  const handleRevertToPlanejado = (postId: number) => {
    setPosts(prev => setPostToPlanejado(postId, prev));
    showToast("Post alterado para status 'Planejado'. A função de polling irá publicá-lo em até 30 segundos!", 'info');
  };

  // Handler: Criar post de teste com status 'Planejado'
  const handleCreateTestPlanejadoPost = () => {
    const nextId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const testPost: Post = {
      id: nextId,
      rede: 'Instagram',
      conta: 'Engaja Empresas',
      handle: '@engajaempresas',
      titulo: `Post Demo Polling #${nextId}`,
      legenda: 'Publicação de teste gerada para validação da função de polling automático de 30 segundos no Engaja Empresas. #engajaempresas #polling #automacao',
      data: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} - ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      isoDate: now.toISOString(),
      status: 'Planejado',
      mediaType: 'Imagem Única'
    };

    setPosts(prev => [testPost, ...prev]);
    showToast(`Post de teste "${testPost.titulo}" adicionado com status 'Planejado'! O polling o publicará em até 30s.`, 'warning');
  };

  // Quantidade de posts 'Planejado' aguardando
  const planejadosCount = posts.filter(p => p.status === 'Planejado').length;

  // HANDLER: Schedule Batch
  const handleScheduleBatch = (newPostsBatch: Omit<Post, 'id'>[]) => {
    const baseId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
    const createdPosts: Post[] = newPostsBatch.map((item, idx) => ({
      ...item,
      id: baseId + idx + 1
    }));

    setPosts(prev => [...prev, ...createdPosts]);
    showToast(`🚀 ${createdPosts.length} publicação(ões) agendada(s) com sucesso nas redes!`, 'success');
    setActiveTab('visao-geral');
  };

  // HANDLER: Delete Post
  const handleDeletePost = (postId: number) => {
    if (confirm('Tem certeza que deseja cancelar e remover este agendamento?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      showToast('Agendamento cancelado com sucesso.', 'info');
      if (selectedPostForSimulation?.id === postId) {
        setSelectedPostForSimulation(null);
      }
    }
  };

  // HANDLER: Duplicate Post
  const handleDuplicatePost = (post: Post) => {
    const nextId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    const duplicated: Post = {
      ...post,
      id: nextId,
      titulo: `${post.titulo} (Cópia)`,
      status: 'Planejado'
    };
    setPosts(prev => [duplicated, ...prev]);
    showToast(`Post "${post.titulo}" duplicado na fila.`, 'success');
  };

  // HANDLER: Connect Account
  const handleConnectAccount = (accountData: Omit<SocialAccount, 'id' | 'conectadoEm'>) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const now = new Date();
    const connectedDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

    const newAccount: SocialAccount = {
      ...accountData,
      id: `acc-${Date.now()}`,
      conectadoEm: connectedDate
    };

    setAccounts(prev => [...prev, newAccount]);
    showToast(`Conta "${accountData.nome}" (${accountData.rede}) conectada com sucesso!`, 'success');
  };

  // HANDLER: Disconnect Account
  const handleDisconnectAccount = (accountId: string) => {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return;

    if (confirm(`Tem certeza que deseja desconectar a conta ${acc.nome} (${acc.rede})?`)) {
      setAccounts(prev => prev.filter(a => a.id !== accountId));
      showToast(`Conta ${acc.nome} desconectada do Engaja Empresas.`, 'warning');
    }
  };

  // HANDLER: Pre-schedule for specific account
  const handleScheduleForAccount = (network: NetworkType) => {
    setPreSelectedNetwork(network);
    setActiveTab('agendamento');
  };

  // HANDLER: Request Review / Appeal
  const handleRequestReview = (restrictionId: string, reason: string) => {
    setRestrictions(prev =>
      prev.map(r => (r.id === restrictionId ? { ...r, status: 'Em Revisão' } : r))
    );
    showToast('Pedido de revisão enviado com sucesso à equipe de moderação!', 'success');
  };

  // HANDLER: Sync APIs com verificação real de ping nas 6 plataformas
  const handleSyncAPIs = async () => {
    setIsSyncing(true);
    try {
      const syncResult = await syncAllSocialAPIs();
      setIsSyncing(false);
      showToast(
        `✅ APIs Sincronizadas! TikTok (${syncResult.results.TikTok.pingMs}ms), Meta (${syncResult.results.Instagram.pingMs}ms), LinkedIn (${syncResult.results.LinkedIn.pingMs}ms), YouTube (${syncResult.results.YouTube.pingMs}ms), Kwai (${syncResult.results.Kwai.pingMs}ms) — 100% Operacionais.`,
        'success'
      );
    } catch {
      setIsSyncing(false);
      showToast('Falha temporária ao sincronizar com as APIs das redes.', 'warning');
    }
  };

  // HANDLER: Limpar contas fictícias para o usuário usar apenas suas contas reais
  const handleClearDemoAccounts = () => {
    if (confirm('Deseja remover as contas de demonstração para trabalhar exclusivamente com suas contas conectadas reais?')) {
      setAccounts([]);
      showToast('Contas de demonstração removidas! Conecte suas contas reais agora.', 'info');
    }
  };

  // HANDLER: Restaurar contas de demonstração se necessário
  const handleRestoreDemoAccounts = () => {
    setAccounts(INITIAL_ACCOUNTS);
    showToast('Contas de exemplo restauradas.', 'success');
  };

  // HANDLER: Export CSV
  const handleExportCSV = () => {
    if (posts.length === 0) {
      showToast('Nenhum post na fila para exportar.', 'warning');
      return;
    }

    const headers = 'ID,Rede,Conta,Handle,Título,Data/Hora,Status,Formato,Legenda\n';
    const rows = posts.map(p => 
      `"${p.id}","${p.rede}","${p.conta}","${p.handle}","${p.titulo.replace(/"/g, '""')}","${p.data}","${p.status}","${p.mediaType || 'Padrão'}","${p.legenda.replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `omnihub_fila_agendamentos_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Fila de agendamentos exportada em CSV com sucesso!', 'success');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f19] text-[#9ca3af] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPreSelectedNetwork(null);
        }}
        accountsCount={accounts.length}
        scheduledPostsCount={posts.length}
        activeAlertsCount={restrictions.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onNewSchedule={() => {
            setPreSelectedNetwork(null);
            setActiveTab('agendamento');
          }}
          onExport={handleExportCSV}
          onSync={handleSyncAPIs}
          isSyncing={isSyncing}
          isPollingActive={isPollingActive}
          nextPollIn={nextPollIn}
          isCheckingAPI={isCheckingAPI}
          onTriggerPollNow={() => executePollingCheck(true)}
          planejadosCount={planejadosCount}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'visao-geral' && (
              <OverviewTab
                posts={posts}
                accounts={accounts}
                restrictions={restrictions}
                metrics={metrics}
                onNewSchedule={() => {
                  setPreSelectedNetwork(null);
                  setActiveTab('agendamento');
                }}
                onDeletePost={handleDeletePost}
                onDuplicatePost={handleDuplicatePost}
                onSelectPostToSimulate={(post) => setSelectedPostForSimulation(post)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                isPollingActive={isPollingActive}
                nextPollIn={nextPollIn}
                isCheckingAPI={isCheckingAPI}
                onTriggerPollNow={() => executePollingCheck(true)}
                onRevertToPlanejado={handleRevertToPlanejado}
                onCreateTestPlanejadoPost={handleCreateTestPlanejadoPost}
              />
            )}

            {activeTab === 'contas' && (
              <AccountsTab
                accounts={accounts}
                posts={posts}
                onConnectAccount={handleConnectAccount}
                onDisconnectAccount={handleDisconnectAccount}
                onDeletePost={handleDeletePost}
                onSelectPostToSimulate={(post) => setSelectedPostForSimulation(post)}
                onScheduleForAccount={handleScheduleForAccount}
                onClearDemoAccounts={handleClearDemoAccounts}
                onRestoreDemoAccounts={handleRestoreDemoAccounts}
                onSyncAPIs={handleSyncAPIs}
              />
            )}

            {activeTab === 'agendamento' && (
              <SchedulerTab
                onScheduleBatch={handleScheduleBatch}
                initialSelectedNetwork={preSelectedNetwork}
              />
            )}

            {activeTab === 'metricas' && (
              <MetricsTab
                metrics={metrics}
                onExportReport={handleExportCSV}
              />
            )}

            {activeTab === 'restricoes' && (
              <RestrictionsTab
                restrictions={restrictions}
                onRequestReview={handleRequestReview}
              />
            )}
          </div>
        </main>
      </div>

      {/* Post Simulator Mockup Modal */}
      <PostSimulatorModal
        post={selectedPostForSimulation}
        onClose={() => setSelectedPostForSimulation(null)}
        onEdit={(post) => {
          setPreSelectedNetwork(post.rede);
          setActiveTab('agendamento');
        }}
      />

      {/* Toast Feedback */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
