import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../hooks/useContracts";

export default function PoolInfo({ provider, refreshKey }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!provider) return;

      try {
        const network = await provider.getNetwork();
        const contracts = getContracts(provider, network.chainId);
        if (!contracts) return;

        const { pool, tokenA, tokenB } = contracts;

        const [reserveA, reserveB, symbolA, symbolB] = await Promise.all([
          pool.reserveA(),
          pool.reserveB(),
          tokenA.symbol(),
          tokenB.symbol(),
        ]);

        const rA = Number(ethers.formatEther(reserveA));
        const rB = Number(ethers.formatEther(reserveB));

        if (!mounted) return;

        // Empty pool case
        if (rA === 0 || rB === 0) {
          setData({
            empty: true,
            symbolA,
            symbolB,
          });
          return;
        }

        setData({
          empty: false,
          reserveA: rA,
          reserveB: rB,
          symbolA,
          symbolB,
          priceAinB: rB / rA,
          priceBinA: rA / rB,
        });
      } catch (err) {
        console.error("Failed to load pool info", err);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [provider, refreshKey]);

  if (!data) return <p>Loading pool data…</p>;

  if (data.empty) {
    return (
      <div style={{ marginTop: "20px" }}>
        <h3>Pool Info</h3>
        <p>Pool is empty</p>
        <p style={{ fontSize: "12px", opacity: 0.7 }}>
          First liquidity provider sets the initial price
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Pool Info</h3>

      {/* Reserves */}
      <p>
        <b>Reserves</b>
        <br />
        {data.symbolA}: {data.reserveA.toFixed(4)}
        <br />
        {data.symbolB}: {data.reserveB.toFixed(4)}
      </p>

      {/* Prices */}
      <p>
        <b>Prices</b>
        <br />
        1 {data.symbolA} ={" "}
        <b>{data.priceAinB.toFixed(6)}</b> {data.symbolB}
        <br />
        1 {data.symbolB} ={" "}
        <b>{data.priceBinA.toFixed(6)}</b> {data.symbolA}
      </p>

      <p style={{ fontSize: "12px", opacity: 0.7 }}>
        Prices derived from pool reserves (x · y = k)
      </p>
    </div>
  );
}