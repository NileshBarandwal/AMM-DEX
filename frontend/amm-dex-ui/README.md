# AMM-DEX Frontend
### React Interface for a Constant-Product AMM (Uniswap v2–Style)

---

## 1. Overview

This repository contains the **frontend application** for **AMM-DEX**, a decentralized exchange implementing a **constant-product Automated Market Maker (AMM)**.

The frontend is responsible for:
- Wallet connection (MetaMask)
- Network validation (Sepolia)
- Swap UX with real-time price impact & slippage protection
- Liquidity provision with automatic ratio enforcement
- LP position tracking
- Impermanent loss (IL) analytics
- Safe, transparent interaction with on-chain smart contracts

>  All prices, swaps, and balances are derived **directly from on-chain data**.  
> X No centralized APIs  
> X No price oracles  
> X No off-chain calculations

---

## 2. Live Deployment

| Component | URL |
|---------|-----|
| Frontend (Vercel) | https://amm-dex-orcin.vercel.app |
| Network | Ethereum Sepolia Testnet |

---

## 3. Tech Stack

| Layer | Technology |
|-----|------------|
| Framework | React (Vite) |
| Blockchain Library | Ethers.js (v6) |
| Wallet | MetaMask |
| Styling | CSS |
| Deployment | Vercel |

---

## 4. High-Level Frontend Architecture

```bash
User
↓
React UI
↓
Ethers.js
↓
MetaMask
↓
Ethereum (Sepolia)
↓
AMM Smart Contracts
```


### Design Principles
- Deterministic UI (no hidden logic)
- Real-time on-chain data
- User safety over execution speed
- Protocol correctness > UI convenience

---

## 5. Application Structure
```bash
amm-dex-ui/
├── src/
│   ├── components/
│   │   ├── Wallet.jsx           # Wallet connect / address display
│   │   ├── NetworkGuard.jsx     # Wrong-network detection
│   │   ├── Swap.jsx             # Swap UI + AMM math
│   │   ├── AddLiquidity.jsx     # LP deposit with ratio enforcement
│   │   ├── RemoveLiquidity.jsx  # LP withdrawal
│   │   ├── PoolInfo.jsx         # Reserves + price display
│   │   ├── UserBalances.jsx     # Token balances
│   │   ├── LPPosition.jsx       # LP share calculation
│   │   └── ILAnalytics.jsx      # Impermanent loss calculator
│   │
│   ├── hooks/
│   │   ├── useEthers.js         # Wallet + provider management
│   │   └── useContracts.js      # Contract address/ABI mapping
│   │
│   ├── App.jsx                  # Main application layout
│   ├── App.css                  # Global styles
│   └── main.jsx
│
├── public/
├── package.json
└── README.md
```

---

## 6. Wallet & Network Handling

### 6.1 Wallet Connection (`useEthers.js`)

- Uses `ethers.BrowserProvider`
- Requests accounts via MetaMask
- Exposes:
  - `provider`
  - `address`
  - `connect()`
  - `isCorrectNetwork`

### 6.2 Network Guard

- Ensures user is connected to **Sepolia**
- Blocks all actions on wrong networks
- Displays explicit warning instead of failing silently

---

## 7. Swap UX & AMM Math

### 7.1 Swap Formula (Preview Calculation)

The UI calculates output using the constant-product AMM formula:
```bash
amountInWithFee = amountIn × 0.997

amountOut = (reserveOut × amountInWithFee) / (reserveIn + amountInWithFee)
```

All values are fetched directly from the pool contract.

---

### 7.2 Price Impact Calculation

```bash
spotPrice = reserveOut / reserveIn
executionPrice = amountOut / amountIn

priceImpact = (spotPrice − executionPrice) / spotPrice × 100

```


### UX Thresholds

| Price Impact | UI Behavior |
|-------------|------------|
| < 1% | Normal |
| 1–5% | Warning |
| 5–15% | Strong warning |
| > 15% | Swap blocked |

---

### 7.3 Slippage Protection

User-defined slippage tolerance:


### UX Thresholds

| Price Impact | UI Behavior |
|-------------|------------|
| < 1% | Normal |
| 1–5% | Warning |
| 5–15% | Strong warning |
| > 15% | Swap blocked |

---

### 7.3 Slippage Protection

User-defined slippage tolerance:

```bash
minReceived = expectedOut × (1 − slippage%)
```

This value is enforced **on-chain** during the swap.

---

## 8. Liquidity Provision UX

### 8.1 Initial Liquidity

- If pool is empty:
  - User sets the initial price
  - No ratio enforcement
  - UI displays “You are setting the price”

---

### 8.2 Subsequent Liquidity (Auto-Calculation)

For non-empty pools, the UI enforces:

```bash
amountA / amountB = reserveA / reserveB
```


When the user edits:
```bash
- Token A → Token B auto-calculates
- Token B → Token A auto-calculates
```

This prevents price manipulation and failed transactions.

---

## 9. Pool Info & Price Display

The UI displays:
- Current reserves
- Derived prices
- Pool ratio
```bash
price(A → B) = reserveB / reserveA
price(B → A) = reserveA / reserveB
```

> Prices are **not market prices** — they are **pool prices**.

---

## 10. LP Position Tracking

LP ownership is calculated as:
```bash
poolShare = LP_user / LP_total
```

Underlying assets owned:
```bash
tokenA_owned = poolShare × reserveA
tokenB_owned = poolShare × reserveB
```

Displayed live for the connected wallet.

---

## 11. Impermanent Loss (IL) Analytics

### Formula (Uniswap v2 model)
```bash
IL = (2 × √priceRatio) / (1 + priceRatio) − 1
```

Where:
```bash
priceRatio = currentPrice / entryPrice
```

### UI Behavior
- Entry price input
- Current price auto-filled
- IL shown as percentage
- Educational disclaimer included

---

## 12. Security & UX Safeguards

### Implemented Protections
- Wrong-network blocking
- High price-impact warnings
- Swap blocking on extreme slippage
- Deadline enforcement
- Explicit approval flows
- No hidden auto-signing

### Explicit Non-Goals
- MEV protection
- Oracle-based pricing
- Gas optimization for L2

These are intentional design decisions.

---

## 13. Local Installation & Development

### Prerequisites
- Node.js ≥ 18
- MetaMask
- Sepolia ETH

---

### Install & Run

```bash
git clone <frontend-repo-url>
cd amm-dex-ui
npm install
npm run dev
```
Open:
```bash
http://localhost:5173
```

Production Build:
```bash
npm run build
```

Deploy to Vercel:
```bash
vercel --prod
```
