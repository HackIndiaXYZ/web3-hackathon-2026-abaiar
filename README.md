<div align="center">

# 🔨 SkillForge

**去中心化技能认证与激励平台**

*基于 Polygon 区块链的链上技能凭证发行、验证与激励系统*



[![Polygon](https://img.shields.io/badge/Polygon-Amoy-8247E5?logo=polygon&logoColor=white)](https://polygon.technology/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Tests](https://img.shields.io/badge/Tests-41%2F41-brightgreen)](./contracts/test)

[English](./README_EN.md) | 中文

</div>

---

## 🎯 项目简介

SkillForge 是为 **Web3 Hackathon 2026 (HackIndia)** 打造的去中心化技能认证平台，创新性地融合了赛事的两个问题声明：

> **Problem Statement 2** — Skills On-Chain：在 Polygon 链上发行和验证技能凭证
> **Problem Statement 1** — Sharp Token Integration：即插即用的 Token 集成（Earn / Spend / Buy）

### ✨ 核心特性

| 特性 | 描述 |
|:-----|:-----|
| 🔒 **防篡改凭证** | 凭证以 SBT（Soulbound Token）形式上链，不可转让、不可伪造 |
| ⚡ **即时验证** | 任何人可实时验证凭证真伪，无需信任第三方 |
| 💰 **Token 激励** | Sharp Token 驱动生态闭环 — 发行/获得凭证即获奖励 |
| 📦 **TypeScript SDK** | 第三方 10 行代码内完成集成 |
| 🧩 **No-code Widget** | 一行 `<script>` 标签嵌入验证徽章 |

---

## 🏗️ 系统架构

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

## 📁 项目结构

```
skillforge/
├── 📂 contracts/                    # 智能合约 (Hardhat + Solidity)
│   ├── 📂 contracts/
│   │   ├── 📄 SkillRegistry.sol             # 凭证 SBT 注册表 (ERC-721 + ERC-5192)
│   │   ├── 📄 SharpTokenIntegrator.sol      # Token 集成层 (Earn/Spend/Buy)
│   │   ├── 📄 MockSharpToken.sol            # 测试用 ERC-20 Token
│   │   └── 📂 interfaces/                  # 合约接口定义
│   ├── 📂 test/                             # 41 个测试用例
│   └── 📂 scripts/
│       └── 📄 deploy.ts                     # 一键部署脚本
│
├── 📂 apps/
│   └── 📂 web/                      # DApp 前端 (Next.js + RainbowKit + Wagmi)
│       └── 📂 src/app/
│           ├── 📄 page.tsx                  # 🏠 首页
│           ├── 📂 issuer/register/          # 📋 Issuer 注册
│           ├── 📂 issuer/dashboard/         # 📊 Issuer 仪表盘
│           ├── 📂 verify/                   # ✅ 凭证验证
│           ├── 📂 profile/                  # 👤 用户凭证集
│           └── 📂 tokens/                   # 💎 Token 管理
│
├── 📂 packages/
│   ├── 📂 sdk/                      # @skillforge/sdk — TypeScript SDK
│   └── 📂 widget/                   # @skillforge/widget — No-code 嵌入组件
│
└── 📄 pnpm-workspace.yaml           # Monorepo 配置
```

---

## 🛠️ 技术栈

| 分类 | 技术 | 说明 |
|:-----|:-----|:-----|
| 区块链 | ![Polygon](https://img.shields.io/badge/Polygon-PoS-8247E5?logo=polygon&logoColor=white) | Amoy 测试网 → 主网，低 Gas、高 TPS |
| 智能合约 | ![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?logo=solidity) | EVM 标准语言 |
| 合约框架 | Hardhat | 编译、测试、部署一体化 |
| 前端 | ![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js) + TailwindCSS | SSR + API 一体化 |
| 钱包连接 | RainbowKit + Wagmi v3 | 开箱即用的多钱包支持 |
| 链上交互 | Viem v2 | 类型安全、轻量级 |
| SDK | TypeScript + tsup | CJS + ESM 双格式输出 |
| 包管理 | pnpm (Monorepo) | 工作区管理 |

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18
- **pnpm** >= 8
- **MetaMask** 或其他 Web3 钱包

### 安装

```bash
# 克隆项目
git clone https://github.com/<your-username>/Web3.git
cd Web3

# 安装依赖
pnpm install

# 批准构建脚本
pnpm approve-builds esbuild keccak secp256k1 sharp unrs-resolver
```

### 编译 & 测试合约

```bash
cd contracts

# 编译
npx hardhat compile

# 运行测试（41 个用例）
npx hardhat test
```

### 启动前端

```bash
cd apps/web
pnpm dev
```

访问 **http://localhost:3000**

### 构建 SDK & Widget

```bash
# SDK
cd packages/sdk && pnpm build

# Widget
cd packages/widget && pnpm build
```

---

## 🌐 部署指南

### Step 1：配置环境变量

```bash
cp contracts/.env.example contracts/.env
```

编辑 `contracts/.env`：

```env
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=你的部署钱包私钥
POLYGONSCAN_API_KEY=你的Polygonscan API密钥
```

### Step 2：部署合约

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network amoy
```

部署完成后，终端会输出三个合约地址，请记录。

### Step 3：配置前端

编辑 `apps/web/.env.local`：

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=你的WalletConnect项目ID
NEXT_PUBLIC_CONTRACT_SKILL_REGISTRY=0x...    # Step 2 输出
NEXT_PUBLIC_CONTRACT_SHARP_INTEGRATOR=0x...  # Step 2 输出
NEXT_PUBLIC_CONTRACT_SHARP_TOKEN=0x...       # Step 2 输出
```

### Step 4：获取测试网 MATIC

前往 [Polygon Amoy Faucet](https://faucet.polygon.technology/) 领取测试 MATIC。

---

## 📜 智能合约

### SkillRegistry — 凭证注册表

基于 ERC-721 + ERC-5192 的 Soulbound Token，凭证不可转让。

| 方法 | 类型 | 说明 |
|:-----|:-----|:-----|
| `registerIssuer(metadataCID)` | Write | 注册为凭证发行方 |
| `deregisterIssuer(address)` | Write | 注销发行方（仅 Owner） |
| `createTemplate(name, desc, uri)` | Write | 创建凭证模板 |
| `deactivateTemplate(id)` | Write | 停用模板 |
| `issueCredential(to, templateId, expiresAt, uri)` | Write | 颁发凭证 SBT + Token 奖励 |
| `revokeCredential(tokenId)` | Write | 撤销凭证 |
| `verifyCredential(tokenId)` | View | 验证凭证 → `(isValid, reason)` |
| `getCredentialsByAddress(addr)` | View | 查询地址持有的凭证 ID 列表 |
| `locked(tokenId)` | View | SBT 锁定状态（始终返回 true） |

### SharpTokenIntegrator — Token 集成层

| 方法 | 类型 | 说明 |
|:-----|:-----|:-----|
| `earnTokens(to, amount, reason)` | Write | 铸造 Token（仅 SkillRegistry / Owner） |
| `spendTokens(from, amount, purpose)` | Write | 销毁 Token（需事先授权） |
| `buyTokens()` | Payable | 用 MATIC 购买 Token |

**奖励机制：**

| 行为 | 奖励 |
|:-----|:-----|
| 发行凭证（Issuer） | +10 SHARP |
| 获得凭证（User） | +5 SHARP |
| 购买兑换 | 1 MATIC = 100 SHARP |

---

## 📦 SDK 集成

### 安装

```bash
npm install @skillforge/sdk
```

### 只读操作

```typescript
import { SkillForge } from "@skillforge/sdk";

const client = new SkillForge({
  skillRegistryAddress: "0x...",
  sharpTokenIntegratorAddress: "0x...",
  sharpTokenAddress: "0x...",
});

// 验证凭证
const { isValid, reason } = await client.verifyCredential(BigInt(0));

// 查询用户凭证
const ids = await client.getCredentialsByAddress("0x...");

// 查询 Token 余额
const balance = await client.getTokenBalance("0x...");
```

### 写入操作

```typescript
import { createWalletClient, custom } from "viem";

const walletClient = createWalletClient({
  transport: custom(window.ethereum),
});

const client = new SkillForge(config, walletClient);

// 注册 Issuer
await client.registerIssuer("ipfs://Qm...");

// 发行凭证
await client.issueCredential("0x...", BigInt(0), BigInt(0), "ipfs://Qm...");

// 购买 Token
await client.buyTokens(parseEther("0.01"));
```

---

## 🧩 Widget 嵌入

### 方式一：JavaScript API

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

### 方式二：声明式 No-code

```html
<div id="badge-container"
     data-skillforge-badge="0"
     data-skillforge-registry="0x...">
</div>
<script src="https://unpkg.com/@skillforge/widget/dist/index.mjs"></script>
<!-- 自动渲染验证徽章 -->
```

---

## ✅ 测试覆盖

### 智能合约 — 41/41 通过

| 模块 | 用例数 | 状态 |
|:-----|:------|:-----|
| Issuer 注册 / 注销 | 5 | ✅ |
| 模板创建 / 停用 | 4 | ✅ |
| 凭证发行（含 Token 奖励） | 7 | ✅ |
| 凭证撤销 | 3 | ✅ |
| 凭证验证（有效 / 撤销 / 过期 / 停用） | 5 | ✅ |
| SBT 不可转让 | 4 | ✅ |
| Token Earn | 4 | ✅ |
| Token Spend | 3 | ✅ |
| Token Buy | 2 | ✅ |
| Admin 函数 | 4 | ✅ |

### 前端 — 6/6 页面正常

| 页面 | 路由 | 状态 |
|:-----|:-----|:-----|
| 首页 | `/` | ✅ |
| Issuer 注册 | `/issuer/register` | ✅ |
| Issuer 仪表盘 | `/issuer/dashboard` | ✅ |
| 凭证验证 | `/verify` | ✅ |
| 用户凭证集 | `/profile` | ✅ |
| Token 管理 | `/tokens` | ✅ |

### SDK & Widget 构建

| 包 | CJS | ESM | 类型声明 | 状态 |
|:---|:----|:----|:--------|:-----|
| @skillforge/sdk | 8.52 KB | 7.34 KB | 4.57 KB | ✅ |
| @skillforge/widget | 4.05 KB | 2.96 KB | 462 B | ✅ |

---

## ⚠️ 注意事项

1. **合约地址**：部署后必须将地址填入 `apps/web/.env.local`，否则前端无法与链上交互
2. **WalletConnect**：需在 [WalletConnect Cloud](https://cloud.walletconnect.com/) 注册获取 Project ID
3. **测试网 MATIC**：所有链上操作需要 Amoy 测试网 MATIC
4. **Sharp Token**：当前使用 MockSharpToken，赛事提供正式合约后可通过 `ISharpToken` 接口无缝替换
5. **Node.js**：Hardhat 官方支持 18-22，更高版本可能显示警告但不影响功能

---

## 🏆 赛事信息

| 项目 | 详情 |
|:-----|:-----|
| 赛事 | Web3 Hackathon 2026 by HackIndia |
| 问题声明 | Problem Statement 1 + Problem Statement 2 |
| 区块链 | Polygon |
| 提交截止 | 2026 年 6 月 15 日 17:30 IST |
| 最终展示 | 2026 年 6 月 28 日 |

---

## 📄 许可证

[MIT License](./LICENSE)

---

<div align="center">

**Built with ❤️ for Web3 Hackathon 2026**

</div>
