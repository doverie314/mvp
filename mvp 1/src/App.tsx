import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Share2, Download, X, ChevronLeft, Sparkles, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import LandingPage from './components/LandingPage';
import TreeCanvas from './components/TreeCanvas';
import ChatPanel from './components/ChatPanel';
import NodeSidebar from './components/NodeSidebar';
import { demoSession } from './data/demoSession';
import { Session, TreeNode, NodeType, Message, Participant } from './types';

let nodeCounter = 100;

function generateId(prefix: string) {
  return `${prefix}-${++nodeCounter}-${Date.now().toString(36)}`;
}

const AI_RESPONSES = [
  { text: 'Структурирую вашу мысль: определён новый аргумент. Добавлен как дочерний узел к выбранной позиции.', type: 'argument' as NodeType },
  { text: 'Зафиксировано противоречие с предыдущим тезисом. Добавляю как контраргумент в дерево.', type: 'counterargument' as NodeType },
  { text: 'Выявлен уточняющий вопрос. Добавил в карту рассуждений — требует ответа участников.', type: 'question' as NodeType },
  { text: 'Ваша мысль синтезирует предыдущие позиции. Оформляю как промежуточный вывод.', type: 'conclusion' as NodeType },
  { text: 'Обнаружен новый тезис. Связываю с корневой темой и обновляю структуру дерева.', type: 'thesis' as NodeType },
  { text: 'Анализирую логическую цепочку... Добавлен аргумент в поддержку текущей позиции.', type: 'argument' as NodeType },
];

let aiIdx = 0;



export default function App() {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [session, setSession] = useState<Session>({ ...demoSession, nodes: { ...demoSession.nodes } });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [currentUser] = useState<Participant>(demoSession.participants[0]);
  const [showNewSession, setShowNewSession] = useState(false);
  const [newTitle, setNewTitle] = useState('');


  const handleStartDemo = useCallback(() => {
    setSession({ ...demoSession, nodes: { ...demoSession.nodes } });
    setView('workspace');
  }, []);

  const handleSelectNode = useCallback((id: string) => {
    setSelectedNodeId(prev => prev === id ? null : id);
  }, []);

  const handleAddChild = useCallback((parentId: string, type: NodeType) => {
    const placeholders: Record<NodeType, string[]> = {
      argument: ['Это поддерживает тезис, потому что...', 'Дополнительный аргумент в пользу...', 'Ключевое обоснование:'],
      counterargument: ['Однако стоит учесть...', 'Это противоречит тезису, так как...', 'Слабое место в аргументе:'],
      question: ['Как это соотносится с...?', 'Какие данные подтверждают...?', 'Что произойдёт, если...?'],
      conclusion: ['Таким образом, можно заключить...', 'ИИ-вывод: оптимальная стратегия —', 'Консенсус: стороны сошлись на том, что'],
      thesis: ['Новый тезис для обсуждения:', 'Предлагаю рассмотреть позицию:'],
      root: ['Корневая тема'],
    };
    const textOptions = placeholders[type] || ['Новый узел'];
    const text = textOptions[Math.floor(Math.random() * textOptions.length)];
    const newId = generateId(type);

    setSession(prev => {
      const newNode: TreeNode = {
        id: newId,
        type,
        text,
        author: currentUser.name,
        parentId,
        children: [],
        createdAt: Date.now(),
        votes: 0,
        isExpanded: true,
      };

      const updatedParent = {
        ...prev.nodes[parentId],
        children: [...prev.nodes[parentId].children, newId],
        isExpanded: true,
      };

      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [parentId]: updatedParent,
          [newId]: newNode,
        },
      };
    });

    setSelectedNodeId(newId);
    setHighlightedNodeId(newId);
    setTimeout(() => setHighlightedNodeId(null), 2000);
  }, [currentUser.name]);

  const handleVote = useCallback((id: string) => {
    setSession(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [id]: { ...prev.nodes[id], votes: prev.nodes[id].votes + 1 },
      },
    }));
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setSession(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [id]: { ...prev.nodes[id], isExpanded: !prev.nodes[id].isExpanded },
      },
    }));
  }, []);

  const handleSendMessage = useCallback((text: string, author: string) => {
    const msgId = generateId('msg');
    const aiResponse = AI_RESPONSES[aiIdx % AI_RESPONSES.length];
    aiIdx++;

    // Find a leaf node to attach the new node to
    const allNodes = Object.values(session.nodes);
    const leafNodes = allNodes.filter(n => n.children.length === 0 && n.type !== 'root');
    const attachTo = leafNodes.length > 0 ? leafNodes[leafNodes.length - 1] : allNodes.find(n => n.type === 'thesis') || allNodes[0];

    const newNodeId = generateId('node');
    const aiMsgId = generateId('aimsg');

    const userMsg: Message = {
      id: msgId,
      author,
      text,
      timestamp: Date.now(),
      linkedNodeId: newNodeId,
    };

    const aiMsg: Message = {
      id: aiMsgId,
      author: 'ИИ-аналитик',
      text: aiResponse.text,
      timestamp: Date.now() + 1500,
      linkedNodeId: newNodeId,
    };

    const newNode: TreeNode = {
      id: newNodeId,
      type: aiResponse.type,
      text: text.length > 60 ? text.slice(0, 57) + '...' : text,
      author,
      parentId: attachTo.id,
      children: [],
      createdAt: Date.now(),
      votes: 0,
      isExpanded: true,
    };

    setSession(prev => {
      const updatedAttachTo = {
        ...prev.nodes[attachTo.id],
        children: [...prev.nodes[attachTo.id].children, newNodeId],
        isExpanded: true,
      };

      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [attachTo.id]: updatedAttachTo,
          [newNodeId]: newNode,
        },
        messages: [...prev.messages, userMsg],
      };
    });

    // Add AI message after delay
    setTimeout(() => {
      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, aiMsg],
      }));
      setHighlightedNodeId(newNodeId);
      setTimeout(() => setHighlightedNodeId(null), 2500);
    }, 1800);
  }, [session.nodes]);

  const handleNewSession = useCallback(() => {
    if (!newTitle.trim()) return;
    const rootId = 'root';
    const newSess: Session = {
      id: generateId('session'),
      title: newTitle,
      description: '',
      rootId,
      createdAt: Date.now(),
      participants: [
        { id: 'p1', name: 'Вы', avatar: 'В', color: '#6366f1', role: 'Организатор' },
        { id: 'p4', name: 'ИИ-аналитик', avatar: '🤖', color: '#8b5cf6', role: 'Структуризатор' },
      ],
      messages: [{
        id: 'init',
        author: 'ИИ-аналитик',
        text: `Сессия "${newTitle}" открыта. Начните диалог — я буду структурировать ваши мысли в дерево рассуждений в реальном времени.`,
        timestamp: Date.now(),
      }],
      nodes: {
        [rootId]: {
          id: rootId,
          type: 'root',
          text: newTitle,
          author: 'Система',
          parentId: null,
          children: [],
          createdAt: Date.now(),
          votes: 0,
          isExpanded: true,
        },
      },
    };
    setSession(newSess);
    setSelectedNodeId(null);
    setNewTitle('');
    setShowNewSession(false);
    setView('workspace');
  }, [newTitle]);

  const nodeCount = Object.keys(session.nodes).length;
  const argCount = Object.values(session.nodes).filter(n => n.type === 'argument').length;
  const counterCount = Object.values(session.nodes).filter(n => n.type === 'counterargument').length;
  const conclusionCount = Object.values(session.nodes).filter(n => n.type === 'conclusion').length;

  if (view === 'landing') {
    return (
      <>
        <LandingPage onStartDemo={handleStartDemo} />
        <AnimatePresence>
          {showNewSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowNewSession(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-lg font-bold text-white mb-4">Новая сессия</h2>
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Тема обсуждения..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-4"
                  onKeyDown={e => e.key === 'Enter' && handleNewSession()}
                  autoFocus
                />
                <button
                  onClick={handleNewSession}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                >
                  Создать
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // WORKSPACE VIEW
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 h-12 bg-slate-950 border-b border-slate-800 flex-shrink-0 z-20">
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ChevronLeft size={15} />
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <GitBranch size={11} className="text-white" />
            </div>
            <span className="font-bold">ThinkTree</span>
          </div>
        </button>

        <div className="h-4 w-px bg-slate-700" />

        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-white truncate">{session.title}</span>
        </div>

        {/* Stats pills */}
        <div className="hidden md:flex items-center gap-2">
          {[
            { count: nodeCount, label: 'узлов', color: 'text-slate-400' },
            { count: argCount, label: 'аргументов', color: 'text-emerald-400' },
            { count: counterCount, label: 'контр.', color: 'text-rose-400' },
            { count: conclusionCount, label: 'выводов', color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
              <span className={`text-xs font-bold ${s.color}`}>{s.count}</span>
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {/* Participants */}
          <div className="flex -space-x-2 mr-1">
            {session.participants.filter(p => p.name !== 'ИИ-аналитик').slice(0, 4).map(p => (
              <div
                key={p.id}
                title={p.name}
                className="w-6 h-6 rounded-full border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: p.color }}
              >
                {p.avatar}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 mr-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Live</span>
          </div>

          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" title="Поделиться">
            <Share2 size={15} />
          </button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" title="Экспорт">
            <Download size={15} />
          </button>
          <button
            onClick={() => setShowNewSession(true)}
            className="ml-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium transition-colors"
          >
            + Новая сессия
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Chat panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 overflow-hidden"
              style={{ width: 300 }}
            >
              <ChatPanel
                messages={session.messages}
                participants={session.participants}
                nodes={session.nodes}
                onSendMessage={handleSendMessage}
                onHighlightNode={setHighlightedNodeId}
                highlightedNodeId={highlightedNodeId}
                currentUser={currentUser}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle chat button */}
        <button
          onClick={() => setChatOpen(prev => !prev)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-5 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 border-l-0 rounded-r-lg flex items-center justify-center transition-colors"
          style={{ left: chatOpen ? 300 : 0 }}
        >
          {chatOpen ? <PanelLeftClose size={12} className="text-slate-400" /> : <PanelLeftOpen size={12} className="text-slate-400" />}
        </button>

        {/* Tree canvas */}
        <div className="flex-1 min-w-0 relative" onClick={() => setSelectedNodeId(null)}>
          <TreeCanvas
            nodes={session.nodes}
            rootId={session.rootId}
            participants={session.participants}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            onAddChild={handleAddChild}
            onVote={handleVote}
            onToggleExpand={handleToggleExpand}
            highlightedNodeId={highlightedNodeId}
          />

          {/* Legend overlay */}
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-xl p-3 space-y-1.5">
              <div className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">Легенда</div>
              {[
                { icon: '💡', label: 'Тезис', color: 'text-indigo-400' },
                { icon: '✅', label: 'Аргумент', color: 'text-emerald-400' },
                { icon: '⚡', label: 'Контраргумент', color: 'text-rose-400' },
                { icon: '❓', label: 'Вопрос', color: 'text-amber-400' },
                { icon: '🏁', label: 'Вывод', color: 'text-violet-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className={`text-xs ${item.color}`}>{item.label}</span>
                </div>
              ))}
              <div className="border-t border-slate-700 pt-1.5 mt-1.5 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-px bg-emerald-500 opacity-60" />
                  <span className="text-xs text-slate-500">Поддержка</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-px bg-rose-500 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f43f5e 0, #f43f5e 4px, transparent 4px, transparent 7px)' }} />
                  <span className="text-xs text-slate-500">Противоречие</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700/50 text-xs text-slate-400">
              <Sparkles size={11} className="text-violet-400" />
              Кликните на узел → Нажмите «Добавить» для ответвления
            </div>
          </div>
        </div>

        {/* Node sidebar */}
        <div className="relative flex-shrink-0">
          <NodeSidebar
            node={selectedNodeId ? session.nodes[selectedNodeId] : null}
            nodes={session.nodes}
            onClose={() => setSelectedNodeId(null)}
            onVote={handleVote}
          />
        </div>
      </div>

      {/* New session modal */}
      <AnimatePresence>
        {showNewSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowNewSession(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">Новая сессия</h2>
                <button onClick={() => setShowNewSession(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <label className="block text-sm text-slate-400 mb-1.5">Тема обсуждения</label>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Например: Запуск нового продукта"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-5 transition-colors"
                onKeyDown={e => e.key === 'Enter' && handleNewSession()}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewSession(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-sm"
                >
                  Отмена
                </button>
                <button
                  onClick={handleNewSession}
                  disabled={!newTitle.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium transition-colors text-sm"
                >
                  Создать
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
