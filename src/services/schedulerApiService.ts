import { Post } from '../types';

export interface PollingApiResult {
  updatedPosts: Post[];
  publishedCount: number;
  publishedPosts: Post[];
  apiTimestamp: string;
  latencyMs: number;
  message: string;
}

/**
 * Simula a chamada à API das redes sociais (Meta Graph API, TikTok Content API,
 * LinkedIn API, YouTube Data API, Kwai Open Platform).
 * 
 * Verifica os agendamentos na fila e atualiza o estado de 'Planejado' para 'Publicado'.
 */
export async function checkScheduledStatusAPI(posts: Post[]): Promise<PollingApiResult> {
  const startTime = performance.now();
  
  // Simulação de latência de rede realista (250ms a 400ms)
  await new Promise((resolve) => setTimeout(resolve, 320));

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestampStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  let publishedCount = 0;
  const publishedPosts: Post[] = [];

  const updatedPosts: Post[] = posts.map((post) => {
    // Regra solicitada: posts com status 'Planejado' são verificados e promovidos para 'Publicado'
    if (post.status === 'Planejado') {
      publishedCount++;
      const publishedPost: Post = {
        ...post,
        status: 'Publicado',
        // Atualiza a data para registrar o momento exato da publicação
        data: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} - ${pad(now.getHours())}:${pad(now.getMinutes())}`,
        isoDate: now.toISOString()
      };
      publishedPosts.push(publishedPost);
      return publishedPost;
    }
    return post;
  });

  const latencyMs = Math.round(performance.now() - startTime);

  return {
    updatedPosts,
    publishedCount,
    publishedPosts,
    apiTimestamp: timestampStr,
    latencyMs,
    message: publishedCount > 0
      ? `API disparou ${publishedCount} publicação(ões) com sucesso nas redes.`
      : 'Nenhuma publicação com status "Planejado" pendente nesta rodada.'
  };
}

/**
 * Publica um post individual imediatamente pela API
 */
export async function publishSinglePostAPI(postId: number, posts: Post[]): Promise<{ updatedPosts: Post[]; publishedPost?: Post }> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  let publishedPost: Post | undefined;

  const updatedPosts = posts.map((p) => {
    if (p.id === postId) {
      publishedPost = {
        ...p,
        status: 'Publicado' as const,
        data: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} - ${pad(now.getHours())}:${pad(now.getMinutes())}`,
        isoDate: now.toISOString()
      };
      return publishedPost;
    }
    return p;
  });

  return { updatedPosts, publishedPost };
}

/**
 * Converte um post de volta para 'Planejado' para facilitar testes repetidos de polling
 */
export function setPostToPlanejado(postId: number, posts: Post[]): Post[] {
  return posts.map((p) => {
    if (p.id === postId) {
      return {
        ...p,
        status: 'Planejado' as const
      };
    }
    return p;
  });
}
