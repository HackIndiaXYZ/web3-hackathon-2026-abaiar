# SkillForge — 项目框架路线文档

> **文档版本：** v1.0
> **创建日期：** 2026-06-06
> **项目赛道：** Web3 Hackathon 2026 by HackIndia
> **问题声明：** Problem Statement 2 (Skills On-Chain) + Problem Statement 1 (Sharp Token Integration)

---

## 目录

1. [项目背景与目标](#1-项目背景与目标)
2. [核心架构设计](#2-核心架构设计)
3. [技术栈选型](#3-技术栈选型)
4. [模块划分](#4-模块划分)
5. [智能合约设计](#5-智能合约设计)
6. [开发流程规范](#6-开发流程规范)
7. [质量保障策略](#7-质量保障策略)
8. [进度里程碑](#8-进度里程碑)
9. [资源分配计划](#9-资源分配计划)
10. [风险评估与应对措施](#10-风险评估与应对措施)
11. [演示方案](#11-演示方案)
12. [附录](#12-附录)

---

## 1. 项目背景与目标

### 1.1 赛事背景

Web3 Hackathon 2026 由 HackIndia 主办，聚焦于区块链技术的实际应用落地。赛事由 Sharp Economy 提供问题声明，要求参赛者构建可扩展的去中心化应用。

**关键时间节点：**

| 事件 | 日期 |
|------|------|
| 黑客松开始 | 2026-05-01 |
| 项目提交截止 | 2026-06-15 17:30 IST |
| 最终展示 | 2026-06-28 |
| 结果公布 | 2026-06-30 |

### 1.2 问题分析

赛事提供两个问题声明，本项目选择**双问题融合方案**：

**Problem Statement 2（主轴）：Skills On-Chain Platform**
- 在区块链上发行和验证技能凭证
- 基于 Polygon 链存储与验证
- 支持第三方应用/网站集成
- 提供即时、无信任验证

**Problem Statement 1（激励层）：Plug-and-Play Sharp Token Integration**
- SDK / API / No-code 集成方案
- 支持 Earn / Spend / Buy Sharp Token
- 开发者友好的文档
- 可扩展、安全的基础设施

### 1.3 项目目标

**SkillForge** 是一个去中心化技能认证与激励平台，核心目标如下：

| 目标维度 | 描述 | 可衡量指标 |
|---------|------|-----------|
| 防篡改认证 | 凭证上链，不可伪造 | 链上凭证 100% 可验证 |
| 即时验证 | 无需人工介入的信任验证 | 验证响应 < 2s |
| 激励闭环 | Sharp Token 驱动生态参与 | Earn/Spend/Buy 全链路打通 |
| 极简集成 | 第三方零门槛接入 | SDK 集成 < 10 行代码 |
| 可扩展性 | 支持多机构、多凭证类型 | 合约支持无限模板注册 |

### 1.4 价值主张

```
传统认证痛点                    SkillForge 方案
─────────────────────────────────────────────────
证书易伪造                    → 链上凭证天然防篡改
验证成本高、周期长             → 即时链上验证
技能认证缺乏激励               → Sharp Token 奖励机制
凭证系统封闭、无法互通          → 开放协议 + SDK 集成
第三方接入门槛高               → No-code Widget 一行嵌入
```

---

## 2. 核心架构设计

### 2.1 系统架构总览

```
┌──────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐ │
│  │  DApp (Web)  │  │  SDK Users  │  │  No-code Widget      │ │
│  │  Next.js SPA │  │  Third-party│  │  <script> Embed      │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬───────────┘ │
│         │                │                     │             │
├─────────┼────────────────┼─────────────────────┼─────────────┤
│         │           API Gateway Layer           │             │
│  ┌──────┴────────────────┴─────────────────────┴───────────┐ │
│  │              Next.js API Routes / tRPC                   │ │
│  │     ┌──────────┐  ┌───────────┐  ┌────────────────┐    │ │
│  │     │ Auth API  │  │ Credential│  │ Sharp Token    │    │ │
│  │     │          │  │ API       │  │ API            │    │ │
│  │     └──────────┘  └───────────┘  └────────────────┘    │ │
│  └──────────┬──────────────┬────────────────┬──────────────┘ │
│             │              │                │                │
├─────────────┼──────────────┼────────────────┼────────────────┤
│             │        Service Layer          │                │
│  ┌──────────┴──┐  ┌───────┴───────┐  ┌─────┴──────────────┐ │
│  │  Auth       │  │  Credential   │  │  Token              │ │
│  │  Service    │  │  Service      │  │  Service            │ │
│  └──────┬──────┘  └───────┬───────┘  └─────┬──────────────┘ │
│         │                 │                 │                │
├─────────┼─────────────────┼─────────────────┼────────────────┤
│         │          Data Layer               │                │
│  ┌──────┴─────────────────┴─────────────────┴──────────────┐ │
│  │              Indexer / Event Processor                   │ │
│  │         (链上事件监听 → 数据库同步)                        │ │
│  └──────┬─────────────────┬────────────────┬───────────────┘ │
│         │                 │                │                 │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────────────┐  │
│  │  Neon       │  │  IPFS       │  │  Polygon            │  │
│  │  PostgreSQL │  │  (Pinata)   │  │  Blockchain         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 数据流架构

**凭证发行流程：**

```
Issuer → DApp UI → API Routes → Credential Service
                                        │
                          ┌─────────────┼─────────────┐
                          ▼             ▼             ▼
                    IPFS Upload   Contract Call   DB Index
                    (metadata)    (issue SBt)    (event sync)
                                        │
                                        ▼
                                  Sharp Token
                                  (earn reward)
```

**凭证验证流程：**

```
Verifier → SDK / Widget / DApp → API Routes → Verify Service
                                                    │
                                      ┌─────────────┼─────────────┐
                                      ▼             ▼             ▼
                                Contract Call   DB Lookup    Cache
                                (on-chain)     (indexed)    (Redis)
                                      │             │             │
                                      └─────────────┴─────────────┘
                                                    │
                                                    ▼
                                              Verification Result
```

### 2.3 合约交互架构

```
┌─────────────────────────────────────────────────┐
│              Polygon Blockchain                  │
│                                                  │
│  ┌──────────────┐      ┌──────────────────────┐ │
│  │ SkillRegistry │◄─────│ SharpTokenIntegrator │ │
│  │ (ERC-721/     │      │ (ISharpToken)        │ │
│  │  ERC-5192)    │      │                      │ │
│  │               │      │ - earnTokens()       │ │
│  │ - register    │      │ - spendTokens()      │ │
│  │   Issuer()    │      │ - buyTokens()        │ │
│  │ - create      │      └──────────────────────┘ │
│  │   Template()  │               │               │
│  │ - issue       │               │               │
│  │   Credential()│               │               │
│  │ - revoke      │               ▼               │
│  │   Credential()│      ┌──────────────────────┐ │
│  │ - verify      │      │ Sharp Token Contract │ │
│  │   Credential()│      │ (External / Mock)    │ │
│  └──────────────┘      └──────────────────────┘ │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 3. 技术栈选型

### 3.1 选型总表

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|---------|
| **区块链** | Polygon PoS | Amoy 测试网 → 主网 | 赛事明确要求；低 Gas、高 TPS、EVM 兼容 |
| **智能合约** | Solidity | 0.8.24+ | EVM 生态标准语言，工具链成熟 |
| **合约框架** | Foundry | latest | 编译速度快，Solidity 原生测试，内置模糊测试 |
| **前端框架** | Next.js | 14 (App Router) | SSR/SSG + API Routes 一体化，React 生态 |
| **钱包连接** | RainbowKit | v2 | 开箱即用 UI，多钱包支持 |
| **链上交互** | Wagmi | v2 | React Hooks 风格，TypeScript 优先 |
| **链上工具** | Viem | v2 | 轻量级替代 ethers.js，类型安全 |
| **样式方案** | TailwindCSS | v3.4 | 原子化 CSS，快速迭代 |
| **UI 组件** | shadcn/ui | latest | 可定制、无依赖、高质量组件 |
| **去中心化存储** | IPFS (Pinata) | API v2 | 凭证元数据/图片存储，Pinata 提供固定服务 |
| **数据库** | Neon PostgreSQL | Serverless | 链下索引，快速查询，Serverless 免运维 |
| **ORM** | Drizzle ORM | latest | TypeScript 优先，轻量级，Neon 原生支持 |
| **API 层** | tRPC | v11 | 端到端类型安全，与 Next.js 深度集成 |
| **SDK 构建** | tsup | latest | 零配置 TypeScript 库打包 |
| **包管理** | pnpm | v9 | Monorepo 友好，磁盘高效 |

### 3.2 选型决策记录

**Q: 为什么选择 Foundry 而非 Hardhat？**
A: Foundry 编译速度比 Hardhat 快 10x+，Solidity 原生测试无需切换语言，内置模糊测试和不变量测试对安全审计至关重要。黑客松时间紧迫，速度优先。

**Q: 为什么选择 Viem 而非 ethers.js？**
A: Viem 体积更小（tree-shakable），TypeScript 类型推导更完善，与 Wagmi v2 深度集成。ethers.js v6 虽有改进但包体积仍较大。

**Q: 为什么选择 Neon 而非 Supabase？**
A: Neon 提供 Serverless PostgreSQL，冷启动快，与 Drizzle ORM 集成良好。Supabase 虽功能更全但引入了不必要的抽象层。

**Q: Sharp Token 合约地址如何处理？**
A: 设计 `ISharpToken` 接口，部署时注入地址。若赛事未提供正式合约，则部署 Mock 合约用于演示，接口保持一致，后续可无缝替换。

---

## 4. 模块划分

### 4.1 Monorepo 结构

```
skillforge/
├── contracts/                  # 智能合约 (Foundry)
│   ├── src/
│   │   ├── SkillRegistry.sol
│   │   ├── SharpTokenIntegrator.sol
│   │   ├── interfaces/
│   │   │   ├── ISkillRegistry.sol
│   │   │   ├── ISharpToken.sol
│   │   │   └── IERC5192.sol
│   │   └── libraries/
│   │       └── CredentialLib.sol
│   ├── test/
│   │   ├── SkillRegistry.t.sol
│   │   ├── SharpTokenIntegrator.t.sol
│   │   └── integration/
│   │       └── FullFlow.t.sol
│   ├── script/
│   │   ├── Deploy.s.sol
│   │   └── Upgrade.s.sol
│   └── foundry.toml
│
├── apps/
│   └── web/                    # DApp 前端 (Next.js)
│       ├── src/
│       │   ├── app/            # App Router 页面
│       │   │   ├── page.tsx                # 首页/Landing
│       │   │   ├── issuer/
│       │   │   │   ├── register/           # Issuer 注册
│       │   │   │   ├── dashboard/          # Issuer 仪表盘
│       │   │   │   └── credentials/        # 凭证管理
│       │   │   ├── credentials/
│       │   │   │   └── [id]/               # 凭证详情/验证
│       │   │   ├── verify/                 # 验证页面
│       │   │   ├── profile/                # 用户凭证集
│       │   │   └── api/                    # API Routes
│       │   │       ├── trpc/
│       │   │       └── webhooks/
│       │   ├── components/
│       │   │   ├── ui/                     # shadcn 组件
│       │   │   ├── credential/             # 凭证相关组件
│       │   │   ├── issuer/                 # Issuer 组件
│       │   │   └── shared/                 # 通用组件
│       │   ├── lib/
│       │   │   ├── wagmi.ts               # Wagmi 配置
│       │   │   ├── chains.ts              # 链配置
│       │   │   └── ipfs.ts                # IPFS 工具
│       │   └── hooks/                      # 自定义 Hooks
│       ├── public/
│       └── package.json
│
├── packages/
│   ├── sdk/                    # TypeScript SDK
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── skillforge.ts              # 主入口
│   │   │   ├── credential.ts              # 凭证 API
│   │   │   ├── token.ts                   # Token API
│   │   │   ├── verification.ts            # 验证 API
│   │   │   └── types.ts                   # 类型定义
│   │   └── package.json
│   │
│   └── widget/                 # No-code 嵌入组件
│       ├── src/
│       │   ├── index.ts
│       │   ├── badge.ts                   # 验证徽章组件
│       │   └── embed.ts                   # 嵌入脚本
│       └── package.json
│
├── docs/                       # 项目文档
│   ├── SKILLFORGE-PROJECT-ROADMAP.md
│   ├── api-reference.md
│   └── integration-guide.md
│
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

### 4.2 模块职责矩阵

| 模块 | 职责 | 对外接口 | 依赖 |
|------|------|---------|------|
| **contracts** | 链上逻辑：凭证发行/验证/撤销、Token 集成 | 合约 ABI + 地址 | Polygon |
| **apps/web** | 用户界面：Issuer Dashboard、凭证展示、验证页 | HTTP (SSR) | contracts, packages/sdk |
| **packages/sdk** | 第三方集成：TypeScript API 封装 | npm 包 | contracts (ABI) |
| **packages/widget** | No-code 集成：嵌入式验证徽章 | `<script>` 标签 | packages/sdk |
| **docs** | 开发者文档：API 参考、集成指南 | Markdown | - |

### 4.3 模块间依赖关系

```
contracts ──────► apps/web
     │               │
     │               ▼
     └───────► packages/sdk ──► packages/widget
                     │
                     ▼
               apps/web (also uses SDK internally)
```

---

## 5. 智能合约设计

### 5.1 合约清单

| 合约 | 标准 | 功能 |
|------|------|------|
| `SkillRegistry` | ERC-721 + ERC-5192 | 凭证 SBT 发行、验证、撤销 |
| `SharpTokenIntegrator` | 自定义 | Sharp Token 的 Earn/Spend/Buy 交互 |
| `MockSharpToken` | ERC-20 | 测试用 Mock Token（若赛事未提供合约） |

### 5.2 SkillRegistry 合约设计

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC5192} from "./interfaces/IERC5192.sol";

contract SkillRegistry is ERC721, IERC5192 {
    // ============ 状态变量 ============
    address public owner;
    uint256 public nextTokenId;
    uint256 public nextTemplateId;

    // Issuer 管理
    mapping(address => bool) public isIssuer;
    mapping(address => string) public issuerMetadataCID;
    address[] public issuerList;

    // 凭证模板
    struct CredentialTemplate {
        address issuer;
        string name;
        string description;
        string metadataURI;       // IPFS CID
        bool active;
        uint256 createdAt;
    }
    mapping(uint256 => CredentialTemplate) public templates;

    // 凭证数据
    struct CredentialData {
        uint256 templateId;
        address recipient;
        address issuer;
        uint256 issuedAt;
        uint256 expiresAt;        // 0 = 永不过期
        bool revoked;
        string tokenURI;          // IPFS CID
    }
    mapping(uint256 => CredentialData) public credentials;

    // SBT 锁定状态
    mapping(uint256 => bool) private _locked;

    // ============ 事件 ============
    event IssuerRegistered(address indexed issuer, string metadataCID);
    event TemplateCreated(uint256 indexed templateId, address indexed issuer, string name);
    event CredentialIssued(uint256 indexed tokenId, address indexed recipient, uint256 indexed templateId);
    event CredentialRevoked(uint256 indexed tokenId);
    event CredentialVerified(uint256 indexed tokenId, bool valid);

    // ============ 修饰符 ============
    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier onlyIssuer() { require(isIssuer[msg.sender], "Not issuer"); _; }

    // ============ 核心方法 ============
    function registerIssuer(string calldata metadataCID) external;
    function createTemplate(string calldata name, string calldata description, string calldata metadataURI) external onlyIssuer;
    function issueCredential(address to, uint256 templateId, uint256 expiresAt, string calldata tokenURI) external onlyIssuer;
    function revokeCredential(uint256 tokenId) external;
    function verifyCredential(uint256 tokenId) external view returns (bool isValid, string memory reason);

    // ============ ERC-5192 ============
    function locked(uint256 tokenId) external view returns (bool);

    // ============ 查询方法 ============
    function getCredentialsByAddress(address account) external view returns (uint256[] memory);
    function getTemplateCredentials(uint256 templateId) external view returns (uint256[] memory);
    function getIssuerCredentials(address issuer) external view returns (uint256[] memory);
}
```

### 5.3 SharpTokenIntegrator 合约设计

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISharpToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SharpTokenIntegrator {
    ISharpToken public sharpToken;
    address public owner;
    address public skillRegistry;

    // 奖励配置
    uint256 public issuerReward = 10 * 1e18;     // Issuer 发行凭证奖励
    uint256 public recipientReward = 5 * 1e18;   // 用户获得凭证奖励
    uint256 public verificationFee = 1 * 1e18;   // 第三方验证费用

    // ============ 核心方法 ============
    function earnTokens(address to, uint256 amount, string calldata reason) external;
    function spendTokens(address from, uint256 amount, string calldata purpose) external;
    function buyTokens() external payable;

    // ============ 回调方法（由 SkillRegistry 调用）============
    function onCredentialIssued(address issuer, address recipient) external;
    function onVerificationRequested(address payer) external;
}
```

### 5.4 合约安全策略

| 策略 | 实施方式 |
|------|---------|
| 重入攻击防护 | OpenZeppelin ReentrancyGuard |
| 整数溢出 | Solidity 0.8.x 内置检查 |
| 权限控制 | Ownable + 自定义 onlyIssuer 修饰符 |
| SBT 不可转让 | ERC-5192 locked 标准，重写 transferFrom |
| 紧急暂停 | Pausable 模式 |
| 升级策略 | 代理模式（若需要），优先不可升级设计 |

---

## 6. 开发流程规范

### 6.1 Git 工作流

```
main (受保护)
  │
  ├── develop (日常开发基准)
  │     │
  │     ├── feature/credential-issuance
  │     ├── feature/sdk-core
  │     ├── feature/widget-badge
  │     └── fix/verification-bug
  │
  └── release/v1.0 (提交版本)
```

**分支命名规范：**
- `feature/<模块>-<功能>` — 新功能
- `fix/<模块>-<描述>` — Bug 修复
- `refactor/<模块>-<描述>` — 重构

**Commit 规范：**
```
<type>(<scope>): <subject>

type: feat | fix | docs | style | refactor | test | chore
scope: contract | web | sdk | widget | docs
```

### 6.2 代码审查流程

1. 开发者创建 Feature Branch → 完成开发 → 自测通过
2. 提交 PR 到 develop，填写 PR Template
3. 代码审查（至少 1 人 Approve）
4. CI 检查通过（Lint + Test + Build）
5. 合并到 develop

### 6.3 环境管理

| 环境 | 用途 | 链 | 数据库 |
|------|------|-----|--------|
| Local | 本地开发 | Hardhat/Anvil 本地链 | 本地 PostgreSQL |
| Staging | 集成测试 | Polygon Amoy 测试网 | Neon Dev 分支 |
| Production | 演示/提交 | Polygon Amoy 测试网 | Neon Production |

### 6.4 配置管理

```env
# .env.example
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=                          # 部署私钥（仅CI）
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_CONTRACT_SKILL_REGISTRY=
NEXT_PUBLIC_CONTRACT_SHARP_INTEGRATOR=
NEXT_PUBLIC_CONTRACT_SHARP_TOKEN=
PINATA_JWT=
NEON_DATABASE_URL=
NEON_DATABASE_URL_DIRECT=
```

---

## 7. 质量保障策略

### 7.1 测试策略

| 测试层级 | 工具 | 覆盖目标 | 最低覆盖率 |
|---------|------|---------|-----------|
| 合约单元测试 | Foundry (Forge) | 每个合约方法 | 90% |
| 合约集成测试 | Foundry (Forge) | 跨合约交互流程 | 关键路径 100% |
| 前端单元测试 | Vitest | Hooks / 工具函数 | 80% |
| 前端组件测试 | React Testing Library | 组件渲染/交互 | 关键组件 |
| E2E 测试 | Playwright | 核心用户流程 | 主流程覆盖 |
| SDK 测试 | Vitest | API 封装正确性 | 90% |

### 7.2 合约测试清单

```
SkillRegistry
├── Issuer 注册
│   ├── 正常注册
│   ├── 重复注册（应 revert）
│   └── 元数据 CID 存储
├── 模板创建
│   ├── 正常创建
│   ├── 非 Issuer 创建（应 revert）
│   └── 模板激活/停用
├── 凭证发行
│   ├── 正常发行 + Token 奖励
│   ├── 非 Issuer 发行（应 revert）
│   ├── 过期时间校验
│   └── 批量发行
├── 凭证撤销
│   ├── Issuer 撤销自己的凭证
│   ├── 非 Issuer 撤销（应 revert）
│   └── 已撤销凭证再次撤销
├── 凭证验证
│   ├── 有效凭证验证
│   ├── 已撤销凭证验证
│   ├── 已过期凭证验证
│   └── 不存在凭证验证
└── SBT 不可转让
    ├── transferFrom 应 revert
    └── locked() 返回 true
```

### 7.3 CI/CD 流水线

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  contract-test:
    - forge build
    - forge test --summary
    - forge coverage

  web-lint-test:
    - pnpm install
    - pnpm --filter web lint
    - pnpm --filter web test
    - pnpm --filter web build

  sdk-test:
    - pnpm install
    - pnpm --filter @skillforge/sdk test
    - pnpm --filter @skillforge/sdk build
```

### 7.4 安全审计要点

- [ ] 所有外部调用使用 Checks-Effects-Interactions 模式
- [ ] 无未初始化的代理合约
- [ ] 所有权限修饰符正确应用
- [ ] 无硬编码的私钥或敏感信息
- [ ] 合约部署前通过 Slither 静态分析
- [ ] 关键函数添加事件日志

---

## 8. 进度里程碑

### 8.1 里程碑总览

```
Week 1        Week 2        Week 3        Week 4        Week 5        Week 6
│             │             │             │             │             │
├─ M1: 合约   ├─ M2: 合约   ├─ M3: DApp   ├─ M4: DApp   ├─ M5: SDK    ├─ M6: 提交
│  开发        │  完成+部署   │  骨架+核心   │  完善        │  + Widget   │  + 演示
│             │             │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
     Phase 1        Phase 1        Phase 2        Phase 2        Phase 3     Phase 4
```

### 8.2 详细里程碑

#### M1: 合约开发（Week 1, 5月1日-5月7日）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| SkillRegistry 合约编写 | `SkillRegistry.sol` | 编译通过，核心方法实现 |
| SharpTokenIntegrator 合约编写 | `SharpTokenIntegrator.sol` | 编译通过，接口定义完整 |
| MockSharpToken 合约编写 | `MockSharpToken.sol` | ERC-20 标准，mint/burn 可用 |
| 单元测试编写 | `*.t.sol` | 覆盖率 > 80% |

#### M2: 合约完成 + 部署（Week 2, 5月8日-5月14日）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 集成测试编写 | `FullFlow.t.sol` | 发行→验证→撤销全流程通过 |
| 合约安全检查 | Slither 报告 | 无 High/Medium 漏洞 |
| 部署到 Amoy 测试网 | 合约地址 | 合约可交互，Polygonscan 验证 |
| 部署脚本 | `Deploy.s.sol` | 可重复部署 |

#### M3: DApp 骨架 + 核心功能（Week 3, 5月15日-5月21日）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| Next.js 项目初始化 | 项目骨架 | pnpm dev 可启动 |
| 钱包连接 | RainbowKit 集成 | 可连接 MetaMask |
| Issuer 注册页面 | `/issuer/register` | 可注册 Issuer |
| 凭证发行页面 | `/issuer/credentials` | 可发行凭证 |
| IPFS 上传集成 | Pinata 工具 | 元数据可上传 |

#### M4: DApp 完善（Week 4, 5月22日-5月28日）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 凭证验证页面 | `/verify` | 输入 ID 即可验证 |
| 用户凭证集 | `/profile` | 展示用户所有凭证 |
| 数据库索引 | Neon + Drizzle | 凭证数据可快速查询 |
| Sharp Token 展示 | Token 余额/交易 | Earn/Spend 可用 |
| UI 打磨 | 响应式设计 | 移动端适配 |

#### M5: SDK + Widget（Week 5, 5月29日-6月4日）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| SDK 核心封装 | `@skillforge/sdk` | issue/verify/earn/spend API |
| SDK 测试 | 单元测试 | 覆盖率 > 90% |
| React Hooks | `useCredentials` 等 | 可在 React 项目中使用 |
| No-code Widget | `@skillforge/widget` | 一行 `<script>` 可嵌入 |
| Demo 集成项目 | 示例 Next.js 项目 | 10 行代码内完成集成 |

#### M6: 提交 + 演示准备（Week 6, 6月5日-6月15日）

| 任务 | 交付物 | 验收标准 |
|------|--------|---------|
| 开发者文档 | API 参考 + 集成指南 | 第三方可按文档集成 |
| 演示视频 | 5 分钟演示 | 完整流程展示 |
| Bug 修复 | — | 无 P0/P1 Bug |
| 最终提交 | GitHub Repo + 视频 | 符合提交规范 |
| Landing Page | 首页优化 | 视觉冲击力 |

---

## 9. 资源分配计划

### 9.1 人员角色（假设 3 人团队）

| 角色 | 职责 | 主要工作阶段 |
|------|------|-------------|
| **合约工程师** | 智能合约开发、测试、部署、安全审计 | Phase 1 主力，Phase 3-4 协助 |
| **全栈工程师** | DApp 前端 + API + 数据库 | Phase 2 主力，Phase 1 协助 UI |
| **SDK/集成工程师** | SDK + Widget + 文档 + Demo | Phase 3 主力，Phase 2 协助 |

### 9.2 时间分配

```
Phase 1 (Week 1-2): 合约工程师 80% | 全栈 10% | SDK 10%
Phase 2 (Week 3-4): 合约工程师 20% | 全栈 70% | SDK 10%
Phase 3 (Week 5):   合约工程师 10% | 全栈 30% | SDK 60%
Phase 4 (Week 6):   合约工程师 20% | 全栈 40% | SDK 40%
```

### 9.3 外部资源

| 资源 | 用途 | 成本 |
|------|------|------|
| Polygon Amoy 测试网 | 合约部署测试 | 免费 |
| Pinata IPFS | 元数据存储 | 免费额度（1GB） |
| Neon PostgreSQL | 链下数据库 | 免费额度 |
| Vercel | DApp 部署 | 免费额度 |
| WalletConnect | 钱包连接 | 免费额度 |

---

## 10. 风险评估与应对措施

### 10.1 风险矩阵

| ID | 风险描述 | 概率 | 影响 | 等级 | 应对策略 |
|----|---------|------|------|------|---------|
| R1 | Sharp Token 合约未按时提供 | 高 | 高 | **严重** | 部署 MockSharpToken，接口保持一致，可热替换 |
| R2 | Polygon Amoy 测试网不稳定 | 中 | 中 | **中等** | 准备备选 RPC 节点；关键测试可在 Anvil 本地链完成 |
| R3 | IPFS/Pinata 服务中断 | 低 | 中 | **中等** | 合约中存储元数据哈希，IPFS 仅作检索层；可切换至 Arweave |
| R4 | 合约安全漏洞 | 中 | 高 | **严重** | Foundry 模糊测试 + Slither 静态分析 + 代码审查 |
| R5 | 前端开发进度滞后 | 中 | 中 | **中等** | 优先核心流程（发行+验证），UI 打磨可后置 |
| R6 | SDK 集成兼容性问题 | 低 | 中 | **中等** | 严格 TypeScript 类型定义；提供 React / Vanilla JS 双版本 |
| R7 | 时间不足导致功能砍减 | 中 | 中 | **中等** | 按优先级裁剪：核心 > SDK > Widget > 文档 |

### 10.2 应急预案

**场景 A：Sharp Token 合约不可用**
```
方案：部署 MockSharpToken（ERC-20）
步骤：
1. 实现 ISharpToken 接口的 Mock 合约
2. SharpTokenIntegrator 指向 Mock 地址
3. DApp/SDK 通过环境变量切换合约地址
4. 演示时说明"可无缝替换为正式合约"
```

**场景 B：测试网 RPC 不可用**
```
方案：多 RPC 端点 + 本地链
步骤：
1. 配置 Alchemy/Infura/公共 RPC 多端点
2. Wagmi 配置 fallback RPC
3. 关键合约测试在 Anvil 本地链完成
```

**场景 C：时间不足**
```
方案：功能优先级裁剪
裁剪顺序（从后往前）：
1. No-code Widget（可降级为 SDK 示例）
2. 批量发行功能
3. 凭证过期机制
4. 数据库索引（降级为纯链上查询）
不可裁剪：凭证发行、验证、SBT 不可转让、Sharp Token 集成
```

---

## 11. 演示方案

### 11.1 演示流程（5 分钟）

```
0:00 - 0:30  开场：问题引入（传统认证痛点）
0:30 - 1:30  Issuer 注册 + 创建模板
1:30 - 2:30  颁发凭证 → Sharp Token 奖励到账
2:30 - 3:30  凭证验证（DApp + 第三方页面）
3:30 - 4:15  SDK 集成演示（3 行代码）
4:15 - 4:45  No-code Widget 嵌入演示
4:45 - 5:00  总结 + 架构回顾
```

### 11.2 演示亮点

| 亮点 | 对应评分维度 |
|------|-------------|
| 端到端完整流程（发行→验证→激励） | Technical Implementation |
| SBT 不可转让 + 即时验证 | Innovation & Creativity |
| 3 行代码 SDK 集成 | Practical Usability |
| No-code Widget 零门槛嵌入 | Scalability & Impact |
| 双 Problem Statement 覆盖 | Innovation & Creativity |

### 11.3 演示环境准备

- [ ] Amoy 测试网合约已部署并验证
- [ ] 预充值 MATIC（测试网）到演示钱包
- [ ] 预注册 2-3 个 Issuer 账户
- [ ] 预发行 5+ 个凭证用于展示
- [ ] 第三方集成 Demo 页面就绪
- [ ] 演示视频备份（防网络问题）

---

## 12. 附录

### 12.1 评分标准对标

| 评分维度 | 权重 | SkillForge 覆盖点 |
|---------|------|-------------------|
| Innovation & Creativity | — | SBT + Token 激励闭环；双问题融合方案 |
| Technical Implementation | — | Polygon 合约 + SDK + DApp 完整技术栈 |
| Practical Usability | — | No-code Widget 零门槛；SDK 10 行代码集成 |
| Scalability & Impact | — | 开放协议设计；任何机构/平台可接入 |

### 12.2 关键参考

- [ERC-5192: Soulbound Tokens](https://eips.ethereum.org/EIPS/eip-5192)
- [ERC-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)
- [Polygon Documentation](https://polygon.technology/docs)
- [Foundry Book](https://book.getfoundry.sh)
- [Wagmi Documentation](https://wagmi.sh)
- [Next.js Documentation](https://nextjs.org/docs)

### 12.3 术语表

| 术语 | 定义 |
|------|------|
| SBT | Soulbound Token，不可转让的 NFT |
| Issuer | 凭证发行方（机构/组织） |
| Credential | 链上技能凭证（SBT 实例） |
| Template | 凭证模板（定义凭证类型和元数据结构） |
| Verifier | 凭证验证方（任何第三方） |
| CID | Content Identifier，IPFS 内容寻址标识 |

---

> **文档维护说明：** 本文档随项目进展持续更新，每个里程碑完成后同步修订。
