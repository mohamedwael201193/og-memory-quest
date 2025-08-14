import { ethers } from 'ethers';

// OG-Galileo-Testnet Configuration
export const NETWORK_CONFIG = {
  chainId: '0x40d9', // 16601 in hex
  chainName: 'OG-Galileo-Testnet',
  nativeCurrency: {
    name: 'OG',
    symbol: 'OG',
    decimals: 18,
  },
  rpcUrls: ['https://evmrpc-testnet.og.ai'],
  blockExplorerUrls: ['https://chainscan-galileo.og.ai'],
};

// Contract Configuration
export const CONTRACT_ADDRESS = "0xFCB0A4bB58B80a7CDB1E58F50812abd99005B65B";

export const CONTRACT_ABI = [
  "function submitScore(uint256 score) public",
  "function getMyBestScore() external view returns (uint256)",
  "function getTopScores() external view returns (tuple(address player, uint256 score)[])",
  "event ScoreSubmitted(address indexed player, uint256 score)"
];

export interface ScoreEntry {
  player: string;
  score: number;
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async connectWallet(): Promise<string | null> {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Check if we're on the correct network
      const network = await this.provider.getNetwork();
      if (network.chainId !== BigInt(16601)) {
        await this.switchToOGNetwork();
      }

      // Initialize contract
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async switchToOGNetwork(): Promise<void> {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching network:', switchError);
        throw switchError;
      }
    }
  }

  async submitScore(score: number): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }

    try {
      const tx = await this.contract.submitScore(score);
      return tx.hash;
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }

  async getMyBestScore(): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }

    try {
      const score = await this.contract.getMyBestScore();
      return parseInt(score.toString());
    } catch (error) {
      console.error('Error getting best score:', error);
      return 0;
    }
  }

  async getTopScores(): Promise<ScoreEntry[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }

    try {
      const scores = await this.contract.getTopScores();
      return scores.map((entry: any) => ({
        player: entry.player,
        score: parseInt(entry.score.toString())
      }));
    } catch (error) {
      console.error('Error getting top scores:', error);
      return [];
    }
  }

  async waitForTransaction(txHash: string): Promise<boolean> {
    if (!this.provider) return false;

    try {
      const receipt = await this.provider.waitForTransaction(txHash);
      return receipt?.status === 1;
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      return false;
    }
  }

  getExplorerUrl(txHash: string): string {
    return `${NETWORK_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`;
  }

  isConnected(): boolean {
    return !!this.signer && !!this.contract;
  }
}

// Global instance
export const web3Service = new Web3Service();

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}