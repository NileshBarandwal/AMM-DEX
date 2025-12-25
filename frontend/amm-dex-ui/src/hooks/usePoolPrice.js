import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "./useContracts";

/**
 * Canonical AMM price source
 * priceAinB = reserveB / reserveA
 * priceBinA = reserveA / reserveB
 */
export function usePoolPrice(provider, refreshKey = 0) {
  const [priceAinB, setPriceAinB] = useState(null);
  const [priceBinA, setPriceBinA] = useState(null);

  useEffect(() => {
    async function loadPrice() {
      if (!provider) return;

      try {
        const network = await provider.getNetwork();
        const contracts = getContracts(provider, network.chainId);
        if (!contracts) return;

        const { pool } = contracts;

        const reserveA = await pool.reserveA();
        const reserveB = await pool.reserveB();

        if (reserveA === 0n || reserveB === 0n) {
          setPriceAinB(null);
          setPriceBinA(null);
          return;
        }

        const a = Number(ethers.formatEther(reserveA));
        const b = Number(ethers.formatEther(reserveB));

        setPriceAinB(b / a);
        setPriceBinA(a / b);
      } catch (err) {
        console.error("Failed to load pool price", err);
      }
    }

    loadPrice();
  }, [provider, refreshKey]);

  return {
    priceAinB,
    priceBinA,
  };
}