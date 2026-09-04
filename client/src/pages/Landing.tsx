import { useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  Database,
  FileText,
  Leaf,
  Map,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { MapView } from "@/components/Map";
import { useTheme } from "@/contexts/ThemeContext";

const sections = [
  {
    href: "/dashboard#overview",
    index: "01",
    label: "Overview",
    title: "Read the pulse",
    body: "A national view of claims, title movement, pending review, and open anomaly signals.",
    icon: Sparkles,
    tone: "green",
  },
  {
    href: "/dashboard#map",
    index: "02",
    label: "Claims map",
    title: "Find the geography",
    body: "Explore the India-first map, focus a state, search districts, and inspect claim markers.",
    icon: Map,
    tone: "sage",
  },
  {
    href: "/dashboard#anomalies",
    index: "03",
    label: "Anomalies",
    title: "Explain the signal",
    body: "Review transparent rule-based leads with plain-language reasons for human verification.",
    icon: CircleAlert,
    tone: "clay",
  },
  {
    href: "/dashboard#states",
    index: "04",
    label: "State comparison",
    title: "Compare the movement",
    body: "Sort the ledger by approval rate, pending backlog, or anomaly count to find the next question.",
    icon: Database,
    tone: "amber",
  },
];

const landingMarkers = [
  { id: "landing-koraput", district: "Koraput", state: "Odisha", lat: 18.81, lng: 82.71, risk: "High" as const, claims: 8420, pending: 2140 },
  { id: "landing-bastar", district: "Bastar", state: "Chhattisgarh", lat: 19.1, lng: 81.95, risk: "High" as const, claims: 6340, pending: 1410 },
  { id: "landing-dindori", district: "Dindori", state: "Madhya Pradesh", lat: 22.94, lng: 81.08, risk: "Medium" as const, claims: 4960, pending: 860 },
  { id: "landing-shahdol", district: "Shahdol", state: "Madhya Pradesh", lat: 23.3, lng: 81.36, risk: "Medium" as const, claims: 4120, pending: 840 },
  { id: "landing-dantewada", district: "Dantewada", state: "Chhattisgarh", lat: 18.9, lng: 81.35, risk: "High" as const, claims: 3580, pending: 990 },
  { id: "landing-rayagada", district: "Rayagada", state: "Odisha", lat: 19.17, lng: 83.42, risk: "Medium" as const, claims: 3880, pending: 1180 },
];

export default function Landing() {
  const landingRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const updateScrollScene = () => {
      const node = landingRef.current;
      if (!node) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight * 0.92)));
      node.style.setProperty("--scroll-progress", progress.toFixed(3));
    };
    updateScrollScene();
    window.addEventListener("scroll", updateScrollScene, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollScene);
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".landing-reveal"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-shell" ref={landingRef}>
      <div className="landing-grain" aria-hidden="true" />
      <div className="landing-scroll-rail" aria-hidden="true" />
      <header className="landing-nav">
        <a className="landing-brand" href="/" aria-label="VanAdhikar home">
          <span className="landing-mark" aria-hidden="true"><img src="/assets/vanadhikar-logo.png" alt="" /></span>
          <span><strong>VanAdhikar</strong><small>field intelligence</small></span>
        </a>
        <div className="landing-nav-actions">
          <span className="landing-status"><i />Live demo</span>
          <button className="landing-theme-toggle" onClick={() => toggleTheme?.()} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? <Moon size={15} /> : <Sun size={15} />}</button>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-kicker"><span />FOREST RIGHTS ACT / FIELD CONSOLE</div>
            <h1>Find the bottleneck<br /><em>before it becomes a backlog.</em></h1>
            <p>VanAdhikar brings FRA implementation signals into one grounded working surface—so teams can locate a pattern, understand the rule behind it, and decide where human verification should start.</p>
            <div className="landing-hero-actions"><a className="landing-primary" href="/dashboard#overview">Enter the workspace <ArrowRight size={16} /></a><span className="landing-secondary">Understand the boundary <ShieldCheck size={15} /></span></div>
            <div className="landing-note"><span className="landing-note-mark"><Leaf size={15} /></span><span><strong>Synthetic demo dataset</strong><br />No claimant PII. Every flag is a review lead, not a verdict.</span></div>
          </div>
          <div className="landing-visual landing-map-shell" aria-label="Interactive India claims map">
            <MapView className="landing-map" initialCenter={[22.5, 79]} initialZoom={4.5} markers={landingMarkers} showMarkers showBacklog showAnomalies />
            <div className="landing-map-badge"><span><i />LIVE CLAIMS SURFACE</span><strong>All India</strong><small>50 mock FRA claims / pan + zoom</small></div>
            <div className="landing-map-caption">FIELD DESK / MAP 01</div>
          </div>
        </section>

        <section className="landing-proof-strip landing-reveal" aria-label="VanAdhikar proof points">
          <div><strong>01</strong><span>Detect the pressure</span><small>Spatial signals across a national view</small></div>
          <div><strong>02</strong><span>Explain the reason</span><small>Transparent rules, not black-box verdicts</small></div>
          <div><strong>03</strong><span>Act with confidence</span><small>A review queue built for people</small></div>
          <a href="/dashboard#overview">See the working demo <ArrowRight size={14} /></a>
        </section>

        <section className="landing-section-intro landing-reveal"><div className="landing-section-marker">01 <i /></div><div><div className="landing-eyebrow">Navigate the workspace</div><h2>One console.<br /><em>Four useful directions.</em></h2></div><p>Start with the national pulse, then move from geography to signals to comparison. Each path drops you into the working dashboard with the relevant scope and section in view.</p></section>
        <section className="landing-section-grid landing-reveal" aria-label="VanAdhikar dashboard sections">
          {sections.map(({ href, index, label, title, body, icon: Icon, tone }) => <a className={`landing-section-card ${tone}`} href={href} key={label}><div className="landing-card-top"><span>{index}</span><Icon size={20} /></div><div className="landing-card-label">{label}</div><h3>{title}</h3><p>{body}</p><span className="landing-card-arrow"><ArrowUpRight size={16} /></span></a>)}
        </section>

        <section className="landing-bottom-grid landing-reveal">
          <div className="landing-principles"><div className="landing-eyebrow">The operating idea</div><h2>Detect <span>→</span> Explain <span>→</span> Act.</h2><p>The interface is designed to make the next human question obvious. It is intentionally transparent about its synthetic data and its limits.</p><span className="landing-principles-note">Transparent by design <ShieldCheck size={14} /></span></div>
          <div className="landing-facts"><div><strong>50</strong><span>mock FRA claims</span></div><div><strong>38</strong><span>open signals</span></div><div><strong>02</strong><span>review rules</span></div></div>
        </section>

      </main>

      <footer className="landing-footer"><a className="landing-footer-brand" href="/"><span className="landing-mark small" aria-hidden="true"><img src="/assets/vanadhikar-logo.png" alt="" /></span><span>VanAdhikar</span></a><span>FRA implementation pulse / prototype v0.8</span><span>Prepared for human review</span><a href="/dashboard#overview">Open dashboard <ArrowRight size={13} /></a></footer>
    </div>
  );
}
