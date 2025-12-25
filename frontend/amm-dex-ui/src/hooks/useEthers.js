import { useEffect, useState } from "react";
import { ethers } from "ethers";

const SEPOLIA_CHAIN_ID = 11155111;

export function useEthers() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);

  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);

    const signer = await browserProvider.getSigner();
    const addr = await signer.getAddress();
    const network = await browserProvider.getNetwork();

    setProvider(browserProvider);
    setAddress(addr);
    setChainId(Number(network.chainId));
  }

  // Listen for chain/account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = (chainIdHex) => {
      setChainId(parseInt(chainIdHex, 16));
    };

    const handleAccountsChanged = (accounts) => {
      setAddress(accounts[0] || null);
    };

    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return {
    provider,
    address,
    connect,
    chainId,
    isCorrectNetwork: chainId === SEPOLIA_CHAIN_ID,
  };
}