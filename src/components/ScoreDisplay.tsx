import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

interface ScoreDisplayProps {
  currentScore: number;
  bestScore: number;
  isGameActive: boolean;
}

export const ScoreDisplay = ({ currentScore, bestScore, isGameActive }: ScoreDisplayProps) => {
  return (
    <div className="flex gap-6 justify-center items-center">
      {/* Current Score */}
      <motion.div 
        className="glass rounded-lg p-6 text-center min-w-[120px]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-5 h-5 text-secondary" />
          <span className="text-sm font-medium text-muted-foreground">Current</span>
        </div>
        <motion.div 
          key={currentScore}
          initial={{ scale: 1.2, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="score-display"
        >
          {currentScore}
        </motion.div>
      </motion.div>

      {/* Best Score */}
      <motion.div 
        className="glass rounded-lg p-6 text-center min-w-[120px]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">Best</span>
        </div>
        <div className="text-2xl font-bold text-accent">
          {bestScore}
        </div>
      </motion.div>
    </div>
  );
};