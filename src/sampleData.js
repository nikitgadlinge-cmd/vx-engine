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
      { title: "Timed-entry flow management", inst: "Leading national museums", takeaway: "Cap concurrency to protect dwell quality." },
      { title: "Narrative-led wayfinding", inst: "Top-tier cultural venues", takeaway: "Wayfinding is part of the story, not separate from it." },
      { title: "Bilingual interactive layer", inst: "International museums", takeaway: "Interpretation in two languages widens engagement." },
    ],
    levers: [
      { name: "Bilingual interpretation", mechanic: "Dual-language labels and interactives.", impact: "+15–20% engagement among non-native speakers." },
      { name: "Step-free hero route", mechanic: "A signposted accessible main route for all.", impact: "Higher POD completion; benefits everyone." },
      { name: "Pre-visit anticipation content", mechanic: "App/email priming before arrival.", impact: "Lower arrival anxiety, higher satisfaction." },
    ],
    failures: [
      { mode: "Arrival bottleneck", cause: "No concurrency control at entry.", consequence: "A poor first impression colours the whole visit.", mitigation: "Timed entry + greeter." },
      { mode: "Accessibility afterthought", cause: "Step-free route added late, not designed in.", consequence: "POD visitors feel excluded.", mitigation: "Design the hero route step-free from the start." },
    ],
    kpiNorms: [
      { name: "Average Dwell Time", low: "60 min", avg: "120 min", high: "180 min", unit: "minutes", outcome: "Engagement" },
      { name: "Net Promoter Score", low: "20", avg: "40", high: "60+", unit: "score", outcome: "Satisfaction" },
      { name: "Secondary Spend / Visitor", low: "low", avg: "moderate", high: "high", unit: "currency", outcome: "Revenue" },
    ],
    personas: [
      { id: "P-01", name: "Curious Explorer", archetype: "Independent Discoverer", tier: "B2C — Regular Visitor", segment: "Adult / couple", motivation: "Deep, self-paced discovery and learning.", secondary_motivation: "Sharing highlights socially.", strategic_value: "High lifetime value and strong advocacy.", description: "Wants to explore at their own pace and go deep on what interests them.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Low — flexible and forgiving.", constraint_flags: [], pod_flag: false, recommended_default: "include" },
      { id: "P-02", name: "Family Learning Organiser", archetype: "Time-pressured Planner", tier: "B2C — Regular Visitor", segment: "Family with children", motivation: "An enjoyable day with educational value.", secondary_motivation: "Keeping children engaged.", strategic_value: "Strong F&B and retail spend; repeat potential.", description: "Coordinates the group and judges success by whether children stayed curious.", journey_complexity: "High", recommended_inclusion: "Recommended", risk_profile: "Medium — sensitive to fatigue and boredom.", constraint_flags: ["Pushchair routing"], pod_flag: false, recommended_default: "include" },
      { id: "P-03", name: "Accessibility-First Visitor", archetype: "POD Companion", tier: "POD", segment: "Person of determination + carer", motivation: "A dignified, barrier-free visit.", secondary_motivation: "Independence wherever possible.", strategic_value: "Inclusion is reputationally and ethically essential.", description: "Needs step-free routing, rest points and clear information.", journey_complexity: "Very High", recommended_inclusion: "Recommended", risk_profile: "High — small failures have large impact.", constraint_flags: ["Wheelchair access", "Rest dependency", "Sensory considerations"], pod_flag: true, recommended_default: "include" },
      { id: "P-04", name: "International Tourist", archetype: "First-time Non-native Speaker", tier: "B2C — Regular Visitor", segment: "Overseas visitor", motivation: "Understand and enjoy despite a language gap.", secondary_motivation: "Iconic, shareable moments.", strategic_value: "Drives international reputation and reviews.", description: "Relies on visual cues and translation; small language frictions compound.", journey_complexity: "Medium", recommended_inclusion: "Recommended", risk_profile: "Medium — language-dependent.", constraint_flags: ["Language support"], pod_flag: false, recommended_default: "include" },
      { id: "P-05", name: "School / Education Group", archetype: "Curriculum-led Visit", tier: "B2B", segment: "Teacher + students", motivation: "Curriculum-linked learning, managed safely.", secondary_motivation: "An inspiring day out.", strategic_value: "Weekday footfall and future family visits.", description: "Large group needing structure, supervision points and learning resources.", journey_complexity: "High", recommended_inclusion: "Secondary", risk_profile: "Medium — group flow affects other visitors.", constraint_flags: ["Group flow", "Supervision"], pod_flag: false, recommended_default: "secondary" },
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
      id: `AP-0${i + 1}`, title: a.title, institution: a.inst, outcome_link: top3[i % top3.length],
      description: a.takeaway, filter_relevance: "High", filter_feasibility: i === 1 ? "Medium" : "High",
      filter_recency: "Current", confidence: i === 2 ? "Medium" : "High", key_takeaway: a.takeaway,
    })),
    journey_inflection_points: lib.moments.map((m, i) => ({
      id: `JIP-0${i + 1}`, stage: m.stage, moment: m.name, institution: "Benchmark venues",
      what_works: m.rec, what_fails: m.risk, confidence: i === 1 ? "Medium" : "High", outcome_link: top3[i % top3.length],
    })),
    proven_design_levers: lib.levers.map((l, i) => ({
      id: `PDL-0${i + 1}`, lever_name: l.name, mechanic: l.mechanic, institution: lib.benchmarkArchetypes[i % lib.benchmarkArchetypes.length].inst,
      measurable_impact: l.impact, confidence: i === 2 ? "Medium" : "High", applicability_note: `Most impactful in a ${lib.label.toLowerCase()} setting.`,
    })),
    operational_benchmarks: lib.kpiNorms.map((k, i) => ({
      id: `OB-0${i + 1}`, kpi: k.name, benchmark_value: `${k.low} – ${k.high} (avg ${k.avg})`, institution: "Sector aggregate",
      context: `Drives ${k.outcome.toLowerCase()}.`, confidence: i === 2 ? "Medium" : "High", outcome_link: k.outcome,
    })),
    failure_mode_library: lib.failures.map((f, i) => ({
      id: `FM-0${i + 1}`, failure_mode: f.mode, root_cause: f.cause, institution: "Common pattern",
      consequence: f.consequence, mitigation: f.mitigation, confidence: "High",
    })),
    kpi_norms: lib.kpiNorms.map((k, i) => ({
      id: `KN-0${i + 1}`, kpi_name: k.name, industry_low: k.low, industry_avg: k.avg, industry_high: k.high,
      unit: k.unit, source_type: "Sector data", outcome_link: k.outcome, confidence: i === 2 ? "Medium" : "High",
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
      goals: ["Complete the visit feeling it was worthwhile", `Avoid the sector's known friction (${fz[0]})`, "Find the moments that matter to them"],
      pain_points: [fz[0], fz[1] || "Queues at peak times", p.pod_flag ? "Inaccessible or unmarked routes" : "Fatigue without rest options"],
      expectations: ["Be welcomed and oriented quickly", "Clear, honest information", "Service that anticipates needs"],
      accessibility_needs: p.pod_flag ? "Step-free routing, frequent rest points, sensory-aware spaces and proactive staff assistance." : "Standard access with clear signage and seating available.",
      digital_behaviour: "Checks the website/app before visiting; uses mobile for maps, schedules and information on site.",
      visit_behaviour: p.pod_flag ? "Planned, companion-supported visit with pre-checked routes and frequent rest stops." : "Semi-planned visit, open to discovery but values a clear spine route.",
      spending_behaviour: "Moderate spend on F&B and themed retail when it feels coherent with the experience; price-sensitive on generic merchandise.",
      journey_risks: ["A poor arrival setting a negative tone", p.pod_flag ? "An accessibility barrier mid-visit" : `Hitting the sector's main friction zone (${fz[0]})`],
      success_definition: p.pod_flag ? "Completed the full visit independently and with dignity, no barriers encountered." : "Left feeling the visit was enjoyable, easy and worth recommending.",
      preferred_channels: ["Website", "Mobile app", "On-site staff"],
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
        return {
          name, stage: stageKey, channel, emotion,
          emotion_line: emotionLine(name, emotion, p, sentiment),
          sentiment,
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

    const moments_of_truth = lib.moments.map((m, i) => ({
      id: `${p.id}-MoT-${i + 1}`,
      name: m.name, stage: m.stage, touchpoint: m.tp,
      classification: pod && i < 2 ? "Critical" : i === 0 ? "High" : i === 2 ? "High" : "Medium",
      reason_detected: m.reason + (pod ? " (heightened for POD persona)" : ""),
      impact: m.impact, risk: m.risk, recommendation: m.rec, owner: m.owner,
    }));

    const kpis = lib.kpis.map((k, i) => ({
      name: k.name, tier: k.tier, metric_definition: k.def, formula: k.formula,
      frequency: k.freq, target: pod && i === 1 ? adjustTargetForPOD(k.target) : k.target,
      owner: k.owner, data_source: k.source, leading_indicator: k.leading, lagging_indicator: k.lagging,
      traffic_light: pod && i === 2 ? "Amber" : k.tl, linked_mot: `${p.id}-MoT-${(i % lib.moments.length) + 1}`,
    }));

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
