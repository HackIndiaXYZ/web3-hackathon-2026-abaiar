<div align="center">

# 🔨 SkillForge

**Decentralized Skill Certification & Incentive Platform**

*On-chain skill credential issuance, verification, and incentive system built on Polygon*

[![Polygon](https://img.shields.io/badge/Polygon-Amoy-8247E5?logo=polygon&logoColor=white)](https://polygon.technology/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Tests](https://img.shields.io/badge/Tests-41%2F41-brightgreen)](./contracts/test)

English | [中文](./README.md)

</div>

---

## 🎯 Overview

SkillForge is a decentralized skill certification platform built for the **Web3 Hackathon 2026 (HackIndia)**, innovatively combining both problem statements:

> **Problem Statement 2** — Skills On-Chain: Issue and verify skill credentials on Polygon blockchain
> **Problem Statement 1** — Sharp Token Integration: Plug-and-play token integration (Earn / Spend / Buy)

### ✨ Key Features

| Feature | Description |
|:--------|:------------|
| 🔒 **Tamper-Proof Credentials** | Credentials issued as SBTs (Soulbound Tokens) — non-transferable, unforgeable |
| ⚡ **Instant Verification** | Anyone can verify credentials in real-time, no trusted third party needed |
| 💰 **Token Incentives** | Sharp Token drives the ecosystem — earn rewards for issuing/receiving credentials |
| 📦 **TypeScript SDK** | Third-party integration in under 10 lines of code |
| 🧩 **No-code Widget** | Embed verification badge with a single `<script>` tag |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│   DApp (Next.js)  │  SDK (Third-party)  │  Widget (Embed)│
├─────────────────────────────────────────────────────────┤
│                     API Layer                            │
│            Next.js API Routes + tRPC                     │
├─────────────────────────────────────────────────────────┤
│                   Service Layer                          │
│      Credential Service  │  Token Service  │  Auth       │
├─────────────────────────────────────────────────────────┤
│                    Data Layer                            │
│   Polygon Blockchain  │  IPFS (Pinata)  │  PostgreSQL    │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
skillforge/
├── 📂 contracts/                    # Smart Contracts (Hardhat + Solidity)
│   ├── 📂 contracts/
│   │   ├── 📄 SkillRegistry.sol             # Credential SBT Registry (ERC-721 + ERC-5192)
│   │   ├── 📄 SharpTokenIntegrator.sol      # Token Integration Layer (Earn/Spend/Buy)
│   │   ├── 📄 MockSharpToken.sol            # Test ERC-20 Token
│   │   └── 📂 interfaces/                  # Contract Interfaces
│   ├── 📂 test/                             # 41 Test Cases
│   └── 📂 scripts/
│       └── 📄 deploy.ts                     # One-command Deployment Script
│
├── 📂 apps/
│   └── 📂 web/                      # DApp Frontend (Next.js + RainbowKit + Wagmi)
│       └── 📂 src/app/
│           ├── 📄 page.tsx                  # 🏠 Landing Page
│           ├── 📂 issuer/register/          # 📋 Issuer Registration
│           ├── 📂 issuer/dashboard/         # 📊 Issuer Dashboard
│           ├── 📂 verify/                   # ✅ Credential Verification
│           ├── 📂 profile/                  # 👤 User Credentials
│           └── 📂 tokens/                   # 💎 Token Management
│
├── 📂 packages/
│   ├── 📂 sdk/                      # @skillforge/sdk — TypeScript SDK
│   └── 📂 widget/                   # @skillforge/widget — No-code Embed Component
│
├── 📂 docs/                         # Project Documentation
└── 📄 pnpm-workspace.yaml           # Monorepo Configuration
```

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|:---------|:-----------|:------------|
| Blockchain | ![Polygon](https://img.shields.io/badge/Polygon-PoS-8247E5?logo=polygon&logoColor=white) | Amoy Testnet → Mainnet, low gas, high TPS |
| Smart Contracts | ![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?logo=solidity) | EVM standard language |
| Contract Framework | Hardhat | Compile, test, and deploy in one toolchain |
| Frontend | ![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js) + TailwindCSS | SSR + API in one framework |
| Wallet Connection | RainbowKit + Wagmi v3 | Out-of-the-box multi-wallet support |
| On-chain Interaction | Viem v2 | Type-safe, lightweight |
| SDK | TypeScript + tsup | CJS + ESM dual format output |
| Package Manager | pnpm (Monorepo) | Workspace management |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8
- **MetaMask** or other Web3 wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/Web3.git
cd Web3

# Install dependencies
pnpm install

# Approve build scripts
pnpm approve-builds esbuild keccak secp256k1 sharp unrs-resolver
```

### Compile & Test Contracts

```bash
cd contracts

# Compile
npx hardhat compile

# Run tests (41 test cases)
npx hardhat test
```

### Start Frontend

```bash
cd apps/web
pnpm dev
```

Visit **http://localhost:3000**

### Build SDK & Widget

```bash
# SDK
cd packages/sdk && pnpm build

# Widget
cd packages/widget && pnpm build
```

---

## 🌐 Deployment Guide

### Step 1: Configure Environment Variables

```bash
cp contracts/.env.example contracts/.env
```

Edit `contracts/.env`:

```env
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your_deployer_wallet_private_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### Step 2: Deploy Contracts

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network amoy
```

After deployment, the terminal will output three contract addresses — record them.

### Step 3: Configure Frontend

Edit `apps/web/.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_CONTRACT_SKILL_REGISTRY=0x...    # From Step 2
NEXT_PUBLIC_CONTRACT_SHARP_INTEGRATOR=0x...  # From Step 2
NEXT_PUBLIC_CONTRACT_SHARP_TOKEN=0x...       # From Step 2
```

### Step 4: Get Testnet MATIC

Visit the [Polygon Amoy Faucet](https://faucet.polygon.technology/) to get test MATIC.

---

## 📜 Smart Contracts

### SkillRegistry — Credential Registry

Based on ERC-721 + ERC-5192 Soulbound Token — credentials are non-transferable.

| Method | Type | Description |
|:-------|:-----|:------------|
| `registerIssuer(metadataCID)` | Write | Register as a credential issuer |
| `deregisterIssuer(address)` | Write | Deregister an issuer (Owner only) |
| `createTemplate(name, desc, uri)` | Write | Create a credential template |
| `deactivateTemplate(id)` | Write | Deactivate a template |
| `issueCredential(to, templateId, expiresAt, uri)` | Write | Issue a credential SBT + Token reward |
| `revokeCredential(tokenId)` | Write | Revoke a credential |
| `verifyCredential(tokenId)` | View | Verify credential → `(isValid, reason)` |
| `getCredentialsByAddress(addr)` | View | Get credential IDs held by an address |
| `locked(tokenId)` | View | SBT lock status (always returns true) |

### SharpTokenIntegrator — Token Integration Layer

| Method | Type | Description |
|:-------|:-----|:------------|
| `earnTokens(to, amount, reason)` | Write | Mint tokens (SkillRegistry / Owner only) |
| `spendTokens(from, amount, purpose)` | Write | Burn tokens (requires prior allowance) |
| `buyTokens()` | Payable | Buy tokens with MATIC |

**Reward Mechanism:**

| Action | Reward |
|:-------|:-------|
| Issue credential (Issuer) | +10 SHARP |
| Receive credential (User) | +5 SHARP |
| Purchase exchange | 1 MATIC = 100 SHARP |

---

## 📦 SDK Integration

### Install

```bash
npm install @skillforge/sdk
```

### Read Operations

```typescript
import { SkillForge } from "@skillforge/sdk";

const client = new SkillForge({
  skillRegistryAddress: "0x...",
  sharpTokenIntegratorAddress: "0x...",
  sharpTokenAddress: "0x...",
});

// Verify a credential
const { isValid, reason } = await client.verifyCredential(BigInt(0));

// Get user credentials
const ids = await client.getCredentialsByAddress("0x...");

// Get token balance
const balance = await client.getTokenBalance("0x...");
```

### Write Operations

```typescript
import { createWalletClient, custom } from "viem";

const walletClient = createWalletClient({
  transport: custom(window.ethereum),
});

const client = new SkillForge(config, walletClient);

// Register as Issuer
await client.registerIssuer("ipfs://Qm...");

// Issue a credential
await client.issueCredential("0x...", BigInt(0), BigInt(0), "ipfs://Qm...");

// Buy tokens
await client.buyTokens(parseEther("0.01"));
```

---

## 🧩 Widget Embed

### Method 1: JavaScript API

```html
<div id="badge-container"></div>
<script src="https://unpkg.com/@skillforge/widget/dist/index.mjs"></script>
<script>
  SkillForge.renderBadge({
    skillRegistryAddress: "0x...",
    tokenId: BigInt(0),
    containerId: "badge-container",
  });
</script>
```

### Method 2: Declarative No-code

```html
<div id="badge-container"
     data-skillforge-badge="0"
     data-skillforge-registry="0x...">
</div>
<script src="https://unpkg.com/@skillforge/widget/dist/index.mjs"></script>
<!-- Verification badge renders automatically -->
```

---

## ✅ Test Coverage

### Smart Contracts — 41/41 Passed

| Module | Tests | Status |
|:-------|:------|:-------|
| Issuer Registration / Deregistration | 5 | ✅ |
| Template Creation / Deactivation | 4 | ✅ |
| Credential Issuance (with Token rewards) | 7 | ✅ |
| Credential Revocation | 3 | ✅ |
| Credential Verification (valid / revoked / expired / deactivated) | 5 | ✅ |
| SBT Non-Transferability | 4 | ✅ |
| Token Earn | 4 | ✅ |
| Token Spend | 3 | ✅ |
| Token Buy | 2 | ✅ |
| Admin Functions | 4 | ✅ |

### Frontend — 6/6 Pages OK

| Page | Route | Status |
|:-----|:------|:-------|
| Landing | `/` | ✅ |
| Issuer Registration | `/issuer/register` | ✅ |
| Issuer Dashboard | `/issuer/dashboard` | ✅ |
| Credential Verification | `/verify` | ✅ |
| User Credentials | `/profile` | ✅ |
| Token Management | `/tokens` | ✅ |

### SDK & Widget Build

| Package | CJS | ESM | Types | Status |
|:--------|:----|:----|:------|:-------|
| @skillforge/sdk | 8.52 KB | 7.34 KB | 4.57 KB | ✅ |
| @skillforge/widget | 4.05 KB | 2.96 KB | 462 B | ✅ |

---

## ⚠️ Important Notes

1. **Contract Addresses**: Must be configured in `apps/web/.env.local` after deployment, otherwise the frontend cannot interact with the blockchain
2. **WalletConnect**: Register at [WalletConnect Cloud](https://cloud.walletconnect.com/) to obtain a Project ID
3. **Testnet MATIC**: All on-chain operations require Amoy testnet MATIC
4. **Sharp Token**: Currently using MockSharpToken. When the hackathon provides an official contract, it can be seamlessly replaced via the `ISharpToken` interface
5. **Node.js**: Hardhat officially supports v18-22. Higher versions may show warnings but function normally

---

## 🏆 Hackathon Info

| Item | Details |
|:-----|:--------|
| Event | Web3 Hackathon 2026 by HackIndia |
| Problem Statements | Problem Statement 1 + Problem Statement 2 |
| Blockchain | Polygon |
| Submission Deadline | June 15, 2026, 5:30 PM IST |
| Final Showdown | June 28, 2026 |

---

## 📄 License

[MIT License](./LICENSE)

---

<div align="center">

**Built with ❤️ for Web3 Hackathon 2026**

</div>
