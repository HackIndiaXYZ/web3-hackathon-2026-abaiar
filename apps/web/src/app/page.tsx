import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">SkillForge</h1>
        <ConnectButton />
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-white mb-6">
            On-Chain Skill Credentials
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Issue, verify, and earn from skill certifications on Polygon.
            Tamper-proof, instantly verifiable, and portable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/issuer/register"
            className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300">
              Register as Issuer
            </h3>
            <p className="text-purple-200 text-sm">
              Become a credential issuer and start certifying skills on-chain
            </p>
          </Link>

          <Link
            href="/issuer/dashboard"
            className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300">
              Issuer Dashboard
            </h3>
            <p className="text-purple-200 text-sm">
              Create templates, issue credentials, and manage your certifications
            </p>
          </Link>

          <Link
            href="/verify"
            className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300">
              Verify Credential
            </h3>
            <p className="text-purple-200 text-sm">
              Instantly verify any on-chain credential by token ID
            </p>
          </Link>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Link
            href="/profile"
            className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300">
              My Credentials
            </h3>
            <p className="text-purple-200 text-sm">
              View and manage your earned skill credentials
            </p>
          </Link>

          <Link
            href="/tokens"
            className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all"
          >
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300">
              Sharp Tokens
            </h3>
            <p className="text-purple-200 text-sm">
              Earn, spend, and buy Sharp Tokens in the ecosystem
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
