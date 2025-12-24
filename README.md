# AMM DEX – Uniswap-like Automated Market Maker

This project implements a **simplified Uniswap-style Automated Market Maker (AMM)** decentralized exchange on Ethereum.  
It supports **liquidity pools**, **LP tokens**, and **token swaps** using the constant product formula:

x · y = k

The goal of this project is to demonstrate a clear understanding of AMM design, smart contract development, testing, and user interaction using modern Ethereum tooling.

---

## ✨ Features (Planned)

- Liquidity pools for ERC20 token pairs  
- LP token minting and burning  
- Token swaps using the constant product AMM formula  
- Swap fee mechanism (Uniswap v2 style)  
- Slippage protection  
- Comprehensive Hardhat tests  
- CLI or frontend interface using Ethers.js  

---

## 🧰 Tech Stack

- **Solidity** – Smart contract development  
- **Hardhat v3** – Ethereum development framework  
- **Ethers.js** – Contract interaction and scripting  
- **TypeScript** – Type-safe development  
- **Mocha + Chai** – Testing framework  
- **Node.js (LTS)** – Runtime environment  
- **MetaMask** – Wallet integration (later stage)  

---

## 📋 Prerequisites

Before starting, ensure you have:

- Git  
- A terminal (macOS / Linux / Windows)  
- MetaMask browser extension (for later interaction)  

> ⚠️ This project uses **Hardhat v3**, which requires **Node.js ≥ 22 (LTS)**.

---

## 🔧 Environment Setup

### 1️⃣ Install Node Version Manager (nvm)

`nvm` is used to manage Node.js versions without affecting the system installation.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Restart your terminal, then verify:

```bash
nvm --version
```

### 2️⃣ Install and Use Node.js (LTS)

```bash
nvm install 22
nvm use 22
```

Verify
```bash
node -v
npm -v
```

### 📁 Project Setup
### 3️⃣ Clone the Repository

```bash
mkdir amm-dex
cd amm-dex
```

### 4️⃣ Install Dependencies
```bash
npm install
```

## 📦 Project Setup

This project comes preconfigured with the following tools and libraries for Ethereum smart contract development and testing:

### 🛠️ Included Dependencies

- **Hardhat v3** – Development environment for compiling, deploying, and testing smart contracts
- **Ethers.js** – Library for interacting with the Ethereum blockchain
- **Mocha & Chai** – Testing frameworks for writing and running smart contract tests
- **TypeScript** – Strongly typed JavaScript for safer and more scalable code
- **OpenZeppelin Contracts** – Standard, audited smart contract libraries (used later in the project)

These dependencies provide a solid foundation for building, testing, and deploying secure Ethereum smart contracts.

## 🏗️ Hardhat Project Structure

After completing the setup, the project directory is organized as follows:

```text
amm-dex/
├── contracts/          # Solidity smart contracts
├── test/               # Hardhat test files
├── scripts/            # Deployment and interaction scripts
├── ignition/           # Hardhat Ignition deployment configurations
├── hardhat.config.ts   # Hardhat configuration file
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```
