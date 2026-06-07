export interface SkillForgeConfig {
  skillRegistryAddress: `0x${string}`;
  sharpTokenIntegratorAddress: `0x${string}`;
  sharpTokenAddress: `0x${string}`;
  chainId?: number;
}

export interface CredentialTemplate {
  issuer: `0x${string}`;
  name: string;
  description: string;
  metadataURI: string;
  active: boolean;
  createdAt: bigint;
}

export interface CredentialData {
  templateId: bigint;
  recipient: `0x${string}`;
  issuer: `0x${string}`;
  issuedAt: bigint;
  expiresAt: bigint;
  revoked: boolean;
  tokenURI: string;
}

export interface VerificationResult {
  isValid: boolean;
  reason: string;
}
