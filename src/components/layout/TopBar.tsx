"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Kbd } from "../ui/Kbd";
import { isMac } from "@/lib/utils";

interface TopBarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onFocusPattern?: () => void;
  onCopyMatches?: () => void;
  onSavePattern?: () => void;
}

export function TopBar({
  theme,
  onToggleTheme,
  onFocusPattern,
  onCopyMatches,
}: TopBarProps) {
  const pathname = usePathname();
  const isMacPlatform = isMac();
  const modifier = isMacPlatform ? "Cmd" : "Ctrl";

  const isMainPage = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 bg-[var(--color-bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--color-border-subtle)]">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <Image
              src="/regex-lab-logo.png"
              alt="RegexLab"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-baseline">
            <span className="font-mono text-xl font-bold text-[var(--color-text-primary)]">regex</span>
            <span className="font-mono text-lg text-[var(--color-text-muted)]">lab</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              pathname === "/"
                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
            }`}
          >
            Tester
          </Link>
          <Link
            href="/docs"
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              pathname === "/docs"
                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
            }`}
          >
            Docs
          </Link>
          <Link
            href="/tools"
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
              pathname === "/tools"
                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/10"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]"
            }`}
          >
            Tools
          </Link>
        </nav>
      </div>

      {isMainPage && (
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onFocusPattern}
            className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] rounded-md transition-colors"
            title="Focus pattern input"
          >
            <Kbd>{modifier}+K</Kbd>
            <span>Focus</span>
          </button>
          <button
            onClick={onCopyMatches}
            className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] rounded-md transition-colors"
            title="Copy all matches"
          >
            <Kbd>{modifier}+Enter</Kbd>
            <span>Copy</span>
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          aria-label="GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <button
          onClick={onToggleTheme}
          className="p-2.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}