"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACTS } from "@/lib/contracts";

export default function VerifyPage() {
  const [tokenId, setTokenId] = useState("");
  const [searched, setSearched] = useState(false);

  const { data: verification, isLoading } = useReadContract({
    address: CONTRACTS.SkillRegistry.address as `0x${string}`,
    abi: CONTRACTS.SkillRegistry.abi,
    functionName: "verifyCredential",
    args: searched && tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: searched && !!tokenId },
  }) as { data: [boolean, string] | undefined; isLoading: boolean };

  const { data: credential } = useReadContract({
    address: CONTRACTS.SkillRegistry.address as `0x${string}`,
    abi: CONTRACTS.SkillRegistry.abi,
    functionName: "getCredential",
    args: searched && tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: searched && !!tokenId },
  });

  const handleVerify = () => {
    if (!tokenId) return;
    setSearched(true);
  };

  const isValid = verification?.[0];
  const reason = verification?.[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <a href="/" className="text-2xl font-bold text-white">SkillForge</a>
        <ConnectButton />
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Verify Credential</h1>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <label className="block text-purple-200 text-sm mb-2">Credential Token ID</label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => { setTokenId(e.target.value); setSearched(false); }}
            placeholder="Enter token ID"
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
          />

          <button
            onClick={handleVerify}
            disabled={!tokenId || isLoading}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>

        {searched && verification && (
          <div className={`mt-6 p-6 rounded-xl border ${isValid ? "bg-green-900/20 border-green-500/30" : "bg-red-900/20 border-red-500/30"}`}>
            <h2 className={`text-xl font-bold ${isValid ? "text-green-400" : "text-red-400"}`}>
              {isValid ? "Valid Credential" : "Invalid Credential"}
            </h2>
            <p className="text-purple-200 mt-2">{String(reason)}</p>

            {credential != null && isValid && (
              <div className="mt-4 space-y-2 text-sm text-purple-200">
                <p>Template ID: {String((credential as Record<string, unknown>).templateId)}</p>
                <p>Issuer: {String((credential as Record<string, unknown>).issuer)}</p>
                <p>Issued: {String((credential as Record<string, unknown>).issuedAt)}</p>
                <p>Expires: {String((credential as Record<string, unknown>).expiresAt) || "Never"}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
