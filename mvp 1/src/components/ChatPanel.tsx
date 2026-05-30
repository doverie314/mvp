import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ChevronRight } from 'lucide-react';
import { Message, Participant, TreeNode } from '../types';

interface ChatPanelProps {
  messages: Message[];
  participants: Participant[];
  nodes: Record<string, TreeNode>;
  onSendMessage: (text: string, author: string) => void;
  onHighlightNode: (id: string | null) => void;
  highlightedNodeId: string | null;
  currentUser: Participant;
}

export default function ChatPanel({ messages, participants, nodes, onSendMessage, onHighlightNode, highlightedNodeId, currentUser }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  function handleSend() {
    if (!input.trim()) return;
    onSendMessage(input.trim(), currentUser.name);
    setInput('');
    setIsAiTyping(true);
    setTimeout(() => setIsAiTyping(false), 1800);
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  const getParticipant = (name: string) => participants.find(p => p.name === name);

  const nodeTypeLabels: Record<string, string> = {
    thesis: 'Тезис',
    argument: 'Аргумент',
    counterargument: 'Контраргумент',
    question: 'Вопрос',
    conclusion: 'Вывод',
    root: 'Тема',
  };

  const nodeTypeBadge: Record<string, string> = {
    thesis: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    argument: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    counterargument: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    question: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    conclusion: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    root: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3">
        <div className="flex -space-x-2">
          {participants.filter(p => p.name !== 'ИИ-аналитик').map(p => (
            <div
              key={p.id}
              className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: p.color }}
              title={p.name}
            >
              {p.avatar}
            </div>
          ))}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Диалог</div>
          <div className="text-xs text-slate-400">{participants.length - 1} участника + ИИ</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const participant = getParticipant(msg.author);
            const isAI = msg.author === 'ИИ-аналитик';
            const linkedNode = msg.linkedNodeId ? nodes[msg.linkedNodeId] : null;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2 ${isAI ? 'flex-col' : ''}`}
              >
                {isAI ? (
                  <div className="rounded-xl bg-violet-900/40 border border-violet-500/30 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                        <Sparkles size={12} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-violet-300">ИИ-аналитик</span>
                      <span className="text-xs text-slate-500 ml-auto">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">{msg.text}</p>
                    {linkedNode && (
                      <button
                        onClick={() => onHighlightNode(msg.linkedNodeId === highlightedNodeId ? null : msg.linkedNodeId!)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs transition-colors ${
                          nodeTypeBadge[linkedNode.type] || 'bg-slate-700 text-slate-300 border-slate-600'
                        } hover:opacity-80`}
                      >
                        <ChevronRight size={11} />
                        {nodeTypeLabels[linkedNode.type]}: {linkedNode.text.slice(0, 35)}...
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5"
                      style={{ backgroundColor: participant?.color || '#64748b' }}
                    >
                      {participant?.avatar || msg.author.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-slate-300">{msg.author.split('(')[0].trim()}</span>
                        <span className="text-xs text-slate-600">{formatTime(msg.timestamp)}</span>
                        {participant?.role && (
                          <span className="text-xs text-slate-500 italic">{participant.role}</span>
                        )}
                      </div>
                      <div className="bg-slate-800 rounded-xl rounded-tl-none px-3 py-2">
                        <p className="text-sm text-slate-200 leading-relaxed">{msg.text}</p>
                      </div>
                      {linkedNode && (
                        <button
                          onClick={() => onHighlightNode(msg.linkedNodeId === highlightedNodeId ? null : msg.linkedNodeId!)}
                          className={`mt-1 flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs transition-colors ${
                            nodeTypeBadge[linkedNode.type] || 'bg-slate-700 text-slate-300 border-slate-600'
                          } hover:opacity-80`}
                        >
                          <ChevronRight size={10} />
                          <span className="truncate max-w-[160px]">→ {nodeTypeLabels[linkedNode.type]}</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* AI typing indicator */}
        <AnimatePresence>
          {isAiTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-900/30 border border-violet-500/20"
            >
              <Sparkles size={13} className="text-violet-400" />
              <span className="text-xs text-violet-400">ИИ анализирует и структурирует...</span>
              <div className="flex gap-1 ml-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-violet-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.avatar}
          </div>
          <span className="text-xs text-slate-400">{currentUser.name}</span>
        </div>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Введите аргумент или идею..."
            rows={2}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="self-end w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1.5 text-center">ИИ автоматически структурирует вашу мысль в дереве</p>
      </div>
    </div>
  );
}
