import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeNode, NodeType, Participant } from '../types';
import { ThumbsUp, ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface TreeCanvasProps {
  nodes: Record<string, TreeNode>;
  rootId: string;
  participants: Participant[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onAddChild: (parentId: string, type: NodeType) => void;
  onVote: (id: string) => void;
  onToggleExpand: (id: string) => void;
  highlightedNodeId?: string | null;
}

const NODE_CONFIG: Record<NodeType, { bg: string; border: string; icon: string; label: string; textColor: string }> = {
  root: { bg: 'bg-slate-900', border: 'border-slate-700', icon: '🎯', label: 'Тема', textColor: 'text-white' },
  thesis: { bg: 'bg-indigo-600', border: 'border-indigo-400', icon: '💡', label: 'Тезис', textColor: 'text-white' },
  argument: { bg: 'bg-emerald-600', border: 'border-emerald-400', icon: '✅', label: 'Аргумент', textColor: 'text-white' },
  counterargument: { bg: 'bg-rose-600', border: 'border-rose-400', icon: '⚡', label: 'Контраргумент', textColor: 'text-white' },
  question: { bg: 'bg-amber-500', border: 'border-amber-300', icon: '❓', label: 'Вопрос', textColor: 'text-white' },
  conclusion: { bg: 'bg-violet-600', border: 'border-violet-400', icon: '🏁', label: 'Вывод', textColor: 'text-white' },
};

const LEVEL_X_GAP = 300;
const NODE_Y_GAP = 120;

function computeLayout(
  nodes: Record<string, TreeNode>,
  rootId: string
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  const subtreeSizes: Record<string, number> = {};

  function getSubtreeSize(id: string): number {
    const node = nodes[id];
    if (!node) return 1;
    const visibleChildren = node.isExpanded ? node.children.filter(cid => nodes[cid]) : [];
    if (visibleChildren.length === 0) {
      subtreeSizes[id] = 1;
      return 1;
    }
    const size = visibleChildren.reduce((sum, cid) => sum + getSubtreeSize(cid), 0);
    subtreeSizes[id] = size;
    return size;
  }

  getSubtreeSize(rootId);

  function assignPositions(id: string, x: number, yStart: number): void {
    const node = nodes[id];
    if (!node) return;
    const size = subtreeSizes[id] || 1;
    const y = yStart + ((size - 1) / 2) * NODE_Y_GAP;
    positions[id] = { x, y };

    const visibleChildren = node.isExpanded ? node.children.filter(cid => nodes[cid]) : [];
    let currentY = yStart;
    for (const cid of visibleChildren) {
      assignPositions(cid, x + LEVEL_X_GAP, currentY);
      currentY += (subtreeSizes[cid] || 1) * NODE_Y_GAP;
    }
  }

  assignPositions(rootId, 60, 60);
  return positions;
}

interface NodeCardProps {
  node: TreeNode;
  position: { x: number; y: number };
  isSelected: boolean;
  isHighlighted: boolean;
  participants: Participant[];
  onSelect: () => void;
  onAddChild: (type: NodeType) => void;
  onVote: () => void;
  onToggleExpand: () => void;
  hasChildren: boolean;
}

function NodeCard({ node, position, isSelected, isHighlighted, participants, onSelect, onAddChild, onVote, onToggleExpand, hasChildren }: NodeCardProps) {
  const config = NODE_CONFIG[node.type];
  const [showAddMenu, setShowAddMenu] = useState(false);
  const participant = participants.find(p => p.name === node.author);

  const addTypes: { type: NodeType; label: string }[] = [
    { type: 'argument', label: '✅ Аргумент' },
    { type: 'counterargument', label: '⚡ Контраргумент' },
    { type: 'question', label: '❓ Вопрос' },
    { type: 'conclusion', label: '🏁 Вывод' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      style={{ position: 'absolute', left: position.x, top: position.y, transform: 'translateY(-50%)' }}
      className={`w-56 cursor-pointer select-none`}
    >
      {/* Expand toggle */}
      {hasChildren && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 shadow flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {node.isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
      )}

      <div
        onClick={onSelect}
        className={`rounded-xl border-2 shadow-lg transition-all duration-200 overflow-hidden
          ${config.bg} ${config.border}
          ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent shadow-xl scale-105' : 'hover:scale-102 hover:shadow-xl'}
          ${isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-1 animate-pulse' : ''}
        `}
      >
        {/* Header */}
        <div className="px-3 py-1.5 flex items-center gap-2 border-b border-white/20">
          <span className="text-sm">{config.icon}</span>
          <span className={`text-xs font-semibold uppercase tracking-wider ${config.textColor} opacity-80`}>
            {config.label}
          </span>
        </div>

        {/* Body */}
        <div className="px-3 py-2.5">
          <p className={`text-sm font-medium leading-snug ${config.textColor}`}>
            {node.text}
          </p>
        </div>

        {/* Footer */}
        <div className="px-3 py-1.5 flex items-center justify-between border-t border-white/20">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: participant?.color || '#64748b' }}
            >
              {typeof participant?.avatar === 'string' && participant.avatar.length <= 2
                ? participant.avatar
                : node.author.charAt(0)}
            </div>
            <span className={`text-xs ${config.textColor} opacity-70 truncate max-w-[80px]`}>
              {node.author.split('(')[0].trim()}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onVote(); }}
            className={`flex items-center gap-1 text-xs ${config.textColor} opacity-70 hover:opacity-100 transition-opacity`}
          >
            <ThumbsUp size={11} />
            <span>{node.votes}</span>
          </button>
        </div>
      </div>

      {/* Add child button */}
      {isSelected && node.type !== 'root' && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowAddMenu(!showAddMenu); }}
              className="flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-xs font-medium"
            >
              <Plus size={11} /> Добавить
            </button>
            <AnimatePresence>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-7 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30 min-w-[180px]"
                >
                  {addTypes.map(({ type, label }) => (
                    <button
                      key={type}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddChild(type);
                        setShowAddMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function TreeCanvas({ nodes, rootId, participants, selectedNodeId, onSelectNode, onAddChild, onVote, onToggleExpand, highlightedNodeId }: TreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pan, setPan] = useState({ x: 40, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const positions = computeLayout(nodes, rootId);

  const maxX = Math.max(...Object.values(positions).map(p => p.x)) + 280;
  const maxY = Math.max(...Object.values(positions).map(p => p.y)) + 100;
  const canvasWidth = Math.max(maxX, 800);
  const canvasHeight = Math.max(maxY + 100, 600);

  function getEdges(): Array<{ from: string; to: string }> {
    const edges: Array<{ from: string; to: string }> = [];
    Object.values(nodes).forEach(node => {
      node.children.forEach(childId => {
        if (nodes[childId] && node.isExpanded) {
          edges.push({ from: node.id, to: childId });
        }
      });
    });
    return edges;
  }

  const edges = getEdges();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-card')) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  }, [isPanning, startPan]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(2, Math.max(0.4, z - e.deltaY * 0.001)));
  }, []);

  const NODE_WIDTH = 224;

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative bg-slate-950 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #475569 1px, transparent 1px)`,
          backgroundSize: `${30 * zoom}px ${30 * zoom}px`,
          backgroundPosition: `${pan.x % (30 * zoom)}px ${pan.y % (30 * zoom)}px`,
        }}
      />

      {/* Transform wrapper */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        {/* SVG edges */}
        <svg
          ref={svgRef}
          style={{ position: 'absolute', top: 0, left: 0, width: canvasWidth, height: canvasHeight, overflow: 'visible' }}
        >
          <defs>
            {Object.entries(NODE_CONFIG).map(([type, _cfg]) => (
              <marker
                key={type}
                id={`arrow-${type}`}
                markerWidth="6"
                markerHeight="6"
                refX="3"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L6,3 z" fill="#475569" />
              </marker>
            ))}
          </defs>
          {edges.map(({ from, to }) => {
            const fromPos = positions[from];
            const toPos = positions[to];
            if (!fromPos || !toPos) return null;
            const x1 = fromPos.x + NODE_WIDTH;
            const y1 = fromPos.y;
            const x2 = toPos.x;
            const y2 = toPos.y;
            const mx = (x1 + x2) / 2;
            const childType = nodes[to]?.type || 'argument';
            const strokeColors: Record<NodeType, string> = {
              root: '#475569',
              thesis: '#818cf8',
              argument: '#34d399',
              counterargument: '#fb7185',
              question: '#fbbf24',
              conclusion: '#a78bfa',
            };
            return (
              <motion.path
                key={`${from}-${to}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={strokeColors[childType] || '#475569'}
                strokeWidth="2"
                strokeOpacity="0.6"
                strokeDasharray={childType === 'counterargument' ? '6,3' : 'none'}
                markerEnd={`url(#arrow-${childType})`}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        <AnimatePresence>
          {Object.values(nodes).map(node => {
            const pos = positions[node.id];
            if (!pos) return null;
            const hasChildren = node.children.length > 0;
            return (
              <div key={node.id} className="node-card">
                <NodeCard
                  node={node}
                  position={pos}
                  isSelected={selectedNodeId === node.id}
                  isHighlighted={highlightedNodeId === node.id}
                  participants={participants}
                  onSelect={() => onSelectNode(node.id)}
                  onAddChild={(type) => onAddChild(node.id, type)}
                  onVote={() => onVote(node.id)}
                  onToggleExpand={() => onToggleExpand(node.id)}
                  hasChildren={hasChildren}
                />
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-20">
        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center hover:bg-slate-700 shadow text-lg">+</button>
        <button onClick={() => setZoom(1)} className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center hover:bg-slate-700 shadow text-xs font-mono">{Math.round(zoom * 100)}%</button>
        <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center hover:bg-slate-700 shadow text-lg">−</button>
      </div>

      {/* Reset pan */}
      <button onClick={() => { setPan({ x: 40, y: 80 }); setZoom(0.9); }} className="absolute bottom-4 left-4 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg hover:bg-slate-700 shadow z-20">
        Сбросить вид
      </button>
    </div>
  );
}
