export type NodeType = 'thesis' | 'argument' | 'counterargument' | 'question' | 'conclusion' | 'root';

export interface TreeNode {
  id: string;
  type: NodeType;
  text: string;
  author: string;
  parentId: string | null;
  children: string[];
  createdAt: number;
  votes: number;
  isExpanded: boolean;
  x?: number;
  y?: number;
}

export interface Message {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  linkedNodeId?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  nodes: Record<string, TreeNode>;
  rootId: string;
  messages: Message[];
  participants: Participant[];
  createdAt: number;
}
