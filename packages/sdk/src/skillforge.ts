import { createPublicClient, http, type PublicClient, type WalletClient, type Hex } from "viem";
import { polygonAmoy } from "viem/chains";
import { SKILL_REGISTRY_ABI, SHARP_TOKEN_INTEGRATOR_ABI, SHARP_TOKEN_ABI } from "./abis";
import type { SkillForgeConfig, CredentialTemplate, CredentialData, VerificationResult } from "./types";

export class SkillForge {
  public publicClient: PublicClient;
  public walletClient?: WalletClient;
  public config: SkillForgeConfig;

  constructor(config: SkillForgeConfig, walletClient?: WalletClient) {
    this.config = config;
    this.walletClient = walletClient;
    this.publicClient = createPublicClient({
      chain: polygonAmoy,
      transport: http(),
    });
  }

  // ============ Credential Operations ============

  async verifyCredential(tokenId: bigint): Promise<VerificationResult> {
    const result = await this.publicClient.readContract({
      address: this.config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "verifyCredential",
      args: [tokenId],
    }) as [boolean, string];
    return { isValid: result[0], reason: result[1] };
  }

  async getCredential(tokenId: bigint): Promise<CredentialData> {
    const result = await this.publicClient.readContract({
      address: this.config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "getCredential",
      args: [tokenId],
    });
    return result as unknown as CredentialData;
  }

  async getTemplate(templateId: bigint): Promise<CredentialTemplate> {
    const result = await this.publicClient.readContract({
      address: this.config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "getTemplate",
      args: [templateId],
    });
    return result as unknown as CredentialTemplate;
  }

  async getCredentialsByAddress(address: `0x${string}`): Promise<bigint[]> {
    const result = await this.publicClient.readContract({
      address: this.config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "getCredentialsByAddress",
      args: [address],
    });
    return result as bigint[];
  }

  async isIssuer(address: `0x${string}`): Promise<boolean> {
    return this.publicClient.readContract({
      address: this.config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "isIssuer",
      args: [address],
    }) as Promise<boolean>;
  }

  // ============ Write Operations (requires wallet) ============

  async registerIssuer(metadataCID: string): Promise<Hex> {
    if (!this.walletClient) throw new Error("Wallet client required");
    const { request } = await this.publicClient.simulateContract({
      address: this.config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "registerIssuer",
      args: [metadataCID],
      account: this.walletClient.account!,
    });
    return this.walletClient.writeContract(request);
  }

  async createTemplate(name: string, description: string, metadataURI: string): Promise<Hex> {
    if (!this.walletClient) throw new Error("Wallet client required");
    const { request } = await this.publicClient.simulateContract({
      address: this.config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "createTemplate",
      args: [name, description, metadataURI],
      account: this.walletClient.account!,
    });
    return this.walletClient.writeContract(request);
  }

  async issueCredential(to: `0x${string}`, templateId: bigint, expiresAt: bigint, tokenURI: string): Promise<Hex> {
    if (!this.walletClient) throw new Error("Wallet client required");
    const { request } = await this.publicClient.simulateContract({
      address: this.config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "issueCredential",
      args: [to, templateId, expiresAt, tokenURI],
      account: this.walletClient.account!,
    });
    return this.walletClient.writeContract(request);
  }

  async revokeCredential(tokenId: bigint): Promise<Hex> {
    if (!this.walletClient) throw new Error("Wallet client required");
    const { request } = await this.publicClient.simulateContract({
      address: this.config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "revokeCredential",
      args: [tokenId],
      account: this.walletClient.account!,
    });
    return this.walletClient.writeContract(request);
  }

  // ============ Token Operations ============

  async getTokenBalance(address: `0x${string}`): Promise<bigint> {
    return this.publicClient.readContract({
      address: this.config.sharpTokenAddress,
      abi: SHARP_TOKEN_ABI,
      functionName: "balanceOf",
      args: [address],
    }) as Promise<bigint>;
  }

  async buyTokens(value: bigint): Promise<Hex> {
    if (!this.walletClient) throw new Error("Wallet client required");
    const { request } = await this.publicClient.simulateContract({
      address: this.config.sharpTokenIntegratorAddress,
      abi: SHARP_TOKEN_INTEGRATOR_ABI,
      functionName: "buyTokens",
      value,
      account: this.walletClient.account!,
    });
    return this.walletClient.writeContract(request);
  }

  async getTokensPerMatic(): Promise<bigint> {
    return this.publicClient.readContract({
      address: this.config.sharpTokenIntegratorAddress,
      abi: SHARP_TOKEN_INTEGRATOR_ABI,
      functionName: "tokensPerMatic",
    }) as Promise<bigint>;
  }
}
