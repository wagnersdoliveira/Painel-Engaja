import { NetworkType } from '../types';

export interface NetworkConfig {
  name: NetworkType;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  charLimit: number;
  apiName: string;
  optimalTime: string;
  rules: string;
}

export const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  Instagram: {
    name: 'Instagram',
    color: '#ec4899',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    badgeText: '#f472b6',
    borderColor: '#db2777',
    charLimit: 2200,
    apiName: 'Meta Graph API v21.0',
    optimalTime: '11:00 - 13:00 / 18:00 - 20:00',
    rules: 'Até 30 hashtags. Limite máximo de 29 dias para agendamento direto via API.'
  },
  Facebook: {
    name: 'Facebook',
    color: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    badgeText: '#60a5fa',
    borderColor: '#2563eb',
    charLimit: 63206,
    apiName: 'Meta Page Access API',
    optimalTime: '09:00 - 11:00 / 13:00 - 15:00',
    rules: 'Links clicáveis liberados. Ideal com imagens 1200x630 ou carrossel de produtos.'
  },
  TikTok: {
    name: 'TikTok',
    color: '#22d3ee',
    badgeBg: 'rgba(34, 211, 238, 0.15)',
    badgeText: '#67e8f9',
    borderColor: '#06b6d4',
    charLimit: 2200,
    apiName: 'TikTok Content Posting API',
    optimalTime: '12:00 - 15:00 / 19:00 - 22:00',
    rules: 'Vídeos verticais 9:16. Limite recomendado de até 15 uploads automáticos a cada 24h.'
  },
  LinkedIn: {
    name: 'LinkedIn',
    color: '#0ea5e9',
    badgeBg: 'rgba(14, 165, 233, 0.15)',
    badgeText: '#38bdf8',
    borderColor: '#0284c7',
    charLimit: 3000,
    apiName: 'LinkedIn Community Mgmt v2',
    optimalTime: '07:30 - 09:30 / 12:00 - 14:00',
    rules: 'Tom profissional, sem exagero de hashtags (3 a 5 ideais). Quebras de linha e dados.'
  },
  YouTube: {
    name: 'YouTube',
    color: '#ef4444',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    badgeText: '#f87171',
    borderColor: '#dc2626',
    charLimit: 5000,
    apiName: 'YouTube Data API v3',
    optimalTime: '14:00 - 17:00 / 20:00 - 22:00',
    rules: 'Título de Shorts até 100 caracteres. Descrições suportam links e tags completas.'
  },
  Kwai: {
    name: 'Kwai',
    color: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    badgeText: '#fb923c',
    borderColor: '#ea580c',
    charLimit: 1000,
    apiName: 'Kwai Open Platform API',
    optimalTime: '11:00 - 14:00 / 19:00 - 22:00',
    rules: 'Vídeos dinâmicos até 60 segundos com legendas diretas e hashtags populares.'
  }
};
