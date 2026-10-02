"use client";

import React, { useState } from "react";
import {
  Settings,
  Cpu,
  Trophy,
  Briefcase,
  Film,
  Atom,
  HeartPulse,
  Sun,
  Moon,
  Laptop,
  RotateCcw,
  CheckCircle,
  Key,
  User,
  ShieldCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  ALL_CATEGORIES,
  toggleCategory,
  setTheme,
  setUserName,
  resetPreferences,
} from "@/store/slices/preferencesSlice";
import { ContentCategory } from "@/types/content";
import { formatCategoryLabel } from "@/lib/transformers";

const CATEGORY_META: Record<
  ContentCategory,
  { icon: React.ElementType; description: string }
> = {
  technology: {
    icon: Cpu,
    description: "Quantum computing, AI models, silicon chips, and developer tools",
  },
  sports: {
    icon: Trophy,
    description: "Formula 1, UEFA Champions League, marathon athletics, and global tournaments",
  },
  business: {
    icon: Briefcase,
    description: "Central bank policies, fintech innovations, equity markets, and venture deals",
  },
  entertainment: {
    icon: Film,
    description: "Film releases, box office benchmarks, festivals, and streaming originals",
  },
  science: {
    icon: Atom,
    description: "James Webb exoplanets, astrophysics, quantum chemistry, and space discovery",
  },
  health: {
    icon: HeartPulse,
    description: "mRNA therapies, circadian science, clinical trials, and longevity research",
  },
};

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);

  const [nameInput, setNameInput] = useState(preferences.userName);
  const [nameSaved, setNameSaved] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleToggle = (cat: ContentCategory) => {
    dispatch(toggleCategory(cat));
  };

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      dispatch(setUserName(nameInput.trim()));
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
  };

  const handleReset = () => {
    dispatch(resetPreferences());
    setNameInput("Vamshi");
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="space-y-10 pb-16 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Settings className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Preferences & Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Customize feed topics, appearance, account persona, and view API integration status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-red-600 transition active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400 self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{resetDone ? "Preferences Reset!" : "Reset to Defaults"}</span>
        </button>
      </div>

      {/* 1. Profile Persona */}
      <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            User Persona
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalize the greeting on your dashboard homepage.
        </p>

        <form onSubmit={handleNameSave} className="flex gap-3 max-w-md">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your Name (e.g. Vamshi)"
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition active:scale-95 flex items-center gap-1.5"
          >
            {nameSaved ? <CheckCircle className="h-3.5 w-3.5" /> : null}
            <span>{nameSaved ? "Saved!" : "Save Name"}</span>
          </button>
        </form>
      </section>

      {/* 2. Theme Appearance */}
      <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Appearance & Theme
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose between Dark mode, Light mode, or follow your operating system preferences.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "dark", label: "Dark Mode", icon: Moon, desc: "Sleek obsidian theme (default)" },
            { id: "light", label: "Light Mode", icon: Sun, desc: "Clean crisp light theme" },
            { id: "system", label: "System Sync", icon: Laptop, desc: "Sync with OS setting" },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = preferences.theme === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => dispatch(setTheme(mode.id as "light" | "dark" | "system"))}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-500/30 dark:bg-indigo-950/40 dark:border-indigo-500"
                    : "border-slate-200 hover:border-slate-300 bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className={`p-2 rounded-xl ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
                  {mode.label}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {mode.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Content Topics Selection */}
      <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Content Topics & Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select which categories appear on your personalized feed and recommendations.
            </p>
          </div>
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {preferences.categories.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ALL_CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const isSelected = preferences.categories.includes(cat);

            return (
              <div
                key={cat}
                onClick={() => handleToggle(cat)}
                className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-indigo-500/60 bg-indigo-50/40 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-950/30"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700"
                }`}
              >
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {formatCategoryLabel(cat)}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {meta.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. API & Demo Integration Status */}
      <section className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            API & Environment Status
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The dashboard operates with server-protected API proxies. When live
          API keys are provided in <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">.env.local</code>,
          live data is fetched. If keys are omitted or rate-limited, the system
          seamlessly serves high-fidelity realistic data with zero UI crashes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-950/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>NewsAPI</span>
            </div>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
              Server Route & Demo Fallback Active
            </p>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-950/50 dark:bg-purple-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>TMDB Movies</span>
            </div>
            <p className="text-[11px] text-purple-600/80 dark:text-purple-400/80">
              Popular & Search Ready
            </p>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 dark:border-sky-950/50 dark:bg-sky-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Social Posts</span>
            </div>
            <p className="text-[11px] text-sky-600/80 dark:text-sky-400/80">
              Verified Mock Engine Active
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
