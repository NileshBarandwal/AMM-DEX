// import { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { getContracts } from "../hooks/useContracts";
// import LPTokenABI from "../abi/LPToken.json";

// export default function UserBalances({ provider, address, refreshKey }) {
//   const [balances, setBalances] = useState(null);

//   useEffect(() => {
//     async function loadBalances() {
//       if (!provider || !address) return;

//       try {
//         const network = await provider.getNetwork();
//         const contracts = getContracts(provider, network.chainId);
//         if (!contracts) return;

//         const { tokenA, tokenB, pool } = contracts;

//         // Token balances
//         const [balA, balB, symA, symB] = await Promise.all([
//           tokenA.balanceOf(address),
//           tokenB.balanceOf(address),
//           tokenA.symbol(),
//           tokenB.symbol(),
//         ]);

//         // LP balance
//         const lpAddr = await pool.lpToken();
//         const lp = new ethers.Contract(lpAddr, LPTokenABI.abi, provider);
//         const lpBal = await lp.balanceOf(address);

//         setBalances({
//           a: ethers.formatEther(balA),
//           b: ethers.formatEther(balB),
//           symA,
//           symB,
//           lp: ethers.formatEther(lpBal),
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     }

//     loadBalances();
//   }, [provider, address, refreshKey]); // 🔥 auto refresh

//   if (!balances) return <p>Loading balances...</p>;

//   return (
//     <div style={{ marginTop: "15px" }}>
//       <h3>Your Balances</h3>
//       <p>{balances.symA}: {balances.a}</p>
//       <p>{balances.symB}: {balances.b}</p>
//       <p><b>Your LP balance:</b> {balances.lp}</p>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContracts } from "../hooks/useContracts";
import LPTokenABI from "../abi/LPToken.json";

export default function UserBalances({ provider, address, refreshKey }) {
  const [balances, setBalances] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBalances() {
      if (!provider || !address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const network = await provider.getNetwork();
        const contracts = getContracts(provider, network.chainId);
        
        if (!contracts) {
          setError("Network not supported");
          return;
        }

        const { tokenA, tokenB, pool } = contracts;

        // Token balances
        const [balA, balB, symA, symB] = await Promise.all([
          tokenA.balanceOf(address),
          tokenB.balanceOf(address),
          tokenA.symbol(),
          tokenB.symbol(),
        ]);

        // LP balance
        const lpAddr = await pool.lpToken();
        const lp = new ethers.Contract(lpAddr, LPTokenABI.abi, provider);
        const lpBal = await lp.balanceOf(address);

        setBalances({
          a: parseFloat(ethers.formatEther(balA)).toFixed(4),
          b: parseFloat(ethers.formatEther(balB)).toFixed(4),
          symA,
          symB,
          lp: parseFloat(ethers.formatEther(lpBal)).toFixed(4),
        });
      } catch (err) {
        console.error("Error loading balances:", err);
        setError("Failed to load balances");
      } finally {
        setIsLoading(false);
      }
    }

    loadBalances();
  }, [provider, address, refreshKey]);

  if (!provider || !address) {
    return (
      <div className="secondary-card">
        <h3 className="secondary-card-title">Your Balances</h3>
        <p className="info-label" style={{ textAlign: "center", padding: "20px 0" }}>
          Connect your wallet to view balances
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="secondary-card">
        <h3 className="secondary-card-title">Your Balances</h3>
        <div style={{ display: "flex", justifyContent: "center", padding: "30px 0" }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="secondary-card">
        <h3 className="secondary-card-title">Your Balances</h3>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <span className="badge error">{error}</span>
        </div>
      </div>
    );
  }

  if (!balances) return null;

  return (
    <div className="secondary-card fade-in">
      <h3 className="secondary-card-title">Your Balances</h3>
      
      <div className="info-section" style={{ paddingTop: 0 }}>
        <div className="info-row">
          <span className="info-label">{balances.symA}</span>
          <span className="info-value">{balances.a}</span>
        </div>
        
        <div className="info-row">
          <span className="info-label">{balances.symB}</span>
          <span className="info-value">{balances.b}</span>
        </div>
        
        <div className="info-row" style={{ borderTop: "1px solid var(--border-primary)", paddingTop: "12px", marginTop: "8px" }}>
          <span className="info-label">
            <span style={{ fontWeight: 600 }}>LP Tokens</span>
          </span>
          <span className="info-value highlight">{balances.lp}</span>
        </div>
      </div>
    </div>
  );
}