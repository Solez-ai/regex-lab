export interface RegexMatch {
  value: string;
  index: number;
  length: number;
  groups: Record<string, string | undefined>;
  captures: (string | undefined)[];
}

export interface RegexResult {
  matches: RegexMatch[];
  error: string | null;
  evalTime: number;
  isValid: boolean;
}

export interface SavedPattern {
  id: string;
  pattern: string;
  flags: string;
  label: string;
  description: string;
  createdAt: number;
  lastUsed: number;
}

export interface RegexToken {
  raw: string;
  type: TokenType;
  title: string;
  description: string;
  example: string;
}

export type TokenType =
  | 'anchor'
  | 'quantifier'
  | 'class'
  | 'group'
  | 'escape'
  | 'lookahead'
  | 'literal'
  | 'special';

export interface ExplainerToken {
  raw: string;
  type: TokenType;
  title: string;
  description: string;
  example: string;
}