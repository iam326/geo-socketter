export type Direction = 'USER' | 'FRIEND';

export interface Message {
  value: string,
  direction: Direction;
  timestamp: number;
}
