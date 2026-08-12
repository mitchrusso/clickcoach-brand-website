const fs = require("fs");
const path = require("path");

const today = "2026-07-07";
const site = "https://clickcoach.io";
const root = path.resolve(__dirname, "..");

const nav = (active = "Resources") => `<!-- Meta Pixel Noscript -->
<noscript><img height="1" width="1" style="display:none" alt=""
src="https://www.facebook.com/tr?id=27459395117029374&ev=PageView&noscript=1" /></noscript>
<!-- End Meta Pixel Noscript -->
<header class="nav" id="site-nav">
  <div class="nav__inner">
    <a href="/" class="nav__brand" aria-label="ClickCoach home"><img class="cc-logo cc-logo--full" src="/images/logo-clickcoach.webp?v=2" alt="ClickCoach" width="200" height="32" decoding="async" /></a>
    <nav class="nav__menu" aria-label="Primary">
      <a href="/features/">Features</a>
      <a href="/pricing/">Pricing</a>
      <a href="/for-coaches/">For Coaches</a>
      <a href="/resources/"${active === "Resources" ? ' class="is-active"' : ""}>Resources</a>
      <a href="/slipmeter/">SlipMeter</a>
    </nav>
    <div class="nav__cta">
      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle color theme" type="button">🌗</button>
      <details class="nav__login">
        <summary class="btn btn-secondary btn-sm nav__login-trigger">Log in <span class="nav__login-caret" aria-hidden="true">&#9662;</span></summary>
        <div class="nav__login-menu" role="menu">
          <span class="nav__login-eyebrow">Choose your login</span>
          <a class="nav__login-item" role="menuitem" href="https://new.clickcoach.io/login"><span class="nav__login-item-body"><span class="nav__login-item-title">ClickCoach 2.0 <span class="nav__login-badge">New</span></span><span class="nav__login-item-sub">The all-new coaching platform</span></span><span class="nav__login-item-arrow" aria-hidden="true">&rarr;</span></a>
          <a class="nav__login-item" role="menuitem" href="https://app.clickcoach.io/secure-login"><span class="nav__login-item-body"><span class="nav__login-item-title">ClickCoach Legacy</span><span class="nav__login-item-sub">Sign in to the classic dashboard</span></span><span class="nav__login-item-arrow" aria-hidden="true">&rarr;</span></a>
        </div>
      </details>
      <a class="btn btn-primary btn-sm" href="/join/">Get Started</a>
      <button class="nav__toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" type="button">&#9776;</button>
    </div>
  </div>
</header>`;

const footer = `<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <a href="/" class="nav__brand nav__brand--footer" aria-label="ClickCoach home">
          <img class="cc-logo cc-logo--full" src="/images/logo-clickcoach.webp?v=2" alt="ClickCoach" width="200" height="32" decoding="async" />
        </a>
        <p>The coaching operating system. One login, one mental model, and the proof your coaching has been producing all along &mdash; finally visible.</p>
      </div>
      <div><h4>Product</h4>
        <a href="/features/">Features</a><a href="/pricing/">Pricing</a><a href="/for-coaches/">For Coaches</a><a href="/slipmeter/">SlipMeter</a><a href="/join/">Get Started</a>
      </div>
      <div><h4>Company</h4>
        <a href="/about/">About Mitch</a><a href="/testimonials/">Testimonials</a><a href="/contact/">Contact</a><a href="/jv/">JV Partners</a>
      </div>
      <div><h4>Resources</h4>
        <a href="/resources/">Articles</a><a href="/resources/coaching-software-answers/">Coaching Software Answers</a><a href="/resources/faqs/">FAQs</a><a href="/contact/#support">Support</a><a href="/contact/#api">API &amp; integrations</a>
      </div>
    </div>
    <div class="footer__integrations" aria-label="ClickCoach integrations">
      <strong>Integrations:</strong> ClickCoach uses Google Calendar to automatically sync and create coaching session events, keeping coaches and clients aligned on their schedule.
    </div>
    <div class="footer__bottom">
      <span>&copy; 2026 Mindful Guidance, LLC - ClickCoach.io. Built by Mitch Russo, who ran 50+ coaches for Tony Robbins and Chet Holmes.</span>
      <span><a href="/privacy/">Privacy Policy</a> &middot; <a href="/terms/">Terms of Service</a> &middot; <a href="/jv/">JV Partners</a></span>
    </div>
  </div>
</footer>
<script>
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('cc-theme');
  if (saved) root.setAttribute('data-theme', saved);
  const t = document.getElementById('theme-toggle');
  if (t) t.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('cc-theme', next);
  });
  const navEl = document.getElementById('site-nav');
  const togg = document.getElementById('nav-toggle');
  if (togg) togg.addEventListener('click', () => {
    const open = navEl.classList.toggle('nav--open');
    togg.setAttribute('aria-expanded', String(open));
  });
})();
</script>
<script src="/js/screenshot-lightbox.js?v=resource-expand-1" defer></script>
<script src="/js/exit-intent-popup.js?v=perf-audit-1" defer></script>
<script src="/js/chatbase-embed.js?v=perf-audit-1" defer></script>`;

const baseHead = (page, schema) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#0F172A" />
<title>${page.title} &mdash; ClickCoach</title>
<meta name="description" content="${page.description}" />
<link rel="canonical" href="${site}${page.url}" />
<meta property="og:type" content="${page.type === "Article" ? "article" : "website"}" />
<meta property="og:site_name" content="ClickCoach" />
<meta property="og:url" content="${site}${page.url}" />
<meta property="og:title" content="${page.title} &mdash; ClickCoach" />
<meta property="og:description" content="${page.description}" />
<meta property="og:image" content="${site}/images/og-one-login-connected.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="One login. Everything connected. ClickCoach coaching platform overview" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${page.title} &mdash; ClickCoach" />
<meta name="twitter:description" content="${page.description}" />
<meta name="twitter:image" content="${site}/images/og-one-login-connected.png" />
<meta name="twitter:image:alt" content="One login. Everything connected. ClickCoach coaching platform overview" />
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/styles.css?v=demo-assets-2" />
<link rel="icon" type="image/png" href="/images/logo-clickcoach-mark.png?v=2" />
<script type="text/javascript">!function(e,t){(e=t.createElement("script")).src="https://cdn.convertbox.com/convertbox/js/embed.js",e.id="app-convertbox-script",e.async=true,e.dataset.uuid="cc64bc00-c22e-425f-8f6d-b9a01a50e5f6",document.getElementsByTagName("head")[0].appendChild(e)}(window,document);</script>
<script src="https://app.rybbit.io/api/script.js" data-site-id="b96de0375325" defer></script>
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '27459395117029374');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->
</head>`;

const answers = [
  {
    slug: "what-software-do-coaches-use-to-manage-clients",
    title: "What Software Do Coaches Use to Manage Clients?",
    chip: "Client management",
    description: "A clear answer for coaches comparing software to manage clients, sessions, notes, homework, billing, portals, and progress in one place.",
    h1: "What software do coaches use to manage clients?",
    lede: "Coaches use a mix of calendars, notes, spreadsheets, payment tools, file folders, CRMs, and client portals. The stronger answer is dedicated coaching software that connects client records, session notes, homework, scheduling, billing, and progress tracking in one workflow.",
    answer: "The best software for managing coaching clients gives the coach one place to see who the client is, what was discussed, what was assigned, what is due next, and whether the client is making visible progress.",
    bullets: [
      "Client profiles and history",
      "Session notes and summaries",
      "Homework, assignments, and accountability questions",
      "Calendar and session scheduling",
      "Billing, invoices, and payments",
      "Client portal access and progress reporting"
    ],
    clickcoach: "ClickCoach was built for this exact workflow. Instead of managing the client in one app, the notes in another, the invoice somewhere else, and homework by email, ClickCoach puts the client relationship in one operating system.",
    links: [
      ["/features/", "See ClickCoach features"],
      ["/coaching-business-management-software/", "Coaching business management software"],
      ["/resources/client-data-management-coaching-a-2026-guide-for-coaches/", "Client data management guide"]
    ],
    faqs: [
      ["Do coaches need a CRM or coaching software?", "A CRM helps with prospects and pipeline. Coaching software helps deliver the coaching relationship after someone becomes a client. Many coaches need both, but the delivery workflow is where client trust and retention are usually won."],
      ["Can one platform replace multiple coaching tools?", "Yes, if the platform covers sessions, notes, homework, billing, client communication, portal access, and progress reporting. That is the operational gap ClickCoach is designed to close."]
    ]
  },
  {
    slug: "best-client-portal-for-coaches",
    title: "What Is the Best Client Portal for Coaches?",
    chip: "Client portals",
    description: "What coaches should look for in a client portal, including homework, session summaries, resources, invoices, progress charts, and branded access.",
    h1: "What is the best client portal for coaches?",
    lede: "The best client portal for coaches is the one clients will actually use between sessions. It should make homework, session summaries, resources, invoices, and progress easy to find without sending clients back through old emails.",
    answer: "A coaching client portal should reduce confusion for the client and reduce follow-up work for the coach. It is not just a login screen. It is the client-facing home for the coaching relationship.",
    bullets: [
      "Branded client access",
      "Session summaries in one place",
      "Homework and accountability items",
      "Progress charts and reports",
      "Files, courses, and resources",
      "Invoices and payment history"
    ],
    clickcoach: "ClickCoach gives coaches a branded portal so clients can return to one place for the work, proof, and follow-up that keep coaching valuable after the call ends.",
    links: [
      ["/coaching-client-portal-software/", "Client portal software"],
      ["/resources/branded-client-portals-in-coaching-build-trust-and-results/", "Branded portals article"],
      ["/features/", "See the portal features"]
    ],
    faqs: [
      ["Why do coaches need a client portal?", "A client portal keeps the coaching relationship organized between sessions. It gives clients one place to find notes, homework, files, progress, and billing."],
      ["Does a portal help with retention?", "It can. When clients can see progress and stay connected between calls, the value of coaching is easier to understand and renew."]
    ]
  },
  {
    slug: "how-do-coaches-track-client-progress",
    title: "How Do Coaches Track Client Progress?",
    chip: "Progress tracking",
    description: "How coaches can track client progress with goals, session notes, homework, milestones, progress reports, and visible proof.",
    h1: "How do coaches track client progress?",
    lede: "Coaches track client progress by defining goals, capturing a baseline, assigning actions, reviewing homework, recording milestones, and turning session notes into visible proof.",
    answer: "Progress tracking works best when it is part of the normal coaching workflow. If it lives in a separate spreadsheet, it often gets ignored until renewal time, which is too late.",
    bullets: [
      "Define the goal and starting point",
      "Record key decisions from each session",
      "Assign action steps and due dates",
      "Review homework and follow-through",
      "Capture milestones and client wins",
      "Turn notes into progress reports"
    ],
    clickcoach: "ClickCoach connects notes, assignments, progress charts, and reports so coaches can show what changed over time instead of relying on memory.",
    links: [
      ["/coaching-progress-tracking-software/", "Progress tracking software"],
      ["/resources/make-coaching-outcomes-visible-to-clients/", "Make outcomes visible"],
      ["/resources/progress-reports-and-client-retention-a-coachs-guide/", "Progress reports and retention"]
    ],
    faqs: [
      ["What should coaches measure?", "Measure the things tied to the client's stated goals: actions completed, habits practiced, milestones reached, decisions made, skills improved, and outcomes achieved."],
      ["Can qualitative coaching progress be tracked?", "Yes. Qualitative progress can be documented through session notes, client reflections, examples of changed behavior, and before-and-after ratings."]
    ]
  },
  {
    slug: "how-do-coaches-keep-clients-accountable-between-sessions",
    title: "How Do Coaches Keep Clients Accountable Between Sessions?",
    chip: "Accountability",
    description: "How coaches keep clients accountable between sessions using homework, recurring questions, reminders, follow-up, and visible progress.",
    h1: "How do coaches keep clients accountable between sessions?",
    lede: "Coaches keep clients accountable by turning the session into specific commitments, sending clear follow-up, asking recurring accountability questions, and reviewing progress at the next session.",
    answer: "Accountability is not pressure. It is structure. Clients need to know what they agreed to do, where to find it, and how it will be reviewed.",
    bullets: [
      "End each session with clear commitments",
      "Send homework and next steps promptly",
      "Use recurring accountability questions",
      "Keep assignments visible in a portal",
      "Review what happened before adding new work",
      "Document progress and patterns"
    ],
    clickcoach: "ClickCoach helps coaches assign homework, use accountability question libraries, send follow-up, and keep client commitments visible inside the client portal.",
    links: [
      ["/coaching-accountability-software/", "Accountability software"],
      ["/resources/what-is-between-session-coaching-support-for-coaches/", "Between-session support"],
      ["/resources/increase-client-engagement-between-sessions-a-coachs-guide/", "Increase engagement between sessions"]
    ],
    faqs: [
      ["What is a coaching accountability question?", "It is a question that helps clients reflect on what they committed to, what they completed, what got in the way, and what should happen next."],
      ["Should accountability be automated?", "Parts of it can be. The coach should still bring judgment and care, but reminders, assignments, and question prompts should not depend on manual memory."]
    ]
  },
  {
    slug: "how-do-coaching-businesses-reduce-admin-work",
    title: "How Do Coaching Businesses Reduce Admin Work?",
    chip: "Admin",
    description: "How coaching businesses reduce admin by consolidating notes, scheduling, billing, homework, reporting, client portals, and AI-assisted workflows.",
    h1: "How do coaching businesses reduce admin work?",
    lede: "Coaching businesses reduce admin by standardizing the session workflow and consolidating the tools that usually scatter notes, homework, scheduling, billing, documents, and follow-up.",
    answer: "The biggest admin drain is not one task. It is the switching cost between tools. Every handoff creates time loss, mistakes, and follow-up work.",
    bullets: [
      "Use one workflow for sessions and follow-up",
      "Store notes, homework, and files with the client record",
      "Standardize onboarding and session templates",
      "Automate reminders and basic follow-up",
      "Connect billing and client delivery",
      "Use AI to clean up notes and draft summaries"
    ],
    clickcoach: "ClickCoach reduces admin by putting sessions, notes, homework, client portal, billing, courses, broadcasts, reporting, and AI support under one login.",
    links: [
      ["/coaching-business-management-software/", "Business management software"],
      ["/resources/hidden-admin-cost-of-a-coaching-business/", "Hidden admin cost"],
      ["/resources/how-to-reduce-coaching-admin-and-scattered-tools/", "Reduce scattered tools"]
    ],
    faqs: [
      ["Why does coaching admin grow so quickly?", "Admin grows because each client creates repeated follow-up, notes, homework, billing, scheduling, and progress tracking work. Without a system, every client adds more manual overhead."],
      ["Can AI reduce coaching admin?", "Yes, especially for note cleanup, summaries, drafts, and reminders. AI works best when it is connected to the coaching workflow instead of sitting in a separate chat window."]
    ]
  },
  {
    slug: "what-tools-do-life-coaches-need",
    title: "What Tools Do Life Coaches Need to Run a Practice?",
    chip: "Life coaching tools",
    description: "A practical list of tools life coaches need for clients, scheduling, notes, homework, accountability, payments, resources, and progress tracking.",
    h1: "What tools do life coaches need to run a practice?",
    lede: "Life coaches need tools for scheduling, client records, session notes, homework, accountability, payments, resources, communication, and progress tracking. The fewer disconnected tools, the easier the practice is to run.",
    answer: "A life coaching practice is not just calls on a calendar. It is a delivery system for client change, and the tools should support that entire relationship.",
    bullets: [
      "Calendar and session scheduling",
      "Client records and intake information",
      "Session notes and summaries",
      "Homework and accountability tracking",
      "Payments, invoices, and subscriptions",
      "Client portal and shared resources",
      "Progress reports and testimonials"
    ],
    clickcoach: "ClickCoach gives life coaches one platform for the delivery side of the business, including sessions, homework, client portal, billing, courses, AI, and reporting.",
    links: [
      ["/for-coaches/", "For coaches"],
      ["/features/", "ClickCoach features"],
      ["/resources/what-is-a-coaching-practice-your-2026-guide/", "What is a coaching practice?"]
    ],
    faqs: [
      ["Do life coaches need expensive software?", "Not necessarily. They need software that reduces admin and supports the client experience. The cost should be judged against time saved, renewals, client experience, and proof of outcomes."],
      ["What is the most important tool for a life coach?", "The most important tool is the system that keeps clients engaged between sessions. That usually means notes, homework, accountability, and a clear client portal."]
    ]
  },
  {
    slug: "how-should-coaches-document-session-outcomes",
    title: "How Should Coaches Document Session Outcomes?",
    chip: "Session outcomes",
    description: "How coaches should document session outcomes with decisions, insights, assignments, milestones, client commitments, and progress proof.",
    h1: "How should coaches document session outcomes?",
    lede: "Coaches should document session outcomes by capturing what changed in the session: decisions, insights, commitments, assignments, obstacles, milestones, and what should be reviewed next.",
    answer: "Good outcome documentation is not a transcript. It is a useful record of the progress that matters to the client and the coach.",
    bullets: [
      "Session focus and client goal",
      "Important insight or decision",
      "Action items and homework",
      "Client commitment and due date",
      "Obstacle or risk to follow up on",
      "Progress signal or win",
      "Next-session review point"
    ],
    clickcoach: "ClickCoach helps coaches turn notes and assignments into structured follow-up so session outcomes become part of the client's visible progress record.",
    links: [
      ["/coaching-notes-software/", "Coaching notes software"],
      ["/resources/coaching-session-outcome-documentation-explained/", "Outcome documentation explained"],
      ["/resources/why-coaching-notes-should-become-progress-proof/", "Notes as progress proof"]
    ],
    faqs: [
      ["Should coaches record every detail?", "No. Coaches should capture what helps the client act, remember, and see progress. Too much detail can bury the important outcomes."],
      ["How do notes become proof?", "Notes become proof when they connect insights, assignments, completed actions, milestones, and client changes over time."]
    ]
  },
  {
    slug: "how-do-coaches-prove-client-progress",
    title: "How Do Coaches Prove Client Progress?",
    chip: "Progress proof",
    description: "How coaches prove client progress with notes, homework, milestones, behavior change, reports, testimonials, and client-visible outcomes.",
    h1: "How do coaches prove client progress?",
    lede: "Coaches prove client progress by collecting evidence over time: goals, baselines, session notes, completed homework, milestones, behavior changes, reports, and client reflections.",
    answer: "Proof does not have to make coaching cold or mechanical. It simply makes the value of the work easier for clients to see, remember, and explain.",
    bullets: [
      "Start with clear client goals",
      "Capture the baseline",
      "Document assignments and completion",
      "Record wins and behavior shifts",
      "Create periodic progress reports",
      "Turn outcomes into stronger testimonials"
    ],
    clickcoach: "ClickCoach helps coaches build proof as they coach, not after the fact, by connecting session notes, homework, client progress, and reports.",
    links: [
      ["/resources/make-coaching-outcomes-visible-to-clients/", "Make outcomes visible"],
      ["/resources/how-coaches-can-get-better-testimonials-and-proof/", "Better testimonials and proof"],
      ["/testimonials/", "ClickCoach testimonials"]
    ],
    faqs: [
      ["Why do coaches struggle to prove results?", "Many coaches produce real transformation, but the evidence is scattered across notes, emails, conversations, and memory. The proof exists, but it is not organized."],
      ["Can proof help coaches charge more?", "Yes. Clear proof supports premium pricing because prospects can understand what the coach helps clients accomplish and why the work is valuable."]
    ]
  }
];

const comparisons = [
  {
    slug: "clickcoach-vs-simply-coach",
    title: "ClickCoach vs Simply.Coach",
    chip: "Comparison",
    description: "A practical comparison of ClickCoach and Simply.Coach for coaches evaluating client portals, accountability, progress proof, billing, and coaching workflow.",
    h1: "ClickCoach vs Simply.Coach: which fits your coaching workflow?",
    competitor: "Simply.Coach",
    positioning: "Simply.Coach is a broad coaching-management platform with strong business structure. ClickCoach is positioned for coaches who want one coaching operating system for sessions, homework, client portal, billing, progress proof, courses, broadcasts, and AI-assisted follow-up.",
    bestFor: [
      ["ClickCoach", "Professional coaches who want a simple, connected workflow for delivery, accountability, client proof, and practice operations."],
      ["Simply.Coach", "Coaches and organizations comparing a broader practice-management system with enterprise-style features."]
    ],
    table: [
      ["Primary fit", "Solo coaches, small teams, and coaching companies that need proof and delivery workflow", "Coaches and organizations looking for a broader coaching management suite"],
      ["Client portal", "Branded portal for notes, homework, progress, courses, invoices, and resources", "Client workspace and management features"],
      ["Progress proof", "Built around notes, assignments, charts, reports, and testimonials", "Progress tracking depends on selected workflows"],
      ["AI support", "AI-assisted summaries, notes, and coaching workflow support", "AI capabilities vary by plan and implementation"],
      ["Pricing model", "$497/year per coach with full platform access", "Plan-based pricing"]
    ],
    faqs: [
      ["Is ClickCoach an alternative to Simply.Coach?", "Yes, for coaches who want a focused coaching operating system with client portal, notes, homework, billing, progress tracking, and AI in one place."],
      ["Which is better for proof of client progress?", "ClickCoach is intentionally positioned around progress proof: notes, homework, milestones, reports, and client-visible outcomes."]
    ]
  },
  {
    slug: "clickcoach-vs-coachvantage",
    title: "ClickCoach vs CoachVantage",
    chip: "Comparison",
    description: "Compare ClickCoach and CoachVantage for coaching practice management, client portals, billing, accountability, progress tracking, and AI-supported workflow.",
    h1: "ClickCoach vs CoachVantage: choosing coaching software without adding complexity.",
    competitor: "CoachVantage",
    positioning: "CoachVantage is known for coaching practice management with scheduling, invoicing, contracts, and client tools. ClickCoach focuses on the full delivery loop: session notes, homework, accountability, progress proof, client portal, billing, courses, broadcasts, and AI support.",
    bestFor: [
      ["ClickCoach", "Coaches who want the client delivery process and progress proof to sit at the center of the platform."],
      ["CoachVantage", "Coaches comparing a business admin platform with scheduling, contracts, and invoicing."]
    ],
    table: [
      ["Primary fit", "Client delivery, accountability, proof, and practice operations", "Scheduling, contracts, invoicing, and coach admin"],
      ["Session workflow", "Notes, homework, accountability, summaries, and reports connected", "Practice-management workflow with client records"],
      ["Client proof", "Progress reports and visible outcomes are a core theme", "Available through configured records and tools"],
      ["AI support", "AI-assisted coaching workflow and note support", "AI features vary by current plan"],
      ["Best question to ask", "Will this help clients see progress after every session?", "Will this organize my administrative workflow?"]
    ],
    faqs: [
      ["Is ClickCoach or CoachVantage better for accountability?", "ClickCoach is built to keep homework, accountability questions, session notes, and client progress connected in the same workflow."],
      ["Can ClickCoach replace several tools?", "For many coaches, yes. It covers sessions, notes, homework, client portal, billing, courses, broadcasts, progress tracking, and AI support."]
    ]
  },
  {
    slug: "clickcoach-vs-lifecoachhub",
    title: "ClickCoach vs LifeCoachHub",
    chip: "Comparison",
    description: "Compare ClickCoach and LifeCoachHub for coaches deciding between marketplace-style visibility and a dedicated operating system for running a coaching practice.",
    h1: "ClickCoach vs LifeCoachHub: marketplace visibility or practice operating system?",
    competitor: "LifeCoachHub",
    positioning: "LifeCoachHub is often associated with coach discovery, directories, and client-facing coaching presence. ClickCoach is for running the practice after the client relationship begins: sessions, follow-up, homework, progress proof, portal access, billing, and reports.",
    bestFor: [
      ["ClickCoach", "Coaches who already have or are building client relationships and need better delivery, retention, and proof."],
      ["LifeCoachHub", "Coaches interested in a directory or marketplace-style visibility path."]
    ],
    table: [
      ["Primary fit", "Operating the coaching relationship", "Visibility, directory, and marketplace-style positioning"],
      ["Client portal", "Central part of the delivery workflow", "Depends on platform use case"],
      ["Progress proof", "Session notes, homework, reports, and client outcomes", "Not the central positioning"],
      ["Revenue support", "Retention, renewals, testimonials, and scalable delivery", "Prospect discovery and online presence"],
      ["Best question to ask", "How will I deliver and prove results?", "How will prospects find me?"]
    ],
    faqs: [
      ["Do coaches need both visibility and operations?", "Yes. Coaches need a way to attract clients and a system to deliver great outcomes once those clients arrive."],
      ["Where does ClickCoach fit?", "ClickCoach fits after interest turns into a coaching relationship. It helps the coach deliver, document, and prove the work."]
    ]
  },
  {
    slug: "coaching-software-vs-hr-performance-platforms",
    title: "Coaching Software vs HR Performance Platforms",
    chip: "Comparison",
    description: "How coaching software differs from HR performance platforms like PerformYard when coaches need client portals, session notes, homework, and progress proof.",
    h1: "Coaching software vs HR performance platforms: what is the difference?",
    competitor: "HR performance platforms",
    positioning: "HR performance platforms are usually built for employee reviews, goals, feedback cycles, and internal performance management. Coaching software is built for the coach-client relationship: sessions, notes, homework, accountability, client portal, billing, and progress proof.",
    bestFor: [
      ["ClickCoach", "Independent coaches, coaching teams, and certification programs that need to run client-facing coaching work."],
      ["HR platforms", "Companies managing employee performance, reviews, goals, and internal feedback processes."]
    ],
    table: [
      ["Primary user", "Professional coach or coaching company", "HR team, manager, or internal people team"],
      ["Relationship type", "Coach-client relationship", "Employer-employee relationship"],
      ["Core workflow", "Sessions, notes, homework, accountability, portal, billing", "Reviews, goals, feedback cycles, performance records"],
      ["Client-facing portal", "Central to the coaching experience", "Usually employee/internal facing"],
      ["Best question to ask", "Will this help me deliver coaching?", "Will this help us manage employees?"]
    ],
    faqs: [
      ["Can HR platforms be used for coaching?", "Sometimes, but they are usually not designed for independent coaching delivery, billing, client portals, homework, or coaching progress proof."],
      ["When should a coach choose coaching software?", "Choose coaching software when the core need is managing clients, sessions, homework, follow-up, accountability, and outcomes."]
    ]
  }
];

const cards = [...answers, ...comparisons];

function schemaForPage(page) {
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${site}${page.url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: "Resources", item: `${site}/resources/` },
      { "@type": "ListItem", position: 3, name: "Coaching Software Answers", item: `${site}/resources/coaching-software-answers/` },
      { "@type": "ListItem", position: 4, name: page.title, item: `${site}${page.url}` }
    ]
  };
  const faq = {
    "@type": "FAQPage",
    "@id": `${site}${page.url}#faqpage`,
    mainEntity: page.faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  };
  const article = {
    "@type": "Article",
    "@id": `${site}${page.url}#article`,
    url: `${site}${page.url}`,
    headline: page.title,
    description: page.description,
    datePublished: today,
    dateModified: today,
    author: { "@type": "Person", name: "Mitch Russo" },
    publisher: { "@type": "Organization", name: "ClickCoach", url: `${site}/` },
    image: `${site}/images/og-one-login-connected.png`,
    isPartOf: { "@id": `${site}/resources/coaching-software-answers/#webpage` }
  };
  return { "@context": "https://schema.org", "@graph": [article, faq, breadcrumb] };
}

function answerPage(page) {
  page.url = `/resources/${page.slug}/`;
  page.type = "Article";
  const schema = schemaForPage(page);
  return `${baseHead(page, schema)}
<body class="eo-page resources-page">
${nav()}
<main>
<section class="resource-article-hero">
  <div class="container resource-article-hero__inner">
    <a class="resource-back" href="/resources/coaching-software-answers/">&larr; Coaching Software Answers</a>
    <span class="chip">${page.chip}</span>
    <h1>${page.h1}</h1>
    <p class="hero__lede">${page.lede}</p>
    <p class="resource-article-meta">By Mitch Russo &middot; Updated July 7, 2026</p>
  </div>
</section>
<section class="section resource-article-section">
  <div class="container">
    <article class="resource-article">
      <h2>Short answer</h2>
      <p>${page.answer}</p>
      <div class="resource-visual-grid">
        <figure class="resource-visual-card">
          <button type="button" class="screenshot-expand resource-image-expand" data-screenshot-expand aria-label="Expand ClickCoach coaching platform overview">
            <img src="/images/og-one-login-connected.png" alt="ClickCoach one login everything connected coaching platform overview" width="1200" height="630" loading="eager" decoding="async" />
            <span class="resource-image-expand__icon" aria-hidden="true">⛶</span>
          </button>
          <figcaption>ClickCoach connects the work coaches usually spread across notes, email, billing, portals, and spreadsheets.</figcaption>
        </figure>
        <div class="resource-chart-card">
          <span class="resource-chart-card__label">What to look for</span>
          <h2>${page.chip}</h2>
          <ul>
            ${page.bullets.slice(0, 4).map((item) => `<li>${item}</li>`).join("\n            ")}
          </ul>
        </div>
      </div>
      <h2>What coaches should look for</h2>
      <ul>
        ${page.bullets.map((item) => `<li>${item}</li>`).join("\n        ")}
      </ul>
      <h2>Where ClickCoach fits</h2>
      <p>${page.clickcoach}</p>
      <div class="resource-related">
        <h2>Related ClickCoach resources</h2>
        <div class="resources-grid">
          ${page.links.map(([href, label]) => `<article class="resource-card"><span class="chip">Related</span><h2><a href="${href}">${label}</a></h2><p>Continue the coaching software workflow from this answer.</p><a class="resource-card__link" href="${href}">Open resource &rarr;</a></article>`).join("\n          ")}
        </div>
      </div>
      <h2>FAQ</h2>
      <div class="resource-faq-list">
        ${page.faqs.map(([q, a]) => `<details class="resource-faq" open><summary>${q}</summary><p>${a}</p></details>`).join("\n        ")}
      </div>
    </article>
  </div>
</section>
<section class="section section--dark">
  <div class="container">
    <div class="cta-strip cta-strip--centered">
      <div class="cta-strip__copy">
        <h2>Run coaching in one connected workflow.</h2>
        <p>ClickCoach brings sessions, notes, homework, client portal, billing, progress tracking, reports, and AI support into one operating system for coaches.</p>
      </div>
      <div class="row cta-strip__actions">
        <a class="btn btn-accent btn-lg" href="/join/">Start Risk-Free Trial</a>
        <a class="btn btn-ghost btn-lg u-text-white" href="/features/">See features &rarr;</a>
      </div>
    </div>
  </div>
</section>
</main>
${footer}
</body>
</html>
`;
}

function comparisonPage(page) {
  page.url = `/resources/${page.slug}/`;
  page.type = "Article";
  const schema = schemaForPage(page);
  return `${baseHead(page, schema)}
<body class="eo-page resources-page">
${nav()}
<main>
<section class="resource-article-hero">
  <div class="container resource-article-hero__inner">
    <a class="resource-back" href="/resources/coaching-software-answers/">&larr; Coaching Software Answers</a>
    <span class="chip">${page.chip}</span>
    <h1>${page.h1}</h1>
    <p class="hero__lede">${page.positioning}</p>
    <p class="resource-article-meta">By Mitch Russo &middot; Updated July 7, 2026</p>
  </div>
</section>
<section class="section resource-article-section">
  <div class="container">
    <article class="resource-article">
      <h2>Short answer</h2>
      <p>Choose ClickCoach when the main job is running the coaching relationship after the sale: sessions, notes, homework, accountability, client portal, billing, progress reports, and visible proof. Consider ${page.competitor} when its broader positioning, pricing, or feature set better matches your operating model.</p>
      <div class="resource-visual-grid">
        <div class="resource-chart-card">
          <span class="resource-chart-card__label">Best fit</span>
          <h2>Which platform fits which need?</h2>
          <ul>
            ${page.bestFor.map(([name, copy]) => `<li><strong>${name}:</strong> ${copy}</li>`).join("\n            ")}
          </ul>
        </div>
        <figure class="resource-visual-card">
          <button type="button" class="screenshot-expand resource-image-expand" data-screenshot-expand aria-label="Expand ClickCoach coaching platform overview">
            <img src="/images/og-one-login-connected.png" alt="ClickCoach one login everything connected coaching platform overview" width="1200" height="630" loading="eager" decoding="async" />
            <span class="resource-image-expand__icon" aria-hidden="true">⛶</span>
          </button>
          <figcaption>ClickCoach is strongest when the coach wants client delivery and progress proof in one workflow.</figcaption>
        </figure>
      </div>
      <h2>Comparison table</h2>
      <table>
        <thead><tr><th>Category</th><th>ClickCoach</th><th>${page.competitor}</th></tr></thead>
        <tbody>
          ${page.table.map(([cat, cc, comp]) => `<tr><td>${cat}</td><td>${cc}</td><td>${comp}</td></tr>`).join("\n          ")}
        </tbody>
      </table>
      <h2>Where ClickCoach is different</h2>
      <p>ClickCoach is not trying to be a generic database with a coaching label on it. It is built around the practical things coaches do every week: prepare for sessions, capture notes, assign homework, ask accountability questions, send follow-up, collect payment, share resources, and show progress when renewal conversations arrive.</p>
      <p>If your biggest pain is scattered delivery, weak proof, too much admin, or clients losing momentum between sessions, ClickCoach is designed around that problem.</p>
      <h2>FAQ</h2>
      <div class="resource-faq-list">
        ${page.faqs.map(([q, a]) => `<details class="resource-faq" open><summary>${q}</summary><p>${a}</p></details>`).join("\n        ")}
      </div>
      <div class="resource-related">
        <h2>Related ClickCoach resources</h2>
        <div class="resources-grid">
          <article class="resource-card"><span class="chip">Features</span><h2><a href="/features/">See the ClickCoach workflow</a></h2><p>Explore sessions, notes, homework, billing, client portal, progress tracking, and AI support.</p><a class="resource-card__link" href="/features/">Open features &rarr;</a></article>
          <article class="resource-card"><span class="chip">Pricing</span><h2><a href="/pricing/">Review ClickCoach pricing</a></h2><p>See the annual ClickCoach Access plan and what is included.</p><a class="resource-card__link" href="/pricing/">Open pricing &rarr;</a></article>
          <article class="resource-card"><span class="chip">Guide</span><h2><a href="/resources/coachablepros-com-alternatives-6/">More coaching software alternatives</a></h2><p>Compare additional coaching software options in one resource.</p><a class="resource-card__link" href="/resources/coachablepros-com-alternatives-6/">Open guide &rarr;</a></article>
        </div>
      </div>
    </article>
  </div>
</section>
</main>
${footer}
</body>
</html>
`;
}

function hubPage() {
  const page = {
    title: "Coaching Software Answers",
    description: "Direct answers and comparisons for coaches researching client portals, accountability, progress tracking, admin reduction, and coaching software.",
    url: "/resources/coaching-software-answers/",
    type: "CollectionPage"
  };
  const itemList = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${site}${page.url}#webpage`,
        url: `${site}${page.url}`,
        name: page.title,
        description: page.description,
        isPartOf: { "@id": `${site}/resources/#webpage` },
        about: { "@id": `${site}/#software` }
      },
      {
        "@type": "ItemList",
        "@id": `${site}${page.url}#itemlist`,
        itemListElement: cards.map((card, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: card.title,
          url: `${site}/resources/${card.slug}/`
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${site}${page.url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${site}/resources/` },
          { "@type": "ListItem", position: 3, name: "Coaching Software Answers", item: `${site}${page.url}` }
        ]
      }
    ]
  };
  return `${baseHead(page, itemList)}
<body class="eo-page resources-page">
${nav()}
<main>
<section class="hero resources-hero">
  <div class="container resources-hero__inner">
    <span class="chip chip--mint">Coaching software answers</span>
    <h1>Direct answers for coaches comparing software, portals, accountability, and proof.</h1>
    <p class="hero__lede">These pages are built for the questions coaches, Google, and AI answer engines ask before choosing a coaching platform.</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <header class="section-intro u-container-780">
      <p class="eyebrow">Answer engine ready</p>
      <h2>Start with the question your prospect is asking.</h2>
      <p>Each answer page gives a clear definition first, then explains where ClickCoach fits for coaches who need client portals, accountability, notes, billing, progress tracking, and scalable delivery.</p>
    </header>
    <div class="resources-grid">
      ${cards.map((card) => `<article class="resource-card"><span class="chip">${card.chip}</span><h2><a href="/resources/${card.slug}/">${card.title}</a></h2><p>${card.description}</p><a class="resource-card__link" href="/resources/${card.slug}/">Read answer &rarr;</a></article>`).join("\n      ")}
    </div>
  </div>
</section>
<section class="section section--dark">
  <div class="container">
    <div class="cta-strip cta-strip--centered">
      <div class="cta-strip__copy">
        <h2>Want the platform these answers point to?</h2>
        <p>ClickCoach gives coaches one login for sessions, notes, homework, client portal, billing, courses, broadcasts, AI support, and progress proof.</p>
      </div>
      <div class="row cta-strip__actions">
        <a class="btn btn-accent btn-lg" href="/features/">See Features</a>
        <a class="btn btn-ghost btn-lg u-text-white" href="/pricing/">View Pricing &rarr;</a>
      </div>
    </div>
  </div>
</section>
</main>
${footer}
</body>
</html>
`;
}

function writePage(slug, html) {
  const dir = path.join(root, "resources", slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

writePage("coaching-software-answers", hubPage());
for (const page of answers) writePage(page.slug, answerPage(page));
for (const page of comparisons) writePage(page.slug, comparisonPage(page));

console.log(`Generated ${cards.length + 1} coaching software answer pages.`);
