(function () {
  const input = document.getElementById("site-search-input");
  const results = document.getElementById("site-search-results");
  const status = document.getElementById("site-search-status");
  const clear = document.getElementById("site-search-clear");

  if (!input || !results || !status || !clear) return;

  const pages = [
    { title: "ClickCoach Home", url: "/", type: "Page", description: "ClickCoach is an all-in-one coaching platform for professional, executive, and virtual coaches. Manage sessions, billing, courses, and AI in one login.", keywords: "home all in one coaching platform sessions billing courses ai practice management" },
    { title: "Features", url: "/features/", type: "Page", description: "The coaching workflow you wish your tools agreed on. Sessions, accountability, client portal, stats, courses, billing, broadcasts, AI, all in one login.", keywords: "features workflow sessions accountability portal stats courses billing broadcasts ai" },
    { title: "Pricing", url: "/pricing/", type: "Page", description: "One flat price. $497 a year per coach. Every feature unlocked, unlimited clients, no tiers, no per-client fees.", keywords: "pricing cost plan yearly annual unlimited clients no tiers" },
    { title: "For Coaches", url: "/for-coaches/", type: "Page", description: "Practice management for solo coaches, multi-coach firms, and certification programs that care about proof, client progress, and scalable delivery.", keywords: "solo coach multi coach certification programs proof client progress scalable delivery" },
    { title: "About Mitch Russo", url: "/about/", type: "Page", description: "Mitch Russo built ClickCoach after 25 years coaching founders and executives, and losing half his day to paperwork.", keywords: "mitch russo founder story tony robbins chet holmes paperwork coaching founder executive" },
    { title: "Testimonials", url: "/testimonials/", type: "Page", description: "Real coaches. Real outcomes. Testimonials from working coaches who run on ClickCoach.", keywords: "testimonials proof outcomes coaches results" },
    { title: "Contact", url: "/contact/", type: "Page", description: "Get in touch with ClickCoach for sales, support, affiliate program, partner, and white-label inquiries.", keywords: "contact sales support affiliate partner white label api integrations" },
    { title: "Join ClickCoach", url: "/join/", type: "Page", description: "Join ClickCoach Access, Monthly, or Teams plans. Get full platform access, the bonus stack, and a 30-day money-back guarantee.", keywords: "join get started access monthly teams guarantee bonus stack" },
    { title: "ClickCoach JV Partner Center", url: "/jv/", type: "Page", description: "Sign up or log in as a ClickCoach JV partner, get affiliate links, review stats, copy swipes, and access promotion tools.", keywords: "jv partner affiliate signup login affiliate links stats swipes promotion tools groovesell joint venture" },
    { title: "SlipMeter", url: "/slipmeter/", type: "Page", description: "SlipMeter is a lightweight Mac timer for coaches who need to track prep, follow-up, admin, and client work outside live coaching sessions.", keywords: "slipmeter mac timer time tracking prep follow up admin client work beta" },
    { title: "Coaching Platform", url: "/coaching-platform/", type: "Solution", description: "ClickCoach is a coaching platform for professional, personal, virtual, and executive coaches who need clients, sessions, follow-up, billing, reports, and AI in one login.", keywords: "coaching platform software clients sessions follow up billing reports ai" },
    { title: "Coaching Client Portal Software", url: "/coaching-client-portal-software/", type: "Solution", description: "A branded client portal for homework, session follow-up, progress charts, courses, invoices, and client resources in one place.", keywords: "client portal branded homework follow up progress charts courses invoices resources" },
    { title: "Coaching Accountability Software", url: "/coaching-accountability-software/", type: "Solution", description: "Assign homework, ask accountability questions, review client follow-through, and keep client commitments visible from session to session.", keywords: "accountability homework questions commitments follow through between sessions" },
    { title: "Coaching Progress Tracking Software", url: "/coaching-progress-tracking-software/", type: "Solution", description: "Define client metrics, track progress, review charts in sessions, and make coaching outcomes easier for clients to see.", keywords: "progress tracking metrics charts outcomes visible proof client results" },
    { title: "Coaching Notes Software", url: "/coaching-notes-software/", type: "Solution", description: "Capture session notes, clean them up with AI, connect them to homework, and use notes as part of a visible client progress workflow.", keywords: "notes session notes ai homework visible progress workflow" },
    { title: "Coaching Business Management Software", url: "/coaching-business-management-software/", type: "Solution", description: "Manage sessions, clients, homework, portal access, billing, courses, broadcasts, reporting, and AI-assisted workflows from one login.", keywords: "business management practice management sessions clients billing courses reporting ai" },
    { title: "Coaching Software FAQs", url: "/resources/faqs/", type: "FAQs", description: "Short answers to common coaching software questions about client portals, accountability, progress proof, session notes, and practice management.", keywords: "faq questions answers coaching software client portal accountability progress proof notes practice management" },
    { title: "Which Coaching Business Problem Are You Solving Right Now?", url: "/resources/coaching-business-problems/", type: "Guide", description: "Find the ClickCoach resource that matches your coaching business problem: admin drag, weak proof, slower referrals, client growth, or fast implementation.", keywords: "business problems admin proof referrals renewals client growth implementation audience buckets" },
    { title: "A 30-day ClickCoach Implementation Path for Fast-moving Coaches", url: "/resources/30-day-coaching-platform-implementation-plan/", type: "Article", description: "A simple first-month plan for coaches who want to implement ClickCoach quickly, reduce admin, improve follow-up, and see measurable progress fast.", keywords: "implementation 30 day plan fast setup admin follow up measurable progress" },
    { title: "Branded Client Portals in Coaching: Build Trust and Results", url: "/resources/branded-client-portals-in-coaching-build-trust-and-results/", type: "Article", description: "How branded client portals help coaches build trust, reduce admin, improve engagement, and keep clients accountable between sessions.", keywords: "branded client portals trust results admin engagement accountability" },
    { title: "Client Onboarding Steps for Coaches: 2026 Guide", url: "/resources/client-onboarding-steps-for-coaches-2026-guide/", type: "Article", description: "Master the client onboarding steps for coaches. Build trust, set expectations, and create momentum in the first 72 hours of a new coaching relationship.", keywords: "client onboarding steps intake first 72 hours trust expectations momentum" },
    { title: "The Coach's Blueprint to Premium Pricing", url: "/resources/coachs-blueprint-to-premium-pricing/", type: "Article", description: "A practical premium-pricing blueprint for coaches: build proof, document client results, collect stronger testimonials, and raise rates with confidence.", keywords: "premium pricing raise rates testimonials proof client results value" },
    { title: "The Hidden Admin Cost of a Coaching Business", url: "/resources/hidden-admin-cost-of-a-coaching-business/", type: "Article", description: "A practical look at the hidden admin work that drains coaching businesses, from session prep and follow-up to progress tracking, renewals, and scattered tools.", keywords: "hidden admin cost coaching business session prep follow up progress tracking renewals scattered tools" },
    { title: "Strong Coaches Still Need Visible Proof", url: "/resources/how-coaches-can-get-better-testimonials-and-proof/", type: "Article", description: "Why coaches with real expertise still struggle to sell when outcomes, testimonials, and client progress are not easy to show.", keywords: "testimonials proof under proven expert outcomes visible progress sell" },
    { title: "How to Collect Client Information Professionally", url: "/resources/how-to-collect-client-information-professionally/", type: "Article", description: "Learn how to collect client information professionally to streamline your practice, build trust, and protect yourself legally.", keywords: "client information intake forms professional data privacy trust" },
    { title: "Your Coaching Practice Should Not Depend on Nine Disconnected Tools", url: "/resources/how-to-reduce-coaching-admin-and-scattered-tools/", type: "Article", description: "A practical guide for coaches overwhelmed by admin, scattered notes, homework, scheduling, billing, files, reminders, and follow-up.", keywords: "admin trapped scattered tools notes homework scheduling billing files reminders follow up" },
    { title: "How to Track Individual Progress in Group Coaching", url: "/resources/how-to-track-individual-progress-in-group-coaching/", type: "Article", description: "Discover how to effectively track individual progress in group coaching. Improve outcomes, avoid common mistakes, and enhance client growth.", keywords: "group coaching individual progress tracking outcomes client growth" },
    { title: "How to Write Coaching Agreements for Clients", url: "/resources/how-to-write-coaching-agreements-for-clients/", type: "Article", description: "Learn how to write coaching agreements for clients that establish trust and clarity. Create effective contracts for a successful coaching relationship.", keywords: "coaching agreements contracts clients trust clarity legal terms" },
    { title: "How to Make Coaching Outcomes Visible to Clients", url: "/resources/make-coaching-outcomes-visible-to-clients/", type: "Article", description: "How coaches can make client progress visible through goals, notes, assignments, metrics, and reports without turning coaching into a cold measurement exercise.", keywords: "outcomes visible clients goals notes assignments metrics reports" },
    { title: "Proactive Client Communication Coaching Explained", url: "/resources/proactive-client-communication-coaching-explained/", type: "Article", description: "What proactive client communication coaching is and how it builds trust, reduces anxiety, and strengthens client relationships.", keywords: "proactive communication client check ins trust anxiety relationships" },
    { title: "The Real Role of Real-Time Collaboration Coaching", url: "/resources/the-real-role-of-real-time-collaboration-coaching/", type: "Article", description: "The role of real-time collaboration coaching in enhancing skills with instant feedback and stronger client engagement.", keywords: "real time collaboration coaching instant feedback live sessions engagement" },
    { title: "The Role of Practice Management in Starting Coaching", url: "/resources/the-role-of-practice-management-in-starting-coaching/", type: "Article", description: "The role of practice management in starting coaching, with tools and strategies to enhance client engagement and grow your practice.", keywords: "practice management starting coaching tools client engagement grow practice" },
    { title: "What I Learned Running a Coaching, Training, and Consulting Business for Tony Robbins and Chet Holmes", url: "/resources/what-i-learned-running-50-coaches-for-tony-robbins-and-chet-holmes/", type: "Article", description: "Lessons from managing more than 50 coaches, and why great coaching operations need structure, accountability, and visible client progress.", keywords: "tony robbins chet holmes 50 coaches operations structure accountability progress" },
    { title: "What Is a Coaching Practice? Your 2026 Guide", url: "/resources/what-is-a-coaching-practice-your-2026-guide/", type: "Article", description: "What a coaching practice is and how it helps coaches maximize client potential with structure, systems, and client management routines.", keywords: "coaching practice definition 2026 guide client management systems routines" },
    { title: "What Is Between-Session Coaching Support for Coaches", url: "/resources/what-is-between-session-coaching-support-for-coaches/", type: "Article", description: "How between-session coaching support helps clients retain insights, complete homework, stay accountable, and arrive prepared for stronger coaching sessions.", keywords: "between session support homework accountability retain insights prepared sessions" },
    { title: "What Is Session Preparation Coaching for Coaches?", url: "/resources/what-is-session-preparation-coaching-for-coaches/", type: "Article", description: "What session preparation coaching is and how it improves readiness, confidence, client focus, and effective sessions.", keywords: "session preparation coaching readiness prep confidence focus effective sessions" },
    { title: "If You Need More Clients, Better Proof Is Part of the System", url: "/resources/why-better-proof-helps-coaches-get-and-keep-clients/", type: "Article", description: "For coaches who need more clients, stronger retention, and better referrals, this explains how proof supports growth.", keywords: "client starved builder more clients proof retention referrals growth" },
    { title: "Why Coaching Notes Should Become Progress Proof", url: "/resources/why-coaching-notes-should-become-progress-proof/", type: "Article", description: "Coaching notes should do more than preserve memory. They should help prove progress, support accountability, and make client transformation easier to see.", keywords: "coaching notes progress proof accountability transformation visible" },
    { title: "Why Coaching Referrals and Renewals Feel Harder Than They Used To", url: "/resources/why-coaching-referrals-and-renewals-feel-harder/", type: "Article", description: "For coaches whose old referral, renewal, and prospect flow no longer feels reliable, this guide explains why proof and follow-up matter more now.", keywords: "referrals renewals prospect flow disoriented coach proof follow up market changed" },
    { title: "Why Most Coaching Software Fails the Moment the Session Ends", url: "/resources/why-most-coaching-software-fails-after-the-session/", type: "Article", description: "Why coaching software must support homework, accountability, follow-up, and visible progress after the coaching session ends.", keywords: "coaching software fails after session homework accountability follow up visible progress" },
    { title: "Privacy Policy", url: "/privacy/", type: "Policy", description: "How Mindful Guidance MR, LLC collects, uses, and protects information for coaches and coaching clients.", keywords: "privacy policy data information clients coaches" },
    { title: "Terms of Service", url: "/terms/", type: "Policy", description: "Subscription, billing, 30-day guarantee, and coach responsibilities for Mindful Guidance MR, LLC.", keywords: "terms service subscription billing guarantee responsibilities" }
  ];

  const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));

  const indexedPages = pages.map((page) => ({
    ...page,
    haystack: normalize(`${page.title} ${page.description} ${page.type} ${page.keywords} ${page.url}`)
  }));

  function scorePage(page, terms, query) {
    let score = 0;
    const title = normalize(page.title);
    const description = normalize(page.description);
    const keywords = normalize(page.keywords);

    if (title.includes(query)) score += 16;
    if (keywords.includes(query)) score += 10;
    if (description.includes(query)) score += 6;

    for (const term of terms) {
      if (!page.haystack.includes(term)) return 0;
      if (title.includes(term)) score += 8;
      if (keywords.includes(term)) score += 5;
      if (description.includes(term)) score += 3;
      if (page.url.includes(term)) score += 2;
    }

    return score;
  }

  function render(matches, query) {
    if (!query) {
      results.hidden = true;
      results.innerHTML = "";
      status.textContent = "";
      return;
    }

    if (!matches.length) {
      results.hidden = false;
      results.innerHTML = '<article class="resource-card site-search__empty"><span class="chip">No matches</span><h2>No results found</h2><p>Try a different phrase, such as client portal, accountability, pricing, notes, onboarding, or progress tracking.</p></article>';
      status.textContent = "No results found.";
      return;
    }

    results.hidden = false;
    results.innerHTML = matches.map((page) => `
      <article class="resource-card">
        <span class="chip">${escapeHtml(page.type)}</span>
        <h2><a href="${escapeHtml(page.url)}">${escapeHtml(page.title)}</a></h2>
        <p>${escapeHtml(page.description)}</p>
        <a class="resource-card__link" href="${escapeHtml(page.url)}">Open result &rarr;</a>
      </article>
    `).join("");
    status.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} found.`;
  }

  function search() {
    const query = normalize(input.value);
    const terms = query.split(" ").filter((term) => term.length > 1);

    if (query.length < 2 || !terms.length) {
      render([], "");
      return;
    }

    const matches = indexedPages
      .map((page) => ({ ...page, score: scorePage(page, terms, query) }))
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 12);

    render(matches, query);
  }

  input.form.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
  });

  input.addEventListener("input", search);
  clear.addEventListener("click", () => {
    input.value = "";
    input.focus();
    render([], "");
  });
})();
