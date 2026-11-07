import React from 'react';
import { Post } from '../types';
import { NETWORK_CONFIGS } from '../utils/networkStyles';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Share2, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { NetworkIcon } from './NetworkIcon';

interface PostSimulatorModalProps {
  post: Post | null;
  onClose: () => void;
  onEdit?: (post: Post) => void;
}

export const PostSimulatorModal: React.FC<PostSimulatorModalProps> = ({
  post,
  onClose,
  onEdit
}) => {
  if (!post) return null;

  const config = NETWORK_CONFIGS[post.rede];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="bg-[#111827] border border-[#374151] rounded-xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-[#374151] flex items-center justify-between bg-[#1f2937]/50">
          <div className="flex items-center gap-2.5">
            <span 
              className="px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5"
              style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
            >
              <NetworkIcon network={post.rede} className="w-3.5 h-3.5 shrink-0" colored />
              <span>{post.rede}</span>
            </span>
            <span className="text-sm font-semibold text-white truncate max-w-xs">
              Simulador de Feed: {post.titulo}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: Device Frame + Meta Specs */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0b0f19]">
          
          {/* Left: Device Simulator Mockup */}
          <div className="md:col-span-7 flex justify-center">
            <div className="w-full max-w-[340px] bg-black border border-gray-800 rounded-3xl p-3 shadow-2xl flex flex-col text-white text-xs">
              
              {/* Phone Status bar */}
              <div className="flex justify-between items-center text-[10px] text-gray-400 px-2 pt-1 pb-2">
                <span>09:41</span>
                <div className="w-16 h-3.5 bg-gray-900 rounded-full mx-auto"></div>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <span className="w-4 h-2 border border-gray-400 rounded-xs inline-block"></span>
                </div>
              </div>

              {/* Feed Header */}
              <div className="flex items-center justify-between py-2 border-b border-gray-900 px-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px]"
                    style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                  >
                    <NetworkIcon network={post.rede} className="w-4 h-4 shrink-0" colored />
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1 text-[11px]">
                      {post.conta}
                      <CheckCircle2 className="w-3 h-3 text-blue-400 inline" />
                    </div>
                    <div className="text-[10px] text-gray-400">{post.handle}</div>
                  </div>
                </div>
                <span className="text-gray-500 font-bold">•••</span>
              </div>

              {/* Media Container Simulator */}
              <div className="relative mt-2 rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 aspect-square border border-gray-800 flex flex-col items-center justify-center p-4 text-center">
                <div className="absolute top-2.5 right-2.5 bg-black/60 px-2 py-0.5 rounded text-[10px] text-gray-300 flex items-center gap-1 backdrop-blur-xs">
                  <Layers className="w-3 h-3 text-blue-400" />
                  <span>{post.mediaType || 'Mídia Digital'}</span>
                </div>

                <div 
                  className="w-14 h-14 rounded-2xl mb-3 flex items-center justify-center text-lg font-bold shadow-lg"
                  style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                >
                  <NetworkIcon network={post.rede} className="w-7 h-7 shrink-0" colored />
                </div>

                <div className="text-xs font-bold text-white px-2 line-clamp-2">
                  {post.titulo}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 max-w-[200px] line-clamp-1">
                  Campanha Oficial Engaja Empresas
                </div>

                {post.slidesCount && (
                  <div className="absolute bottom-2.5 flex items-center gap-1">
                    {Array.from({ length: post.slidesCount }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-500 w-3' : 'bg-gray-600'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Feed Bar */}
              <div className="flex justify-between items-center py-2 px-1 text-gray-300">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 hover:text-red-500 cursor-pointer" />
                  <MessageCircle className="w-4 h-4 hover:text-blue-400 cursor-pointer" />
                  <Send className="w-4 h-4 hover:text-green-400 cursor-pointer" />
                </div>
                <Bookmark className="w-4 h-4 hover:text-yellow-400 cursor-pointer" />
              </div>

              {/* Likes counter */}
              <div className="font-semibold text-[11px] text-white px-1">
                4.821 curtidas
              </div>

              {/* Caption */}
              <div className="px-1 py-1.5 text-[11px] leading-relaxed text-gray-200 overflow-y-auto max-h-24">
                <span className="font-bold text-white mr-1.5">{post.handle.replace('@','')}</span>
                <span>{post.legenda}</span>
              </div>

              {/* Simulated Comments */}
              <div className="px-1 pt-1 text-[10px] text-gray-400 border-t border-gray-900 mt-1">
                Ver todos os 48 comentários...
              </div>
            </div>
          </div>

          {/* Right: Technical Specs & Scheduling Meta */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="bg-[#111827] border border-[#374151] rounded-lg p-4">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5">
                  Parâmetros de Publicação
                </h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#1f2937]">
                    <span className="text-gray-400">Canal:</span>
                    <span className="font-semibold text-white">{post.rede}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f2937]">
                    <span className="text-gray-400">Perfil:</span>
                    <span className="font-medium text-gray-200">{post.conta}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f2937]">
                    <span className="text-gray-400">Programado Para:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{post.data}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1f2937]">
                    <span className="text-gray-400">Formato:</span>
                    <span className="text-gray-300">{post.mediaType || 'Padrão'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Status API:</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400">
                      {post.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#111827] border border-[#374151] rounded-lg p-4">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Diretrizes da Plataforma
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {config.rules}
                </p>
                <div className="mt-3 text-[11px] text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Melhor horário sugerido: <strong>{config.optimalTime}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(post);
                    onClose();
                  }}
                  className="flex-1 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  Editar Conteúdo
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-[#1f2937] hover:bg-[#374151] text-gray-300 text-xs font-medium transition-colors"
              >
                Fechar
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
