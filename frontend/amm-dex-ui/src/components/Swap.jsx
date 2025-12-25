import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts, getSignerContracts } from "../hooks/useContracts";

/* ---------- HELPERS ---------- */
function getImpactColor(impact) {
  if (impact < 1) return "green";     // Low
  if (impact < 5) return "gold";      // Medium
  if (impact < 15) return "orange";   // High
  return "red";                       // Dangerous
}

function impactLabel(impact) {
  if (impact < 1) return "Low";
  if (impact < 5) return "Medium";
  if (impact < 15) return "High";
  return "Severe";
}

export default function Swap({ provider, onSuccess }) {
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [priceImpact, setPriceImpact] = useState(null);
  const [slippage, setSlippage] = useState(1);
  const [direction, setDirection] = useState("A_TO_B");
  const [loading, setLoading] = useState(false);

  /* ---------- DERIVED ---------- */
  const minReceived =
    receiveAmount
      ? (Number(receiveAmount) * (1 - slippage / 100)).toFixed(6)
      : "";

  /* ---------- AUTO CALCULATE ---------- */
  useEffect(() => {
    async function calculate() {
      if (!provider || !payAmount || Number(payAmount) <= 0) {
        setReceiveAmount("");
        setPriceImpact(null);
        return;
      }

      try {
        const network = await provider.getNetwork();
        const contracts = getContracts(provider, network.chainId);
        if (!contracts) return;

        const { pool } = contracts;

        const reserveA = await pool.reserveA();
        const reserveB = await pool.reserveB();

        let reserveIn, reserveOut;

        if (direction === "A_TO_B") {
          reserveIn = reserveA;
          reserveOut = reserveB;
        } else {
          reserveIn = reserveB;
          reserveOut = reserveA;
        }

        const amountInWei = ethers.parseEther(payAmount);
        const amountInWithFee = (amountInWei * 997n) / 1000n;

        // AMM formula
        const amountOut =
          (reserveOut * amountInWithFee) /
          (reserveIn + amountInWithFee);

        const out = Number(ethers.formatEther(amountOut));
        setReceiveAmount(out.toFixed(6));

        // ---- Price impact ----
        const spotPrice =
          Number(ethers.formatEther(reserveOut)) /
          Number(ethers.formatEther(reserveIn));

        const executionPrice = out / Number(payAmount);

        const impact =
          ((spotPrice - executionPrice) / spotPrice) * 100;

        setPriceImpact(Number(impact.toFixed(2)));
      } catch (err) {
        console.error(err);
        setReceiveAmount("");
        setPriceImpact(null);
      }
    }

    calculate();
  }, [provider, payAmount, direction, slippage]); // ✅ slippage added

  /* ---------- EXECUTE SWAP ---------- */
  async function handleSwap() {
    if (!provider || !payAmount || !receiveAmount) return;

    try {
      setLoading(true);

      const network = await provider.getNetwork();
      const contracts = await getSignerContracts(provider, network.chainId);
      if (!contracts) return;

      const { router, pool, tokenA, tokenB } = contracts;

      const tokenIn = direction === "A_TO_B" ? tokenA : tokenB;

      const amountInWei = ethers.parseEther(payAmount);
      const minOutWei = ethers.parseEther(minReceived);

      const deadline = Math.floor(Date.now() / 1000) + 60;

      // Approve
      await (
        await tokenIn.approve(
          await router.getAddress(),
          amountInWei
        )
      ).wait();

      // Swap
      await (
        await router.swapExactTokensForTokens(
          await pool.getAddress(),
          await tokenIn.getAddress(),
          amountInWei,
          minOutWei,
          deadline
        )
      ).wait();

      setPayAmount("");
      setReceiveAmount("");
      setPriceImpact(null);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Swap failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Swap</h3>

      {/* Direction Toggle */}
      <button
        onClick={() =>
          setDirection(direction === "A_TO_B" ? "B_TO_A" : "A_TO_B")
        }
      >
        {direction === "A_TO_B"
          ? "Token A → Token B"
          : "Token B → Token A"}
      </button>

      <br /><br />

      {/* Pay */}
      <input
        placeholder="You pay"
        value={payAmount}
        onChange={(e) => setPayAmount(e.target.value)}
      />

      <br />

      {/* Receive */}
      <input
        placeholder="You receive (estimated)"
        value={receiveAmount}
        disabled
      />

      {/* Info */}
      {priceImpact !== null && (
        <>
          <p>
            Minimum received (after slippage): <b>{minReceived}</b>
          </p>

          <p>
            Price impact:{" "}
            <b style={{ color: getImpactColor(priceImpact) }}>
              {priceImpact}% ({impactLabel(priceImpact)})
            </b>
          </p>
        </>
      )}

      {/* Slippage */}
      <label>
        Slippage (%):
        <input
          type="number"
          value={slippage}
          onChange={(e) => setSlippage(e.target.value)}
          style={{ width: "60px", marginLeft: "5px" }}
        />
      </label>

      <br /><br />

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={loading || priceImpact > 15}
      >
        {loading ? "Swapping..." : "Swap"}
      </button>

      {/* Warnings */}
      {priceImpact > 5 && priceImpact <= 15 && (
        <p style={{ color: "orange" }}>
          ⚠️ High price impact — consider a smaller trade
        </p>
      )}

      {priceImpact > 15 && (
        <p style={{ color: "red" }}>
          🚫 Trade blocked due to extreme price impact
        </p>
      )}
    </div>
  );
}