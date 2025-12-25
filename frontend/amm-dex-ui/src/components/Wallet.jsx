export default function Wallet({ address, connect }) {
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="wallet-container">
      {address ? (
        <div className="wallet-card">
          <div className="wallet-address-wrapper">
            <div className="wallet-icon">👤</div>
            <div className="wallet-info">
              <div className="wallet-label">Connected</div>
              <div className="wallet-address" title={address}>
                {formatAddress(address)}
              </div>
            </div>
          </div>
          <span className="badge success">Active</span>
        </div>
      ) : (
        <button className="connect-btn" onClick={connect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}