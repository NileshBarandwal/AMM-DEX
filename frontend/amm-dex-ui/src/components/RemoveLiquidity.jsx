import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts, getSignerContracts } from "../hooks/useContracts";

export default function RemoveLiquidity({
  provider,
  address,
  refreshKey,
  onSuccess,
}) {
  const [lpBalance, setLpBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD LP BALANCE ---------- */
  useEffect(() => {
    async function load() {
      if (!provider || !address) return;

      const network = await provider.getNetwork();
      const contracts = getContracts(provider, network.chainId);
      if (!contracts) return;

      const lpAddr = await contracts.pool.lpToken();

      const lp = new ethers.Contract(
        lpAddr,
        ["function balanceOf(address) view returns (uint256)"],
        provider
      );

      const bal = await lp.balanceOf(address);
      setLpBalance(ethers.formatEther(bal));
    }

    load();
  }, [provider, address, refreshKey]); // 🔥 auto refresh

  /* ---------- REMOVE ---------- */
  async function removeLiquidity() {
    if (!provider || !amount) return;

    try {
      setLoading(true);

      const network = await provider.getNetwork();
      const contracts = await getSignerContracts(provider, network.chainId);
      if (!contracts) return;

      const { pool } = contracts;
      const lpAddr = await pool.lpToken();

      const lp = new ethers.Contract(
        lpAddr,
        ["function approve(address,uint256) external returns (bool)"],
        await provider.getSigner()
      );

      const amountWei = ethers.parseEther(amount);

      await (await lp.approve(await pool.getAddress(), amountWei)).wait();
      await (await pool.removeLiquidity(amountWei)).wait();

      setAmount("");
      onSuccess(); // 🔥 trigger global refresh
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Remove failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Remove Liquidity</h3>

      <p>Your LP balance: {lpBalance}</p>

      <input
        placeholder="LP amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={removeLiquidity} disabled={loading}>
        {loading ? "Removing..." : "Remove Liquidity"}
      </button>
    </div>
  );
}