"use client";

import { useReadContract, useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACTS } from "@/lib/contracts";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  const { data: credentialIds, isLoading } = useReadContract({
    address: CONTRACTS.SkillRegistry.address as `0x${string}`,
    abi: CONTRACTS.SkillRegistry.abi,
    functionName: "getCredentialsByAddress",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  }) as { data: bigint[] | undefined; isLoading: boolean };

  const { data: tokenBalance } = useReadContract({
    address: CONTRACTS.MockSharpToken.address as `0x${string}`,
    abi: CONTRACTS.MockSharpToken.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <a href="/" className="text-2xl font-bold text-white">SkillForge</a>
        <ConnectButton />
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">My Credentials</h1>

        {!isConnected ? (
          <p className="text-purple-200">Connect your wallet to view your credentials.</p>
        ) : isLoading ? (
          <p className="text-purple-200">Loading...</p>
        ) : (
          <>
            <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-purple-200 text-sm">Sharp Token Balance</p>
              <p className="text-2xl font-bold text-white">
                {tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(2) : "0"} SHARP
              </p>
            </div>

            <p className="text-purple-200 mb-4">
              Credentials owned: {credentialIds?.length || 0}
            </p>

            {credentialIds && credentialIds.length > 0 ? (
              <div className="space-y-4">
                {credentialIds.map((id: bigint) => (
                  <CredentialCard key={id.toString()} tokenId={id} />
                ))}
              </div>
            ) : (
              <p className="text-purple-300">No credentials found. Get certified to see them here!</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function CredentialCard({ tokenId }: { tokenId: bigint }) {
  const { data: credential } = useReadContract({
    address: CONTRACTS.SkillRegistry.address as `0x${string}`,
    abi: CONTRACTS.SkillRegistry.abi,
    functionName: "getCredential",
    args: [tokenId],
  });

  const { data: verification } = useReadContract({
    address: CONTRACTS.SkillRegistry.address as `0x${string}`,
    abi: CONTRACTS.SkillRegistry.abi,
    functionName: "verifyCredential",
    args: [tokenId],
  }) as { data: [boolean, string] | undefined };

  if (!credential) return null;

  const isValid = verification?.[0];

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
      <div>
        <p className="text-white font-semibold">Credential #{tokenId.toString()}</p>
        <p className="text-purple-200 text-sm">Template: {(credential as any).templateId?.toString()}</p>
        <p className="text-purple-300 text-xs">Issuer: {(credential as any).issuer}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${isValid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
        {isValid ? "Valid" : "Invalid"}
      </span>
    </div>
  );
}
