import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts, getSignerContracts } from "../hooks/useContracts";

export default function AddLiquidity({ provider, onSuccess }) {
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [reserves, setReserves] = useState(null);
  const [lastChanged, setLastChanged] = useState(null);
  const [pending, setPending] = useState(false);

  /* ---------- LOAD RESERVES ---------- */
  async function loadReserves() {
    if (!provider) return;

    const network = await provider.getNetwork();
    const contracts = getContracts(provider, network.chainId);
    if (!contracts) return;

    const { pool } = contracts;

    const [rA, rB] = await Promise.all([
      pool.reserveA(),
      pool.reserveB(),
    ]);

    setReserves({
      A: Number(ethers.formatEther(rA)),
      B: Number(ethers.formatEther(rB)),
    });
  }

  useEffect(() => {
    loadReserves();
  }, [provider]);

  /* ---------- AUTO CALCULATE ---------- */
  useEffect(() => {
    if (!reserves || !lastChanged) return;

    // Initial pool → user defines price
    if (reserves.A === 0 || reserves.B === 0) return;

    if (lastChanged === "A") {
      if (!amountA || Number(amountA) <= 0) {
        setAmountB("");
        return;
      }

      const b = (Number(amountA) * reserves.B) / reserves.A;
      setAmountB(b.toFixed(6));
    }

    if (lastChanged === "B") {
      if (!amountB || Number(amountB) <= 0) {
        setAmountA("");
        return;
      }

      const a = (Number(amountB) * reserves.A) / reserves.B;
      setAmountA(a.toFixed(6));
    }
  }, [amountA, amountB, lastChanged, reserves]);

  /* ---------- ADD LIQUIDITY ---------- */
  async function addLiquidity() {
    if (!provider || !amountA || !amountB) return;

    try {
      setPending(true);

      const network = await provider.getNetwork();
      const contracts = await getSignerContracts(provider, network.chainId);
      if (!contracts) return;

      const { pool, tokenA, tokenB } = contracts;

      const a = ethers.parseEther(amountA);
      const b = ethers.parseEther(amountB);

      await (await tokenA.approve(await pool.getAddress(), a)).wait();
      await (await tokenB.approve(await pool.getAddress(), b)).wait();

      await (await pool.addLiquidity(a, b)).wait();

      setAmountA("");
      setAmountB("");
      setLastChanged(null);

      await loadReserves(); // 🔥 refresh pool ratio
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Add liquidity failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Add Liquidity</h3>

      <input
        placeholder="Token A amount"
        value={amountA}
        onChange={(e) => {
          setLastChanged("A");
          setAmountA(e.target.value);
        }}
      />

      <br />

      <input
        placeholder="Token B amount"
        value={amountB}
        onChange={(e) => {
          setLastChanged("B");
          setAmountB(e.target.value);
        }}
      />

      {/* Info */}
      {reserves && reserves.A > 0 && reserves.B > 0 && (
        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          Pool ratio enforced automatically
        </p>
      )}

      {reserves && (reserves.A === 0 || reserves.B === 0) && (
        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          You are setting the initial price
        </p>
      )}

      <br />

      <button onClick={addLiquidity} disabled={pending}>
        {pending ? "Adding..." : "Add Liquidity"}
      </button>
    </div>
  );
}