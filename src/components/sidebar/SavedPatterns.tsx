"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SavedPattern } from "@/types";
import { Button } from "../ui/Button";

interface SavedPatternsProps {
  patterns: SavedPattern[];
  currentPattern: string;
  currentFlags: string;
  onLoad: (pattern: SavedPattern) => void;
  onSave: (label: string, description: string) => void;
  onDelete: (id: string) => void;
}

export function SavedPatterns({
  patterns,
  onLoad,
  onSave,
  onDelete,
}: SavedPatternsProps) {
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label.trim()) {
      onSave(label.trim(), description.trim());
      setLabel("");
      setDescription("");
      setShowForm(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="text-xs text-[var(--color-accent)] hover:underline mb-2"
      >
        {showForm ? "Cancel" : "+ Save pattern"}
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-2 p-2 bg-[var(--color-bg-tertiary)] rounded space-y-2"
          >
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label"
              className="w-full px-2 py-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] rounded text-xs outline-none"
              required
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-2 py-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] rounded text-xs outline-none"
            />
            <Button type="submit" size="sm" className="w-full text-xs">
              Save
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {patterns.length === 0 ? (
        <p className="text-xs text-[var(--color-text-muted)]">No saved patterns</p>
      ) : (
        <div className="space-y-1 max-h-[150px] overflow-y-auto">
          {patterns
            .sort((a, b) => b.lastUsed - a.lastUsed)
            .slice(0, 10)
            .map((pattern) => (
              <motion.div
                key={pattern.id}
                className="p-2 bg-[var(--color-bg-tertiary)] rounded group relative"
              >
                {deleteConfirm === pattern.id ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[var(--color-error)]">Delete?</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          onDelete(pattern.id);
                          setDeleteConfirm(null);
                        }}
                        className="text-[10px] text-[var(--color-error)] hover:underline"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-[10px] text-[var(--color-text-muted)] hover:underline"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onLoad(pattern)}
                      className="text-left w-full pr-4"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-medium text-[var(--color-text-primary)]">
                          {pattern.label}
                        </span>
                        {pattern.flags && (
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            {pattern.flags}
                          </span>
                        )}
                      </div>
                      <code className="font-mono text-[10px] text-[var(--color-accent)] block truncate">
                        {pattern.pattern}
                      </code>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(pattern.id)}
                      className="absolute top-1 right-1 p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--color-error)]/20 text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
                      aria-label="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </>
                )}
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}