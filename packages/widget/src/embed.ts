import { renderVerificationBadge, type BadgeConfig } from "./badge";

declare global {
  interface Window {
    SkillForge?: {
      renderBadge: (config: BadgeConfig) => Promise<HTMLDivElement>;
    };
  }
}

export function initEmbed(): void {
  window.SkillForge = {
    renderBadge: renderVerificationBadge,
  };

  // Auto-render badges from data attributes
  document.querySelectorAll("[data-skillforge-badge]").forEach((el) => {
    const tokenId = el.getAttribute("data-skillforge-badge");
    const registry = el.getAttribute("data-skillforge-registry");
    if (tokenId && registry) {
      renderVerificationBadge({
        skillRegistryAddress: registry as `0x${string}`,
        tokenId: BigInt(tokenId),
        containerId: el.id || undefined,
      });
    }
  });
}

// Auto-init when loaded in browser
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEmbed);
  } else {
    initEmbed();
  }
}
