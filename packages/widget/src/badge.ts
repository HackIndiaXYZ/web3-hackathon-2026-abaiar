import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";

const SKILL_REGISTRY_ABI = [
  "function verifyCredential(uint256 tokenId) external view returns (bool isValid, string reason)",
  "function getCredential(uint256 tokenId) external view returns (tuple(uint256 templateId, address recipient, address issuer, uint256 issuedAt, uint256 expiresAt, bool revoked, string tokenURI))",
] as const;

export interface BadgeConfig {
  skillRegistryAddress: `0x${string}`;
  tokenId: bigint;
  containerId?: string;
}

export async function renderVerificationBadge(config: BadgeConfig): Promise<HTMLDivElement> {
  const client = createPublicClient({
    chain: polygonAmoy,
    transport: http(),
  });

  const [verification, credential] = await Promise.all([
    client.readContract({
      address: config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "verifyCredential",
      args: [config.tokenId],
    }),
    client.readContract({
      address: config.skillRegistryAddress,
      abi: SKILL_REGISTRY_ABI,
      functionName: "getCredential",
      args: [config.tokenId],
    }),
  ]);

  const isValid = (verification as [boolean, string])[0];
  const cred = credential as any;

  const badge = document.createElement("div");
  badge.style.cssText = `
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 9999px; font-family: system-ui, sans-serif;
    font-size: 14px; font-weight: 600;
    background: ${isValid ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"};
    border: 1px solid ${isValid ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"};
    color: ${isValid ? "#22c55e" : "#ef4444"};
  `;

  const icon = document.createElement("span");
  icon.textContent = isValid ? "\u2713" : "\u2717";
  badge.appendChild(icon);

  const text = document.createElement("span");
  text.textContent = isValid ? `Verified Credential #${config.tokenId.toString()}` : `Invalid Credential #${config.tokenId.toString()}`;
  badge.appendChild(text);

  if (isValid && cred.issuer) {
    const issuer = document.createElement("span");
    issuer.style.cssText = "font-weight:400; opacity:0.7; font-size:12px;";
    issuer.textContent = ` by ${cred.issuer.slice(0, 6)}...${cred.issuer.slice(-4)}`;
    badge.appendChild(issuer);
  }

  if (config.containerId) {
    const container = document.getElementById(config.containerId);
    if (container) container.appendChild(badge);
  }

  return badge;
}
