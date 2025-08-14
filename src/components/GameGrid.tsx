import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameGridProps {
  onTileClick: (index: number) => void;
  highlightedTile: number | null;
  isPlaying: boolean;
  isShowingSequence: boolean;
}

export const GameGrid = ({ 
  onTileClick, 
  highlightedTile, 
  isPlaying, 
  isShowingSequence 
}: GameGridProps) => {
  const handleTileClick = (index: number) => {
    if (!isPlaying || isShowingSequence) return;
    onTileClick(index);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-3 gap-4 p-6"
    >
      {Array.from({ length: 9 }, (_, index) => (
        <motion.button
          key={index}
          whileHover={isPlaying && !isShowingSequence ? { scale: 1.05 } : {}}
          whileTap={isPlaying && !isShowingSequence ? { scale: 0.95 } : {}}
          onClick={() => handleTileClick(index)}
          className={cn(
            "grid-tile",
            highlightedTile === index && "active",
            !isPlaying && "opacity-50 cursor-not-allowed"
          )}
          disabled={!isPlaying || isShowingSequence}
        >
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-card/50 to-card/20 flex items-center justify-center">
            <div className={cn(
              "w-8 h-8 rounded-full transition-all duration-300",
              highlightedTile === index 
                ? "bg-primary shadow-glow" 
                : "bg-muted/50"
            )} />
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};