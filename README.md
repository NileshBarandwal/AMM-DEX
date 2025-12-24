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
