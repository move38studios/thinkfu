export interface MoveVariable {
  type: "pick" | "number";
  count?: number;
  pool?: string;
  min?: number;
  max?: number;
}

export interface MovePair {
  id: string;
  why: string;
}

export interface MoveFrontmatter {
  id: string;
  name: string;
  one_liner: string;
  mode: string[];
  category: string;
  tags: string[];
  effort: "quick" | "deep";
  origin: string;
  problem_signatures: string[];
  variables?: Record<string, MoveVariable>;
  pairs_with?: MovePair[];
}

export interface Move {
  frontmatter: MoveFrontmatter;
  body: string;
  raw: string;
}

export type Pools = Record<string, string[]>;
