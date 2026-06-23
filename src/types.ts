export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard"
}

export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  striverSheetIndex: number;
  intuition: string;
  bruteForce: {
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    code: string;
  };
  optimal: {
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    code: string;
  };
  defaultInput: {
    label: string;
    value: string; // JSON or comma-separated string
  };
}

export interface TraceStep {
  stepNumber: number;
  explanation: string;
  codeHighlightLine: number; // 1-based index line of code inside the optimal solution
  variablesState: Record<string, string | number | boolean | null>;
  arrayState?: (number | string)[];
  matrixState?: (number | string)[][];
  linkedListState?: {
    nodes: Array<{ id: string; val: number | string }>;
    pointers: Record<string, string>; // pointerName: nodeId
    reverseArrows?: string[]; // list of nodeIds that point backward
  };
  graphState?: {
    nodes: Array<{ id: string; text: string; active?: boolean; finished?: boolean; distance?: string }>;
    edges: Array<{ from: string; to: string; weight?: number; active?: boolean }>;
    pointers?: Record<string, string>; // pointerName: nodeId
  };
  activeIndices?: number[];
  pointerLabels?: Record<string, string>; // indexStr: pointerText
  boardState?: string[][]; // for chessboard (N-Queens)
  customMarkers?: Record<string, any>;
}

export interface StriverCategory {
  id: string;
  name: string;
  icon: string;
  problems: Problem[];
}

// ────────────── System Design Types ──────────────

export type DesignPatternCategory = 'creational' | 'structural' | 'behavioral';

export interface ClassParticipant {
  id: string;
  name: string;
  type: 'class' | 'interface' | 'abstract-class';
  methods: string[];
  fields: string[];
}

export interface ClassRelation {
  from: string;
  to: string;
  type: 'inheritance' | 'implementation' | 'composition' | 'aggregation' | 'dependency' | 'association';
  fromLabel?: string;
  toLabel?: string;
}

export interface DesignPattern {
  id: string;
  name: string;
  category: DesignPatternCategory;
  intent: string;
  problem: string;
  solution: string;
  participants: ClassParticipant[];
  structure: ClassRelation[];
  codeExample: string;
  realWorldExample: string;
  whenToUse: string[];
  pros: string[];
  cons: string[];
}

export type HldComponentType =
  | 'client' | 'dns' | 'cdn' | 'load-balancer'
  | 'api-gateway' | 'web-server' | 'microservice'
  | 'cache' | 'database' | 'message-queue'
  | 'worker' | 'object-storage' | 'search-service';

export interface HldComponent {
  id: string;
  name: string;
  type: HldComponentType;
  description: string;
}

export interface HldConnection {
  from: string;
  to: string;
  label?: string;
  protocol?: string;
  dataType?: string;
}

export interface SystemDesignProblem {
  id: string;
  title: string;
  category: 'lld' | 'hld';
  description: string;
  requirements: string[];
  estimatedScale?: string;
  components: HldComponent[];
  connections: HldConnection[];
  deepDive?: string;
  followUp?: string[];
}
