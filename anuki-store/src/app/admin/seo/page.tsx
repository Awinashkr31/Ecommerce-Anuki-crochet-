"use client";

import { useState } from "react";
import useSWR from "swr";
import { runSeoAudit } from "./actions";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { toast } from "sonner";
import {
  Globe, Search, FileText, AlertTriangle, CheckCircle2,
  ExternalLink, BarChart3, Clock, RefreshCw, Zap,
  ArrowRight, Plus, Edit2, Trash2, ShieldCheck, ShieldAlert,
  Sliders, Link2, X, AlertCircle, Check, Loader2, ArrowUpDown
} from "lucide-react";

interface HealthCheck {
  label: string;
  status: "pass" | "warn" | "fail" | "loading";
  detail: string;
  category: string;
}

export default function SEODashboardPage() {
  const [activeTab, setActiveTab] = useState<'audit' | 'redirects' | 'bulk' | 'report'>('redirects');

  // ──────────────────────────────────────────────
  // 1. Health Audit State
  // ──────────────────────────────────────────────
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      const targetUrl = typeof window !== 'undefined' ? window.location.origin : "https://www.anukicrochet.in";
      const results = await runSeoAudit(targetUrl);
      setChecks(results as HealthCheck[]);
    } catch (error) {
      console.error("Audit failed:", error);
      toast.error("Audit failed to run");
    } finally {
      setLastRun(new Date().toLocaleString());
      setIsRunning(false);
    }
  };

  // ──────────────────────────────────────────────
  // 2. Redirect Manager State
  // ──────────────────────────────────────────────
  const { data: redirects = [], mutate: mutateRedirects, isLoading: loadingRedirects } = useSWR<any[]>('/redirects', (url: string) => apiGet(url));
  const [isRedirectModalOpen, setRedirectModalOpen] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<any>(null);
  const [redirectForm, setRedirectForm] = useState({ fromPath: '', toPath: '', statusCode: 301, isActive: true });
  const [savingRedirect, setSavingRedirect] = useState(false);

  const openNewRedirect = () => {
    setEditingRedirect(null);
    setRedirectForm({ fromPath: '', toPath: '', statusCode: 301, isActive: true });
    setRedirectModalOpen(true);
  };

  const openEditRedirect = (r: any) => {
    setEditingRedirect(r);
    setRedirectForm({ fromPath: r.fromPath, toPath: r.toPath, statusCode: r.statusCode, isActive: r.isActive });
    setRedirectModalOpen(true);
  };

  const handleSaveRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRedirect(true);
    try {
      if (editingRedirect) {
        await apiPut(`/redirects/${editingRedirect.id}`, redirectForm);
        toast.success("Redirect updated");
      } else {
        await apiPost('/redirects', redirectForm);
        toast.success("Redirect created");
      }
      setRedirectModalOpen(false);
      mutateRedirects();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save redirect");
    } finally {
      setSavingRedirect(false);
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    if (!confirm("Delete this redirect rule?")) return;
    try {
      await apiDelete(`/redirects/${id}`);
      toast.success("Redirect deleted");
      mutateRedirects();
    } catch (err) {
      toast.error("Failed to delete redirect");
    }
  };

  const handleToggleRedirect = async (r: any) => {
    try {
      await apiPut(`/redirects/${r.id}`, { isActive: !r.isActive });
      toast.success(`Redirect ${!r.isActive ? 'activated' : 'deactivated'}`);
      mutateRedirects();
    } catch (err) {
      toast.error("Failed to toggle redirect");
    }
  };

  // ──────────────────────────────────────────────
  // 3. Bulk Pages & Indexing State
  // ──────────────────────────────────────────────
  const { data: seoPages = [], mutate: mutateSeoPages, isLoading: loadingSeoPages } = useSWR<any[]>('/seo/pages', (url: string) => apiGet(url));
  const [pageTypeFilter, setPageTypeFilter] = useState<'ALL' | 'GIFT' | 'TOPIC'>('ALL');
  const [indexStatusFilter, setIndexStatusFilter] = useState<'ALL' | 'INDEXED' | 'NOINDEX'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Page SEO Edit Modal
  const [isPageSeoModalOpen, setPageSeoModalOpen] = useState(false);
  const [editingPageSeo, setEditingPageSeo] = useState<any>(null);
  const [pageSeoForm, setPageSeoForm] = useState({
    slug: '',
    seoTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    noIndex: false,
    introContent: '',
  });
  const [savingPageSeo, setSavingPageSeo] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{ titleMatches: string[]; descMatches: string[] } | null>(null);

  const openEditPageSeo = (page: any) => {
    setEditingPageSeo(page);
    setPageSeoForm({
      slug: page.slug,
      seoTitle: page.seoTitle || '',
      metaDescription: page.metaDescription || '',
      canonicalUrl: page.canonicalUrl || '',
      noIndex: page.noIndex,
      introContent: page.introContent || '',
    });
    setDuplicateWarning(null);
    setPageSeoModalOpen(true);
  };

  const handleSlugInput = (val: string) => {
    // lowercase-hyphen enforced
    const clean = val
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9/]+/g, '-')
      .replace(/\/+/g, '/');
    setPageSeoForm(prev => ({ ...prev, slug: clean }));
  };

  const checkDuplicatesLive = async () => {
    if (!pageSeoForm.seoTitle && !pageSeoForm.metaDescription) return;
    try {
      const res = await apiPost<any>('/seo/check-duplicates', {
        seoTitle: pageSeoForm.seoTitle,
        metaDescription: pageSeoForm.metaDescription,
        currentSlug: pageSeoForm.slug,
      });
      if (res.isDuplicateTitle || res.isDuplicateDesc) {
        setDuplicateWarning({
          titleMatches: res.titleMatches || [],
          descMatches: res.descMatches || [],
        });
      } else {
        setDuplicateWarning(null);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleSavePageSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPageSeo) return;
    setSavingPageSeo(true);

    try {
      // If warning exists, confirm with admin
      if (duplicateWarning && (duplicateWarning.titleMatches.length > 0 || duplicateWarning.descMatches.length > 0)) {
        const proceed = confirm("Warning: Title or Meta Description duplicates another page. Do you want to proceed and save?");
        if (!proceed) {
          setSavingPageSeo(false);
          return;
        }
      }

      await apiPut(`/seo/pages/${editingPageSeo.id}`, pageSeoForm);
      toast.success("Page SEO updated successfully");
      setPageSeoModalOpen(false);
      mutateSeoPages();
      mutateAuditReport();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update page SEO");
    } finally {
      setSavingPageSeo(false);
    }
  };

  const handleTogglePageIndex = async (page: any) => {
    try {
      await apiPut(`/seo/pages/${page.id}/toggle-index`, {});
      toast.success(`Page is now ${page.noIndex ? 'Indexed' : 'No-Index'}`);
      mutateSeoPages();
      mutateAuditReport();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Publishing guard blocked indexing");
    }
  };

  const filteredPages = seoPages.filter((p: any) => {
    if (pageTypeFilter !== 'ALL' && p.pageType !== pageTypeFilter) return false;
    if (indexStatusFilter === 'INDEXED' && p.noIndex) return false;
    if (indexStatusFilter === 'NOINDEX' && !p.noIndex) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.slug.toLowerCase().includes(q) || (p.seoTitle && p.seoTitle.toLowerCase().includes(q));
    }
    return true;
  });

  // ──────────────────────────────────────────────
  // 4. Publishing Guard Audit Report
  // ──────────────────────────────────────────────
  const { data: auditReport, mutate: mutateAuditReport, isLoading: loadingAuditReport } = useSWR<any>('/seo/audit-report', (url: string) => apiGet(url));

  const countWords = (text: string) => text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const modalWordCount = countWords(pageSeoForm.introContent);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">SEO Command Center</h1>
          <p className="text-neutral-500 mt-1">
            Server-side redirects, programmatic page guards, and indexation controls without code changes.
          </p>
        </div>
        {activeTab === 'audit' && (
          <button
            onClick={runAudit}
            disabled={isRunning}
            className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm shrink-0"
          >
            {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
            {isRunning ? "Running Audit..." : "Run Technical Audit"}
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 bg-white p-2 rounded-2xl border border-neutral-200 shadow-sm w-max max-w-full">
        <button
          onClick={() => setActiveTab('redirects')}
          className={`px-5 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'redirects' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <ArrowRight size={16} className="text-rose-500" /> 301 Redirect Manager ({redirects.length})
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-5 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'bulk' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <Sliders size={16} className="text-rose-500" /> Bulk Pages & Indexing ({seoPages.length})
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-5 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'report' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <ShieldAlert size={16} className="text-rose-500" /> Publishing Guard Audit Report
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'audit' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <Globe size={16} className="text-rose-500" /> Technical Health Audit
        </button>
      </div>

      {/* ────────────────────────────────────────────── */}
      {/* TAB 1: 301 REDIRECT MANAGER                     */}
      {/* ────────────────────────────────────────────── */}
      {activeTab === 'redirects' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Server-Side 301 Redirects</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Applied server-side in Edge middleware before routing with zero latency penalty.
              </p>
            </div>
            <button
              onClick={openNewRedirect}
              className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2 shrink-0"
            >
              <Plus size={16} /> Add 301 Redirect
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
            {loadingRedirects ? (
              <div className="p-12 text-center text-neutral-400 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Loading redirects...
              </div>
            ) : redirects.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">No redirects configured yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Source URL (From)</th>
                      <th className="py-4 px-6">Destination URL (To)</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-center">Active</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {redirects.map((r: any) => (
                      <tr key={r.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs text-rose-700 font-bold">
                          {r.fromPath}
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-neutral-800">
                          {r.toPath}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {r.statusCode}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleToggleRedirect(r)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${r.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-500'}`}
                          >
                            {r.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditRedirect(r)}
                              className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteRedirect(r.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────── */}
      {/* TAB 2: BULK PAGES & INDEXING                   */}
      {/* ────────────────────────────────────────────── */}
      {activeTab === 'bulk' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search page slug or title..."
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-xs font-medium outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
              <select
                value={pageTypeFilter}
                onChange={(e) => setPageTypeFilter(e.target.value as any)}
                className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 bg-white outline-none"
              >
                <option value="ALL">All Types</option>
                <option value="GIFT">Gifts (/gifts/*)</option>
                <option value="TOPIC">Topic Pages (/*)</option>
              </select>
              <select
                value={indexStatusFilter}
                onChange={(e) => setIndexStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 bg-white outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="INDEXED">Indexed Only</option>
                <option value="NOINDEX">No-Index Only</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
            {loadingSeoPages ? (
              <div className="p-12 text-center text-neutral-400 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Loading pages...
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">No pages matching criteria.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Page Slug & Type</th>
                      <th className="py-4 px-6">SEO Title & Meta</th>
                      <th className="py-4 px-6 text-center">Content & Guard</th>
                      <th className="py-4 px-6 text-center">Index Toggle</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium text-xs">
                    {filteredPages.map((page: any) => {
                      const metrics = page.metrics || {};
                      return (
                        <tr key={page.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-mono text-neutral-900 font-bold">
                              /{page.slug}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 mt-1 inline-block">
                              {page.pageType}
                            </span>
                          </td>
                          <td className="py-4 px-6 max-w-md">
                            <div className="font-bold text-neutral-800 line-clamp-1">{page.seoTitle || 'Default Title'}</div>
                            <div className="text-neutral-500 text-[11px] line-clamp-1 mt-0.5">{page.metaDescription || 'No custom meta description'}</div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="inline-flex flex-col items-center gap-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${metrics.meetsWords ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                {metrics.wordCount || 0} words
                              </span>
                              {metrics.isPublishable ? (
                                <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                                  <Check size={10} /> Guard Ready
                                </span>
                              ) : (
                                <span className="text-[9px] text-rose-500 font-bold flex items-center gap-1" title="Fails 3-point publishing checklist">
                                  <AlertCircle size={10} /> Guard Blocked
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleTogglePageIndex(page)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${!page.noIndex ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'}`}
                              title={page.noIndex ? 'Click to index (checks publishing guard)' : 'Click to set no-index'}
                            >
                              {!page.noIndex ? 'Indexed' : 'No-Index'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => openEditPageSeo(page)}
                              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-bold text-xs text-neutral-700 inline-flex items-center gap-1.5"
                            >
                              <Edit2 size={13} /> Edit SEO
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────── */}
      {/* TAB 3: PUBLISHING GUARD AUDIT REPORT           */}
      {/* ────────────────────────────────────────────── */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Publishing Guard Audit Report</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Evaluation of programmatic pages against the 3 required SEO standards before indexation is allowed.
              </p>
            </div>
            <button
              onClick={() => mutateAuditReport()}
              className="bg-neutral-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} /> Refresh Report
            </button>
          </div>

          {loadingAuditReport ? (
            <div className="p-12 text-center text-neutral-400 flex items-center justify-center gap-2 bg-white rounded-3xl border">
              <Loader2 className="animate-spin" size={20} /> Generating checklist audit report...
            </div>
          ) : auditReport && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm text-center">
                  <p className="text-3xl font-black text-neutral-900">{auditReport.totalEvaluated}</p>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">Total Programmatic Pages</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 shadow-sm text-center">
                  <p className="text-3xl font-black text-emerald-700">{auditReport.passingCount}</p>
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-1">Passed Guard (Ready for Index)</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 shadow-sm text-center">
                  <p className="text-3xl font-black text-amber-700">{auditReport.failingCount}</p>
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mt-1">Failing Guard Checklist</p>
                </div>
              </div>

              {/* Failing Pages Table */}
              <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                  <h3 className="font-bold text-base text-neutral-900">
                    Pages Failing Checklist ({auditReport.failingPages?.length || 0})
                  </h3>
                  <span className="text-xs text-neutral-400 font-medium">Status remains unchanged automatically</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="py-4 px-6">Slug</th>
                        <th className="py-4 px-6 text-center">Current Index Status</th>
                        <th className="py-4 px-6 text-center">Words (min 120)</th>
                        <th className="py-4 px-6 text-center">Unique Meta Desc</th>
                        <th className="py-4 px-6 text-center">Inbound Internal Link</th>
                        <th className="py-4 px-6 text-left">Failing Reasons</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-medium text-xs">
                      {auditReport.failingPages?.map((page: any) => (
                        <tr key={page.slug} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-neutral-900">
                            /{page.slug}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${page.currentIndexStatus === 'INDEXED' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'}`}>
                              {page.currentIndexStatus}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`font-bold ${page.wordCount >= 120 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {page.wordCount} words
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            {page.hasMetaDesc ? (
                              <Check className="mx-auto text-emerald-600" size={16} />
                            ) : (
                              <X className="mx-auto text-rose-500" size={16} />
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {page.hasInboundLink ? (
                              <Check className="mx-auto text-emerald-600" size={16} />
                            ) : (
                              <X className="mx-auto text-rose-500" size={16} />
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1">
                              {page.failedCriteria.map((crit: string, i: number) => (
                                <span key={i} className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                                  {crit}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────── */}
      {/* TAB 4: TECHNICAL HEALTH AUDIT                   */}
      {/* ────────────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <div className="space-y-8">
          {/* Score Summary */}
          {checks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-black text-neutral-900">{checks.length}</p>
                <p className="text-sm text-neutral-500 font-medium mt-1">Total Checks</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-black text-emerald-600">{checks.filter(c => c.status === "pass").length}</p>
                <p className="text-sm text-emerald-700 font-medium mt-1">Passed</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-black text-amber-600">{checks.filter(c => c.status === "warn").length}</p>
                <p className="text-sm text-amber-700 font-medium mt-1">Warnings</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-4xl font-black text-red-600">{checks.filter(c => c.status === "fail").length}</p>
                <p className="text-sm text-red-700 font-medium mt-1">Failed</p>
              </div>
            </div>
          )}

          {/* Results by Category */}
          {checks.length > 0 ? (
            <div className="space-y-6">
              {[...new Set(checks.map(c => c.category))].map(cat => (
                <div key={cat} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="font-bold text-neutral-900 capitalize text-base">{cat} Checks</h2>
                    <span className="text-xs text-neutral-500 font-medium">
                      {checks.filter(c => c.category === cat && c.status === "pass").length}/{checks.filter(c => c.category === cat).length} Passed
                    </span>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {checks.filter(c => c.category === cat).map((check, idx) => (
                      <div key={idx} className="p-6 flex items-start gap-4">
                        <div className="mt-0.5">
                          {check.status === "pass" && <CheckCircle2 size={18} className="text-emerald-500" />}
                          {check.status === "warn" && <AlertTriangle size={18} className="text-amber-500" />}
                          {check.status === "fail" && <AlertTriangle size={18} className="text-red-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-neutral-900 text-sm">{check.label}</p>
                          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{check.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center shadow-sm">
              <Globe className="mx-auto text-neutral-300 mb-4" size={48} />
              <h2 className="text-lg font-bold text-neutral-800">No Audit Run Yet</h2>
              <p className="text-sm text-neutral-500 mt-1 mb-6 max-w-md mx-auto">
                Click the "Run Technical Audit" button above to inspect meta tags, redirects, schemas, and sitemaps.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────── */}
      {/* REDIRECT MODAL                                 */}
      {/* ────────────────────────────────────────────── */}
      {isRedirectModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-black">{editingRedirect ? 'Edit 301 Redirect' : 'New 301 Redirect'}</h2>
              <button onClick={() => setRedirectModalOpen(false)} className="text-neutral-400 hover:text-neutral-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveRedirect}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Source URL (From Path) *</label>
                  <input
                    type="text"
                    value={redirectForm.fromPath}
                    onChange={(e) => setRedirectForm({ ...redirectForm, fromPath: e.target.value })}
                    placeholder="/old-page or /policies/returns-and-exchanges"
                    required
                    className="w-full border rounded-xl p-3 text-sm font-mono outline-none focus:border-rose-500"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Must start with /</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Destination URL (To Path) *</label>
                  <input
                    type="text"
                    value={redirectForm.toPath}
                    onChange={(e) => setRedirectForm({ ...redirectForm, toPath: e.target.value })}
                    placeholder="/new-page or /policies/return-policy"
                    required
                    className="w-full border rounded-xl p-3 text-sm font-mono outline-none focus:border-rose-500"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-xs font-bold text-neutral-700 mb-1">HTTP Status Code</label>
                    <select
                      value={redirectForm.statusCode}
                      onChange={(e) => setRedirectForm({ ...redirectForm, statusCode: Number(e.target.value) })}
                      className="w-full border rounded-xl p-3 text-sm font-bold text-neutral-700 outline-none"
                    >
                      <option value={301}>301 Permanent</option>
                      <option value={302}>302 Temporary</option>
                    </select>
                  </div>
                  <div className="w-1/2 flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={redirectForm.isActive}
                        onChange={(e) => setRedirectForm({ ...redirectForm, isActive: e.target.checked })}
                        className="w-5 h-5 rounded text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-xs font-bold text-neutral-800">Rule Active</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50">
                <button type="button" onClick={() => setRedirectModalOpen(false)} className="px-5 py-2.5 font-bold text-xs text-neutral-600 hover:text-neutral-900">Cancel</button>
                <button type="submit" disabled={savingRedirect} className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-800 disabled:opacity-50">
                  {savingRedirect ? 'Saving...' : 'Save Redirect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────── */}
      {/* PAGE SEO EDIT MODAL WITH PUBLISHING GUARD       */}
      {/* ────────────────────────────────────────────── */}
      {isPageSeoModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <div>
                <h2 className="text-xl font-black">Edit Page SEO & Guard</h2>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">/{editingPageSeo?.slug}</p>
              </div>
              <button onClick={() => setPageSeoModalOpen(false)} className="text-neutral-400 hover:text-neutral-900"><X size={20} /></button>
            </div>

            <form onSubmit={handleSavePageSeo} className="overflow-y-auto">
              <div className="p-6 space-y-5">
                {/* 3-Point Publishing Guard Checklist */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Publishing Guard Checklist</h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      {modalWordCount >= 120 ? (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      ) : (
                        <AlertCircle size={16} className="text-amber-600" />
                      )}
                      <span className={modalWordCount >= 120 ? "text-emerald-900 font-medium" : "text-amber-900 font-medium"}>
                        Intro Content Length: <strong>{modalWordCount} / 120 words min</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {pageSeoForm.metaDescription && pageSeoForm.metaDescription.trim().length >= 40 ? (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      ) : (
                        <AlertCircle size={16} className="text-amber-600" />
                      )}
                      <span className={pageSeoForm.metaDescription && pageSeoForm.metaDescription.trim().length >= 40 ? "text-emerald-900 font-medium" : "text-amber-900 font-medium"}>
                        Unique Meta Description: {pageSeoForm.metaDescription ? `${pageSeoForm.metaDescription.length} chars` : 'Empty'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {editingPageSeo?.metrics?.meetsLinks ? (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      ) : (
                        <AlertCircle size={16} className="text-amber-600" />
                      )}
                      <span className={editingPageSeo?.metrics?.meetsLinks ? "text-emerald-900 font-medium" : "text-amber-900 font-medium"}>
                        Inbound Internal Link in Crawl Graph: {editingPageSeo?.metrics?.meetsLinks ? 'Linked' : 'Not Linked Yet'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Duplicate Warning */}
                {duplicateWarning && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertTriangle size={16} /> Duplicate SEO Detected:
                    </div>
                    {duplicateWarning.titleMatches.length > 0 && (
                      <div>
                        <strong>Matching Titles:</strong>
                        <ul className="list-disc list-inside mt-0.5 font-mono text-[11px]">
                          {duplicateWarning.titleMatches.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                    )}
                    {duplicateWarning.descMatches.length > 0 && (
                      <div>
                        <strong>Matching Meta Descriptions:</strong>
                        <ul className="list-disc list-inside mt-0.5 font-mono text-[11px]">
                          {duplicateWarning.descMatches.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Slug Input */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Slug (Lowercase-hyphen enforced)</label>
                  <input
                    type="text"
                    value={pageSeoForm.slug}
                    onChange={(e) => handleSlugInput(e.target.value)}
                    required
                    className="w-full border rounded-xl p-3 text-xs font-mono outline-none focus:border-rose-500"
                  />
                </div>

                {/* SEO Title */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">SEO Title (Overrides default)</label>
                  <input
                    type="text"
                    value={pageSeoForm.seoTitle}
                    onChange={(e) => setPageSeoForm({ ...pageSeoForm, seoTitle: e.target.value })}
                    onBlur={checkDuplicatesLive}
                    placeholder="e.g. Birthday Crochet Gifts India | Anuki Crochet"
                    className="w-full border rounded-xl p-3 text-xs font-medium outline-none focus:border-rose-500"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={pageSeoForm.metaDescription}
                    onChange={(e) => setPageSeoForm({ ...pageSeoForm, metaDescription: e.target.value })}
                    onBlur={checkDuplicatesLive}
                    placeholder="Compelling, click-worthy meta description under 155 characters..."
                    className="w-full border rounded-xl p-3 text-xs font-medium leading-relaxed outline-none focus:border-rose-500"
                  />
                </div>

                {/* Canonical Override */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Canonical URL Override</label>
                  <input
                    type="url"
                    value={pageSeoForm.canonicalUrl}
                    onChange={(e) => setPageSeoForm({ ...pageSeoForm, canonicalUrl: e.target.value })}
                    placeholder="https://www.anukicrochet.in/..."
                    className="w-full border rounded-xl p-3 text-xs font-mono outline-none focus:border-rose-500"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">Leave blank to use default https://www.anukicrochet.in/{pageSeoForm.slug}</p>
                </div>

                {/* Unique Intro Content (min 120 words for publishing guard) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-neutral-700">Unique Intro Content</label>
                    <span className={`text-[11px] font-bold ${modalWordCount >= 120 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {modalWordCount} words (min 120 required)
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    value={pageSeoForm.introContent}
                    onChange={(e) => setPageSeoForm({ ...pageSeoForm, introContent: e.target.value })}
                    placeholder="Write detailed, unique artisan editorial text describing this specific collection, yarn materials, craftsmanship, and gifting guide..."
                    className="w-full border rounded-xl p-3 text-xs font-medium leading-relaxed outline-none focus:border-rose-500"
                  />
                </div>

                {/* Index Toggle */}
                <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Indexation Status</h4>
                    <p className="text-[11px] text-neutral-500">Controls meta robots tag & sitemap inclusion.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!pageSeoForm.noIndex}
                      onChange={(e) => setPageSeoForm({ ...pageSeoForm, noIndex: !e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-xs font-bold text-neutral-700">
                      {pageSeoForm.noIndex ? 'No-Index' : 'Indexed'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50">
                <button
                  type="button"
                  onClick={() => setPageSeoModalOpen(false)}
                  className="px-5 py-2.5 font-bold text-xs text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPageSeo}
                  className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-neutral-800 disabled:opacity-50"
                >
                  {savingPageSeo ? 'Saving...' : 'Save Page SEO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
