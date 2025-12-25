import { ethers } from "ethers";
import PoolABI from "../abi/Pool.json";
import RouterABI from "../abi/Router.json";
import ERC20ABI from "../abi/ERC20.json";
import { ADDRESSES } from "../constants/addresses";

/* ---------- READ (provider) ---------- */
export function getContracts(provider, chainId) {
  const addresses = ADDRESSES[chainId];
  if (!provider || !addresses) return null;

  return {
    pool: new ethers.Contract(addresses.POOL, PoolABI.abi, provider),
    tokenA: new ethers.Contract(addresses.TOKEN_A, ERC20ABI.abi, provider),
    tokenB: new ethers.Contract(addresses.TOKEN_B, ERC20ABI.abi, provider),
    router: new ethers.Contract(addresses.ROUTER, RouterABI.abi, provider),
  };
}

/* ---------- WRITE (signer) ---------- */
export async function getSignerContracts(provider, chainId) {
  const addresses = ADDRESSES[chainId];
  if (!provider || !addresses) return null;

  const signer = await provider.getSigner();

  return {
    pool: new ethers.Contract(addresses.POOL, PoolABI.abi, signer),
    tokenA: new ethers.Contract(addresses.TOKEN_A, ERC20ABI.abi, signer),
    tokenB: new ethers.Contract(addresses.TOKEN_B, ERC20ABI.abi, signer),
    router: new ethers.Contract(addresses.ROUTER, RouterABI.abi, signer),
  };
}