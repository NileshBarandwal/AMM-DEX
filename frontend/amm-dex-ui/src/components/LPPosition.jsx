import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../hooks/useContracts";

export default function LPPosition({ provider, address, refreshKey }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!provider || !address) return;

      try {
        const network = await provider.getNetwork();
        const contracts = getContracts(provider, network.chainId);
        if (!contracts) return;

        const { pool, tokenA, tokenB } = contracts;

        const lpTokenAddr = await pool.lpToken();

        const lp = new ethers.Contract(
          lpTokenAddr,
          [
            "function balanceOf(address) view returns (uint256)",
            "function totalSupply() view returns (uint256)",
          ],
          provider
        );

        const [
          lpBalance,
          totalSupply,
          reserveA,
          reserveB,
          symbolA,
          symbolB,
        ] = await Promise.all([
          lp.balanceOf(address),
          lp.totalSupply(),
          pool.reserveA(),
          pool.reserveB(),
          tokenA.symbol(),
          tokenB.symbol(),
        ]);

        if (totalSupply === 0n || lpBalance === 0n) {
          if (mounted) setData({ empty: true });
          return;
        }

        const share = Number(lpBalance) / Number(totalSupply);

        const userA =
          Number(ethers.formatEther(reserveA)) * share;
        const userB =
          Number(ethers.formatEther(reserveB)) * share;

        if (!mounted) return;

        setData({
          lpBalance: ethers.formatEther(lpBalance),
          poolShare: (share * 100).toFixed(4),
          userA: userA.toFixed(6),
          userB: userB.toFixed(6),
          symbolA,
          symbolB,
        });
      } catch (err) {
        console.error("LP position load failed", err);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [provider, address, refreshKey]);

  if (!data) return <p>Loading LP position…</p>;

  if (data.empty) {
    return (
      <div style={{ marginTop: "20px" }}>
        <h3>Your LP Position</h3>
        <p>You have no liquidity in this pool.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Your LP Position</h3>

      <p>
        LP Tokens: <b>{data.lpBalance}</b>
      </p>

      <p>
        Pool Share: <b>{data.poolShare}%</b>
      </p>

      <p>
        Underlying Assets:
        <br />
        {data.symbolA}: <b>{data.userA}</b>
        <br />
        {data.symbolB}: <b>{data.userB}</b>
      </p>

      <p style={{ fontSize: "12px", opacity: 0.7 }}>
        Your share is proportional to total LP supply
      </p>
    </div>
  );
}