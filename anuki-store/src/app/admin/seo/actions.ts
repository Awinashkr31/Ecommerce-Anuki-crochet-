"use server";

export async function runSeoAudit(targetUrl: string = "https://anukicrochet.in") {
  const results = [];
  const baseUrl = targetUrl.replace(/\/$/, "");

  // 1. Robots.txt check
  try {
    const res = await fetch(`${baseUrl}/robots.txt`, { cache: 'no-store' });
    results.push({
      label: "robots.txt",
      status: res.ok ? "pass" : "fail",
      detail: res.ok ? "Accessible and returns 200" : `HTTP ${res.status}`,
      category: "Crawlability",
    });
  } catch (error) {
    const err = error as Error;
    results.push({ label: "robots.txt", status: "fail", detail: err.message || "Unreachable", category: "Crawlability" });
  }

  // 2. Sitemap index check
  try {
    const res = await fetch(`${baseUrl}/sitemap.xml`, { cache: 'no-store' });
    const text = await res.text();
    const sitemapCount = (text.match(/<sitemap>/g) || []).length;
    const urlCount = (text.match(/<url>/g) || []).length;
    results.push({
      label: "Sitemap",
      status: res.ok && (sitemapCount > 0 || urlCount > 0) ? "pass" : "warn",
      detail: res.ok ? `Found ${sitemapCount} child sitemaps, ${urlCount} URLs` : "Not accessible",
      category: "Crawlability",
    });
  } catch (error) {
    const err = error as Error;
    results.push({ label: "Sitemap", status: "fail", detail: err.message || "Unreachable", category: "Crawlability" });
  }

  // 3. HTTPS check
  results.push({
    label: "HTTPS / SSL",
    status: baseUrl.startsWith("https") ? "pass" : "fail",
    detail: baseUrl.startsWith("https") ? "Site uses HTTPS" : "Not using HTTPS",
    category: "Security",
  });

  // 4. Schema & On-Page (Homepage)
  try {
    const res = await fetch(baseUrl, { cache: 'no-store' });
    const html = await res.text();
    
    const schemaCount = (html.match(/application\/ld\+json/g) || []).length;
    results.push({
      label: "JSON-LD Schema (Homepage)",
      status: schemaCount > 0 ? "pass" : "warn",
      detail: schemaCount > 0 ? `${schemaCount} schema block(s) found` : "No JSON-LD found",
      category: "Structured Data",
    });

    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    results.push({
      label: "Homepage <title>",
      status: titleMatch && titleMatch[1].length > 10 ? "pass" : "warn",
      detail: titleMatch ? `"${titleMatch[1].substring(0, 60)}"` : "No title tag found",
      category: "On-Page",
    });

    const descMatch = html.match(/<meta\s+(?:name|property)="description"\s+content="([^"]*)"/i) || 
                      html.match(/<meta\s+content="([^"]*)"\s+(?:name|property)="description"/i);
    results.push({
      label: "Homepage Meta Description",
      status: descMatch && descMatch[1].length > 50 ? "pass" : "warn",
      detail: descMatch ? `${descMatch[1].length} chars` : "No meta description found",
      category: "On-Page",
    });

    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    results.push({
      label: "Homepage H1 Tags",
      status: h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warn",
      detail: `${h1Count} H1 tag(s) found ${h1Count === 1 ? "(ideal)" : h1Count === 0 ? "(missing!)" : "(multiple — should be 1)"}`,
      category: "On-Page",
    });

    const imgTags = html.match(/<img[^>]*>/gi) || [];
    const noAlt = imgTags.filter(t => !t.match(/alt=["'][^"']*["']/i)).length;
    results.push({
      label: "Image Alt Text",
      status: noAlt === 0 ? "pass" : "warn",
      detail: `${imgTags.length} images found, ${noAlt} missing alt text`,
      category: "Accessibility",
    });
  } catch (error) {
    const err = error as Error;
    results.push({ label: "Homepage Fetch", status: "fail", detail: err.message || "Could not fetch homepage", category: "General" });
  }

  // 9. Key page accessibility checks
  const keyPages = [
    { path: "/products", name: "Products Page" },
    { path: "/cart", name: "Cart Page" },
  ];
  for (const page of keyPages) {
    try {
      const res = await fetch(`${baseUrl}${page.path}`, { cache: 'no-store' });
      results.push({
        label: page.name,
        status: res.ok ? "pass" : "fail",
        detail: `HTTP ${res.status}`,
        category: "Page Health",
      });
    } catch (error) {
      const err = error as Error;
      results.push({ label: page.name, status: "fail", detail: err.message || "Unreachable", category: "Page Health" });
    }
  }

  return results;
}
