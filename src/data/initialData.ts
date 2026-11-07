import { Post, SocialAccount, MetricRow, RestrictionAlert } from '../types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    rede: 'Instagram',
    conta: 'Engaja Empresas',
    handle: '@engajaempresas',
    titulo: 'Carrossel: Estratégias de Vendas',
    legenda: 'Estratégia comprovada para fechar mais vendas no digital. Mande DIAGNÓSTICO no direct para receber a matriz completa em PDF. #engaja #vendas #estrategia #b2b #marketingdigital',
    data: '08/11/2026 - 07:00',
    isoDate: '2026-11-08T07:00',
    status: 'Agendado',
    mediaType: 'Carrossel',
    slidesCount: 5,
  },
  {
    id: 2,
    rede: 'TikTok',
    conta: 'Engaja Oficial',
    handle: '@engajaempresas',
    titulo: 'Reels/TikTok: Automação no WhatsApp',
    legenda: 'Como automatizar seu atendimento comercial sem perder humanização e convertendo 3x mais leads no primeiro minuto. Link na bio! #automacao #whatsapp #vendas #engaja #tecnologia',
    data: '09/11/2026 - 18:00',
    isoDate: '2026-11-09T18:00',
    status: 'Agendado',
    mediaType: 'Reels / Vídeo Curto',
    duration: '45s',
  },
  {
    id: 3,
    rede: 'LinkedIn',
    conta: 'Wagner Oliveira',
    handle: '/in/wagner-oliveira',
    titulo: 'Artigo: Liderança Cristã e Tech',
    legenda: 'Reflexões sobre princípios, governança e desenvolvimento de software resiliente. Por que integridade técnica e liderança servidora constroem times que entregam valor real no longo prazo. #lideranca #dev #software #cultura #tecnologia',
    data: '10/11/2026 - 08:30',
    isoDate: '2026-11-10T08:30',
    status: 'Agendado',
    mediaType: 'Artigo / Texto',
  },
  {
    id: 4,
    rede: 'Kwai',
    conta: 'Fashion Store Campinas',
    handle: '@fashionstorecampinas',
    titulo: 'Look do Dia - Coleção Natal',
    legenda: 'Novidades exclusivas na Fashion Store Campinas! Venha conferir os looks que já estão esgotando para as festas de fim de ano. WhatsApp para pedidos na bio. #fashion #natal #campinas #lookdodia #moda',
    data: '10/11/2026 - 10:00',
    isoDate: '2026-11-10T10:00',
    status: 'Planejado',
    mediaType: 'Reels / Vídeo Curto',
    duration: '30s',
  },
  {
    id: 5,
    rede: 'Facebook',
    conta: 'Engaja Empresas Page',
    handle: 'ID: 709990407',
    titulo: 'Live: Como Escalar Negócios em 2027',
    legenda: 'Nesta quinta-feira às 20h vamos desmistificar a transição do modelo tradicional para operações digitais integradas. Convide sua equipe e ative o lembrete! #negocios #escala #mentoria #facebooklive',
    data: '12/11/2026 - 20:00',
    isoDate: '2026-11-12T20:00',
    status: 'Agendado',
    mediaType: 'Imagem Única',
  },
  {
    id: 6,
    rede: 'YouTube',
    conta: 'Engaja TV Oficial',
    handle: '@engajatv',
    titulo: 'Shorts: Dica Rápida de Tráfego Pago',
    legenda: 'O erro número 1 que faz você torrar verba no Meta Ads sem gerar nenhum lead qualificado. Assista até o final e salve para não esquecer. #shorts #trafegopago #ads #marketingdigital',
    data: '13/11/2026 - 12:30',
    isoDate: '2026-11-13T12:30',
    status: 'Agendado',
    mediaType: 'Reels / Vídeo Curto',
    duration: '58s',
  }
];

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'acc-ig-1',
    rede: 'Instagram',
    nome: 'Engaja Empresas',
    handle: '@engajaempresas',
    status: 'Ativo',
    seguidores: '48.2K',
    tipoToken: 'Meta Graph API v21.0 (Token Long-Lived)',
    conectadoEm: '15/09/2026'
  },
  {
    id: 'acc-fb-1',
    rede: 'Facebook',
    nome: 'Engaja Empresas Page',
    handle: 'ID: 709990407',
    status: 'Ativo',
    seguidores: '19.5K',
    tipoToken: 'Meta Page Access Token (Permanente)',
    conectadoEm: '15/09/2026'
  },
  {
    id: 'acc-tk-1',
    rede: 'TikTok',
    nome: 'Engaja Oficial',
    handle: '@engajaempresas',
    status: 'Ativo',
    seguidores: '84.1K',
    tipoToken: 'TikTok Content Posting API (OAuth2)',
    conectadoEm: '22/09/2026'
  },
  {
    id: 'acc-li-1',
    rede: 'LinkedIn',
    nome: 'Wagner Oliveira',
    handle: '/in/wagner-oliveira',
    status: 'Ativo',
    seguidores: '14.8K',
    tipoToken: 'LinkedIn Community Mgmt v2 (OAuth2)',
    conectadoEm: '01/10/2026'
  },
  {
    id: 'acc-yt-1',
    rede: 'YouTube',
    nome: 'Engaja TV Oficial',
    handle: '@engajatv',
    status: 'Ativo',
    seguidores: '32.4K',
    tipoToken: 'Google OAuth2 (YouTube Data API v3)',
    conectadoEm: '05/10/2026'
  },
  {
    id: 'acc-kw-1',
    rede: 'Kwai',
    nome: 'Fashion Store Campinas',
    handle: '@fashionstorecampinas',
    status: 'Ativo',
    seguidores: '9.3K',
    tipoToken: 'Kwai Creator Platform API',
    conectadoEm: '12/10/2026'
  }
];

export const INITIAL_METRICS: MetricRow[] = [
  {
    rede: 'Instagram',
    alcance: '68.4K',
    alcanceNum: 68400,
    engajamento: '4.8%',
    engajamentoNum: 4.8,
    cliquesLink: '1.2K',
    crescimento: '+12%',
    crescimentoNum: 12,
    postsPublicados: 32
  },
  {
    rede: 'TikTok',
    alcance: '42.1K',
    alcanceNum: 42100,
    engajamento: '6.2%',
    engajamentoNum: 6.2,
    cliquesLink: '850',
    crescimento: '+25%',
    crescimentoNum: 25,
    postsPublicados: 28
  },
  {
    rede: 'Facebook',
    alcance: '18.3K',
    alcanceNum: 18300,
    engajamento: '2.1%',
    engajamentoNum: 2.1,
    cliquesLink: '430',
    crescimento: '+5%',
    crescimentoNum: 5,
    postsPublicados: 19
  },
  {
    rede: 'LinkedIn',
    alcance: '8.9K',
    alcanceNum: 8900,
    engajamento: '5.4%',
    engajamentoNum: 5.4,
    cliquesLink: '310',
    crescimento: '+15%',
    crescimentoNum: 15,
    postsPublicados: 14
  },
  {
    rede: 'YouTube',
    alcance: '3.5K',
    alcanceNum: 3500,
    engajamento: '7.0%',
    engajamentoNum: 7.0,
    cliquesLink: '120',
    crescimento: '+8%',
    crescimentoNum: 8,
    postsPublicados: 8
  },
  {
    rede: 'Kwai',
    alcance: '1.6K',
    alcanceNum: 1600,
    engajamento: '3.9%',
    engajamentoNum: 3.9,
    cliquesLink: '95',
    crescimento: '+10%',
    crescimentoNum: 10,
    postsPublicados: 11
  }
];

export const INITIAL_RESTRICTIONS: RestrictionAlert[] = [
  {
    id: 'rest-1',
    rede: 'Instagram',
    conta: 'Engaja Empresas',
    handle: '@engajaempresas',
    tipoAlerta: 'Restrição de Links',
    motivo: 'Práticas comerciais restritas (Link de afiliado na bio / links de redirecionamento identificados em mensagens diretas automáticas).',
    prazo: 'Até 02/12/2026 (Pode pedir revisão)',
    status: 'Aviso Ativo',
    detalhes: 'O algoritmo de integridade da Meta sinalizou links de encurtador externo não verificados no domínio corporativo da conta comercial.',
    acoesRecomendadas: [
      'Remover temporariamente links encurtados de domínios públicos (bit.ly, linktree gratuito).',
      'Configurar o domínio oficial verificado nas Configurações do Meta Business Suite.',
      'Enviar pedido de revisão formal comprovando a titularidade e política de privacidade do site.'
    ]
  },
  {
    id: 'rest-2',
    rede: 'TikTok',
    conta: 'Engaja Oficial',
    handle: '@engajaempresas',
    tipoAlerta: 'Alerta de Taxa de Requisições',
    motivo: 'Aproximação do teto operacional de 15 publicações automáticas no intervalo de 24 horas.',
    prazo: 'Renovação diária às 00:00 UTC',
    status: 'Aviso Ativo',
    detalhes: 'A conta publicou 11 posts nas últimas 18 horas. O teto recomendado pela TikTok Open API para evitar flag de spam é de 15/dia.',
    acoesRecomendadas: [
      'Espaçar agendamentos com intervalo mínimo de 60 minutos entre posts de vídeos.',
      'Distribuir publicações com mais foco nos horários de pico (12h às 14h e 18h às 21h).'
    ]
  }
];
