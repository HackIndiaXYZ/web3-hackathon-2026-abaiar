"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACTS } from "@/lib/contracts";

export default function RegisterIssuerPage() {
  const [metadataCID, setMetadataCID] = useState("");

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleRegister = () => {
    if (!metadataCID) return;
    writeContract({
      address: CONTRACTS.SkillRegistry.address as `0x${string}`,
      abi: CONTRACTS.SkillRegistry.abi,
      functionName: "registerIssuer",
      args: [metadataCID],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <a href="/" className="text-2xl font-bold text-white">SkillForge</a>
        <ConnectButton />
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Register as Issuer</h1>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <label className="block text-purple-200 text-sm mb-2">
            Organization Metadata (IPFS CID)
          </label>
          <input
            type="text"
            value={metadataCID}
            onChange={(e) => setMetadataCID(e.target.value)}
            placeholder="ipfs://Qm..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
          />

          <button
            onClick={handleRegister}
            disabled={isPending || isConfirming || !metadataCID}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Confirm in Wallet..." : isConfirming ? "Registering..." : "Register as Issuer"}
          </button>

          {isSuccess && (
            <p className="mt-4 text-green-400 text-sm">
              Successfully registered as issuer! Transaction: {hash}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
