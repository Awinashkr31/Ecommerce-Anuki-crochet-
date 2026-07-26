"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe, Search, FileText, AlertTriangle, CheckCircle2, 
  ExternalLink, TrendingUp, BarChart3, Clock, RefreshCw,
  Zap, Image as ImageIcon, Code2, Link2, Shield
} from "lucide-react";

interface HealthCheck {
  label: string;
  status: "pass" | "warn" | "fail" | "loading";
  detail: string;
  category: string;
}

export default function SEODashboardPage() {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const baseUrl = "https://anukicrochet.in";

  const runAudit = async () => {
    setIsRunning(true);
    const results: HealthCheck[] = [];

    // 1. Robots.txt check
    try {
      const res = await fetch(`${baseUrl}/robots.txt`);
      results.push({
        label: "robots.txt",
        status: res.ok ? "pass" : "fail",
        detail: res.ok ? "Accessible and returns 200" : `HTTP ${res.status}`,
        category: "Crawlability",
      });
    } catch {
      results.push({ label: "robots.txt", status: "fail", detail: "Unreachable", category: "Crawlability" });
    }

    // 2. Sitemap index check
    try {
      const res = await fetch(`${baseUrl}/sitemap.xml`);
      const text = await res.text();
      const sitemapCount = (text.match(/<sitemap>/g) || []).length;
      results.push({
        label: "Sitemap Index",
        status: res.ok && sitemapCount > 0 ? "pass" : "warn",
        detail: res.ok ? `Found ${sitemapCount} child sitemaps` : "Not accessible",
        category: "Crawlability",
      });
    } catch {
      results.push({ label: "Sitemap Index", status: "fail", detail: "Unreachable", category: "Crawlability" });
    }

    // 3. HTTPS check
    results.push({
      label: "HTTPS / SSL",
      status: baseUrl.startsWith("https") ? "pass" : "fail",
      detail: baseUrl.startsWith("https") ? "Site uses HTTPS" : "Not using HTTPS",
      category: "Security",
    });

    // 4. Schema validation (check homepage for JSON-LD)
    try {
      const res = await fetch(baseUrl);
      const html = await res.text();
      const schemaCount = (html.match(/application\/ld\+json/g) || []).length;
      results.push({
        label: "JSON-LD Schema (Homepage)",
        status: schemaCount > 0 ? "pass" : "warn",
        detail: schemaCount > 0 ? `${schemaCount} schema block(s) found` : "No JSON-LD found",
        category: "Structured Data",
      });
      // 5. Meta title check
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      results.push({
        label: "Homepage <title>",
        status: titleMatch && titleMatch[1].length > 10 ? "pass" : "warn",
        detail: titleMatch ? `"${titleMatch[1].substring(0, 60)}"` : "No title tag found",
        category: "On-Page",
      });
      // 6. Meta description
      const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i);
      results.push({
        label: "Homepage Meta Description",
        status: descMatch && descMatch[1].length > 50 ? "pass" : "warn",
        detail: descMatch ? `${descMatch[1].length} chars` : "No meta description found",
        category: "On-Page",
      });
      // 7. H1 check
      const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
      results.push({
        label: "Homepage H1 Tags",
        status: h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warn",
        detail: `${h1Count} H1 tag(s) found ${h1Count === 1 ? "(ideal)" : h1Count === 0 ? "(missing!)" : "(multiple — should be 1)"}`,
        category: "On-Page",
      });
      // 8. Image alt text check (sample)
      const imgTags = html.match(/<img[^>]*>/gi) || [];
      const noAlt = imgTags.filter(t => !t.includes('alt=')).length;
      results.push({
        label: "Image Alt Text",
        status: noAlt === 0 ? "pass" : "warn",
        detail: `${imgTags.length} images found, ${noAlt} missing alt text`,
        category: "Accessibility",
      });
    } catch {
      results.push({ label: "Homepage Fetch", status: "fail", detail: "Could not fetch homepage", category: "General" });
    }

    // 9. Key page accessibility checks
    const keyPages = [
      { path: "/products", name: "Products Page" },
      { path: "/about", name: "About Page" },
      { path: "/contact", name: "Contact Page" },
      { path: "/blog", name: "Blog Index" },
      { path: "/faq", name: "FAQ Page" },
    ];
    for (const page of keyPages) {
      try {
        const res = await fetch(`${baseUrl}${page.path}`);
        results.push({
          label: page.name,
          status: res.ok ? "pass" : "fail",
          detail: `HTTP ${res.status}`,
          category: "Page Health",
        });
      } catch {
        results.push({ label: page.name, status: "fail", detail: "Unreachable", category: "Page Health" });
      }
    }

    // 10. Product sitemap image check
    try {
      const res = await fetch(`${baseUrl}/sitemap-products.xml`);
      const text = await res.text();
      const imageNs = text.includes("xmlns:image");
      const urlCount = (text.match(/<url>/g) || []).length;
      results.push({
        label: "Product Sitemap",
        status: res.ok && urlCount > 0 ? "pass" : "warn",
        detail: `${urlCount} products indexed, Image namespace: ${imageNs ? "Yes ✓" : "No ✗"}`,
        category: "Crawlability",
      });
    } catch {
      results.push({ label: "Product Sitemap", status: "fail", detail: "Unreachable", category: "Crawlability" });
    }

    setChecks(results);
    setLastRun(new Date().toLocaleString());
    setIsRunning(false);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "warn": return <AlertTriangle size={18} className="text-amber-500" />;
      case "fail": return <AlertTriangle size={18} className="text-red-500" />;
      default: return <RefreshCw size={18} className="animate-spin text-neutral-400" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pass": return "bg-emerald-50 border-emerald-200";
      case "warn": return "bg-amber-50 border-amber-200";
      case "fail": return "bg-red-50 border-red-200";
      default: return "bg-neutral-50 border-neutral-200";
    }
  };

  const passCount = checks.filter(c => c.status === "pass").length;
  const warnCount = checks.filter(c => c.status === "warn").length;
  const failCount = checks.filter(c => c.status === "fail").length;

  const categories = [...new Set(checks.map(c => c.category))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">SEO Health Dashboard</h1>
          <p className="text-neutral-500 mt-1">
            Automated technical SEO audit and monitoring for AnukiCrochet.in
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRun && (
            <span className="text-xs text-neutral-500 flex items-center gap-1.5">
              <Clock size={12} /> Last run: {lastRun}
            </span>
          )}
          <button
            onClick={runAudit}
            disabled={isRunning}
            className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
            {isRunning ? "Running Audit..." : "Run SEO Audit"}
          </button>
        </div>
      </div>

      {/* Score Summary */}
      {checks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-neutral-900">{checks.length}</p>
            <p className="text-sm text-neutral-500 font-medium mt-1">Total Checks</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-emerald-600">{passCount}</p>
            <p className="text-sm text-emerald-700 font-medium mt-1">Passed</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-amber-600">{warnCount}</p>
            <p className="text-sm text-amber-700 font-medium mt-1">Warnings</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-red-600">{failCount}</p>
            <p className="text-sm text-red-700 font-medium mt-1">Failed</p>
          </div>
        </div>
      )}

      {/* Checks by Category */}
      {checks.length > 0 ? (
        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat}>
              <h2 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                {cat === "Crawlability" && <Globe size={18} />}
                {cat === "On-Page" && <FileText size={18} />}
                {cat === "Structured Data" && <Code2 size={18} />}
                {cat === "Security" && <Shield size={18} />}
                {cat === "Accessibility" && <ImageIcon size={18} />}
                {cat === "Page Health" && <Link2 size={18} />}
                {cat}
              </h2>
              <div className="space-y-2">
                {checks.filter(c => c.category === cat).map((check, i) => (
                  <div key={i} className={`flex items-center justify-between px-5 py-3.5 rounded-xl border ${statusColor(check.status)} transition-all`}>
                    <div className="flex items-center gap-3">
                      {statusIcon(check.status)}
                      <span className="font-semibold text-sm text-neutral-900">{check.label}</span>
                    </div>
                    <span className="text-xs text-neutral-600 font-medium max-w-[50%] text-right">{check.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl p-16 text-center">
          <Search size={48} className="text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">No audit data yet</h2>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            Click "Run SEO Audit" to perform an automated health check on your site's crawlability, structured data, on-page signals, and page accessibility.
          </p>
        </div>
      )}

      {/* External Tools Quick Links */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8">
        <h2 className="text-lg font-bold text-neutral-900 mb-6">External SEO Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Google Search Console", url: "https://search.google.com/search-console", desc: "Monitor indexing, clicks, and impressions" },
            { name: "Google PageSpeed Insights", url: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(baseUrl)}`, desc: "Core Web Vitals & performance" },
            { name: "Rich Results Test", url: `https://search.google.com/test/rich-results?url=${encodeURIComponent(baseUrl)}`, desc: "Validate structured data" },
            { name: "Schema Validator", url: "https://validator.schema.org/", desc: "Validate JSON-LD schema markup" },
            { name: "Mobile-Friendly Test", url: `https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(baseUrl)}`, desc: "Check mobile rendering" },
            { name: "Google Analytics", url: "https://analytics.google.com/", desc: "Traffic, engagement, conversions" },
          ].map(tool => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 rounded-xl border border-neutral-100 hover:border-rose-200 hover:bg-rose-50/50 transition-all group"
            >
              <ExternalLink size={16} className="text-neutral-400 group-hover:text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-neutral-900 group-hover:text-rose-600">{tool.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{tool.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* KPI Monitoring Checklist */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8">
        <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <BarChart3 size={20} /> KPI Monitoring Checklist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {[
            { freq: "Weekly", tasks: [
              "Run technical audit (this page)",
              "Check Core Web Vitals in PageSpeed Insights",
              "Review Search Console for indexing issues",
              "Monitor Google Analytics for traffic anomalies",
              "Validate schema via Rich Results Test",
            ]},
            { freq: "Monthly", tasks: [
              "Track rankings for primary keywords (SEMrush/Ahrefs)",
              "Analyze new keyword opportunities",
              "Audit internal links and broken links",
              "Review Google algorithm updates",
              "Competitor analysis (content + backlinks)",
            ]},
            { freq: "Quarterly", tasks: [
              "Content gap analysis vs competitors",
              "Backlink profile audit (DA/authority metrics)",
              "CRO review: A/B test titles and descriptions",
              "Review and refresh evergreen content",
              "Update structured data for new product types",
            ]},
          ].map(group => (
            <div key={group.freq} className="mb-4">
              <h3 className="font-bold text-neutral-900 text-sm mb-2 flex items-center gap-2">
                <Clock size={14} className="text-rose-500" /> {group.freq}
              </h3>
              <ul className="space-y-1.5">
                {group.tasks.map((task, i) => (
                  <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                    <span className="text-neutral-300 mt-0.5">•</span> {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
