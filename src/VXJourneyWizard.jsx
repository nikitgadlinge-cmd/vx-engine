import { useState, useEffect, useRef } from "react";
import {
  buildSampleBrief,
  buildSampleBenchmark,
  buildSamplePersonaLongList,
  buildSampleFullPersonas,
  buildSampleJourneys,
  buildConsolidatedFramework,
} from "./sampleData.js";

const FAKE_DELAY = 1400; // ms — short "Generating…" pause so it feels real
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const steps = [
  { id: 0, label: "Welcome", icon: "◈" },
  { id: 1, label: "Sector Selection", icon: "◉" },
  { id: 2, label: "Experience Context", icon: "◎" },
  { id: 3, label: "Physical Features", icon: "▣" },
  { id: 4, label: "Operational Controls", icon: "⬡" },
  { id: 5, label: "Stakeholder Profiling", icon: "◍" },
  { id: 6, label: "Priorities", icon: "◆" },
  { id: 7, label: "Template Selection", icon: "✦" },
  { id: 8, label: "Review", icon: "◇" },
];

// Dashboard stage grouping (left-nav). Stage 1 holds the intake steps;
// Stages 2-4 are the generated outputs reached from the Review screen.
const STAGE_GROUPS = [
  {
    n: 1, name: "Structured Intake", color: "#F59E0B",
    desc: "Capture the venue, context and priorities that shape everything downstream.",
    items: [
      { id: 1, label: "Sector & Context" },
      { id: 2, label: "Experience Context" },
      { id: 3, label: "Physical Features" },
      { id: 4, label: "Operational Controls" },
      { id: 5, label: "Stakeholder Profiling" },
      { id: 6, label: "Priority Outcomes" },
      { id: 7, label: "Template Selection" },
      { id: 8, label: "Review & Generate" },
    ],
  },
  { n: 2, name: "Benchmark Intelligence", color: "#3B82F6", desc: "Global leading practices matched to your goals.", outputKey: "benchmark",
    subItems: [
      { label: "Run Analysis", anchor: "anchor-benchmark" },
      { label: "Leading Practices", anchor: "anchor-benchmark-results" },
    ] },
  { n: 3, name: "Persona Synthesis", color: "#8B5CF6", desc: "The visitor personas your experience is designed around.", outputKey: "persona",
    subItems: [
      { label: "Generate Long List", anchor: "anchor-persona" },
      { label: "Persona Selection", anchor: "anchor-persona-select" },
      { label: "Full Persona Cards", anchor: "anchor-persona-cards" },
    ] },
  { n: 4, name: "Journey Intelligence", color: "#10B981", desc: "Journey maps, Moments of Truth and the KPI framework.", outputKey: "journey",
    subItems: [
      { label: "Generate Stage 4", anchor: "anchor-journey" },
      { label: "Journey Maps", anchor: "anchor-journey-maps" },
      { label: "Moments of Truth", anchor: "anchor-journey-mot" },
      { label: "KPI Framework", anchor: "anchor-journey-kpi" },
    ] },
];

const accentColor = "#C8F04A";

const stepContent = {
  1: {
    title: "Sector Selection",
    body: "Identify the primary industry sector your VX Journey will serve. This context shapes the intelligence architecture and output templates.",
  },
  2: {
    title: "Experience Context",
    body: "Define the experiential environment — physical, digital, or hybrid — and the conditions under which your journey will operate.",
  },
  3: {
    title: "Physical Features",
    body: "Map the tangible characteristics and constraints of your deployment environment, from spatial dimensions to accessibility requirements.",
  },
  4: {
    title: "Operational Controls",
    body: "Configure the control parameters and governance rules that will govern journey execution, escalation paths, and override protocols.",
  },
  5: {
    title: "Stakeholder Profiling",
    body: "Identify all parties involved in or affected by the journey — from internal owners and operators to end participants and external partners.",
  },
  6: {
    title: "Priorities",
    body: "Rank journey objectives and define the success metrics the engine will optimize toward.",
  },
  7: {
    title: "Template Selection",
    body: "Choose the primary framework to structure your VX Journey output, with an optional secondary template.",
  },
};

const SECTORS = [
  {
    id: "theme-parks",
    label: "Theme Parks & Attractions",
    icon: "◉",
    description: "Immersive entertainment destinations with rides, shows & themed experiences.",
    subtypes: [
      "Major Theme Park",
      "Water Park",
      "Adventure Park",
      "Family Entertainment Centre",
      "Dark Ride Attraction",
      "Immersive Experience Venue",
    ],
  },
  {
    id: "cultural-heritage",
    label: "Cultural & Heritage Venues",
    icon: "◎",
    description: "Museums, galleries, historic sites and educational visitor destinations.",
    subtypes: [
      "Natural History Museum",
      "Art Gallery",
      "Science & Discovery Centre",
      "Historic Site / Monument",
      "Heritage Railway",
      "Botanical Garden",
    ],
  },
  {
    id: "sports-venues",
    label: "Sports Venues & Stadia",
    icon: "▣",
    description: "Purpose-built arenas and multi-use stadia hosting competitive events.",
    subtypes: [
      "Football / Soccer Stadium",
      "Multi-Sport Arena",
      "Athletics Stadium",
      "Cricket Ground",
      "Indoor Arena",
      "Motorsport Circuit",
    ],
  },
  {
    id: "live-events",
    label: "Live Events & Festivals",
    icon: "⬡",
    description: "Temporary or recurring events spanning music, culture, sport and entertainment.",
    subtypes: [
      "Music Festival",
      "Cultural Festival",
      "Esports Event",
      "Touring Concert",
      "Food & Drink Festival",
      "Corporate / Brand Activation",
    ],
  },
];

const PHYSICAL_FEATURES = [
  "Parking facilities",
  "Landscape & garden zones",
  "VIP & VVIP reception areas",
  "Cultural sensitivity zones",
  "Commute & transport management",
  "Accessibility infrastructure",
  "Wayfinding system",
  "F&B outlets",
  "Retail zones",
  "Rest and seating areas",
  "First aid points",
  "Security checkpoints",
  "Staff and service zones",
];

const DEFAULT_FEATURE_ROW = { present: "", quality: "", priority: "" };

const MOTIVATIONS = [
  "Learning & Discovery", "Entertainment & Escapism", "Social & Belonging",
  "Prestige & Status", "Nostalgia & Memory", "Awe & Inspiration",
  "Relaxation & Recovery", "Civic Pride & Identity", "Commerce & Transaction",
];

const OUTCOMES = [
  "NPS / Satisfaction", "Revenue per Visit", "Dwell Time Extension",
  "Return Visit Rate", "Operational Flow", "Brand Recall",
  "Accessibility", "VIP Protocol", "Security / HSE",
  "Media Amplification", "Cultural Sensitivity", "Staff Quality", "Digital Engagement",
];

export default function VXJourneyWizard() {
  // ── localStorage persistence helper ──
  const usePersisted = (key, initial) => {
    const [val, setVal] = useState(() => {
      try {
        const stored = localStorage.getItem(`vx_${key}`);
        return stored !== null ? JSON.parse(stored) : (typeof initial === "function" ? initial() : initial);
      } catch { return typeof initial === "function" ? initial() : initial; }
    });
    const setPersisted = (next) => {
      setVal(prev => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try { localStorage.setItem(`vx_${key}`, JSON.stringify(resolved)); } catch {}
        return resolved;
      });
    };
    return [val, setPersisted];
  };

  const [current, setCurrent] = usePersisted("current", 0);
  const [selectedSector, setSelectedSector] = usePersisted("selectedSector", null);
  const [selectedSubtype, setSelectedSubtype] = usePersisted("selectedSubtype", "");

  // Step 2 — Experience Context
  const [expPurpose, setExpPurpose] = usePersisted("expPurpose", "");
  const [expDuration, setExpDuration] = usePersisted("expDuration", "");
  const [expVisitorVolume, setExpVisitorVolume] = usePersisted("expVisitorVolume", "");
  const [expFootprint, setExpFootprint] = usePersisted("expFootprint", "");
  const [expTheme, setExpTheme] = usePersisted("expTheme", "");
  const [expTones, setExpTones] = usePersisted("expTones", []);

  // Step 3 — Physical Features
  const [physicalFeatures, setPhysicalFeatures] = usePersisted(
    "physicalFeatures",
    () => Object.fromEntries(PHYSICAL_FEATURES.map((f) => [f, { ...DEFAULT_FEATURE_ROW }]))
  );

  const updateFeature = (name, field, value) =>
    setPhysicalFeatures((prev) => ({
      ...prev,
      [name]: { ...prev[name], [field]: value },
    }));

  // Step 4 — Operational Controls
  const [ocTicketingType, setOcTicketingType] = usePersisted("ocTicketingType", "");      // top-level ticketing type
  const [ocTicketingSub, setOcTicketingSub] = usePersisted("ocTicketingSub", "");         // sub-option per type
  const [ocTimedCapacity, setOcTimedCapacity] = usePersisted("ocTimedCapacity", "");      // numeric, only for Timed Entry
  const [ocPricing, setOcPricing] = usePersisted("ocPricing", "");                        // pricing model
  const [ocTicketingModels, setOcTicketingModels] = usePersisted("ocTicketingModels", []); // legacy, retained for compatibility
  const [ocEntryTech, setOcEntryTech] = usePersisted("ocEntryTech", []);
  const [ocOutsideFood, setOcOutsideFood] = usePersisted("ocOutsideFood", "");
  const [ocReEntry, setOcReEntry] = usePersisted("ocReEntry", "");
  const [ocMedPolicy, setOcMedPolicy] = usePersisted("ocMedPolicy", "");                   // medication policy (dropdown)
  const [ocMedStorage, setOcMedStorage] = usePersisted("ocMedStorage", "");               // medication storage (dropdown)
  const [ocPhonesPermitted, setOcPhonesPermitted] = usePersisted("ocPhonesPermitted", "");
  const [ocRestrictedZones, setOcRestrictedZones] = usePersisted("ocRestrictedZones", "");
  const [ocScreeningTech, setOcScreeningTech] = usePersisted("ocScreeningTech", []);
  const [ocHseRisk, setOcHseRisk] = usePersisted("ocHseRisk", "");                         // HSE crowd risk level (dropdown)
  const [ocHseEvac, setOcHseEvac] = usePersisted("ocHseEvac", "");                         // HSE evacuation readiness (dropdown)
  const [ocHseMedical, setOcHseMedical] = usePersisted("ocHseMedical", "");               // HSE medical provision (dropdown)
  const [ocCrowdNotes, setOcCrowdNotes] = usePersisted("ocCrowdNotes", "");
  const [ocOpenSections, setOcOpenSections] = useState({ 0: true, 1: false, 2: false, 3: false, 4: false, 5: false });

  const toggleOcSection = (idx) =>
    setOcOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const toggleCheckbox = (setter) => (val) =>
    setter((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  // Step 5 — Stakeholders
  const [shTiers, setShTiers] = usePersisted("shTiers", []);
  const [shNationalities, setShNationalities] = usePersisted("shNationalities", "");
  const [shReligious, setShReligious] = usePersisted("shReligious", "");
  const [shPrimaryLang, setShPrimaryLang] = usePersisted("shPrimaryLang", "");
  const [shSecondaryLang, setShSecondaryLang] = usePersisted("shSecondaryLang", "");

  // Step 6 — Priorities & Template
  const [motivations, setMotivations] = usePersisted(
    "motivations",
    () => Object.fromEntries(MOTIVATIONS.map((m) => [m, ""]))
  );
  const [outcomes, setOutcomes] = usePersisted(
    "outcomes",
    () => Object.fromEntries(OUTCOMES.map((o) => [o, { rank: "", priority: "" }]))
  );
  const updateMotivation = (name, val) =>
    setMotivations((prev) => ({ ...prev, [name]: val }));
  const updateOutcome = (name, field, val) =>
    setOutcomes((prev) => ({ ...prev, [name]: { ...prev[name], [field]: val } }));

  // Step 7 — Template Selection
  const [primaryTemplate, setPrimaryTemplate] = usePersisted("primaryTemplate", null);
  const [secondaryTemplate, setSecondaryTemplate] = usePersisted("secondaryTemplate", null);

  // Step 8 — Review & AI Generation
  const [reviewOpenSections, setReviewOpenSections] = useState({ 0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false });
  const toggleReviewSection = (idx) =>
    setReviewOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  const [aiOutput, setAiOutput] = usePersisted("aiOutput", "");
  const [briefData, setBriefData] = usePersisted("briefData", null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [briefOpenSections, setBriefOpenSections] = useState({});

  const handleGenerateBrief = async () => {
    setAiLoading(true);
    setAiError("");
    setAiOutput("");
    setBriefData(null);

    const TEMPLATES_LABEL = {
      "double-diamond": "Double Diamond Experience Map",
      "service-blueprint": "Service Blueprint Model",
      "jtbd": "Jobs-to-Be-Done",
      "emotional-curve": "Emotional Experience Curve",
      "stakeholder-ecosystem": "Stakeholder Ecosystem Map",
      "lean-cx": "Lean CX Sprint Map",
    };

    const systemPrompt = `You are an expert visitor experience design consultant. Generate a structured Experience Design Brief as a single valid JSON object.

CRITICAL RULES:
- Output ONLY raw JSON. Start with { and end with }. Zero text before or after.
- Keep all string values concise: max 2 sentences per description field.
- Arrays: max 4 items each.

Required top-level keys and shapes:
{
  "sector_context": { "sector": str, "sub_type": str, "summary": str },
  "thematic_architecture": { "primary_theme": str, "experience_tones": [str], "purpose": str, "daily_volume": str, "footprint": str, "narrative_direction": str },
  "physical_inventory": { "assessed_features": [{"name":str,"present":str,"quality":str,"priority":str}], "gaps": [str], "recommendations": [str] },
  "operational_controls": { "ticketing_models": [str], "entry_technologies": [str], "fb_policy": {"outside_food":str,"re_entry":str}, "medication_policy": str, "mobile_policy": {"phones_permitted":str,"restricted_zones":str}, "security_screening": [str], "operational_notes": str },
  "stakeholder_map": { "active_tiers": [str], "audience_profile": {"nationalities":str,"primary_language":str,"secondary_language":str,"religious_considerations":str}, "tier_implications": [{"tier":str,"implication":str}] },
  "motivational_landscape": { "motivations": [{"name":str,"priority":str}], "dominant_motivation": str, "strategic_insight": str },
  "priority_heat_map": { "outcomes": [{"name":str,"rank":str,"priority":str}], "top_3": [str,str,str], "strategic_focus": str },
  "selected_template": { "primary": str, "secondary": str, "rationale": str },
  "known_friction_zones": [{"zone":str,"description":str,"severity":str,"recommendation":str}],
  "success_criteria": [{"criterion":str,"metric":str,"target":str}],
  "gap_annotations": [{"area":str,"gap_description":str,"impact":str,"suggested_action":str}]
}`;

    const pfData = PHYSICAL_FEATURES
      .filter(f => physicalFeatures[f].present)
      .map(f => ({
        name: f,
        present: physicalFeatures[f].present,
        quality: physicalFeatures[f].quality || "Not assessed",
        priority: physicalFeatures[f].priority || "Not set",
      }));

    // Only include non-empty fields to reduce payload size
    const userMessage = JSON.stringify({
      sector: selectedSector?.label || null,
      sub_type: selectedSubtype || null,
      purpose: expPurpose,
      daily_visitors: expVisitorVolume, footprint: expFootprint,
      theme: expTheme, tones: expTones,
      physical_features: pfData,
      ticketing: { type: ocTicketingType, option: ocTicketingSub, capacity_per_slot: ocTimedCapacity, pricing: ocPricing },
      entry_tech: ocEntryTech,
      outside_food: ocOutsideFood, re_entry: ocReEntry,
      medication: { policy: ocMedPolicy, storage: ocMedStorage },
      screening: ocScreeningTech,
      hse: { crowd_risk: ocHseRisk, evacuation: ocHseEvac, medical: ocHseMedical },
      stakeholder_tiers: shTiers,
      nationalities: shNationalities,
      primary_language: shPrimaryLang, secondary_language: shSecondaryLang,
      religious: shReligious,
      motivations: Object.entries(motivations).filter(([,v])=>v).map(([k,v])=>({name:k,priority:v})),
      outcomes: Object.entries(outcomes).filter(([,v])=>v.rank||v.priority).map(([k,v])=>({name:k,rank:v.rank,priority:v.priority})),
      primary_template: primaryTemplate ? TEMPLATES_LABEL[primaryTemplate] : null,
      secondary_template: secondaryTemplate ? TEMPLATES_LABEL[secondaryTemplate] : null,
    });

    try {
      await wait(FAKE_DELAY);
      const pfList = PHYSICAL_FEATURES
        .filter(f => physicalFeatures[f].present)
        .map(f => ({ name: f, present: physicalFeatures[f].present, quality: physicalFeatures[f].quality || "Not assessed", priority: physicalFeatures[f].priority || "Not set" }));
      const parsed = buildSampleBrief({
        sectorId: selectedSector?.id,
        sector: selectedSector?.label,
        subType: selectedSubtype,
        purpose: expPurpose,
        volume: expVisitorVolume,
        footprint: expFootprint,
        theme: expTheme,
        tones: expTones,
        physicalFeatures: pfList,
        ticketingType: ocTicketingType,
        pricing: ocPricing,
        entryTech: ocEntryTech,
        outsideFood: ocOutsideFood,
        reEntry: ocReEntry,
        medPolicy: ocMedPolicy,
        phones: ocPhonesPermitted,
        restrictedZones: ocRestrictedZones,
        screening: ocScreeningTech,
        hseRisk: ocHseRisk,
        hseEvac: ocHseEvac,
        tiers: shTiers,
        nationalities: shNationalities,
        primaryLang: shPrimaryLang,
        secondaryLang: shSecondaryLang,
        religious: shReligious,
        motivations: Object.entries(motivations).filter(([, v]) => v).map(([k, v]) => ({ name: k, priority: v })),
        outcomes: Object.entries(outcomes).filter(([, v]) => v.rank || v.priority).map(([k, v]) => ({ name: k, rank: v.rank, priority: v.priority })),
        primaryTemplate: primaryTemplate ? TEMPLATES_LABEL[primaryTemplate] : null,
        secondaryTemplate: secondaryTemplate ? TEMPLATES_LABEL[secondaryTemplate] : null,
      });

      setBriefData(parsed);
      setBriefOpenSections(Object.fromEntries(Object.keys(parsed).map((k, i) => [k, i === 0])));
      setAiOutput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setAiError(err.message);
      console.error("Brief generation error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownloadBrief = () => {
    if (!briefData) return;
    const blob = new Blob([JSON.stringify(briefData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "vx-experience-design-brief.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // Stage 2 — Benchmark Intelligence
  const [benchmarkData, setBenchmarkData] = usePersisted("benchmarkData", null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);
  const [benchmarkError, setBenchmarkError] = useState("");
  const [benchmarkOpenCards, setBenchmarkOpenCards] = useState({});
  const [activeBenchmarkCategory, setActiveBenchmarkCategory] = useState(null);

  const BENCHMARK_CATEGORIES = [
    { key: "archetype_patterns",      label: "Archetype Patterns",       icon: "◈" },
    { key: "journey_inflection_points",label: "Journey Inflection Points",icon: "◎" },
    { key: "proven_design_levers",    label: "Proven Design Levers",     icon: "▣" },
    { key: "operational_benchmarks",  label: "Operational Benchmarks",   icon: "⬡" },
    { key: "failure_mode_library",    label: "Failure Mode Library",     icon: "◍" },
    { key: "kpi_norms",               label: "KPI Norms",                icon: "◆" },
  ];

  const handleRunBenchmark = async () => {
    if (!briefData) return;
    setBenchmarkLoading(true);
    setBenchmarkError("");
    setBenchmarkData(null);

    const top3 = briefData?.priority_heat_map?.top_3 || [];
    const sector = briefData?.sector_context?.sector || "visitor experience";

    const systemPrompt = `You are a global visitor experience benchmarking expert.

Produce a Benchmark Insight Layer as a single valid JSON object. Apply 3 filter gates per entry (Relevance, Feasibility, Recency) and assign confidence: "High", "Medium", or "Low".

CRITICAL: Output ONLY raw JSON starting with { and ending with }. No markdown, no preamble.
Keep all string values concise (1-2 sentences max). Max 3 entries per array.

Required JSON shape:
{
  "meta": { "top_3_outcomes": [str], "sector": str, "generated_for": str },
  "archetype_patterns": [{ "id": str, "title": str, "institution": str, "outcome_link": str, "description": str, "filter_relevance": str, "filter_feasibility": str, "filter_recency": str, "confidence": str, "key_takeaway": str }],
  "journey_inflection_points": [{ "id": str, "stage": str, "moment": str, "institution": str, "what_works": str, "what_fails": str, "confidence": str, "outcome_link": str }],
  "proven_design_levers": [{ "id": str, "lever_name": str, "mechanic": str, "institution": str, "measurable_impact": str, "confidence": str, "applicability_note": str }],
  "operational_benchmarks": [{ "id": str, "kpi": str, "benchmark_value": str, "institution": str, "context": str, "confidence": str, "outcome_link": str }],
  "failure_mode_library": [{ "id": str, "failure_mode": str, "root_cause": str, "institution": str, "consequence": str, "mitigation": str, "confidence": str }],
  "kpi_norms": [{ "id": str, "kpi_name": str, "industry_low": str, "industry_avg": str, "industry_high": str, "unit": str, "source_type": str, "outcome_link": str, "confidence": str }]
}`;

    // Send only the essential brief summary, not the full JSON
    const briefSummary = {
      sector: briefData?.sector_context?.sector,
      sub_type: briefData?.sector_context?.sub_type,
      top_3_outcomes: top3,
      primary_template: briefData?.selected_template?.primary,
      key_motivations: (briefData?.motivational_landscape?.motivations || []).filter(m => m.priority === "High").map(m => m.name),
      known_gaps: briefData?.gap_annotations?.map(g => g.area) || [],
      friction_zones: briefData?.known_friction_zones?.map(z => z.zone) || [],
    };

    try {
      await wait(FAKE_DELAY);
      const parsed = buildSampleBenchmark({ sectorId: briefData?.sector_context?.sector_id || selectedSector?.id, sector, top3 });

      setBenchmarkData(parsed);
      setActiveBenchmarkCategory(BENCHMARK_CATEGORIES[0].key);
      const initCards = {};
      BENCHMARK_CATEGORIES.forEach(c => {
        (parsed[c.key] || []).forEach((_, i) => { initCards[`${c.key}-${i}`] = false; });
      });
      setBenchmarkOpenCards(initCards);
    } catch (err) {
      setBenchmarkError(err.message);
      console.error("Benchmark error:", err);
    } finally {
      setBenchmarkLoading(false);
    }
  };

  const handleDownloadBenchmark = () => {
    if (!benchmarkData) return;
    const blob = new Blob([JSON.stringify(benchmarkData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "vx-benchmark-intelligence.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // ──────────────────────────────────────────────────────────
  // Stage 3 — Visitor Persona Synthesis Engine
  // ──────────────────────────────────────────────────────────
  const [personaData, setPersonaData] = usePersisted("personaData", null);   // { long_list:[...], coverage_validation:[...] }
  const [personaLoading, setPersonaLoading] = useState(false);
  const [personaError, setPersonaError] = useState("");
  const [personaSelections, setPersonaSelections] = usePersisted("personaSelections", {}); // { [persona_id]: "include"|"exclude"|"secondary" }
  const [fullPersonas, setFullPersonas] = usePersisted("fullPersonas", null); // { personas:[...], comparison_matrix:[...] }
  const [fullPersonaLoading, setFullPersonaLoading] = useState(false);
  const [fullPersonaError, setFullPersonaError] = useState("");
  const [personaOpenCards, setPersonaOpenCards] = useState({});
  const [fullPersonaOpenCards, setFullPersonaOpenCards] = useState({});

  // Shared generation feedback: elapsed timer + cancel handle
  const abortRef = useRef(null);
  const manualCancelRef = useRef(false);
  // Refs to scroll the freshly-generated stage output to the top of the viewport
  const mainPanelRef = useRef(null);
  const briefOutRef = useRef(null);
  const benchmarkOutRef = useRef(null);
  const personaOutRef = useRef(null);
  const journeyOutRef = useRef(null);
  const scrollToOutput = (ref) => {
    // Each stage should open at the very top of the right panel
    setTimeout(() => {
      try {
        if (mainPanelRef.current) mainPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
        else ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {}
    }, 130);
  };
  // Scroll the right panel to a specific anchored section (used by left-nav sub-items)
  const scrollToAnchor = (anchorId) => {
    setTimeout(() => {
      try {
        const el = document.getElementById(anchorId);
        if (el && mainPanelRef.current) {
          const top = el.offsetTop - 12;
          mainPanelRef.current.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      } catch (e) {}
    }, 80);
  };
  const [genElapsed, setGenElapsed] = useState(0);

  const cancelGeneration = () => {
    manualCancelRef.current = true;
    if (abortRef.current) { try { abortRef.current.abort(); } catch {} }
  };

  const setPersonaSelection = (id, choice) =>
    setPersonaSelections(prev => ({ ...prev, [id]: prev[id] === choice ? "" : choice }));

  const selectAllPersonas = () =>
    setPersonaSelections(() => Object.fromEntries((personaData?.long_list || []).map(p => [p.id, "include"])));
  const deselectAllPersonas = () =>
    setPersonaSelections(() => Object.fromEntries((personaData?.long_list || []).map(p => [p.id, "exclude"])));

  // Helper: pull a compact upstream context object for downstream stages
  const buildUpstreamContext = () => ({
    sector: briefData?.sector_context?.sector || selectedSector?.label,
    sub_type: briefData?.sector_context?.sub_type || selectedSubtype,
    theme: briefData?.thematic_architecture?.primary_theme || expTheme,
    tones: briefData?.thematic_architecture?.experience_tones || expTones,
    active_tiers: briefData?.stakeholder_map?.active_tiers || shTiers,
    audience: {
      nationalities: shNationalities,
      primary_language: shPrimaryLang,
      secondary_language: shSecondaryLang,
      religious: shReligious,
    },
    top_3_outcomes: briefData?.priority_heat_map?.top_3 || [],
    top_motivations: (briefData?.motivational_landscape?.motivations || [])
      .filter(m => m.priority === "High").map(m => m.name),
    primary_template: briefData?.selected_template?.primary,
    control_parameters: {
      ticketing_type: ocTicketingType, ticketing_option: ocTicketingSub,
      capacity_per_slot: ocTimedCapacity, pricing: ocPricing,
      outside_food: ocOutsideFood, re_entry: ocReEntry,
      medication_policy: ocMedPolicy, medication_storage: ocMedStorage,
      phones: ocPhonesPermitted, screening: ocScreeningTech,
      hse_crowd_risk: ocHseRisk, hse_evacuation: ocHseEvac, hse_medical: ocHseMedical,
    },
    friction_zones: (briefData?.known_friction_zones || []).map(z => z.zone),
    benchmark_archetypes: (benchmarkData?.archetype_patterns || []).map(a => a.title),
    benchmark_failure_modes: (benchmarkData?.failure_mode_library || []).map(f => f.failure_mode),
    benchmark_kpi_norms: (benchmarkData?.kpi_norms || []).map(k => ({ kpi: k.kpi_name, low: k.industry_low, avg: k.industry_avg, high: k.industry_high })),
  });

  const callClaude = async ({ system, user, maxTokens = 8000, useWeb = false, timeoutMs = 90000, retries = 1 }) => {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    };
    if (useWeb) body.tools = [{ type: "web_search_20250305", name: "web_search" }];

    manualCancelRef.current = false;
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      abortRef.current = controller;
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status}${txt ? ` — ${txt.slice(0, 200)}` : ""}`);
        }
        const data = await res.json();
        if (data.error) throw new Error(`API error: ${data?.error?.message || JSON.stringify(data.error).slice(0, 200)}`);
        const raw = (data.content || []).map(b => b.type === "text" ? b.text : (b.text || "")).filter(Boolean).join("");
        if (!raw) throw new Error("Empty response from API");
        const firstB = raw.indexOf("{"); const lastB = raw.lastIndexOf("}");
        if (firstB === -1 || lastB === -1) throw new Error(`No JSON found. Preview: ${raw.slice(0, 200)}`);
        try {
          return JSON.parse(raw.slice(firstB, lastB + 1));
        } catch {
          throw new Error(`Response truncated or malformed (${lastB - firstB} chars). Try again.`);
        }
      } catch (err) {
        clearTimeout(timer);
        if (err.name === "AbortError" && manualCancelRef.current) {
          throw new Error("Generation cancelled.");
        }
        lastErr = err.name === "AbortError"
          ? new Error(`Request timed out after ${Math.round(timeoutMs / 1000)}s. Retrying may help — the model can be slow under load.`)
          : err;
        // Only retry on timeout / network-style failures, not on explicit API errors
        const retryable = (err.name === "AbortError" && !manualCancelRef.current) || /failed to fetch|networkerror|load failed/i.test(err.message || "");
        if (attempt < retries && retryable) continue;
        throw lastErr;
      }
    }
    throw lastErr;
  };

  const handleGeneratePersonaLongList = async () => {
    if (!briefData) return;
    setPersonaLoading(true); setPersonaError(""); setPersonaData(null);
    setFullPersonas(null); setPersonaSelections({});

    const systemPrompt = `You are a visitor experience persona synthesis engine (Stage 3). Synthesise a candidate persona LONG LIST from the supplied Stage 1 Experience Design Brief and Stage 2 Benchmark Intelligence Layer.

RULES:
- Output ONLY raw JSON. Start with { and end with }. No markdown, no preamble.
- Generate 4-5 candidate personas derived from declared stakeholder tiers, the motivation landscape, the sector, benchmark archetypes, and accessibility requirements. Include at least one accessibility-constrained (POD) persona.
- Personas are differentiated by EXPERIENCE NEED profile, not demographic variation alone.
- Keep all string values concise (max 1-2 sentences).
- Assign sequential ids P-01, P-02, ...
- journey_complexity: "Low" | "Medium" | "High" | "Very High".
- recommended_inclusion: "Recommended" | "Optional" | "Secondary" — and set recommended_default accordingly ("include" for Recommended, "secondary" for Secondary, "exclude" for Optional).
- source_confidence: "High" | "Medium" | "Low".

Required JSON shape:
{
  "meta": { "sector": str, "total_candidates": int, "method": str },
  "long_list": [{
    "id": str, "name": str, "archetype": str, "tier": str, "segment": str,
    "source": str, "source_confidence": str,
    "motivation": str, "secondary_motivation": str,
    "strategic_value": str, "description": str,
    "journey_complexity": str, "recommended_inclusion": str,
    "risk_profile": str, "constraint_flags": [str], "pod_flag": bool,
    "recommended_default": "include" | "secondary" | "exclude"
  }],
  "did_you_account_for_this": [{ "archetype": str, "why_it_matters": str }]
}`;

    try {
      await wait(FAKE_DELAY);
      const parsed = buildSamplePersonaLongList({ sectorId: briefData?.sector_context?.sector_id || selectedSector?.id, sector: briefData?.sector_context?.sector || selectedSector?.label, selectedTiers: (briefData?.stakeholder_map?.active_tiers || shTiers || []) });
      setPersonaData(parsed);
      // seed selections from recommended defaults
      const seed = {};
      (parsed.long_list || []).forEach(p => { seed[p.id] = p.recommended_default || "include"; });
      setPersonaSelections(seed);
      const cards = {};
      (parsed.long_list || []).forEach((p, i) => { cards[p.id] = i < 3; });
      setPersonaOpenCards(cards);
    } catch (err) {
      setPersonaError(err.message);
      console.error("Persona long list error:", err);
    } finally {
      setPersonaLoading(false);
    }
  };

  const handleGenerateFullPersonas = async () => {
    if (!personaData) return;
    const selected = (personaData.long_list || []).filter(
      p => personaSelections[p.id] === "include" || personaSelections[p.id] === "secondary"
    );
    if (selected.length === 0) { setFullPersonaError("Select at least one persona to journey-map."); return; }
    setFullPersonaLoading(true); setFullPersonaError(""); setFullPersonas(null);

    const systemPrompt = `You are a visitor experience persona synthesis engine (Stage 3). For the SELECTED candidate personas, run a Coverage Validation Engine, generate complete Full Persona Cards, and produce a Persona Comparison Matrix.

RULES:
- Output ONLY raw JSON. Start with { and end with }. No markdown, no preamble.
- Keep every string concise (max 2 sentences). Arrays max 4 items.
- Preserve each persona's original id.
- Coverage Validation Engine runs EXACTLY these four checks in this order: "Stakeholder Coverage", "Accessibility Coverage", "Revenue Coverage", "Priority Outcome Coverage". status = "pass" | "fail".
- Matrix levels use: "Low" | "Medium" | "High" | "Very High" | "Critical" where sensible.

Required JSON shape:
{
  "coverage_validation": [{ "check": str, "status": str, "detail": str }],
  "personas": [{
    "id": str, "name": str, "archetype": str, "tier": str, "segment": str,
    "identity": str,
    "motivations": [str],
    "goals": [str],
    "pain_points": [str],
    "expectations": [str],
    "accessibility_needs": str,
    "digital_behaviour": str,
    "visit_behaviour": str,
    "spending_behaviour": str,
    "journey_risks": [str],
    "success_definition": str,
    "preferred_channels": [str],
    "key_emotional_drivers": [str],
    "strategic_classification": str,
    "pod_flag": bool
  }],
  "comparison_matrix": [{
    "id": str, "persona": str,
    "motivation": str, "spend_propensity": str, "journey_complexity": str,
    "accessibility_need": str, "loyalty_potential": str, "advocacy_potential": str,
    "strategic_value": str, "pod_flag": bool
  }]
}`;

    const payload = {
      context: buildUpstreamContext(),
      selected_personas: selected.map(p => ({
        id: p.id, name: p.name, given_name: p.given_name, archetype: p.archetype,
        tier: p.tier, segment: p.segment,
        motivation: p.motivation, secondary_motivation: p.secondary_motivation,
        description: p.description, journey_complexity: p.journey_complexity,
        constraint_flags: p.constraint_flags, pod_flag: p.pod_flag,
        classification: personaSelections[p.id] === "secondary" ? "Secondary" : "Primary",
      })),
    };

    try {
      await wait(FAKE_DELAY);
      const parsed = buildSampleFullPersonas(payload.selected_personas, briefData?.sector_context?.sector_id || selectedSector?.id);
      setFullPersonas(parsed);
      const cards = {};
      (parsed.personas || []).forEach((p, i) => { cards[p.id] = i === 0; });
      setFullPersonaOpenCards(cards);
    } catch (err) {
      setFullPersonaError(err.message);
      console.error("Full persona error:", err);
    } finally {
      setFullPersonaLoading(false);
    }
  };

  const handleDownloadPersonas = () => {
    const out = { long_list: personaData, selections: personaSelections, full_personas: fullPersonas };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "vx-persona-set.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // ──────────────────────────────────────────────────────────
  // Stage 4 — Journey Mapping, Moments of Truth & KPI Framework
  // ──────────────────────────────────────────────────────────
  const [journeyData, setJourneyData] = usePersisted("journeyData", null);  // { journeys:[{persona...}] }
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [journeyError, setJourneyError] = useState("");
  const [activeJourneyPersona, setActiveJourneyPersona] = useState(null);
  const [activeJourneyStage, setActiveJourneyStage] = useState(0);
  const [journeySubView, setJourneySubView] = useState("journey"); // journey | mot | kpi
  const [journeyMotOpen, setJourneyMotOpen] = useState({});

  // Tick an elapsed-seconds counter whenever a generation is in flight
  const anyGenLoading = personaLoading || fullPersonaLoading || journeyLoading;

  // Strict sequential gating of the four output stages (1=intake/brief .. 4=journey).
  // A stage's section only appears once the user clicks "Proceed to Next Stage".
  const [unlockedStage, setUnlockedStage] = usePersisted("unlockedStage", 1);
  // When true, the right panel shows the Consolidated Framework (own screen) instead of a stage.
  const [showConsolidated, setShowConsolidated] = useState(false);

  // Reset the right panel to its top ONLY when the screen is replaced
  // (changing intake step, or switching output stage). Never on generate.
  useEffect(() => {
    try { mainPanelRef.current?.scrollTo({ top: 0, behavior: "auto" }); } catch (e) {}
  }, [current, unlockedStage]);

  // On load, if outputs already exist (returning user), unlock up to the furthest generated stage
  // so their content isn't hidden behind Proceed buttons they already passed.
  useEffect(() => {
    const reached = journeyData ? 4 : (fullPersonas || personaData) ? 3 : benchmarkData ? 2 : 1;
    setUnlockedStage((u) => Math.max(u, reached));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!anyGenLoading) { setGenElapsed(0); return; }
    setGenElapsed(0);
    const started = Date.now();
    const id = setInterval(() => setGenElapsed(Math.round((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, [anyGenLoading]);

  const fmtElapsed = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const JOURNEY_STAGES = [
    { key: "pre_visit", label: "Pre-Visit", icon: "◈" },
    { key: "arrival", label: "Arrival", icon: "◉" },
    { key: "core_experience", label: "Core Experience", icon: "◎" },
    { key: "exit_departure", label: "Exit & Departure", icon: "▣" },
    { key: "post_visit", label: "Post-Visit", icon: "⬡" },
  ];

  const handleGenerateJourneys = async () => {
    if (!fullPersonas?.personas?.length) return;
    setJourneyLoading(true); setJourneyError(""); setJourneyData(null);

    const systemPrompt = `You are a visitor experience journey mapping engine (Stage 4). For EACH supplied persona, construct a complete end-to-end journey across five canonical stages, detect Moments of Truth, and define a tiered KPI framework.

RULES:
- Output ONLY raw JSON. Start with { and end with }. No markdown, no preamble.
- Keep every string concise (1-2 sentences). Per persona: limit touchpoints to the named sub-stages below, max 5 Moments of Truth, and produce KPIs across all three tiers.
- All content must be SPECIFIC to each persona's motivation, constraints and channel preferences. POD and VVIP personas get genuinely distinct journeys.
- The five stages and their required touchpoints:
  pre_visit: Discovery, Planning, Booking, Anticipation
  arrival: Transport, Parking, Security, Access Control, Orientation
  core_experience: Engagement, Staff Interaction, Digital Interaction, Retail, F&B, Rest & Recovery
  exit_departure: Departure, Final Impression, Last Purchase, Farewell
  post_visit: Feedback, Advocacy, Loyalty, Revisit
- Touchpoint fields: channel ("Digital"|"Physical"|"Human"|"Hybrid"), emotion (short phrase), and pain_level / delight_level / risk_level / accessibility_impact / operational_complexity / priority_score each as an integer 1-5.
- MoT detection signals: high emotion; known friction; benchmark sensitivity; first interaction; last interaction; accessibility dependency. classification = "Critical" | "High" | "Medium" | "Low".
- For EACH Moment of Truth produce ONE linked KPI. KPI tier = "Executive" | "Management" | "Operational". traffic_light = "Green" | "Amber" | "Red".

Required JSON shape:
{
  "journeys": [{
    "persona_id": str, "persona_name": str, "template_used": str,
    "stages": {
      "pre_visit":      { "summary": str, "touchpoints": [TP] },
      "arrival":        { "summary": str, "touchpoints": [TP] },
      "core_experience":{ "summary": str, "touchpoints": [TP] },
      "exit_departure": { "summary": str, "touchpoints": [TP] },
      "post_visit":     { "summary": str, "touchpoints": [TP] }
    },
    "moments_of_truth": [{
      "id": str, "name": str, "stage": str, "touchpoint": str,
      "classification": str, "reason_detected": str, "impact": str,
      "risk": str, "recommendation": str, "owner": str
    }],
    "kpis": [{
      "name": str, "tier": str, "metric_definition": str, "formula": str,
      "frequency": str, "target": str, "owner": str, "data_source": str,
      "leading_indicator": str, "lagging_indicator": str, "traffic_light": str,
      "linked_mot": str
    }]
  }]
}
where TP = { "name": str, "stage": str, "channel": str, "emotion": str, "pain_level": int, "delight_level": int, "risk_level": int, "accessibility_impact": int, "operational_complexity": int, "priority_score": int }`;

    const payload = {
      context: buildUpstreamContext(),
      template_used: briefData?.selected_template?.primary || "Custom",
      personas: fullPersonas.personas.map(p => ({
        id: p.id, name: p.name, tier: p.tier, segment: p.segment,
        motivations: p.motivations, goals: p.goals, pain_points: p.pain_points,
        expectations: p.expectations,
        emotional_drivers: p.key_emotional_drivers,
        preferred_channels: p.preferred_channels,
        accessibility: p.accessibility_needs,
        digital_behaviour: p.digital_behaviour,
        visit_behaviour: p.visit_behaviour,
        spending_behaviour: p.spending_behaviour,
        journey_risks: p.journey_risks,
        pod_flag: p.pod_flag,
      })),
    };

    try {
      await wait(FAKE_DELAY);
      const parsed = buildSampleJourneys(fullPersonas.personas, payload.template_used, briefData?.sector_context?.sector_id || selectedSector?.id);
      setJourneyData(parsed);
      const first = parsed.journeys?.[0]?.persona_id || null;
      setActiveJourneyPersona(first);
      setActiveJourneyStage(0);
      setJourneySubView("journey");
    } catch (err) {
      setJourneyError(err.message);
      console.error("Journey mapping error:", err);
    } finally {
      setJourneyLoading(false);
    }
  };

  const handleDownloadJourneys = () => {
    if (!journeyData) return;
    const blob = new Blob([JSON.stringify(journeyData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "vx-journey-map.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  // ── PDF generation via native print-to-PDF (no external library) ──
  const [pdfBusy, setPdfBusy] = useState("");

  const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const PDF_CSS = `
    @page { size: A4; margin: 16mm 14mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1A1F2E; margin: 0; background: #FFFFFF; }
    .pdf-wrap { padding: 0; }
    .pdf-head { border-bottom: 3px solid #4F46E5; padding-bottom: 16px; margin-bottom: 24px; }
    .pdf-eyebrow { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #4F46E5; font-weight: 700; }
    .pdf-title { font-size: 26px; font-weight: 800; color: #0F1320; margin: 6px 0 2px; }
    .pdf-sub { font-size: 12px; color: #6B7280; }
    .pdf-section { margin-bottom: 22px; page-break-inside: avoid; }
    .pdf-h2 { font-size: 15px; font-weight: 700; color: #312E81; margin: 0 0 10px; padding-bottom: 6px; border-bottom: 1px solid #E5E7EB; }
    .pdf-card { border: 1px solid #E5E7EB; border-radius: 10px; padding: 16px 18px; margin-bottom: 12px; page-break-inside: avoid; background: #FCFCFE; }
    .pdf-card-name { font-size: 16px; font-weight: 800; color: #1E1B4B; }
    .pdf-card-sub { font-size: 11px; color: #6366F1; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
    .pdf-kv { display: flex; gap: 10px; margin: 4px 0; font-size: 12px; }
    .pdf-k { color: #6B7280; min-width: 130px; font-weight: 600; }
    .pdf-v { color: #1F2937; flex: 1; }
    .pdf-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .pdf-chip { font-size: 10px; background: #EEF2FF; color: #4338CA; border-radius: 20px; padding: 3px 10px; font-weight: 600; }
    .pdf-pill { display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
    ul.pdf-list { margin: 4px 0; padding-left: 18px; } ul.pdf-list li { font-size: 12px; color: #1F2937; margin: 2px 0; }
    table.pdf-tbl { width: 100%; border-collapse: collapse; font-size: 11px; }
    table.pdf-tbl th { text-align: left; background: #F3F4F6; color: #374151; padding: 7px 9px; border: 1px solid #E5E7EB; font-weight: 700; }
    table.pdf-tbl td { padding: 6px 9px; border: 1px solid #E5E7EB; color: #1F2937; }
    .pdf-foot { margin-top: 18px; padding-top: 10px; border-top: 1px solid #E5E7EB; font-size: 9px; color: #9CA3AF; }
    .pdf-avatar { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 9px; color: #FFFFFF; font-weight: 800; font-size: 13px; margin-right: 10px; vertical-align: middle; }
    .pdf-persona-head { display: flex; align-items: center; margin-bottom: 6px; }
    .pdf-bar-row { display: flex; align-items: center; gap: 8px; margin: 3px 0; font-size: 10px; }
    .pdf-bar-k { min-width: 96px; color: #6B7280; font-weight: 600; }
    .pdf-bar-track { flex: 1; height: 8px; background: #EEF0F4; border-radius: 6px; overflow: hidden; display: block; }
    .pdf-bar-fill { display: block; height: 8px; border-radius: 6px; }
    .pdf-bar-v { min-width: 42px; text-align: right; font-weight: 700; }
    .pdf-tp { margin: 8px 0 12px; padding: 10px 12px; border: 1px solid #ECECF6; border-left: 3px solid #C7D2FE; border-radius: 8px; background: #FBFBFE; page-break-inside: avoid; }
    .pdf-tp-name { font-weight: 700; font-size: 12px; color: #1E1B4B; }
    .pdf-tp-channel { font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #4F46E5; background: #EEF0FF; border: 1px solid #D9DBFA; padding: 2px 8px; border-radius: 20px; margin-left: 6px; }
    .pdf-tp-line { font-size: 11px; color: #3F3D56; margin: 6px 0 8px; line-height: 1.45; }
    .pdf-bar-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 20px; }
    .pdf-curve { border: 1px solid #ECECF6; border-radius: 10px; padding: 12px 14px; margin: 8px 0 14px; background: #FBFBFE; page-break-inside: avoid; }
    .pdf-curve-title { font-size: 12px; font-weight: 700; color: #1E1B4B; margin-bottom: 2px; }
    .pdf-curve-sub { font-size: 10px; color: #6B7280; margin-bottom: 8px; }
    .pdf-curve svg { display: block; width: 100%; height: 70px; }
    .pdf-curve-labels { display: flex; justify-content: space-between; margin-top: 4px; gap: 4px; }
    .pdf-curve-lbl { font-size: 8px; color: #6B7280; flex: 1; text-align: center; }
    .pdf-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 20px; margin: 6px 0 12px; font-size: 10px; }
    .pdf-legend div { color: #475569; }
    .pdf-legend strong { color: #1E1B4B; }
  `;

  const renderPdfFromHtml = (innerHtml, title) => {
    const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${PDF_CSS}
      @media print { @page { margin: 14mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .pdf-toolbar { display: none !important; } }
      .pdf-toolbar { position: sticky; top: 0; background: #4F46E5; color: #fff; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; font-family: 'Helvetica Neue', Arial, sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 10; }
      .pdf-toolbar span { font-size: 13px; font-weight: 600; }
      .pdf-toolbar button { background: #fff; color: #4F46E5; border: none; border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 700; cursor: pointer; }
      .pdf-toolbar button:hover { background: #EEF0FF; }
    </style></head><body>
      <div class="pdf-toolbar"><span>${esc(title)} — use your browser's "Save as PDF"</span><button onclick="window.print()">⬇ Save as PDF</button></div>
      <div class="pdf-wrap">${innerHtml}<div class="pdf-foot">Generated by VX Journey Intelligence Engine · ${esc(new Date().toLocaleString())}</div></div>
    </body></html>`;
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow pop-ups for this site, then click Download PDF again. Your browser blocked the PDF window.");
      return;
    }
    win.document.open();
    win.document.write(doc);
    win.document.close();
    // Give the new window a moment to lay out, then auto-open the print dialog.
    win.onload = () => { try { win.focus(); setTimeout(() => win.print(), 350); } catch (e) {} };
    // Fallback if onload doesn't fire (some browsers with document.write)
    setTimeout(() => { try { win.focus(); win.print(); } catch (e) {} }, 800);
  };

  const HML = (n) => (n >= 4 ? "High" : n >= 3 ? "Med" : "Low");
  const hmlColor = (lvl, invert) => {
    const good = "#16A34A", mid = "#D97706", bad = "#DC2626";
    if (invert) return lvl === "High" ? good : lvl === "Med" ? mid : "#64748B"; // delight: high=good
    return lvl === "High" ? bad : lvl === "Med" ? mid : good;                    // severity: high=bad
  };
  const hmlPct = (lvl) => (lvl === "High" ? 100 : lvl === "Med" ? 60 : 35);
  const initialsOf = (name) => (name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  // Plain-language orientation + transition banner shown before each stage's results
  const STAGE_META = {
    1: { color: "#F59E0B", name: "Structured Intake" },
    2: { color: "#3B82F6", name: "Benchmark Intelligence" },
    3: { color: "#8B5CF6", name: "Persona Synthesis" },
    4: { color: "#10B981", name: "Journey Intelligence" },
  };
  const StageContext = ({ stage, where, done, expect, value, gate = "passed" }) => {
    const meta = STAGE_META[stage] || STAGE_META[1];
    return (
      <div className="stage-context" style={{ "--stage-color": meta.color }}>
        <div className="stage-context-banner" style={{ background: meta.color }}>
          <span className="stage-context-badge2">Stage {stage} of 4</span>
          <span className="stage-context-bannername">{meta.name}</span>
          <span className={`stage-context-gate ${gate}`}>{gate === "passed" ? "✓ Quality Gate passed" : "Quality Gate pending"}</span>
        </div>
        <div className="stage-context-grid">
          <div className="stage-context-item"><span className="stage-context-k">Where you are</span><span className="stage-context-v">{where}</span></div>
          <div className="stage-context-item"><span className="stage-context-k">What's done so far</span><span className="stage-context-v">{done}</span></div>
          <div className="stage-context-item"><span className="stage-context-k">What this gives you</span><span className="stage-context-v">{expect}</span></div>
          <div className="stage-context-item"><span className="stage-context-k">Why it matters</span><span className="stage-context-v">{value}</span></div>
        </div>
      </div>
    );
  };

  const handleExportBriefPDF = async () => {
    if (!briefData) return;
    setPdfBusy("brief");
    try {
      const b = briefData;
      const ta = b.thematic_architecture || {};
      const sec = b.sector_context || {};
      let html = `<div class="pdf-head"><div class="pdf-eyebrow">Stage 1 Output</div><div class="pdf-title">Experience Design Brief</div><div class="pdf-sub">${esc(sec.sector || selectedSector?.label || "")}${sec.sub_type ? " · " + esc(sec.sub_type) : ""}</div></div>`;
      html += `<div class="pdf-section"><div class="pdf-h2">Thematic Architecture</div><div class="pdf-card">`;
      html += `<div class="pdf-kv"><span class="pdf-k">Primary Theme</span><span class="pdf-v">${esc(ta.primary_theme)}</span></div>`;
      html += `<div class="pdf-kv"><span class="pdf-k">Purpose</span><span class="pdf-v">${esc(ta.purpose)}</span></div>`;
      html += `<div class="pdf-kv"><span class="pdf-k">Daily Volume</span><span class="pdf-v">${esc(ta.daily_volume)}</span></div>`;
      html += `<div class="pdf-kv"><span class="pdf-k">Footprint</span><span class="pdf-v">${esc(ta.footprint)}</span></div>`;
      if (ta.experience_tones?.length) html += `<div class="pdf-kv"><span class="pdf-k">Tones</span><span class="pdf-chips">${ta.experience_tones.map(t => `<span class="pdf-chip">${esc(t)}</span>`).join("")}</span></div>`;
      if (ta.narrative_direction) html += `<div class="pdf-kv"><span class="pdf-k">Narrative</span><span class="pdf-v">${esc(ta.narrative_direction)}</span></div>`;
      html += `</div></div>`;
      const tops = b.priority_heat_map?.top_3 || [];
      if (tops.length) html += `<div class="pdf-section"><div class="pdf-h2">Top Priority Outcomes</div><div class="pdf-card"><ul class="pdf-list">${tops.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></div>`;
      const mots = b.motivational_landscape?.motivations || [];
      if (mots.length) html += `<div class="pdf-section"><div class="pdf-h2">Motivational Landscape</div><table class="pdf-tbl"><tr><th>Motivation</th><th>Priority</th></tr>${mots.map(m => `<tr><td>${esc(m.name)}</td><td>${esc(m.priority)}</td></tr>`).join("")}</table></div>`;
      const fz = b.known_friction_zones || [];
      if (fz.length) html += `<div class="pdf-section"><div class="pdf-h2">Known Friction Zones</div><div class="pdf-card"><ul class="pdf-list">${fz.map(z => `<li>${esc(z.zone || z)}</li>`).join("")}</ul></div></div>`;
      if (b.selected_template?.primary) html += `<div class="pdf-section"><div class="pdf-h2">Selected Template</div><div class="pdf-card"><div class="pdf-kv"><span class="pdf-k">Primary</span><span class="pdf-v">${esc(b.selected_template.primary)}</span></div>${b.selected_template.secondary ? `<div class="pdf-kv"><span class="pdf-k">Secondary</span><span class="pdf-v">${esc(b.selected_template.secondary)}</span></div>` : ""}</div></div>`;
      await renderPdfFromHtml(html, "VX-Stage1-Experience-Design-Brief.pdf");
    } catch (e) { alert(e.message); } finally { setPdfBusy(""); }
  };

  const handleExportBenchmarkPDF = async () => {
    if (!benchmarkData) return;
    setPdfBusy("benchmark");
    try {
      let html = `<div class="pdf-head"><div class="pdf-eyebrow">Stage 2 Output</div><div class="pdf-title">Analysis for Global Leading Practices</div><div class="pdf-sub">${esc(benchmarkData.meta?.sector || "")}</div></div>`;
      const cats = [
        { key: "archetype_patterns", label: "Archetype Patterns", fields: ["title", "description"] },
        { key: "proven_levers", label: "Proven Experience Levers", fields: ["lever", "evidence"] },
        { key: "failure_mode_library", label: "Failure Mode Library", fields: ["failure_mode", "consequence"] },
        { key: "kpi_norms", label: "KPI Norms", fields: ["kpi_name", "industry_avg"] },
      ];
      cats.forEach(c => {
        const arr = benchmarkData[c.key] || [];
        if (!arr.length) return;
        html += `<div class="pdf-section"><div class="pdf-h2">${esc(c.label)}</div>`;
        arr.forEach(item => {
          html += `<div class="pdf-card">`;
          Object.keys(item).forEach(k => {
            const v = item[k];
            if (v == null || v === "") return;
            html += `<div class="pdf-kv"><span class="pdf-k">${esc(k.replace(/_/g, " "))}</span><span class="pdf-v">${Array.isArray(v) ? esc(v.join(", ")) : esc(v)}</span></div>`;
          });
          html += `</div>`;
        });
        html += `</div>`;
      });
      await renderPdfFromHtml(html, "VX-Stage2-Global-Leading-Practices.pdf");
    } catch (e) { alert(e.message); } finally { setPdfBusy(""); }
  };

  const handleExportPersonasPDF = async () => {
    if (!personaData && !fullPersonas) return;
    setPdfBusy("persona");
    try {
      let html = `<div class="pdf-head"><div class="pdf-eyebrow">Stage 3 Output</div><div class="pdf-title">Visitor Persona Long List for Selection</div><div class="pdf-sub">${esc(personaData?.meta?.sector || "")}</div></div>`;
      const full = fullPersonas?.personas || [];
      if (full.length) {
        const cv = fullPersonas.coverage_validation || [];
        if (cv.length) {
          html += `<div class="pdf-section"><div class="pdf-h2">Coverage Validation</div><table class="pdf-tbl"><tr><th>Check</th><th>Status</th><th>Detail</th></tr>${cv.map(v => `<tr><td>${esc(v.check)}</td><td><span class="pdf-pill" style="background:${v.status === "pass" ? "#DCFCE7" : "#FEE2E2"};color:${v.status === "pass" ? "#166534" : "#991B1B"}">${v.status === "pass" ? "PASS" : "FAIL"}</span></td><td>${esc(v.detail)}</td></tr>`).join("")}</table></div>`;
        }
        html += `<div class="pdf-section"><div class="pdf-h2">Full Persona Cards</div>`;
        full.forEach(p => {
          html += `<div class="pdf-card"><div class="pdf-persona-head"><span class="pdf-avatar" style="background:${p.pod_flag ? "#0E7A8A" : "#4F46E5"}">${esc(initialsOf(p.name))}</span><div><div class="pdf-card-name">${esc(p.name)}${p.pod_flag ? ' <span class="pdf-pill" style="background:#CFFAFE;color:#0E7490">POD</span>' : ""}</div><div class="pdf-card-sub" style="margin:0">${esc(p.archetype)} · ${esc(p.tier)}${p.segment ? " · " + esc(p.segment) : ""}</div></div></div>`;
          if (p.identity) html += `<div class="pdf-kv"><span class="pdf-k">Identity</span><span class="pdf-v">${esc(p.identity)}</span></div>`;
          const arr = (k, label) => (p[k]?.length ? `<div class="pdf-kv"><span class="pdf-k">${label}</span><span class="pdf-v"><ul class="pdf-list">${p[k].map(x => `<li>${esc(x)}</li>`).join("")}</ul></span></div>` : "");
          html += arr("motivations", "Motivations") + arr("goals", "Goals") + arr("pain_points", "Pain Points") + arr("expectations", "Expectations") + arr("journey_risks", "Journey Risks") + arr("key_emotional_drivers", "Emotional Drivers");
          const kv = (k, label) => (p[k] ? `<div class="pdf-kv"><span class="pdf-k">${label}</span><span class="pdf-v">${esc(p[k])}</span></div>` : "");
          html += kv("accessibility_needs", "Accessibility") + kv("digital_behaviour", "Digital Behaviour") + kv("visit_behaviour", "Visit Behaviour") + kv("spending_behaviour", "Spending") + kv("success_definition", "Success Definition");
          if (p.preferred_channels?.length) html += `<div class="pdf-kv"><span class="pdf-k">Channels</span><span class="pdf-chips">${p.preferred_channels.map(c => `<span class="pdf-chip">${esc(c)}</span>`).join("")}</span></div>`;
          html += `</div>`;
        });
        html += `</div>`;
        const matrix = fullPersonas.comparison_matrix || [];
        if (matrix.length) html += `<div class="pdf-section"><div class="pdf-h2">Persona Comparison Matrix</div><table class="pdf-tbl"><tr><th>Persona</th><th>Motivation</th><th>Spend</th><th>Complexity</th><th>Accessibility</th><th>Loyalty</th><th>Advocacy</th><th>Strategic</th></tr>${matrix.map(m => `<tr><td>${esc(m.persona)}</td><td>${esc(m.motivation)}</td><td>${esc(m.spend_propensity)}</td><td>${esc(m.journey_complexity)}</td><td>${esc(m.accessibility_need)}</td><td>${esc(m.loyalty_potential)}</td><td>${esc(m.advocacy_potential)}</td><td>${esc(m.strategic_value)}</td></tr>`).join("")}</table></div>`;
      } else if (personaData?.long_list) {
        html += `<div class="pdf-section"><div class="pdf-h2">Candidate Personas</div>`;
        personaData.long_list.forEach(p => {
          html += `<div class="pdf-card"><div class="pdf-card-name">${esc(p.name)}${p.pod_flag ? " · POD" : ""}</div><div class="pdf-card-sub">${esc(p.archetype)} · ${esc(p.tier)}</div>`;
          if (p.description) html += `<div class="pdf-kv"><span class="pdf-k">Description</span><span class="pdf-v">${esc(p.description)}</span></div>`;
          html += `<div class="pdf-kv"><span class="pdf-k">Motivation</span><span class="pdf-v">${esc(p.motivation)}</span></div>`;
          html += `<div class="pdf-kv"><span class="pdf-k">Strategic Value</span><span class="pdf-v">${esc(p.strategic_value)}</span></div>`;
          html += `<div class="pdf-kv"><span class="pdf-k">Journey Complexity</span><span class="pdf-v">${esc(p.journey_complexity)}</span></div>`;
          html += `<div class="pdf-kv"><span class="pdf-k">Recommended</span><span class="pdf-v">${esc(p.recommended_inclusion)}</span></div></div>`;
        });
        html += `</div>`;
      }
      await renderPdfFromHtml(html, "VX-Stage3-Visitor-Personas.pdf");
    } catch (e) { alert(e.message); } finally { setPdfBusy(""); }
  };

  const handleExportJourneysPDF = async () => {
    if (!journeyData?.journeys?.length) return;
    setPdfBusy("journey");
    try {
      const STAGE_LABELS = { pre_visit: "Pre-Visit", arrival: "Arrival", core_experience: "Core Experience", exit_departure: "Exit & Departure", post_visit: "Post-Visit" };
      const barColor = (lvl, invert) => (invert ? (lvl === "High" ? "#16A34A" : lvl === "Med" ? "#D97706" : "#94A3B8") : (lvl === "High" ? "#DC2626" : lvl === "Med" ? "#D97706" : "#16A34A"));
      let html = `<div class="pdf-head"><div class="pdf-eyebrow">Stage 4 Output</div><div class="pdf-title">Journey Maps, Moments of Truth & KPIs</div><div class="pdf-sub">${journeyData.journeys.length} persona journeys</div></div>`;
      html += `<div class="pdf-legend"><div><strong>Pain</strong> — how frustrating the step is (lower is better)</div><div><strong>Delight</strong> — how positive it feels (higher is better)</div><div><strong>Risk</strong> — chance it goes wrong (lower is better)</div><div><strong>Access. Barrier</strong> — difficulty for accessibility needs (lower is better)</div><div><strong>Ops Effort</strong> — staff effort to run it well (lower is easier)</div><div><strong>Priority</strong> — how important to get right (higher = focus here)</div></div>`;
      journeyData.journeys.forEach(j => {
        html += `<div class="pdf-section"><div class="pdf-h2">${esc(j.persona_name)} — Journey Map</div>`;
        Object.keys(STAGE_LABELS).forEach(sk => {
          const st = j.stages?.[sk];
          if (!st) return;
          html += `<div class="pdf-card"><div class="pdf-card-sub">${esc(STAGE_LABELS[sk])}</div>`;
          if (st.summary) html += `<div class="pdf-v" style="margin-bottom:8px">${esc(st.summary)}</div>`;

          // Emotional curve for this stage
          const tps = st.touchpoints || [];
          if (tps.some(t => t.sentiment != null)) {
            const pts = tps.map(t => t.sentiment ?? 50);
            const n = pts.length, W = 100, H = 40;
            const xy = pts.map((s, i) => [n === 1 ? W / 2 : (i / (n - 1)) * W, H - (s / 100) * H]);
            const path = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
            const area = `${path} L${W},${H} L0,${H} Z`;
            html += `<div class="pdf-curve"><div class="pdf-curve-title">Emotional Curve</div><div class="pdf-curve-sub">How the visitor feels across this stage — peaks are delight, dips are friction</div>`;
            html += `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="g_${j.persona_id}_${sk}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7C3AED" stop-opacity="0.28"/><stop offset="100%" stop-color="#7C3AED" stop-opacity="0.03"/></linearGradient></defs>`;
            html += `<path d="${area}" fill="url(#g_${j.persona_id}_${sk})"/><path d="${path}" fill="none" stroke="#6D28D9" stroke-width="1.4" vector-effect="non-scaling-stroke"/>`;
            html += xy.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="1.8" fill="#6D28D9" vector-effect="non-scaling-stroke"/>`).join("");
            html += `</svg><div class="pdf-curve-labels">${tps.map(t => `<span class="pdf-curve-lbl">${esc(t.name)}</span>`).join("")}</div></div>`;
          }

          tps.forEach(tp => {
            html += `<div class="pdf-tp"><div><span class="pdf-tp-name">${esc(tp.name)}</span><span class="pdf-tp-channel">${esc(tp.channel)}</span></div>`;
            if (tp.emotion_line || tp.emotion) html += `<div class="pdf-tp-line">${esc(tp.emotion_line || tp.emotion)}</div>`;
            const bar = (label, n, invert) => { const lvl = HML(n); const c = barColor(lvl, invert); return `<div class="pdf-bar-row"><span class="pdf-bar-k">${label}</span><span class="pdf-bar-track"><span class="pdf-bar-fill" style="width:${hmlPct(lvl)}%;background:${c}"></span></span><span class="pdf-bar-v" style="color:${c}">${lvl}</span></div>`; };
            html += `<div class="pdf-bar-grid">`;
            html += bar("Pain", tp.pain_level) + bar("Delight", tp.delight_level, true) + bar("Risk", tp.risk_level) + bar("Access. Barrier", tp.accessibility_impact) + bar("Ops Effort", tp.operational_complexity);
            html += `<div class="pdf-bar-row"><span class="pdf-bar-k">Priority</span><span class="pdf-bar-track"><span class="pdf-bar-fill" style="width:${hmlPct(HML(tp.priority_score))}%;background:#4F46E5"></span></span><span class="pdf-bar-v" style="color:#4F46E5">${HML(tp.priority_score)}</span></div>`;
            html += `</div></div>`;
          });
          html += `</div>`;
        });
        const mots = j.moments_of_truth || [];
        if (mots.length) {
          html += `<div class="pdf-h2">Moments of Truth</div>`;
          mots.forEach(m => {
            const col = { Critical: "#DC2626", High: "#D97706", Medium: "#0891B2", Low: "#16A34A" }[m.classification] || "#6B7280";
            html += `<div class="pdf-card"><div class="pdf-card-name" style="font-size:14px">${esc(m.name || m.touchpoint)} <span class="pdf-pill" style="background:${col}22;color:${col}">${esc(m.classification)}</span></div><div class="pdf-card-sub">${esc(m.stage)} · ${esc(m.touchpoint)}</div>`;
            const kv = (k, label) => (m[k] ? `<div class="pdf-kv"><span class="pdf-k">${label}</span><span class="pdf-v">${esc(m[k])}</span></div>` : "");
            html += kv("reason_detected", "Reason Detected") + kv("impact", "Impact") + kv("risk", "Risk") + kv("recommendation", "Recommendation") + kv("owner", "Owner");
            html += `</div>`;
          });
        }
        const kpis = j.kpis || [];
        if (kpis.length) {
          html += `<div class="pdf-h2">KPI Framework</div><table class="pdf-tbl"><tr><th>KPI</th><th>Tier</th><th>Target</th><th>Owner</th><th>Frequency</th></tr>${kpis.map(k => `<tr><td>${esc(k.name)}</td><td>${esc(k.tier)}</td><td>${esc(k.target)}</td><td>${esc(k.owner)}</td><td>${esc(k.frequency)}</td></tr>`).join("")}</table>`;
        }
        html += `</div>`;
      });
      await renderPdfFromHtml(html, "VX-Stage4-Journey-Maps.pdf");
    } catch (e) { alert(e.message); } finally { setPdfBusy(""); }
  };

  const handleExportMoments = () => {
    if (!journeyData?.journeys) return;
    const out = {
      generated: new Date().toISOString(),
      moments_of_truth: journeyData.journeys.map(j => ({
        persona_id: j.persona_id, persona_name: j.persona_name,
        moments: j.moments_of_truth || [],
      })),
    };
    downloadJSON(out, "vx-moments-of-truth.json");
  };

  const handleExportKPIs = () => {
    if (!journeyData?.journeys) return;
    const all = [];
    journeyData.journeys.forEach(j => (j.kpis || []).forEach(k => all.push({ ...k, persona_id: j.persona_id, persona_name: j.persona_name })));
    const out = {
      generated: new Date().toISOString(),
      executive:   all.filter(k => k.tier === "Executive"),
      management:  all.filter(k => k.tier === "Management"),
      operational: all.filter(k => k.tier === "Operational"),
    };
    downloadJSON(out, "vx-kpi-framework.json");
  };

  const handleExportCompletePackage = () => {
    const pkg = {
      meta: { product: "VX Journey Intelligence Engine", exported: new Date().toISOString(), stages_complete: stageStatus.filter(s => s.status === "Completed").length },
      stage_1_intake: {
        sector: { label: selectedSector?.label, sub_type: selectedSubtype },
        experience_context: { purpose: expPurpose, daily_visitors: expVisitorVolume, footprint: expFootprint, theme: expTheme, tones: expTones },
        physical_features: Object.fromEntries(PHYSICAL_FEATURES.map(f => [f, physicalFeatures[f]])),
        operational_controls: { ticketing_type: ocTicketingType, ticketing_option: ocTicketingSub, capacity_per_slot: ocTimedCapacity, pricing: ocPricing, entry_tech: ocEntryTech, outside_food: ocOutsideFood, re_entry: ocReEntry, medication_policy: ocMedPolicy, medication_storage: ocMedStorage, phones_permitted: ocPhonesPermitted, restricted_zones: ocRestrictedZones, screening_tech: ocScreeningTech, hse_crowd_risk: ocHseRisk, hse_evacuation: ocHseEvac, hse_medical: ocHseMedical },
        stakeholders: { tiers: shTiers, nationalities: shNationalities, religious: shReligious, primary_language: shPrimaryLang, secondary_language: shSecondaryLang },
        motivations, outcomes,
        templates: { primary: primaryTemplate, secondary: secondaryTemplate },
        experience_design_brief: briefData,
      },
      stage_2_benchmark: benchmarkData,
      stage_3_personas: { long_list: personaData, selections: personaSelections, full_personas: fullPersonas },
      stage_4_journey: journeyData,
    };
    downloadJSON(pkg, "vx-complete-project-package.json");
  };

  const handleExportState = () => {
    const exportData = {
      sector: { label: selectedSector?.label, sub_type: selectedSubtype },
      experience_context: { purpose: expPurpose, daily_visitors: expVisitorVolume, footprint: expFootprint, theme: expTheme, tones: expTones },
      physical_features: Object.fromEntries(PHYSICAL_FEATURES.map(f => [f, physicalFeatures[f]])),
      operational_controls: { ticketing_type: ocTicketingType, ticketing_option: ocTicketingSub, capacity_per_slot: ocTimedCapacity, pricing: ocPricing, entry_tech: ocEntryTech, outside_food: ocOutsideFood, re_entry: ocReEntry, medication_policy: ocMedPolicy, medication_storage: ocMedStorage, phones_permitted: ocPhonesPermitted, restricted_zones: ocRestrictedZones, screening_tech: ocScreeningTech, hse_crowd_risk: ocHseRisk, hse_evacuation: ocHseEvac, hse_medical: ocHseMedical },
      stakeholders: { tiers: shTiers, nationalities: shNationalities, religious: shReligious, primary_language: shPrimaryLang, secondary_language: shSecondaryLang },
      motivations, outcomes,
      templates: { primary: primaryTemplate, secondary: secondaryTemplate },
      brief: briefData,
      benchmark: benchmarkData,
      persona_long_list: personaData,
      persona_selections: personaSelections,
      full_personas: fullPersonas,
      journey_map: journeyData,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "vx-journey-full-export.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    if (!window.confirm("Reset all data and start from the Welcome screen?")) return;
    // Clear localStorage
    const keys = ["current","unlockedStage","selectedSector","selectedSubtype","expPurpose","expVisitorVolume","expFootprint","expTheme","expTones","physicalFeatures","ocTicketingType","ocTicketingSub","ocTimedCapacity","ocPricing","ocTicketingModels","ocEntryTech","ocOutsideFood","ocReEntry","ocMedPolicy","ocMedStorage","ocPhonesPermitted","ocRestrictedZones","ocScreeningTech","ocHseRisk","ocHseEvac","ocHseMedical","ocCrowdNotes","shTiers","shNationalities","shReligious","shPrimaryLang","shSecondaryLang","motivations","outcomes","primaryTemplate","secondaryTemplate","aiOutput","briefData","benchmarkData","personaData","personaSelections","fullPersonas","journeyData"];
    keys.forEach(k => { try { localStorage.removeItem(`vx_${k}`); } catch {} });
    setCurrent(0); setUnlockedStage(1);
    setSelectedSector(null); setSelectedSubtype("");
    setExpPurpose(""); setExpDuration(""); setExpVisitorVolume(""); setExpFootprint(""); setExpTheme(""); setExpTones([]);
    setPhysicalFeatures(Object.fromEntries(PHYSICAL_FEATURES.map(f => [f, { ...DEFAULT_FEATURE_ROW }])));
    setOcTicketingModels([]); setOcEntryTech([]); setOcOutsideFood(""); setOcReEntry(""); setOcMedPolicy(""); setOcPhonesPermitted(""); setOcRestrictedZones(""); setOcScreeningTech([]); setOcCrowdNotes("");
    setOcOpenSections({ 0: true, 1: false, 2: false, 3: false, 4: false, 5: false });
    setShTiers([]); setShNationalities(""); setShReligious(""); setShPrimaryLang(""); setShSecondaryLang("");
    setMotivations(Object.fromEntries(MOTIVATIONS.map(m => [m, ""])));
    setOutcomes(Object.fromEntries(OUTCOMES.map(o => [o, { rank: "", priority: "" }])));
    setPrimaryTemplate(null); setSecondaryTemplate(null);
    setAiOutput(""); setBriefData(null); setAiError(""); setBriefOpenSections({});
    setBenchmarkData(null); setBenchmarkError(""); setBenchmarkOpenCards({}); setActiveBenchmarkCategory(null);
    setPersonaData(null); setPersonaError(""); setPersonaSelections({}); setPersonaOpenCards({});
    setFullPersonas(null); setFullPersonaError(""); setFullPersonaOpenCards({});
    setJourneyData(null); setJourneyError(""); setActiveJourneyPersona(null); setActiveJourneyStage(0); setJourneySubView("journey"); setJourneyMotOpen({});
    setReviewOpenSections({ 0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false });
    setSidebarOpen(false);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userToggledStages, setUserToggledStages] = useState({});
  // Overall journey progress: intake steps (0-8) weighted to 50%, the 3 generated outputs the other 50%.
  const intakeFrac = Math.min(current, 8) / 8; // 0..1 across intake
  const outputsDone = (benchmarkData ? 1 : 0) + ((fullPersonas || personaData) ? 1 : 0) + (journeyData ? 1 : 0);
  const overallProgress = Math.round(intakeFrac * 50 + (outputsDone / 3) * 50);

  const toggleTone = (tone) =>
    setExpTones((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]
    );

  const goNext = () => setCurrent((c) => Math.min(c + 1, 8));
  const goBack = () => setCurrent((c) => Math.max(c - 1, 0));

  const progressPct = (current / 8) * 100;

  // ── Executive Program Dashboard — auto-derived stage status ──
  const intakeFieldsFilled = [
    !!selectedSector, !!selectedSubtype, !!expPurpose,
    !!expVisitorVolume, !!expFootprint, !!expTheme, expTones.length > 0,
    Object.values(physicalFeatures).some(r => r.present),
    (ocTicketingType || ocEntryTech.length || ocOutsideFood || ocScreeningTech.length || ocHseRisk) ? true : false,
    (shTiers.length || shNationalities || shPrimaryLang) ? true : false,
    Object.values(motivations).some(Boolean) || Object.values(outcomes).some(o => o.rank || o.priority),
    !!primaryTemplate,
  ];
  const intakePct = Math.round((intakeFieldsFilled.filter(Boolean).length / intakeFieldsFilled.length) * 100);

  const stageStatus = (() => {
    // Stage 1 — Intake + Brief
    const s1 = briefData ? "Completed" : (intakePct > 0 ? "In Progress" : "Not Started");
    const s1pct = briefData ? 100 : intakePct;
    // Stage 2 — Benchmark
    const s2 = benchmarkData ? "Completed" : (briefData ? "In Progress" : "Not Started");
    const s2pct = benchmarkData ? 100 : (briefData ? 40 : 0);
    // Stage 3 — Persona Synthesis
    const selCount = personaData ? Object.values(personaSelections).filter(v => v === "include" || v === "secondary").length : 0;
    const s3 = fullPersonas?.personas?.length ? "Completed" : (personaData ? "In Progress" : "Not Started");
    const s3pct = fullPersonas?.personas?.length ? 100 : (personaData ? (selCount > 0 ? 60 : 30) : 0);
    // Stage 4 — Journey / MoT / KPI
    const s4 = journeyData?.journeys?.length ? "Completed" : (fullPersonas?.personas?.length ? "In Progress" : "Not Started");
    const s4pct = journeyData?.journeys?.length ? 100 : (fullPersonas?.personas?.length ? 35 : 0);
    return [
      { id: 1, name: "Structured Intake Engine", objective: "Capture sector, context, controls, stakeholders & priorities into a machine-readable Experience Design Brief.", status: s1, pct: s1pct, icon: "◉" },
      { id: 2, name: "Benchmark Intelligence", objective: "Surgically extract sector-specific archetypes, proven levers, failure modes & KPI norms from global evidence.", status: s2, pct: s2pct, icon: "◈" },
      { id: 3, name: "Persona Synthesis", objective: "Generate a candidate persona long list, validate coverage & produce full persona cards and comparison matrix.", status: s3, pct: s3pct, icon: "◍" },
      { id: 4, name: "Journey Mapping & KPI Framework", objective: "Build per-persona journeys, detect Moments of Truth & define an ownership-assigned, three-tier KPI framework.", status: s4, pct: s4pct, icon: "◆" },
    ];
  })();

  const activeStageIndex = (() => {
    const inProg = stageStatus.findIndex(s => s.status === "In Progress");
    if (inProg !== -1) return inProg;
    const notStarted = stageStatus.findIndex(s => s.status === "Not Started");
    if (notStarted !== -1) return notStarted;
    return 3; // all complete → last
  })();

  return (
    <div
      style={{
        fontFamily: "'DM Mono', 'Courier New', monospace",
        background: "#EEF1F6",
        minHeight: "100vh",
        overflowX: "auto",
        overflowY: "auto",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .vx-shell {
          width: 100%;
          max-width: 1060px;
          min-height: 100dvh;
          background: #111418;
          border: 1px solid #1E2229;
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(200,240,74,0.04), 0 40px 80px rgba(0,0,0,0.7);
        }

        /* Top bar */
        .vx-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-bottom: 1px solid #1E2229;
          background: #0D1014;
          gap: 8px;
          flex-wrap: wrap;
        }
        .vx-topbar-left { display: flex; align-items: center; gap: 10px; }
        .vx-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C8F04A;
        }
        .vx-logo span { color: #8A95AA; margin: 0 5px; }
        .vx-badge {
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #5A6478;
          text-transform: uppercase;
        }
        .vx-topbar-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .vx-topbar-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 2px;
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: all 0.15s; border: 1px solid;
          white-space: nowrap;
        }
        .vx-topbar-btn.export {
          background: rgba(200,240,74,0.06); border-color: rgba(200,240,74,0.2); color: #C8F04A;
        }
        .vx-topbar-btn.export:hover { background: rgba(200,240,74,0.12); border-color: rgba(200,240,74,0.4); }
        .vx-topbar-btn.export:disabled { opacity: 0.3; cursor: not-allowed; }
        .vx-topbar-btn.reset {
          background: rgba(200,80,80,0.05); border-color: rgba(200,80,80,0.18); color: #C07070;
        }
        .vx-topbar-btn.reset:hover { background: rgba(200,80,80,0.12); border-color: rgba(200,80,80,0.35); }
        .vx-hamburger {
          display: none; align-items: center; justify-content: center;
          width: 30px; height: 30px; border: 1px solid #2A3040;
          background: transparent; cursor: pointer; color: #8A95AA;
          border-radius: 2px; font-size: 14px; flex-shrink: 0;
        }

        /* Rich progress bar */
        .vx-progress-wrap {
          background: #0A0C0F; border-bottom: 1px solid #1E2229;
          padding: 8px 16px; display: flex; align-items: center; gap: 12px;
        }
        .vx-progress-info {
          display: flex; align-items: center; justify-content: space-between;
          flex: 1; gap: 10px;
        }
        .vx-progress-step-label {
          font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A6478;
          white-space: nowrap; flex-shrink: 0;
        }
        .vx-progress-step-label strong { color: #C8F04A; }
        .vx-progress-track {
          flex: 1; height: 4px; background: #1A1F2A; border-radius: 2px; position: relative; min-width: 60px;
        }
        .vx-progress-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, #8AC820 0%, #C8F04A 100%);
          transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 0 8px rgba(200,240,74,0.4);
        }
        .vx-progress-pct {
          font-size: 9px; letter-spacing: 0.1em; color: #C8F04A;
          white-space: nowrap; flex-shrink: 0; min-width: 32px; text-align: right;
        }

        /* Body */
        .vx-body {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        /* Sidebar */
        .vx-sidebar {
          width: 220px;
          min-width: 220px;
          border-right: 1px solid #1E2229;
          padding: 20px 0;
          background: #0D1014;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .vx-sidebar-overlay {
          display: none;
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9;
        }

        .vx-step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 20px;
          cursor: pointer;
          position: relative;
          transition: background 0.15s;
        }
        .vx-step-item:hover {
          background: rgba(255,255,255,0.02);
        }
        .vx-step-item.active {
          background: rgba(200,240,74,0.05);
        }
        .vx-step-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #C8F04A;
          box-shadow: 0 0 8px rgba(200,240,74,0.6);
        }
        .vx-step-item.done .step-icon,
        .vx-step-item.active .step-icon {
          color: #C8F04A;
        }
        .step-icon {
          font-size: 11px;
          color: #5A6478;
          width: 14px;
          text-align: center;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .step-num {
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #5A6478;
          width: 16px;
          text-align: right;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .vx-step-item.active .step-num { color: #C8F04A; }
        .vx-step-item.done .step-num { color: #8AAD5A; }

        .step-label {
          font-size: 11px;
          letter-spacing: 0.04em;
          color: #8A95AA;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .vx-step-item.active .step-label { color: #C8F04A; font-weight: 500; }
        .vx-step-item.done .step-label { color: #9AB880; }

        .vx-sidebar-footer {
          margin-top: auto;
          padding: 16px 20px 0;
          border-top: 1px solid #1E2229;
        }
        .vx-sidebar-footer p {
          font-size: 9px;
          color: #5A6478;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          line-height: 1.7;
        }

        /* Main content */
        .vx-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 32px 40px 28px;
          overflow-y: auto;
          min-width: 0;
        }

        .vx-content { flex: 1; }

        /* Welcome screen */
        .vx-welcome-eyebrow {
          font-size: 10px;
          letter-spacing: 0.22em;
          color: #C8F04A;
          text-transform: uppercase;
          margin-bottom: 24px;
          opacity: 0.8;
        }

        /* Executive Program Dashboard */
        .ed-dash-title {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 34px;
          line-height: 1.05; color: #E8EDF5; letter-spacing: -0.02em; margin-bottom: 12px;
        }
        .ed-dash-sub {
          font-size: 13px; line-height: 1.7; color: #8A95AA; max-width: 640px; margin-bottom: 26px;
        }
        .ed-active-banner {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 14px 18px; border-radius: 2px; margin-bottom: 22px;
          border: 1px solid rgba(200,240,74,0.28); background: linear-gradient(90deg, rgba(200,240,74,0.07), rgba(200,240,74,0.01));
        }
        .ed-active-left { display: flex; flex-direction: column; gap: 4px; }
        .ed-active-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #8AAD5A; }
        .ed-active-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #E8EDF5; }
        .ed-status-pill {
          font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 11px;
          border-radius: 2px; border: 1px solid; white-space: nowrap;
        }
        .ed-status-pill.Completed  { color: #80C870; border-color: #2A4A20; background: rgba(120,200,80,0.08); }
        .ed-status-pill.InProgress { color: #C8B840; border-color: #4A3A10; background: rgba(200,160,60,0.08); }
        .ed-status-pill.NotStarted { color: #6A7480; border-color: #2A3040; background: rgba(120,130,150,0.04); }
        .ed-stage-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 30px;
        }
        .ed-stage-card {
          padding: 18px; border-radius: 2px; background: #0D1014; border: 1px solid #1E2229;
          display: flex; flex-direction: column; gap: 10px; transition: all 0.18s; position: relative; overflow: hidden;
        }
        .ed-stage-card.active { border-color: rgba(200,240,74,0.4); box-shadow: 0 0 0 1px rgba(200,240,74,0.08) inset; }
        .ed-stage-card.Completed { border-color: rgba(120,200,80,0.28); }
        .ed-stage-top { display: flex; align-items: center; justify-content: space-between; }
        .ed-stage-num { font-size: 9px; letter-spacing: 0.18em; color: #5A6478; }
        .ed-status-dot { width: 9px; height: 9px; border-radius: 50%; }
        .ed-status-dot.Completed  { background: #80C870; box-shadow: 0 0 8px rgba(128,200,112,0.6); }
        .ed-status-dot.InProgress { background: #C8B840; box-shadow: 0 0 8px rgba(200,184,64,0.6); }
        .ed-status-dot.NotStarted { background: #2A3040; }
        .ed-stage-icon { font-size: 22px; color: #C8F04A; opacity: 0.85; }
        .ed-stage-card.NotStarted .ed-stage-icon { color: #4A5568; opacity: 0.6; }
        .ed-stage-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #E8EDF5; line-height: 1.2; }
        .ed-stage-objective { font-size: 11px; line-height: 1.55; color: #7A8497; min-height: 50px; }
        .ed-progress-track { height: 4px; border-radius: 2px; background: #1A1E26; overflow: hidden; }
        .ed-progress-fill { height: 100%; background: linear-gradient(90deg, #8AAD5A, #C8F04A); transition: width 0.4s; }
        .ed-stage-foot { display: flex; align-items: center; justify-content: space-between; }
        .ed-status-text { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; }
        .ed-status-text.Completed  { color: #80C870; }
        .ed-status-text.InProgress { color: #C8B840; }
        .ed-status-text.NotStarted { color: #6A7480; }
        .ed-pct { font-size: 10px; color: #8A95AA; }
        @media (max-width: 720px) { .ed-stage-grid { grid-template-columns: 1fr; } .ed-dash-title { font-size: 26px; } }

        .vx-welcome-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 42px;
          line-height: 1.05;
          color: #E8EDF5;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .vx-welcome-title em {
          font-style: normal;
          color: #C8F04A;
        }
        .vx-welcome-desc {
          font-size: 13px;
          line-height: 1.75;
          color: #8A95AA;
          max-width: 420px;
          margin-bottom: 44px;
        }
        .vx-begin-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #C8F04A;
          color: #0A0C0F;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 14px 28px;
          border: none;
          border-radius: 1px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 0 24px rgba(200,240,74,0.2);
        }
        .vx-begin-btn:hover {
          background: #D8FF5A;
          box-shadow: 0 0 32px rgba(200,240,74,0.38);
          transform: translateY(-1px);
        }
        .vx-begin-btn:active { transform: translateY(0); }
        .vx-begin-arrow { font-size: 14px; }

        .vx-welcome-rule {
          width: 40px;
          height: 1px;
          background: #1E2229;
          margin: 36px 0;
        }
        .vx-welcome-meta {
          display: flex;
          gap: 32px;
        }
        .vx-meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .vx-meta-value {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #C8F04A;
          letter-spacing: -0.02em;
        }
        .vx-meta-label {
          font-size: 9px;
          letter-spacing: 0.14em;
          color: #5A6478;
          text-transform: uppercase;
        }

        /* Placeholder screens */
        .vx-placeholder-eyebrow {
          font-size: 10px;
          letter-spacing: 0.22em;
          color: #8A95AA;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .vx-placeholder-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 28px;
          color: #E8EDF5;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }
        .vx-placeholder-body {
          font-size: 12.5px;
          color: #8A95AA;
          line-height: 1.8;
          max-width: 480px;
          margin-bottom: 40px;
        }
        .vx-placeholder-block {
          border: 1px solid #2A3040;
          border-radius: 2px;
          padding: 20px 24px;
          background: #0D1014;
        }
        .vx-placeholder-block p {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #5A6478;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .vx-placeholder-fields {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .vx-field-skeleton {
          height: 9px;
          border-radius: 1px;
          background: #1E2535;
        }

        /* Bottom nav */
        .vx-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          border-top: 1px solid #1A1F27;
          margin-top: 8px;
        }
        .vx-nav-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .vx-step-counter {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #5A6478;
        }
        .vx-step-counter strong {
          color: #C8F04A;
        }

        .vx-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 10px 22px;
          border-radius: 1px;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
        }
        .vx-btn-ghost {
          background: transparent;
          color: #8A95AA;
          border: 1px solid #2A3040;
        }
        .vx-btn-ghost:hover:not(:disabled) {
          background: #1A1F27;
          color: #C0C8D8;
        }
        .vx-btn-ghost:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .vx-btn-primary {
          background: #1A2030;
          color: #C8F04A;
          border: 1px solid #2A3A20;
        }
        .vx-btn-primary:hover {
          background: #202A40;
          border-color: #3A5030;
          box-shadow: 0 0 16px rgba(200,240,74,0.12);
        }
        .vx-btn-primary:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        /* Sector Selection screen */
        .sector-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        .sector-card {
          border: 1px solid #2A3040;
          border-radius: 2px;
          padding: 18px 20px;
          background: #0D1014;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
          position: relative;
          overflow: hidden;
        }
        .sector-card:hover {
          border-color: #3A4A60;
          background: #111820;
        }
        .sector-card.selected {
          border-color: #C8F04A;
          background: rgba(200,240,74,0.04);
          box-shadow: 0 0 0 1px rgba(200,240,74,0.15), inset 0 0 24px rgba(200,240,74,0.03);
        }
        .sector-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .sector-card-icon {
          font-size: 16px;
          color: #3D4A60;
          transition: color 0.18s;
          line-height: 1;
        }
        .sector-card.selected .sector-card-icon { color: #C8F04A; }
        .sector-check {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid #2A3A50;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: transparent;
          transition: all 0.18s;
          flex-shrink: 0;
        }
        .sector-card.selected .sector-check {
          background: #C8F04A;
          border-color: #C8F04A;
          color: #0A0C0F;
        }
        .sector-card-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #C0C8D8;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
          transition: color 0.18s;
        }
        .sector-card.selected .sector-card-title { color: #E8EDF5; }
        .sector-card-desc {
          font-size: 10.5px;
          color: #5A6478;
          line-height: 1.6;
          margin-bottom: 12px;
          transition: color 0.18s;
        }
        .sector-card.selected .sector-card-desc { color: #7A8899; }
        .sector-subtypes {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .sector-subtype-tag {
          font-size: 9px;
          letter-spacing: 0.06em;
          color: #3D4A60;
          border: 1px solid #1E2535;
          border-radius: 1px;
          padding: 2px 7px;
          background: #111820;
          transition: color 0.18s, border-color 0.18s;
        }
        .sector-card.selected .sector-subtype-tag {
          color: #7A9A50;
          border-color: #2A3A20;
          background: rgba(200,240,74,0.04);
        }

        /* Subtype dropdown */
        .sector-dropdown-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: #0D1014;
          border: 1px solid #C8F04A;
          border-radius: 2px;
          box-shadow: 0 0 0 1px rgba(200,240,74,0.08);
        }
        .sector-dropdown-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          color: #8A95AA;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .sector-dropdown-label strong {
          color: #C8F04A;
        }
        .sector-select {
          flex: 1;
          background: #111820;
          border: 1px solid #2A3040;
          border-radius: 1px;
          color: #C0C8D8;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 8px 12px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235A6478' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }
        .sector-select:focus { border-color: #C8F04A; }
        .sector-select option { background: #111820; color: #C0C8D8; }
        .sector-confirm-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #C8F04A;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── Experience Context form ── */
        .ec-form {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .ec-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .ec-row.full {
          grid-template-columns: 1fr;
        }
        .ec-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .ec-label {
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8A95AA;
        }
        .ec-label span {
          color: #4A5568;
          margin-left: 4px;
          text-transform: none;
          letter-spacing: 0;
          font-size: 9px;
        }
        .ec-select, .ec-input {
          background: #0D1014;
          border: 1px solid #2A3040;
          border-radius: 2px;
          color: #C0C8D8;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 9px 12px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .ec-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235A6478' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
          cursor: pointer;
        }
        .ec-select option { background: #0D1014; color: #C0C8D8; }
        .ec-select:focus, .ec-input:focus {
          border-color: #C8F04A;
          box-shadow: 0 0 0 1px rgba(200,240,74,0.12);
        }
        .ec-input::placeholder { color: #3D4A60; }
        .ec-input[type="number"]::-webkit-inner-spin-button,
        .ec-input[type="number"]::-webkit-outer-spin-button { opacity: 0.3; }

        /* Radio group */
        .ec-radio-group {
          display: flex;
          gap: 10px;
        }
        .ec-radio-btn {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 14px;
          border: 1px solid #2A3040;
          border-radius: 2px;
          background: #0D1014;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          font-size: 11px;
          color: #8A95AA;
          user-select: none;
        }
        .ec-radio-btn:hover { border-color: #3A4A60; background: #111820; }
        .ec-radio-btn.active {
          border-color: #C8F04A;
          background: rgba(200,240,74,0.04);
          color: #C8F04A;
        }
        .ec-radio-dot {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 1px solid #3A4A60;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.15s;
        }
        .ec-radio-btn.active .ec-radio-dot {
          border-color: #C8F04A;
        }
        .ec-radio-dot-inner {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: transparent;
          transition: background 0.15s;
        }
        .ec-radio-btn.active .ec-radio-dot-inner { background: #C8F04A; }

        /* Tone multi-select chips */
        .ec-tone-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ec-tone-chip {
          padding: 7px 14px;
          border: 1px solid #2A3040;
          border-radius: 2px;
          background: #0D1014;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #8A95AA;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          user-select: none;
          text-transform: capitalize;
        }
        .ec-tone-chip:hover { border-color: #3A4A60; color: #C0C8D8; }
        .ec-tone-chip.active {
          border-color: #C8F04A;
          background: rgba(200,240,74,0.07);
          color: #C8F04A;
        }
        .ec-divider {
          height: 1px;
          background: #1E2535;
          margin: 16px 0;
        }

        /* ── Physical Features table ── */
        .pf-table-wrap {
          overflow-x: auto;
          border: 1px solid #2A3040;
          border-radius: 2px;
        }
        .pf-table {
          width: 100%;
          min-width: 580px;
          border-collapse: collapse;
        }
        .pf-table thead tr {
          background: #0A0D10;
          border-bottom: 1px solid #2A3040;
        }
        .pf-table thead th {
          padding: 10px 14px;
          text-align: left;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #5A6478;
          font-weight: 500;
          white-space: nowrap;
        }
        .pf-table thead th:first-child { width: 32%; }
        .pf-table thead th:not(:first-child) { width: 22.6%; }
        .pf-table tbody tr {
          border-bottom: 1px solid #1A1F2A;
          transition: background 0.12s;
        }
        .pf-table tbody tr:last-child { border-bottom: none; }
        .pf-table tbody tr:hover { background: rgba(255,255,255,0.015); }
        .pf-table tbody tr.pf-row-filled { background: rgba(200,240,74,0.025); }
        .pf-table tbody tr.pf-row-filled:hover { background: rgba(200,240,74,0.04); }
        .pf-cell-name {
          padding: 10px 14px;
          font-size: 11px;
          color: #A0AABB;
          white-space: nowrap;
        }
        .pf-row-filled .pf-cell-name { color: #C0C8D8; }
        .pf-cell-select {
          padding: 7px 10px;
        }
        .pf-select {
          width: 100%;
          background: #0D1014;
          border: 1px solid #222A38;
          border-radius: 2px;
          color: #6A7A90;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          padding: 6px 28px 6px 9px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' fill='none'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%234A5568' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 9px center;
        }
        .pf-select:focus { border-color: #C8F04A; color: #C0C8D8; }
        .pf-select option { background: #0D1014; color: #C0C8D8; }
        .pf-select.has-val { color: #C0C8D8; }
        .pf-select.val-yes { border-color: #3A6040; color: #7AC880; }
        .pf-select.val-partial { border-color: #6A5A20; color: #C8A840; }
        .pf-select.val-no { border-color: #5A2A2A; color: #C87070; }
        .pf-select.val-excellent { border-color: #2A5040; color: #60B890; }
        .pf-select.val-adequate { border-color: #2A4060; color: #60A0C8; }
        .pf-select.val-needs { border-color: #5A4020; color: #C89050; }
        .pf-select.val-not-present { border-color: #4A2A2A; color: #A06060; }
        .pf-select.val-high { border-color: #6A2A2A; color: #E07070; }
        .pf-select.val-med { border-color: #5A5020; color: #C8B840; }
        .pf-select.val-low { border-color: #2A4A30; color: #70B880; }
        .pf-summary-bar {
          display: flex;
          gap: 20px;
          margin-top: 12px;
          padding: 10px 14px;
          background: #0A0D10;
          border: 1px solid #1E2535;
          border-radius: 2px;
        }
        .pf-summary-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pf-summary-value {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #C8F04A;
        }
        .pf-summary-label {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5A6478;
        }

        /* ── Operational Controls ── */
        .oc-sections { display: flex; flex-direction: column; gap: 8px; }

        .oc-section {
          border: 1px solid #222A38;
          border-radius: 2px;
          overflow: hidden;
          transition: border-color 0.18s;
        }
        .oc-section.open { border-color: #2E3D50; }

        .oc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          cursor: pointer;
          background: #0D1014;
          user-select: none;
          transition: background 0.15s;
        }
        .oc-header:hover { background: #111820; }
        .oc-section.open .oc-header { background: #0F1520; border-bottom: 1px solid #222A38; }

        .oc-header-left { display: flex; align-items: center; gap: 10px; }
        .oc-header-num {
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #3D4A60;
          width: 18px;
        }
        .oc-section.open .oc-header-num { color: #C8F04A; }
        .oc-header-title {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #8A95AA;
          letter-spacing: 0.02em;
        }
        .oc-section.open .oc-header-title { color: #C0C8D8; }
        .oc-header-badge {
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #C8F04A;
          background: rgba(200,240,74,0.08);
          border: 1px solid rgba(200,240,74,0.2);
          border-radius: 2px;
          padding: 2px 7px;
        }
        .oc-chevron {
          font-size: 10px;
          color: #3D4A60;
          transition: transform 0.2s, color 0.15s;
        }
        .oc-section.open .oc-chevron { transform: rotate(180deg); color: #C8F04A; }

        .oc-body {
          padding: 18px 20px 20px;
          background: #0A0D12;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* checkbox group */
        .oc-field { display: flex; flex-direction: column; gap: 8px; }
        .oc-field-label {
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8A95AA;
        }
        .oc-checkbox-group { display: flex; flex-wrap: wrap; gap: 7px; }
        .oc-checkbox {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          border: 1px solid #222A38;
          border-radius: 2px;
          background: #0D1014;
          cursor: pointer;
          font-size: 10px;
          color: #7A8899;
          user-select: none;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .oc-checkbox:hover { border-color: #3A4A60; color: #A0B0C0; }
        .oc-checkbox.checked {
          border-color: #C8F04A;
          background: rgba(200,240,74,0.06);
          color: #C8F04A;
        }
        .oc-check-box {
          width: 12px; height: 12px;
          border: 1px solid #2A3A50;
          border-radius: 1px;
          display: flex; align-items: center; justify-content: center;
          font-size: 8px;
          color: transparent;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .oc-checkbox.checked .oc-check-box {
          background: #C8F04A;
          border-color: #C8F04A;
          color: #0A0C0F;
        }

        /* yes/no toggle pair */
        .oc-yn-group { display: flex; gap: 8px; }
        .oc-yn-btn {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 12px;
          border: 1px solid #222A38;
          border-radius: 2px;
          background: #0D1014;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #7A8899;
          cursor: pointer;
          user-select: none;
          transition: all 0.15s;
          text-transform: uppercase;
        }
        .oc-yn-btn:hover { border-color: #3A4A60; color: #A0B0C0; }
        .oc-yn-btn.active-yes {
          border-color: #3A6040;
          background: rgba(90,180,100,0.07);
          color: #7AC880;
        }
        .oc-yn-btn.active-no {
          border-color: #6A2A2A;
          background: rgba(180,70,70,0.07);
          color: #C87070;
        }

        /* textarea */
        .oc-textarea {
          width: 100%;
          background: #0D1014;
          border: 1px solid #222A38;
          border-radius: 2px;
          color: #C0C8D8;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 10px 13px;
          resize: vertical;
          min-height: 72px;
          outline: none;
          line-height: 1.6;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .oc-textarea::placeholder { color: #3D4A60; }
        .oc-textarea:focus {
          border-color: #C8F04A;
          box-shadow: 0 0 0 1px rgba(200,240,74,0.1);
        }

        .oc-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* ── Stakeholders ── */
        .sh-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        .sh-panel {
          border: 1px solid #222A38;
          border-radius: 2px;
          overflow: hidden;
        }
        .sh-panel-header {
          padding: 10px 16px;
          background: #0A0D10;
          border-bottom: 1px solid #1E2535;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sh-panel-title {
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8A95AA;
        }
        .sh-panel-count {
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #C8F04A;
          background: rgba(200,240,74,0.08);
          border: 1px solid rgba(200,240,74,0.18);
          border-radius: 2px;
          padding: 2px 7px;
        }
        .sh-tier-list {
          display: flex;
          flex-direction: column;
        }
        .sh-tier-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 16px;
          border-bottom: 1px solid #111820;
          cursor: pointer;
          user-select: none;
          transition: background 0.13s;
        }
        .sh-tier-row:last-child { border-bottom: none; }
        .sh-tier-row:hover { background: rgba(255,255,255,0.02); }
        .sh-tier-row.checked { background: rgba(200,240,74,0.03); }
        .sh-tier-checkbox {
          width: 14px; height: 14px;
          border: 1px solid #2A3A50;
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px;
          color: transparent;
          flex-shrink: 0;
          transition: all 0.15s;
          background: #0A0D10;
        }
        .sh-tier-row.checked .sh-tier-checkbox {
          background: #C8F04A;
          border-color: #C8F04A;
          color: #0A0C0F;
        }
        .sh-tier-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .sh-tier-label {
          font-size: 11px;
          color: #5A6A80;
          flex: 1;
          transition: color 0.13s;
        }
        .sh-tier-row.checked .sh-tier-label { color: #C0C8D8; }
        .sh-tier-badge {
          font-size: 8.5px;
          letter-spacing: 0.06em;
          padding: 1px 6px;
          border-radius: 1px;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .sh-fields-panel {
          border: 1px solid #222A38;
          border-radius: 2px;
          overflow: hidden;
        }
        .sh-fields-header {
          padding: 10px 16px;
          background: #0A0D10;
          border-bottom: 1px solid #1E2535;
        }
        .sh-fields-title {
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8A95AA;
        }
        .sh-fields-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: #0A0D12;
        }
        .sh-field { display: flex; flex-direction: column; gap: 7px; }
        .sh-field-label {
          font-size: 9.5px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #8A95AA;
        }
        .sh-input {
          background: #0D1014;
          border: 1px solid #222A38;
          border-radius: 2px;
          color: #C0C8D8;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 9px 12px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .sh-input::placeholder { color: #3D4A60; }
        .sh-input:focus {
          border-color: #C8F04A;
          box-shadow: 0 0 0 1px rgba(200,240,74,0.1);
        }
        .sh-textarea {
          background: #0D1014;
          border: 1px solid #222A38;
          border-radius: 2px;
          color: #C0C8D8;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 9px 12px;
          outline: none;
          resize: vertical;
          min-height: 76px;
          line-height: 1.6;
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
        }
        .sh-textarea::placeholder { color: #3D4A60; }
        .sh-textarea:focus {
          border-color: #C8F04A;
          box-shadow: 0 0 0 1px rgba(200,240,74,0.1);
        }
        .sh-lang-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        /* ── Priorities & Template ── */
        .pt-tables-outer {
          overflow-x: auto;
          overflow-y: visible;
          padding-bottom: 4px;
        }
        .pt-tables-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          align-items: start;
          min-width: 640px;
        }
        .pt-table-block {
          border: 1px solid #222A38;
          border-radius: 2px;
          overflow: hidden;
        }
        .pt-table-header {
          padding: 10px 16px;
          background: #0A0D10;
          border-bottom: 1px solid #1E2535;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pt-table-title {
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8A95AA;
        }
        .pt-filled-badge {
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #C8F04A;
          background: rgba(200,240,74,0.08);
          border: 1px solid rgba(200,240,74,0.18);
          border-radius: 2px;
          padding: 2px 7px;
        }
        .pt-table {
          width: 100%;
          border-collapse: collapse;
        }
        .pt-table thead tr {
          background: #0A0D10;
          border-bottom: 1px solid #1A2030;
        }
        .pt-table thead th {
          padding: 7px 12px;
          text-align: left;
          font-size: 8.5px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #3D4A60;
          font-weight: 500;
          white-space: nowrap;
        }
        .pt-table tbody tr {
          border-bottom: 1px solid #111820;
          transition: background 0.12s;
        }
        .pt-table tbody tr:last-child { border-bottom: none; }
        .pt-table tbody tr:hover { background: rgba(255,255,255,0.015); }
        .pt-table tbody tr.pt-row-set { background: rgba(200,240,74,0.025); }
        .pt-table tbody tr.pt-row-set:hover { background: rgba(200,240,74,0.04); }
        .pt-cell-name {
          padding: 8px 12px;
          font-size: 10.5px;
          color: #7A8A9A;
          white-space: nowrap;
        }
        .pt-row-set .pt-cell-name { color: #B0BACA; }
        .pt-cell-input {
          padding: 5px 8px;
        }
        .pt-select {
          width: 100%;
          background: #0D1014;
          border: 1px solid #1E2A38;
          border-radius: 2px;
          color: #5A6A80;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          padding: 5px 24px 5px 8px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' fill='none'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%234A5568' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
        }
        .pt-select:focus { border-color: #C8F04A; color: #C0C8D8; }
        .pt-select option { background: #0D1014; color: #C0C8D8; }
        .pt-select.has-val { color: #C0C8D8; }
        .pt-select.val-high { border-color: #5A2A2A; color: #C87070; }
        .pt-select.val-med  { border-color: #5A5020; color: #C8B840; }
        .pt-select.val-low  { border-color: #2A4A30; color: #70B880; }
        .pt-rank-input {
          width: 100%;
          background: #0D1014;
          border: 1px solid #1E2A38;
          border-radius: 2px;
          color: #C0C8D8;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          padding: 5px 8px;
          outline: none;
          text-align: center;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .pt-rank-input::placeholder { color: #2A3A50; }
        .pt-rank-input:focus {
          border-color: #C8F04A;
          box-shadow: 0 0 0 1px rgba(200,240,74,0.1);
        }
        .pt-rank-input::-webkit-inner-spin-button,
        .pt-rank-input::-webkit-outer-spin-button { opacity: 0.3; }

        /* ── Template Selection ── */
        .ts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .ts-card {
          border: 1px solid #222A38;
          border-radius: 2px;
          padding: 18px 18px 16px;
          background: #0D1014;
          cursor: pointer;
          position: relative;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .ts-card:hover {
          border-color: #3A4A60;
          background: #111820;
        }
        .ts-card.primary {
          border-color: #C8F04A;
          background: rgba(200,240,74,0.04);
          box-shadow: 0 0 0 1px rgba(200,240,74,0.12), inset 0 0 28px rgba(200,240,74,0.03);
        }
        .ts-card.secondary {
          border-color: #4A8AB0;
          background: rgba(74,138,176,0.04);
          box-shadow: 0 0 0 1px rgba(74,138,176,0.15);
        }
        .ts-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .ts-card-num {
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #2A3A50;
          transition: color 0.18s;
        }
        .ts-card.primary .ts-card-num { color: #C8F04A; }
        .ts-card.secondary .ts-card-num { color: #4A8AB0; }
        .ts-badge-wrap { display: flex; gap: 5px; }
        .ts-badge {
          font-size: 8.5px;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 1px;
          border: 1px solid transparent;
          text-transform: uppercase;
        }
        .ts-badge-primary {
          background: rgba(200,240,74,0.1);
          border-color: rgba(200,240,74,0.25);
          color: #C8F04A;
        }
        .ts-badge-secondary {
          background: rgba(74,138,176,0.1);
          border-color: rgba(74,138,176,0.3);
          color: #6AB0D8;
        }
        .ts-card-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 12.5px;
          color: #8A9AAA;
          margin-bottom: 5px;
          letter-spacing: -0.01em;
          line-height: 1.3;
          transition: color 0.18s;
        }
        .ts-card.primary .ts-card-name { color: #E0E8F0; }
        .ts-card.secondary .ts-card-name { color: #C0D0E0; }
        .ts-card-origin {
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #3A4A60;
          margin-bottom: 14px;
          text-transform: uppercase;
          transition: color 0.18s;
        }
        .ts-card.primary .ts-card-origin,
        .ts-card.secondary .ts-card-origin { color: #5A6A80; }
        .ts-divider {
          height: 1px;
          background: #1A2030;
          margin-bottom: 12px;
        }
        .ts-card.primary .ts-divider { background: rgba(200,240,74,0.1); }
        .ts-card.secondary .ts-divider { background: rgba(74,138,176,0.12); }
        .ts-meta-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .ts-meta-item { display: flex; flex-direction: column; gap: 3px; }
        .ts-meta-label {
          font-size: 8.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3A4A60;
          transition: color 0.18s;
        }
        .ts-card.primary .ts-meta-label { color: #6A8040; }
        .ts-card.secondary .ts-meta-label { color: #3A6080; }
        .ts-meta-value {
          font-size: 10.5px;
          color: #5A6A7A;
          line-height: 1.5;
          transition: color 0.18s;
        }
        .ts-card.primary .ts-meta-value { color: #9ABAAA; }
        .ts-card.secondary .ts-meta-value { color: #7A9AAA; }
        .ts-card-footer {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid #1A2030;
          display: flex;
          gap: 6px;
        }
        .ts-card.primary .ts-card-footer { border-top-color: rgba(200,240,74,0.1); }
        .ts-card.secondary .ts-card-footer { border-top-color: rgba(74,138,176,0.1); }
        .ts-action-btn {
          flex: 1;
          padding: 5px 8px;
          border-radius: 1px;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s;
          border: 1px solid #1E2A38;
          background: transparent;
          color: #4A5A70;
        }
        .ts-action-btn:hover { border-color: #3A4A60; color: #7A8A9A; }
        .ts-action-btn.active-primary {
          background: rgba(200,240,74,0.08);
          border-color: rgba(200,240,74,0.3);
          color: #C8F04A;
        }
        .ts-action-btn.active-secondary {
          background: rgba(74,138,176,0.08);
          border-color: rgba(74,138,176,0.3);
          color: #6AB0D8;
        }
        .ts-selection-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .ts-selection-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 2px;
          border: 1px solid #1E2A38;
          background: #0A0D10;
          flex: 1;
        }
        .ts-selection-pill.filled-primary {
          border-color: rgba(200,240,74,0.25);
          background: rgba(200,240,74,0.04);
        }
        .ts-selection-pill.filled-secondary {
          border-color: rgba(74,138,176,0.25);
          background: rgba(74,138,176,0.04);
        }
        .ts-pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #2A3A50;
          flex-shrink: 0;
        }
        .ts-selection-pill.filled-primary .ts-pill-dot { background: #C8F04A; }
        .ts-selection-pill.filled-secondary .ts-pill-dot { background: #4A8AB0; }
        .ts-pill-label {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3A4A60;
        }
        .ts-selection-pill.filled-primary .ts-pill-label { color: #8AAA60; }
        .ts-selection-pill.filled-secondary .ts-pill-label { color: #4A7A9A; }
        .ts-pill-value {
          font-size: 10.5px;
          color: #4A5A70;
          margin-left: auto;
        }
        .ts-selection-pill.filled-primary .ts-pill-value { color: #C8F04A; }
        .ts-selection-pill.filled-secondary .ts-pill-value { color: #6AB0D8; }

        /* ── Review Screen ── */
        .rv-sections { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }
        .rv-section {
          border: 1px solid #1E2535;
          border-radius: 2px;
          overflow: hidden;
        }
        .rv-section.open { border-color: #2A3545; }
        .rv-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 16px;
          background: #0A0D10;
          cursor: pointer;
          user-select: none;
          transition: background 0.15s;
        }
        .rv-section-header:hover { background: #0F1318; }
        .rv-section.open .rv-section-header { border-bottom: 1px solid #1E2535; }
        .rv-section-left { display: flex; align-items: center; gap: 10px; }
        .rv-section-num { font-size: 9px; letter-spacing: 0.1em; color: #3A4A60; width: 18px; }
        .rv-section.open .rv-section-num { color: #C8F04A; }
        .rv-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #6A7A8A;
        }
        .rv-section.open .rv-section-title { color: #B0BACA; }
        .rv-complete-badge {
          font-size: 8.5px;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 1px;
          background: rgba(200,240,74,0.08);
          border: 1px solid rgba(200,240,74,0.2);
          color: #C8F04A;
        }
        .rv-empty-badge {
          font-size: 8.5px;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 1px;
          background: rgba(90,100,120,0.08);
          border: 1px solid #1E2535;
          color: #4A5A70;
        }
        .rv-chevron {
          font-size: 10px; color: #3A4A60;
          transition: transform 0.2s, color 0.15s;
        }
        .rv-section.open .rv-chevron { transform: rotate(180deg); color: #C8F04A; }
        .rv-body {
          padding: 16px 18px;
          background: #080B0E;
          display: flex; flex-direction: column; gap: 10px;
        }
        .rv-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 20px; }
        .rv-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 16px; }
        .rv-kv { display: flex; flex-direction: column; gap: 3px; }
        .rv-key {
          font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #3A4A60;
        }
        .rv-val {
          font-size: 11px; color: #8A9AAA; line-height: 1.5;
        }
        .rv-val.accent { color: #C8F04A; }
        .rv-val.muted { color: #4A5A70; font-style: italic; }
        .rv-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }
        .rv-chip {
          font-size: 9.5px; padding: 2px 8px;
          border: 1px solid #1E2A38; border-radius: 1px;
          color: #6A7A8A; background: #0D1014;
        }
        .rv-chip.lime { border-color: #3A5030; color: #9AB870; background: rgba(200,240,74,0.04); }
        .rv-table { width: 100%; border-collapse: collapse; }
        .rv-table tr { border-bottom: 1px solid #111820; }
        .rv-table tr:last-child { border-bottom: none; }
        .rv-table td { padding: 5px 8px; font-size: 10.5px; color: #6A7A8A; }
        .rv-table td:first-child { color: #8A9AAA; width: 55%; }
        .rv-tbl-badge {
          display: inline-block; font-size: 8.5px; padding: 1px 6px;
          border-radius: 1px; border: 1px solid transparent;
        }

        /* Generate brief button */
        .rv-generate-wrap {
          display: flex; flex-direction: column; gap: 16px; align-items: stretch;
        }
        .rv-generate-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 18px 32px;
          background: #C8F04A; color: #0A0C0F;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 14px; letter-spacing: 0.04em;
          border: none; border-radius: 2px; cursor: pointer;
          transition: background 0.15s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 0 32px rgba(200,240,74,0.25);
          width: 100%;
        }
        .rv-generate-btn:hover:not(:disabled) {
          background: #D8FF5A;
          box-shadow: 0 0 48px rgba(200,240,74,0.4);
          transform: translateY(-1px);
        }
        .rv-generate-btn:disabled {
          opacity: 0.5; cursor: not-allowed; transform: none;
        }
        .rv-generate-btn:active:not(:disabled) { transform: translateY(0); }
        .rv-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(10,12,15,0.3);
          border-top-color: #0A0C0F;
          border-radius: 50%;
          animation: rv-spin 0.7s linear infinite;
        }
        @keyframes rv-spin { to { transform: rotate(360deg); } }
        .rv-output-block {
          border: 1px solid rgba(200,240,74,0.2);
          border-radius: 2px;
          background: #0A0F08;
          padding: 24px 28px;
        }
        .rv-output-eyebrow {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          color: #C8F04A; margin-bottom: 16px; opacity: 0.7;
        }
        .rv-output-text {
          font-size: 12px; color: #A0B0A8; line-height: 1.85;
          white-space: pre-wrap; font-family: 'DM Mono', monospace;
        }
        .rv-error {
          padding: 12px 16px; border: 1px solid rgba(200,80,80,0.3);
          border-radius: 2px; background: rgba(200,80,80,0.05);
          font-size: 11px; color: #C07070;
        }

        /* ── Brief Output ── */
        .bo-wrap { display: flex; flex-direction: column; gap: 0; }
        .bo-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; background: #080C08;
          border: 1px solid rgba(200,240,74,0.2); border-bottom: none;
          border-radius: 2px 2px 0 0;
        }
        .bo-header-left { display: flex; flex-direction: column; gap: 3px; }
        .bo-eyebrow { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #C8F04A; opacity: 0.7; }
        .bo-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #C8F04A; letter-spacing: -0.01em; }
        .bo-download-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 2px;
          background: rgba(200,240,74,0.08); border: 1px solid rgba(200,240,74,0.25);
          color: #C8F04A; font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: all 0.15s;
        }
        .bo-download-btn:hover { background: rgba(200,240,74,0.15); border-color: rgba(200,240,74,0.4); }

        .bo-sections { border: 1px solid rgba(200,240,74,0.15); border-radius: 0 0 2px 2px; overflow: hidden; }
        .bo-section { border-bottom: 1px solid #111E11; }
        .bo-section:last-child { border-bottom: none; }
        .bo-section-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 18px; background: #0A0F0A; cursor: pointer;
          user-select: none; transition: background 0.15s;
        }
        .bo-section-header:hover { background: #0C1410; }
        .bo-section.open .bo-section-header { background: #0C1510; border-bottom: 1px solid #152015; }
        .bo-section-left { display: flex; align-items: center; gap: 10px; }
        .bo-section-key {
          font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase;
          color: #3A5A3A; width: 22px;
        }
        .bo-section.open .bo-section-key { color: #C8F04A; }
        .bo-section-title {
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
          color: #5A7A5A; letter-spacing: 0.01em;
        }
        .bo-section.open .bo-section-title { color: #A0C8A0; }
        .bo-chevron { font-size: 10px; color: #3A5A3A; transition: transform 0.2s, color 0.15s; }
        .bo-section.open .bo-chevron { transform: rotate(180deg); color: #C8F04A; }

        .bo-body { padding: 16px 20px; background: #060D06; }
        .bo-string { font-size: 11.5px; color: #8AAA88; line-height: 1.7; }
        .bo-kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; }
        .bo-kv { display: flex; flex-direction: column; gap: 4px; }
        .bo-k { font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #3A5A3A; }
        .bo-v { font-size: 11px; color: #88A888; }
        .bo-v.accent { color: #C8F04A; }
        .bo-v.muted { color: #3A4A3A; font-style: italic; }
        .bo-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }
        .bo-chip { font-size: 9.5px; padding: 2px 8px; border-radius: 1px; border: 1px solid #1A3020; color: #70A870; background: rgba(200,240,74,0.03); }
        .bo-chip.high { border-color: #4A1A1A; color: #C07070; background: rgba(200,80,80,0.04); }
        .bo-chip.med  { border-color: #4A3A10; color: #C0A850; background: rgba(200,160,60,0.04); }
        .bo-chip.low  { border-color: #1A3A1A; color: #70B870; background: rgba(80,180,80,0.04); }

        .bo-cards { display: flex; flex-direction: column; gap: 8px; }
        .bo-card {
          border: 1px solid #152015; border-radius: 2px; padding: 12px 14px;
          background: #080E08; display: flex; flex-direction: column; gap: 5px;
        }
        .bo-card-title { font-family: 'Syne', sans-serif; font-size: 11.5px; font-weight: 700; color: #90B890; }
        .bo-card-body { font-size: 10.5px; color: #607060; line-height: 1.6; }
        .bo-card-meta { display: flex; gap: 8px; margin-top: 2px; flex-wrap: wrap; }
        .bo-severity {
          font-size: 8.5px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 2px 7px; border-radius: 1px; border: 1px solid transparent;
        }
        .bo-severity.High { border-color: #5A1A1A; color: #C07070; background: rgba(200,80,80,0.06); }
        .bo-severity.Med  { border-color: #4A3A10; color: #C0A850; background: rgba(200,160,60,0.06); }
        .bo-severity.Low  { border-color: #1A3A1A; color: #70B870; background: rgba(80,180,80,0.06); }
        .bo-rec { font-size: 10px; color: #507050; font-style: italic; }

        .bo-table { width: 100%; border-collapse: collapse; }
        .bo-table thead tr { border-bottom: 1px solid #152015; }
        .bo-table thead th { padding: 6px 10px; text-align: left; font-size: 8.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #3A5A3A; font-weight: 500; }
        .bo-table tbody tr { border-bottom: 1px solid #0D140D; transition: background 0.1s; }
        .bo-table tbody tr:last-child { border-bottom: none; }
        .bo-table tbody tr:hover { background: rgba(200,240,74,0.02); }
        .bo-table td { padding: 7px 10px; font-size: 10.5px; color: #6A8A6A; }
        .bo-table td:first-child { color: #90A890; }

        /* ── Benchmark Intelligence ── */
        .bm-wrap { margin-top: 20px; display: flex; flex-direction: column; gap: 0; }
        .bm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; background: #0A0810;
          border: 1px solid rgba(160,100,240,0.25); border-bottom: none;
          border-radius: 2px 2px 0 0;
        }
        .bm-header-left { display: flex; flex-direction: column; gap: 3px; }
        .bm-eyebrow { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #A060E8; opacity: 0.8; }
        .bm-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #C090F8; letter-spacing: -0.01em; }
        .bm-dl-btn {
          display: flex; align-items: center; gap: 7px; padding: 8px 16px;
          border-radius: 2px; background: rgba(160,100,240,0.08); border: 1px solid rgba(160,100,240,0.25);
          color: #C090F8; font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.15s;
        }
        .bm-dl-btn:hover { background: rgba(160,100,240,0.16); border-color: rgba(160,100,240,0.45); }

        .bm-meta-bar {
          display: flex; gap: 0;
          border: 1px solid rgba(160,100,240,0.15); border-bottom: none;
          background: #080610;
        }
        .bm-meta-item {
          flex: 1; padding: 10px 16px; border-right: 1px solid rgba(160,100,240,0.1);
          display: flex; flex-direction: column; gap: 3px;
        }
        .bm-meta-item:last-child { border-right: none; }
        .bm-meta-k { font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; color: #5A3A80; }
        .bm-meta-v { font-size: 10.5px; color: #9070C0; }

        .bm-category-tabs {
          display: flex; gap: 0; overflow-x: auto;
          border: 1px solid rgba(160,100,240,0.15); border-bottom: none;
          background: #060410;
        }
        .bm-tab {
          display: flex; align-items: center; gap: 6px; padding: 10px 14px;
          cursor: pointer; border-right: 1px solid rgba(160,100,240,0.1);
          user-select: none; transition: background 0.15s; white-space: nowrap; flex-shrink: 0;
        }
        .bm-tab:last-child { border-right: none; }
        .bm-tab:hover { background: rgba(160,100,240,0.06); }
        .bm-tab.active { background: rgba(160,100,240,0.1); border-bottom: 2px solid #A060E8; }
        .bm-tab-icon { font-size: 10px; color: #4A2A70; }
        .bm-tab.active .bm-tab-icon { color: #C090F8; }
        .bm-tab-label { font-size: 9.5px; letter-spacing: 0.06em; color: #5A3A80; text-transform: uppercase; }
        .bm-tab.active .bm-tab-label { color: #C090F8; }
        .bm-tab-count {
          font-size: 8.5px; padding: 1px 6px; border-radius: 1px;
          background: rgba(160,100,240,0.1); border: 1px solid rgba(160,100,240,0.2); color: #9070C0;
        }
        .bm-tab.active .bm-tab-count { background: rgba(160,100,240,0.2); color: #C090F8; }

        .bm-panel {
          border: 1px solid rgba(160,100,240,0.15); border-radius: 0 0 2px 2px;
          background: #050310; padding: 14px; display: flex; flex-direction: column; gap: 8px;
        }

        .bm-card { border: 1px solid #180E28; border-radius: 2px; overflow: hidden; }
        .bm-card.open { border-color: #2A1848; }
        .bm-card-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 11px 14px; background: #0A0718; cursor: pointer; user-select: none;
          transition: background 0.15s; gap: 12px;
        }
        .bm-card-header:hover { background: #0D0A20; }
        .bm-card.open .bm-card-header { background: #0C0A1E; border-bottom: 1px solid #1E1030; }
        .bm-card-header-left { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
        .bm-card-id { font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: #3A1A60; }
        .bm-card.open .bm-card-id { color: #A060E8; }
        .bm-card-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #6A4A90; }
        .bm-card.open .bm-card-title { color: #C090F8; }
        .bm-card-institution { font-size: 9.5px; color: #3A2560; }
        .bm-card-header-right { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
        .bm-confidence {
          font-size: 8.5px; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 2px 7px; border-radius: 1px; border: 1px solid transparent;
        }
        .bm-confidence.High   { border-color: #2A4A20; color: #80C870; background: rgba(120,200,80,0.06); }
        .bm-confidence.Medium { border-color: #4A3A10; color: #C0A850; background: rgba(200,160,60,0.06); }
        .bm-confidence.Low    { border-color: #4A1A1A; color: #C07070; background: rgba(200,80,80,0.06); }
        .bm-chevron { font-size: 10px; color: #3A1A60; transition: transform 0.2s, color 0.15s; }
        .bm-card.open .bm-chevron { transform: rotate(180deg); color: #A060E8; }

        .bm-card-body { padding: 13px 14px; background: #040210; display: flex; flex-direction: column; gap: 10px; }
        .bm-kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
        .bm-kv { display: flex; flex-direction: column; gap: 3px; }
        .bm-k { font-size: 8px; letter-spacing: 0.13em; text-transform: uppercase; color: #3A1A60; }
        .bm-v { font-size: 10.5px; color: #7060A0; line-height: 1.55; }
        .bm-v.accent { color: #C090F8; }
        .bm-gate-row { display: flex; gap: 7px; }
        .bm-gate {
          display: flex; align-items: center; gap: 5px; padding: 4px 9px;
          border-radius: 1px; border: 1px solid #1A0E30; background: #080515; font-size: 9px;
        }
        .bm-gate-label { letter-spacing: 0.08em; text-transform: uppercase; color: #4A2A70; }
        .bm-gate-val { color: #C090F8; font-weight: 500; }
        .bm-chips { display: flex; flex-wrap: wrap; gap: 5px; }
        .bm-chip { font-size: 9.5px; padding: 2px 8px; border-radius: 1px; border: 1px solid #1A0E30; color: #6A4A90; background: rgba(160,100,240,0.04); }

        /* Benchmark trigger button */
        .bm-trigger-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 16px 32px; margin-top: 20px;
          background: linear-gradient(135deg, #1A0E30 0%, #0F0820 100%);
          color: #C090F8; border: 1px solid rgba(160,100,240,0.35);
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; letter-spacing: 0.03em;
          border-radius: 2px; cursor: pointer; width: 100%;
          transition: all 0.18s; box-shadow: 0 0 32px rgba(160,100,240,0.12);
        }
        .bm-trigger-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #220E3C 0%, #140A28 100%);
          border-color: rgba(160,100,240,0.6); box-shadow: 0 0 48px rgba(160,100,240,0.25);
          transform: translateY(-1px);
        }
        .bm-trigger-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .bm-spinner {
          width: 16px; height: 16px; border: 2px solid rgba(192,144,248,0.2);
          border-top-color: #C090F8; border-radius: 50%;
          animation: rv-spin 0.7s linear infinite;
        }
        .bm-error {
          padding: 12px 16px; border: 1px solid rgba(200,80,80,0.25);
          border-radius: 2px; background: rgba(200,80,80,0.04); font-size: 11px; color: #C07070;
          margin-top: 10px;
        }

        /* ── Mobile responsive ── */
        @media (max-width: 640px) {
          .vx-shell { border-radius: 0; border-left: none; border-right: none; }
          .vx-badge { display: none; }
          .vx-hamburger { display: flex !important; }
          .vx-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0; z-index: 10;
            transform: translateX(-100%); width: 240px; min-width: 240px;
          }
          .vx-sidebar.mobile-open { transform: translateX(0); }
          .vx-sidebar-overlay.mobile-open { display: block; }
          .vx-main { padding: 20px 16px 16px; }
          .vx-welcome-title { font-size: 28px; }
          .vx-welcome-meta { gap: 18px; }
          .sector-grid { grid-template-columns: 1fr; }
          .ec-row { grid-template-columns: 1fr; }
          .sh-layout { grid-template-columns: 1fr; }
          .pt-tables-wrap { grid-template-columns: 1fr; min-width: unset; }
          .ts-grid { grid-template-columns: 1fr; }
          .bm-category-tabs { flex-wrap: nowrap; }
          .rv-grid { grid-template-columns: 1fr; }
          .pf-table-wrap { font-size: 9.5px; }
          .vx-nav { flex-wrap: wrap; gap: 8px; }
          .vx-topbar-btn span.btn-text { display: none; }
          .bo-kv-grid { grid-template-columns: 1fr; }
          .bm-kv-grid { grid-template-columns: 1fr; }
          .oc-row2 { grid-template-columns: 1fr; }
          .sh-lang-row { grid-template-columns: 1fr; }
          .bm-meta-bar { flex-direction: column; }
          .bm-meta-item { border-right: none; border-bottom: 1px solid rgba(160,100,240,0.1); }
          .bm-meta-item:last-child { border-bottom: none; }
        }
        @media (max-width: 400px) {
          .vx-topbar-actions { gap: 4px; }
          .vx-topbar-btn { padding: 4px 8px; font-size: 8px; }
        }

        /* ── Stage 3 — Persona Synthesis ── */
        .px-pill {
          font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 2px 7px; border-radius: 2px; border: 1px solid;
        }
        .px-pill.include   { color: #80C870; border-color: #2A4A20; background: rgba(120,200,80,0.07); }
        .px-pill.secondary { color: #C8B840; border-color: #4A3A10; background: rgba(200,160,60,0.07); }
        .px-pill.exclude   { color: #6A7480; border-color: #2A3040; background: rgba(120,130,150,0.04); }
        .px-selectors { display: flex; gap: 6px; margin-top: 12px; }
        .px-sel-btn {
          flex: 1; padding: 7px 8px; border-radius: 2px; cursor: pointer;
          font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.08em;
          text-transform: uppercase; background: transparent; border: 1px solid #2A3040;
          color: #6A7480; transition: all 0.15s;
        }
        .px-sel-btn:hover { border-color: #3A4458; color: #9AA5BA; }
        .px-sel-btn.active.include   { background: rgba(120,200,80,0.12); border-color: #4A7A30; color: #80C870; }
        .px-sel-btn.active.secondary { background: rgba(200,160,60,0.12); border-color: #7A6A20; color: #C8B840; }
        .px-sel-btn.active.exclude   { background: rgba(200,80,80,0.10); border-color: #5A2A2A; color: #C07070; }
        .px-dyaf {
          margin: 12px 0; padding: 12px 14px; border-radius: 2px;
          border: 1px solid rgba(200,160,60,0.25); background: rgba(200,160,60,0.04);
          display: flex; flex-direction: column; gap: 6px;
        }
        .px-dyaf-title { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #C8B840; }
        .px-dyaf-row { font-size: 11px; color: #9AA5BA; line-height: 1.5; }
        .px-dyaf-row strong { color: #C8B840; }
        .px-validation { display: flex; flex-direction: column; gap: 6px; margin: 12px 0; }
        .px-check {
          display: grid; grid-template-columns: auto auto 1fr; gap: 10px; align-items: center;
          padding: 9px 12px; border-radius: 2px; border: 1px solid; font-size: 11px;
        }
        .px-check.pass { border-color: #2A4A20; background: rgba(120,200,80,0.04); }
        .px-check.warn { border-color: #5A2A2A; background: rgba(200,80,80,0.05); }
        .px-check-icon { font-size: 12px; }
        .px-check.pass .px-check-icon { color: #80C870; }
        .px-check.warn .px-check-icon { color: #C07070; }
        .px-check-name { color: #C8D0DA; letter-spacing: 0.04em; text-transform: uppercase; font-size: 9px; }
        .px-check-detail { color: #8A95AA; }
        .px-matrix th, .px-matrix td { white-space: nowrap; font-size: 10px; }

        /* ── Stage 4 — Journey Mapping ── */
        .jm-persona-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin: 14px 0 4px; }
        .jm-persona-tab {
          display: flex; flex-direction: column; gap: 2px; align-items: flex-start;
          padding: 8px 12px; border-radius: 2px; cursor: pointer;
          background: #060410; border: 1px solid #221A40; transition: all 0.15s; min-width: 120px;
        }
        .jm-persona-tab:hover { border-color: #3A2A60; }
        .jm-persona-tab.active { border-color: rgba(200,240,74,0.4); background: rgba(200,240,74,0.05); }
        .jm-persona-id { font-size: 9px; letter-spacing: 0.1em; color: #8A6AC0; }
        .jm-persona-tab.active .jm-persona-id { color: #C8F04A; }
        .jm-persona-name { font-size: 11px; color: #C8D0DA; }
        .jm-subview { display: flex; gap: 6px; margin: 14px 0; flex-wrap: wrap; }
        .jm-subview-btn {
          padding: 7px 14px; border-radius: 2px; cursor: pointer;
          font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.08em;
          text-transform: uppercase; background: transparent; border: 1px solid #2A3040; color: #6A7480;
          transition: all 0.15s;
        }
        .jm-subview-btn:hover { border-color: #3A4458; color: #9AA5BA; }
        .jm-subview-btn.active { background: rgba(200,240,74,0.08); border-color: rgba(200,240,74,0.35); color: #C8F04A; }
        .jm-stage-rail { display: flex; gap: 4px; margin-bottom: 14px; flex-wrap: wrap; }
        .jm-stage-node {
          flex: 1; min-width: 90px; display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 10px 6px; border-radius: 2px; cursor: pointer;
          background: #060410; border: 1px solid #221A40; transition: all 0.15s; position: relative;
        }
        .jm-stage-node:hover { border-color: #3A2A60; }
        .jm-stage-node.active { border-color: rgba(200,240,74,0.45); background: rgba(200,240,74,0.05); }
        .jm-stage-icon { font-size: 14px; color: #8A6AC0; }
        .jm-stage-node.active .jm-stage-icon { color: #C8F04A; }
        .jm-stage-label { font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; color: #8A95AA; text-align: center; }
        .jm-stage-node.active .jm-stage-label { color: #D8E0EA; }
        .jm-stage-summary {
          font-size: 11px; color: #9AA5BA; line-height: 1.6; margin-bottom: 12px;
          padding: 10px 12px; border-left: 2px solid rgba(200,240,74,0.3); background: rgba(200,240,74,0.03);
        }
        .jm-touchpoints { display: flex; flex-direction: column; gap: 10px; }
        .jm-tp-card { padding: 12px 14px; border-radius: 2px; background: #060410; border: 1px solid #221A40; }
        .jm-tp-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
        .jm-tp-name { font-size: 12px; color: #D8E0EA; font-weight: 500; }
        .jm-tp-channel { font-size: 8px; letter-spacing: 0.08em; text-transform: uppercase; color: #8A6AC0; border: 1px solid #3A2A60; padding: 2px 7px; border-radius: 2px; }
        .jm-tp-emotion { display: flex; align-items: center; gap: 7px; font-size: 10px; margin-bottom: 8px; }
        .jm-tp-emotion-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .jm-tp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .jm-tp-kv { display: flex; flex-direction: column; gap: 2px; }
        .jm-tp-k { font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A6478; }
        .jm-tp-v { font-size: 11px; color: #B5BECD; line-height: 1.45; }
        .jm-tp-bench { margin-top: 8px; font-size: 10px; color: #7A8AA0; font-style: italic; }
        .jm-mot-type { font-size: 8px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid; padding: 2px 7px; border-radius: 2px; }
        .jm-mot-intensity { font-size: 9px; letter-spacing: 0.06em; }

        /* Persona long-list controls */
        .px-bulk-bar { display: flex; align-items: center; justify-content: space-between; margin: 10px 0; }
        .px-bulk-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #8AAD5A; }
        .px-bulk-actions { display: flex; gap: 6px; }
        .px-bulk-btn {
          font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 6px 12px; border-radius: 2px; cursor: pointer; background: transparent;
          border: 1px solid #2A3040; color: #9AA5BA; transition: all 0.15s;
        }
        .px-bulk-btn:hover { border-color: rgba(200,240,74,0.4); color: #C8F04A; }
        .px-cplx { font-size: 8px; letter-spacing: 0.06em; text-transform: uppercase; border: 1px solid; padding: 2px 7px; border-radius: 2px; }

        /* Full persona attribute grid */
        .px-attr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px; }
        .px-attr { display: flex; flex-direction: column; gap: 4px; }
        .px-attr-k { font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: #5A6478; }
        .px-attr-list { margin: 0; padding-left: 16px; display: flex; flex-direction: column; gap: 3px; }
        .px-attr-list li { font-size: 11px; color: #B5BECD; line-height: 1.45; }
        .px-attr-list.pain li { color: #C08A8A; }
        .px-check { grid-template-columns: auto auto auto 1fr; }
        .px-check-status { font-size: 9px; letter-spacing: 0.08em; }
        .px-check.pass .px-check-status { color: #80C870; }
        .px-check.fail .px-check-status { color: #C07070; }
        .px-check.fail { border-color: #5A2A2A; background: rgba(200,80,80,0.06); }

        /* Touchpoint score cards */
        .jm-tp-emotion-row { font-size: 11px; color: #A8B2C5; font-style: italic; margin-bottom: 10px; }
        .jm-score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px 16px; }
        .jm-score { display: grid; grid-template-columns: 86px 1fr 18px; align-items: center; gap: 8px; }
        .jm-score-k { font-size: 8px; letter-spacing: 0.06em; text-transform: uppercase; color: #6A7480; }
        .jm-score-bar { height: 5px; border-radius: 3px; background: #1A1426; overflow: hidden; }
        .jm-score-fill { display: block; height: 100%; border-radius: 3px; transition: width 0.3s; }
        .jm-score-n { font-size: 10px; color: #B5BECD; text-align: right; }

        /* KPI tiers */
        .jm-kpi-tiers { display: flex; flex-direction: column; gap: 18px; }
        .jm-kpi-tier-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #C8F04A; display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .jm-kpi-tier-count { font-size: 9px; color: #8A95AA; border: 1px solid #2A3040; padding: 1px 6px; border-radius: 2px; }
        .jm-kpi-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .jm-kpi-card { padding: 13px 14px; border-radius: 2px; background: #060410; border: 1px solid #221A40; display: flex; flex-direction: column; gap: 8px; }
        .jm-kpi-card-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .jm-kpi-name { font-size: 12px; color: #D8E0EA; font-weight: 500; line-height: 1.3; }
        .jm-kpi-tl { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 7px currentColor; }
        .jm-kpi-def { font-size: 10px; color: #8A95AA; line-height: 1.5; }
        .jm-kpi-formula { font-size: 10px; color: #7A8AA0; font-style: italic; }
        .jm-kpi-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .jm-kpi-mk { display: flex; flex-direction: column; gap: 1px; }
        .jm-kpi-mk span { font-size: 8px; letter-spacing: 0.08em; text-transform: uppercase; color: #5A6478; }
        .jm-kpi-mk strong { font-size: 10px; color: #B5BECD; font-weight: 500; }
        .jm-kpi-ind { display: flex; flex-direction: column; gap: 4px; border-top: 1px solid #1A1426; padding-top: 8px; }
        .jm-kpi-indrow { font-size: 10px; color: #9AA5BA; line-height: 1.4; display: flex; gap: 7px; align-items: baseline; }
        .jm-kpi-indtag { font-size: 7px; letter-spacing: 0.08em; text-transform: uppercase; padding: 1px 5px; border-radius: 2px; border: 1px solid; flex-shrink: 0; }
        .jm-kpi-indtag.lead { color: #7AC8E0; border-color: #2A4A58; }
        .jm-kpi-indtag.lag { color: #C8B840; border-color: #4A3A10; }

        /* Stage 4 export bar */
        .jm-export-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 18px; padding-top: 16px; border-top: 1px solid #1E2229; }
        .jm-export-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #5A6478; }
        .jm-export-btn {
          font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase;
          padding: 7px 12px; border-radius: 2px; cursor: pointer; background: transparent;
          border: 1px solid #2A3040; color: #9AA5BA; transition: all 0.15s;
        }
        .jm-export-btn:hover { border-color: rgba(200,240,74,0.4); color: #C8F04A; }
        .jm-export-btn.primary { background: rgba(200,240,74,0.08); border-color: rgba(200,240,74,0.35); color: #C8F04A; }
        .jm-export-btn.primary:hover { background: rgba(200,240,74,0.16); }
        .jm-cancel-btn {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 10px;
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 8px 16px; border-radius: 2px; cursor: pointer;
          background: rgba(200,80,80,0.06); border: 1px solid rgba(200,80,80,0.3); color: #C07070; transition: all 0.15s;
        }
        .jm-cancel-btn:hover { background: rgba(200,80,80,0.14); border-color: rgba(200,80,80,0.5); }

        @media (max-width: 560px) {
          .jm-tp-grid { grid-template-columns: 1fr; }
          .jm-score-grid { grid-template-columns: 1fr; }
          .px-attr-grid { grid-template-columns: 1fr; }
          .jm-kpi-cards { grid-template-columns: 1fr; }
          .px-check { grid-template-columns: auto auto 1fr; }
        }

        /* ════════════════════════════════════════════════════ */
        /* LIGHT THEME — consulting-report palette (override)     */
        /* ════════════════════════════════════════════════════ */
        .vx-shell {
          background: #FFFFFF;
          border: 1px solid #E2E6EE;
          box-shadow: 0 10px 40px rgba(31,41,55,0.10);
        }
        .vx-topbar { background: #FFFFFF; border-bottom: 1px solid #E8EBF1; }
        .vx-logo, .vx-topbar-title { color: #1E1B4B !important; }
        .vx-topbar-btn { color: #475569; border-color: #D7DCE6; background: #FFFFFF; }
        .vx-topbar-btn.export { color: #4F46E5; border-color: #C7C9F5; background: #EEF0FF; }
        .vx-topbar-btn.export:hover { background: #E0E2FF; border-color: #4F46E5; }
        .vx-topbar-btn.reset { color: #B91C1C; border-color: #F3C7C7; background: #FEF2F2; }
        .vx-topbar-btn.reset:hover { background: #FEE2E2; }
        .vx-progress-bar { background: #FFFFFF; border-bottom: 1px solid #E8EBF1; }
        .vx-progress-track { background: #E8EBF1; }
        .vx-progress-fill { background: linear-gradient(90deg,#6366F1,#4F46E5) !important; }
        .vx-sidebar { background: #F7F8FC; border-right: 1px solid #E8EBF1; }
        .vx-main { background: #FFFFFF; }
        .vx-sidebar-footer { border-top: 1px solid #E8EBF1; }
        .vx-sidebar-footer p { color: #94A3B8; }
        .step-label { color: #64748B; }
        .vx-step-item.active .step-label, .vx-step-item.active .step-num { color: #4F46E5 !important; }
        .vx-step-item.done .step-label { color: #16A34A; }
        .vx-step-item.done .step-num { color: #16A34A; }
        .step-num { color: #94A3B8; }

        /* Headings / body text */
        .ed-dash-title, .ed-stage-name, .ed-active-name, .vx-welcome-title,
        .vx-placeholder-title, .bo-title, .bm-title, .rv-heading,
        .ec-section-title { color: #1E1B4B !important; }
        .vx-welcome-eyebrow, .vx-placeholder-eyebrow, .ed-eyebrow { color: #4F46E5 !important; opacity: 1; }
        .ed-dash-sub, .vx-welcome-desc, .vx-placeholder-body, .ed-stage-objective { color: #5B6577 !important; }

        /* Executive dashboard cards */
        .ed-active-banner { background: linear-gradient(90deg, #EEF0FF, #F7F8FC); border-color: #C7C9F5; }
        .ed-active-label { color: #4F46E5; }
        .ed-stage-card { background: #FFFFFF; border: 1px solid #E2E6EE; box-shadow: 0 2px 8px rgba(31,41,55,0.04); }
        .ed-stage-card.active { border-color: #4F46E5; box-shadow: 0 0 0 1px #4F46E5 inset, 0 4px 14px rgba(79,70,229,0.12); }
        .ed-stage-card.Completed { border-color: #BBF7D0; }
        .ed-stage-num { color: #94A3B8; }
        .ed-stage-icon { color: #4F46E5; }
        .ed-stage-card.NotStarted .ed-stage-icon { color: #C2C7D2; }
        .ed-progress-track { background: #ECEFF5; }
        .ed-progress-fill { background: linear-gradient(90deg,#6366F1,#4F46E5); }
        .ed-pct { color: #64748B; }
        .ed-status-pill.Completed, .ed-status-text.Completed { color: #15803D; }
        .ed-status-pill.InProgress, .ed-status-text.InProgress { color: #B45309; }
        .ed-status-pill.NotStarted, .ed-status-text.NotStarted { color: #64748B; }
        .ed-status-pill.Completed { background: #DCFCE7; border-color: #BBF7D0; }
        .ed-status-pill.InProgress { background: #FEF3C7; border-color: #FDE68A; }
        .ed-status-pill.NotStarted { background: #F1F5F9; border-color: #E2E8F0; }
        .ed-status-dot.Completed { background: #16A34A; box-shadow: none; }
        .ed-status-dot.InProgress { background: #D97706; box-shadow: none; }
        .ed-status-dot.NotStarted { background: #CBD5E1; }
        .vx-begin-btn { background: #4F46E5 !important; color: #FFFFFF !important; border: none !important; }
        .vx-begin-btn:hover { background: #4338CA !important; }
        .vx-welcome-rule { background: #E8EBF1 !important; }
        .vx-meta-value { color: #4F46E5 !important; }
        .vx-meta-label { color: #94A3B8 !important; }

        /* Generic surfaces, inputs, cards */
        .sector-card, .ec-field, .oc-section, .sh-panel, .sh-fields-panel,
        .ts-card, .rv-section, .bo-wrap, .bm-wrap, .bm-card, .jm-tp-card,
        .jm-kpi-card, .jm-persona-tab, .jm-stage-node, .ed-stage-card,
        .bo-section, .oc-radio-card {
          background: #FFFFFF;
          border-color: #E2E6EE;
        }
        .oc-sections, .bo-sections { border-color: #E2E6EE; }
        .oc-section { border-bottom: 1px solid #E8EBF1; }
        .bo-section { border-bottom: 1px solid #E8EBF1; }
        .sector-card:hover, .ts-card:hover, .jm-persona-tab:hover, .jm-stage-node:hover, .oc-radio-card:hover { border-color: #A5B4FC; }
        .sector-card.selected, .ts-card.primary { border-color: #4F46E5; background: #F5F6FF; }
        input, textarea, select, .oc-textarea, .sh-input, .sh-textarea, .ec-input, .oc-select, .oc-number, .vx-input {
          background: #FFFFFF !important;
          color: #1F2937 !important;
          border: 1px solid #D7DCE6 !important;
        }
        input::placeholder, textarea::placeholder { color: #9CA3AF !important; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: #4F46E5 !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.12); }
        .ec-label, .oc-field-label, .sh-field-label, .sector-label, .bo-k, .bm-k,
        .rv-key, .px-attr-k, .jm-score-k, .bm-meta-k, .jm-kpi-mk span, .jm-tp-k {
          color: #64748B !important;
        }
        .bo-v, .bm-v, .rv-val, .px-attr-list li, .jm-tp-v, .jm-kpi-mk strong, .sh-tier-label {
          color: #1F2937 !important;
        }
        .rv-val.muted { color: #9CA3AF !important; }
        .bo-v.accent, .bm-v.accent, .rv-val.accent { color: #4F46E5 !important; }
        .px-attr-list.pain li, .jm-kpi-indrow { color: #B91C1C !important; }
        .bo-string { background: #F7F8FC !important; color: #475569 !important; border: 1px solid #E8EBF1; }

        /* Chips, badges, accents */
        .bo-chip, .rv-chip, .pdf-chip { background: #EEF0FF !important; color: #4338CA !important; border: none !important; }
        .rv-chip.lime { background: #DCFCE7 !important; color: #15803D !important; }
        .bo-chip.high, .bo-chip.High { background: #FEE2E2 !important; color: #B91C1C !important; }
        .bm-eyebrow, .bo-eyebrow { color: #4F46E5 !important; }
        .bm-title { color: #1E1B4B !important; }
        .bm-meta-bar, .bo-meta-bar { background: #F7F8FC; border-color: #E8EBF1; }
        .bm-meta-v { color: #1E1B4B; }
        .bm-card-header, .bo-section-header { background: #FFFFFF; }
        .bm-card-header:hover, .bo-section-header:hover { background: #F7F8FC; }
        .bm-card.open .bm-card-header { background: #F5F6FF; }
        .bm-card-title, .bo-section-title { color: #1E293B !important; }
        .bm-card-institution, .bm-card-id, .bo-section-key { color: #64748B !important; }
        .bm-card-body { background: #FBFCFE !important; }
        .bo-card { background: #F7F8FC; border-color: #E8EBF1; }
        .bo-card-title { color: #1E293B; }
        .bo-card-body { color: #475569; }

        /* Buttons */
        .rv-generate-btn, .bm-trigger-btn {
          background: #4F46E5 !important; color: #FFFFFF !important; border: none !important;
        }
        .rv-generate-btn:hover:not(:disabled), .bm-trigger-btn:hover:not(:disabled) { background: #4338CA !important; }
        .bo-download-btn, .bm-dl-btn { background: #FFFFFF; color: #4F46E5; border: 1px solid #C7C9F5; }
        .bo-download-btn:hover, .bm-dl-btn:hover { background: #EEF0FF; }
        .bo-download-btn.pdf, .bm-dl-btn.pdf { background: #4F46E5; color: #FFFFFF; border-color: #4F46E5; }
        .bo-download-btn.pdf:hover, .bm-dl-btn.pdf:hover { background: #4338CA; }
        .bo-header-btns { display: flex; gap: 8px; align-items: center; }
        .bm-header { display: flex; align-items: center; gap: 8px; }

        /* Tables */
        .bo-table th, .px-matrix th, .jm-kpi-table th { background: #F1F3F9 !important; color: #374151 !important; border-color: #E2E6EE !important; }
        .bo-table td, .px-matrix td, .jm-kpi-table td { border-color: #EceFf5 !important; color: #1F2937 !important; }

        /* Tabs / category nav */
        .bm-category-tabs, .jm-subview { border-color: #E8EBF1; }
        .bm-tab, .jm-subview-btn, .jm-persona-tab { background: #F7F8FC; border-color: #E2E6EE; color: #64748B; }
        .bm-tab.active, .jm-subview-btn.active { background: #EEF0FF; border-color: #4F46E5; color: #4F46E5; }
        .jm-persona-tab.active { background: #EEF0FF; border-color: #4F46E5; }
        .jm-persona-id { color: #6366F1; }
        .jm-persona-tab.active .jm-persona-id { color: #4F46E5; }
        .jm-persona-name { color: #1E293B; }
        .jm-stage-node { background: #F7F8FC; border-color: #E2E6EE; }
        .jm-stage-node.active { background: #EEF0FF; border-color: #4F46E5; }
        .jm-stage-icon { color: #6366F1; }
        .jm-stage-node.active .jm-stage-icon, .jm-stage-node.active .jm-stage-label { color: #4F46E5; }
        .jm-stage-label { color: #64748B; }
        .jm-stage-summary { background: #F5F6FF; border-left-color: #4F46E5; color: #475569; }

        /* Error / spinner */
        .bm-error { background: #FEF2F2 !important; color: #B91C1C !important; border: 1px solid #FBD5D5 !important; }

        /* ── New control styling (Step 5 / 6 / 8) ── */
        .oc-select, .oc-number {
          width: 100%; padding: 10px 12px; border-radius: 8px; font-family: 'DM Mono', monospace;
          font-size: 13px; cursor: pointer;
        }
        .oc-number { cursor: text; }
        .oc-subfield { margin-top: 10px; padding-left: 14px; border-left: 2px solid #E0E2FF; }
        .oc-radio-cards { display: flex; flex-direction: column; gap: 8px; }
        .oc-radio-card {
          display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 8px;
          cursor: pointer; font-size: 13px; color: #374151; transition: all 0.15s;
        }
        .oc-radio-card.active { border-color: #4F46E5 !important; background: #F5F6FF !important; color: #312E81; font-weight: 500; }
        .oc-radio-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #C7CCD8; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .oc-radio-card.active .oc-radio-dot { border-color: #4F46E5; }
        .oc-radio-dot-inner { width: 8px; height: 8px; border-radius: 50%; background: transparent; }
        .oc-radio-card.active .oc-radio-dot-inner { background: #4F46E5; }

        /* Stakeholder tier rows with definitions */
        .sh-tier-row { align-items: flex-start !important; padding: 12px 14px !important; }
        .sh-tier-text { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
        .sh-tier-label-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .sh-tier-def { font-size: 11px; color: #6B7280; line-height: 1.5; }
        .sh-tier-row.checked { background: #F5F6FF !important; }
        .sh-tier-badge { font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 8px; border-radius: 20px; }
        .sh-tier-checkbox { border: 1.5px solid #C7CCD8; color: #FFFFFF; margin-top: 1px; }
        .sh-tier-row.checked .sh-tier-checkbox { background: #4F46E5; border-color: #4F46E5; }
        .sh-panel-title, .sh-fields-title { color: #1E1B4B !important; }
        .sh-panel-count { color: #4F46E5 !important; background: #EEF0FF; }
        .sh-nat-grid { display: flex; flex-wrap: wrap; gap: 7px; }
        .sh-nat-chip {
          font-size: 12px; padding: 7px 13px; border-radius: 20px; cursor: pointer;
          background: #F7F8FC; border: 1px solid #D7DCE6; color: #475569; transition: all 0.15s;
        }
        .sh-nat-chip:hover { border-color: #A5B4FC; }
        .sh-nat-chip.on { background: #4F46E5; border-color: #4F46E5; color: #FFFFFF; }

        /* Template plain-language description */
        .ts-card-simple {
          font-size: 12.5px; line-height: 1.6; color: #475569; margin: 10px 0 4px;
          padding: 10px 12px; background: #F5F6FF; border-radius: 8px; border-left: 3px solid #4F46E5;
        }
        .ts-card-name { color: #1E1B4B !important; }
        .ts-card-origin { color: #6366F1 !important; }
        .ts-meta-label { color: #94A3B8 !important; }
        .ts-meta-value { color: #475569 !important; }
        .ts-action-btn { background: #FFFFFF; border: 1px solid #D7DCE6; color: #475569; }
        .ts-action-btn.active-primary { background: #4F46E5; color: #FFFFFF; border-color: #4F46E5; }
        .ts-action-btn.active-secondary { background: #EEF0FF; color: #4F46E5; border-color: #C7C9F5; }
        .ts-selection-pill { background: #F7F8FC; border: 1px solid #E2E6EE; }
        .ts-pill-label { color: #94A3B8; }
        .ts-pill-value { color: #1E293B; }

        /* Persona avatar + POD chip + section icons */
        .px-avatar {
          width: 40px; height: 40px; border-radius: 10px; display: inline-flex; align-items: center;
          justify-content: center; color: #FFFFFF; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 14px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(79,70,229,0.25);
        }
        .px-head-text { display: flex; flex-direction: column; gap: 2px; }
        .bm-card-header-left { display: flex; align-items: center; gap: 12px; }
        .px-pod-chip { font-size: 9px; background: #CFFAFE; color: #0E7490; padding: 2px 8px; border-radius: 20px; font-weight: 700; letter-spacing: 0.04em; }
        .px-avatar-wrap { display: inline-flex; }
        .px-attr { background: #F7F8FC; border-radius: 8px; padding: 10px 12px; }
        .px-attr-k { color: #4F46E5 !important; font-weight: 600; }
        .px-pill.include { background: #DCFCE7; color: #15803D; }
        .px-pill.secondary { background: #FEF3C7; color: #B45309; }
        .px-pill.exclude { background: #F1F5F9; color: #64748B; }
        .px-sel-btn { background: #FFFFFF; border: 1px solid #D7DCE6; color: #64748B; }
        .px-sel-btn.active.include { background: #DCFCE7; border-color: #16A34A; color: #15803D; }
        .px-sel-btn.active.secondary { background: #FEF3C7; border-color: #D97706; color: #B45309; }
        .px-sel-btn.active.exclude { background: #FEE2E2; border-color: #DC2626; color: #B91C1C; }
        .px-dyaf { background: #FFFBEB; border-color: #FDE68A; }
        .px-dyaf-title, .px-dyaf-row strong { color: #B45309; }
        .px-dyaf-row { color: #78716C; }
        .px-validation .px-check.pass { background: #F0FDF4; border-color: #BBF7D0; }
        .px-validation .px-check.fail { background: #FEF2F2; border-color: #FBD5D5; }
        .px-check-name { color: #374151; }
        .px-check-detail { color: #6B7280; }
        .px-bulk-label { color: #4F46E5; }
        .px-bulk-btn { background: #FFFFFF; border: 1px solid #D7DCE6; color: #475569; }
        .px-bulk-btn:hover { border-color: #4F46E5; color: #4F46E5; }
        .px-cplx { background: #FFFFFF; }
        .px-matrix td strong { color: #1E1B4B; }

        /* Journey legend + touchpoint icon */
        .jm-legend { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin: 0 0 12px; font-size: 11px; color: #64748B; }
        .jm-legend-item { display: inline-flex; align-items: center; gap: 5px; }
        .jm-legend-dot { width: 9px; height: 9px; border-radius: 50%; }
        .jm-legend-note { color: #94A3B8; font-style: italic; }
        .jm-tp-icon { margin-right: 2px; }
        .jm-tp-name { color: #1E293B !important; }
        .jm-tp-channel { color: #4F46E5 !important; border: 1px solid #C7C9F5; background: #EEF0FF; }
        .jm-tp-emotion-row { color: #6B7280 !important; }
        .jm-tp-card { box-shadow: 0 1px 4px rgba(31,41,55,0.04); }
        .jm-score-bar { background: #ECEFF5 !important; }
        .jm-score-k { color: #64748B !important; }
        .jm-kpi-tier-label { color: #4F46E5 !important; }
        .jm-kpi-name { color: #1E293B !important; }
        .jm-kpi-def { color: #64748B !important; }
        .jm-kpi-card { box-shadow: 0 1px 4px rgba(31,41,55,0.04); }
        .jm-kpi-type, .jm-kpi-owner { background: #F1F3F9; color: #475569; border: 1px solid #E2E6EE; }
        .jm-mot-type { background: #FFFFFF; }
        .jm-export-bar { border-top: 1px solid #E8EBF1; }
        .jm-export-label { color: #94A3B8; }
        .jm-export-btn { background: #FFFFFF; border: 1px solid #D7DCE6; color: #475569; }
        .jm-export-btn:hover { border-color: #4F46E5; color: #4F46E5; }
        .jm-export-btn.primary { background: #4F46E5; border-color: #4F46E5; color: #FFFFFF; }
        .jm-export-btn.primary:hover { background: #4338CA; }
        .jm-cancel-btn { background: #FEF2F2; border-color: #FBD5D5; color: #B91C1C; }

        /* Review screen */
        .rv-section { background: #FFFFFF; border-color: #E2E6EE; }
        .rv-section-header:hover { background: #F7F8FC; }
        .rv-tbl-badge { background: #FFFFFF; }

        /* Sector / step generic text */
        .sector-name, .sector-card-title { color: #1E293B !important; }
        .sector-desc, .sector-card-desc { color: #64748B !important; }
        .ec-radio-btn { background: #FFFFFF; border: 1px solid #D7DCE6; color: #475569; }
        .ec-radio-btn.active { background: #F5F6FF; border-color: #4F46E5; color: #312E81; }
        .ec-divider, .ts-divider, .bo-divider { background: #E8EBF1 !important; border-color: #E8EBF1 !important; }
        .oc-checkbox, .oc-yn-btn { background: #FFFFFF; border: 1px solid #D7DCE6; color: #475569; }
        .oc-checkbox.checked { background: #F5F6FF; border-color: #4F46E5; color: #312E81; }
        .oc-check-box { border: 1.5px solid #C7CCD8; color: #4F46E5; }
        .oc-checkbox.checked .oc-check-box { background: #4F46E5; border-color: #4F46E5; color: #FFFFFF; }
        .oc-yn-btn.active-yes { background: #DCFCE7; border-color: #16A34A; color: #15803D; }
        .oc-yn-btn.active-no { background: #FEE2E2; border-color: #DC2626; color: #B91C1C; }
        .oc-header:hover { background: #F7F8FC; }
        .oc-header-num { color: #94A3B8; }
        .oc-header-title { color: #1E293B; }
        .oc-header-badge { background: #EEF0FF; color: #4F46E5; }

        /* Bottom nav */
        .vx-nav { background: #FFFFFF; border-top: 1px solid #E8EBF1; }
        .vx-step-counter { color: #64748B; }
        .vx-nav-btn { background: #FFFFFF; border: 1px solid #D7DCE6; color: #475569; }
        .vx-nav-btn:hover:not(:disabled) { border-color: #4F46E5; color: #4F46E5; }
        .vx-nav-btn.next { background: #4F46E5; color: #FFFFFF; border-color: #4F46E5; }
        .vx-nav-btn.next:hover { background: #4338CA; }

        /* ════ CATCH-ALL: force light surfaces + readable text everywhere ════ */
        .vx-main, .vx-content,
        .sector-card, .sector-select, .ec-field, .ec-input, .ec-select, .ec-radio-btn,
        .pf-row, .pf-select, .pf-input, .oc-section, .oc-header, .oc-body, .oc-field,
        .oc-checkbox, .oc-yn-btn, .oc-select, .oc-number, .oc-radio-card, .oc-textarea,
        .sh-panel, .sh-fields-panel, .sh-tier-row, .sh-input, .sh-textarea, .sh-select,
        .ts-card, .ts-selection-pill, .pt-select,
        .rv-section, .rv-section-header, .rv-kv,
        .bo-wrap, .bo-sections, .bo-section, .bo-section-header, .bo-card, .bo-meta-bar,
        .bm-wrap, .bm-panel, .bm-card, .bm-card-header, .bm-card-body, .bm-meta-bar,
        .bm-category-tabs, .bm-tab,
        .jm-tp-card, .jm-kpi-card, .jm-kpi-tier, .jm-persona-tab, .jm-stage-node,
        .jm-subview, .jm-mot-type,
        .px-attr, .px-validation, .px-check, .px-dyaf,
        .ed-stage-card, .ed-active-banner {
          background-color: #FFFFFF;
        }
        .oc-section.open .oc-header, .bm-card.open .bm-card-header, .sh-tier-row.checked,
        .oc-checkbox.checked, .ec-radio-btn.active, .jm-stage-node.active, .jm-persona-tab.active,
        .bm-tab.active, .jm-subview-btn.active, .oc-radio-card.active, .sector-card.selected,
        .ts-card.primary, .jm-stage-summary, .px-attr, .bo-card, .bo-meta-bar, .bm-meta-bar,
        .ts-card-simple, .rv-section-header, .bo-section-header {
          background-color: #F5F6FF;
        }
        .bo-card, .px-attr { background-color: #F7F8FC; }
        /* dropdown <option> menus */
        select option, .sector-select option, .ec-select option, .pf-select option,
        .pt-select option, .oc-select option { background: #FFFFFF !important; color: #1F2937 !important; }
        /* any remaining KPI/MoT inner surfaces */
        .jm-kpi-ind, .jm-kpi-meta, .bm-confidence, .px-cplx, .px-pill, .jm-tp-channel { background-color: transparent; }
        /* GUARANTEE readable text: anything inside these panels defaults to dark text */
        .bm-card-body, .bm-card-body *, .jm-tp-card, .jm-tp-card *, .jm-kpi-card, .jm-kpi-card *,
        .px-attr, .px-attr *, .bo-card, .bo-card *, .rv-section, .rv-section * {
          color: inherit;
        }

        /* ════ FIX persona/benchmark card header overlap & readability ════ */
        .bm-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 16px; }
        .bm-card-header-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; min-width: 0; flex: 1; }
        .px-avatar { width: 42px; height: 42px; border-radius: 11px; font-size: 15px; flex-shrink: 0; }
        .px-head-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
        /* When title/institution are NOT inside px-head-text (benchmark cards), force them onto their own full-width lines so they never overlap */
        .bm-card-header-left > .bm-card-id { flex-basis: 100%; display: block; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: #6366F1 !important; margin-bottom: 2px; }
        .bm-card-header-left > .bm-card-title { flex-basis: 100%; }
        .bm-card-header-left > .bm-card-institution { flex-basis: 100%; }
        .bm-card-title { font-size: 15px; font-weight: 700; color: #1E1B4B !important; line-height: 1.35; white-space: normal; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .bm-card-institution { font-size: 11px; color: #6366F1 !important; line-height: 1.4; white-space: normal; }
        .px-head-text > .bm-card-id { display: none; }
        .bm-card-header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }

        /* persona attribute grid — single column, generous spacing, no overlap */
        .px-attr-grid { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 12px; }
        .px-attr { flex: 1 1 280px; min-width: 0; padding: 12px 14px; border-radius: 10px; border: 1px solid #E8EBF1; box-sizing: border-box; }
        .px-attr-k { display: block; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: #4F46E5 !important; font-weight: 700; margin-bottom: 6px; white-space: normal; }
        .px-attr-list { margin: 0; padding-left: 16px; }
        .px-attr-list li { font-size: 12px; line-height: 1.55; color: #1F2937 !important; margin: 3px 0; overflow-wrap: break-word; }
        .px-attr-list.pain li { color: #B91C1C !important; }
        .bm-kv-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; margin-top: 12px; }
        .bm-kv { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .bm-k { font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; color: #64748B !important; white-space: normal; overflow-wrap: anywhere; }
        .bm-v { font-size: 12.5px; line-height: 1.5; color: #1F2937 !important; overflow-wrap: anywhere; word-break: normal; min-width: 0; }
        .bm-v.accent { color: #4F46E5 !important; }
        .bm-card-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #FBFCFE !important; min-width: 0; }
        /* prevent any flex/grid ancestor from collapsing a track to per-character width */
        .bm-wrap, .bm-panel, .bm-card, .bm-card-body, .bm-card-header-left, .px-head-text, .px-attr, .px-attr-grid, .jm-kpi-card, .jm-tp-card { min-width: 0; }
        .bo-chips { display: flex; flex-wrap: wrap; gap: 6px; }

        /* ════ DEFINITIVE FIX: render persona detail fields as full-width stacked blocks ════ */
        /* CSS grid tracks can collapse to per-character width when content can't shrink; a block layout cannot. */
        .bm-card-body .bm-kv-grid { display: block !important; margin-top: 8px !important; }
        .bm-card-body .bm-kv-grid > .bm-kv {
          display: block !important;
          width: 100% !important;
          grid-column: auto !important;
          margin: 0 0 12px 0 !important;
          padding: 10px 12px !important;
          background: #F7F8FC !important;
          border: 1px solid #ECEFF5 !important;
          border-radius: 8px !important;
        }
        .bm-card-body .bm-kv-grid > .bm-kv:last-child { margin-bottom: 0 !important; }
        .bm-card-body .bm-kv-grid > .bm-kv > .bm-k {
          display: block !important;
          width: 100% !important;
          margin-bottom: 4px !important;
          white-space: normal !important;
          word-break: normal !important;
          overflow-wrap: normal !important;
          color: #4F46E5 !important;
          font-weight: 700 !important;
        }
        .bm-card-body .bm-kv-grid > .bm-kv > .bm-v {
          display: block !important;
          width: 100% !important;
          white-space: normal !important;
          word-break: normal !important;
          overflow-wrap: break-word !important;
        }

        /* KPI cards readable */
        .jm-kpi-cards { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; }
        .jm-kpi-card { padding: 14px; }
        .jm-kpi-name { font-size: 13px; line-height: 1.35; color: #1E293B !important; overflow-wrap: anywhere; }
        .jm-kpi-def { color: #64748B !important; }
        .jm-kpi-mk span { color: #94A3B8 !important; }
        .jm-kpi-mk strong { color: #1F2937 !important; overflow-wrap: anywhere; }
        .jm-kpi-indrow { color: #475569 !important; }

        @media (max-width: 720px) {
          .px-attr-grid, .bm-kv-grid, .jm-kpi-cards { grid-template-columns: minmax(0, 1fr); }
        }

        /* semantic badges — readable on white */
        .bo-severity.High, .bm-confidence.Low { color: #B91C1C !important; background: #FEE2E2 !important; border-color: #FBD5D5 !important; }
        .bo-severity.Med, .bm-confidence.Medium { color: #B45309 !important; background: #FEF3C7 !important; border-color: #FDE68A !important; }
        .bo-severity.Low, .bm-confidence.High { color: #15803D !important; background: #DCFCE7 !important; border-color: #BBF7D0 !important; }
        .px-check.pass .px-check-icon { color: #16A34A !important; }
        .px-check.warn .px-check-icon, .px-check.fail .px-check-icon { color: #DC2626 !important; }
        .bo-rec { color: #4F46E5 !important; }
        .bo-card-title { color: #1E293B !important; }
        .bo-card-body { color: #475569 !important; }
        .bm-chevron, .bo-chevron, .oc-chevron, .rv-chevron { color: #94A3B8 !important; }
        .jm-mot-type { font-weight: 700; }
        .bm-spinner { border-color: rgba(255,255,255,0.4) !important; border-top-color: #FFFFFF !important; }

        /* ════ FINAL SAFETY NET — force every remaining dark box to light + readable text ════ */
        .bm-gate, .bm-header, .bm-panel, .bo-body, .bo-header, .rv-body, .rv-output-block,
        .sh-fields-body, .pf-summary-bar, .pf-table, .pt-table, .pt-table-header,
        .sector-dropdown-row, .vx-placeholder-block, .vx-field-skeleton, .ec-tone-chip,
        .pt-rank-input, .pt-select, .pf-select, .sector-select, .ec-select {
          background: #FFFFFF !important;
        }
        .bo-header { background: #F7F8FC !important; border-bottom: 1px solid #E8EBF1 !important; }
        .bm-header { background: transparent !important; }
        .bm-gate { background: #F7F8FC !important; border: 1px solid #E2E6EE !important; color: #475569 !important; }
        .pt-table-header, .pf-table thead, .pt-table thead { background: #F1F3F9 !important; }
        .pt-table th, .pf-table th { background: #F1F3F9 !important; color: #374151 !important; }
        .pt-table td, .pf-table td { color: #1F2937 !important; border-color: #ECEFF5 !important; }
        .ec-tone-chip { background: #F7F8FC !important; border: 1px solid #D7DCE6 !important; color: #475569 !important; }
        .ec-tone-chip.active { background: #EEF0FF !important; border-color: #4F46E5 !important; color: #312E81 !important; }
        .sector-subtype-tag { background: #EEF0FF !important; color: #4338CA !important; border: 1px solid #C7C9F5 !important; }
        .sector-dropdown-row { border: 1px solid #D7DCE6 !important; }
        .vx-btn-primary { background: #4F46E5 !important; color: #FFFFFF !important; border: none !important; }
        .vx-btn-ghost { background: #FFFFFF !important; color: #475569 !important; border: 1px solid #D7DCE6 !important; }
        .rv-output-block { border: 1px solid #E2E6EE !important; }
        .sector-select option, .ec-select option, .pf-select option, .pt-select option { background: #FFFFFF !important; color: #1F2937 !important; }
        /* Any element still carrying the original near-black ink becomes readable slate */
        .pt-rank-input, .pt-select, .pf-select, .sector-select, .ec-select { color: #1F2937 !important; }
        .pf-summary-bar, .pf-summary-bar * { color: #475569 !important; }
        .bo-body { border: 1px solid #E8EBF1 !important; }

        /* ════ Universal grid-collapse guard: never let a track shrink to per-character width ════ */
        .bo-kv-grid, .jm-tp-grid, .jm-score-grid, .jm-kpi-meta { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important; }
        .bo-kv, .bo-v, .bo-k, .jm-tp-v, .jm-tp-k, .jm-kpi-mk, .rv-val, .rv-key, .sh-tier-def, .sh-tier-label { min-width: 0; overflow-wrap: anywhere; }
        .bo-kv { display: flex; flex-direction: column; min-width: 0; }
        @media (max-width: 720px) {
          .bo-kv-grid, .jm-tp-grid, .jm-score-grid, .jm-kpi-meta { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>


      <div className="vx-shell">
        {/* Top bar */}
        <div className="vx-topbar">
          <div className="vx-topbar-left">
            <button className="vx-hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">☰</button>
            <div className="vx-logo">VX <span>—</span> Journey</div>
            <div className="vx-badge">Intelligence Engine · v2.4.1</div>
          </div>
          <div className="vx-topbar-actions">
            <button
              className="vx-topbar-btn export"
              onClick={handleExportState}
              disabled={!selectedSector && !expPurpose && !shTiers.length}
              title="Export all collected state as JSON"
            >
              ↓ <span className="btn-text">Export Brief</span>
            </button>
            <button className="vx-topbar-btn reset" onClick={handleStartOver} title="Reset all data">
              ↺ <span className="btn-text">Start Over</span>
            </button>
          </div>
        </div>

        {/* Rich progress bar */}
        <div className="vx-progress-wrap">
          <div className="vx-progress-info">
            <span className="vx-progress-step-label">
              <strong>{steps[current]?.label || "Welcome"}</strong>
            </span>
            <div className="vx-progress-track">
              <div className="vx-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="vx-progress-pct">{Math.round(progressPct)}%</span>
          </div>
        </div>

        {/* Body */}
        <div className="vx-body">
          {/* Mobile overlay */}
          <div
            className={`vx-sidebar-overlay ${sidebarOpen ? "mobile-open" : ""}`}
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar — stage-grouped dashboard navigation */}
          <aside className={`vx-sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
            <div className="vx-nav-title">Journey Progress</div>

            {/* Top-level: Executive Program Dashboard (landing screen) */}
            <div
              className={`vx-dashboard-nav ${current === 0 ? "active" : ""}`}
              onClick={() => { setCurrent(0); setShowConsolidated(false); setSidebarOpen(false); }}
            >
              <span className="vx-dashboard-icon">▦</span>
              <span className="vx-dashboard-label">Executive Program Dashboard</span>
            </div>

            {STAGE_GROUPS.map((g) => {
              // Stage completion state
              const isIntake = g.n === 1;
              const outputReady = g.outputKey === "benchmark" ? !!benchmarkData
                : g.outputKey === "persona" ? (!!fullPersonas || !!personaData)
                : g.outputKey === "journey" ? !!journeyData : false;
              const intakeDone = current >= 8;
              const stageDone = isIntake ? intakeDone : outputReady;
              // A stage is "reachable" once the user has unlocked it via Proceed buttons
              const reachable = isIntake || (current >= 8 && unlockedStage >= g.n);
              // On the Review screen the active stage follows unlockedStage; during intake, Stage 1 is active.
              const stageActive = current < 8 ? isIntake : (g.n === unlockedStage);
              const expanded = (g.n in userToggledStages) ? userToggledStages[g.n] : (g.n === (current < 8 ? 1 : unlockedStage));
              return (
                <div key={g.n} className={`vx-stage-group ${stageActive ? "active" : ""}`} style={{ "--stage-color": g.color }}>
                  <div className="vx-stage-head" onClick={() => setUserToggledStages(o => ({ ...o, [g.n]: !expanded }))}>
                    <span className={`vx-stage-badge ${stageDone ? "done" : ""}`} style={{ background: g.color }}>
                      {stageDone ? "✓" : g.n}
                    </span>
                    <span className="vx-stage-name">Stage {g.n} — {g.name}</span>
                    <span className="vx-stage-chev">{expanded ? "▾" : "▸"}</span>
                  </div>
                  {expanded && (
                    <div className="vx-stage-items">
                      {isIntake ? (
                        <>
                        {g.items.map((it) => {
                          const done = current > it.id;
                          const active = current === it.id && !(current === 8 && unlockedStage === 1);
                          const locked = it.id > current + 0 && it.id > 8 ? true : false;
                          return (
                            <div
                              key={it.id}
                              className={`vx-nav-item ${active ? "active" : ""} ${done ? "done" : ""}`}
                              onClick={() => { setCurrent(it.id); setShowConsolidated(false); setSidebarOpen(false); }}
                            >
                              <span className="vx-nav-mark">{done ? "✓" : active ? "●" : "○"}</span>
                              <span className="vx-nav-label">{it.label}</span>
                            </div>
                          );
                        })}
                        {/* Stage 1 generated output — the Experience Design Brief */}
                        {briefData && (
                          <div
                            className={`vx-nav-item ${current === 8 && unlockedStage === 1 ? "active" : ""} done`}
                            onClick={() => { setCurrent(8); setUnlockedStage(1); setShowConsolidated(false); setSidebarOpen(false); }}
                          >
                            <span className="vx-nav-mark">✓</span>
                            <span className="vx-nav-label">Experience Design Brief</span>
                          </div>
                        )}
                        </>
                      ) : (
                        (g.subItems || []).map((sub, si) => {
                          // A stage is reachable if the user has progressed at least that far.
                          const maxReached = journeyData ? 4 : (fullPersonas?.personas?.length > 0) ? 4 : benchmarkData ? 3 : briefData ? 2 : 1;
                          const stageReachable = g.n <= Math.max(unlockedStage, maxReached);
                          const onThisStage = current === 8 && unlockedStage === g.n;
                          return (
                            <div
                              key={si}
                              className={`vx-nav-item ${onThisStage && si === 0 ? "active" : ""} ${stageReachable ? "" : "locked"}`}
                              onClick={() => {
                                if (!stageReachable) return;
                                setCurrent(8);
                                setUnlockedStage(g.n);   // screen replacement: switch to this stage
                                setShowConsolidated(false);
                                setSidebarOpen(false);
                                // Stage 4 sub-views are tabs — switch the tab where relevant
                                if (sub.anchor === "anchor-journey-mot") setJourneySubView("mot");
                                else if (sub.anchor === "anchor-journey-kpi") setJourneySubView("kpi");
                                else if (sub.anchor === "anchor-journey-maps") setJourneySubView("journey");
                              }}
                            >
                              <span className="vx-nav-mark">{!stageReachable ? "🔒" : outputReady ? "✓" : "●"}</span>
                              <span className="vx-nav-label">{sub.label}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Consolidated Framework — cross-persona strategy layer */}
            <div
              className={`vx-dashboard-nav consolidated ${showConsolidated ? "active" : ""}`}
              onClick={() => {
                if (!journeyData) return;
                setCurrent(8); setShowConsolidated(true); setSidebarOpen(false);
              }}
              style={{ opacity: journeyData ? 1 : 0.45, cursor: journeyData ? "pointer" : "not-allowed", marginTop: 8 }}
            >
              <span className="vx-dashboard-icon" style={{ background: "#0E7490" }}>◇</span>
              <span className="vx-dashboard-label">{journeyData ? "Consolidated Framework" : "Consolidated (locked)"}</span>
            </div>

            <div className="vx-nav-progress">
              <div className="vx-nav-progress-label">Journey Progress — {Math.round(overallProgress)}% Complete</div>
              <div className="vx-nav-progress-track"><div className="vx-nav-progress-fill" style={{ width: `${overallProgress}%` }} /></div>
              <button className="vx-nav-export" onClick={handleExportCompletePackage} disabled={!journeyData} title={journeyData ? "Export all outputs" : "Available once Stage 4 is generated"}>
                ⬇ Export All Outputs
              </button>
            </div>

            <div className="vx-sidebar-footer">
              <p>VX Journey™<br />Intelligence Platform<br />© 2026 All Rights Reserved</p>
            </div>
          </aside>

          {/* Main */}
          <main className="vx-main" ref={mainPanelRef}>
            <div className="vx-content">

              {/* Welcome — Executive Program Dashboard */}
              {current === 0 && (
                <div>
                  <div className="vx-welcome-eyebrow">◈ VX Journey Intelligence Engine</div>
                  <div className="ed-dash-title">Executive Program Dashboard</div>
                  <div className="ed-dash-sub">
                    A four-stage intelligence pipeline. Each stage consumes the outputs of the stage before it —
                    progressing from a structured requirement brief to a fully mapped, KPI-instrumented visitor journey.
                  </div>

                  <div className="ed-active-banner">
                    <div className="ed-active-left">
                      <span className="ed-active-label">Current Active Stage</span>
                      <span className="ed-active-name">Stage {stageStatus[activeStageIndex].id} · {stageStatus[activeStageIndex].name}</span>
                    </div>
                    <div className="ed-active-right">
                      <span className={`ed-status-pill ${stageStatus[activeStageIndex].status.replace(/\s/g,"")}`}>{stageStatus[activeStageIndex].status}</span>
                    </div>
                  </div>

                  <div className="ed-stage-grid">
                    {stageStatus.map((s, i) => (
                      <div key={s.id} className={`ed-stage-card ${s.status.replace(/\s/g,"")} ${i === activeStageIndex ? "active" : ""}`}>
                        <div className="ed-stage-top">
                          <span className="ed-stage-num">STAGE {s.id}</span>
                          <span className={`ed-status-dot ${s.status.replace(/\s/g,"")}`} />
                        </div>
                        <div className="ed-stage-icon">{s.icon}</div>
                        <div className="ed-stage-name">{s.name}</div>
                        <div className="ed-stage-objective">{s.objective}</div>
                        <div className="ed-progress-track"><div className="ed-progress-fill" style={{ width: `${s.pct}%` }} /></div>
                        <div className="ed-stage-foot">
                          <span className={`ed-status-text ${s.status.replace(/\s/g,"")}`}>{s.status}</span>
                          <span className="ed-pct">{s.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="vx-begin-btn" onClick={goNext}>
                    <span>{intakePct > 0 ? "Continue Program" : "Begin Stage 1"}</span>
                    <span className="vx-begin-arrow">→</span>
                  </button>

                  <div className="vx-welcome-rule" />
                  <div className="vx-welcome-meta">
                    <div className="vx-meta-item">
                      <span className="vx-meta-value">{stageStatus.filter(s => s.status === "Completed").length}/4</span>
                      <span className="vx-meta-label">Stages Complete</span>
                    </div>
                    <div className="vx-meta-item">
                      <span className="vx-meta-value">{fullPersonas?.personas?.length || 0}</span>
                      <span className="vx-meta-label">Personas Synthesised</span>
                    </div>
                    <div className="vx-meta-item">
                      <span className="vx-meta-value">{journeyData?.journeys?.reduce((s,j)=>s+(j.moments_of_truth?.length||0),0) || 0}</span>
                      <span className="vx-meta-label">Moments of Truth</span>
                    </div>
                  </div>
                </div>
              )}


              {/* Step 1 — Sector Selection */}
              {current === 1 && (
                <div>
                  <div className="vx-placeholder-eyebrow">
                    Step 2 of 8 · ◉ Sector Selection
                  </div>
                  <div className="vx-placeholder-title">Select Your Sector</div>
                  <div className="vx-placeholder-body" style={{ marginBottom: 24 }}>
                    Choose the primary sector your VX Journey will serve. This shapes the
                    intelligence architecture, benchmarks, and output templates across all
                    subsequent steps.
                  </div>

                  <div className="sector-grid">
                    {SECTORS.map((sector) => (
                      <div
                        key={sector.id}
                        className={`sector-card ${selectedSector?.id === sector.id ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedSector(sector);
                          setSelectedSubtype("");
                        }}
                      >
                        <div className="sector-card-header">
                          <span className="sector-card-icon">{sector.icon}</span>
                          <span className="sector-check">✓</span>
                        </div>
                        <div className="sector-card-title">{sector.label}</div>
                        <div className="sector-card-desc">{sector.description}</div>
                        <div className="sector-subtypes">
                          {sector.subtypes.map((st) => (
                            <span key={st} className="sector-subtype-tag">{st}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedSector && (
                    <div className="sector-dropdown-row">
                      <span className="sector-dropdown-label">
                        Sub-type for <strong>{selectedSector.label}</strong>
                      </span>
                      <select
                        className="sector-select"
                        value={selectedSubtype}
                        onChange={(e) => setSelectedSubtype(e.target.value)}
                      >
                        <option value="">— Select a sub-type —</option>
                        {selectedSector.subtypes.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      {selectedSubtype && (
                        <span className="sector-confirm-badge">✦ Confirmed</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2 — Experience Context */}
              {current === 2 && (
                <div>
                  <div className="vx-placeholder-eyebrow">Step 3 of 8 · ◎ Experience Context</div>
                  <div className="vx-placeholder-title">Experience Context</div>
                  <div className="vx-placeholder-body" style={{ marginBottom: 24 }}>
                    Define the nature, scale, and tone of your visitor experience. These parameters
                    calibrate benchmarks and journey design recommendations.
                  </div>

                  <div className="ec-form">
                    {/* Row 1 — Purpose + Footprint */}
                    <div className="ec-row">
                      <div className="ec-field">
                        <label className="ec-label">Primary Purpose</label>
                        <select
                          className="ec-select"
                          value={expPurpose}
                          onChange={(e) => setExpPurpose(e.target.value)}
                        >
                          <option value="">— Select —</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="education">Education</option>
                          <option value="commerce">Commerce</option>
                          <option value="brand-storytelling">Brand Storytelling</option>
                          <option value="community">Community</option>
                        </select>
                      </div>
                      <div className="ec-field">
                        <label className="ec-label">Physical Footprint</label>
                        <select
                          className="ec-select"
                          value={expFootprint}
                          onChange={(e) => setExpFootprint(e.target.value)}
                        >
                          <option value="">— Select —</option>
                          <option value="single-building">Single Building</option>
                          <option value="multi-zone-campus">Multi-Zone Campus</option>
                          <option value="outdoor">Outdoor</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>

                    <div className="ec-divider" />

                    {/* Row 3 — Visitor volume + Theme */}
                    <div className="ec-row">
                      <div className="ec-field">
                        <label className="ec-label">
                          Expected Daily Visitor Volume
                          <span>(per day)</span>
                        </label>
                        <input
                          type="number"
                          className="ec-input"
                          placeholder="e.g. 5000"
                          min="0"
                          value={expVisitorVolume}
                          onChange={(e) => setExpVisitorVolume(e.target.value)}
                        />
                      </div>
                      <div className="ec-field">
                        <label className="ec-label">
                          Primary Theme
                          <span>(freeform)</span>
                        </label>
                        <input
                          type="text"
                          className="ec-input"
                          placeholder="e.g. Ancient civilisations"
                          value={expTheme}
                          onChange={(e) => setExpTheme(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ec-divider" />

                    {/* Row 4 — Tone multi-select */}
                    <div className="ec-row full">
                      <div className="ec-field">
                        <label className="ec-label">
                          Tone of Experience
                          <span>(select all that apply)</span>
                        </label>
                        <div className="ec-tone-group">
                          {["reverential", "celebratory", "immersive", "educational", "provocative", "participatory"].map((tone) => (
                            <div
                              key={tone}
                              className={`ec-tone-chip ${expTones.includes(tone) ? "active" : ""}`}
                              onClick={() => toggleTone(tone)}
                            >
                              {expTones.includes(tone) ? "✦ " : ""}{tone}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Physical Features */}
              {current === 3 && (() => {
                const rows = PHYSICAL_FEATURES;
                const filled = rows.filter(f => physicalFeatures[f].present || physicalFeatures[f].quality || physicalFeatures[f].priority).length;
                const highPriority = rows.filter(f => physicalFeatures[f].priority === "High").length;
                const present = rows.filter(f => physicalFeatures[f].present === "Yes").length;

                const presentClass = (v) => v === "Yes" ? "val-yes" : v === "Partial" ? "val-partial" : v === "No" ? "val-no" : "";
                const qualityClass = (v) => v === "Excellent" ? "val-excellent" : v === "Adequate" ? "val-adequate" : v === "Needs Improvement" ? "val-needs" : v === "Not Present" ? "val-not-present" : "";
                const priorityClass = (v) => v === "High" ? "val-high" : v === "Med" ? "val-med" : v === "Low" ? "val-low" : "";

                return (
                  <div>
                    <div className="vx-placeholder-eyebrow">Step 4 of 8 · ▣ Physical Features</div>
                    <div className="vx-placeholder-title">Physical Features</div>
                    <div className="vx-placeholder-body" style={{ marginBottom: 20 }}>
                      Assess each physical feature of your venue. Mark its presence, quality level,
                      and strategic priority to shape journey design recommendations.
                    </div>

                    <div className="pf-table-wrap">
                      <table className="pf-table">
                        <thead>
                          <tr>
                            <th>Feature</th>
                            <th>Present</th>
                            <th>Quality Level</th>
                            <th>Strategic Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((feature) => {
                            const row = physicalFeatures[feature];
                            const isFilled = row.present || row.quality || row.priority;
                            return (
                              <tr key={feature} className={isFilled ? "pf-row-filled" : ""}>
                                <td className="pf-cell-name">{feature}</td>
                                <td className="pf-cell-select">
                                  <select
                                    className={`pf-select ${row.present ? "has-val" : ""} ${presentClass(row.present)}`}
                                    value={row.present}
                                    onChange={(e) => updateFeature(feature, "present", e.target.value)}
                                  >
                                    <option value="">—</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                    <option value="Partial">Partial</option>
                                  </select>
                                </td>
                                <td className="pf-cell-select">
                                  <select
                                    className={`pf-select ${row.quality ? "has-val" : ""} ${qualityClass(row.quality)}`}
                                    value={row.quality}
                                    onChange={(e) => updateFeature(feature, "quality", e.target.value)}
                                  >
                                    <option value="">—</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Adequate">Adequate</option>
                                    <option value="Needs Improvement">Needs Improvement</option>
                                    <option value="Not Present">Not Present</option>
                                  </select>
                                </td>
                                <td className="pf-cell-select">
                                  <select
                                    className={`pf-select ${row.priority ? "has-val" : ""} ${priorityClass(row.priority)}`}
                                    value={row.priority}
                                    onChange={(e) => updateFeature(feature, "priority", e.target.value)}
                                  >
                                    <option value="">—</option>
                                    <option value="High">High</option>
                                    <option value="Med">Med</option>
                                    <option value="Low">Low</option>
                                  </select>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="pf-summary-bar">
                      <div className="pf-summary-item">
                        <span className="pf-summary-value">{filled}</span>
                        <span className="pf-summary-label">Rows Assessed</span>
                      </div>
                      <div className="pf-summary-item">
                        <span className="pf-summary-value">{present}</span>
                        <span className="pf-summary-label">Present</span>
                      </div>
                      <div className="pf-summary-item">
                        <span className="pf-summary-value">{highPriority}</span>
                        <span className="pf-summary-label">High Priority</span>
                      </div>
                      <div className="pf-summary-item">
                        <span className="pf-summary-value">{13 - filled}</span>
                        <span className="pf-summary-label">Remaining</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Step 4 — Operational Controls */}
              {current === 4 && (() => {
                const entryTechOpts = ["Barcode", "RFID", "Biometric", "QR", "Facial Recognition"];
                const screeningOpts = ["Metal Detector", "X-ray", "Wand", "Visual"];

                // Structured ticketing model: type → sub-options
                const TICKETING_TYPES = [
                  { id: "General Admission",        sub: ["Walk-in", "Pre-booked", "Both"] },
                  { id: "Timed Entry",              sub: ["15 min", "30 min", "1 hour"], capacity: true },
                  { id: "Zoned Access",             sub: ["Single zone", "Multi-zone pass", "Guided route"] },
                  { id: "Dynamic / Hybrid (AI-controlled)", sub: ["Crowd-based auto allocation", "Demand pricing model", "Adaptive slot release"] },
                ];
                const PRICING_OPTS = ["Free entry", "Flat fee", "Tiered pricing (Adult / Child / Senior)", "Dynamic pricing (AI-driven)"];
                const MED_POLICY_OPTS = ["Permitted with declaration", "Permitted, no declaration needed", "Permitted for medical necessity only", "Prohibited (medical room dispensing)"];
                const MED_STORAGE_OPTS = ["Self-carry", "Cloakroom / locker storage", "First-aid / medical room", "Refrigerated storage available"];
                const HSE_RISK_OPTS = ["Low — open layout, low density", "Moderate — managed peaks", "High — dense crowds / pinch points", "Critical — mass-gathering protocols"];
                const HSE_EVAC_OPTS = ["Standard signage only", "Trained marshals on shift", "Drilled plan + marshals", "Full command-and-control centre"];
                const HSE_MEDICAL_OPTS = ["First-aid kit only", "Trained first-aiders on site", "On-site paramedic / nurse", "On-site medical centre"];

                const activeTicketType = TICKETING_TYPES.find(t => t.id === ocTicketingType);

                const ticketCount = (ocTicketingType ? 1 : 0) + (ocPricing ? 1 : 0);
                const sectionDefs = [
                  { label: "Ticketing & Access", count: ticketCount + ocEntryTech.length },
                  { label: "F&B", count: [ocOutsideFood, ocReEntry].filter(Boolean).length },
                  { label: "Medicines", count: [ocMedPolicy, ocMedStorage].filter(Boolean).length },
                  { label: "Mobile & Photography", count: [ocPhonesPermitted, ocRestrictedZones.trim()].filter(Boolean).length },
                  { label: "Security", count: ocScreeningTech.length },
                  { label: "HSE", count: [ocHseRisk, ocHseEvac, ocHseMedical].filter(Boolean).length },
                ];

                const Dropdown = ({ value, setter, opts, placeholder }) => (
                  <select className="oc-select" value={value} onChange={(e) => setter(e.target.value)}>
                    <option value="">{placeholder || "Select…"}</option>
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                );

                const YN = ({ value, setter }) => (
                  <div className="oc-yn-group">
                    {["Yes", "No"].map((opt) => (
                      <div
                        key={opt}
                        className={`oc-yn-btn ${value === opt ? (opt === "Yes" ? "active-yes" : "active-no") : ""}`}
                        onClick={() => setter(value === opt ? "" : opt)}
                      >
                        {opt === "Yes" ? "✓" : "✕"} {opt}
                      </div>
                    ))}
                  </div>
                );

                const CheckGroup = ({ opts, value, setter }) => (
                  <div className="oc-checkbox-group">
                    {opts.map((opt) => (
                      <div
                        key={opt}
                        className={`oc-checkbox ${value.includes(opt) ? "checked" : ""}`}
                        onClick={() => toggleCheckbox(setter)(opt)}
                      >
                        <span className="oc-check-box">{value.includes(opt) ? "✓" : ""}</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                );

                return (
                  <div>
                    <div className="vx-placeholder-eyebrow">Step 5 of 8 · ⬡ Operational Controls</div>
                    <div className="vx-placeholder-title">Operational Controls</div>
                    <div className="vx-placeholder-body" style={{ marginBottom: 20 }}>
                      Configure the operational rules and policies governing your venue experience.
                      Expand each section to fill in the relevant controls.
                    </div>

                    <div className="oc-sections">
                      {sectionDefs.map((sec, idx) => (
                        <div key={idx} className={`oc-section ${ocOpenSections[idx] ? "open" : ""}`}>
                          <div className="oc-header" onClick={() => toggleOcSection(idx)}>
                            <div className="oc-header-left">
                              <span className="oc-header-num">0{idx + 1}</span>
                              <span className="oc-header-title">{sec.label}</span>
                              {sec.count > 0 && (
                                <span className="oc-header-badge">{sec.count} set</span>
                              )}
                            </div>
                            <span className="oc-chevron">▾</span>
                          </div>

                          {ocOpenSections[idx] && (
                            <div className="oc-body">
                              {/* Section 0 — Ticketing & Access */}
                              {idx === 0 && (
                                <>
                                  <div className="oc-field">
                                    <span className="oc-field-label">Ticketing Type</span>
                                    <div className="oc-radio-cards">
                                      {TICKETING_TYPES.map((t) => (
                                        <div
                                          key={t.id}
                                          className={`oc-radio-card ${ocTicketingType === t.id ? "active" : ""}`}
                                          onClick={() => { setOcTicketingType(ocTicketingType === t.id ? "" : t.id); setOcTicketingSub(""); setOcTimedCapacity(""); }}
                                        >
                                          <span className="oc-radio-dot"><span className="oc-radio-dot-inner" /></span>
                                          {t.id}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  {activeTicketType && (
                                    <div className="oc-field oc-subfield">
                                      <span className="oc-field-label">{ocTicketingType} — Option</span>
                                      <div className="oc-checkbox-group">
                                        {activeTicketType.sub.map((s) => (
                                          <div
                                            key={s}
                                            className={`oc-checkbox ${ocTicketingSub === s ? "checked" : ""}`}
                                            onClick={() => setOcTicketingSub(ocTicketingSub === s ? "" : s)}
                                          >
                                            <span className="oc-check-box">{ocTicketingSub === s ? "✓" : ""}</span>
                                            {s}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {activeTicketType?.capacity && (
                                    <div className="oc-field oc-subfield">
                                      <span className="oc-field-label">Capacity per Slot</span>
                                      <input
                                        type="number"
                                        min="0"
                                        className="oc-number"
                                        placeholder="e.g. 50 visitors per slot"
                                        value={ocTimedCapacity}
                                        onChange={(e) => setOcTimedCapacity(e.target.value)}
                                      />
                                    </div>
                                  )}
                                  <div className="oc-field">
                                    <span className="oc-field-label">Pricing</span>
                                    <Dropdown value={ocPricing} setter={setOcPricing} opts={PRICING_OPTS} placeholder="Select a pricing model…" />
                                  </div>
                                  <div className="oc-field">
                                    <span className="oc-field-label">Entry Technology</span>
                                    <CheckGroup opts={entryTechOpts} value={ocEntryTech} setter={setOcEntryTech} />
                                  </div>
                                </>
                              )}
                              {/* Section 1 — F&B */}
                              {idx === 1 && (
                                <div className="oc-row2">
                                  <div className="oc-field">
                                    <span className="oc-field-label">Outside Food Permitted</span>
                                    <YN value={ocOutsideFood} setter={setOcOutsideFood} />
                                  </div>
                                  <div className="oc-field">
                                    <span className="oc-field-label">Re-entry Allowed</span>
                                    <YN value={ocReEntry} setter={setOcReEntry} />
                                  </div>
                                </div>
                              )}
                              {/* Section 2 — Medicines */}
                              {idx === 2 && (
                                <div className="oc-row2">
                                  <div className="oc-field">
                                    <span className="oc-field-label">Medication Policy</span>
                                    <Dropdown value={ocMedPolicy} setter={setOcMedPolicy} opts={MED_POLICY_OPTS} placeholder="Select a medication policy…" />
                                  </div>
                                  <div className="oc-field">
                                    <span className="oc-field-label">Medication Storage</span>
                                    <Dropdown value={ocMedStorage} setter={setOcMedStorage} opts={MED_STORAGE_OPTS} placeholder="Select a storage approach…" />
                                  </div>
                                </div>
                              )}
                              {/* Section 3 — Mobile & Photography */}
                              {idx === 3 && (
                                <div className="oc-row2">
                                  <div className="oc-field">
                                    <span className="oc-field-label">Phones Permitted</span>
                                    <YN value={ocPhonesPermitted} setter={setOcPhonesPermitted} />
                                  </div>
                                  <div className="oc-field">
                                    <span className="oc-field-label">Restricted Zones</span>
                                    <textarea
                                      className="oc-textarea"
                                      style={{ minHeight: 52 }}
                                      placeholder="List areas where photography is restricted…"
                                      value={ocRestrictedZones}
                                      onChange={(e) => setOcRestrictedZones(e.target.value)}
                                    />
                                  </div>
                                </div>
                              )}
                              {/* Section 4 — Security */}
                              {idx === 4 && (
                                <div className="oc-field">
                                  <span className="oc-field-label">Screening Technology</span>
                                  <CheckGroup opts={screeningOpts} value={ocScreeningTech} setter={setOcScreeningTech} />
                                </div>
                              )}
                              {/* Section 5 — HSE */}
                              {idx === 5 && (
                                <>
                                  <div className="oc-row2">
                                    <div className="oc-field">
                                      <span className="oc-field-label">Crowd Risk Level</span>
                                      <Dropdown value={ocHseRisk} setter={setOcHseRisk} opts={HSE_RISK_OPTS} placeholder="Select crowd risk level…" />
                                    </div>
                                    <div className="oc-field">
                                      <span className="oc-field-label">Evacuation Readiness</span>
                                      <Dropdown value={ocHseEvac} setter={setOcHseEvac} opts={HSE_EVAC_OPTS} placeholder="Select evacuation readiness…" />
                                    </div>
                                  </div>
                                  <div className="oc-field">
                                    <span className="oc-field-label">Medical Provision</span>
                                    <Dropdown value={ocHseMedical} setter={setOcHseMedical} opts={HSE_MEDICAL_OPTS} placeholder="Select medical provision…" />
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Step 5 — Stakeholders */}
              {current === 5 && (() => {
                const tiers = [
                  { id: "VVIP",        label: "VVIP",                   color: "#B8860B", badge: "Tier 0",  def: "Heads of state, royalty, top-tier dignitaries — bespoke protocol, private routing, dedicated liaison." },
                  { id: "VIP",         label: "VIP",                    color: "#7A5CC0", badge: "Premium", def: "Distinguished guests, sponsors, celebrities, premium ticket holders — expedited access and hosted experience." },
                  { id: "B2C",         label: "B2C — Regular Visitor",  color: "#2E8B57", badge: "Public",  def: "General paying public — individuals, families, tourists visiting on standard admission." },
                  { id: "B2B",         label: "B2B",                    color: "#2074C4", badge: "Partner", def: "Corporate clients, travel trade, group bookings, partner organisations and resellers." },
                  { id: "B2E",         label: "B2E",                    color: "#0E8A8A", badge: "Internal",def: "Employees and internal staff attending as visitors — staff days, training, internal events." },
                  { id: "Media",       label: "Media",                  color: "#C2700E", badge: "Press",   def: "Journalists, press, photographers, content creators and influencers covering the venue." },
                  { id: "Authorities", label: "Government Authorities", color: "#B0521E", badge: "Gov",     def: "Regulators, ministry officials, inspectors and visiting government delegations." },
                  { id: "Security",    label: "Security / HSE",         color: "#B23B3B", badge: "Safety",  def: "On-site security, health-safety-environment and emergency-response personnel." },
                  { id: "POD",         label: "POD",                    color: "#0E7A8A", badge: "Access",  def: "Persons of Determination — visitors with accessibility needs requiring tailored support." },
                ];

                return (
                  <div>
                    <div className="vx-placeholder-eyebrow">Step 6 of 8 · ◍ Stakeholder Profiling</div>
                    <div className="vx-placeholder-title">Stakeholder Profiling</div>
                    <div className="vx-placeholder-body" style={{ marginBottom: 22 }}>
                      Select all stakeholder tiers present in your venue, then define the audience
                      profile characteristics that shape journey personalisation.
                    </div>

                    <div className="sh-layout">
                      {/* Left — tier checklist */}
                      <div className="sh-panel">
                        <div className="sh-panel-header">
                          <span className="sh-panel-title">Stakeholder Tiers</span>
                          {shTiers.length > 0 && (
                            <span className="sh-panel-count">{shTiers.length} selected</span>
                          )}
                        </div>
                        <div className="sh-tier-list">
                          {tiers.map((t) => {
                            const isChecked = shTiers.includes(t.id);
                            return (
                              <div
                                key={t.id}
                                className={`sh-tier-row ${isChecked ? "checked" : ""}`}
                                onClick={() => toggleCheckbox(setShTiers)(t.id)}
                              >
                                <span className={`sh-tier-checkbox`}>{isChecked ? "✓" : ""}</span>
                                <span
                                  className="sh-tier-dot"
                                  style={{ background: isChecked ? t.color : "#C8CDD6" }}
                                />
                                <div className="sh-tier-text">
                                  <div className="sh-tier-label-row">
                                    <span className="sh-tier-label">{t.label}</span>
                                    <span
                                      className="sh-tier-badge"
                                      style={{
                                        background: isChecked ? t.color + "1A" : "transparent",
                                        color: isChecked ? t.color : "#9AA3B2",
                                        border: `1px solid ${isChecked ? t.color + "44" : "#D5D9E0"}`,
                                      }}
                                    >
                                      {t.badge}
                                    </span>
                                  </div>
                                  <span className="sh-tier-def">{t.def}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right — profile fields */}
                      <div className="sh-fields-panel">
                        <div className="sh-fields-header">
                          <span className="sh-fields-title">Audience Profile</span>
                        </div>
                        <div className="sh-fields-body">
                          <div className="sh-field">
                            <label className="sh-field-label">Primary Nationalities</label>
                            <p className="sh-field-hint">Select the visitor nationalities most relevant to your venue (grouped by region).</p>
                            <div className="sh-nat-grid">
                              {[
                                "United States","United Kingdom","Canada","Germany","France","Italy","Spain","Netherlands",
                                "UAE","Saudi Arabia","Qatar","Egypt","Türkiye",
                                "India","China","Japan","South Korea","Singapore","Indonesia","Philippines",
                                "Australia","New Zealand",
                                "Brazil","Mexico","South Africa","Nigeria","Kenya","Russia",
                              ].map((nat) => {
                                const list = shNationalities ? shNationalities.split(", ").filter(Boolean) : [];
                                const on = list.includes(nat);
                                return (
                                  <div
                                    key={nat}
                                    className={`sh-nat-chip ${on ? "on" : ""}`}
                                    onClick={() => {
                                      const next = on ? list.filter(n => n !== nat) : [...list, nat];
                                      setShNationalities(next.join(", "));
                                    }}
                                  >
                                    {on ? "✓ " : ""}{nat}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="sh-field">
                            <label className="sh-field-label">Religious Considerations</label>
                            <textarea
                              className="sh-textarea"
                              placeholder="e.g. Prayer facilities required, halal F&B, Ramadan scheduling…"
                              value={shReligious}
                              onChange={(e) => setShReligious(e.target.value)}
                            />
                          </div>
                          <div className="sh-lang-row">
                            <div className="sh-field">
                              <label className="sh-field-label">Primary Language</label>
                              <input
                                type="text"
                                className="sh-input"
                                placeholder="e.g. Arabic"
                                value={shPrimaryLang}
                                onChange={(e) => setShPrimaryLang(e.target.value)}
                              />
                            </div>
                            <div className="sh-field">
                              <label className="sh-field-label">Secondary Language</label>
                              <input
                                type="text"
                                className="sh-input"
                                placeholder="e.g. English"
                                value={shSecondaryLang}
                                onChange={(e) => setShSecondaryLang(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Step 6 — Priorities & Template */}
              {current === 6 && (() => {
                const priClass = (v) => v === "High" ? "val-high" : v === "Med" ? "val-med" : v === "Low" ? "val-low" : "";
                const motFilled = Object.values(motivations).filter(Boolean).length;
                const outFilled = Object.values(outcomes).filter((o) => o.rank || o.priority).length;

                return (
                  <div>
                    <div className="vx-placeholder-eyebrow">Step 7 of 8 · ◆ Priorities & Template</div>
                    <div className="vx-placeholder-title">Priorities & Template</div>
                    <div className="vx-placeholder-body" style={{ marginBottom: 20 }}>
                      Rank visitor motivations and define strategic outcome priorities to calibrate
                      the intelligence engine's recommendations and output template.
                    </div>

                    <div className="pt-tables-outer">
                    <div className="pt-tables-wrap">
                      {/* Table 1 — Motivations */}
                      <div className="pt-table-block">
                        <div className="pt-table-header">
                          <span className="pt-table-title">Visitor Motivations</span>
                          {motFilled > 0 && <span className="pt-filled-badge">{motFilled} / {MOTIVATIONS.length}</span>}
                        </div>
                        <table className="pt-table">
                          <thead>
                            <tr>
                              <th>Motivation</th>
                              <th>Priority</th>
                            </tr>
                          </thead>
                          <tbody>
                            {MOTIVATIONS.map((m) => {
                              const val = motivations[m];
                              return (
                                <tr key={m} className={val ? "pt-row-set" : ""}>
                                  <td className="pt-cell-name">{m}</td>
                                  <td className="pt-cell-input">
                                    <select
                                      className={`pt-select ${val ? "has-val" : ""} ${priClass(val)}`}
                                      value={val}
                                      onChange={(e) => updateMotivation(m, e.target.value)}
                                    >
                                      <option value="">—</option>
                                      <option value="High">High</option>
                                      <option value="Med">Med</option>
                                      <option value="Low">Low</option>
                                    </select>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Table 2 — Priority Outcomes */}
                      <div className="pt-table-block">
                        <div className="pt-table-header">
                          <span className="pt-table-title">Priority Outcomes</span>
                          {outFilled > 0 && <span className="pt-filled-badge">{outFilled} / {OUTCOMES.length}</span>}
                        </div>
                        <table className="pt-table">
                          <thead>
                            <tr>
                              <th>Outcome</th>
                              <th style={{ width: 48 }}>Rank</th>
                              <th>Priority</th>
                            </tr>
                          </thead>
                          <tbody>
                            {OUTCOMES.map((o) => {
                              const row = outcomes[o];
                              const isSet = row.rank || row.priority;
                              return (
                                <tr key={o} className={isSet ? "pt-row-set" : ""}>
                                  <td className="pt-cell-name">{o}</td>
                                  <td className="pt-cell-input">
                                    <input
                                      type="number"
                                      min="1" max="10"
                                      className="pt-rank-input"
                                      placeholder="—"
                                      value={row.rank}
                                      onChange={(e) => updateOutcome(o, "rank", e.target.value)}
                                    />
                                  </td>
                                  <td className="pt-cell-input">
                                    <select
                                      className={`pt-select ${row.priority ? "has-val" : ""} ${priClass(row.priority)}`}
                                      value={row.priority}
                                      onChange={(e) => updateOutcome(o, "priority", e.target.value)}
                                    >
                                      <option value="">—</option>
                                      <option value="High">High</option>
                                      <option value="Med">Med</option>
                                      <option value="Low">Low</option>
                                    </select>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    </div>
                  </div>
                );
              })()}

              {/* Step 7 — Template Selection */}
              {current === 7 && (() => {
                const TEMPLATES = [
                  {
                    id: "double-diamond",
                    name: "Double Diamond Experience Map",
                    origin: "UK Design Council · 2005",
                    simple: "Explore widely, then narrow down — twice. First to find the right problem, then the right solution. Great when you're starting fresh and want a clear, structured path.",
                    strength: "Divergent-convergent problem framing with clear phase transitions",
                    bestFit: "New attraction concepts, full venue redesigns, or greenfield journey builds",
                    accentColor: "#C8F04A",
                  },
                  {
                    id: "service-blueprint",
                    name: "Service Blueprint Model",
                    origin: "G. Lynn Shostack · 1984",
                    simple: "Shows what the visitor sees alongside everything happening behind the scenes to make it work. Best when lots of teams and systems need to line up smoothly.",
                    strength: "Maps frontstage, backstage and support processes in parallel lanes",
                    bestFit: "Venues with complex operational back-of-house dependencies or multi-team delivery",
                    accentColor: "#60B8D8",
                  },
                  {
                    id: "jtbd",
                    name: "Jobs-to-Be-Done",
                    origin: "Clayton Christensen · 1990s",
                    simple: "Focuses on what the visitor is really trying to achieve — the \u2018job\u2019 they came to get done. Ideal when you want to design around genuine visitor needs and motivations.",
                    strength: "Reframes visitor intent as functional, emotional and social 'jobs'",
                    bestFit: "Audience research-led projects and experience innovation sprints",
                    accentColor: "#D0A050",
                  },
                  {
                    id: "emotional-curve",
                    name: "Emotional Experience Curve",
                    origin: "Nielsen Norman Group",
                    simple: "Tracks how the visitor feels — moment by moment — from excited to frustrated to delighted. Perfect for experiences where emotion is the whole point.",
                    strength: "Tracks emotional highs and lows across a chronological journey arc",
                    bestFit: "Entertainment, cultural and heritage venues prioritising emotional resonance",
                    accentColor: "#C070B8",
                  },
                  {
                    id: "stakeholder-ecosystem",
                    name: "Stakeholder Ecosystem Map",
                    origin: "Systems Thinking · adapted",
                    simple: "Maps everyone involved and how they connect, influence and depend on each other. Useful for VIP protocols, government venues and complex multi-party events.",
                    strength: "Visualises relationships, dependencies and power dynamics across all tiers",
                    bestFit: "Multi-stakeholder events, VIP protocols and government or civic venues",
                    accentColor: "#70C888",
                  },
                  {
                    id: "lean-cx",
                    name: "Lean CX Sprint Map",
                    origin: "Lean UX / Google Ventures",
                    simple: "Quick test-and-improve loops to fix specific pain points fast. Best for targeted upgrades like queueing, wayfinding or F&B rather than a full rebuild.",
                    strength: "Rapid hypothesis-test-iterate cycles for CX improvement",
                    bestFit: "Operational improvement projects, F&B or wayfinding optimisation sprints",
                    accentColor: "#E07870",
                  },
                ];

                return (
                  <div>
                    <div className="vx-placeholder-eyebrow">Step 8 of 9 · ✦ Template Selection</div>
                    <div className="vx-placeholder-title">Template Selection</div>
                    <div className="vx-placeholder-body" style={{ marginBottom: 16 }}>
                      Choose a primary framework to structure your VX Journey output. Optionally
                      select a secondary template to complement your primary approach.
                    </div>

                    {/* Selection status bar */}
                    <div className="ts-selection-bar">
                      <div className={`ts-selection-pill ${primaryTemplate ? "filled-primary" : ""}`}>
                        <span className="ts-pill-dot" />
                        <span className="ts-pill-label">Primary Template</span>
                        <span className="ts-pill-value">
                          {primaryTemplate
                            ? TEMPLATES.find(t => t.id === primaryTemplate)?.name
                            : "None selected"}
                        </span>
                      </div>
                      <div className={`ts-selection-pill ${secondaryTemplate ? "filled-secondary" : ""}`}>
                        <span className="ts-pill-dot" />
                        <span className="ts-pill-label">Secondary Template</span>
                        <span className="ts-pill-value">
                          {secondaryTemplate
                            ? TEMPLATES.find(t => t.id === secondaryTemplate)?.name
                            : "Optional"}
                        </span>
                      </div>
                    </div>

                    {/* Template cards */}
                    <div className="ts-grid">
                      {TEMPLATES.map((t, i) => {
                        const isPrimary = primaryTemplate === t.id;
                        const isSecondary = secondaryTemplate === t.id;

                        const handlePrimary = () => {
                          if (isPrimary) {
                            setPrimaryTemplate(null);
                          } else {
                            setPrimaryTemplate(t.id);
                            if (secondaryTemplate === t.id) setSecondaryTemplate(null);
                          }
                        };
                        const handleSecondary = () => {
                          if (isSecondary) {
                            setSecondaryTemplate(null);
                          } else {
                            setSecondaryTemplate(t.id);
                            if (primaryTemplate === t.id) setPrimaryTemplate(null);
                          }
                        };

                        return (
                          <div
                            key={t.id}
                            className={`ts-card ${isPrimary ? "primary" : ""} ${isSecondary ? "secondary" : ""}`}
                          >
                            <div className="ts-card-top">
                              <span className="ts-card-num">0{i + 1}</span>
                              <div className="ts-badge-wrap">
                                {isPrimary && <span className="ts-badge ts-badge-primary">Primary</span>}
                                {isSecondary && <span className="ts-badge ts-badge-secondary">Secondary</span>}
                              </div>
                            </div>
                            <div className="ts-card-name">{t.name}</div>
                            <div className="ts-card-origin">{t.origin}</div>
                            <div className="ts-card-simple">{t.simple}</div>
                            <div className="ts-divider" />
                            <div className="ts-meta-row">
                              <div className="ts-meta-item">
                                <span className="ts-meta-label">Primary Strength</span>
                                <span className="ts-meta-value">{t.strength}</span>
                              </div>
                              <div className="ts-meta-item">
                                <span className="ts-meta-label">Best-Fit Context</span>
                                <span className="ts-meta-value">{t.bestFit}</span>
                              </div>
                            </div>
                            <div className="ts-card-footer">
                              <button
                                className={`ts-action-btn ${isPrimary ? "active-primary" : ""}`}
                                onClick={handlePrimary}
                              >
                                {isPrimary ? "✦ Primary" : "Set Primary"}
                              </button>
                              <button
                                className={`ts-action-btn ${isSecondary ? "active-secondary" : ""}`}
                                onClick={handleSecondary}
                              >
                                {isSecondary ? "◈ Secondary" : "Set Secondary"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Step 8 — Review */}
              {current === 8 && (() => {
                const TEMPLATES_MAP = {
                  "double-diamond": "Double Diamond Experience Map",
                  "service-blueprint": "Service Blueprint Model",
                  "jtbd": "Jobs-to-Be-Done",
                  "emotional-curve": "Emotional Experience Curve",
                  "stakeholder-ecosystem": "Stakeholder Ecosystem Map",
                  "lean-cx": "Lean CX Sprint Map",
                };
                const priColor = (v) => v === "High" ? "#C87070" : v === "Med" ? "#C8B840" : v === "Low" ? "#70B880" : "#4A5A70";

                const sections = [
                  {
                    title: "Sector Selection",
                    filled: !!(selectedSector),
                    content: (
                      <div className="rv-grid">
                        <div className="rv-kv"><span className="rv-key">Sector</span><span className={`rv-val ${selectedSector ? "accent" : "muted"}`}>{selectedSector?.label || "Not selected"}</span></div>
                        <div className="rv-kv"><span className="rv-key">Sub-type</span><span className={`rv-val ${selectedSubtype ? "" : "muted"}`}>{selectedSubtype || "Not selected"}</span></div>
                      </div>
                    ),
                  },
                  {
                    title: "Experience Context",
                    filled: !!(expPurpose || expVisitorVolume),
                    content: (
                      <div>
                        <div className="rv-grid" style={{ marginBottom: 10 }}>
                          <div className="rv-kv"><span className="rv-key">Purpose</span><span className={`rv-val ${expPurpose ? "" : "muted"}`}>{expPurpose || "—"}</span></div>
                          <div className="rv-kv"><span className="rv-key">Purpose</span><span className={`rv-val ${expPurpose ? "" : "muted"}`}>{expPurpose || "—"}</span></div>
                          <div className="rv-kv"><span className="rv-key">Daily Visitors</span><span className={`rv-val ${expVisitorVolume ? "" : "muted"}`}>{expVisitorVolume || "—"}</span></div>
                          <div className="rv-kv"><span className="rv-key">Footprint</span><span className={`rv-val ${expFootprint ? "" : "muted"}`}>{expFootprint || "—"}</span></div>
                          <div className="rv-kv"><span className="rv-key">Theme</span><span className={`rv-val ${expTheme ? "" : "muted"}`}>{expTheme || "—"}</span></div>
                        </div>
                        {expTones.length > 0 && (
                          <div className="rv-kv"><span className="rv-key">Tones</span><div className="rv-chips">{expTones.map(t => <span key={t} className="rv-chip lime">{t}</span>)}</div></div>
                        )}
                      </div>
                    ),
                  },
                  {
                    title: "Physical Features",
                    filled: Object.values(physicalFeatures).some(r => r.present),
                    content: (
                      <table className="rv-table">
                        <tbody>
                          {PHYSICAL_FEATURES.filter(f => physicalFeatures[f].present || physicalFeatures[f].quality || physicalFeatures[f].priority).map(f => {
                            const r = physicalFeatures[f];
                            return (
                              <tr key={f}>
                                <td>{f}</td>
                                <td><span className="rv-tbl-badge" style={{ color: r.present === "Yes" ? "#7AC880" : r.present === "Partial" ? "#C8A840" : "#C87070", border: `1px solid currentColor`, background: "transparent" }}>{r.present}</span></td>
                                <td style={{ color: "#6A7A8A" }}>{r.quality || "—"}</td>
                                <td><span style={{ color: priColor(r.priority) }}>{r.priority || "—"}</span></td>
                              </tr>
                            );
                          })}
                          {!PHYSICAL_FEATURES.some(f => physicalFeatures[f].present) && <tr><td colSpan={4} style={{ color: "#3A4A60", fontStyle: "italic" }}>No features assessed</td></tr>}
                        </tbody>
                      </table>
                    ),
                  },
                  {
                    title: "Operational Controls",
                    filled: !!(ocTicketingType || ocEntryTech.length || ocOutsideFood || ocReEntry || ocMedPolicy || ocScreeningTech.length || ocHseRisk),
                    content: (
                      <div className="rv-grid">
                        <div className="rv-kv"><span className="rv-key">Ticketing Type</span><span className={`rv-val ${ocTicketingType ? "" : "muted"}`}>{ocTicketingType || "—"}{ocTicketingSub ? ` · ${ocTicketingSub}` : ""}{ocTimedCapacity ? ` · ${ocTimedCapacity}/slot` : ""}</span></div>
                        <div className="rv-kv"><span className="rv-key">Pricing</span><span className={`rv-val ${ocPricing ? "" : "muted"}`}>{ocPricing || "—"}</span></div>
                        <div className="rv-kv"><span className="rv-key">Entry Tech</span><div className="rv-chips">{ocEntryTech.length ? ocEntryTech.map(t => <span key={t} className="rv-chip">{t}</span>) : <span className="rv-val muted">—</span>}</div></div>
                        <div className="rv-kv"><span className="rv-key">Screening Tech</span><div className="rv-chips">{ocScreeningTech.length ? ocScreeningTech.map(t => <span key={t} className="rv-chip">{t}</span>) : <span className="rv-val muted">—</span>}</div></div>
                        <div className="rv-kv"><span className="rv-key">Outside Food</span><span className={`rv-val ${ocOutsideFood ? "" : "muted"}`}>{ocOutsideFood || "—"}</span></div>
                        <div className="rv-kv"><span className="rv-key">Re-entry</span><span className={`rv-val ${ocReEntry ? "" : "muted"}`}>{ocReEntry || "—"}</span></div>
                        <div className="rv-kv"><span className="rv-key">Phones Permitted</span><span className={`rv-val ${ocPhonesPermitted ? "" : "muted"}`}>{ocPhonesPermitted || "—"}</span></div>
                        <div className="rv-kv"><span className="rv-key">Medication Policy</span><span className={`rv-val ${ocMedPolicy ? "" : "muted"}`}>{ocMedPolicy || "—"}</span></div>
                        <div className="rv-kv"><span className="rv-key">Medication Storage</span><span className={`rv-val ${ocMedStorage ? "" : "muted"}`}>{ocMedStorage || "—"}</span></div>
                        <div className="rv-kv"><span className="rv-key">HSE — Crowd Risk</span><span className={`rv-val ${ocHseRisk ? "" : "muted"}`}>{ocHseRisk || "—"}</span></div>
                        <div className="rv-kv"><span className="rv-key">HSE — Evacuation</span><span className={`rv-val ${ocHseEvac ? "" : "muted"}`}>{ocHseEvac || "—"}</span></div>
                        <div className="rv-kv"><span className="rv-key">HSE — Medical</span><span className={`rv-val ${ocHseMedical ? "" : "muted"}`}>{ocHseMedical || "—"}</span></div>
                      </div>
                    ),
                  },
                  {
                    title: "Stakeholder Profiling",
                    filled: !!(shTiers.length || shNationalities || shPrimaryLang),
                    content: (
                      <div>
                        {shTiers.length > 0 && (
                          <div className="rv-kv" style={{ marginBottom: 10 }}><span className="rv-key">Active Tiers</span><div className="rv-chips">{shTiers.map(t => <span key={t} className="rv-chip lime">{t}</span>)}</div></div>
                        )}
                        <div className="rv-grid">
                          <div className="rv-kv"><span className="rv-key">Primary Nationalities</span><span className={`rv-val ${shNationalities ? "" : "muted"}`}>{shNationalities || "—"}</span></div>
                          <div className="rv-kv"><span className="rv-key">Languages</span><span className={`rv-val ${shPrimaryLang ? "" : "muted"}`}>{[shPrimaryLang, shSecondaryLang].filter(Boolean).join(" / ") || "—"}</span></div>
                          {shReligious && <div className="rv-kv" style={{ gridColumn: "span 2" }}><span className="rv-key">Religious Considerations</span><span className="rv-val">{shReligious}</span></div>}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Priorities",
                    filled: Object.values(motivations).some(Boolean) || Object.values(outcomes).some(o => o.rank || o.priority),
                    content: (
                      <div className="rv-grid">
                        <div className="rv-kv">
                          <span className="rv-key">Top Motivations</span>
                          <div className="rv-chips">
                            {Object.entries(motivations).filter(([,v]) => v === "High").map(([k]) => <span key={k} className="rv-chip" style={{ borderColor: "#5A2A2A", color: "#C87070" }}>{k}</span>)}
                            {!Object.values(motivations).some(v => v === "High") && <span className="rv-val muted">None set to High</span>}
                          </div>
                        </div>
                        <div className="rv-kv">
                          <span className="rv-key">Top Outcomes</span>
                          <div className="rv-chips">
                            {Object.entries(outcomes).filter(([,v]) => v.priority === "High").map(([k]) => <span key={k} className="rv-chip" style={{ borderColor: "#5A2A2A", color: "#C87070" }}>{k}</span>)}
                            {!Object.values(outcomes).some(v => v.priority === "High") && <span className="rv-val muted">None set to High</span>}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Template Selection",
                    filled: !!(primaryTemplate),
                    content: (
                      <div className="rv-grid">
                        <div className="rv-kv"><span className="rv-key">Primary Template</span><span className={`rv-val ${primaryTemplate ? "accent" : "muted"}`}>{primaryTemplate ? TEMPLATES_MAP[primaryTemplate] : "Not selected"}</span></div>
                        <div className="rv-kv"><span className="rv-key">Secondary Template</span><span className={`rv-val ${secondaryTemplate ? "" : "muted"}`}>{secondaryTemplate ? TEMPLATES_MAP[secondaryTemplate] : "None"}</span></div>
                      </div>
                    ),
                  },
                ];

                return (
                  <div>
                    {!showConsolidated && unlockedStage === 1 && (<>
                    {!briefData && (<>
                    <div className="vx-placeholder-eyebrow">Step 9 of 9 · ◇ Review</div>
                    <div className="vx-placeholder-title">Review & Generate</div>
                    <div className="vx-placeholder-body" style={{ marginBottom: 22 }}>
                      Review your full configuration below. When ready, generate your
                      AI-powered Experience Design Brief.
                    </div>

                    <div className="rv-sections">
                      {sections.map((sec, idx) => (
                        <div key={idx} className={`rv-section ${reviewOpenSections[idx] ? "open" : ""}`}>
                          <div className="rv-section-header" onClick={() => toggleReviewSection(idx)}>
                            <div className="rv-section-left">
                              <span className="rv-section-num">0{idx + 1}</span>
                              <span className="rv-section-title">{sec.title}</span>
                              <span className={sec.filled ? "rv-complete-badge" : "rv-empty-badge"}>
                                {sec.filled ? "✓ Complete" : "Incomplete"}
                              </span>
                            </div>
                            <span className="rv-chevron">▾</span>
                          </div>
                          {reviewOpenSections[idx] && (
                            <div className="rv-body">{sec.content}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    </>)}

                    {briefData && (
                      <>
                        <div className="vx-placeholder-eyebrow">Stage 1 of 4 · ◇ Output</div>
                        <div className="vx-placeholder-title">Experience Design Brief</div>
                      </>
                    )}

                    <div className="rv-generate-wrap">
                      {!briefData && (
                      <button
                        className="rv-generate-btn"
                        onClick={handleGenerateBrief}
                        disabled={aiLoading}
                      >
                        {aiLoading
                          ? <><span className="rv-spinner" /> Generating Brief…</>
                          : <>✦ Generate Experience Design Brief with AI</>
                        }
                      </button>
                      )}
                      {aiError && <div className="rv-error">⚠ {aiError}</div>}

                      {briefData && (() => {
                        const SECTION_META = {
                          sector_context:        { label: "Sector Context",          num: "01" },
                          thematic_architecture: { label: "Thematic Architecture",   num: "02" },
                          physical_inventory:    { label: "Physical Inventory",       num: "03" },
                          operational_controls:  { label: "Operational Controls",     num: "04" },
                          stakeholder_map:       { label: "Stakeholder Map",          num: "05" },
                          motivational_landscape:{ label: "Motivational Landscape",   num: "06" },
                          priority_heat_map:     { label: "Priority Heat Map",        num: "07" },
                          selected_template:     { label: "Selected Template",        num: "08" },
                          known_friction_zones:  { label: "Known Friction Zones",     num: "09" },
                          success_criteria:      { label: "Success Criteria",         num: "10" },
                          gap_annotations:       { label: "Gap Annotations",          num: "11" },
                        };

                        const Chip = ({ val }) => {
                          const cls = val === "High" ? "high" : val === "Med" ? "med" : val === "Low" ? "low" : "";
                          return <span className={`bo-chip ${cls}`}>{val}</span>;
                        };

                        const renderSection = (key, val) => {
                          if (!val) return null;
                          const str = (v) => (v && typeof v === "string") ? v : null;
                          const arr = (v) => Array.isArray(v) ? v : [];

                          if (key === "sector_context") return (
                            <div className="bo-kv-grid">
                              <div className="bo-kv"><span className="bo-k">Sector</span><span className="bo-v accent">{str(val.sector) || "—"}</span></div>
                              <div className="bo-kv"><span className="bo-k">Sub-type</span><span className="bo-v">{str(val.sub_type) || "—"}</span></div>
                              {str(val.summary) && <div className="bo-kv" style={{gridColumn:"span 2"}}><span className="bo-k">Summary</span><span className="bo-v">{val.summary}</span></div>}
                            </div>
                          );

                          if (key === "thematic_architecture") return (
                            <div style={{display:"flex",flexDirection:"column",gap:10}}>
                              <div className="bo-kv-grid">
                                <div className="bo-kv"><span className="bo-k">Theme</span><span className="bo-v accent">{str(val.primary_theme) || "—"}</span></div>
                                <div className="bo-kv"><span className="bo-k">Purpose</span><span className="bo-v">{str(val.purpose) || "—"}</span></div>
                                <div className="bo-kv"><span className="bo-k">Daily Volume</span><span className="bo-v">{str(val.daily_volume) || "—"}</span></div>
                                <div className="bo-kv"><span className="bo-k">Footprint</span><span className="bo-v">{str(val.footprint) || "—"}</span></div>
                              </div>
                              {arr(val.experience_tones).length > 0 && <div className="bo-kv"><span className="bo-k">Tones</span><div className="bo-chips">{arr(val.experience_tones).map((t,i) => <span key={i} className="bo-chip">{t}</span>)}</div></div>}
                              {str(val.narrative_direction) && <div className="bo-kv"><span className="bo-k">Narrative Direction</span><span className="bo-v">{val.narrative_direction}</span></div>}
                            </div>
                          );

                          if (key === "physical_inventory") return (
                            <div style={{display:"flex",flexDirection:"column",gap:12}}>
                              {arr(val.assessed_features).length > 0 && (
                                <table className="bo-table">
                                  <thead><tr><th>Feature</th><th>Present</th><th>Quality</th><th>Priority</th></tr></thead>
                                  <tbody>{arr(val.assessed_features).map((f,i) => (
                                    <tr key={i}><td>{f.name}</td><td>{f.present}</td><td>{f.quality}</td><td><Chip val={f.priority} /></td></tr>
                                  ))}</tbody>
                                </table>
                              )}
                              {arr(val.gaps).length > 0 && <div className="bo-kv"><span className="bo-k">Gaps</span><div className="bo-chips">{arr(val.gaps).map((g,i) => <span key={i} className="bo-chip high">{g}</span>)}</div></div>}
                              {arr(val.recommendations).length > 0 && <div className="bo-kv"><span className="bo-k">Recommendations</span><div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}>{arr(val.recommendations).map((r,i) => <span key={i} className="bo-card-body">◦ {r}</span>)}</div></div>}
                            </div>
                          );

                          if (key === "operational_controls") return (
                            <div className="bo-kv-grid">
                              <div className="bo-kv"><span className="bo-k">Ticketing</span><div className="bo-chips">{arr(val.ticketing_models).map((t,i)=><span key={i} className="bo-chip">{t}</span>)}</div></div>
                              <div className="bo-kv"><span className="bo-k">Entry Tech</span><div className="bo-chips">{arr(val.entry_technologies).map((t,i)=><span key={i} className="bo-chip">{t}</span>)}</div></div>
                              <div className="bo-kv"><span className="bo-k">Outside Food</span><span className="bo-v">{val.fb_policy?.outside_food || "—"}</span></div>
                              <div className="bo-kv"><span className="bo-k">Re-entry</span><span className="bo-v">{val.fb_policy?.re_entry || "—"}</span></div>
                              <div className="bo-kv"><span className="bo-k">Phones</span><span className="bo-v">{val.mobile_policy?.phones_permitted || "—"}</span></div>
                              <div className="bo-kv"><span className="bo-k">Screening</span><div className="bo-chips">{arr(val.security_screening).map((t,i)=><span key={i} className="bo-chip">{t}</span>)}</div></div>
                              {str(val.operational_notes) && <div className="bo-kv" style={{gridColumn:"span 2"}}><span className="bo-k">Notes</span><span className="bo-v">{val.operational_notes}</span></div>}
                            </div>
                          );

                          if (key === "stakeholder_map") return (
                            <div style={{display:"flex",flexDirection:"column",gap:10}}>
                              <div className="bo-kv"><span className="bo-k">Active Tiers</span><div className="bo-chips">{arr(val.active_tiers).map((t,i)=><span key={i} className="bo-chip">{t}</span>)}</div></div>
                              <div className="bo-kv-grid">
                                <div className="bo-kv"><span className="bo-k">Nationalities</span><span className="bo-v">{val.audience_profile?.nationalities || "—"}</span></div>
                                <div className="bo-kv"><span className="bo-k">Languages</span><span className="bo-v">{[val.audience_profile?.primary_language, val.audience_profile?.secondary_language].filter(Boolean).join(" / ") || "—"}</span></div>
                                {val.audience_profile?.religious_considerations && <div className="bo-kv" style={{gridColumn:"span 2"}}><span className="bo-k">Religious</span><span className="bo-v">{val.audience_profile.religious_considerations}</span></div>}
                              </div>
                              {arr(val.tier_implications).length > 0 && (
                                <div className="bo-cards">{arr(val.tier_implications).map((ti,i) => (
                                  <div key={i} className="bo-card"><span className="bo-card-title">{ti.tier}</span><span className="bo-card-body">{ti.implication}</span></div>
                                ))}</div>
                              )}
                            </div>
                          );

                          if (key === "motivational_landscape") return (
                            <div style={{display:"flex",flexDirection:"column",gap:10}}>
                              <table className="bo-table">
                                <thead><tr><th>Motivation</th><th>Priority</th></tr></thead>
                                <tbody>{arr(val.motivations).filter(m=>m.priority).map((m,i)=>(
                                  <tr key={i}><td>{m.name}</td><td><Chip val={m.priority} /></td></tr>
                                ))}</tbody>
                              </table>
                              {str(val.dominant_motivation) && <div className="bo-kv"><span className="bo-k">Dominant Motivation</span><span className="bo-v accent">{val.dominant_motivation}</span></div>}
                              {str(val.strategic_insight) && <div className="bo-kv"><span className="bo-k">Strategic Insight</span><span className="bo-v">{val.strategic_insight}</span></div>}
                            </div>
                          );

                          if (key === "priority_heat_map") return (
                            <div style={{display:"flex",flexDirection:"column",gap:10}}>
                              <table className="bo-table">
                                <thead><tr><th>Outcome</th><th>Rank</th><th>Priority</th></tr></thead>
                                <tbody>{arr(val.outcomes).filter(o=>o.rank||o.priority).map((o,i)=>(
                                  <tr key={i}><td>{o.name}</td><td style={{textAlign:"center"}}>{o.rank || "—"}</td><td><Chip val={o.priority} /></td></tr>
                                ))}</tbody>
                              </table>
                              {arr(val.top_3).length > 0 && <div className="bo-kv"><span className="bo-k">Top 3 Focus</span><div className="bo-chips">{arr(val.top_3).map((t,i)=><span key={i} className="bo-chip">{t}</span>)}</div></div>}
                              {str(val.strategic_focus) && <div className="bo-kv"><span className="bo-k">Strategic Focus</span><span className="bo-v">{val.strategic_focus}</span></div>}
                            </div>
                          );

                          if (key === "selected_template") return (
                            <div className="bo-kv-grid">
                              <div className="bo-kv"><span className="bo-k">Primary</span><span className="bo-v accent">{str(val.primary) || "—"}</span></div>
                              <div className="bo-kv"><span className="bo-k">Secondary</span><span className="bo-v">{str(val.secondary) || "None"}</span></div>
                              {str(val.rationale) && <div className="bo-kv" style={{gridColumn:"span 2"}}><span className="bo-k">Rationale</span><span className="bo-v">{val.rationale}</span></div>}
                            </div>
                          );

                          if (key === "known_friction_zones") return (
                            <div className="bo-cards">{arr(val).map((z,i) => (
                              <div key={i} className="bo-card">
                                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                  <span className="bo-card-title">{z.zone}</span>
                                  <span className={`bo-severity ${z.severity}`}>{z.severity}</span>
                                </div>
                                <span className="bo-card-body">{z.description}</span>
                                {z.recommendation && <span className="bo-rec">→ {z.recommendation}</span>}
                              </div>
                            ))}</div>
                          );

                          if (key === "success_criteria") return (
                            <table className="bo-table">
                              <thead><tr><th>Criterion</th><th>Metric</th><th>Target</th></tr></thead>
                              <tbody>{arr(val).map((s,i) => (
                                <tr key={i}><td>{s.criterion}</td><td>{s.metric}</td><td style={{color:"#C8F04A"}}>{s.target}</td></tr>
                              ))}</tbody>
                            </table>
                          );

                          if (key === "gap_annotations") return (
                            <div className="bo-cards">{arr(val).map((g,i) => (
                              <div key={i} className="bo-card">
                                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                  <span className="bo-card-title">{g.area}</span>
                                  <span className={`bo-severity ${g.impact}`}>{g.impact} Impact</span>
                                </div>
                                <span className="bo-card-body">{g.gap_description}</span>
                                {g.suggested_action && <span className="bo-rec">→ {g.suggested_action}</span>}
                              </div>
                            ))}</div>
                          );

                          return <pre className="bo-string">{JSON.stringify(val, null, 2)}</pre>;
                        };

                        return (
                          <div className="bo-wrap" ref={briefOutRef}>
                            <StageContext
                              stage={1}
                              where="You've finished the intake questionnaire. This is your Experience Design Brief — the foundation everything else is built on."
                              done="We've captured your venue type, theme, scale, stakeholders, motivations and priorities from the wizard."
                              expect="A structured brief that turns your answers into a clear design direction: themes, friction zones, priority outcomes and a chosen framework."
                              value="It aligns everyone on what the experience should achieve before any design work begins — the brief every later stage references."
                            />
                            <div className="bo-header">
                              <div className="bo-header-left">
                                <span className="bo-eyebrow">◈ VX Journey Intelligence Engine</span>
                                <span className="bo-title">Experience Design Brief</span>
                              </div>
                              <div className="bo-header-btns">
                                <button className="bo-download-btn pdf" onClick={handleExportBriefPDF} disabled={pdfBusy === "brief"}>
                                  {pdfBusy === "brief" ? "Generating…" : "⬇ Download PDF"}
                                </button>
                                <button className="bo-download-btn" onClick={handleDownloadBrief}>
                                  ↓ JSON
                                </button>
                              </div>
                            </div>
                            <div className="bo-sections">
                              {Object.entries(briefData).map(([key, val]) => {
                                const meta = SECTION_META[key] || { label: key.replace(/_/g," "), num: "—" };
                                const isOpen = !!briefOpenSections[key];
                                return (
                                  <div key={key} className={`bo-section ${isOpen ? "open" : ""}`}>
                                    <div className="bo-section-header" onClick={() => setBriefOpenSections(p => ({...p, [key]: !p[key]}))}>
                                      <div className="bo-section-left">
                                        <span className="bo-section-key">{meta.num}</span>
                                        <span className="bo-section-title">{meta.label}</span>
                                      </div>
                                      <span className="bo-chevron">▾</span>
                                    </div>
                                    {isOpen && <div className="bo-body">{renderSection(key, val)}</div>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {briefData && unlockedStage === 1 && (
                        <div className="stage-proceed">
                          <button className="stage-proceed-btn" onClick={() => { setShowConsolidated(false); setUnlockedStage(2); }}>
                            Proceed to Next Stage — Benchmark Intelligence →
                          </button>
                        </div>
                      )}
                    </div>
                    </>)}

                    {/* Stage 2 — Benchmark Intelligence */}
                    {!showConsolidated && unlockedStage === 2 && (
                      <div id="anchor-benchmark">
                        <button className="bm-trigger-btn" onClick={handleRunBenchmark} disabled={benchmarkLoading}>
                          {benchmarkLoading ? <><span className="bm-spinner" /> Running Analysis for Global Leading Practices…</> : <>◈ Run Analysis for Global Leading Practices</>}
                        </button>
                        {benchmarkError && <div className="bm-error">⚠ {benchmarkError}</div>}
                        {benchmarkData && (() => {
                          const meta = benchmarkData.meta || {};
                          const activeKey = activeBenchmarkCategory || BENCHMARK_CATEGORIES[0].key;
                          const activeItems = benchmarkData[activeKey] || [];
                          const renderCard = (item, catKey, idx) => {
                            const cardKey = `${catKey}-${idx}`;
                            const isOpen = !!benchmarkOpenCards[cardKey];
                            const conf = item.confidence || "Medium";
                            const title = item.title || item.moment || item.lever_name || item.kpi || item.failure_mode || item.kpi_name || `Entry ${idx+1}`;
                            const institution = item.institution || item.source_type || "";
                            return (
                              <div key={cardKey} className={`bm-card ${isOpen ? "open" : ""}`}>
                                <div className="bm-card-header" onClick={() => setBenchmarkOpenCards(p => ({...p, [cardKey]: !p[cardKey]}))}>
                                  <div className="bm-card-header-left">
                                    <span className="bm-card-id">{String(idx+1).padStart(2,"0")}{item.outcome_link ? ` · ${item.outcome_link}` : ""}</span>
                                    <span className="bm-card-title">{title}</span>
                                    {institution && <span className="bm-card-institution">{institution}</span>}
                                  </div>
                                  <div className="bm-card-header-right">
                                    <span className={`bm-confidence ${conf}`}>{conf}</span>
                                    <span className="bm-chevron">▾</span>
                                  </div>
                                </div>
                                {isOpen && (
                                  <div className="bm-card-body">
                                    {(item.filter_relevance || item.filter_feasibility || item.filter_recency) && (
                                      <div><span className="bm-k" style={{display:"block",marginBottom:6}}>Filter Gates</span>
                                        <div className="bm-gate-row">
                                          {item.filter_relevance && <span className="bm-gate"><span className="bm-gate-label">Relevance</span><span className="bm-gate-val">{item.filter_relevance}</span></span>}
                                          {item.filter_feasibility && <span className="bm-gate"><span className="bm-gate-label">Feasibility</span><span className="bm-gate-val">{item.filter_feasibility}</span></span>}
                                          {item.filter_recency && <span className="bm-gate"><span className="bm-gate-label">Recency</span><span className="bm-gate-val">{item.filter_recency}</span></span>}
                                        </div>
                                      </div>
                                    )}
                                    {catKey === "archetype_patterns" && <div className="bm-kv-grid">
                                      {item.description && <div className="bm-kv" style={{gridColumn:"span 2"}}><span className="bm-k">Description</span><span className="bm-v">{item.description}</span></div>}
                                      {item.key_takeaway && <div className="bm-kv" style={{gridColumn:"span 2"}}><span className="bm-k">Key Takeaway</span><span className="bm-v accent">{item.key_takeaway}</span></div>}
                                    </div>}
                                    {catKey === "journey_inflection_points" && <div className="bm-kv-grid">
                                      {item.stage && <div className="bm-kv"><span className="bm-k">Stage</span><span className="bm-v accent">{item.stage}</span></div>}
                                      {item.what_works && <div className="bm-kv"><span className="bm-k">What Works</span><span className="bm-v">{item.what_works}</span></div>}
                                      {item.what_fails && <div className="bm-kv"><span className="bm-k">What Fails</span><span className="bm-v" style={{color:"#C07070"}}>{item.what_fails}</span></div>}
                                    </div>}
                                    {catKey === "proven_design_levers" && <div className="bm-kv-grid">
                                      {item.mechanic && <div className="bm-kv" style={{gridColumn:"span 2"}}><span className="bm-k">Mechanic</span><span className="bm-v">{item.mechanic}</span></div>}
                                      {item.measurable_impact && <div className="bm-kv"><span className="bm-k">Measurable Impact</span><span className="bm-v accent">{item.measurable_impact}</span></div>}
                                      {item.applicability_note && <div className="bm-kv"><span className="bm-k">Applicability</span><span className="bm-v">{item.applicability_note}</span></div>}
                                    </div>}
                                    {catKey === "operational_benchmarks" && <div className="bm-kv-grid">
                                      {item.benchmark_value && <div className="bm-kv"><span className="bm-k">Benchmark Value</span><span className="bm-v accent">{item.benchmark_value}</span></div>}
                                      {item.context && <div className="bm-kv"><span className="bm-k">Context</span><span className="bm-v">{item.context}</span></div>}
                                    </div>}
                                    {catKey === "failure_mode_library" && <div className="bm-kv-grid">
                                      {item.root_cause && <div className="bm-kv"><span className="bm-k">Root Cause</span><span className="bm-v">{item.root_cause}</span></div>}
                                      {item.consequence && <div className="bm-kv"><span className="bm-k">Consequence</span><span className="bm-v" style={{color:"#C07070"}}>{item.consequence}</span></div>}
                                      {item.mitigation && <div className="bm-kv" style={{gridColumn:"span 2"}}><span className="bm-k">Mitigation</span><span className="bm-v accent">{item.mitigation}</span></div>}
                                    </div>}
                                    {catKey === "kpi_norms" && <div className="bm-kv-grid">
                                      {item.unit && <div className="bm-kv"><span className="bm-k">Unit</span><span className="bm-v">{item.unit}</span></div>}
                                      <div className="bm-kv"><span className="bm-k">Industry Range</span>
                                        <span className="bm-v">
                                          <span style={{color:"#C07070"}}>{item.industry_low}</span>{" → "}
                                          <span style={{color:"#C8B840"}}>{item.industry_avg}</span>{" → "}
                                          <span style={{color:"#80C870"}}>{item.industry_high}</span>
                                        </span>
                                      </div>
                                      {item.source_type && <div className="bm-kv"><span className="bm-k">Source Type</span><span className="bm-v">{item.source_type}</span></div>}
                                    </div>}
                                  </div>
                                )}
                              </div>
                            );
                          };
                          return (
                            <div className="bm-wrap" ref={benchmarkOutRef} id="anchor-benchmark-results">
                              <StageContext
                                stage={2}
                                where="You're now looking outward — at how the best venues in your sector solve the same challenges."
                                done="Your brief defined the goals and friction zones. We've matched them against proven, real-world leading practices."
                                expect="Benchmark intelligence: winning patterns, proven design levers, common failure modes and the KPI norms top venues hit."
                                value="It grounds your design in what already works globally, so you adopt proven moves and avoid known mistakes."
                              />
                              <div className="bm-header">
                                <div className="bm-header-left">
                                  <span className="bm-eyebrow">◈ Stage 2 · Analysis for Global Leading Practices</span>
                                  <span className="bm-title">Analysis for Global Leading Practices</span>
                                </div>
                                <button className="bm-dl-btn pdf" onClick={handleExportBenchmarkPDF} disabled={pdfBusy === "benchmark"}>{pdfBusy === "benchmark" ? "Generating…" : "⬇ Download PDF"}</button>
                                <button className="bm-dl-btn" onClick={handleDownloadBenchmark}>↓ JSON</button>
                              </div>
                              <div className="bm-meta-bar">
                                <div className="bm-meta-item"><span className="bm-meta-k">Sector</span><span className="bm-meta-v">{meta.sector || "—"}</span></div>
                                <div className="bm-meta-item"><span className="bm-meta-k">Top 3 Outcomes</span><span className="bm-meta-v">{(meta.top_3_outcomes||[]).join(" · ")||"—"}</span></div>
                                <div className="bm-meta-item"><span className="bm-meta-k">Total Entries</span><span className="bm-meta-v">{BENCHMARK_CATEGORIES.reduce((s,c)=>s+(benchmarkData[c.key]?.length||0),0)}</span></div>
                              </div>
                              <div className="bm-category-tabs">
                                {BENCHMARK_CATEGORIES.map(cat => (
                                  <div key={cat.key} className={`bm-tab ${activeKey===cat.key?"active":""}`} onClick={() => setActiveBenchmarkCategory(cat.key)}>
                                    <span className="bm-tab-icon">{cat.icon}</span>
                                    <span className="bm-tab-label">{cat.label}</span>
                                    <span className="bm-tab-count">{benchmarkData[cat.key]?.length||0}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="bm-panel">
                                {activeItems.length === 0
                                  ? <span style={{fontSize:"11px",color:"#3A1A60",fontStyle:"italic"}}>No entries for this category.</span>
                                  : activeItems.map((item,idx) => renderCard(item, activeKey, idx))
                                }
                              </div>
                            </div>
                          );
                        })()}

                        {benchmarkData && unlockedStage === 2 && (
                          <div className="stage-proceed">
                            <button className="stage-proceed-btn" onClick={() => { setShowConsolidated(false); setUnlockedStage(3); }}>
                              Proceed to Next Stage — Persona Synthesis →
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ══════════════════════════════════════════════ */}
                    {/* Stage 3 — Visitor Persona Synthesis           */}
                    {/* ══════════════════════════════════════════════ */}
                    {!showConsolidated && unlockedStage === 3 && (
                      <div id="anchor-persona">
                        <button className="bm-trigger-btn" onClick={handleGeneratePersonaLongList} disabled={personaLoading}>
                          {personaLoading ? <><span className="bm-spinner" /> Generating Visitor Persona Long List… {fmtElapsed(genElapsed)}</> : <>◍ Stage 3: Generate Visitor Persona Long List for Selection</>}
                        </button>
                        {personaLoading && <button className="jm-cancel-btn" onClick={cancelGeneration}>✕ Cancel</button>}
                        {personaError && <div className="bm-error">⚠ {personaError}</div>}

                        {personaData && (() => {
                          const longList = personaData.long_list || [];
                          const dyafs = personaData.did_you_account_for_this || [];
                          const counts = longList.reduce((acc, p) => {
                            const s = personaSelections[p.id] || "exclude";
                            acc[s] = (acc[s] || 0) + 1; return acc;
                          }, {});
                          const SEL_BTNS = [
                            { key: "include", label: "Include" },
                            { key: "secondary", label: "Secondary" },
                            { key: "exclude", label: "Exclude" },
                          ];
                          const cplxColor = (v) => v === "Very High" ? "#C07070" : v === "High" ? "#C8B840" : v === "Medium" ? "#7AC8E0" : "#80C870";
                          return (
                            <div className="bm-wrap" ref={personaOutRef} id="anchor-persona-select">
                              <StageContext
                                stage={3}
                                where="This is your first headline deliverable: the visitor personas your whole experience will be designed around."
                                done="Using your brief and the benchmark intelligence, we've synthesised a candidate list of distinct visitor types for your sector."
                                expect="A long list of personas to review — select the ones to carry forward, then we build full, rich persona cards and a comparison matrix."
                                value="Personas turn abstract 'visitors' into specific people with needs and motivations, so every design decision has a face behind it."
                              />
                              <div className="bm-header">
                                <div className="bm-header-left">
                                  <span className="bm-eyebrow">◍ Stage 3 · Persona Synthesis Engine</span>
                                  <span className="bm-title">Candidate Persona Long List</span>
                                </div>
                                <button className="bm-dl-btn pdf" onClick={handleExportPersonasPDF} disabled={pdfBusy === "persona"}>{pdfBusy === "persona" ? "Generating…" : "⬇ Download PDF"}</button>
                                <button className="bm-dl-btn" onClick={handleDownloadPersonas}>↓ JSON</button>
                              </div>
                              <div className="bm-meta-bar">
                                <div className="bm-meta-item"><span className="bm-meta-k">Candidates</span><span className="bm-meta-v">{longList.length}</span></div>
                                <div className="bm-meta-item"><span className="bm-meta-k">Included</span><span className="bm-meta-v" style={{color:"#80C870"}}>{counts.include || 0}</span></div>
                                <div className="bm-meta-item"><span className="bm-meta-k">Secondary</span><span className="bm-meta-v" style={{color:"#C8B840"}}>{counts.secondary || 0}</span></div>
                                <div className="bm-meta-item"><span className="bm-meta-k">Excluded</span><span className="bm-meta-v" style={{color:"#C07070"}}>{counts.exclude || 0}</span></div>
                              </div>

                              {dyafs.length > 0 && (
                                <div className="px-dyaf">
                                  <span className="px-dyaf-title">⚑ Did you account for this?</span>
                                  {dyafs.map((d, i) => (
                                    <div key={i} className="px-dyaf-row"><strong>{d.archetype}</strong> — {d.why_it_matters}</div>
                                  ))}
                                </div>
                              )}

                              {/* Step 2 — selection controls */}
                              <div className="px-bulk-bar">
                                <span className="px-bulk-label">Persona Selection</span>
                                <div className="px-bulk-actions">
                                  <button className="px-bulk-btn" onClick={selectAllPersonas}>Select All</button>
                                  <button className="px-bulk-btn" onClick={deselectAllPersonas}>Deselect All</button>
                                </div>
                              </div>

                              <div className="bm-panel">
                                {longList.map((p) => {
                                  const sel = personaSelections[p.id] || "exclude";
                                  const isOpen = !!personaOpenCards[p.id];
                                  return (
                                    <div key={p.id} className={`bm-card ${isOpen ? "open" : ""}`} style={{opacity: sel === "exclude" ? 0.55 : 1}}>
                                      <div className="bm-card-header" onClick={() => setPersonaOpenCards(pr => ({...pr, [p.id]: !pr[p.id]}))}>
                                        <div className="bm-card-header-left">
                                          <span className="px-avatar" style={{ background: p.pod_flag ? "#0E7A8A" : "#4F46E5" }}>{(p.name || "?").split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase()}</span>
                                          <div className="px-head-text">
                                            <span className="bm-card-title">{p.given_name ? `${p.given_name} — ${p.name}` : p.name}{p.pod_flag && <span className="px-pod-chip">♿ POD</span>}</span>
                                            <span className="bm-card-institution">{p.archetype} · {p.tier}</span>
                                          </div>
                                        </div>
                                        <div className="bm-card-header-right">
                                          <span className="px-cplx" style={{color: cplxColor(p.journey_complexity), borderColor: cplxColor(p.journey_complexity)}}>{p.journey_complexity}</span>
                                          <button
                                            className={`px-check-btn ${sel !== "exclude" ? "on" : ""}`}
                                            onClick={(e) => { e.stopPropagation(); setPersonaSelection(p.id, sel === "exclude" ? "include" : "exclude"); }}
                                            title={sel !== "exclude" ? "Selected — click to remove" : "Click to select"}
                                          >
                                            {sel !== "exclude" ? "✓ Selected" : "+ Select"}
                                          </button>
                                          <span className="bm-chevron">▾</span>
                                        </div>
                                      </div>
                                      {isOpen && (
                                        <div className="bm-card-body">
                                          {p.description && <div className="bm-kv" style={{marginBottom:8}}><span className="bm-k">Description</span><span className="bm-v">{p.description}</span></div>}
                                          <div className="bm-kv-grid">
                                            <div className="bm-kv"><span className="bm-k">Tier & Segment</span><span className="bm-v">{[p.tier, p.segment].filter(Boolean).join(" · ") || "—"}</span></div>
                                            <div className="bm-kv"><span className="bm-k">Motivation</span><span className="bm-v">{p.motivation || "—"}</span></div>
                                            <div className="bm-kv"><span className="bm-k">Strategic Value</span><span className="bm-v accent">{p.strategic_value || "—"}</span></div>
                                            <div className="bm-kv"><span className="bm-k">Journey Complexity</span><span className="bm-v" style={{color: cplxColor(p.journey_complexity)}}>{p.journey_complexity || "—"}</span></div>
                                            <div className="bm-kv"><span className="bm-k">Recommended</span><span className="bm-v accent">{p.recommended_inclusion || "—"}</span></div>
                                            <div className="bm-kv"><span className="bm-k">Source</span><span className="bm-v">{p.source || "—"}{p.source_confidence ? ` (${p.source_confidence})` : ""}</span></div>
                                          </div>
                                          {(p.constraint_flags || []).length > 0 && (
                                            <div style={{marginTop:8}}><span className="bm-k" style={{display:"block",marginBottom:6}}>Constraint Flags</span>
                                              <div className="bo-chips">{p.constraint_flags.map((c,i)=><span key={i} className="bo-chip high">{c}</span>)}</div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              <button className="bm-trigger-btn px-confirm-btn" style={{marginTop:14}} onClick={handleGenerateFullPersonas} disabled={fullPersonaLoading}>
                                {fullPersonaLoading ? <><span className="bm-spinner" /> Validating Coverage… {fmtElapsed(genElapsed)}</> : <>✓ Confirm Selection</>}
                              </button>
                              {fullPersonaLoading && <button className="jm-cancel-btn" onClick={cancelGeneration}>✕ Cancel</button>}
                              {fullPersonaError && <div className="bm-error">⚠ {fullPersonaError}</div>}
                            </div>
                          );
                        })()}

                        {/* Step 3 + 4 + 5 — coverage validation, full cards, comparison matrix */}
                        {fullPersonas && (() => {
                          const personas = fullPersonas.personas || [];
                          const matrix = fullPersonas.comparison_matrix || [];
                          const validation = fullPersonas.coverage_validation || [];
                          const list = (arr) => (arr || []).length > 0;
                          return (
                            <div className="bm-wrap" style={{marginTop:18}} id="anchor-persona-cards">
                              <div className="bm-header">
                                <div className="bm-header-left">
                                  <span className="bm-eyebrow">◍ Stage 3 · Confirmed Persona Set</span>
                                  <span className="bm-title">Coverage Validation & Full Persona Cards</span>
                                </div>
                              </div>

                              {validation.length > 0 && (
                                <div className="px-validation">
                                  {validation.map((v, i) => (
                                    <div key={i} className={`px-check ${v.status === "pass" ? "pass" : "fail"}`}>
                                      <span className="px-check-icon">{v.status === "pass" ? "✓" : "✕"}</span>
                                      <span className="px-check-name">{v.check}</span>
                                      <span className="px-check-status">{v.status === "pass" ? "PASS" : "FAIL"}</span>
                                      <span className="px-check-detail">{v.detail}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="bm-panel">
                                {personas.map((p, pIdx) => {
                                  const isOpen = !!fullPersonaOpenCards[p.id];
                                  return (
                                    <div key={p.id} className={`bm-card ${isOpen ? "open" : ""}`}>
                                      <div className="bm-card-header" onClick={() => setFullPersonaOpenCards(pr => ({...pr, [p.id]: !pr[p.id]}))}>
                                        <div className="bm-card-header-left">
                                          <span className="px-avatar" style={{ background: p.pod_flag ? "#0E7A8A" : "#4F46E5" }}>
                                            {(p.name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                                          </span>
                                          <div className="px-head-text">
                                            <span className="bm-card-title">{p.given_name ? `${p.given_name} — ${p.name}` : p.name} {p.pod_flag && <span className="px-pod-chip">♿ POD</span>}</span>
                                            <span className="bm-card-institution">{p.archetype} · {p.tier}</span>
                                          </div>
                                        </div>
                                        <div className="bm-card-header-right">
                                          <span className={`bm-confidence ${p.strategic_classification === "Secondary" ? "Low" : "High"}`}>{p.strategic_classification || "Primary"}</span>
                                          <span className="bm-chevron">▾</span>
                                        </div>
                                      </div>
                                      {isOpen && (
                                        <div className="bm-card-body">
                                          {p.quote && (
                                            <div className="px-quote">
                                              <span className="px-quote-mark">"</span>
                                              <span className="px-quote-text">{p.quote.replace(/^"|"$/g, "")}</span>
                                            </div>
                                          )}
                                          {p.identity && <div className="px-identity"><span className="px-attr-k">◐ Who They Are</span><p>{p.identity}</p></div>}
                                          {p.meters && (
                                            <div className="px-meters">
                                              {[
                                                { k: "Tech Savviness", v: p.meters.tech_savviness },
                                                { k: "Price Sensitivity", v: p.meters.price_sensitivity },
                                                { k: "Planning Style", v: p.meters.planning_style, lo: "Spontaneous", hi: "Highly planned" },
                                                { k: "Support Need", v: p.meters.support_need },
                                                { k: "Advocacy Potential", v: p.meters.advocacy_potential },
                                              ].map((m) => (
                                                <div key={m.k} className="px-meter">
                                                  <span className="px-meter-k">{m.k}</span>
                                                  <span className="px-meter-track"><span className="px-meter-fill" style={{ width: `${m.v}%` }} /></span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                          <div className="px-attr-grid">
                                            {list(p.motivations) && <div className="px-attr motiv"><span className="px-attr-k">✦ Motivations</span><ul className="px-attr-list">{p.motivations.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
                                            {list(p.goals) && <div className="px-attr goal"><span className="px-attr-k">◎ Goals</span><ul className="px-attr-list">{p.goals.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
                                            {list(p.pain_points) && <div className="px-attr pain"><span className="px-attr-k">▲ Pain Points</span><ul className="px-attr-list pain">{p.pain_points.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
                                            {list(p.expectations) && <div className="px-attr expect"><span className="px-attr-k">◈ Expectations</span><ul className="px-attr-list">{p.expectations.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
                                            {list(p.journey_risks) && <div className="px-attr pain"><span className="px-attr-k">⚠ Journey Risks</span><ul className="px-attr-list pain">{p.journey_risks.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
                                            {list(p.key_emotional_drivers) && <div className="px-attr emote"><span className="px-attr-k">♥ Emotional Drivers</span><ul className="px-attr-list">{p.key_emotional_drivers.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
                                          </div>
                                          <div className="px-behaviour-grid">
                                            {p.accessibility_needs && <div className="px-beh"><span className="bm-k">♿ Accessibility Needs</span><span className="bm-v">{p.accessibility_needs}</span></div>}
                                            {p.digital_behaviour && <div className="px-beh"><span className="bm-k">▣ Digital Behaviour</span><span className="bm-v">{p.digital_behaviour}</span></div>}
                                            {p.visit_behaviour && <div className="px-beh"><span className="bm-k">◉ Visit Behaviour</span><span className="bm-v">{p.visit_behaviour}</span></div>}
                                            {p.spending_behaviour && <div className="px-beh"><span className="bm-k">$ Spending Behaviour</span><span className="bm-v">{p.spending_behaviour}</span></div>}
                                          </div>
                                          {p.success_definition && <div className="px-success"><span className="px-attr-k">★ What Success Looks Like</span><p>{p.success_definition}</p></div>}
                                          {list(p.preferred_channels) && <div style={{marginTop:12}}><span className="bm-k" style={{display:"block",marginBottom:6}}>Preferred Channels</span><div className="bo-chips">{p.preferred_channels.map((c,i)=><span key={i} className="bo-chip">{i+1}. {c}</span>)}</div></div>}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {matrix.length > 0 && (
                                <div style={{marginTop:14}}>
                                  <span className="bm-eyebrow" style={{display:"block",marginBottom:8}}>Persona Comparison Matrix</span>
                                  <div style={{overflowX:"auto"}}>
                                    <table className="bo-table px-matrix">
                                      <thead><tr><th>Persona</th><th>Motivation</th><th>Spend</th><th>Complexity</th><th>Accessibility</th><th>Loyalty</th><th>Advocacy</th><th>Strategic Value</th><th>POD</th></tr></thead>
                                      <tbody>
                                        {matrix.map((m,i)=>(
                                          <tr key={i}>
                                            <td><strong>{m.id} {m.persona}</strong></td>
                                            <td>{m.motivation}</td>
                                            <td>{m.spend_propensity}</td>
                                            <td>{m.journey_complexity}</td>
                                            <td>{m.accessibility_need}</td>
                                            <td>{m.loyalty_potential}</td>
                                            <td>{m.advocacy_potential}</td>
                                            <td style={{color:"#4F46E5",fontWeight:600}}>{m.strategic_value}</td>
                                            <td style={{color: m.pod_flag ? "#B8860B" : "#94A3B8"}}>{m.pod_flag ? "Yes" : "No"}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {fullPersonas?.personas?.length > 0 && unlockedStage === 3 && (
                          <div className="stage-proceed">
                            <button className="stage-proceed-btn" onClick={() => { setShowConsolidated(false); setUnlockedStage(4); }}>
                              Proceed to Stage 4 — Journey Intelligence →
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ══════════════════════════════════════════════ */}
                    {/* Stage 4 — Journey Mapping, MoT & KPI Framework */}
                    {/* ══════════════════════════════════════════════ */}
                    {!showConsolidated && unlockedStage === 4 && (
                      <div style={{marginTop:18}} id="anchor-journey">
                        <button className="bm-trigger-btn" onClick={handleGenerateJourneys} disabled={journeyLoading}>
                          {journeyLoading ? <><span className="bm-spinner" /> Mapping Journeys, Moments of Truth & KPIs… {fmtElapsed(genElapsed)}</> : <>◆ Generate Stage 4 · Journey Maps, MoT & KPI Framework</>}
                        </button>
                        {journeyLoading && <button className="jm-cancel-btn" onClick={cancelGeneration}>✕ Cancel</button>}
                        {journeyError && <div className="bm-error">⚠ {journeyError}</div>}

                        {journeyData?.journeys?.length > 0 && (() => {
                          const journeys = journeyData.journeys;
                          const active = journeys.find(j => j.persona_id === activeJourneyPersona) || journeys[0];
                          const stageKey = JOURNEY_STAGES[activeJourneyStage].key;
                          const stage = active.stages?.[stageKey] || {};
                          const scoreColor = (n) => { const l = HML(n); return l === "High" ? "#DC2626" : l === "Med" ? "#D97706" : "#16A34A"; };
                          const delightColor = (n) => { const l = HML(n); return l === "High" ? "#16A34A" : l === "Med" ? "#D97706" : "#94A3B8"; };
                          const motColor = (c) => ({ Critical:"#DC2626", High:"#D97706", Medium:"#0891B2", Low:"#16A34A" }[c] || "#64748B");
                          const tlColor = (c) => ({ Green:"#16A34A", Amber:"#D97706", Red:"#DC2626" }[c] || "#64748B");
                          const KPI_TIERS = [
                            { key: "Executive", label: "Executive KPIs" },
                            { key: "Management", label: "Management KPIs" },
                            { key: "Operational", label: "Operational KPIs" },
                          ];
                          return (
                            <div className="bm-wrap" ref={journeyOutRef} id="anchor-journey-maps">
                              <StageContext
                                stage={4}
                                where="This is your second headline deliverable: how each persona actually experiences your venue, end to end."
                                done="With personas confirmed, we've mapped each one's five-phase journey and analysed every touchpoint."
                                expect="Full journey maps with an emotional curve, the Moments of Truth that make or break the visit, and a three-tier KPI framework to measure success."
                                value="This is where insight becomes action: it shows exactly where to invest, what to fix first, and how you'll know it worked."
                              />
                              <div className="bm-header">
                                <div className="bm-header-left">
                                  <span className="bm-eyebrow">◆ Stage 4 · Journey Intelligence</span>
                                  <span className="bm-title">Journey Maps · Moments of Truth · KPIs</span>
                                </div>
                                <button className="bm-dl-btn pdf" onClick={handleExportJourneysPDF} disabled={pdfBusy === "journey"}>{pdfBusy === "journey" ? "Generating…" : "⬇ Download PDF"}</button>
                                <button className="bm-dl-btn" onClick={handleDownloadJourneys}>↓ JSON</button>
                              </div>
                              <div className="bm-meta-bar">
                                <div className="bm-meta-item"><span className="bm-meta-k">Journeys</span><span className="bm-meta-v">{journeys.length}</span></div>
                                <div className="bm-meta-item"><span className="bm-meta-k">Template</span><span className="bm-meta-v">{active.template_used || "—"}</span></div>
                                <div className="bm-meta-item"><span className="bm-meta-k">Moments of Truth</span><span className="bm-meta-v">{active.moments_of_truth?.length || 0}</span></div>
                                <div className="bm-meta-item"><span className="bm-meta-k">KPIs</span><span className="bm-meta-v">{active.kpis?.length || 0}</span></div>
                              </div>

                              {/* Persona selector */}
                              <div className="jm-persona-tabs">
                                {journeys.map(j => (
                                  <button key={j.persona_id} className={`jm-persona-tab ${active.persona_id === j.persona_id ? "active" : ""}`} onClick={() => { setActiveJourneyPersona(j.persona_id); setActiveJourneyStage(0); }}>
                                    <span className="jm-persona-id">{j.persona_id}</span>
                                    <span className="jm-persona-name">{j.persona_name}</span>
                                  </button>
                                ))}
                              </div>

                              {/* Sub-view toggle */}
                              <div className="jm-subview">
                                {[{k:"journey",l:"Journey Map"},{k:"mot",l:`Moments of Truth (${active.moments_of_truth?.length||0})`},{k:"kpi",l:`KPI Dashboard (${active.kpis?.length||0})`}].map(s => (
                                  <button key={s.k} className={`jm-subview-btn ${journeySubView===s.k?"active":""}`} onClick={()=>setJourneySubView(s.k)}>{s.l}</button>
                                ))}
                              </div>

                              {journeySubView === "journey" && (() => {
                                const STG = JOURNEY_STAGES; // 5 stages
                                const motTag = (c) => {
                                  // map MoT classification → coloured tag
                                  const map = { Critical: { l: "RISK", bg: "#FEE2E2", fg: "#B91C1C" }, High: { l: "CONV", bg: "#DBEAFE", fg: "#1D4ED8" }, Medium: { l: "DELIGHT", bg: "#DCFCE7", fg: "#15803D" }, Low: { l: "LOYALTY", bg: "#EDE9FE", fg: "#6D28D9" } };
                                  return map[c] || map.Medium;
                                };
                                const motsByStage = {};
                                (active.moments_of_truth || []).forEach((m) => {
                                  const k = (m.stage || "").toLowerCase().replace(/[^a-z]/g, "");
                                  motsByStage[k] = motsByStage[k] || [];
                                  motsByStage[k].push(m);
                                });
                                const stageMots = (label) => motsByStage[label.toLowerCase().replace(/[^a-z]/g, "")] || [];
                                // Emotional curve points across the 5 stages
                                const pts = STG.map((s) => active.stages?.[s.key]?.avg_sentiment ?? 50);
                                const W = 100, H = 34;
                                const xy = pts.map((v, i) => [STG.length === 1 ? W / 2 : (i / (STG.length - 1)) * W, H - (v / 100) * H]);
                                const path = xy.map((q, i) => `${i === 0 ? "M" : "L"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
                                const area = `${path} L${W},${H} L0,${H} Z`;
                                return (
                                  <div className="jmap-scroll">
                                    <div className="jmap-grid">
                                      {/* Header row: stage columns */}
                                      <div className="jmap-rowlabel jmap-corner">Journey Stage</div>
                                      {STG.map((s) => <div key={s.key} className="jmap-colhead">{s.label}</div>)}

                                      {/* Persona Goal */}
                                      <div className="jmap-rowlabel">Persona Goal</div>
                                      {STG.map((s) => <div key={s.key} className="jmap-cell">{active.stages?.[s.key]?.persona_goal || "—"}</div>)}

                                      {/* Key Actions */}
                                      <div className="jmap-rowlabel">Key Actions</div>
                                      {STG.map((s) => <div key={s.key} className="jmap-cell"><ul className="jmap-ul">{(active.stages?.[s.key]?.key_actions || []).map((a, i) => <li key={i}>{a}</li>)}</ul></div>)}

                                      {/* Touchpoints */}
                                      <div className="jmap-rowlabel">Touchpoints</div>
                                      {STG.map((s) => <div key={s.key} className="jmap-cell"><div className="jmap-chips">{(active.stages?.[s.key]?.touchpoints || []).map((t, i) => <span key={i} className="jmap-chip">{t.name}</span>)}</div></div>)}

                                      {/* Emotional Curve — spans all 5 columns */}
                                      <div className="jmap-rowlabel">Emotional Curve</div>
                                      <div className="jmap-curve-cell">
                                        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="jmap-curve-svg">
                                          <defs><linearGradient id="jmapCurve" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" /><stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" /></linearGradient></defs>
                                          <path d={area} fill="url(#jmapCurve)" />
                                          <path d={path} fill="none" stroke="#6D28D9" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
                                          {xy.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r="2" fill="#6D28D9" vectorEffect="non-scaling-stroke" />)}
                                        </svg>
                                        <div className="jmap-emotion-labels">
                                          {STG.map((s) => <span key={s.key} className="jmap-emotion-lbl">{active.stages?.[s.key]?.emotion_label || "—"}</span>)}
                                        </div>
                                      </div>

                                      {/* Pain Points */}
                                      <div className="jmap-rowlabel">Pain Points</div>
                                      {STG.map((s) => { const pp = active.stages?.[s.key]?.pain_points || []; return <div key={s.key} className="jmap-cell">{pp.length ? <ul className="jmap-ul pain">{pp.map((x, i) => <li key={i}>{x}</li>)}</ul> : <span className="jmap-muted">—</span>}</div>; })}

                                      {/* Moments of Truth — inline coloured tags */}
                                      <div className="jmap-rowlabel">Moments of Truth</div>
                                      {STG.map((s) => { const ms = stageMots(s.label); return <div key={s.key} className="jmap-cell">{ms.length ? ms.map((m, i) => { const t = motTag(m.classification); return <span key={i} className="jmap-mot" style={{ background: t.bg, color: t.fg }} title={m.name}>{t.l}</span>; }) : <span className="jmap-muted">—</span>}</div>; })}

                                      {/* Opportunities */}
                                      <div className="jmap-rowlabel">Opportunities</div>
                                      {STG.map((s) => <div key={s.key} className="jmap-cell"><ul className="jmap-ul opp">{(active.stages?.[s.key]?.opportunities || []).map((o, i) => <li key={i}>{o}</li>)}</ul></div>)}
                                    </div>
                                    <div className="jmap-key">
                                      <span className="jmap-key-title">MoT tags:</span>
                                      <span className="jmap-mot" style={{ background: "#FEE2E2", color: "#B91C1C" }}>RISK</span>
                                      <span className="jmap-mot" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>CONV</span>
                                      <span className="jmap-mot" style={{ background: "#DCFCE7", color: "#15803D" }}>DELIGHT</span>
                                      <span className="jmap-mot" style={{ background: "#EDE9FE", color: "#6D28D9" }}>LOYALTY</span>
                                    </div>
                                  </div>
                                );
                              })()}

                              {journeySubView === "mot" && (
                                <div className="bm-panel">
                                  {(active.moments_of_truth || []).map((m, i) => {
                                    const open = !!journeyMotOpen[`${active.persona_id}-${i}`];
                                    return (
                                      <div key={i} className={`bm-card ${open?"open":""}`}>
                                        <div className="bm-card-header" onClick={()=>setJourneyMotOpen(p=>({...p,[`${active.persona_id}-${i}`]:!p[`${active.persona_id}-${i}`]}))}>
                                          <div className="bm-card-header-left">
                                            <span className="bm-card-id">{m.id || `MoT-${i+1}`} · {m.stage}</span>
                                            <span className="bm-card-title">{m.name || m.touchpoint}</span>
                                            <span className="bm-card-institution">{m.touchpoint}</span>
                                          </div>
                                          <div className="bm-card-header-right">
                                            <span className="jm-mot-type" style={{color: motColor(m.classification), borderColor: motColor(m.classification)}}>{m.classification}</span>
                                            <span className="bm-chevron">▾</span>
                                          </div>
                                        </div>
                                        {open && (
                                          <div className="bm-card-body">
                                            <div className="bm-kv-grid">
                                              {m.reason_detected && <div className="bm-kv" style={{gridColumn:"span 2"}}><span className="bm-k">Reason Detected</span><span className="bm-v">{m.reason_detected}</span></div>}
                                              {m.impact && <div className="bm-kv"><span className="bm-k">Impact</span><span className="bm-v">{m.impact}</span></div>}
                                              {m.risk && <div className="bm-kv"><span className="bm-k">Risk</span><span className="bm-v" style={{color:"#C08A8A"}}>{m.risk}</span></div>}
                                              {m.recommendation && <div className="bm-kv" style={{gridColumn:"span 2"}}><span className="bm-k">Recommendation</span><span className="bm-v accent" style={{color:"#C8F04A"}}>→ {m.recommendation}</span></div>}
                                              {m.owner && <div className="bm-kv"><span className="bm-k">Owner</span><span className="bm-v">{m.owner}</span></div>}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                  {(active.moments_of_truth||[]).length === 0 && <span style={{fontSize:11,color:"#3A4A60",fontStyle:"italic"}}>No Moments of Truth detected.</span>}
                                </div>
                              )}

                              {journeySubView === "kpi" && (
                                <div className="jm-kpi-tiers">
                                  {KPI_TIERS.map(tier => {
                                    const tierKpis = (active.kpis || []).filter(k => k.tier === tier.key);
                                    if (tierKpis.length === 0) return null;
                                    return (
                                      <div key={tier.key} className="jm-kpi-tier">
                                        <span className="jm-kpi-tier-label">{tier.label} <span className="jm-kpi-tier-count">{tierKpis.length}</span></span>
                                        <div className="jm-kpi-cards">
                                          {tierKpis.map((k, i) => (
                                            <div key={i} className="jm-kpi-card">
                                              <div className="jm-kpi-card-head">
                                                <span className="jm-kpi-name">{k.name}</span>
                                                <span className="jm-kpi-tl" style={{background: tlColor(k.traffic_light)}} title={k.traffic_light} />
                                              </div>
                                              {k.metric_definition && <div className="jm-kpi-def">{k.metric_definition}</div>}
                                              {k.formula && <div className="jm-kpi-formula">ƒ {k.formula}</div>}
                                              <div className="jm-kpi-meta">
                                                <div className="jm-kpi-mk"><span>Target</span><strong style={{color:"#C8F04A"}}>{k.target || "—"}</strong></div>
                                                <div className="jm-kpi-mk"><span>Frequency</span><strong>{k.frequency || "—"}</strong></div>
                                                <div className="jm-kpi-mk"><span>Owner</span><strong>{k.owner || "—"}</strong></div>
                                                <div className="jm-kpi-mk"><span>Data Source</span><strong>{k.data_source || "—"}</strong></div>
                                              </div>
                                              <div className="jm-kpi-ind">
                                                {k.leading_indicator && <div className="jm-kpi-indrow"><span className="jm-kpi-indtag lead">Leading</span>{k.leading_indicator}</div>}
                                                {k.lagging_indicator && <div className="jm-kpi-indrow"><span className="jm-kpi-indtag lag">Lagging</span>{k.lagging_indicator}</div>}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                  {(active.kpis||[]).length === 0 && <span style={{fontSize:11,color:"#3A4A60",fontStyle:"italic"}}>No KPIs defined.</span>}
                                </div>
                              )}

                              {/* Stage 4 exports */}
                              <div className="jm-export-bar">
                                <span className="jm-export-label">Export PDF</span>
                                <button className="jm-export-btn primary" onClick={handleExportJourneysPDF} disabled={pdfBusy === "journey"}>{pdfBusy === "journey" ? "Generating…" : "⬇ Journey Maps PDF"}</button>
                                <span className="jm-export-label" style={{ marginLeft: 8 }}>Export JSON</span>
                                <button className="jm-export-btn" onClick={handleDownloadJourneys}>Journey Maps</button>
                                <button className="jm-export-btn" onClick={handleExportMoments}>Moments of Truth</button>
                                <button className="jm-export-btn" onClick={handleExportKPIs}>KPI Framework</button>
                                <button className="jm-export-btn" onClick={handleExportCompletePackage}>Complete Package</button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* ══════════════════════════════════════════════ */}
                    {/* Consolidated Customer Journey Mapping Framework */}
                    {/* ══════════════════════════════════════════════ */}
                    {showConsolidated && journeyData?.journeys?.length > 0 && (() => {
                      const cf = buildConsolidatedFramework(journeyData, briefData, benchmarkData, briefData?.sector_context?.sector_id || selectedSector?.id);
                      const intensityColor = (v) => v >= 70 ? "#16A34A" : v >= 50 ? "#D97706" : "#DC2626";
                      const clusterColor = { Conversion: "#1D4ED8", Risk: "#B91C1C", Delight: "#15803D", Loyalty: "#6D28D9" };
                      return (
                        <div className="bm-wrap">
                          <div className="stage-context" style={{ "--stage-color": "#0E7490" }}>
                            <div className="stage-context-banner" style={{ background: "#0E7490" }}>
                              <span className="stage-context-badge2">Strategy Layer</span>
                              <span className="stage-context-bannername">Consolidated Customer Journey Framework</span>
                              <span className="stage-context-gate passed">{cf.persona_count} personas synthesised</span>
                            </div>
                            <div className="stage-context-grid">
                              <div className="stage-context-item"><span className="stage-context-k">What this is</span><span className="stage-context-v">A cross-persona, executive synthesis of every journey — the strategic layer above the individual maps.</span></div>
                              <div className="stage-context-item"><span className="stage-context-k">Why it matters</span><span className="stage-context-v">It shows where personas converge, where they diverge, and the few priorities and tensions leadership must resolve.</span></div>
                            </div>
                          </div>

                          {/* Section 1 — Journey Architecture */}
                          <div className="cf-section">
                            <div className="cf-h">01 · Journey Architecture Overview</div>
                            <div className="cf-arch-grid">
                              {cf.architecture.map((a, i) => (
                                <div key={i} className="cf-arch-card">
                                  <div className="cf-arch-stage">{a.stage}</div>
                                  <div className="cf-arch-shared">{a.shared}</div>
                                  <div className="cf-arch-div">{a.divergence}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Section 2 — Persona Overlay Grid */}
                          <div className="cf-section">
                            <div className="cf-h">02 · Persona Overlay Grid</div>
                            <div className="jmap-scroll">
                              <table className="cf-table">
                                <thead><tr><th>Stage</th>{(cf.overlay[0]?.cells || []).map((c, i) => <th key={i}>{c.persona}</th>)}</tr></thead>
                                <tbody>
                                  {cf.overlay.map((row, i) => (
                                    <tr key={i}>
                                      <td className="cf-td-stage">{row.stage}</td>
                                      {row.cells.map((c, j) => (
                                        <td key={j}>
                                          <div className="cf-cell-beh">{c.behaviour}</div>
                                          <div className="cf-cell-emo"><span className="cf-dot" style={{ background: intensityColor(c.intensity) }} /> {c.emotion}</div>
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Section 3 — MoT Consolidation */}
                          <div className="cf-section">
                            <div className="cf-h">03 · Moments of Truth Consolidation</div>
                            <div className="cf-mot-grid">
                              {cf.motConsolidation.map((cl, i) => (
                                <div key={i} className="cf-mot-cluster" style={{ borderTopColor: clusterColor[cl.cluster] }}>
                                  <div className="cf-mot-clustertitle" style={{ color: clusterColor[cl.cluster] }}>{cl.cluster}</div>
                                  {cl.common.length > 0 && <div className="cf-mot-sub">Common (high priority)</div>}
                                  {cl.common.map((m, j) => <div key={j} className="cf-mot-item common">{m.name} <span className="cf-mot-count">×{m.personas.length}</span></div>)}
                                  {cl.specific.length > 0 && <div className="cf-mot-sub">Persona-specific</div>}
                                  {cl.specific.map((m, j) => <div key={j} className="cf-mot-item">{m.name} <span className="cf-mot-who">{m.personas[0]}</span></div>)}
                                  {cl.common.length === 0 && cl.specific.length === 0 && <div className="jmap-muted" style={{ fontSize: 11 }}>None</div>}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Section 4 — Experience Design Priorities */}
                          <div className="cf-section">
                            <div className="cf-h">04 · Experience Design Priorities</div>
                            <div className="cf-prio-list">
                              {cf.priorities.map((p, i) => (
                                <div key={i} className="cf-prio">
                                  <span className="cf-prio-num">{i + 1}</span>
                                  <div><div className="cf-prio-title">{p.priority}</div><div className="cf-prio-rationale">{p.rationale} <span className="cf-prio-src">{p.source}</span></div></div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Section 5 — KPI Consolidation */}
                          <div className="cf-section">
                            <div className="cf-h">05 · KPI Consolidation Layer</div>
                            <div className="cf-kpi-cols">
                              <div className="cf-kpi-col">
                                <div className="cf-kpi-coltitle">Universal KPIs <span className="cf-kpi-note">(all personas)</span></div>
                                {cf.universalKpis.length ? cf.universalKpis.map((k, i) => <div key={i} className="cf-kpi-row"><span>{k.name}</span><span className="cf-kpi-target">{k.target}</span></div>) : <div className="jmap-muted" style={{ fontSize: 11 }}>—</div>}
                              </div>
                              <div className="cf-kpi-col">
                                <div className="cf-kpi-coltitle">Persona-Specific KPIs</div>
                                {cf.specificKpis.length ? cf.specificKpis.map((k, i) => <div key={i} className="cf-kpi-row"><span>{k.name}</span><span className="cf-kpi-who">{k.personas.join(", ")}</span></div>) : <div className="jmap-muted" style={{ fontSize: 11 }}>—</div>}
                              </div>
                            </div>
                          </div>

                          {/* Section 6 — Design Tensions */}
                          <div className="cf-section">
                            <div className="cf-h">06 · Design Tensions</div>
                            <div className="cf-tension-grid">
                              {cf.tensions.map((t, i) => (
                                <div key={i} className="cf-tension">
                                  <div className="cf-tension-title">⚖ {t.tension}</div>
                                  <div className="cf-tension-detail">{t.detail}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                );
              })()}
            </div>

          </main>
        </div>
        {current < 8 && (
          <div className="vx-nav">
            <div className="vx-nav-left">
              <span className="vx-step-counter">
                Step <strong>{current + 1}</strong> / 9
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="vx-btn vx-btn-ghost"
                onClick={goBack}
                disabled={current === 0}
              >
                ← Back
              </button>
              <button
                className="vx-btn vx-btn-primary"
                onClick={goNext}
                disabled={current === 8}
              >
                {current === 7 ? "Proceed to Review →" : "Next →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
