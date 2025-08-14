import { useState, useEffect, useCallback } from 'react';

export interface GameState {
  sequence: number[];
  playerSequence: number[];
  currentStep: number;
  score: number;
  isPlaying: boolean;
  isShowingSequence: boolean;
  gameStatus: 'idle' | 'ready' | 'playing' | 'gameOver';
  highlightedTile: number | null;
}

const GRID_SIZE = 9; // 3x3 grid
const SEQUENCE_DISPLAY_DELAY = 800;
const TILE_HIGHLIGHT_DURATION = 600;

export const useMemoryGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    sequence: [],
    playerSequence: [],
    currentStep: 0,
    score: 0,
    isPlaying: false,
    isShowingSequence: false,
    gameStatus: 'idle',
    highlightedTile: null,
  });

  const generateNextSequence = useCallback((currentSequence: number[]) => {
    const nextTile = Math.floor(Math.random() * GRID_SIZE);
    return [...currentSequence, nextTile];
  }, []);

  const showSequence = useCallback(async (sequence: number[]) => {
    setGameState(prev => ({ ...prev, isShowingSequence: true, highlightedTile: null }));
    
    // Small delay before starting
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < sequence.length; i++) {
      // Highlight tile
      setGameState(prev => ({ ...prev, highlightedTile: sequence[i] }));
      await new Promise(resolve => setTimeout(resolve, TILE_HIGHLIGHT_DURATION));
      
      // Clear highlight
      setGameState(prev => ({ ...prev, highlightedTile: null }));
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setGameState(prev => ({ 
      ...prev, 
      isShowingSequence: false,
      gameStatus: 'playing'
    }));
  }, []);

  const startGame = useCallback(() => {
    const initialSequence = generateNextSequence([]);
    setGameState({
      sequence: initialSequence,
      playerSequence: [],
      currentStep: 0,
      score: 0,
      isPlaying: true,
      isShowingSequence: false,
      gameStatus: 'ready',
      highlightedTile: null,
    });

    // Show "Get Ready" message then start sequence
    setTimeout(() => {
      showSequence(initialSequence);
    }, 1000);
  }, [generateNextSequence, showSequence]);

  const handleTileClick = useCallback((tileIndex: number) => {
    if (!gameState.isPlaying || gameState.isShowingSequence || gameState.gameStatus !== 'playing') {
      return;
    }

    const newPlayerSequence = [...gameState.playerSequence, tileIndex];
    const expectedTile = gameState.sequence[gameState.currentStep];

    if (tileIndex === expectedTile) {
      // Correct tile clicked
      if (newPlayerSequence.length === gameState.sequence.length) {
        // Completed current sequence, advance to next level
        const nextSequence = generateNextSequence(gameState.sequence);
        const newScore = gameState.score + 1;
        
        setGameState(prev => ({
          ...prev,
          sequence: nextSequence,
          playerSequence: [],
          currentStep: 0,
          score: newScore,
          gameStatus: 'ready',
        }));

        // Show next sequence after a short delay
        setTimeout(() => {
          showSequence(nextSequence);
        }, 1000);
      } else {
        // Continue with current sequence
        setGameState(prev => ({
          ...prev,
          playerSequence: newPlayerSequence,
          currentStep: prev.currentStep + 1,
        }));
      }
    } else {
      // Wrong tile clicked - game over
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        gameStatus: 'gameOver',
      }));
    }
  }, [gameState, generateNextSequence, showSequence]);

  const resetGame = useCallback(() => {
    setGameState({
      sequence: [],
      playerSequence: [],
      currentStep: 0,
      score: 0,
      isPlaying: false,
      isShowingSequence: false,
      gameStatus: 'idle',
      highlightedTile: null,
    });
  }, []);

  return {
    gameState,
    startGame,
    handleTileClick,
    resetGame,
  };
};