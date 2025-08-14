import { motion } from 'framer-motion';
import { Crown, Medal, Award } from 'lucide-react';
import { ScoreEntry } from '@/lib/web3';

interface LeaderboardProps {
  scores: ScoreEntry[];
  currentPlayerAddress: string | null;
}

export const Leaderboard = ({ scores, currentPlayerAddress }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-accent" />;
      case 2:
        return <Medal className="w-5 h-5 text-secondary" />;
      case 3:
        return <Award className="w-5 h-5 text-primary" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isCurrentPlayer = (address: string) => {
    return currentPlayerAddress?.toLowerCase() === address.toLowerCase();
  };

  if (scores.length === 0) {
    return (
      <div className="glass rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold mb-4 text-gradient">🏆 Leaderboard</h3>
        <p className="text-muted-foreground">No scores yet. Be the first to submit!</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="glass rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4 text-gradient flex items-center gap-2">
        <Crown className="w-5 h-5" />
        Leaderboard
      </h3>
      
      <div className="space-y-3">
        {scores.slice(0, 10).map((entry, index) => (
          <motion.div
            key={`${entry.player}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              isCurrentPlayer(entry.player) 
                ? 'bg-primary/10 border border-primary/30' 
                : 'bg-muted/20 hover:bg-muted/30'
            }`}
          >
            <div className="flex-shrink-0">
              {getRankIcon(index + 1)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm truncate">
                {formatAddress(entry.player)}
                {isCurrentPlayer(entry.player) && (
                  <span className="ml-2 text-xs text-primary font-medium">(You)</span>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <span className="font-bold text-lg">
                {entry.score}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};