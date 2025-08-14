import { useState, useEffect } from 'react';
import { web3Service, ScoreEntry } from '@/lib/web3';
import { useToast } from '@/hooks/use-toast';

export const useWeb3 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [bestScore, setBestScore] = useState<number>(0);
  const [topScores, setTopScores] = useState<ScoreEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      const address = await web3Service.connectWallet();
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
        
        // Load user data
        await loadUserData();
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const loadUserData = async () => {
    try {
      const [userBestScore, leaderboard] = await Promise.all([
        web3Service.getMyBestScore(),
        web3Service.getTopScores(),
      ]);
      
      setBestScore(userBestScore);
      setTopScores(leaderboard);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const submitScore = async (score: number) => {
    if (!isConnected || isSubmitting) return null;

    setIsSubmitting(true);
    try {
      const txHash = await web3Service.submitScore(score);
      
      toast({
        title: "Score Submitted",
        description: "Transaction sent! Waiting for confirmation...",
      });

      // Wait for transaction confirmation
      const success = await web3Service.waitForTransaction(txHash);
      
      if (success) {
        toast({
          title: "Score Confirmed!",
          description: `Score ${score} recorded on blockchain`,
        });
        
        // Reload data to get updated scores
        await loadUserData();
        
        return txHash;
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error: any) {
      console.error('Error submitting score:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit score",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExplorerUrl = (txHash: string) => {
    return web3Service.getExplorerUrl(txHash);
  };

  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // Auto-reconnect if already authorized
            await connectWallet();
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    isConnected,
    walletAddress,
    isConnecting,
    bestScore,
    topScores,
    isSubmitting,
    connectWallet,
    submitScore,
    getExplorerUrl,
    loadUserData,
  };
};