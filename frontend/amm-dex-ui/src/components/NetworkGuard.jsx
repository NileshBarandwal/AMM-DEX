export default function NetworkGuard({ isCorrectNetwork }) {
  async function switchToSepolia() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia
      });
    } catch (err) {
      alert("Please add Sepolia network in MetaMask");
    }
  }

  if (isCorrectNetwork) return null;

  return (
    <div
      style={{
        padding: "12px",
        background: "#2b1d00",
        color: "#ffcc66",
        borderRadius: "8px",
        marginBottom: "16px",
        textAlign: "center",
      }}
    >
      ⚠️ You are connected to the wrong network  
      <br />
      <b>Please switch to Sepolia</b>
      <br /><br />
      <button onClick={switchToSepolia}>
        Switch to Sepolia
      </button>
    </div>
  );
}