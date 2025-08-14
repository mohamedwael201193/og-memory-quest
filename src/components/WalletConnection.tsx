import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface WalletConnectionProps {
  isConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  onConnect: () => void;
}

export const WalletConnection = ({ 
  isConnected, 
  walletAddress, 
  isConnecting, 
  onConnect 
}: WalletConnectionProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletAddress) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-4 flex items-center gap-3"
      >
        <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Connected Wallet</span>
          <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
        </div>
        <a
          href="https://chainscan-galileo.og.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto p-2 hover:bg-muted/20 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        onClick={onConnect}
        disabled={isConnecting}
        className="btn-connect min-w-[200px]"
      >
        <Wallet className="w-5 h-5 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    </motion.div>
  );
};