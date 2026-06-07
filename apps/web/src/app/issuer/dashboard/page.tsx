"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACTS } from "@/lib/contracts";

export default function IssuerDashboardPage() {
  const [tab, setTab] = useState<"template" | "issue">("template");

  // Template form
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [templateURI, setTemplateURI] = useState("");

  // Issue form
  const [recipient, setRecipient] = useState("");
  const [templateId, setTemplateId] = useState("0");
  const [expiresAt, setExpiresAt] = useState("0");
  const [credentialURI, setCredentialURI] = useState("");

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: totalTemplates } = useReadContract({
    address: CONTRACTS.SkillRegistry.address as `0x${string}`,
    abi: CONTRACTS.SkillRegistry.abi,
    functionName: "totalTemplates",
  });

  const handleCreateTemplate = () => {
    if (!templateName) return;
    writeContract({
      address: CONTRACTS.SkillRegistry.address as `0x${string}`,
      abi: CONTRACTS.SkillRegistry.abi,
      functionName: "createTemplate",
      args: [templateName, templateDesc, templateURI],
    });
  };

  const handleIssueCredential = () => {
    if (!recipient) return;
    writeContract({
      address: CONTRACTS.SkillRegistry.address as `0x${string}`,
      abi: CONTRACTS.SkillRegistry.abi,
      functionName: "issueCredential",
      args: [recipient as `0x${string}`, BigInt(templateId), BigInt(expiresAt), credentialURI],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <a href="/" className="text-2xl font-bold text-white">SkillForge</a>
        <ConnectButton />
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-4">Issuer Dashboard</h1>
        <p className="text-purple-200 mb-8">Templates created: {totalTemplates?.toString() || "0"}</p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab("template")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${tab === "template" ? "bg-purple-600 text-white" : "bg-white/10 text-purple-200 hover:bg-white/20"}`}
          >
            Create Template
          </button>
          <button
            onClick={() => setTab("issue")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${tab === "issue" ? "bg-purple-600 text-white" : "bg-white/10 text-purple-200 hover:bg-white/20"}`}
          >
            Issue Credential
          </button>
        </div>

        {tab === "template" && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-purple-200 text-sm mb-1">Template Name *</label>
              <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Web3 Developer" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="block text-purple-200 text-sm mb-1">Description</label>
              <input type="text" value={templateDesc} onChange={(e) => setTemplateDesc(e.target.value)} placeholder="Certified Web3 Developer" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="block text-purple-200 text-sm mb-1">Metadata URI</label>
              <input type="text" value={templateURI} onChange={(e) => setTemplateURI(e.target.value)} placeholder="ipfs://Qm..." className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400" />
            </div>
            <button onClick={handleCreateTemplate} disabled={isPending || isConfirming || !templateName} className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 disabled:opacity-50 transition-colors">
              {isPending ? "Confirm..." : isConfirming ? "Creating..." : "Create Template"}
            </button>
          </div>
        )}

        {tab === "issue" && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div>
              <label className="block text-purple-200 text-sm mb-1">Recipient Address *</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x..." className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="block text-purple-200 text-sm mb-1">Template ID</label>
              <input type="number" value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="block text-purple-200 text-sm mb-1">Expires At (0 = never)</label>
              <input type="number" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label className="block text-purple-200 text-sm mb-1">Credential Metadata URI</label>
              <input type="text" value={credentialURI} onChange={(e) => setCredentialURI(e.target.value)} placeholder="ipfs://Qm..." className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400" />
            </div>
            <button onClick={handleIssueCredential} disabled={isPending || isConfirming || !recipient} className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 disabled:opacity-50 transition-colors">
              {isPending ? "Confirm..." : isConfirming ? "Issuing..." : "Issue Credential"}
            </button>
          </div>
        )}

        {isSuccess && (
          <p className="mt-4 text-green-400 text-sm">Transaction confirmed: {hash}</p>
        )}
      </main>
    </div>
  );
}
