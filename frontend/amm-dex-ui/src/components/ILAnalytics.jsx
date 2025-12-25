import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../hooks/useContracts";

/**
 * Impermanent Loss Estimator
 * Supports BOTH:
 *  - Token B per Token A
 *  - Token A per Token B
 */
export default function ILAnalytics({ provider }) {
  const [direction, setDirection] = useState("A_TO_B");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [entryPrice, setEntryPrice] = useState("");
  const [ilPercent, setIlPercent] = useState(null);

  /* ---------- LOAD CURRENT PRICE ---------- */
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

        const price =
          direction === "A_TO_B"
            ? Number(ethers.formatEther(reserveB)) /
              Number(ethers.formatEther(reserveA))
            : Number(ethers.formatEther(reserveA)) /
              Number(ethers.formatEther(reserveB));

        setCurrentPrice(price);
      } catch (err) {
        console.error("Failed to load price", err);
      }
    }

    loadPrice();
  }, [provider, direction]);

  /* ---------- CALCULATE IMPERMANENT LOSS ---------- */
  useEffect(() => {
    if (!currentPrice || !entryPrice) {
      setIlPercent(null);
      return;
    }

    const P0 = Number(entryPrice);   // entry price
    const P1 = currentPrice;         // current price

    if (P0 <= 0 || P1 <= 0) return;

    const priceRatio = P1 / P0;

    // Uniswap v2 IL formula
    const il =
      (2 * Math.sqrt(priceRatio)) /
        (1 + priceRatio) -
      1;

    setIlPercent((il * 100).toFixed(2));
  }, [entryPrice, currentPrice]);

  /* ---------- COLOR LOGIC ---------- */
  function ilColor(value) {
    const abs = Math.abs(value);
    if (abs < 1) return "green";
    if (abs < 5) return "orange";
    return "red";
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Impermanent Loss Estimator</h3>

      {/* Direction Toggle */}
      <button
        onClick={() =>
          setDirection(direction === "A_TO_B" ? "B_TO_A" : "A_TO_B")
        }
      >
        {direction === "A_TO_B"
          ? "Price: Token B per Token A"
          : "Price: Token A per Token B"}
      </button>

      <p style={{ marginTop: "10px" }}>
        Current Price:{" "}
        <b>{currentPrice ? currentPrice.toFixed(6) : "Loading..."}</b>
      </p>

      <input
        placeholder={
          direction === "A_TO_B"
            ? "Your entry price (B per A)"
            : "Your entry price (A per B)"
        }
        value={entryPrice}
        onChange={(e) => setEntryPrice(e.target.value)}
      />

      {ilPercent !== null && (
        <p style={{ color: ilColor(ilPercent) }}>
          Impermanent Loss: <b>{ilPercent}%</b>
        </p>
      )}

      <p style={{ fontSize: "12px", opacity: 0.7 }}>
        * Compares LP value vs HODL at the same prices (Uniswap v2 model)
      </p>
    </div>
  );
}