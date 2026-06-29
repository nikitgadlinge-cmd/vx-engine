// ─────────────────────────────────────────────────────────────────────────
// sampleData.js — FREE / OFFLINE, SECTOR-AWARE content for the VX Engine.
//
// Each of the four sector types (theme-parks, cultural-heritage, sports-venues,
// live-events) has its OWN distinct personas, journey touchpoints, moments of
// truth, KPIs and benchmarks — so a museum, a concert, a theme park and a
// stadium produce genuinely different, sector-specific output (not a generic
// template with labels swapped). Stage 1 also folds in the user's own
// selections (theme, tones, tiers, motivations).
// ─────────────────────────────────────────────────────────────────────────

const titleCase = (s) =>
  (s || "").toString().replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();

// Map any sector id/label to one of the four library keys (fallback: cultural).
function resolveSector(sectorId, sectorLabel) {
  const k = `${sectorId || ""} ${sectorLabel || ""}`.toLowerCase();
  if (/theme|attraction|water park|adventure|family entertainment|dark ride|immersive/.test(k)) return "theme-parks";
  if (/sport|stadium|stadia|arena|cricket|motorsport|athletic|football|soccer/.test(k)) return "sports-venues";
  if (/live|festival|concert|esports|touring|food & drink|activation|event/.test(k)) return "live-events";
  return "cultural-heritage";
}

// ════════════════════════════════════════════════════════════════════════
// SECTOR LIBRARIES
// Each library defines: friction zones, personas (long list), journey
// touchpoint sets per stage, moments of truth and KPIs, plus benchmark content.
// ════════════════════════════════════════════════════════════════════════

const SECTORS = {
  // ───────────────────────────── THEME PARKS ─────────────────────────────
  "theme-parks": {
    label: "Theme Parks & Attractions",
    frictionZones: [
      { zone: "Ride Queues", description: "Long waits at headline rides erode the day's mood and reduce ride count.", severity: "High", recommendation: "Deploy virtual queueing and live wait-time displays." },
      { zone: "Midday Heat & Fatigue", description: "Energy and tempers dip in peak sun with young children.", severity: "High", recommendation: "Place shaded rest zones and water points along main paths." },
      { zone: "Height/Ride Restrictions", description: "Children turned away at the gate cause distress and complaints.", severity: "Medium", recommendation: "Publish ride heights pre-visit and at queue entry." },
    ],
    benchmarkArchetypes: [
      { title: "Virtual queueing", inst: "Leading global parks", takeaway: "Free guests from physical lines to spend and explore." },
      { title: "Themed land immersion", inst: "Top destination parks", takeaway: "Total theming sustains belief and dwell time." },
      { title: "Ride-photo + app capture", inst: "Major operators", takeaway: "Turn ride moments into shareable, sellable memories." },
    ],
    levers: [
      { name: "App-based virtual queue", mechanic: "Reserve ride slots from a phone.", impact: "+1–2 extra rides/guest, higher satisfaction." },
      { name: "Character meet scheduling", mechanic: "Timed, bookable character encounters.", impact: "Reduces crowding and disappointment." },
      { name: "Single-rider lanes", mechanic: "Fill odd seats fast.", impact: "Higher throughput at headline rides." },
    ],
    failures: [
      { mode: "Headline-ride breakdown", cause: "No proactive comms when a marquee ride goes down.", consequence: "Guests who came for that ride feel cheated.", mitigation: "Push real-time status + ride-swap offers to the app." },
      { mode: "Stroller/queue chaos", cause: "No stroller parking design at ride entrances.", consequence: "Bottlenecks and lost items.", mitigation: "Designated stroller bays + tags." },
    ],
    kpiNorms: [
      { name: "Rides per Guest", low: "4", avg: "7", high: "10+", unit: "rides", outcome: "Guest satisfaction" },
      { name: "Avg Queue Wait", low: "10 min", avg: "30 min", high: "60+ min", unit: "minutes", outcome: "Satisfaction" },
      { name: "In-park Spend / Guest", low: "low", avg: "moderate", high: "high", unit: "currency", outcome: "Revenue" },
    ],
    personas: [
      { id: "P-01", name: "Thrill Seeker", archetype: "Adrenaline Maximiser", tier: "B2C — Regular Visitor", segment: "Teen / young adult", motivation: "Ride every major coaster, beat the queues.", secondary_motivation: "Bragging rights and social clips.", strategic_value: "High app engagement and repeat visits.", description: "Plans the day around headline rides and shortest waits; lives in the park app.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Medium — intolerant of long waits and downtime.", constraint_flags: [], pod_flag: false, recommended_default: "include" },
      { id: "P-02", name: "Family Day-Out Organiser", archetype: "Time & Budget Juggler", tier: "B2C — Regular Visitor", segment: "Family with young kids", motivation: "A magical, smooth day everyone enjoys.", secondary_motivation: "Value for a big-ticket spend.", strategic_value: "Highest F&B and retail spend.", description: "Manages naps, snacks, heights and meltdowns; judges the day by the kids' joy.", journey_complexity: "High", recommended_inclusion: "Recommended", risk_profile: "High — sensitive to heat, queues and ride restrictions.", constraint_flags: ["Stroller routing", "Height restrictions"], pod_flag: false, recommended_default: "include" },
      { id: "P-03", name: "Accessibility-First Guest", archetype: "POD Companion", tier: "POD", segment: "Guest with disability + carer", motivation: "Enjoy rides and shows without barriers.", secondary_motivation: "Independence and dignity.", strategic_value: "Inclusion is essential and reputationally vital.", description: "Needs accessible ride boarding, rest points and clear ride-access info.", journey_complexity: "Very High", recommended_inclusion: "Recommended", risk_profile: "High — boarding/transfer failures have big impact.", constraint_flags: ["Accessible ride boarding", "Rest dependency", "Sensory load"], pod_flag: true, recommended_default: "include" },
      { id: "P-04", name: "Premium Fast-Track Guest", archetype: "Hosted VIP", tier: "VIP", segment: "Premium ticket holder", motivation: "Skip lines, do more, feel looked after.", secondary_motivation: "Exclusivity.", strategic_value: "High-margin upsell.", description: "Bought the premium pass and expects fast-track to deliver.", journey_complexity: "Medium", recommended_inclusion: "Secondary", risk_profile: "Medium — high expectations of the premium promise.", constraint_flags: ["Premium SLA"], pod_flag: false, recommended_default: "secondary" },
      { id: "P-05", name: "Annual Passholder", archetype: "Loyal Local", tier: "B2C — Regular Visitor", segment: "Repeat local visitor", motivation: "Short, frequent visits for favourites + new things.", secondary_motivation: "Feeling like an insider.", strategic_value: "Stable recurring revenue and advocacy.", description: "Knows the park well; comes for a few hours, values novelty and perks.", journey_complexity: "Low", recommended_inclusion: "Recommended", risk_profile: "Low — forgiving but expects passholder perks.", constraint_flags: [], pod_flag: false, recommended_default: "include" },
    ],
    touchpoints: {
      pre_visit: [["Discovery", "Digital", "anticipation"], ["Planning", "Digital", "strategising rides"], ["Ticket / Pass Purchase", "Digital", "commitment"], ["Anticipation", "Digital", "excitement"]],
      arrival: [["Transport & Parking", "Physical", "logistics"], ["Bag Check / Security", "Human", "compliance"], ["Gate Entry / Scan", "Hybrid", "the threshold thrill"], ["Park Orientation", "Hybrid", "planning the assault"]],
      core_experience: [["Headline Ride", "Physical", "exhilaration"], ["Virtual Queue / Wait", "Digital", "impatience"], ["Character Meet / Show", "Human", "delight"], ["F&B / Snack Stop", "Physical", "refuelling"], ["Retail / Souvenirs", "Physical", "memory-making"], ["Rest & Shade", "Physical", "relief"]],
      exit_departure: [["Last Ride / Show", "Physical", "final thrill"], ["Photo / Memory Pickup", "Hybrid", "reliving"], ["Exit Retail", "Physical", "one more treat"], ["Departure & Transport", "Physical", "tired but happy"]],
      post_visit: [["Ride Photos / App", "Digital", "sharing"], ["Review / Feedback", "Digital", "reflective"], ["Pass / Offer Re-engagement", "Digital", "tempted back"], ["Revisit Intent", "Digital", "planning next time"]],
    },
    moments: [
      { name: "First headline ride", stage: "Core Experience", tp: "Headline Ride", reason: "High emotional peak + the reason many came", impact: "Defines whether the day feels 'worth it'.", risk: "Long wait or breakdown turns the highlight into the low point.", rec: "Protect headline-ride uptime; offer virtual queue + ride-swap.", owner: "Operations / Rides" },
      { name: "Accessible ride boarding", stage: "Core Experience", tp: "Headline Ride", reason: "Accessibility dependency + high consequence", impact: "Determines whether POD guests can share the main attraction.", risk: "A failed or undignified transfer excludes the guest entirely.", rec: "Trained boarding team + pre-published ride-access guide.", owner: "Accessibility / Rides" },
      { name: "The gate moment", stage: "Arrival", tp: "Gate Entry / Scan", reason: "First interaction + high anticipation", impact: "Sets the magic-or-stress tone for the whole day.", risk: "Slow scanning or upsell pressure deflates arrival excitement.", rec: "Fast frictionless scan + a welcoming visual reveal.", owner: "Operations / Guest Services" },
    ],
    kpis: [
      { name: "Rides Per Guest", tier: "Executive", def: "Average number of rides each guest completes.", formula: "Σ ride-boardings / guests", freq: "Daily", target: "≥ 7", owner: "Director of Operations", source: "Ride access data", leading: "Avg queue wait", lagging: "Guest satisfaction", tl: "Amber" },
      { name: "Avg Queue Wait", tier: "Management", def: "Mean posted wait at headline rides.", formula: "Σ posted waits / sample count", freq: "Hourly", target: "≤ 30 min", owner: "Operations Manager", source: "Queue sensors", leading: "Virtual-queue uptake", lagging: "Rides per guest", tl: "Amber" },
      { name: "Accessible Boarding Success", tier: "Operational", def: "Share of POD ride requests boarded without escalation.", formula: "(Smooth boardings / requests) × 100", freq: "Daily", target: "≥ 97%", owner: "Accessibility Lead", source: "Ride team log", leading: "Boarding-team staffing", lagging: "POD satisfaction", tl: "Green" },
    ],
  },

  // ───────────────────────── CULTURAL & HERITAGE ─────────────────────────
  "cultural-heritage": {
    label: "Cultural & Heritage Venues",
    frictionZones: [
      { zone: "Arrival & Entry", description: "Queue build-up and unclear first direction during peak slots.", severity: "High", recommendation: "Timed entry + a greeter at the threshold." },
      { zone: "Mid-visit Fatigue", description: "Energy dips without rest or refreshment prompts.", severity: "Medium", recommendation: "Place rest + F&B at the natural halfway point." },
      { zone: "Accessibility Routing", description: "Step-free path not obvious, causing anxiety for POD visitors.", severity: "High", recommendation: "Mark accessible routes physically and digitally." },
    ],
    benchmarkArchetypes: [
      { title: "Timed-entry flow management", inst: "Louvre (illustrative)", takeaway: "Cap concurrency to protect dwell quality at flagship works.", strategic_value: "Satisfaction & throughput" },
      { title: "Narrative-led wayfinding", inst: "Tate (illustrative)", takeaway: "Wayfinding is part of the story, not separate from it.", strategic_value: "Engagement" },
      { title: "Bilingual / multilingual interpretation", inst: "Louvre Abu Dhabi (illustrative)", takeaway: "Dual-language interpretation widens engagement for non-native visitors.", strategic_value: "Inclusion & reach" },
      { title: "Layered digital interpretation", inst: "Smithsonian (illustrative)", takeaway: "Offer a quick label plus an optional deep-dive for varied depth-appetites.", strategic_value: "Engagement depth" },
      { title: "Published accessibility maps", inst: "Smithsonian (illustrative)", takeaway: "Detailed pre-visit access info converts anxious POD visitors into confident ones.", strategic_value: "Accessibility" },
      { title: "Site-wide People-of-Determination programme", inst: "Expo 2020 Dubai (illustrative)", takeaway: "Design accessibility in at site scale, not as a retrofit.", strategic_value: "Accessibility" },
      { title: "Family trails & hands-on galleries", inst: "Science Museum Group (illustrative)", takeaway: "Purposeful child activity sustains the whole family's visit.", strategic_value: "Family engagement" },
      { title: "Study rooms & scholarly access", inst: "British Museum (illustrative)", takeaway: "Specialist access deepens loyalty among researchers.", strategic_value: "Depth & loyalty" },
      { title: "Shareable signature moments", inst: "Museum of the Future, Dubai (illustrative)", takeaway: "Designed photogenic moments drive organic social reach.", strategic_value: "Advocacy / reach" },
      { title: "Contactless international payment", inst: "Expo 2020 Dubai (illustrative)", takeaway: "Frictionless payment for foreign cards lifts conversion and spend.", strategic_value: "Revenue" },
      { title: "Off-peak / quiet hours", inst: "National Trust (illustrative)", takeaway: "Calm slots serve seniors and sensory-sensitive visitors, smoothing demand.", strategic_value: "Comfort & demand smoothing" },
      { title: "Patron & after-hours hosting", inst: "British Museum (illustrative)", takeaway: "Curated private access monetises VIP/VVIP relationships.", strategic_value: "Premium revenue" },
    ],
    levers: [
      { name: "Bilingual interpretation", mechanic: "Dual-language labels and interactives.", impact: "+15–20% engagement among non-native speakers." },
      { name: "Step-free hero route", mechanic: "A signposted accessible main route for all.", impact: "Higher POD completion; benefits everyone." },
      { name: "Pre-visit anticipation content", mechanic: "App/email priming before arrival.", impact: "Lower arrival anxiety, higher satisfaction." },
    ],
    failures: [
      { mode: "Arrival bottleneck", cause: "No concurrency control at entry.", consequence: "A poor first impression colours the whole visit.", mitigation: "Timed entry + greeter.", stage: "Arrival", persona_sensitivity: "All — acute for Family (P-10), Senior (P-14), POD (P-18)" },
      { mode: "Accessibility afterthought", cause: "Step-free route added late, not designed in.", consequence: "POD visitors feel excluded.", mitigation: "Design the hero route step-free from the start.", stage: "Core Experience", persona_sensitivity: "Critical for POD-Mobility (P-18); affects Senior (P-14), Family (P-10)" },
      { mode: "Out-of-service lift, no live status", cause: "No real-time lift/route status surfaced to visitors.", consequence: "Accessible route dead-ends mid-visit; trust collapses.", mitigation: "Live lift/route status in app + signage.", stage: "Core Experience", persona_sensitivity: "Critical for POD-Mobility (P-18)" },
      { mode: "Language-only signage", cause: "Critical wayfinding in local language only.", consequence: "International visitors miss highlights and feel lost.", mitigation: "Multilingual + pictographic wayfinding.", stage: "Arrival / Core", persona_sensitivity: "Critical for International Tourist (P-12)" },
      { mode: "Photography ban", cause: "Blanket no-photo policy.", consequence: "Removes the core reason social visitors came; kills advocacy.", mitigation: "Allow no-flash photography in designated zones.", stage: "Core Experience", persona_sensitivity: "Critical for Young Adult/Social (P-16); affects Tourist (P-12)" },
      { mode: "Connectivity dead zones", cause: "No public Wi-Fi / weak signal in galleries.", consequence: "Blocks real-time sharing, translation and app wayfinding.", mitigation: "Venue-wide Wi-Fi with captive simplicity.", stage: "Core Experience", persona_sensitivity: "High for P-16, P-12, P-18 (live routing)" },
      { mode: "Seating scarcity", cause: "Too few rest points along the route.", consequence: "Fatigue forces an early exit, cutting dwell and spend.", mitigation: "Rest-point density audit; seats at every key gallery.", stage: "Core Experience", persona_sensitivity: "Critical for Senior (P-14); affects POD (P-18), Family (P-10)" },
      { mode: "Shallow interpretation only", cause: "No scholarly/deep layer behind labels.", consequence: "Researchers and deep-learners leave unsatisfied.", mitigation: "Layered interpretation with optional depth + specialist contact.", stage: "Core Experience", persona_sensitivity: "Critical for Deep Learning Seeker (P-09)" },
      { mode: "Mid-visit fatigue, no recovery", cause: "No F&B/rest at the natural halfway point.", consequence: "Energy crashes; second half of visit collapses.", mitigation: "Place rest + F&B at the journey midpoint.", stage: "Core Experience", persona_sensitivity: "High for Family (P-10), Senior (P-14)" },
      { mode: "Foreign-payment friction", cause: "POS not configured for international cards/wallets.", consequence: "Lost spend and a frustrating transactional moment.", mitigation: "Contactless + major international wallets at all POS.", stage: "Core / Exit", persona_sensitivity: "High for International Tourist (P-12)" },
      { mode: "VIP queue exposure", cause: "Premium guests routed through public queues.", consequence: "Signals their time isn't valued; service-failure perception.", mitigation: "Discreet fast-track + escorted routing.", stage: "Arrival", persona_sensitivity: "Critical for C-Suite (P-03), VVIP (Head of State)" },
      { mode: "Protocol / security lapse", cause: "Uncoordinated security or unbriefed staff for dignitary visits.", consequence: "Diplomatic and reputational damage.", mitigation: "Pre-cleared protocol plan + dedicated liaison.", stage: "All", persona_sensitivity: "Critical for VVIP — Head of State" },
      { mode: "Transactional farewell", cause: "Visit ends abruptly at retail/exit.", consequence: "A warm visit closes flat, lowering recommendation.", mitigation: "Design a deliberate closing moment before retail.", stage: "Exit & Departure", persona_sensitivity: "All — affects advocacy across personas" },
      { mode: "Group flow collision", cause: "Large groups uncontrolled through narrow galleries.", consequence: "Noise and congestion degrade everyone's visit.", mitigation: "Timed group slots + managed routing.", stage: "Core Experience", persona_sensitivity: "Affects all; acute for Curious Explorer (P-01), Senior (P-14)" },
      { mode: "Pre-visit info gap", cause: "Accessibility/facilities info missing or vague online.", consequence: "Anxious personas don't visit, or arrive under-prepared.", mitigation: "Complete, accurate pre-visit access + facilities pages.", stage: "Pre-Visit", persona_sensitivity: "Critical for POD (P-18); high for Family (P-10), Senior (P-14)" },
    ],
    kpiNorms: [
      { name: "Average Dwell Time", low: "75 min", avg: "120 min", high: "165 min", unit: "minutes", outcome: "Engagement" },
      { name: "Net Promoter Score", low: "30", avg: "45", high: "65", unit: "score", outcome: "Satisfaction" },
      { name: "Secondary Spend / Visitor", low: "AED 35", avg: "AED 70", high: "AED 120", unit: "AED", outcome: "Revenue" },
      { name: "Accessible Task Completion", low: "85%", avg: "93%", high: "98%", unit: "%", outcome: "Accessibility" },
    ],
    personas: [
      { id: "P-01", name: "Curious Explorer", archetype: "Independent Discoverer", tier: "B2C — Regular Visitor", segment: "Adult / couple", motivation: "Deep, self-paced discovery and learning.", secondary_motivation: "Sharing highlights socially.", strategic_value: "High lifetime value and strong advocacy.", description: "Wants to explore at their own pace and go deep on what interests them.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Low — flexible and forgiving.", constraint_flags: [], pod_flag: false, recommended_default: "include" },
      { id: "P-09", name: "Deep Learning Seeker", archetype: "Scholar / Specialist", tier: "B2C — Researcher", segment: "Academic / enthusiast", motivation: "Scholarly-depth study of specific objects and sources.", secondary_motivation: "Access to curators and primary material.", strategic_value: "High repeat and specialist advocacy.", description: "Purposeful researcher who needs depth, quiet and specialist access.", journey_complexity: "High", recommended_inclusion: "Recommended", risk_profile: "Medium — disappointed by shallow interpretation.", constraint_flags: ["Depth dependency", "Quiet conditions"], pod_flag: false, recommended_default: "include" },
      { id: "P-10", name: "Family Learning Organiser", archetype: "Time-pressured Planner", tier: "B2C — Regular Visitor", segment: "Family with young children", motivation: "An enjoyable day with educational value.", secondary_motivation: "Keeping children engaged.", strategic_value: "Strong F&B and retail spend; repeat potential.", description: "Coordinates the group and judges success by whether children stayed curious.", journey_complexity: "High", recommended_inclusion: "Recommended", risk_profile: "Medium — sensitive to fatigue and boredom.", constraint_flags: ["Pushchair routing", "Facilities timing"], pod_flag: false, recommended_default: "include" },
      { id: "P-12", name: "International Tourist", archetype: "First-time Non-native Speaker", tier: "B2C — Regular Visitor", segment: "Overseas visitor", motivation: "Understand and enjoy the icons despite a language gap.", secondary_motivation: "Iconic, shareable moments.", strategic_value: "Drives international reputation and reviews.", description: "Relies on visual cues and translation; small language frictions compound.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Medium — language-dependent.", constraint_flags: ["Language support", "Payment / connectivity"], pod_flag: false, recommended_default: "include" },
      { id: "P-14", name: "Senior Visitor", archetype: "Comfort-led Visitor", tier: "B2C — Regular Visitor", segment: "Older adult", motivation: "A calm, comfortable, meaningful visit at an unhurried pace.", secondary_motivation: "Nostalgia and connection.", strategic_value: "Loyal off-peak footfall and community advocacy.", description: "Values seating, legible signage and calm pacing away from peak crowds.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Medium — fatigue and crowding cut visits short.", constraint_flags: ["Seating density", "Legible signage"], pod_flag: false, recommended_default: "include" },
      { id: "P-16", name: "Young Adult / Social Group", archetype: "Social Sharer", tier: "B2C — Regular Visitor", segment: "Young adult group", motivation: "Share-worthy, social, contemporary moments.", secondary_motivation: "A fun group outing.", strategic_value: "Very high organic reach; volume + impulse spend.", description: "Phone-first, social-led; the visit's value is partly realised in the sharing.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Medium — photography bans or dead Wi-Fi are dealbreakers.", constraint_flags: ["Photography policy", "Connectivity"], pod_flag: false, recommended_default: "include" },
      { id: "P-18", name: "POD — Mobility", archetype: "Accessibility-First Visitor", tier: "POD", segment: "Person of determination (mobility) + companion", motivation: "A dignified, dependable, barrier-free visit.", secondary_motivation: "Independence wherever possible.", strategic_value: "Inclusion is reputationally and ethically essential.", description: "Needs a true step-free hero route, reliable lifts/toilets and trained assistance.", journey_complexity: "Very High", recommended_inclusion: "Recommended", risk_profile: "High — a single barrier collapses the visit.", constraint_flags: ["Step-free routing", "Lift reliability", "Accessible toilets"], pod_flag: true, recommended_default: "include" },
      { id: "P-03", name: "Corporate C-Suite", archetype: "Hosted Executive", tier: "VIP", segment: "Corporate / patron", motivation: "Time-efficient, hosted, curated access.", secondary_motivation: "Status, relationship and discretion.", strategic_value: "Very high hospitality and partnership revenue.", description: "Expects effortless, escorted, curated access with discreet briefed staff.", journey_complexity: "High", recommended_inclusion: "Recommended", risk_profile: "Medium — any friction reads as a service failure.", constraint_flags: ["Hosting SLA", "Privacy"], pod_flag: false, recommended_default: "include" },
      { id: "P-01-VVIP", name: "VVIP — Head of State", archetype: "Protocol-led Dignitary", tier: "VVIP", segment: "Head of state + delegation", motivation: "A flawless, secure, protocol-perfect private visit.", secondary_motivation: "Cultural diplomacy and legacy.", strategic_value: "Reputational and diplomatic significance beyond revenue.", description: "Requires bespoke protocol, private routing, security coordination and a dedicated liaison.", journey_complexity: "Very High", recommended_inclusion: "Secondary", risk_profile: "Critical — zero tolerance for protocol or security lapses.", constraint_flags: ["Protocol", "Security clearance", "Private routing", "Privacy"], pod_flag: false, recommended_default: "secondary" },
    ],
    touchpoints: {
      pre_visit: [["Discovery", "Digital", "curiosity"], ["Planning", "Digital", "anticipation"], ["Booking", "Digital", "reassurance"], ["Anticipation", "Digital", "excitement"]],
      arrival: [["Transport", "Physical", "transition"], ["Parking", "Physical", "practical focus"], ["Security", "Human", "compliance"], ["Access Control", "Hybrid", "arrival"], ["Orientation", "Hybrid", "getting bearings"]],
      core_experience: [["Gallery Engagement", "Physical", "absorption"], ["Staff / Docent Interaction", "Human", "supported"], ["Digital Interpretation", "Digital", "engaged"], ["Retail", "Physical", "considering"], ["F&B / Café", "Physical", "recharging"], ["Rest & Recovery", "Physical", "relief"]],
      exit_departure: [["Departure", "Physical", "winding down"], ["Final Impression", "Hybrid", "reflection"], ["Last Purchase", "Physical", "gifting"], ["Farewell", "Human", "warmth"]],
      post_visit: [["Feedback", "Digital", "reflective"], ["Advocacy", "Digital", "enthusiastic"], ["Membership / Loyalty", "Digital", "valued"], ["Revisit", "Digital", "intent"]],
    },
    moments: [
      { name: "The first 90 seconds", stage: "Arrival", tp: "Access Control / Orientation", reason: "First interaction + high emotional intensity", impact: "Sets the emotional tone for the whole visit.", risk: "Confusion at entry lowers confidence and satisfaction.", rec: "Greeter + clear orientation cue at the threshold.", owner: "Operations / Visitor Services" },
      { name: "Step-free routing clarity", stage: "Core Experience", tp: "Gallery Engagement", reason: "Accessibility dependency + known friction", impact: "Determines whether POD visitors explore freely.", risk: "An unmarked step-free route causes anxiety and exclusion.", rec: "Signpost the accessible hero route physically and in-app.", owner: "Accessibility Lead" },
      { name: "The farewell", stage: "Exit & Departure", tp: "Final Impression / Farewell", reason: "Last interaction + high emotional intensity", impact: "Shapes the memory and recommendation likelihood.", risk: "A purely transactional exit undercuts a warm visit.", rec: "Design a genuine closing moment before retail/exit.", owner: "Experience / Visitor Services" },
    ],
    kpis: [
      { name: "Visitor Satisfaction (CSAT)", tier: "Executive", def: "Share rating their visit satisfied or very satisfied.", formula: "(Satisfied / total) × 100", freq: "Monthly", target: "≥ 85%", owner: "Head of Experience", source: "Post-visit survey", leading: "Arrival wait time", lagging: "Net Promoter Score", tl: "Green" },
      { name: "Average Dwell Time", tier: "Management", def: "Average minutes a visitor spends on site.", formula: "Σ time on site / visitors", freq: "Weekly", target: "90–140 min", owner: "Operations Manager", source: "Entry/exit data", leading: "Midpoint rest usage", lagging: "Secondary spend", tl: "Amber" },
      { name: "Accessible Task Completion", tier: "Operational", def: "Share of POD visitors completing the route unassisted.", formula: "(Unassisted completions / POD visits) × 100", freq: "Monthly", target: "≥ 95%", owner: "Accessibility Lead", source: "Staff log + POD feedback", leading: "Signage audits", lagging: "POD satisfaction", tl: "Green" },
    ],
  },

  // ─────────────────────────── SPORTS VENUES ─────────────────────────────
  "sports-venues": {
    label: "Sports Venues & Stadia",
    frictionZones: [
      { zone: "Ingress Surge", description: "Tens of thousands arriving in a 30-minute pre-match window.", severity: "High", recommendation: "Staggered gates, mobile-ticket lanes and live crowd comms." },
      { zone: "Half-time Concourse Crush", description: "Simultaneous rush to F&B and toilets overwhelms concourses.", severity: "High", recommendation: "Pre-order collection points and queue-busting vendors." },
      { zone: "Egress Bottleneck", description: "Mass exit creates dangerous and frustrating crowding.", severity: "High", recommendation: "Phased egress messaging and clear marshalled routes." },
    ],
    benchmarkArchetypes: [
      { title: "Mobile-ticket fast ingress", inst: "Modern stadia", takeaway: "Phones-as-tickets cut the pre-match bottleneck." },
      { title: "In-seat / pre-order F&B", inst: "Premium arenas", takeaway: "Beat the half-time concourse crush, lift spend." },
      { title: "Atmosphere choreography", inst: "Elite clubs", takeaway: "Lights, sound and crowd cues amplify the live moment." },
    ],
    levers: [
      { name: "Mobile ticketing + fast lanes", mechanic: "Phone scan at turnstile.", impact: "Faster ingress, lower queue stress." },
      { name: "Pre-order / in-seat F&B", mechanic: "Order from seat, collect or deliver.", impact: "Higher spend, smaller concourse crush." },
      { name: "Phased egress comms", mechanic: "Big-screen + app exit guidance.", impact: "Safer, calmer departure." },
    ],
    failures: [
      { mode: "Turnstile gridlock", cause: "Too few mobile-ready lanes at peak ingress.", consequence: "Fans miss kickoff; safety risk.", mitigation: "Scale mobile lanes; open gates earlier." },
      { mode: "Egress crush", cause: "Unmanaged simultaneous exit.", consequence: "Serious crowd-safety hazard.", mitigation: "Phased, marshalled egress plan." },
    ],
    kpiNorms: [
      { name: "Ingress Time (gate to seat)", low: "5 min", avg: "15 min", high: "30+ min", unit: "minutes", outcome: "Safety & satisfaction" },
      { name: "F&B Spend / Attendee", low: "low", avg: "moderate", high: "high", unit: "currency", outcome: "Revenue" },
      { name: "Safety Incidents / Event", low: "0", avg: "few", high: "several", unit: "count", outcome: "Safety" },
    ],
    personas: [
      { id: "P-01", name: "Die-hard Season-Ticket Fan", archetype: "Ritual Loyalist", tier: "B2C — Regular Visitor", segment: "Committed supporter", motivation: "The ritual, the atmosphere, never miss a beat.", secondary_motivation: "Belonging to the crowd.", strategic_value: "Guaranteed recurring revenue and loud advocacy.", description: "Knows the routine, arrives early, lives for the live atmosphere.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Medium — fiercely intolerant of ingress/egress chaos.", constraint_flags: [], pod_flag: false, recommended_default: "include" },
      { id: "P-02", name: "Corporate Hospitality Guest", archetype: "Premium Host & Client", tier: "VIP", segment: "Box / hospitality", motivation: "Impress clients with a seamless premium day.", secondary_motivation: "Network and be looked after.", strategic_value: "Highest per-head revenue.", description: "In a suite for the occasion as much as the sport; expects flawless service.", journey_complexity: "High", recommended_inclusion: "Recommended", risk_profile: "Medium — premium promise must hold.", constraint_flags: ["Hospitality SLA"], pod_flag: false, recommended_default: "include" },
      { id: "P-03", name: "Accessibility-First Supporter", archetype: "POD Fan", tier: "POD", segment: "Supporter with disability + companion", motivation: "Experience the match safely with a clear sightline.", secondary_motivation: "Independence in a huge crowd.", strategic_value: "Inclusion is legally and reputationally essential.", description: "Needs accessible seating, step-free routes and managed ingress/egress.", journey_complexity: "Very High", recommended_inclusion: "Recommended", risk_profile: "High — crowd surges are dangerous and exclusionary.", constraint_flags: ["Accessible seating", "Step-free routing", "Crowd safety"], pod_flag: true, recommended_default: "include" },
      { id: "P-04", name: "Casual / First-time Attendee", archetype: "Occasion Spectator", tier: "B2C — Regular Visitor", segment: "Family / casual group", motivation: "A fun, easy big-event day.", secondary_motivation: "The spectacle and the food.", strategic_value: "Conversion to repeat attendance.", description: "Doesn't know the venue; relies entirely on signage and staff.", journey_complexity: "High", recommended_inclusion: "Recommended", risk_profile: "Medium — easily lost or overwhelmed.", constraint_flags: ["Wayfinding dependency"], pod_flag: false, recommended_default: "include" },
      { id: "P-05", name: "Away / Travelling Supporter", archetype: "Visiting Fan", tier: "B2C — Regular Visitor", segment: "Out-of-town supporter", motivation: "Get in, support the team, get out safely.", secondary_motivation: "Avoid friction in unfamiliar territory.", strategic_value: "Affects safety operations and reputation.", description: "Unfamiliar with the venue, often segregated, needs clear managed routes.", journey_complexity: "High", recommended_inclusion: "Secondary", risk_profile: "High — segregation and egress are safety-critical.", constraint_flags: ["Segregation routing", "Crowd safety"], pod_flag: false, recommended_default: "secondary" },
    ],
    touchpoints: {
      pre_visit: [["Fixture Discovery", "Digital", "anticipation"], ["Ticket Purchase", "Digital", "securing the seat"], ["Travel Planning", "Digital", "logistics"], ["Matchday Build-up", "Digital", "mounting excitement"]],
      arrival: [["Transport & Approach", "Physical", "the buzz building"], ["Security / Bag Search", "Human", "compliance"], ["Turnstile / Mobile Scan", "Hybrid", "ingress tension"], ["Concourse Orientation", "Hybrid", "finding the block"]],
      core_experience: [["Finding the Seat", "Physical", "settling in"], ["The Live Action", "Physical", "collective euphoria"], ["Half-time F&B", "Physical", "rushed refuel"], ["Toilets / Concourse", "Physical", "queue frustration"], ["Atmosphere / Big Screen", "Hybrid", "belonging"], ["Merchandise", "Physical", "tribal pride"]],
      exit_departure: [["Final Whistle", "Physical", "elation or dejection"], ["Phased Egress", "Human", "managed exit"], ["Concourse Exit Retail", "Physical", "last buy"], ["Transport Departure", "Physical", "getting home"]],
      post_visit: [["Highlights / Replays", "Digital", "reliving"], ["Feedback", "Digital", "reflective"], ["Renewal / Next Fixture", "Digital", "re-committing"], ["Revisit Intent", "Digital", "already booking"]],
    },
    moments: [
      { name: "Ingress at the turnstile", stage: "Arrival", tp: "Turnstile / Mobile Scan", reason: "First interaction + crowd-safety + benchmark sensitivity", impact: "Determines whether fans make kickoff calmly or in a crush.", risk: "Mobile-lane gridlock causes missed kickoff and safety risk.", rec: "Scale mobile lanes, open gates early, live queue comms.", owner: "Safety / Operations" },
      { name: "Accessible matchday journey", stage: "Core Experience", tp: "Finding the Seat", reason: "Accessibility dependency + crowd-safety", impact: "Whether POD fans can attend safely and see the match.", risk: "Surges and step access block or endanger POD fans.", rec: "Accessible ingress windows, step-free routes, sightline seats.", owner: "Accessibility / Safety" },
      { name: "Egress after the whistle", stage: "Exit & Departure", tp: "Phased Egress", reason: "Last interaction + crowd-safety", impact: "The lasting safety impression of the whole event.", risk: "Unmanaged mass exit creates a serious crush hazard.", rec: "Phased, marshalled egress with big-screen + app guidance.", owner: "Safety / Operations" },
    ],
    kpis: [
      { name: "Matchday Satisfaction", tier: "Executive", def: "Share of attendees rating the matchday experience highly.", formula: "(Top-box / total) × 100", freq: "Per fixture", target: "≥ 85%", owner: "Head of Matchday", source: "Post-event survey", leading: "Ingress time", lagging: "Renewal rate", tl: "Green" },
      { name: "Ingress Time", tier: "Management", def: "Average minutes from gate to seat at peak.", formula: "Σ gate-to-seat / sample", freq: "Per fixture", target: "≤ 15 min", owner: "Operations Manager", source: "Turnstile + survey", leading: "Mobile-lane share", lagging: "Matchday satisfaction", tl: "Amber" },
      { name: "Crowd-Safety Incidents", tier: "Operational", def: "Crowd-safety incidents per fixture (ingress/egress).", formula: "Count per event", freq: "Per fixture", target: "0", owner: "Safety Officer", source: "Incident log", leading: "Egress-plan rehearsal", lagging: "Regulatory standing", tl: "Green" },
    ],
  },

  // ─────────────────────────── LIVE EVENTS ───────────────────────────────
  "live-events": {
    label: "Live Events & Festivals",
    frictionZones: [
      { zone: "Box-office / Wristband Exchange", description: "Long queues to exchange tickets for wristbands at gates.", severity: "High", recommendation: "Pre-mailed wristbands and self-scan entry." },
      { zone: "Set-clash & Stage Travel", description: "Crowds surging between stages for clashing acts.", severity: "High", recommendation: "Stagger set times and publish live crowd-flow maps." },
      { zone: "Facilities & Welfare", description: "Toilets, water and welfare overwhelmed at peaks.", severity: "High", recommendation: "Scale welfare points and push hydration/safety comms." },
    ],
    benchmarkArchetypes: [
      { title: "Cashless RFID wristbands", inst: "Major festivals", takeaway: "Tap-to-pay speeds everything and lifts spend." },
      { title: "App-based set + map", inst: "Leading events", takeaway: "Personalised schedules reduce set-clash chaos." },
      { title: "Welfare-first design", inst: "Best-practice festivals", takeaway: "Visible welfare builds trust and safety." },
    ],
    levers: [
      { name: "RFID cashless wristbands", mechanic: "Tap to enter and pay.", impact: "Faster entry and vending, higher spend." },
      { name: "Personalised set planner", mechanic: "Build a schedule in the app.", impact: "Smoother crowd flow between stages." },
      { name: "Live crowd-density maps", mechanic: "Show stage/area density in-app.", impact: "Distributes crowds, improves safety." },
    ],
    failures: [
      { mode: "Entry-gate meltdown", cause: "Wristband exchange not pre-fulfilled.", consequence: "Hours-long entry queues; missed headline sets.", mitigation: "Pre-mail wristbands; self-scan lanes." },
      { mode: "Welfare overwhelm", cause: "Under-scaled water/welfare at peak heat.", consequence: "Health incidents and reputational damage.", mitigation: "Scale welfare; proactive hydration comms." },
    ],
    kpiNorms: [
      { name: "Entry Time (gate to site)", low: "10 min", avg: "30 min", high: "60+ min", unit: "minutes", outcome: "Satisfaction & safety" },
      { name: "Cashless Spend / Attendee", low: "low", avg: "moderate", high: "high", unit: "currency", outcome: "Revenue" },
      { name: "Welfare Incidents / Day", low: "few", avg: "moderate", high: "many", unit: "count", outcome: "Safety" },
    ],
    personas: [
      { id: "P-01", name: "Music-First Festival-Goer", archetype: "Lineup Chaser", tier: "B2C — Regular Visitor", segment: "Young adult group", motivation: "Catch every act on their must-see list.", secondary_motivation: "The shared festival vibe.", strategic_value: "High app engagement and cashless spend.", description: "Plans the day around set times; hates clashes and missing headliners.", journey_complexity: "High", recommended_inclusion: "Recommended", risk_profile: "Medium — set-clashes and entry delays ruin the plan.", constraint_flags: [], pod_flag: false, recommended_default: "include" },
      { id: "P-02", name: "Experience-Seeker", archetype: "Vibe & Discovery Wanderer", tier: "B2C — Regular Visitor", segment: "Couple / friends", motivation: "Soak up atmosphere, food and surprises.", secondary_motivation: "Shareable moments.", strategic_value: "High F&B and experiential spend.", description: "Less fixed on the lineup, there for the whole sensory experience.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Low — flexible and exploratory.", constraint_flags: [], pod_flag: false, recommended_default: "include" },
      { id: "P-03", name: "Accessibility-First Attendee", archetype: "POD Festival-Goer", tier: "POD", segment: "Attendee with disability + companion", motivation: "Enjoy the event safely on uneven, crowded ground.", secondary_motivation: "Independence and dignity.", strategic_value: "Inclusion is essential and reputationally vital.", description: "Needs accessible viewing platforms, step-free routes, accessible welfare.", journey_complexity: "Very High", recommended_inclusion: "Recommended", risk_profile: "High — terrain, crowds and welfare gaps exclude or endanger.", constraint_flags: ["Accessible viewing", "Terrain / step-free", "Accessible welfare"], pod_flag: true, recommended_default: "include" },
      { id: "P-04", name: "VIP / Hospitality Guest", archetype: "Premium Experience Buyer", tier: "VIP", segment: "VIP package holder", motivation: "Elevated viewing, fast bars, no hassle.", secondary_motivation: "Exclusivity and comfort.", strategic_value: "High-margin package revenue.", description: "Paid for the premium package and expects it to deliver on every promise.", journey_complexity: "Medium", recommended_inclusion: "Secondary", risk_profile: "Medium — premium promise must hold.", constraint_flags: ["VIP package SLA"], pod_flag: false, recommended_default: "secondary" },
      { id: "P-05", name: "Day-Tripper", archetype: "Single-Day Visitor", tier: "B2C — Regular Visitor", segment: "Local day ticket", motivation: "Maximise one day without camping.", secondary_motivation: "Easy in, easy out.", strategic_value: "Volume footfall and same-day spend.", description: "Arrives and leaves the same day; sensitive to entry/exit friction.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Medium — entry/egress and transport sensitive.", constraint_flags: ["Transport timing"], pod_flag: false, recommended_default: "include" },
    ],
    touchpoints: {
      pre_visit: [["Lineup Discovery", "Digital", "anticipation"], ["Ticket / Package Purchase", "Digital", "commitment"], ["Set Planning", "Digital", "strategising"], ["Travel & Pack Planning", "Digital", "logistics"]],
      arrival: [["Transport / Drop-off", "Physical", "the build-up"], ["Wristband Exchange / Scan", "Hybrid", "entry tension"], ["Security / Search", "Human", "compliance"], ["Site Orientation", "Hybrid", "mapping the day"]],
      core_experience: [["Headline Set", "Physical", "collective euphoria"], ["Stage-to-Stage Travel", "Physical", "rush / clash stress"], ["Cashless F&B / Bars", "Physical", "refuelling"], ["Welfare / Water / Toilets", "Physical", "relief or frustration"], ["Discovery / Side Stages", "Physical", "delightful surprise"], ["Merch", "Physical", "memory-making"]],
      exit_departure: [["Headliner Finale", "Physical", "peak moment"], ["Mass Egress", "Human", "managed exit"], ["Transport Departure", "Physical", "getting out"], ["Lost Property / Welfare", "Human", "safety net"]],
      post_visit: [["Photos / Clips", "Digital", "sharing"], ["Feedback", "Digital", "reflective"], ["Next-event Pre-sale", "Digital", "tempted back"], ["Revisit Intent", "Digital", "already planning"]],
    },
    moments: [
      { name: "Entry & wristband exchange", stage: "Arrival", tp: "Wristband Exchange / Scan", reason: "First interaction + benchmark sensitivity", impact: "Whether attendees enter buzzing or already exhausted and late.", risk: "Unfulfilled wristbands cause hours-long queues and missed sets.", rec: "Pre-mail wristbands; self-scan lanes; live queue comms.", owner: "Operations / Ticketing" },
      { name: "Accessible viewing & terrain", stage: "Core Experience", tp: "Headline Set", reason: "Accessibility dependency + crowd-safety", impact: "Whether POD attendees can safely see headline acts.", risk: "Uneven ground and crowd surges block or endanger them.", rec: "Accessible viewing platforms, step-free routes, accessible welfare.", owner: "Accessibility / Safety" },
      { name: "Welfare at peak", stage: "Core Experience", tp: "Welfare / Water / Toilets", reason: "Known friction + safety-critical", impact: "Directly affects attendee health and trust.", risk: "Under-scaled water/welfare at peak heat causes incidents.", rec: "Scale welfare points; push hydration and safety messaging.", owner: "Welfare / Safety" },
    ],
    kpis: [
      { name: "Attendee Satisfaction", tier: "Executive", def: "Share of attendees rating the event highly.", formula: "(Top-box / total) × 100", freq: "Per event", target: "≥ 85%", owner: "Festival Director", source: "Post-event survey", leading: "Entry time", lagging: "Pre-sale conversion", tl: "Green" },
      { name: "Entry Time", tier: "Management", def: "Average minutes from gate to site at peak.", formula: "Σ gate-to-site / sample", freq: "Per day", target: "≤ 30 min", owner: "Operations Manager", source: "Scan + survey data", leading: "Pre-fulfilled wristband %", lagging: "Attendee satisfaction", tl: "Amber" },
      { name: "Welfare Incidents", tier: "Operational", def: "Welfare/health incidents per event day.", formula: "Count per day", freq: "Daily", target: "Minimise; trend down", owner: "Welfare Lead", source: "Welfare log", leading: "Water-point coverage", lagging: "Safety reputation", tl: "Amber" },
    ],
  },
};

// ════════════════════════════════════════════════════════════════════════
// BUILDERS
// ════════════════════════════════════════════════════════════════════════

// ── STAGE 1 — Experience Design Brief (sector-aware + user inputs) ──
export function buildSampleBrief(ctx) {
  const key = resolveSector(ctx.sectorId, ctx.sector);
  const lib = SECTORS[key];
  const sector = ctx.sector || lib.label;
  const subType = ctx.subType || "General Venue";
  const theme = ctx.theme || "Memorable visitor experience";
  const tones = ctx.tones?.length ? ctx.tones : ["Welcoming", "Inspiring", "Memorable"];
  const tiers = ctx.tiers?.length ? ctx.tiers : ["B2C", "VIP", "POD"];
  const volume = ctx.volume || "Moderate daily footfall";
  const footprint = ctx.footprint || "Multi-zone venue";
  const purpose = ctx.purpose || "Deliver a meaningful, accessible visitor experience";
  const motivations = ctx.motivations?.length ? ctx.motivations : [
    { name: "Entertainment", priority: "High" },
    { name: "Social Connection", priority: "Medium" },
    { name: "Discovery", priority: "High" },
  ];
  const outcomes = ctx.outcomes?.length ? ctx.outcomes : [
    { name: "Visitor Satisfaction", rank: "1", priority: "Critical" },
    { name: "Dwell Time", rank: "2", priority: "High" },
    { name: "Revenue per Visitor", rank: "3", priority: "High" },
  ];
  const top3 = outcomes.slice(0, 3).map((o) => o.name);
  while (top3.length < 3) top3.push(["Net Promoter Score", "Repeat Visitation", "Safety Compliance"][top3.length]);

  return {
    sector_context: {
      sector,
      sub_type: subType,
      sector_id: key, // carried downstream so later stages pick the right library
      summary: `A ${subType.toLowerCase()} within the ${lib.label.toLowerCase()} sector, designed to ${purpose.toLowerCase()}. The experience balances ${tones.slice(0, 2).join(" and ").toLowerCase()} qualities across a ${footprint.toLowerCase()}.`,
    },
    thematic_architecture: {
      primary_theme: titleCase(theme),
      experience_tones: tones,
      purpose,
      daily_volume: volume,
      footprint,
      narrative_direction: `Guide visitors through a ${(tones[0] || "welcoming").toLowerCase()} arc that builds toward ${theme.toLowerCase()}, with clear emotional peaks at the sector's key moments.`,
    },
    physical_inventory: {
      assessed_features: ctx.physicalFeatures?.length ? ctx.physicalFeatures : [
        { name: "Entrance & Welcome Area", present: "Yes", quality: "Good", priority: "High" },
        { name: "Wayfinding & Signage", present: "Yes", quality: "Fair", priority: "High" },
        { name: "Rest & Recovery Zones", present: "Partial", quality: "Fair", priority: "Medium" },
        { name: "F&B Facilities", present: "Yes", quality: "Good", priority: "Medium" },
      ],
      gaps: lib.frictionZones.map((z) => z.zone + " not fully optimised"),
      recommendations: lib.frictionZones.map((z) => z.recommendation),
    },
    operational_controls: {
      ticketing_models: [ctx.ticketingType || "General Admission", ctx.pricing || "Tiered pricing"].filter(Boolean),
      entry_technologies: ctx.entryTech?.length ? ctx.entryTech : ["QR", "Barcode"],
      fb_policy: { outside_food: ctx.outsideFood || "Not specified", re_entry: ctx.reEntry || "Not specified" },
      medication_policy: ctx.medPolicy || "Permitted with declaration",
      mobile_policy: { phones_permitted: ctx.phones || "Yes", restricted_zones: ctx.restrictedZones || "Select zones" },
      security_screening: ctx.screening?.length ? ctx.screening : ["Visual", "Metal Detector"],
      operational_notes: `Crowd risk assessed as ${(ctx.hseRisk || "moderate").toLowerCase()}; evacuation readiness: ${(ctx.hseEvac || "drilled plan with marshals").toLowerCase()}.`,
    },
    stakeholder_map: {
      active_tiers: tiers,
      audience_profile: {
        nationalities: ctx.nationalities || "Mixed domestic and international",
        primary_language: ctx.primaryLang || "English",
        secondary_language: ctx.secondaryLang || "Arabic",
        religious_considerations: ctx.religious || "Prayer facilities and dietary options provided",
      },
      tier_implications: tiers.slice(0, 4).map((t) => ({ tier: t, implication: tierImplication(t) })),
    },
    motivational_landscape: {
      motivations,
      dominant_motivation: motivations.find((m) => m.priority === "High")?.name || motivations[0]?.name,
      strategic_insight: `Design should foreground ${(motivations.find((m) => m.priority === "High")?.name || "the primary motivation").toLowerCase()} while serving secondary motivations through optional pathways.`,
    },
    priority_heat_map: {
      outcomes,
      top_3: top3,
      strategic_focus: `Concentrate investment on ${top3[0]} and ${top3[1]} — the highest-leverage outcomes for a ${lib.label.toLowerCase()} setting.`,
    },
    selected_template: {
      primary: ctx.primaryTemplate || "Double Diamond Experience Map",
      secondary: ctx.secondaryTemplate || "Emotional Experience Curve",
      rationale: `The ${ctx.primaryTemplate || "Double Diamond"} structures discovery-to-delivery clearly, while the secondary lens keeps emotional highs and lows visible across the journey.`,
    },
    known_friction_zones: lib.frictionZones,
    success_criteria: [
      { criterion: "Visitor Satisfaction", metric: "Post-visit CSAT", target: "≥ 85%" },
      { criterion: lib.kpiNorms[0].name, metric: lib.kpiNorms[0].name, target: lib.kpiNorms[0].avg },
      { criterion: "Accessibility", metric: "POD task-completion rate", target: "≥ 95%" },
    ],
    gap_annotations: lib.frictionZones.slice(0, 2).map((z) => ({
      area: z.zone, gap_description: z.description, impact: "Reduces satisfaction and downstream value.", suggested_action: z.recommendation,
    })),
  };
}

function tierImplication(t) {
  const map = {
    VVIP: "Bespoke protocol, private routing and a dedicated liaison from arrival to departure.",
    VIP: "Expedited access, hosted touchpoints and priority service throughout.",
    B2C: "Clear self-service journey with strong wayfinding and value-for-money perception.",
    B2B: "Group logistics, billing flexibility and a named coordinator.",
    B2E: "Streamlined internal access with staff-day scheduling.",
    Media: "Press access, photo permissions and briefed escorts.",
    Authorities: "Protocol compliance, documentation and inspection-ready facilities.",
    Security: "Clear screening flow and incident-response coordination.",
    POD: "Step-free routing, sensory considerations and proactive assistance.",
  };
  for (const key of Object.keys(map)) if ((t || "").toLowerCase().includes(key.toLowerCase())) return map[key];
  return "Tailored service standards aligned to this group's expectations.";
}

// ── STAGE 2 — Benchmark (sector-aware) ──
export function buildSampleBenchmark(ctx) {
  const key = resolveSector(ctx.sectorId, ctx.sector);
  const lib = SECTORS[key];
  const sector = ctx.sector || lib.label;
  const top3 = ctx.top3?.length ? ctx.top3 : ["Visitor Satisfaction", "Dwell Time", "Revenue per Visitor"];
  return {
    meta: { top_3_outcomes: top3, sector, generated_for: `${sector} leading-practice scan` },
    archetype_patterns: lib.benchmarkArchetypes.map((a, i) => ({
      id: `AP-${String(i + 1).padStart(2, "0")}`, title: a.title, institution: a.inst, outcome_link: a.strategic_value || top3[i % top3.length],
      strategic_value: a.strategic_value || top3[i % top3.length],
      description: a.takeaway, filter_relevance: "High", filter_feasibility: i === 1 ? "Medium" : "High",
      filter_recency: "Current", confidence: i % 5 === 2 ? "Medium" : "High", key_takeaway: a.takeaway,
    })),
    journey_inflection_points: lib.moments.map((m, i) => ({
      id: `JIP-${String(i + 1).padStart(2, "0")}`, stage: m.stage, moment: m.name, institution: "Benchmark venues",
      what_works: m.rec, what_fails: m.risk, confidence: i === 1 ? "Medium" : "High", outcome_link: top3[i % top3.length],
    })),
    proven_design_levers: lib.levers.map((l, i) => ({
      id: `PDL-${String(i + 1).padStart(2, "0")}`, lever_name: l.name, mechanic: l.mechanic, institution: lib.benchmarkArchetypes[i % lib.benchmarkArchetypes.length].inst,
      measurable_impact: l.impact, confidence: i === 2 ? "Medium" : "High", applicability_note: `Most impactful in a ${lib.label.toLowerCase()} setting.`,
    })),
    operational_benchmarks: lib.kpiNorms.map((k, i) => ({
      id: `OB-${String(i + 1).padStart(2, "0")}`, kpi: k.name, benchmark_value: `${k.low} – ${k.high} (avg ${k.avg})`, institution: "Sector aggregate",
      context: `Drives ${k.outcome.toLowerCase()}.`, confidence: i === 2 ? "Medium" : "High", outcome_link: k.outcome,
    })),
    failure_mode_library: lib.failures.map((f, i) => ({
      id: `FM-${String(i + 1).padStart(2, "0")}`, failure_mode: f.mode, root_cause: f.cause, institution: "Common pattern",
      consequence: f.consequence, mitigation: f.mitigation, confidence: "High",
      journey_stage: f.stage || "—", persona_sensitivity: f.persona_sensitivity || "Affects multiple personas",
    })),
    kpi_norms: lib.kpiNorms.map((k, i) => ({
      id: `KN-${String(i + 1).padStart(2, "0")}`, kpi_name: k.name, industry_low: k.low, industry_avg: k.avg, industry_high: k.high,
      unit: k.unit, source_type: "Sector norm", outcome_link: k.outcome, confidence: i === 2 ? "Medium" : "High",
      tiers: { minimum: k.low, good: k.avg, world_class: k.high },
    })),
  };
}

// ── STAGE 3a — Persona Long List (sector-aware) ──
export function buildSamplePersonaLongList(ctx) {
  const key = resolveSector(ctx.sectorId, ctx.sector);
  const lib = SECTORS[key];
  const sector = ctx.sector || lib.label;

  // Pool of relatable first names assigned deterministically per persona id.
  const NAMES = ["Alex", "Maya", "Omar", "Sofia", "Liam", "Aisha", "Noah", "Priya", "Yusuf", "Elena", "Diego", "Hana"];
  const nameFor = (id, idx) => NAMES[(parseInt(String(id).replace(/\D/g, ""), 10) || idx + 1) % NAMES.length];

  let list = lib.personas.map((p, idx) => ({
    ...p,
    given_name: nameFor(p.id, idx),
    source: "Sector synthesis",
    source_confidence: p.pod_flag ? "High" : "Medium",
  }));

  // #2b — guarantee every user-selected stakeholder tier appears as a persona.
  const selectedTiers = (ctx.selectedTiers || []).filter(Boolean);
  if (selectedTiers.length) {
    const tierKey = (t) => (t || "").toLowerCase().replace(/[^a-z]/g, "");
    const present = new Set(list.map((p) => tierKey(p.tier)));
    selectedTiers.forEach((tier, i) => {
      // crude tier match: does any persona's tier mention this selected tier?
      const tk = tierKey(tier);
      const matched = list.some((p) => tierKey(p.tier).includes(tk) || tk.includes(tierKey(p.tier).slice(0, 4)));
      if (!matched) {
        const id = `P-${String(list.length + 1).padStart(2, "0")}`;
        list.push(makeTierPersona(tier, id, nameFor(id, list.length), lib));
      }
    });
  }

  return {
    meta: { sector, total_candidates: list.length, method: `Synthesised for the ${lib.label.toLowerCase()} sector from your selected stakeholder tiers, motivations, accessibility needs and benchmark archetypes.` },
    long_list: list,
    did_you_account_for_this: didYouAccount(key),
  };
}

// Build a sensible persona for a user-selected tier that the library didn't cover.
function makeTierPersona(tier, id, given_name, lib) {
  const t = (tier || "").toLowerCase();
  const isVIP = t.includes("vvip") || t.includes("vip");
  const isB2B = t.includes("b2b") || t.includes("partner");
  const isB2E = t.includes("b2e") || t.includes("employee") || t.includes("staff");
  const isMedia = t.includes("media") || t.includes("press");
  const isGov = t.includes("gov") || t.includes("author");
  const isPOD = t.includes("pod") || t.includes("determination") || t.includes("disab");
  const preset = isVIP
    ? { name: "VIP Guest", archetype: "Hosted Premium Visitor", segment: "Premium / sponsor", motivation: "A premium, frictionless, hosted experience.", secondary_motivation: "Recognition and exclusivity.", strategic_value: "High-margin, reputationally important.", description: "Expects expedited access, a named host and elevated touchpoints throughout.", journey_complexity: "High", risk_profile: "Medium — high expectations of the premium promise.", constraint_flags: ["Protocol / privacy"], pod_flag: false }
    : isB2B
    ? { name: "B2B Partner", archetype: "Group & Trade Buyer", segment: "Corporate / travel trade", motivation: "Smooth group logistics and clear value.", secondary_motivation: "Reliable account handling.", strategic_value: "Bulk revenue and repeat bookings.", description: "Books on behalf of groups; needs coordination, billing flexibility and a named contact.", journey_complexity: "High", risk_profile: "Medium — group flow affects others.", constraint_flags: ["Group logistics"], pod_flag: false }
    : isB2E
    ? { name: "Staff / Internal Visitor", archetype: "Employee Day Visitor", segment: "B2E / internal", motivation: "Easy internal access and a good staff experience.", secondary_motivation: "Pride in the venue.", strategic_value: "Engagement and internal advocacy.", description: "Visiting as staff or on a staff day; needs streamlined access.", journey_complexity: "Low", risk_profile: "Low.", constraint_flags: [], pod_flag: false }
    : isMedia
    ? { name: "Media / Press Guest", archetype: "Coverage Seeker", segment: "Media", motivation: "Get the access, story and shots they need.", secondary_motivation: "Efficient, briefed handling.", strategic_value: "Reach and reputation.", description: "Needs press access, photo permissions and a briefed escort.", journey_complexity: "Medium", risk_profile: "Medium — timing must not clash with visitor flow.", constraint_flags: ["Access / timing"], pod_flag: false }
    : isGov
    ? { name: "Government / Authority", archetype: "Protocol & Compliance Visitor", segment: "Authorities", motivation: "Protocol observed and standards met.", secondary_motivation: "Documentation and assurance.", strategic_value: "Licence to operate.", description: "Requires protocol compliance, documentation and inspection-ready facilities.", journey_complexity: "High", risk_profile: "High — compliance-critical.", constraint_flags: ["Protocol", "Compliance"], pod_flag: false }
    : isPOD
    ? { name: "Accessibility-First Visitor", archetype: "POD Companion", segment: "Person of determination + carer", motivation: "A dignified, barrier-free visit.", secondary_motivation: "Independence wherever possible.", strategic_value: "Inclusion is essential and reputationally vital.", description: "Needs step-free routing, rest points and clear information.", journey_complexity: "Very High", risk_profile: "High — small failures have large impact.", constraint_flags: ["Wheelchair access", "Rest dependency"], pod_flag: true }
    : { name: tier, archetype: "Selected Stakeholder", segment: tier, motivation: "A smooth, valuable visit suited to their group.", secondary_motivation: "Feeling well looked after.", strategic_value: "Represents a tier you flagged as important.", description: `Added because you selected the ${tier} tier — its needs must be designed for.`, journey_complexity: "Medium", risk_profile: "Medium.", constraint_flags: [], pod_flag: false };
  return {
    id, given_name, tier,
    name: preset.name, archetype: preset.archetype, segment: preset.segment,
    motivation: preset.motivation, secondary_motivation: preset.secondary_motivation,
    strategic_value: preset.strategic_value, description: preset.description,
    journey_complexity: preset.journey_complexity, recommended_inclusion: "Recommended (you selected this tier)",
    risk_profile: preset.risk_profile, constraint_flags: preset.constraint_flags, pod_flag: preset.pod_flag,
    recommended_default: "include", source: "Your stakeholder selection", source_confidence: "High",
  };
}

function didYouAccount(key) {
  const m = {
    "theme-parks": [
      { archetype: "Lone parent with multiple young children", why_it_matters: "Ride restrictions and rider-swap heavily shape their day." },
      { archetype: "Overseas tour group", why_it_matters: "Language and fixed coach times constrain their flow." },
    ],
    "cultural-heritage": [
      { archetype: "Lapsed / returning visitor", why_it_matters: "Their expectations are set by a previous visit — changes need signalling." },
      { archetype: "Large school / tour group", why_it_matters: "Group flow and noise affect every other persona's experience." },
    ],
    "sports-venues": [
      { archetype: "Family in a partisan crowd", why_it_matters: "Atmosphere can intimidate; safe family zones matter." },
      { archetype: "Media / broadcast crew", why_it_matters: "Access routes and timing must not clash with fan flow." },
    ],
    "live-events": [
      { archetype: "Camping multi-day attendee", why_it_matters: "Welfare, charging and overnight safety dominate their needs." },
      { archetype: "Lone attendee", why_it_matters: "Solo safety, lost-friend protocols and welfare reassurance matter." },
    ],
  };
  return m[key] || m["cultural-heritage"];
}

// ── STAGE 3b — Full Personas + matrix + coverage (sector-aware) ──
export function buildSampleFullPersonas(selected, sectorId) {
  const key = resolveSector(sectorId, "");
  const lib = SECTORS[key];
  const fz = lib.frictionZones.map((z) => z.zone);

  const personas = selected.map((p) => {
    const podQuote = "\"I just need to know, before I arrive, that I can get round safely and with dignity — then I can actually enjoy it.\"";
    const vipQuote = "\"Look after the details so I don't have to think about them — that's what premium means to me.\"";
    const familyQuote = "\"A good day is when everyone's happy, no one's melting down, and it felt worth what I paid.\"";
    const genericQuote = `\"I'm here for ${(p.motivation || "a great experience").toLowerCase()} — make it easy and I'll come back.\"`;
    const vip = (p.tier || "").includes("VIP") || (p.tier || "").includes("VVIP");
    const isFamily = /family/i.test(p.segment || "") || /family|organiser|organizer/i.test(p.name || "");
    const quote = p.pod_flag ? podQuote : vip ? vipQuote : isFamily ? familyQuote : genericQuote;

    // Deep, scenario-based enrichment (authored per persona, sector-aware fallback)
    const d = enrichPersona(p, key, lib);

    // 0-100 meters for a visual, glanceable persona profile
    const meters = {
      tech_savviness: vip ? 70 : p.pod_flag ? 65 : 80,
      price_sensitivity: vip ? 25 : isFamily ? 80 : 55,
      planning_style: p.pod_flag ? 90 : isFamily ? 75 : 45, // high = highly planned, low = spontaneous
      support_need: p.pod_flag ? 90 : vip ? 70 : 35,
      advocacy_potential: p.pod_flag ? 85 : vip ? 60 : 70,
    };

    return {
      id: p.id, name: p.name, given_name: p.given_name, archetype: p.archetype, tier: p.tier, segment: p.segment,
      quote,
      meters,
      identity: p.description || `${p.archetype} visiting as part of the ${p.tier} group.`,
      motivations: [p.motivation, p.secondary_motivation].filter(Boolean),
      // ── Enriched, consulting-grade depth fields ──
      core_needs: d.core_needs,
      pain_points: d.pain_points,
      emotional_journey_signature: d.emotional_journey_signature,
      spend_profile: d.spend_profile,
      channel_preferences: d.channel_preferences,
      cultural_language: d.cultural_language,
      control_sensitivity: d.control_sensitivity,
      strategic_value_detail: d.strategic_value,
      benchmark_provenance: d.benchmark_provenance,
      design_tensions: d.design_tensions,
      // ── Existing fields (kept for back-compat with the card UI) ──
      goals: ["Complete the visit feeling it was worthwhile", `Avoid the sector's known friction (${fz[0]})`, "Find the moments that matter to them"],
      expectations: ["Be welcomed and oriented quickly", "Clear, honest information", "Service that anticipates needs"],
      accessibility_needs: d.accessibility_needs,
      digital_behaviour: "Checks the website/app before visiting; uses mobile for maps, schedules and information on site.",
      visit_behaviour: p.pod_flag ? "Planned, companion-supported visit with pre-checked routes and frequent rest stops." : "Semi-planned visit, open to discovery but values a clear spine route.",
      spending_behaviour: d.spend_profile ? `${d.spend_profile.engagement} Typical spend ${d.spend_profile.aed_range} over ${d.spend_profile.dwell}.` : "Moderate, considered secondary spend.",
      journey_risks: ["A poor arrival setting a negative tone", p.pod_flag ? "An accessibility barrier mid-visit" : `Hitting the sector's main friction zone (${fz[0]})`],
      success_definition: p.pod_flag ? "Completed the full visit independently and with dignity, no barriers encountered." : "Left feeling the visit was enjoyable, easy and worth recommending.",
      preferred_channels: (d.channel_preferences || []).map((c) => c.channel),
      key_emotional_drivers: ["Feeling welcome", "Confidence / being in control", p.pod_flag ? "Dignity" : "Delight"],
      strategic_classification: p.classification || "Primary",
      pod_flag: !!p.pod_flag,
    };
  });

  const comparison_matrix = selected.map((p) => ({
    id: p.id, persona: p.name, motivation: p.motivation,
    spend_propensity: p.tier?.includes("VIP") ? "High" : "Medium",
    journey_complexity: p.journey_complexity || "Medium",
    accessibility_need: p.pod_flag ? "Critical" : "Low",
    loyalty_potential: "High",
    advocacy_potential: p.pod_flag ? "Very High" : "High",
    strategic_value: p.tier?.includes("VIP") || p.pod_flag ? "High" : "Medium",
    pod_flag: !!p.pod_flag,
  }));

  const hasPOD = selected.some((p) => p.pod_flag);
  const hasVIP = selected.some((p) => p.tier?.includes("VIP") || p.tier?.includes("VVIP"));
  const coverage_validation = [
    { check: "Stakeholder Coverage", status: selected.length >= 2 ? "pass" : "fail", detail: selected.length >= 2 ? "Multiple stakeholder tiers represented across the selected set." : "Select more personas to cover your stakeholder tiers." },
    { check: "Accessibility Coverage", status: hasPOD ? "pass" : "fail", detail: hasPOD ? "A Person-of-Determination persona is included." : "No POD persona selected — accessibility needs may be under-represented." },
    { check: "Revenue Coverage", status: "pass", detail: hasVIP ? "Both premium and general-revenue personas are represented." : "General-revenue personas represented; consider a premium persona for upside." },
    { check: "Priority Outcome Coverage", status: "pass", detail: `Selected personas collectively map to the ${lib.label.toLowerCase()} priority outcomes.` },
  ];

  return { coverage_validation, personas, comparison_matrix };
}

// ── STAGE 4 — Journeys, Moments of Truth, KPIs (sector-aware) ──
export function buildSampleJourneys(personas, templateUsed, sectorId) {
  const key = resolveSector(sectorId, "");
  const lib = SECTORS[key];

  // intensity profiles tuned per touchpoint role (1-5)
  const scoreFor = (stageKey, idx, pod, vip) => {
    // [pain, delight, risk, accessibility, ops, priority]
    const base = {
      pre_visit: [2, 4, 2, pod ? 4 : 2, 2, 4],
      arrival: [3, 3, pod ? 4 : 3, pod ? 5 : 3, 3, 5],
      core_experience: [2, 5, 2, pod ? 4 : 2, 3, 5],
      exit_departure: [2, 4, 2, pod ? 4 : 2, 2, 4],
      post_visit: [1, 4, 1, 2, 2, 4],
    }[stageKey];
    const s = [...base];
    // Vary delight/pain per touchpoint so the emotional curve has real peaks & dips.
    // Even touchpoints lift delight; odd ones add a little friction — clamped 1-5.
    const wave = [0, -1, 1, 0, 1, -1][idx % 6];
    s[1] = Math.max(1, Math.min(5, s[1] + (wave > 0 ? 0 : wave))); // delight dips on friction points
    s[0] = Math.max(1, Math.min(5, s[0] + (wave < 0 ? 1 : 0)));    // pain rises on friction points
    if (vip && stageKey === "arrival") s[1] = 5; // VIP delight at arrival
    if (idx === 0 && (stageKey === "arrival" || stageKey === "core_experience")) s[5] = 5;
    return s;
  };

  const journeys = personas.map((p) => {
    const pod = p.pod_flag;
    const vip = (p.tier || "").includes("VIP") || (p.tier || "").includes("VVIP");
    const stages = {};
    Object.entries(lib.touchpoints).forEach(([stageKey, tps]) => {
      const tpList = tps.map(([name, channel, emotion], idx) => {
        const [pain, delight, risk, acc, ops, prio] = scoreFor(stageKey, idx, pod, vip);
        const sentiment = Math.max(8, Math.min(96, Math.round(50 + (delight - 3) * 18 - (pain - 2) * 10 - (risk - 2) * 6)));
        const emotion_score = Math.max(1, Math.min(10, Math.round(sentiment / 10)));
        const is_mot = prio >= 5 || risk >= 4 || (delight >= 5 && idx === 0);
        return {
          name, stage: stageKey, channel, emotion,
          emotion_line: emotionLine(name, emotion, p, sentiment),
          sentiment,
          emotion_score,                                   // 1-10 for the curve
          emotion_label: tpEmotionLabel(emotion, sentiment),
          persona_goal: tpGoal(name, stageKey, p),
          expected_experience: tpExpected(name, stageKey, p, channel),
          friction_conditions: tpFriction(name, stageKey, p, pod, vip),
          delight_conditions: tpDelight(name, stageKey, p, vip),
          mot_flag: is_mot,
          pain_level: pain, delight_level: delight, risk_level: risk,
          accessibility_impact: acc, operational_complexity: ops, priority_score: prio,
        };
      });
      // Stage-level emotion: average sentiment → a single dominant label
      const avgSent = Math.round(tpList.reduce((s, t) => s + t.sentiment, 0) / (tpList.length || 1));
      stages[stageKey] = {
        summary: stageSummary(stageKey, lib, p),
        persona_goal: stageGoal(stageKey, p, lib),
        key_actions: tpList.slice(0, 3).map((t) => t.name),
        touchpoints: tpList,
        emotion_label: emotionLabel(stageKey, avgSent, p),
        avg_sentiment: avgSent,
        pain_points: tpList.filter((t) => t.pain_level >= 3).map((t) => t.name).slice(0, 2),
        opportunities: stageOpportunities(stageKey, lib, p),
      };
    });

    const { moments_of_truth, kpis } = buildPersonaMoTsKPIs(p, key, lib);

    return { persona_id: p.id, persona_name: p.name, template_used: templateUsed || "Double Diamond Experience Map", stages, moments_of_truth, kpis };
  });

  return { journeys };
}

function adjustTargetForPOD(t) {
  return t; // kept simple; targets already realistic
}

function stageSummary(stageKey, lib, p) {
  const pod = p.pod_flag;
  const map = {
    pre_visit: `${p.name} researches and prepares for a ${lib.label.toLowerCase()} visit; ${pod ? "accessibility information is decisive at this stage." : "expectations form before arrival."}`,
    arrival: `First impressions form fast at the gate; in this sector, ${lib.frictionZones[0].zone.toLowerCase()} is the make-or-break factor.`,
    core_experience: `The heart of the visit — where ${(p.motivation || "the core experience").toLowerCase()} is delivered, against the sector's known pressure points.`,
    exit_departure: "The closing impression visitors remember and recount to others.",
    post_visit: "Turning a good visit into loyalty, advocacy and a return.",
  };
  return map[stageKey];
}

// Turn a single emotion word + touchpoint into an impactful, layman-friendly one-liner.
function emotionLine(name, emotion, p, sentiment) {
  const who = (p.name || "The visitor").split(" ")[0];
  const mood = sentiment >= 70 ? "high" : sentiment >= 45 ? "neutral" : "low";
  const lib = {
    anticipation: `${who} is excited and building expectations — this is where the relationship starts.`,
    commitment: `${who} commits time and money here — confidence must be earned, not assumed.`,
    strategising: `${who} is planning the visit in their head — clarity now prevents confusion later.`,
    curiosity: `${who} is exploring options — make it effortless to picture the experience.`,
    excitement: `Anticipation peaks — ${who} arrives primed to be impressed.`,
    transition: `${who} is in transit and a little tense — smooth logistics protect the mood.`,
    compliance: `A necessary checkpoint — handle it warmly so it doesn't feel like a barrier.`,
    "getting bearings": `${who} is deciding where to go first — strong orientation sets the tone.`,
    absorption: `${who} is fully immersed — this is the emotional high point of the whole visit.`,
    supported: `A human moment — the right help here turns satisfaction into loyalty.`,
    relief: `${who} pauses to recover — rest here is what makes the second half enjoyable.`,
    reflection: `${who} forms a lasting memory — the final impression outweighs the average.`,
    warmth: `A genuine goodbye — ${who} leaves feeling valued, not processed.`,
    enthusiastic: `${who} is ready to recommend you — capture and amplify this moment.`,
    "collective euphoria": `The shared peak everyone came for — protect it at all costs.`,
    "rushed refuel": `A high-pressure rush — relieve the crush before it sours the mood.`,
    "ingress tension": `Make-or-break entry — calm, fast flow here decides the whole day.`,
  };
  const fallback = mood === "high"
    ? `${who} feels ${emotion} — a moment of genuine delight worth designing around.`
    : mood === "low"
      ? `${who} feels ${emotion} — a fragile moment where small failures do real damage.`
      : `${who} feels ${emotion} — a pivotal step that quietly shapes the overall impression.`;
  return lib[(emotion || "").toLowerCase()] || fallback;
}

// Per-stage persona goal for the journey-map grid.
function stageGoal(stageKey, p, lib) {
  const pod = !!p.pod_flag;
  const goals = {
    pre_visit: pod ? "Confirm the visit will be accessible and plan a safe route." : "Decide it's worth it and plan the visit with confidence.",
    arrival: pod ? "Enter smoothly with dignity and clear accessible routing." : "Arrive, orient quickly and start the experience without friction.",
    core_experience: `Get the core value: ${(p.motivation || "a great experience").toLowerCase()}.`,
    exit_departure: "Leave on a high with a strong final impression.",
    post_visit: "Feel it was worthwhile and want to return or recommend.",
  };
  return goals[stageKey] || "Have a smooth, valuable experience.";
}

// Map an average sentiment (0-100) to an emotion label per stage.
function emotionLabel(stageKey, avgSent, p) {
  if (avgSent >= 72) return stageKey === "core_experience" ? "Delight" : "Excitement";
  if (avgSent >= 55) return "Engaged";
  if (avgSent >= 42) return stageKey === "arrival" ? "Tension" : "Uncertainty";
  return stageKey === "arrival" ? "Anxiety" : "Frustration";
}

// Per-stage opportunities for the journey-map grid (sector-connected).
function stageOpportunities(stageKey, lib, p) {
  const fz = lib.frictionZones.map((z) => z.recommendation);
  const opps = {
    pre_visit: ["Prime expectations with clear pre-visit content", p.pod_flag ? "Publish accessibility info up front" : "Surface highlights to build anticipation"],
    arrival: [fz[0] || "Smooth the entry flow", "Greet and orient at the threshold"],
    core_experience: [lib.levers?.[0]?.name || "Deploy the top design lever", "Protect the emotional peak"],
    exit_departure: ["Design a deliberate closing moment", "Capture spend and memory before exit"],
    post_visit: ["Convert satisfaction into advocacy", "Re-engage with a timely offer"],
  };
  return opps[stageKey] || ["Improve this stage"];
}

// Cross-persona synthesis for the Consolidated Customer Journey Mapping Framework.
export function buildConsolidatedFramework(journeyData, briefData, benchmarkData, sectorId) {
  const key = resolveSector(sectorId, "");
  const lib = SECTORS[key];
  const journeys = (journeyData && journeyData.journeys) || [];
  const STG = [
    { key: "pre_visit", label: "Pre-Visit" },
    { key: "arrival", label: "Arrival" },
    { key: "core_experience", label: "Core Experience" },
    { key: "exit_departure", label: "Exit" },
    { key: "post_visit", label: "Post-Visit" },
  ];

  // Section 1 — Journey Architecture: shared stages + divergence
  const architecture = STG.map((s) => {
    const labels = journeys.map((j) => j.stages?.[s.key]?.emotion_label).filter(Boolean);
    const distinct = [...new Set(labels)];
    return {
      stage: s.label,
      shared: `All personas pass through ${s.label.toLowerCase()}.`,
      divergence: distinct.length > 1 ? `Emotional response diverges: ${distinct.join(" / ")}.` : `Broadly aligned emotional response (${distinct[0] || "neutral"}).`,
    };
  });

  // Section 2 — Persona overlay grid: per stage, each persona's dominant behaviour (key action)
  const overlay = STG.map((s) => ({
    stage: s.label,
    cells: journeys.map((j) => ({
      persona: j.persona_name,
      behaviour: (j.stages?.[s.key]?.key_actions || [])[0] || "—",
      emotion: j.stages?.[s.key]?.emotion_label || "—",
      intensity: j.stages?.[s.key]?.avg_sentiment ?? 50,
    })),
  }));

  // Section 3 — MoT consolidation: cluster across personas into the 4 types
  const clusterFor = (c) => ({ Critical: "Risk", High: "Conversion", Medium: "Delight", Low: "Loyalty" }[c] || "Delight");
  const motClusters = { Conversion: [], Risk: [], Delight: [], Loyalty: [] };
  const motSeen = {};
  journeys.forEach((j) => (j.moments_of_truth || []).forEach((m) => {
    const cluster = clusterFor(m.classification);
    const seenKey = `${cluster}::${m.name}`;
    if (!motSeen[seenKey]) { motSeen[seenKey] = { name: m.name, stage: m.stage, personas: [] }; motClusters[cluster].push(motSeen[seenKey]); }
    motSeen[seenKey].personas.push(j.persona_name);
  }));
  const motConsolidation = Object.entries(motClusters).map(([cluster, items]) => ({
    cluster,
    common: items.filter((i) => i.personas.length > 1),
    specific: items.filter((i) => i.personas.length === 1),
  }));

  // Section 4 — Experience Design Priorities (from priority outcomes + MoT density + friction)
  const top3 = (briefData && briefData.priority_heat_map && briefData.priority_heat_map.top_3) || [];
  const priorities = [
    ...lib.frictionZones.map((z) => ({ priority: `Resolve: ${z.zone}`, rationale: z.recommendation, source: "Friction zone" })),
    ...(lib.levers || []).slice(0, 2).map((l) => ({ priority: `Deploy: ${l.name}`, rationale: l.impact, source: "Proven lever" })),
    ...top3.slice(0, 3).map((o) => ({ priority: `Optimise for: ${o}`, rationale: "Top priority outcome from your brief.", source: "Priority outcome" })),
  ].slice(0, 8);

  // Section 5 — KPI consolidation: universal vs persona-specific
  const allKpis = [];
  const kpiSeen = {};
  journeys.forEach((j) => (j.kpis || []).forEach((k) => {
    if (!kpiSeen[k.name]) { kpiSeen[k.name] = { name: k.name, tier: k.tier, target: k.target, personas: [] }; allKpis.push(kpiSeen[k.name]); }
    kpiSeen[k.name].personas.push(j.persona_name);
  }));
  const universalKpis = allKpis.filter((k) => k.personas.length === journeys.length && journeys.length > 0);
  const specificKpis = allKpis.filter((k) => k.personas.length < journeys.length);

  // Section 6 — Design Tensions (sector-aware, premium insight)
  const tensions = [
    { tension: "Speed vs. depth of experience", detail: "Fast throughput protects flow, but the value comes from immersion and dwell — over-optimising for speed erodes the experience." },
    { tension: "Security / screening vs. seamless flow", detail: "Safety and screening are non-negotiable, yet every checkpoint is a friction point that can sour arrival." },
    { tension: "VIP exclusivity vs. inclusivity", detail: "Premium tiers drive margin, but visible exclusivity can undermine the welcoming, inclusive tone — especially for POD and general visitors." },
    { tension: "Personalisation vs. operational simplicity", detail: "Tailored journeys delight, but each variation adds operational complexity and cost to run reliably." },
  ];

  return { sector: lib.label, persona_count: journeys.length, architecture, overlay, motConsolidation, priorities, universalKpis, specificKpis, tensions };
}

/* ============================================================================
   PERSONA DEPTH LAYER — consulting-grade, scenario-based enrichment.
   Authored per persona id; merged into full persona cards by enrichPersona().
   Benchmark provenance = REAL institutions as ILLUSTRATIVE references
   (practices they are genuinely known for) + realistic sector-norm numbers.
   No fabricated study citations.
   ============================================================================ */
const PERSONA_DEPTH = {
  // ───────── CULTURAL & HERITAGE (maps to the 8 named personas) ─────────
  "cultural-heritage": {
    "P-01": {
      core_needs: [
        "Self-paced routing with no forced linear path",
        "Layered interpretation (quick label → deep-dive option)",
        "Quiet, low-crowd windows to dwell at key objects",
        "Reliable on-site wayfinding that matches the pre-visit app",
      ],
      pain_points: [
        "Arriving to find the headline gallery at peak density, unable to dwell",
        "Interpretation pitched too shallow, with no route to go deeper",
        "Being herded by a fixed one-way system that breaks their own rhythm",
      ],
      emotional_journey_signature: "Begins with high anticipation (researched the collection), dips slightly at a crowded arrival, climbs steadily through self-directed discovery, and peaks at an unplanned 'find' — the object they didn't know they'd love. Leaves reflective and quietly proud of what they learned.",
      spend_profile: { aed_range: "AED 90–180", dwell: "150–210 min", engagement: "Deep, low-velocity: long stops at fewer objects, café break mid-visit, considered shop purchase (book/print)." },
      channel_preferences: [
        { rank: 1, channel: "Venue website / collection pages", why: "Plans around specific objects before arriving." },
        { rank: 2, channel: "On-site app + audio deep-dives", why: "Wants optional depth without carrying a guidebook." },
        { rank: 3, channel: "Docent / curator talks", why: "Values expert framing for flagship pieces." },
      ],
      cultural_language: "English-comfortable; appreciates Arabic-first signage in-region as a mark of authenticity. Self-reliant on text-heavy interpretation.",
      accessibility_needs: "None mandatory; benefits from seating at key galleries to support long dwell.",
      control_sensitivity: "Security: tolerant if fast and respectful. F&B policy: indifferent. Mobile rules: wants photography allowed (no-flash) — a ban materially lowers satisfaction.",
      strategic_value: { revenue: "Medium-high (repeat + considered shop spend)", advocacy: "Very high — writes reviews, recommends specific objects", loyalty: "High — prime membership convert" },
      benchmark_provenance: [
        "Louvre — timed entry to protect dwell quality at flagship works (illustrative)",
        "Smithsonian — layered digital interpretation alongside object labels (illustrative)",
      ],
      design_tensions: ["Wants deep content vs. limited dwell time at peak crowding", "Wants self-direction vs. operational desire for one-way flow"],
    },
    "P-02": {
      core_needs: [
        "Predictable pacing the group can sustain (toilets, snacks, rest)",
        "Child-engaging interpretation that doesn't bore adults",
        "Buggy/pushchair-friendly step-free routing",
        "Clear 'how long will this take' signals to manage young attention spans",
      ],
      pain_points: [
        "A meltdown triggered by a long entry queue before the visit even starts",
        "No quick food/toilet option at the exact moment a child needs it",
        "Content too academic for children, so they disengage and the adult's visit collapses",
      ],
      emotional_journey_signature: "Starts logistics-anxious (will this work for the kids?), tense at arrival, then relief and delight when a hands-on exhibit lands with the children. Energy dips mid-visit (fatigue), recovers with a well-placed break, and ends warm if the children leave talking about one thing they loved.",
      spend_profile: { aed_range: "AED 150–320 (group)", dwell: "120–160 min", engagement: "Burst-based: high energy in interactive zones, needs a mid-visit reset; strong F&B and gift-shop spend driven by children." },
      channel_preferences: [
        { rank: 1, channel: "Mobile app / family pages", why: "Pre-checks facilities, family tickets and child suitability." },
        { rank: 2, channel: "On-site family trail / activity sheet", why: "Keeps children purposeful between highlights." },
        { rank: 3, channel: "Front-of-house staff", why: "Relies on staff for nearest toilet/feeding point." },
      ],
      cultural_language: "Mixed; values pictographic, low-text family wayfinding that works regardless of first language.",
      accessibility_needs: "Pushchair routing = effectively step-free needs; baby-change and feeding spaces essential.",
      control_sensitivity: "Security: needs bag/buggy search handled quickly and kindly. F&B: strongly wants permission to bring snacks for children. Mobile: wants photos of the kids enjoying it.",
      strategic_value: { revenue: "High (group F&B + retail)", advocacy: "High within parent networks", loyalty: "High — family membership + repeat school-holiday visits" },
      benchmark_provenance: [
        "Science Museum Group — family trails and hands-on galleries (illustrative)",
        "Expo 2020 Dubai — pram-friendly step-free site-wide circulation (illustrative)",
      ],
      design_tensions: ["Child engagement vs. adult depth in shared interpretation", "Spontaneous family pace vs. timed-entry slotting"],
    },
    "P-12": {
      core_needs: [
        "Wayfinding and interpretation that work with limited local-language ability",
        "Iconic 'must-see' objects clearly flagged for a time-boxed visit",
        "Frictionless ticketing that accepts international payment",
        "Shareable, photogenic moments for social proof back home",
      ],
      pain_points: [
        "Critical signage only in the local language, causing missed highlights",
        "Discovering the must-see object is closed/loaned only after arriving",
        "Payment or ticketing friction with a foreign card or no local SIM",
      ],
      emotional_journey_signature: "High excitement pre-visit (bucket-list), mild arrival anxiety from the language gap, relief when visual wayfinding carries them, a clear peak at the iconic object/photo, and a satisfied, status-affirming close as they capture and share it.",
      spend_profile: { aed_range: "AED 120–260", dwell: "90–130 min", engagement: "Highlight-driven: covers flagship objects efficiently, strong souvenir/photo spend, lighter on deep galleries." },
      channel_preferences: [
        { rank: 1, channel: "Google / international OTAs & reviews", why: "Discovers and pre-books in their own language." },
        { rank: 2, channel: "Multilingual on-site app + maps", why: "Bridges the language gap in real time." },
        { rank: 3, channel: "Visual signage / icons", why: "Falls back on universal cues when text fails." },
      ],
      cultural_language: "Non-native; in-region commonly Mandarin/Hindi/Russian group travel with reliance on group leaders and translation. English as a bridge language, not a guarantee.",
      accessibility_needs: "Language access is the primary 'accessibility' need; translated safety/emergency info essential.",
      control_sensitivity: "Security: needs clear visual instruction at screening (language-independent). F&B: open. Mobile: heavy reliance on phone for translation, maps and photos — connectivity/Wi-Fi is critical.",
      strategic_value: { revenue: "Medium-high (souvenir + premium photo ops)", advocacy: "Very high internationally (drives global reviews)", loyalty: "Low repeat (one-time) but high reputational value" },
      benchmark_provenance: [
        "Louvre — multilingual app and visual flagship routing for international visitors (illustrative)",
        "Expo 2020 Dubai — multilingual signage and contactless international payment (illustrative)",
      ],
      design_tensions: ["Time-boxed highlight tour vs. revenue from deeper engagement", "Universal visual design vs. culturally specific interpretation"],
    },
    "P-16": {
      core_needs: [
        "Genuinely photogenic, share-worthy moments",
        "Social, low-friction group routing (stay together, move fast)",
        "Contemporary, non-stuffy interpretation tone",
        "Fast mobile ticketing and cashless everything",
      ],
      pain_points: [
        "A 'no photography' policy that kills the core reason they came",
        "Dead Wi-Fi/connectivity blocking real-time sharing",
        "An atmosphere that feels formal or policed, dampening the social vibe",
      ],
      emotional_journey_signature: "Arrives buzzing and social, peaks fast at the most 'grammable installation, plateaus through anything text-heavy, and re-peaks at a group photo / café moment. Leaves on a high if they got the content — the visit's value is partly realised after, in the sharing.",
      spend_profile: { aed_range: "AED 70–160", dwell: "60–100 min", engagement: "High-velocity, social: clusters at signature moments, strong café and impulse-retail spend, light on deep galleries." },
      channel_preferences: [
        { rank: 1, channel: "Instagram / TikTok", why: "Discovers via and creates for social — the primary loop." },
        { rank: 2, channel: "Mobile app / mobile ticketing", why: "Expects instant, cashless, phone-first everything." },
        { rank: 3, channel: "Peer reviews", why: "Trusts friends/creators over official copy." },
      ],
      cultural_language: "Digitally-native, code-switches easily; tone matters more than language — formal copy reads as 'not for me'.",
      accessibility_needs: "None typical; benefits from clear, fast circulation in social groups.",
      control_sensitivity: "Security: low tolerance for slow/heavy-handed screening. F&B: wants social café space. Mobile: phone use is the experience — any restriction is a dealbreaker.",
      strategic_value: { revenue: "Medium (volume + café/impulse)", advocacy: "Extremely high organic reach", loyalty: "Medium — returns for new 'drops'/exhibitions" },
      benchmark_provenance: [
        "Museum of the Future (Dubai) — signature shareable architecture/moments (illustrative)",
        "teamLab — fully photographable, social-first immersive design (illustrative)",
      ],
      design_tensions: ["Shareable spectacle vs. depth of cultural content", "Open photography vs. conservation/lighting constraints"],
    },
    "P-14": {
      core_needs: [
        "Frequent, comfortable seating and clearly signed rest points",
        "Legible, larger-type signage and good lighting",
        "Calm, unhurried pacing away from peak crowds",
        "Easy-to-find toilets and step-minimised routes",
      ],
      pain_points: [
        "Too few seats, forcing an early exit through fatigue",
        "Small-type or low-contrast labels that are hard to read",
        "Fast-moving peak crowds that feel unsafe or overwhelming",
      ],
      emotional_journey_signature: "Arrives calm but cautious, reassured by a clear welcome and visible seating. Confidence builds through an unhurried, well-supported route, peaks in a nostalgic or meaningful gallery, and closes contentedly if energy was managed — soured only if fatigue or crowding forced a premature end.",
      spend_profile: { aed_range: "AED 80–170", dwell: "100–150 min (with rests)", engagement: "Steady, low-velocity: values the café as a destination, considered shop spend, prefers quieter mid-week slots." },
      channel_preferences: [
        { rank: 1, channel: "Phone / box office", why: "Prefers booking by phone or in person over app-only flows." },
        { rank: 2, channel: "Printed map / large-type guide", why: "Trusts physical wayfinding over a small screen." },
        { rank: 3, channel: "Front-of-house staff", why: "Relies on human help for routing and rest points." },
      ],
      cultural_language: "First-language reader; larger type and clear contrast matter more than translation.",
      accessibility_needs: "Seating density, step-minimised routing, legible signage, accessible toilets — often unstated, so must be designed in proactively.",
      control_sensitivity: "Security: prefers calm, explained screening. F&B: values a proper sit-down café. Mobile: lower app reliance — must not be the only channel.",
      strategic_value: { revenue: "Medium (café + considered retail)", advocacy: "High in local/community networks", loyalty: "Very high — loyal members and frequent off-peak visitors" },
      benchmark_provenance: [
        "National Trust — rest-point density and large-type interpretation (illustrative)",
        "Tate — quiet/off-peak slots and seated viewing (illustrative)",
      ],
      design_tensions: ["Unhurried comfort vs. throughput at peak", "Human/print channels vs. app-first cost efficiency"],
    },
    "P-18": {
      core_needs: [
        "A genuinely step-free hero route, signed physically and in-app",
        "Reliable accessible toilets and lifts (with live status)",
        "Pre-visit confidence that the route is navigable end-to-end",
        "Staff trained to assist with dignity, without being asked twice",
      ],
      pain_points: [
        "An 'accessible' route that dead-ends at a step or out-of-service lift",
        "Having to ask repeatedly for help, eroding independence and dignity",
        "Pre-visit accessibility info that's vague, missing, or wrong",
      ],
      emotional_journey_signature: "Pre-visit anxiety dominates (will I get round?). A confident, clearly accessible arrival converts anxiety into trust; the visit then rises like any other guest's — until/unless a single barrier (step, broken lift, blocked route) collapses it instantly. The make-or-break is consistency, not peaks.",
      spend_profile: { aed_range: "AED 90–200 (often + companion)", dwell: "120–180 min", engagement: "Deliberate, route-led; companion frequently present, so effective spend is per-pair; strong loyalty when access is reliable." },
      channel_preferences: [
        { rank: 1, channel: "Venue accessibility webpage", why: "Decisive pre-visit: detailed access info determines whether they come at all." },
        { rank: 2, channel: "On-site app with live lift/route status", why: "Real-time confidence the route is open." },
        { rank: 3, channel: "Trained front-of-house staff", why: "Backstop for routing and assistance with dignity." },
      ],
      cultural_language: "As per visitor base; accessible formats (captioning, audio, easy-read) matter alongside language.",
      accessibility_needs: "Mobility-specific: step-free hero route, lifts with live status, accessible toilets, wheelchair-height sightlines, transfer space, companion seating.",
      control_sensitivity: "Security: needs screening that accommodates mobility aids respectfully. F&B: accessible counter heights/seating. Mobile: relies on app for live accessible routing — accuracy is safety-critical.",
      strategic_value: { revenue: "Medium (per-pair)", advocacy: "Very high — trusted voice in disability communities", loyalty: "Very high when access is dependable; zero tolerance for broken promises" },
      benchmark_provenance: [
        "Smithsonian — published, detailed accessibility maps and step-free routing (illustrative)",
        "Expo 2020 Dubai — 'People of Determination' site-wide accessible design programme (illustrative)",
      ],
      design_tensions: ["Designed-in step-free hero route vs. heritage-building structural limits", "Independence/dignity vs. assistance-on-request models"],
    },
    "P-03": {
      core_needs: [
        "Time-efficient, hosted access with no queueing",
        "A private/curated route or after-hours option",
        "Discreet, briefed staff who anticipate needs",
        "Seamless arrival (drop-off, fast-track, escort)",
      ],
      pain_points: [
        "Any public queue or wait that signals their time isn't valued",
        "A generic, un-curated visit that wastes a tight schedule",
        "Service gaps where staff aren't briefed on who they are",
      ],
      emotional_journey_signature: "Arrives expecting effortlessness; the make-or-break is the first 5 minutes (drop-off → escort). If hosting is flawless, the experience is calm and high-status throughout, peaking at a privileged moment (private viewing, curator time). Friction anywhere reads as a service failure, not a minor hiccup.",
      spend_profile: { aed_range: "AED 500–2,000+ (hosting/hospitality)", dwell: "60–120 min (time-boxed)", engagement: "Curated, escorted, high-value; spend via hospitality, private events and corporate membership rather than retail." },
      channel_preferences: [
        { rank: 1, channel: "Dedicated relationship manager / EA liaison", why: "Books and coordinates through a named human, not self-service." },
        { rank: 2, channel: "Private concierge line", why: "Expects bespoke handling and instant response." },
        { rank: 3, channel: "Curated digital briefing", why: "Wants a tailored pre-visit dossier, not generic marketing." },
      ],
      cultural_language: "Protocol-aware; bilingual hosting (e.g. Arabic + English) and cultural sensitivity expected as standard.",
      accessibility_needs: "As required, handled discreetly and proactively without the guest having to flag it.",
      control_sensitivity: "Security: expects discreet, pre-cleared screening. F&B: premium hosted catering. Mobile: privacy-sensitive — controls on photography of them and their party.",
      strategic_value: { revenue: "Very high (hospitality + corporate partnership)", advocacy: "High at executive/board level", loyalty: "High via institutional relationships and patronage" },
      benchmark_provenance: [
        "Louvre Abu Dhabi — VIP/patron hosting and private viewings (illustrative)",
        "British Museum — corporate patron and after-hours programmes (illustrative)",
      ],
      design_tensions: ["VIP exclusivity vs. public-access mission and crowd flow", "Curated time-boxed visit vs. depth of engagement"],
    },
    "P-09": {
      core_needs: [
        "Scholarly-depth interpretation and primary-source access",
        "Permission/route to study specific objects closely and long",
        "Expert contact (curator/specialist) availability",
        "Quiet conditions conducive to concentration and note-taking",
      ],
      pain_points: [
        "Interpretation that stops at the surface with no scholarly layer",
        "Crowds and noise preventing sustained close study",
        "No route to specialist staff or deeper collection access",
      ],
      emotional_journey_signature: "Arrives purposeful and focused (not casual). Mild frustration if the first layer is too shallow, resolving into deep absorption once they find the depth — the peak is intellectual, sustained rather than spiky. Leaves intellectually satisfied and likely to return for the same depth, or disappointed if depth never materialised.",
      spend_profile: { aed_range: "AED 100–220", dwell: "180–300 min", engagement: "Very deep, very low-velocity: long sessions at few objects, strong bookshop/publication spend, café as a working break." },
      channel_preferences: [
        { rank: 1, channel: "Collection database / research pages", why: "Plans around specific objects and scholarship before arriving." },
        { rank: 2, channel: "Curator / specialist talks & contact", why: "Seeks expert framing and access." },
        { rank: 3, channel: "In-depth audio / publications", why: "Wants scholarly depth on demand." },
      ],
      cultural_language: "Strong reader, often multilingual; values primary-source and original-language material.",
      accessibility_needs: "None typical; values seating and quiet study conditions.",
      control_sensitivity: "Security: tolerant. F&B: café as workspace. Mobile: needs photography for research notes — restrictions materially impede their purpose.",
      strategic_value: { revenue: "Medium (publications + repeat)", advocacy: "High in academic/specialist circles", loyalty: "Very high — repeat researcher and likely member/patron" },
      benchmark_provenance: [
        "British Museum — study rooms and scholarly access programmes (illustrative)",
        "Smithsonian — open-access collections data for researchers (illustrative)",
      ],
      design_tensions: ["Scholarly depth vs. mass-accessibility of interpretation", "Close-study access vs. conservation and crowd management"],
    },
  },
};

// Sector-agnostic rich fallback so EVERY persona (all 4 sectors) gets depth,
// adapting to the active sector's friction zones, levers and KPI norms.
function personaDepthFallback(p, lib) {
  const fz = lib.frictionZones.map((z) => z.zone);
  const pod = !!p.pod_flag;
  const vip = (p.tier || "").includes("VIP") || (p.tier || "").includes("VVIP");
  const family = /family/i.test(p.segment || "") || /family/i.test(p.name || "");
  const intl = /tourist|international|overseas|non-native|away|travelling/i.test((p.archetype || "") + (p.segment || "") + (p.name || ""));
  return {
    core_needs: [
      `Deliver the core motivation: ${(p.motivation || "a valuable visit").toLowerCase()}`,
      `Avoid the sector's primary friction (${fz[0]})`,
      pod ? "A dependable, dignity-preserving accessible route" : vip ? "Time-efficient, hosted, frictionless access" : "Clear orientation and confident wayfinding",
      family ? "Group-sustainable pacing (rest, food, facilities)" : "Interpretation pitched to their depth and pace",
    ],
    pain_points: [
      `Friction at ${fz[0].toLowerCase()} setting a negative tone early`,
      fz[1] ? `${fz[1]} eroding the middle of the visit` : "Energy dip with no recovery point",
      pod ? "An accessibility barrier appearing mid-journey" : vip ? "Any queue or service gap signalling their time isn't valued" : intl ? "Language/wayfinding gaps causing missed highlights" : "A flat, transactional close undercutting the visit",
    ],
    emotional_journey_signature: `${(p.name || "The visitor")} arrives ${pod ? "anxious about access" : vip ? "expecting effortlessness" : "anticipatory"}, navigates ${fz[0].toLowerCase()} as the first test, rises through the core experience toward a clear peak around ${(p.motivation || "their core goal").toLowerCase()}, and closes ${pod ? "with trust if access held throughout" : "warmly if the final impression is deliberate"}.`,
    spend_profile: { aed_range: vip ? "AED 500–2,000+" : family ? "AED 150–320 (group)" : "AED 80–200", dwell: vip ? "60–120 min" : family ? "120–160 min" : "100–150 min", engagement: vip ? "Curated, hosted, high-value." : family ? "Burst-based with a mid-visit reset; strong F&B/retail." : "Steady engagement with considered secondary spend." },
    channel_preferences: [
      { rank: 1, channel: vip ? "Relationship manager / concierge" : "Website / mobile app", why: vip ? "Bespoke handling via a named human." : "Plans and books before arrival." },
      { rank: 2, channel: "On-site app + signage", why: "Real-time orientation and information." },
      { rank: 3, channel: "Front-of-house staff", why: "Human backstop for help and reassurance." },
    ],
    cultural_language: intl ? "Non-native; relies on multilingual and visual cues. In-region, group travel and translation reliance are common." : "Local-language comfortable; values Arabic-first signage in-region as authenticity.",
    accessibility_needs: pod ? "Step-free hero route, accessible toilets/lifts with live status, trained assistance, accessible sightlines." : "Standard access with clear signage and seating.",
    control_sensitivity: `Security: ${vip ? "discreet, pre-cleared screening" : pod ? "screening that respects mobility aids" : "fast, respectful screening"}. F&B: ${family ? "wants to bring children's snacks; values café space" : "values quality café provision"}. Mobile: ${"app reliance is high — connectivity and (no-flash) photography materially affect satisfaction"}.`,
    strategic_value: { revenue: vip ? "Very high (hospitality/partnership)" : family ? "High (group F&B + retail)" : "Medium-high", advocacy: pod ? "Very high in disability communities" : intl ? "Very high internationally" : "High", loyalty: vip ? "High via institutional relationships" : "High — strong membership/repeat potential" },
    benchmark_provenance: lib.benchmarkArchetypes.slice(0, 2).map((a) => `${a.inst} — ${a.title.toLowerCase()} (illustrative)`),
    design_tensions: [
      vip ? "Exclusivity vs. operational crowd flow and inclusivity" : pod ? "Designed-in accessibility vs. existing building/site limits" : "Depth of experience vs. limited time and peak crowding",
      family ? "Child engagement vs. adult depth" : "Personalisation vs. operational simplicity",
    ],
  };
}

function enrichPersona(p, sectorKey, lib) {
  const sectorDepth = (PERSONA_DEPTH[sectorKey] || {})[p.id];
  return sectorDepth || personaDepthFallback(p, lib);
}

// ── Touchpoint-level enrichment helpers (Stage 4 depth) ──
function tpEmotionLabel(emotion, sentiment) {
  if (sentiment >= 75) return "Delight";
  if (sentiment >= 60) return "Engaged";
  if (sentiment >= 45) return emotion ? cap(emotion) : "Neutral";
  if (sentiment >= 32) return "Uncertainty";
  return "Frustration";
}
function cap(s) { return (s || "").charAt(0).toUpperCase() + (s || "").slice(1); }
function tpGoal(name, stageKey, p) {
  const pod = !!p.pod_flag;
  const goals = {
    pre_visit: `Prepare confidently for "${name.toLowerCase()}" before arriving.`,
    arrival: pod ? `Get through "${name.toLowerCase()}" smoothly with accessible support.` : `Move through "${name.toLowerCase()}" quickly and orient.`,
    core_experience: `Get real value from "${name.toLowerCase()}".`,
    exit_departure: `Close out "${name.toLowerCase()}" on a positive note.`,
    post_visit: `Act on "${name.toLowerCase()}" — reflect, share or return.`,
  };
  return goals[stageKey] || `Complete "${name.toLowerCase()}" easily.`;
}
function tpExpected(name, stageKey, p, channel) {
  const ch = (channel || "").toLowerCase();
  const base = ch === "digital" ? "A fast, clear, mobile-friendly interaction" : ch === "human" ? "A warm, competent, briefed staff interaction" : ch === "hybrid" ? "A seamless blend of digital and in-person cues" : "A well-signed, intuitive physical experience";
  return `${base} that makes "${name.toLowerCase()}" effortless and reassuring.`;
}
function tpFriction(name, stageKey, p, pod, vip) {
  if (pod && (stageKey === "arrival" || stageKey === "core_experience")) return `No step-free route or unclear accessible signage at "${name.toLowerCase()}", forcing the visitor to ask for help.`;
  if (vip && stageKey === "arrival") return `Any public queue or unbriefed staff at "${name.toLowerCase()}" signals their time isn't valued.`;
  const f = {
    pre_visit: `Confusing or incomplete information makes "${name.toLowerCase()}" frustrating before arrival.`,
    arrival: `Queues, unclear signage or slow processing turn "${name.toLowerCase()}" into a stress point.`,
    core_experience: `Crowding, shallow content or poor wayfinding undermines "${name.toLowerCase()}".`,
    exit_departure: `A rushed or purely transactional "${name.toLowerCase()}" leaves a flat final impression.`,
    post_visit: `Generic or mistimed follow-up makes "${name.toLowerCase()}" feel impersonal.`,
  };
  return f[stageKey] || `Friction at "${name.toLowerCase()}" lowers satisfaction.`;
}
function tpDelight(name, stageKey, p, vip) {
  if (vip) return `Anticipated, personalised handling at "${name.toLowerCase()}" that feels effortless and exclusive.`;
  const d = {
    pre_visit: `Clear, inviting content makes "${name.toLowerCase()}" build genuine anticipation.`,
    arrival: `A warm, fast, well-orchestrated "${name.toLowerCase()}" sets a confident tone.`,
    core_experience: `A memorable, well-paced "${name.toLowerCase()}" becomes the emotional peak of the visit.`,
    exit_departure: `A deliberate, warm "${name.toLowerCase()}" leaves a lasting positive memory.`,
    post_visit: `A timely, personal "${name.toLowerCase()}" turns satisfaction into advocacy.`,
  };
  return d[stageKey] || `A thoughtful "${name.toLowerCase()}" delights the visitor.`;
}

/* ============================================================================
   PERSONA-SPECIFIC MoT + KPI ENGINE (Part 2 — anti-templatization)
   Each persona gets a DISTINCT MoT set (5-7, covering Conversion/Risk/Delight/
   Loyalty) and DISTINCT KPIs with varied measurement methods (RFID, POS,
   QR micro-survey, CRM, access-log) — never the same set across personas.
   Keyed by persona id; personaMotKpiFallback() derives by archetype for any
   persona/sector not explicitly authored, using motivation + constraints.
   ============================================================================ */

// Measurement-method pool so KPIs never all read "survey".
const MEAS = {
  rfid: "RFID wristband / badge tracking",
  pos: "POS transaction data",
  qr: "QR-triggered micro-survey at the touchpoint",
  crm: "CRM / membership system data",
  app: "App analytics & in-app event tracking",
  access: "Access-control / lift-status logs",
  social: "Social listening & UGC share tracking",
  staff: "Staff observation log + mystery visitor",
  queue: "Queue-sensor / dwell-camera analytics",
  protocol: "Protocol checklist sign-off (manual audit)",
};

// Author the distinctive MoT+KPI sets for the 8 named cultural-heritage personas.
const PERSONA_MOT_KPI = {
  // P-01 Curious Explorer — depth + self-direction
  "P-01": [
    { type: "Conversion", name: "Pre-visit object discovery", stage: "Pre-Visit", touchpoint: "Collection pages", why: "Whether they find the specific objects worth planning a visit around determines if they come and how deeply they engage.", interventions: ["Surface flagship objects with rich pre-visit pages", "Let users build a personal must-see route", "Show real-time gallery-open status"], failure_link: "Pre-visit info gap", benchmark: "Smithsonian — layered digital interpretation (illustrative)", kpi: { name: "Pre-Visit Route Build Rate", definition: "Share of explorers who build/save a personal route before arrival.", metric_type: "Conversion %", formula: "(routes built / unique planners) × 100", tiers: { minimum: "15%", good: "30%", world_class: "45%" }, measurement: MEAS.app, frequency: "Weekly", owner: "Digital Experience Lead", escalation: "<15% for 2 weeks → review pre-visit content" } },
    { type: "Delight", name: "The unplanned 'find'", stage: "Core Experience", touchpoint: "Gallery engagement", why: "Their peak is discovering an object they didn't know they'd love — the emotional core of a self-paced visit.", interventions: ["Seed serendipity with 'if you liked X, seek out Y' cues", "Protect low-density dwell windows", "Layered labels (quick + deep-dive)"], failure_link: "Shallow interpretation only", benchmark: "Louvre — timed entry protecting dwell (illustrative)", kpi: { name: "Deep-Dwell Object Count", definition: "Avg number of objects per visit with dwell ≥ 3 min.", metric_type: "Engagement count", formula: "Σ objects dwell≥3min / visitors", tiers: { minimum: "4", good: "7", world_class: "10" }, measurement: MEAS.app, frequency: "Monthly", owner: "Curatorial / Experience", escalation: "Below minimum → review interpretation depth" } },
    { type: "Risk", name: "Peak-density crowding", stage: "Core Experience", touchpoint: "Flagship gallery", why: "Crowding at headline galleries destroys the dwell quality this persona visits for.", interventions: ["Concurrency cap via timed entry", "Live density nudges to quieter galleries", "Extended/quiet hours"], failure_link: "Group flow collision", benchmark: "Louvre — timed entry (illustrative)", kpi: { name: "Flagship Gallery Density", definition: "Peak occupancy vs comfortable capacity at flagship galleries.", metric_type: "Utilisation %", formula: "(peak occupancy / comfort capacity) × 100", tiers: { minimum: "≤95%", good: "≤80%", world_class: "≤70%" }, measurement: MEAS.queue, frequency: "Daily (peak)", owner: "Operations", escalation: ">95% → trigger flow controls" } },
    { type: "Loyalty", name: "Membership convert moment", stage: "Post-Visit", touchpoint: "Membership / follow-up", why: "A satisfied explorer is a prime membership convert — the loyalty value is high if captured promptly.", interventions: ["Timed post-visit membership offer referencing objects they viewed", "Member-only deep-dive content", "Early-access exhibition invites"], failure_link: "Pre-visit info gap", benchmark: "British Museum — patron programmes (illustrative)", kpi: { name: "Visit-to-Membership Conversion", definition: "Share of repeat-eligible explorers converting to membership within 30 days.", metric_type: "Conversion %", formula: "(conversions / eligible visitors) × 100", tiers: { minimum: "3%", good: "7%", world_class: "12%" }, measurement: MEAS.crm, frequency: "Monthly", owner: "Membership", escalation: "<3% → review post-visit journey" } },
  ],
  // P-09 Deep Learning Seeker — scholarly depth
  "P-09": [
    { type: "Conversion", name: "Depth-layer access", stage: "Core Experience", touchpoint: "Interpretation / study", why: "Finding the scholarly layer (not just surface labels) is what converts a researcher's visit from disappointing to valuable.", interventions: ["Deep-dive interpretation behind every flagship label", "Curator/specialist contact route", "Primary-source / study-room access"], failure_link: "Shallow interpretation only", benchmark: "British Museum — study rooms & scholarly access (illustrative)", kpi: { name: "Deep-Content Engagement Rate", definition: "Share of researchers accessing deep-dive/scholarly layer.", metric_type: "Engagement %", formula: "(deep-layer sessions / researcher visits) × 100", tiers: { minimum: "40%", good: "65%", world_class: "85%" }, measurement: MEAS.app, frequency: "Monthly", owner: "Curatorial", escalation: "<40% → expand depth layer" } },
    { type: "Delight", name: "Sustained close study", stage: "Core Experience", touchpoint: "Gallery / study space", why: "Their satisfaction is intellectual and sustained — long, uninterrupted study of few objects.", interventions: ["Quiet study conditions / seating", "Allow research photography", "Specialist on-call"], failure_link: "Seating scarcity", benchmark: "Smithsonian — open-access collections (illustrative)", kpi: { name: "Exhibit Dwell Time (focus objects)", definition: "Avg dwell at the visitor's focus objects.", metric_type: "Duration (min)", formula: "Σ dwell at focus objects / sessions", tiers: { minimum: "12 min", good: "18 min", world_class: "25 min" }, measurement: MEAS.app, frequency: "Monthly", owner: "Curatorial / Experience", escalation: "<12 min → review study conditions" } },
    { type: "Risk", name: "Noise & interruption", stage: "Core Experience", touchpoint: "Galleries", why: "Crowds and noise prevent the concentration their visit depends on.", interventions: ["Designated quiet study windows", "Acoustic management in study areas", "Group-routing away from study zones"], failure_link: "Group flow collision", benchmark: "Tate — quiet/off-peak slots (illustrative)", kpi: { name: "Study-Zone Noise Complaints", definition: "Noise/interruption complaints per 1,000 researcher visits.", metric_type: "Rate", formula: "(complaints / researcher visits) × 1000", tiers: { minimum: "≤8", good: "≤4", world_class: "≤1" }, measurement: MEAS.staff, frequency: "Monthly", owner: "Visitor Services", escalation: ">8 → review zoning" } },
    { type: "Loyalty", name: "Specialist relationship", stage: "Post-Visit", touchpoint: "Follow-up / publications", why: "Researchers return for the same depth and become specialist advocates and patrons.", interventions: ["Researcher CRM with specialist follow-up", "Publication / acquisition alerts", "Reading-room privileges"], failure_link: "Pre-visit info gap", benchmark: "British Museum — scholarly access programmes (illustrative)", kpi: { name: "Researcher Repeat Rate", definition: "Share of researchers returning within 12 months.", metric_type: "Retention %", formula: "(returning researchers / prior-year researchers) × 100", tiers: { minimum: "25%", good: "45%", world_class: "65%" }, measurement: MEAS.crm, frequency: "Quarterly", owner: "Research Services", escalation: "<25% → review depth offer" } },
  ],
  // P-10 Family with Young Children — comfort, queue, F&B
  "P-10": [
    { type: "Risk", name: "Pre-visit queue meltdown", stage: "Arrival", touchpoint: "Entry queue", why: "A long entry queue triggers a child meltdown that can derail the entire visit before it starts.", interventions: ["Family timed-entry lane", "Queue entertainment / shade / seating", "Pre-book family tickets to skip the line"], failure_link: "Arrival bottleneck", benchmark: "Expo 2020 — pram-friendly circulation (illustrative)", kpi: { name: "Family Entry Wait Time", definition: "Avg entry-to-gallery time for family groups.", metric_type: "Duration (min)", formula: "Σ entry time / family groups", tiers: { minimum: "≤15 min", good: "≤8 min", world_class: "≤4 min" }, measurement: MEAS.queue, frequency: "Daily (peak)", owner: "Operations", escalation: ">15 min → open family lane" } },
    { type: "Delight", name: "Hands-on exhibit lands", stage: "Core Experience", touchpoint: "Interactive gallery", why: "When a hands-on exhibit captivates the children, the whole family's visit succeeds.", interventions: ["Age-appropriate interactives", "Family trail / activity sheet", "Photo moment with the children"], failure_link: "Mid-visit fatigue, no recovery", benchmark: "Science Museum Group — hands-on galleries (illustrative)", kpi: { name: "Family Interactive Engagement", definition: "Share of family visits engaging ≥2 hands-on exhibits.", metric_type: "Engagement %", formula: "(families ≥2 interactives / family visits) × 100", tiers: { minimum: "55%", good: "75%", world_class: "90%" }, measurement: MEAS.app, frequency: "Monthly", owner: "Learning / Experience", escalation: "<55% → review family programming" } },
    { type: "Conversion", name: "F&B / comfort reset", stage: "Core Experience", touchpoint: "Café / facilities", why: "A well-timed food/rest stop prevents fatigue collapse and drives strong family F&B spend.", interventions: ["Family F&B at the journey midpoint", "Baby-change & feeding spaces", "Kids menu + allow own snacks"], failure_link: "Mid-visit fatigue, no recovery", benchmark: "National Trust — rest-point density (illustrative)", kpi: { name: "Family F&B Spend / Visit", definition: "Avg F&B spend per family group.", metric_type: "Revenue (AED)", formula: "family F&B revenue / family groups", tiers: { minimum: "AED 60", good: "AED 110", world_class: "AED 170" }, measurement: MEAS.pos, frequency: "Weekly", owner: "Commercial", escalation: "<AED 60 → review F&B placement" } },
    { type: "Loyalty", name: "Family membership / repeat", stage: "Post-Visit", touchpoint: "Membership", why: "Families that had a smooth day convert to family membership and repeat in school holidays.", interventions: ["Family membership offer at exit", "School-holiday programming alerts", "Loyalty rewards for repeat family visits"], failure_link: "Transactional farewell", benchmark: "Science Museum Group — family membership (illustrative)", kpi: { name: "Family Membership Conversion", definition: "Share of family visits converting to family membership in 30 days.", metric_type: "Conversion %", formula: "(family conversions / family visits) × 100", tiers: { minimum: "4%", good: "9%", world_class: "15%" }, measurement: MEAS.crm, frequency: "Monthly", owner: "Membership", escalation: "<4% → review family value proposition" } },
  ],
  // P-12 International Tourist — language, icons, payment, sharing
  "P-12": [
    { type: "Conversion", name: "Frictionless international ticketing", stage: "Pre-Visit", touchpoint: "Booking / payment", why: "Foreign-card or language friction at booking loses the international visitor before arrival.", interventions: ["Multilingual booking flow", "International cards & wallets", "Clear what's-included pricing"], failure_link: "Foreign-payment friction", benchmark: "Expo 2020 — contactless international payment (illustrative)", kpi: { name: "International Booking Completion", definition: "Booking completion rate for international (non-local-card) sessions.", metric_type: "Conversion %", formula: "(intl bookings completed / intl checkout starts) × 100", tiers: { minimum: "70%", good: "85%", world_class: "94%" }, measurement: MEAS.app, frequency: "Weekly", owner: "Digital / Commercial", escalation: "<70% → audit payment flow" } },
    { type: "Risk", name: "Language-gap wayfinding", stage: "Arrival", touchpoint: "Signage / orientation", why: "Local-language-only signage causes the tourist to miss must-see icons and feel lost.", interventions: ["Multilingual + pictographic wayfinding", "Multilingual app maps", "Visual must-see trail"], failure_link: "Language-only signage", benchmark: "Louvre — multilingual flagship routing (illustrative)", kpi: { name: "Icon Coverage Rate", definition: "Share of international visitors reaching all flagged must-see objects.", metric_type: "Coverage %", formula: "(intl visitors hitting all icons / intl visits) × 100", tiers: { minimum: "60%", good: "80%", world_class: "92%" }, measurement: MEAS.app, frequency: "Monthly", owner: "Interpretation", escalation: "<60% → review multilingual wayfinding" } },
    { type: "Delight", name: "The iconic photo moment", stage: "Core Experience", touchpoint: "Flagship object", why: "Capturing and later sharing the iconic moment is the trip's status-affirming peak.", interventions: ["Designed photo spot at the icon", "No-flash photography permitted", "Multilingual 'about this object' card"], failure_link: "Photography ban", benchmark: "Museum of the Future — shareable moments (illustrative)", kpi: { name: "Icon Photo-Share Rate", definition: "Share of international visitors capturing/sharing the flagship moment.", metric_type: "Engagement %", formula: "(shares or captures / intl visits) × 100", tiers: { minimum: "20%", good: "40%", world_class: "60%" }, measurement: MEAS.social, frequency: "Monthly", owner: "Marketing", escalation: "<20% → review photo experience" } },
    { type: "Loyalty", name: "International review advocacy", stage: "Post-Visit", touchpoint: "Reviews / social", why: "One-time visitors rarely return but drive global reputation via reviews — the loyalty value is reputational.", interventions: ["Multilingual post-visit review prompt", "Shareable trip recap", "Geo-targeted re-engagement for repeat trips"], failure_link: "Transactional farewell", benchmark: "Louvre — international reputation management (illustrative)", kpi: { name: "International Review Rate", definition: "Reviews per 1,000 international visitors (rating ≥4).", metric_type: "Rate", formula: "(positive intl reviews / intl visitors) × 1000", tiers: { minimum: "8", good: "18", world_class: "30" }, measurement: MEAS.social, frequency: "Monthly", owner: "Marketing", escalation: "<8 → review post-visit prompt" } },
  ],
  // P-14 Senior Visitor — comfort, seating, legibility, calm
  "P-14": [
    { type: "Risk", name: "Fatigue / seating scarcity", stage: "Core Experience", touchpoint: "Gallery route", why: "Too few rest points force an early exit, cutting the visit and spend short.", interventions: ["Seating at every key gallery", "Rest-point density audit", "Step-minimised route signed"], failure_link: "Seating scarcity", benchmark: "National Trust — rest-point density (illustrative)", kpi: { name: "Rest-Point Availability", definition: "Share of galleries with seating within 30m.", metric_type: "Coverage %", formula: "(galleries with seating ≤30m / galleries) × 100", tiers: { minimum: "70%", good: "88%", world_class: "98%" }, measurement: MEAS.staff, frequency: "Quarterly", owner: "Facilities", escalation: "<70% → add seating" } },
    { type: "Conversion", name: "Calm off-peak slot", stage: "Pre-Visit", touchpoint: "Booking", why: "Offering calm, quiet slots converts crowd-averse seniors who'd otherwise not visit.", interventions: ["Promote quiet off-peak windows", "Phone/box-office booking option", "Large-type confirmation"], failure_link: "Pre-visit info gap", benchmark: "Tate — off-peak quiet slots (illustrative)", kpi: { name: "Off-Peak Senior Bookings", definition: "Share of senior bookings in promoted quiet slots.", metric_type: "Share %", formula: "(senior off-peak bookings / senior bookings) × 100", tiers: { minimum: "30%", good: "50%", world_class: "70%" }, measurement: MEAS.crm, frequency: "Monthly", owner: "Commercial", escalation: "<30% → review slot promotion" } },
    { type: "Delight", name: "Meaningful / nostalgic gallery", stage: "Core Experience", touchpoint: "Key gallery", why: "A meaningful or nostalgic gallery, experienced calmly, is the emotional peak.", interventions: ["Legible large-type interpretation", "Good lighting & contrast", "Seated viewing at key works"], failure_link: "Mid-visit fatigue, no recovery", benchmark: "National Trust — legible interpretation (illustrative)", kpi: { name: "Senior Satisfaction (CSAT)", definition: "Senior-visitor satisfaction score.", metric_type: "CSAT %", formula: "(satisfied seniors / surveyed seniors) × 100", tiers: { minimum: "82%", good: "90%", world_class: "96%" }, measurement: MEAS.qr, frequency: "Monthly", owner: "Experience", escalation: "<82% → review comfort provision" } },
    { type: "Loyalty", name: "Community / off-peak loyalty", stage: "Post-Visit", touchpoint: "Membership / community", why: "Comfortable seniors become loyal off-peak members and strong community advocates.", interventions: ["Senior/community membership", "Off-peak loyalty incentives", "Community-group programming"], failure_link: "Transactional farewell", benchmark: "National Trust — community membership (illustrative)", kpi: { name: "Senior Repeat Visit Rate", definition: "Share of seniors revisiting within 6 months.", metric_type: "Retention %", formula: "(returning seniors / prior seniors) × 100", tiers: { minimum: "20%", good: "38%", world_class: "55%" }, measurement: MEAS.crm, frequency: "Quarterly", owner: "Membership", escalation: "<20% → review loyalty offer" } },
  ],
  // P-16 Young Adult / Social — shareability, connectivity, speed
  "P-16": [
    { type: "Delight", name: "The signature shareable moment", stage: "Core Experience", touchpoint: "Signature installation", why: "A genuinely photogenic moment is the core reason they came and the engine of organic reach.", interventions: ["Designed 'grammable installation", "Good lighting for photos", "Open photography policy"], failure_link: "Photography ban", benchmark: "Museum of the Future — signature shareable moments (illustrative)", kpi: { name: "Content Share Rate", definition: "Share of young-adult visits producing a public social share.", metric_type: "Engagement %", formula: "(visits with shares / young-adult visits) × 100", tiers: { minimum: "12%", good: "25%", world_class: "40%" }, measurement: MEAS.social, frequency: "Weekly", owner: "Marketing", escalation: "<12% → review signature moments" } },
    { type: "Risk", name: "Connectivity dead zone", stage: "Core Experience", touchpoint: "Galleries / Wi-Fi", why: "Dead Wi-Fi blocks real-time sharing — the value loop collapses.", interventions: ["Venue-wide Wi-Fi", "Connectivity at signature moments", "Offline-capable app"], failure_link: "Connectivity dead zones", benchmark: "Expo 2020 — site-wide connectivity (illustrative)", kpi: { name: "Wi-Fi Coverage at Hotspots", definition: "Share of signature moments with reliable Wi-Fi (≥10 Mbps).", metric_type: "Coverage %", formula: "(hotspots with reliable Wi-Fi / hotspots) × 100", tiers: { minimum: "80%", good: "95%", world_class: "100%" }, measurement: MEAS.app, frequency: "Weekly", owner: "IT / Digital", escalation: "<80% → network remediation" } },
    { type: "Conversion", name: "Fast cashless flow", stage: "Arrival", touchpoint: "Mobile ticketing / POS", why: "A formal or slow, cash-based flow reads as 'not for me' and kills momentum.", interventions: ["Mobile-first ticketing", "Cashless everything", "Contemporary tone of voice"], failure_link: "Foreign-payment friction", benchmark: "teamLab — phone-first social design (illustrative)", kpi: { name: "Mobile Ticket Adoption", definition: "Share of young-adult entries via mobile ticket.", metric_type: "Adoption %", formula: "(mobile entries / young-adult entries) × 100", tiers: { minimum: "60%", good: "80%", world_class: "92%" }, measurement: MEAS.app, frequency: "Monthly", owner: "Digital", escalation: "<60% → review mobile flow" } },
    { type: "Loyalty", name: "Return for the next 'drop'", stage: "Post-Visit", touchpoint: "Social / exhibitions", why: "They return for new exhibitions/'drops' and amplify each one socially.", interventions: ["Exhibition-drop alerts via social", "Creator / UGC partnerships", "Member previews for new shows"], failure_link: "Transactional farewell", benchmark: "Museum of the Future — exhibition drops (illustrative)", kpi: { name: "Exhibition Repeat Rate", definition: "Share of young adults returning for a new exhibition within 6 months.", metric_type: "Retention %", formula: "(returning / prior young adults) × 100", tiers: { minimum: "15%", good: "30%", world_class: "48%" }, measurement: MEAS.crm, frequency: "Quarterly", owner: "Marketing", escalation: "<15% → review drop calendar" } },
  ],
  // P-18 POD — Mobility — accessibility & dignity
  "P-18": [
    { type: "Conversion", name: "Pre-visit accessibility confidence", stage: "Pre-Visit", touchpoint: "Accessibility webpage", why: "Whether the access info is detailed and trustworthy decides if they visit at all.", interventions: ["Detailed step-free route maps online", "Live lift/facility status", "Contactable access team"], failure_link: "Pre-visit info gap", benchmark: "Smithsonian — published accessibility maps (illustrative)", kpi: { name: "Accessibility Page → Visit Rate", definition: "Share of access-page visitors who book.", metric_type: "Conversion %", formula: "(bookings from access page / access-page visitors) × 100", tiers: { minimum: "8%", good: "18%", world_class: "30%" }, measurement: MEAS.app, frequency: "Monthly", owner: "Accessibility Lead", escalation: "<8% → improve access info" } },
    { type: "Risk", name: "Broken step-free route", stage: "Core Experience", touchpoint: "Lift / accessible route", why: "An out-of-service lift or dead-end route collapses trust instantly and mid-visit.", interventions: ["Live lift status in app + signage", "Preventive lift maintenance SLA", "Trained staff redirect plan"], failure_link: "Out-of-service lift, no live status", benchmark: "Expo 2020 — People-of-Determination programme (illustrative)", kpi: { name: "Accessible Route Completion", definition: "Share of POD visitors completing the step-free route unassisted.", metric_type: "Completion %", formula: "(unassisted completions / POD visits) × 100", tiers: { minimum: "90%", good: "95%", world_class: "99%" }, measurement: MEAS.access, frequency: "Weekly", owner: "Accessibility Lead", escalation: "<90% → urgent route audit" } },
    { type: "Delight", name: "Dignity-preserving assistance", stage: "Core Experience", touchpoint: "Staff interaction", why: "Help offered proactively and with dignity (without asking twice) defines a great POD visit.", interventions: ["Disability-awareness staff training", "Proactive, non-intrusive offers of help", "Wheelchair-height sightlines"], failure_link: "Accessibility afterthought", benchmark: "Smithsonian — accessible service design (illustrative)", kpi: { name: "POD Dignity / Satisfaction", definition: "POD-visitor satisfaction with assistance & dignity.", metric_type: "CSAT %", formula: "(satisfied POD visitors / surveyed) × 100", tiers: { minimum: "85%", good: "93%", world_class: "98%" }, measurement: MEAS.qr, frequency: "Monthly", owner: "Accessibility Lead", escalation: "<85% → review training" } },
    { type: "Loyalty", name: "Trusted-venue advocacy", stage: "Post-Visit", touchpoint: "Community / follow-up", why: "When access is reliable, POD visitors become loyal and influential advocates in disability communities.", interventions: ["Accessible-format follow-up", "Co-design panel invitation", "Community-group partnerships"], failure_link: "Pre-visit info gap", benchmark: "Expo 2020 — POD community engagement (illustrative)", kpi: { name: "POD Advocacy / Repeat", definition: "Share of POD visitors recommending or returning within 12 months.", metric_type: "Advocacy %", formula: "(advocate+return POD / POD visitors) × 100", tiers: { minimum: "30%", good: "50%", world_class: "70%" }, measurement: MEAS.crm, frequency: "Quarterly", owner: "Accessibility Lead", escalation: "<30% → review reliability" } },
  ],
  // P-03 Corporate C-Suite — hosted, time-efficient, discreet
  "P-03": [
    { type: "Risk", name: "Public-queue exposure", stage: "Arrival", touchpoint: "Entry / fast-track", why: "Any public queue signals their time isn't valued — an immediate service-failure perception.", interventions: ["Discreet fast-track entry", "Escorted arrival from drop-off", "Pre-cleared security"], failure_link: "VIP queue exposure", benchmark: "Louvre Abu Dhabi — VIP hosting (illustrative)", kpi: { name: "VIP Arrival Wait", definition: "Time from arrival to escorted entry for hosted guests.", metric_type: "Duration (min)", formula: "Σ arrival-to-entry / hosted guests", tiers: { minimum: "≤5 min", good: "≤2 min", world_class: "0 (seamless)" }, measurement: MEAS.staff, frequency: "Per visit", owner: "VIP Relations", escalation: ">5 min → review hosting SLA" } },
    { type: "Delight", name: "Curated privileged moment", stage: "Core Experience", touchpoint: "Private viewing / curator", why: "A private viewing or curator time is the high-status peak that justifies the hosted visit.", interventions: ["Curator-led private viewing", "After-hours access option", "Tailored route to their interests"], failure_link: "VIP queue exposure", benchmark: "British Museum — patron after-hours programmes (illustrative)", kpi: { name: "Hosted Experience Rating", definition: "Post-visit rating from hosted executives.", metric_type: "Rating /10", formula: "Σ host ratings / hosted guests", tiers: { minimum: "8.0", good: "9.0", world_class: "9.6" }, measurement: MEAS.crm, frequency: "Per visit", owner: "VIP Relations", escalation: "<8.0 → review hosting" } },
    { type: "Conversion", name: "Hospitality / partnership uptake", stage: "Post-Visit", touchpoint: "Relationship follow-up", why: "The visit's commercial purpose is corporate partnership, patronage or event booking.", interventions: ["Tailored partnership follow-up", "Corporate membership / venue-hire offer", "Named relationship manager"], failure_link: "Transactional farewell", benchmark: "Louvre Abu Dhabi — corporate patronage (illustrative)", kpi: { name: "Partnership Conversion", definition: "Share of hosted C-suite visits leading to a partnership/booking in 90 days.", metric_type: "Conversion %", formula: "(partnerships / hosted visits) × 100", tiers: { minimum: "10%", good: "25%", world_class: "40%" }, measurement: MEAS.crm, frequency: "Quarterly", owner: "Development", escalation: "<10% → review follow-up" } },
    { type: "Loyalty", name: "Institutional relationship", stage: "Post-Visit", touchpoint: "Patron programme", why: "Loyalty is institutional — sustained patronage and repeat corporate engagement.", interventions: ["Patron-tier programme", "Board/leadership engagement", "Priority event invitations"], failure_link: "VIP queue exposure", benchmark: "British Museum — corporate patron programme (illustrative)", kpi: { name: "Patron Retention", definition: "Corporate/patron relationship retention year-on-year.", metric_type: "Retention %", formula: "(retained patrons / prior patrons) × 100", tiers: { minimum: "70%", good: "85%", world_class: "95%" }, measurement: MEAS.crm, frequency: "Annual", owner: "Development", escalation: "<70% → relationship review" } },
  ],
  // P-01-VVIP Head of State — protocol, security, private
  "P-01-VVIP": [
    { type: "Risk", name: "Protocol / security adherence", stage: "Arrival", touchpoint: "Private entry / security", why: "A protocol or security lapse for a head of state is a diplomatic and reputational crisis.", interventions: ["Pre-cleared protocol plan & rehearsal", "Dedicated security coordination", "Private routing & controlled access"], failure_link: "Protocol / security lapse", benchmark: "State-visit protocol practice (illustrative)", kpi: { name: "Protocol Compliance", definition: "Adherence to the agreed protocol & security checklist.", metric_type: "Compliance %", formula: "(checklist items met / total) × 100", tiers: { minimum: "100%", good: "100%", world_class: "100% + contingency rehearsed" }, measurement: MEAS.protocol, frequency: "Per visit", owner: "Protocol / Security Lead", escalation: "Any miss → immediate escalation to director" } },
    { type: "Conversion", name: "Seamless private arrival", stage: "Arrival", touchpoint: "Motorcade / drop-off", why: "The first minutes (motorcade → private entry → escort) are the make-or-break of the entire visit.", interventions: ["Controlled motorcade drop-off", "Private entrance & escort", "Liaison briefed on every step"], failure_link: "VIP queue exposure", benchmark: "Louvre Abu Dhabi — head-of-state hosting (illustrative)", kpi: { name: "Private Arrival Execution", definition: "Arrival sequence executed to plan without deviation.", metric_type: "Execution %", formula: "(steps to plan / planned steps) × 100", tiers: { minimum: "100%", good: "100%", world_class: "100% + sub-minute timing" }, measurement: MEAS.protocol, frequency: "Per visit", owner: "Protocol Lead", escalation: "Any deviation → post-visit review" } },
    { type: "Delight", name: "Cultural-diplomacy moment", stage: "Core Experience", touchpoint: "Private curated viewing", why: "A bespoke, dignified cultural moment delivers the diplomatic and legacy value of the visit.", interventions: ["Director/curator-led private viewing", "Culturally significant programming", "Bespoke gift / commemoration"], failure_link: "Protocol / security lapse", benchmark: "National museum state-visit programmes (illustrative)", kpi: { name: "Dignitary Experience Assurance", definition: "Director-level sign-off that the curated moment met expectations.", metric_type: "Assurance (Y/N→%)", formula: "(visits meeting bar / visits) × 100", tiers: { minimum: "100%", good: "100%", world_class: "100% + commendation" }, measurement: MEAS.protocol, frequency: "Per visit", owner: "Director's Office", escalation: "Any shortfall → director review" } },
    { type: "Loyalty", name: "Diplomatic / institutional legacy", stage: "Post-Visit", touchpoint: "Diplomatic follow-up", why: "Loyalty here is diplomatic relationship and institutional reputation, not repeat footfall.", interventions: ["Formal diplomatic follow-up", "Commemorative documentation", "Ongoing cultural-exchange dialogue"], failure_link: "Protocol / security lapse", benchmark: "Cultural-diplomacy practice (illustrative)", kpi: { name: "Diplomatic Relationship Outcome", definition: "Positive diplomatic/institutional outcome recorded post-visit.", metric_type: "Qualitative → %", formula: "(positive outcomes / state visits) × 100", tiers: { minimum: "90%", good: "100%", world_class: "100% + future collaboration" }, measurement: MEAS.protocol, frequency: "Per visit", owner: "Director's Office", escalation: "Any negative → diplomatic review" } },
  ],
};

// Fallback: derive a distinct 4-MoT set by persona archetype for any persona/
// sector not explicitly authored, anchored in their motivation + constraints.
function personaMotKpiFallback(p, lib) {
  const pod = !!p.pod_flag;
  const vip = (p.tier || "").includes("VIP") || (p.tier || "").includes("VVIP");
  const family = /family/i.test((p.segment || "") + (p.name || ""));
  const social = /social|young|group/i.test((p.archetype || "") + (p.name || ""));
  const intl = /tourist|international|overseas|non-native/i.test((p.archetype || "") + (p.segment || ""));
  const fz = lib.frictionZones;
  const fzName = (i) => fz[i % fz.length]?.zone || "the visit";
  const fzRec = (i) => fz[i % fz.length]?.recommendation || "Improve this step.";
  const meas = vip ? MEAS.protocol : pod ? MEAS.access : social ? MEAS.social : family ? MEAS.pos : intl ? MEAS.app : MEAS.qr;
  const motivation = (p.motivation || "a valuable visit").toLowerCase();
  return [
    { type: vip ? "Risk" : "Conversion", name: `Securing ${motivation}`, stage: "Pre-Visit", touchpoint: "Planning / booking",
      why: `This persona visits for ${motivation}; whether they can confidently secure it up front determines the visit.`,
      interventions: [fzRec(0), "Set accurate expectations pre-arrival", vip ? "Hosted, pre-arranged access" : "Frictionless booking"],
      failure_link: "Pre-visit info gap", benchmark: (lib.benchmarkArchetypes[0]?.inst || "Sector leader") + " (illustrative)",
      kpi: { name: `${cap(motivation)} Booking Rate`, definition: `Share of this persona securing their goal pre-visit.`, metric_type: "Conversion %", formula: "(secured / attempts) × 100", tiers: { minimum: "65%", good: "82%", world_class: "93%" }, measurement: MEAS.app, frequency: "Weekly", owner: "Digital / Commercial", escalation: "<65% → review booking flow" } },
    { type: "Risk", name: `${fzName(0)} breakdown`, stage: "Arrival", touchpoint: fzName(0),
      why: `${fzName(0)} is this persona's most acute friction and the biggest threat to the visit.`,
      interventions: [fzRec(0), pod ? "Live accessible-route status" : "Real-time flow management", "Trained recovery plan"],
      failure_link: fz[0]?.zone || "Arrival bottleneck", benchmark: (lib.benchmarkArchetypes[1]?.inst || "Sector leader") + " (illustrative)",
      kpi: { name: `${fzName(0)} Failure Rate`, definition: `Rate of friction events at ${fzName(0).toLowerCase()} for this persona.`, metric_type: "Rate", formula: "(events / visits) × 100", tiers: { minimum: "≤10%", good: "≤5%", world_class: "≤2%" }, measurement: pod ? MEAS.access : MEAS.queue, frequency: "Daily (peak)", owner: "Operations", escalation: ">10% → trigger controls" } },
    { type: "Delight", name: `Peak: ${motivation}`, stage: "Core Experience", touchpoint: "Core experience",
      why: `Delivering ${motivation} at the core is this persona's emotional peak and the heart of their visit.`,
      interventions: [lib.levers?.[0]?.name || "Deploy the top design lever", "Protect the emotional peak", social ? "Make it shareable" : "Personalise to their interest"],
      failure_link: "Mid-visit fatigue, no recovery", benchmark: (lib.benchmarkArchetypes[3]?.inst || lib.benchmarkArchetypes[0]?.inst || "Sector leader") + " (illustrative)",
      kpi: { name: social ? "Content Share Rate" : pod ? "Assisted-Free Completion" : "Peak Satisfaction", definition: `How well the core delivers ${motivation}.`, metric_type: social ? "Engagement %" : "CSAT %", formula: "(positive / total) × 100", tiers: { minimum: "78%", good: "88%", world_class: "95%" }, measurement: meas, frequency: "Monthly", owner: "Experience", escalation: "<78% → review core experience" } },
    { type: "Loyalty", name: vip ? "Institutional relationship" : "Advocacy & repeat", stage: "Post-Visit", touchpoint: "Follow-up / membership",
      why: vip ? "Loyalty is an institutional relationship, not repeat footfall." : `A great visit turns this persona into a repeat visitor and advocate.`,
      interventions: [vip ? "Patron-tier relationship" : "Timed, personalised follow-up", social ? "Creator partnerships" : "Membership offer", "Re-engagement for their next visit"],
      failure_link: "Transactional farewell", benchmark: (lib.benchmarkArchetypes[lib.benchmarkArchetypes.length - 1]?.inst || "Sector leader") + " (illustrative)",
      kpi: { name: vip ? "Relationship Retention" : "Repeat / Advocacy Rate", definition: "Loyalty outcome for this persona.", metric_type: "Retention %", formula: "(retained+advocates / visitors) × 100", tiers: { minimum: "20%", good: "40%", world_class: "60%" }, measurement: MEAS.crm, frequency: "Quarterly", owner: vip ? "Development" : "Membership", escalation: "<20% → review loyalty journey" } },
  ];
}

// Build the persona-specific MoT + KPI objects for a journey.
function buildPersonaMoTsKPIs(p, sectorKey, lib) {
  const authored = PERSONA_MOT_KPI[p.id];
  const set = authored || personaMotKpiFallback(p, lib);
  const moments_of_truth = set.map((m, i) => ({
    id: `${p.id}-MoT-${i + 1}`,
    name: m.name, stage: m.stage, touchpoint: m.touchpoint,
    classification: m.type === "Risk" ? "Critical" : m.type === "Conversion" ? "High" : m.type === "Delight" ? "Medium" : "Low",
    mot_type: m.type,
    reason_detected: m.why,
    impact: m.why,
    risk: m.type === "Risk" ? m.why : `Failure here weakens ${(p.name || "this persona").toLowerCase()}'s ${m.type.toLowerCase()} outcome.`,
    recommendation: m.interventions.join(" · "),
    interventions: m.interventions,
    failure_link: m.failure_link,
    benchmark: m.benchmark,
    owner: m.kpi.owner,
  }));
  const kpis = set.map((m, i) => ({
    name: m.kpi.name, tier: i === 0 ? "Executive" : i === 1 ? "Operational" : "Management",
    metric_definition: m.kpi.definition, metric_type: m.kpi.metric_type, formula: m.kpi.formula,
    benchmark_tiers: m.kpi.tiers,
    target: m.kpi.tiers.good,
    measurement_method: m.kpi.measurement,
    frequency: m.kpi.frequency, owner: m.kpi.owner, escalation_trigger: m.kpi.escalation,
    data_source: m.kpi.measurement,
    linked_mot: `${p.id}-MoT-${i + 1}`, linked_mot_name: m.name, mot_type: m.type,
    traffic_light: m.type === "Risk" ? "Amber" : "Green",
  }));
  return { moments_of_truth, kpis };
}
