// import { useState } from "react";
// import Wallet from "./components/Wallet";
// import Swap from "./components/Swap";
// import PoolInfo from "./components/PoolInfo";
// import AddLiquidity from "./components/AddLiquidity";
// import RemoveLiquidity from "./components/RemoveLiquidity";
// import UserBalances from "./components/UserBalances";
// import LPPosition from "./components/LPPosition";
// import ILAnalytics from "./components/ILAnalytics";
// import { useEthers } from "./hooks/useEthers";

// export default function App() {
//   const { provider, address, connect } = useEthers();

//   const [activeTab, setActiveTab] = useState("SWAP");
//   const [refreshKey, setRefreshKey] = useState(0);

//   const refresh = () => setRefreshKey((k) => k + 1);

//   return (
//     <div style={{ padding: "20px", maxWidth: "520px", margin: "0 auto" }}>
//       <h1>AMM DEX</h1>

//       <Wallet address={address} connect={connect} />

//       {/* ---------- TABS ---------- */}
//       <div style={{ margin: "20px 0" }}>
//         <button
//           onClick={() => setActiveTab("SWAP")}
//           style={{
//             marginRight: "10px",
//             fontWeight: activeTab === "SWAP" ? "bold" : "normal",
//           }}
//         >
//           Swap
//         </button>

//         <button
//           onClick={() => setActiveTab("LIQUIDITY")}
//           style={{
//             fontWeight: activeTab === "LIQUIDITY" ? "bold" : "normal",
//           }}
//         >
//           Liquidity
//         </button>
//       </div>

//       {/* ---------- SWAP TAB ---------- */}
//       {activeTab === "SWAP" && (
//         <>
//           <Swap provider={provider} onSuccess={refresh} />

//           <PoolInfo provider={provider} refreshKey={refreshKey} />

//           <ILAnalytics provider={provider} />
//         </>
//       )}

//       {/* ---------- LIQUIDITY TAB ---------- */}
//       {activeTab === "LIQUIDITY" && (
//         <>
//           <UserBalances
//             provider={provider}
//             address={address}
//             refreshKey={refreshKey}
//           />

//           <LPPosition
//             provider={provider}
//             address={address}
//             refreshKey={refreshKey}
//           />

//           <AddLiquidity provider={provider} onSuccess={refresh} />

//           <RemoveLiquidity
//             provider={provider}
//             address={address}
//             refreshKey={refreshKey}
//             onSuccess={refresh}
//           />
//         </>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import Wallet from "./components/Wallet";
import Swap from "./components/Swap";
import PoolInfo from "./components/PoolInfo";
import AddLiquidity from "./components/AddLiquidity";
import RemoveLiquidity from "./components/RemoveLiquidity";
import UserBalances from "./components/UserBalances";
import LPPosition from "./components/LPPosition";
import ILAnalytics from "./components/ILAnalytics";
import NetworkGuard from "./components/NetworkGuard";
import { useEthers } from "./hooks/useEthers";
import "./App.css";

export default function App() {
  const {
    provider,
    address,
    connect,
    isCorrectNetwork,
  } = useEthers();

  const [activeTab, setActiveTab] = useState("SWAP");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="app-container">
      {/* ---------- HEADER ---------- */}
      <header className="app-header">
        <h1 className="app-title">AMM DEX</h1>
        <p className="app-subtitle">
          Swap tokens and provide liquidity
        </p>
      </header>

      {/* ---------- WALLET ---------- */}
      <Wallet address={address} connect={connect} />

      {/* ---------- NETWORK GUARD ---------- */}
      <NetworkGuard isCorrectNetwork={isCorrectNetwork} />

      {/* ---------- TAB NAV ---------- */}
      <nav className="tab-nav">
        <button
          className={`tab-button ${
            activeTab === "SWAP" ? "active" : ""
          }`}
          onClick={() => setActiveTab("SWAP")}
          disabled={!isCorrectNetwork}
        >
          🔄 Swap
        </button>

        <button
          className={`tab-button ${
            activeTab === "LIQUIDITY" ? "active" : ""
          }`}
          onClick={() => setActiveTab("LIQUIDITY")}
          disabled={!isCorrectNetwork}
        >
          💧 Liquidity
        </button>
      </nav>

      {/* ---------- CONTENT (ONLY IF CORRECT NETWORK) ---------- */}
      {isCorrectNetwork && (
        <>
          {activeTab === "SWAP" && (
            <>
              <Swap provider={provider} onSuccess={refresh} />
              <PoolInfo
                provider={provider}
                refreshKey={refreshKey}
              />
              <ILAnalytics provider={provider} />
            </>
          )}

          {activeTab === "LIQUIDITY" && (
            <>
              <UserBalances
                provider={provider}
                address={address}
                refreshKey={refreshKey}
              />

              <LPPosition
                provider={provider}
                address={address}
                refreshKey={refreshKey}
              />

              <AddLiquidity
                provider={provider}
                onSuccess={refresh}
              />

              <RemoveLiquidity
                provider={provider}
                address={address}
                refreshKey={refreshKey}
                onSuccess={refresh}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}