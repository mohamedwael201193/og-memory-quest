import { motion } from 'framer-motion';
import { useMemoryGame } from '@/hooks/useMemoryGame';
import { useWeb3 } from '@/hooks/useWeb3';
import { WalletConnection } from '@/components/WalletConnection';
import { GameGrid } from '@/components/GameGrid';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { Leaderboard } from '@/components/Leaderboard';
import { GameStatus } from '@/components/GameStatus';
import nebulaBg from '@/assets/nebula-bg.jpg';
import gridPreview from '@/assets/grid-preview.jpg';

const Index = () => {
  const { gameState, startGame, handleTileClick, resetGame } = useMemoryGame();
  const {
    isConnected,
    walletAddress,
    isConnecting,
    bestScore,
    topScores,
    isSubmitting,
    connectWallet,
    submitScore,
    getExplorerUrl,
  } = useWeb3();

  return (
    <div 
      className="min-h-screen bg-gradient-cosmic relative overflow-hidden"
      style={{
        backgroundImage: `url(${nebulaBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 text-gradient flex items-center justify-center gap-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-gradient-to-r from-primary via-secondary to-accent p-4 rounded-2xl glow-primary">
                  <span className="text-3xl font-black text-background">OG</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div className="text-gradient">
                <span className="text-primary">Memory</span> <span className="text-secondary">Grid</span>
              </div>
            </div>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Test your memory in the cosmic depths. Repeat the glowing sequences and compete on the OG-Galileo-Testnet blockchain leaderboard.
          </p>
          <motion.div 
            className="flex items-center justify-center gap-2 text-sm text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>Powered by OG Labs Technology</span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          </motion.div>
        </motion.header>

        {/* Wallet Connection */}
        <div className="flex justify-center mb-8">
          <WalletConnection
            isConnected={isConnected}
            walletAddress={walletAddress}
            isConnecting={isConnecting}
            onConnect={connectWallet}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Sidebar - Scores */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <ScoreDisplay
              currentScore={gameState.score}
              bestScore={bestScore}
              isGameActive={gameState.isPlaying}
            />
            
            {!gameState.isPlaying && gameState.gameStatus === 'idle' && (
              <motion.div 
                className="glass rounded-lg p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <img 
                  src={gridPreview} 
                  alt="Memory Grid Preview" 
                  className="w-full rounded-lg mb-4 opacity-70"
                />
                <p className="text-sm text-muted-foreground">
                  Watch the sequence, then repeat it by clicking the tiles in the same order.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Center - Game Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Game Status */}
            <GameStatus
              gameStatus={gameState.gameStatus}
              isShowingSequence={gameState.isShowingSequence}
              score={gameState.score}
              onStartGame={startGame}
              onResetGame={resetGame}
              onSubmitScore={submitScore}
              isConnected={isConnected}
              isSubmitting={isSubmitting}
              getExplorerUrl={getExplorerUrl}
            />

            {/* Game Grid */}
            {gameState.gameStatus !== 'idle' && (
              <motion.div 
                className="glass rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GameGrid
                  onTileClick={handleTileClick}
                  highlightedTile={gameState.highlightedTile}
                  isPlaying={gameState.isPlaying}
                  isShowingSequence={gameState.isShowingSequence}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Right Sidebar - Leaderboard */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Leaderboard
              scores={topScores}
              currentPlayerAddress={walletAddress}
            />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 text-sm text-muted-foreground"
        >
          <p>Powered by OG-Galileo-Testnet • Made by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-bold">DEVMO</span> for OG Labs</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
