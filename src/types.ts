export type NetworkType = 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn' | 'YouTube' | 'Kwai';

export type PostStatus = 'Agendado' | 'Planejado' | 'Publicado' | 'Rascunho';

export type MediaType = 'Carrossel' | 'Reels / Vídeo Curto' | 'Imagem Única' | 'Artigo / Texto';

export interface Post {
  id: number;
  rede: NetworkType;
  conta: string;
  handle: string;
  titulo: string;
  legenda: string;
  data: string; // "DD/MM/YYYY - HH:MM" or ISO
  isoDate?: string;
  status: PostStatus;
  mediaType?: MediaType;
  slidesCount?: number;
  duration?: string;
}

export interface SocialAccount {
  id: string;
  rede: NetworkType;
  nome: string;
  handle: string;
  status: 'Ativo' | 'Pendente' | 'Restrito' | 'Desconectado';
  seguidores: string;
  tipoToken: string;
  conectadoEm: string;
}

export interface MetricRow {
  rede: NetworkType;
  alcance: string;
  alcanceNum: number;
  engajamento: string;
  engajamentoNum: number;
  cliquesLink: string;
  crescimento: string;
  crescimentoNum: number;
  postsPublicados: number;
}

export interface RestrictionAlert {
  id: string;
  rede: NetworkType;
  conta: string;
  handle: string;
  tipoAlerta: string;
  motivo: string;
  prazo: string;
  status: 'Aviso Ativo' | 'Em Revisão' | 'Resolvido';
  detalhes: string;
  acoesRecomendadas: string[];
}
