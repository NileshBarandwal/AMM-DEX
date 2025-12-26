# 🦄 AMM DEX – Uniswap-Style Automated Market Maker

A **fully functional Automated Market Maker (AMM) decentralized exchange** built from scratch using **Solidity, Hardhat, Ethers.js, and React**. This project demonstrates deep understanding of **core DeFi primitives** including liquidity pools, LP tokens, constant-product swaps, fee mechanics, slippage protection, and a clean, functional frontend.

> **🌐 Live Demo (Sepolia Testnet)**  
> [https://amm-dex-orcin.vercel.app](https://amm-dex-orcin.vercel.app)

---

## 🎯 Project Overview

I built a Uniswap-style AMM from scratch using **Solidity, Hardhat, and React**. The core is a **constant-product pool** where swaps follow `x·y=k` with a **0.3% fee**. Liquidity providers deposit two ERC20 tokens and receive **LP tokens** representing their share. Swaps are routed through a **Router contract** that enforces **slippage protection** and **deadlines** to prevent MEV and stale trades.

I wrote a **full Hardhat test suite** covering liquidity addition/removal, swaps in both directions, slippage reverts, deadline checks, router safety, and LP fee accumulation. The contracts are **deployed on Sepolia**, and I built a **React frontend** using **Ethers.js v6** with **MetaMask integration**, live pool data, price-impact warnings, and an **impermanent loss estimator**. The UI is **deployed on Vercel** and interacts directly with the live testnet contracts.

### 🔍 TL;DR (Short Summary)

**Built a Uniswap-style AMM DEX with Solidity and React** featuring constant-product swaps, LP token mechanics, slippage protection, deadline enforcement, full test coverage, Sepolia deployment, and a live MetaMask-enabled frontend.

---

## 🎯 What This Project Demonstrates

- ✅ **Deep AMM Understanding** – Implements `x · y = k` constant product formula from scratch
- ✅ **Full-Stack DeFi Development** – Smart contracts → Testing → Deployment → Functional UI
- ✅ **Professional Architecture** – Router pattern, slippage protection, deadline enforcement
- ✅ **Clean, Functional Interface** – Clear UX with real-time data display
- ✅ **Real Blockchain Integration** – Live on Sepolia testnet with MetaMask support
- ✅ **Comprehensive Testing** – Full test coverage with Hardhat + Mocha

**This is not a tutorial clone** – all contracts, tests, and UI logic are implemented manually with professional-grade code quality.

---

## ✨ Core Features

### 🔁 **Token Swaps**
- Swap between Token A ↔ Token B using constant-product formula
- **0.3% swap fee** (Uniswap v2 style)
- **Slippage protection** – transactions revert if price moves unfavorably
- **Deadline enforcement** – prevents stale transactions
- **Real-time price impact calculation** with visual warnings
- **Transaction status feedback** with clear user messaging

### 💧 **Liquidity Provision**
- Add liquidity to pools and receive LP tokens
- Remove liquidity and burn LP tokens
- **Proportional asset distribution** on withdrawal
- **Fee accumulation** – LPs earn from swap fees
- **Position tracking** – view your pool share and value

### 📊 **Analytics & Insights**
- **Pool reserves** – real-time reserve monitoring
- **User balances** – track all token holdings
- **LP position dashboard** – detailed position metrics
- **Impermanent Loss (IL) calculator** – estimate IL vs HODL
- **Price impact visualization** – color-coded warnings
- **Fee-based LP return estimation** – foundation for APR tracking

### 🎨 **Clean, Functional UI**
- **Uniswap-inspired layout** – familiar, intuitive interface
- **Dark theme** – professional color scheme with gradients
- **Responsive design** – works on desktop, tablet, and mobile
- **Real-time transaction feedback** – clear status messages
- **Interactive components** – token selection and input validation
- **Smooth user flow** – streamlined swap and liquidity workflows
- **Loading indicators** – visual feedback during transactions

---

## 🧰 Tech Stack

### **Smart Contracts**
- **Solidity 0.8.x** – Secure, modern smart contract development
- **Hardhat v3** – Ethereum development framework
- **OpenZeppelin Contracts** – Battle-tested ERC20 implementation
- **Ethers.js v6** – Contract interaction library

### **Frontend**
- **React 18** – Modern UI framework
- **Vite** – Lightning-fast build tool
- **Ethers.js v6** – Blockchain interaction
- **CSS3** – Custom design system with animations
- **MetaMask Integration** – Wallet connectivity

### **Testing & Deployment**
- **Mocha + Chai** – Comprehensive test suite
- **Hardhat Network** – Local development blockchain
- **Sepolia Testnet** – Live testing environment
- **Vercel** – Production frontend hosting
- **Alchemy** – RPC provider

---

## 📁 Repository Structure

```text
amm-dex/
├── contracts/
│   ├── Pool.sol          # Core AMM pool implementation (x*y=k)
│   ├── Router.sol        # Swap routing with safety checks
│   ├── LPToken.sol       # Liquidity provider token (ERC20)
│   └── TestToken.sol     # ERC20 test tokens for development
│
├── test/
│   └── pool.test.js      # Comprehensive AMM test suite
│
├── scripts/
│   └── deploy.js         # Deployment script (local & Sepolia)
│
├── frontend/
│   └── amm-dex-ui/       # React frontend application
│       ├── src/
│       │   ├── components/       # UI components
│       │   ├── hooks/           # Custom React hooks
│       │   ├── abi/             # Contract ABIs
│       │   ├── constants/       # Config and addresses
│       │   ├── App.jsx          # Main application
│       │   ├── index.css        # Global styles
│       │   └── App.css          # Component styles
│       ├── package.json
│       └── vite.config.js
│
├── hardhat.config.js     # Hardhat configuration
├── package.json          # Project dependencies
├── .env.example          # Environment variable template
└── README.md             # This file
```

---

## 🧪 Test Coverage

All critical AMM behaviors are thoroughly tested:

| Test Category | Coverage |
|--------------|----------|
| ✅ Initial Liquidity | Adding first liquidity to empty pool |
| ✅ Token Swaps | A → B and B → A with fee calculation |
| ✅ Liquidity Addition | Adding to existing pool |
| ✅ Liquidity Removal | Burning LP tokens for underlying assets |
| ✅ Slippage Protection | Revert on unfavorable price movement |
| ✅ Deadline Enforcement | Revert on expired transactions |
| ✅ Router Safety | End-to-end swap through router |
| ✅ Fee Accumulation | LP fee accrual over multiple swaps |
| ✅ Edge Cases | Zero amounts, insufficient balance, etc. |

**Run the full test suite:**

```bash
npx hardhat test
```

**Expected output:**
```text
  AMM Pool Tests
    ✔ Should add initial liquidity
    ✔ Should swap A for B
    ✔ Should swap B for A
    ✔ Should remove liquidity
    ✔ Should enforce slippage protection
    ✔ Should enforce deadlines
    ✔ Should accumulate fees for LPs
    
  8 passing (2s)
```

---

## 🚀 Quick Start

### **Prerequisites**

Before starting, ensure you have:

- **Git** – Version control
- **Node.js ≥ 22 (LTS)** – Required for Hardhat v3
- **MetaMask** – Browser wallet extension
- **Terminal** – Command-line interface

> ⚠️ **Important:** This project requires **Node.js version 22 or higher** due to Hardhat v3 requirements.

---

### **1️⃣ Node.js Setup**

Install Node Version Manager (nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Restart your terminal, then install Node.js:

```bash
nvm install 22
nvm use 22
```

Verify installation:

```bash
node -v   # Should show v22.x.x
npm -v    # Should show 10.x.x
```

---

### **2️⃣ Clone & Install**

Clone the repository:

```bash
git clone https://github.com/yourusername/amm-dex.git
cd amm-dex
```

Install dependencies:

```bash
npm install
```

---

### **3️⃣ Local Development**

Start a local Hardhat node:

```bash
npx hardhat node
```

In a new terminal, deploy contracts locally:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Copy the deployed contract addresses** from the terminal output.

---

### **4️⃣ Run Frontend Locally**

Navigate to frontend directory:

```bash
cd frontend/amm-dex-ui
npm install
```

Update contract addresses in `src/constants/addresses.js`:

```javascript
export const ADDRESSES = {
  31337: { // Localhost
    tokenA: "0x...", // Your deployed TokenA address
    tokenB: "0x...", // Your deployed TokenB address
    pool: "0x...",   // Your deployed Pool address
    router: "0x..."  // Your deployed Router address
  }
};
```

Start the development server:

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 🌍 Sepolia Testnet Deployment

### **1️⃣ Setup Environment Variables**

Create a `.env` file in the root directory:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_metamask_private_key_here
```

> ⚠️ **Security Warning:** Never commit `.env` to version control. Add it to `.gitignore`.

### **2️⃣ Get Sepolia ETH**

Get test ETH from a faucet:
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)

### **3️⃣ Deploy to Sepolia**

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Save the deployed addresses** – you'll need them for the frontend.

### **4️⃣ Update Frontend Config**

Update `frontend/amm-dex-ui/src/constants/addresses.js` with Sepolia addresses:

```javascript
export const ADDRESSES = {
  11155111: { // Sepolia
    tokenA: "0x...",
    tokenB: "0x...",
    pool: "0x...",
    router: "0x..."
  }
};
```

### **5️⃣ Deploy Frontend to Vercel**

Install Vercel CLI:

```bash
npm i -g vercel
```

Deploy from frontend directory:

```bash
cd frontend/amm-dex-ui
vercel --prod
```

Follow the prompts to complete deployment.

---

## 🎨 UI Features & Enhancements

### **Current Implementation**
- ✅ **Clean Interface** – Intuitive swap and liquidity tabs
- ✅ **Real-time Data** – Live pool reserves and balances
- ✅ **Price Impact Warnings** – Color-coded alerts for high slippage
- ✅ **Transaction Feedback** – Clear success/error messages
- ✅ **Responsive Layout** – Mobile-friendly design
- ✅ **MetaMask Integration** – Seamless wallet connectivity

> **Design Philosophy:** The current live UI prioritizes correctness and clarity over advanced animations. Focus is on reliable functionality and accurate data display.

---

## 📚 Smart Contract Architecture

### **Current Implementation**

This project implements a **single-pool AMM** with the following verified features:

**Fully Implemented:**
- ✅ Constant product formula (x · y = k)
- ✅ 0.3% swap fee with LP fee accumulation
- ✅ Proportional liquidity addition/removal
- ✅ Slippage protection (minAmountOut checks)
- ✅ Deadline enforcement (time-based transaction expiry)
- ✅ Router safety wrapper
- ✅ LP token minting/burning (ERC20 standard)

**Limitations (by design for this version):**
- Single token pair (TKA/TKB)
- No price oracle (uses pool reserves)
- No multi-hop routing
- No concentrated liquidity
- Testnet deployment only

### **Contract Details**

### **Pool.sol**
Core AMM implementation with constant product formula:

```solidity
// Swap tokens using x * y = k
function swap(
    address tokenIn,
    uint amountIn,
    uint minAmountOut,
    uint deadline
) external returns (uint amountOut)

// Add liquidity and mint LP tokens
function addLiquidity(
    uint amountA,
    uint amountB
) external returns (uint liquidity)

// Remove liquidity and burn LP tokens
function removeLiquidity(
    uint liquidity
) external returns (uint amountA, uint amountB)
```

### **Router.sol**
Safety wrapper with slippage protection:

```solidity
// Safe swap with deadline and slippage checks
function swapExactTokensForTokens(
    address tokenIn,
    address tokenOut,
    uint amountIn,
    uint minAmountOut,
    uint deadline
) external returns (uint amountOut)
```

### **LPToken.sol**
Standard ERC20 for liquidity provider tokens.

### **TestToken.sol**
ERC20 tokens for testing (TKA, TKB).

---

## 🔐 Security Considerations

### **Smart Contracts**
- ✅ **Reentrancy protection** – Uses checks-effects-interactions pattern
- ✅ **Integer overflow protection** – Solidity 0.8.x built-in
- ✅ **Access control** – Owner-only functions where needed
- ✅ **Input validation** – Checks for zero amounts and deadlines
- ✅ **Slippage protection** – User-defined minimum output

### **Frontend**
- ✅ **Transaction validation** – Client-side checks before submission
- ✅ **Error handling** – User-friendly error messages
- ✅ **No private key storage** – Uses MetaMask for signing
- ✅ **RPC security** – Environment variable for sensitive data

### **⚠️ Important Notes**
- This project is for **educational and demonstration purposes**
- **No formal security audit** has been performed
- Uses **testnet tokens only** – not real money
- **Single pool implementation** – multi-pool support planned
- **No price oracle** – relies on pool reserves for pricing
- **Do not deploy to mainnet** without thorough review, audit, and additional safety features
- Smart contracts are **experimental** – use at your own risk

---

## 📊 Key Metrics & Formulas

### **Constant Product Formula**
```
x · y = k
```
Where `x` and `y` are token reserves, and `k` remains constant.

### **Swap Calculation**
```
amountOut = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
```
Includes 0.3% fee (997/1000).

### **Price Impact**
```
priceImpact = ((initialPrice - finalPrice) / initialPrice) × 100
```

### **Impermanent Loss**
```
IL = 2 × √(priceRatio) / (1 + priceRatio) - 1
```

---

## 🛣️ Roadmap & Future Enhancements

### **Phase 1: Core Features** ✅
- [x] Basic swap functionality
- [x] Liquidity provision
- [x] LP token mechanics
- [x] Frontend UI
- [x] Sepolia deployment

### **Phase 2: UI Enhancements** 🎨
- [ ] Toast notification system integration
- [ ] Token selector modal with search
- [ ] Settings panel (slippage, deadline, expert mode)
- [ ] Transaction preview modals
- [ ] Skeleton loading states
- [ ] Animated number transitions
- [ ] Chart integration for price history

### **Phase 3: Advanced DeFi Features** 🚧
- [ ] Multi-pool support (ETH/USDC, etc.)
- [ ] TWAP (Time-Weighted Average Price) oracle
- [ ] Protocol fee switch
- [ ] Governance token
- [ ] Flash swaps
- [ ] Multi-hop routing

### **Phase 4: Analytics & Optimization** 📊
- [ ] Historical price charts
- [ ] Volume tracking and analytics
- [ ] APR/APY calculations
- [ ] User transaction history
- [ ] Gas optimization
- [ ] Layer 2 deployment (Arbitrum/Optimism)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style
- Tests pass (`npx hardhat test`)
- Documentation is updated
- Commit messages are descriptive

---

## 🧠 Author

**Nilesh Barandwal**  
M.Tech Computer Science & Engineering  
Focus: Blockchain, Smart Contracts, Secure Systems, DeFi

### **Connect**
- GitHub: [@NileshBarandwal](https://github.com/NileshBarandwal)
- LinkedIn: [Nilesh Barandwal](https://www.linkedin.com/in/nilesh-barandwal-8403ab182/)

---

## Acknowledgments

- **Uniswap** – Inspiration for AMM design
- **OpenZeppelin** – Secure smart contract libraries
- **Hardhat** – Excellent development framework
- **Ethereum Community** – Comprehensive documentation

---

## ⭐ Show Your Support

If this project helped you learn about AMMs or DeFi development, please give it a star! ⭐

It helps others discover the project and motivates continued development.

---

**Built with ❤️ for the Ethereum community**

[🌐 Live Demo](https://amm-dex-orcin.vercel.app)
