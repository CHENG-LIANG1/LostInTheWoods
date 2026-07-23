/**
 * Global game state store (localStorage-backed) with a tiny pub/sub.
 * Design.md §5: collectedClues, boardConnections, accusation, gameSolved.
 */

export const TOTAL_CLUES = 12;

const STORAGE_KEY = 'fog-ridge-game-state-v1';

export interface GameState {
  collectedClues: string[];
  boardConnections: [string, string][];
  accusation: string | null;
  gameSolved: boolean;
}

const DEFAULT_STATE: GameState = {
  collectedClues: [],
  boardConnections: [],
  accusation: null,
  gameSolved: false,
};

type Listener = (state: GameState) => void;

function loadState(): GameState {
  if (typeof window === 'undefined') return { ...DEFAULT_STATE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<GameState>;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

let state: GameState = loadState();
const listeners = new Set<Listener>();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

function emit() {
  persist();
  listeners.forEach((fn) => fn(state));
}

export function getState(): GameState {
  return state;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Collect a clue. Returns true if it was newly added. */
export function collectClue(clueId: string): boolean {
  if (state.collectedClues.includes(clueId)) return false;
  if (state.collectedClues.length >= TOTAL_CLUES) return false;
  state = { ...state, collectedClues: [...state.collectedClues, clueId] };
  emit();
  return true;
}

export function hasClue(clueId: string): boolean {
  return state.collectedClues.includes(clueId);
}

export function addConnection(a: string, b: string) {
  const exists = state.boardConnections.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a),
  );
  if (exists || a === b) return;
  state = { ...state, boardConnections: [...state.boardConnections, [a, b]] };
  emit();
}

export function removeConnection(a: string, b: string) {
  state = {
    ...state,
    boardConnections: state.boardConnections.filter(
      ([x, y]) => !((x === a && y === b) || (x === b && y === a)),
    ),
  };
  emit();
}

export function setAccusation(suspectId: string | null) {
  state = { ...state, accusation: suspectId };
  emit();
}

export function setGameSolved(solved: boolean) {
  state = { ...state, gameSolved: solved };
  emit();
}

export function resetGame() {
  state = { ...DEFAULT_STATE };
  emit();
}

/* ---- React hook ---- */
import { useEffect, useState } from 'react';

export function useGameState(): GameState {
  const [s, setS] = useState<GameState>(getState());
  useEffect(() => subscribe(setS), []);
  return s;
}
