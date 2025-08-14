import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Upload, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface GameStatusProps {
  gameStatus: 'idle' | 'ready' | 'playing' | 'gameOver';
  isShowingSequence: boolean;
  score: number;
  onStartGame: () => void;
  onResetGame: () => void;
  onSubmitScore: (score: number) => Promise<string | null>;
  isConnected: boolean;
  isSubmitting: boolean;
  getExplorerUrl: (txHash: string) => string;
}

export const GameStatus = ({
  gameStatus,
  isShowingSequence,
  score,
  onStartGame,
  onResetGame,
  onSubmitScore,
  isConnected,
  isSubmitting,
  getExplorerUrl,
}: GameStatusProps) => {
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const handleSubmitScore = async () => {
    const txHash = await onSubmitScore(score);
    if (txHash) {
      setLastTxHash(txHash);
    }
  };

  const getStatusMessage = () => {
    if (gameStatus === 'idle') {
      return 'Ready to test your memory?';
    }
    if (gameStatus === 'ready') {
      return 'Get ready...';
    }
    if (isShowingSequence) {
      return 'Watch the sequence...';
    }
    if (gameStatus === 'playing') {
      return 'Repeat the sequence!';
    }
    if (gameStatus === 'gameOver') {
      return `Game Over! Final Score: ${score}`;
    }
    return '';
  };

  return (
    <div className="text-center space-y-6">
      {/* Status Message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={gameStatus + isShowingSequence}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass rounded-lg p-4"
        >
          <h2 className="text-xl font-semibold text-gradient">
            {getStatusMessage()}
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* Game Controls */}
      <div className="flex gap-4 justify-center">
        {gameStatus === 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button onClick={onStartGame} className="btn-connect">
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </motion.div>
        )}

        {gameStatus === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <Button 
              onClick={onResetGame} 
              variant="outline"
              className="border-border/50 hover:border-primary/60"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>

            {isConnected && score > 0 && (
              <Button 
                onClick={handleSubmitScore}
                disabled={isSubmitting}
                className="btn-connect"
              >
                <Upload className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Score'}
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Transaction Link */}
      {lastTxHash && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-4"
        >
          <p className="text-sm text-muted-foreground mb-2">Score submitted successfully!</p>
          <a
            href={getExplorerUrl(lastTxHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors"
          >
            View on Explorer <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      )}
    </div>
  );
};