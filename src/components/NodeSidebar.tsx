import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, GitBranch, User, Clock, Link2, ArrowRight } from 'lucide-react';
import { TreeNode, NodeType } from '../types';

interface NodeSidebarProps {
  node: TreeNode | null;
  nodes: Record<string, TreeNode>;
  onClose: () => void;
  onVote: (id: string) => void;
}

const NODE_CONFIG: Record<NodeType, { gradient: string; icon: string; label: string }> = {
  root: { gradient: 'from-slate-700 to-slate-900', icon: '🎯', label: 'Тема' },
  thesis: { gradient: 'from-indigo-600 to-indigo-800', icon: '💡', label: 'Тезис' },
  argument: { gradient: 'from-emerald-600 to-emerald-800', icon: '✅', label: 'Аргумент' },
  counterargument: { gradient: 'from-rose-600 to-rose-800', icon: '⚡', label: 'Контраргумент' },
  question: { gradient: 'from-amber-500 to-amber-700', icon: '❓', label: 'Вопрос' },
  conclusion: { gradient: 'from-violet-600 to-violet-800', icon: '🏁', label: 'Вывод' },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  return `${Math.floor(hours / 24)} дн назад`;
}

export default function NodeSidebar({ node, nodes, onClose, onVote }: NodeSidebarProps) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute right-0 top-0 bottom-0 w-72 bg-slate-900 border-l border-slate-800 shadow-2xl z-30 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className={`bg-gradient-to-br ${NODE_CONFIG[node.type].gradient} p-4`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{NODE_CONFIG[node.type].icon}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                  {NODE_CONFIG[node.type].label}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
            <p className="text-white font-semibold text-sm leading-relaxed">{node.text}</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Meta */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User size={12} />
                <span>{node.author}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock size={12} />
                <span>{timeAgo(node.createdAt)}</span>
              </div>
            </div>

            {/* Vote */}
            <button
              onClick={() => onVote(node.id)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <ThumbsUp size={14} className="text-indigo-400" />
              <span className="text-sm text-slate-300 font-medium">Поддержать</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 text-xs font-bold">{node.votes}</span>
            </button>

            {/* Parent */}
            {node.parentId && nodes[node.parentId] && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ArrowRight size={10} /> Родительский узел
                </div>
                <div className="rounded-lg bg-slate-800 border border-slate-700 p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{NODE_CONFIG[nodes[node.parentId].type].icon}</span>
                    <span className="text-xs text-slate-400">{NODE_CONFIG[nodes[node.parentId].type].label}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{nodes[node.parentId].text}</p>
                </div>
              </div>
            )}

            {/* Children */}
            {node.children.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <GitBranch size={10} /> Дочерние узлы ({node.children.length})
                </div>
                <div className="space-y-2">
                  {node.children.filter(cid => nodes[cid]).map(childId => {
                    const child = nodes[childId];
                    return (
                      <div key={childId} className="rounded-lg bg-slate-800 border border-slate-700 p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{NODE_CONFIG[child.type].icon}</span>
                          <span className="text-xs text-slate-400">{NODE_CONFIG[child.type].label}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{child.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Logic chain */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Link2 size={10} /> Цепочка логики
              </div>
              <div className="space-y-1">
                {buildChain(node, nodes).map((n, i) => (
                  <div key={n.id} className="flex items-start gap-2">
                    <div className="flex flex-col items-center mt-1">
                      <div className={`w-2 h-2 rounded-full ${i === buildChain(node, nodes).length - 1 ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                      {i < buildChain(node, nodes).length - 1 && <div className="w-px h-4 bg-slate-700" />}
                    </div>
                    <div className={`text-xs leading-relaxed ${i === buildChain(node, nodes).length - 1 ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                      {n.text.slice(0, 50)}{n.text.length > 50 ? '…' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function buildChain(node: TreeNode, nodes: Record<string, TreeNode>): TreeNode[] {
  const chain: TreeNode[] = [];
  let current: TreeNode | null = node;
  while (current) {
    chain.unshift(current);
    current = current.parentId ? (nodes[current.parentId] || null) : null;
    if (chain.length > 6) break;
  }
  return chain;
}
