"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACTS } from "@/lib/contracts";
import { parseEther } from "viem";

export default function TokensPage() {
  const { address, isConnected } = useAccount();

  const { data: balance } = useReadContract({
    address: CONTRACTS.MockSharpToken.address as `0x${string}`,
    abi: CONTRACTS.MockSharpToken.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: tokensPerMatic } = useReadContract({
    address: CONTRACTS.SharpTokenIntegrator.address as `0x${string}`,
    abi: CONTRACTS.SharpTokenIntegrator.abi,
    functionName: "tokensPerMatic",
  });

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleBuy = () => {
    writeContract({
      address: CONTRACTS.SharpTokenIntegrator.address as `0x${string}`,
      abi: CONTRACTS.SharpTokenIntegrator.abi,
      functionName: "buyTokens",
      value: parseEther("0.01"),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <a href="/" className="text-2xl font-bold text-white">SkillForge</a>
        <ConnectButton />
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Sharp Tokens</h1>

        {!isConnected ? (
          <p className="text-purple-200">Connect your wallet to manage tokens.</p>
        ) : (
          <>
            <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-purple-200 text-sm mb-1">Your Balance</p>
              <p className="text-4xl font-bold text-white">
                {balance ? (Number(balance) / 1e18).toFixed(2) : "0"} <span className="text-purple-400">SHARP</span>
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Buy Sharp Tokens</h2>
              <p className="text-purple-200 text-sm mb-4">
                Rate: 1 MATIC = {tokensPerMatic ? (Number(tokensPerMatic) / 1e18).toString() : "100"} SHARP
              </p>
              <button
                onClick={handleBuy}
                disabled={isPending || isConfirming}
                className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 disabled:opacity-50 transition-colors"
              >
                {isPending ? "Confirm..." : isConfirming ? "Buying..." : "Buy 1 SHARP (0.01 MATIC)"}
              </button>
              {isSuccess && (
                <p className="mt-4 text-green-400 text-sm">Purchase confirmed: {hash}</p>
              )}
            </div>

            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">How to Earn</h2>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li>Issue a credential as an Issuer: 10 SHARP</li>
                <li>Receive a credential as a user: 5 SHARP</li>
                <li>Buy tokens with MATIC above</li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
