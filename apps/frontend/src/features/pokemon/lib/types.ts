export type Move = {
  id: string;
  name: string;
  type: string;
  power: number;
  pp: number;
  maxPp: number;
  flavour?: string;
  proven?: boolean;
  followUpVulnerable?: boolean;
  status?: boolean;
  badgeUnlock?: string;
  proofTags?: string[];
};

export type OpponentMove = {
  id: string;
  name?: string;
  type: string;
  power: number;
};

export type Opponent = {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp?: number;
  typeTag?: string;
  moves: OpponentMove[];
  followUp?: boolean;
  socratic?: boolean;
  weaknesses?: string[];
};
