/**
 * Saumya Patel — Luxury Portfolio Interactive Scripts & UX Simulators
 * Vanilla JavaScript (Zero Dependencies, Ultra Fast)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initNavSpy();
  initSpotlightEffect();
  initProjectFilters();
  initClipboardCopy();
  initHeroCounters();
  initBackToTop();

  // New Interactive Project Labs
  initProjectDecks();
  initBuildSoukSimulator();
  initNiveshSimulators();
  initGazpreaStepper();
});

/**
 * 1. Mobile Drawer Navigation
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer) return;

  function setDrawer(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('active');
    drawer.classList.toggle('active', isOpen);
    drawer.setAttribute('aria-hidden', !isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  toggleBtn.addEventListener('click', () => setDrawer());
  if (backdrop) backdrop.addEventListener('click', () => setDrawer(false));

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => setDrawer(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      setDrawer(false);
      toggleBtn.focus();
    }
  });
}

/**
 * 2. Active Navigation Spy (IntersectionObserver)
 */
function initNavSpy() {
  const sections = document.querySelectorAll('section[id], header[id="top"]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  });

  sections.forEach(sec => observer.observe(sec));
}

/**
 * 3. Card Spotlight Cursor Tracking
 */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);
    });
  });
}

/**
 * 4. Project Filtering System
 */
function initProjectFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-bento-card');

  if (!filterPills.length || !projectCards.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');

      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        const matches = filter === 'all' || categories.split(' ').includes(filter);

        if (matches) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/**
 * 5. Copy Email to Clipboard with Toast Notification
 */
function initClipboardCopy() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toastStack = document.getElementById('toast-stack');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy') || 'snp050106@gmail.com';
      const labelSpan = btn.querySelector('.copy-label');

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const temp = document.createElement('input');
          temp.value = textToCopy;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }

        if (labelSpan) {
          const original = labelSpan.textContent;
          labelSpan.textContent = 'Copied!';
          setTimeout(() => { labelSpan.textContent = original; }, 2000);
        }

        renderToast(`Copied "${textToCopy}" to clipboard.`);
      } catch (err) {
        renderToast('Failed to copy to clipboard.');
      }
    });
  });

  function renderToast(message) {
    if (!toastStack) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <span class="toast-check">✓</span>
      <span>${message}</span>
    `;

    toastStack.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => { toast.remove(); }, 300);
    }, 3000);
  }
}

/**
 * 7. Kinetic Hero Number Counters
 */
function initHeroCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetNum = parseInt(el.getAttribute('data-counter'), 10);
        animateCounter(el, targetNum);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));

  function animateCounter(el, target) {
    const suffix = el.getAttribute('data-suffix') !== null ? el.getAttribute('data-suffix') : '+';
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      const current = Math.floor(ease * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }
}

/**
 * 8. Back to Top Smooth Scroll
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 9. Project Interactive Decks (Tab Routing)
 */
function initProjectDecks() {
  const deckTabBtns = document.querySelectorAll('.deck-tab-btn');

  deckTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const deckName = btn.getAttribute('data-deck');
      const tabName = btn.getAttribute('data-tab');

      // Update active button within this deck
      const parentNav = btn.closest('.deck-nav');
      if (parentNav) {
        parentNav.querySelectorAll('.deck-tab-btn').forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');

      // Update visible panel in this deck
      const parentDeck = btn.closest('.project-interactive-deck');
      if (parentDeck) {
        parentDeck.querySelectorAll('.deck-panel').forEach(p => {
          if (p.id === `${deckName}-${tabName}`) {
            p.style.display = 'block';
            p.classList.add('active');
          } else {
            p.style.display = 'none';
            p.classList.remove('active');
          }
        });
      }
    });
  });
}

/**
 * 10. BuildSouk Simulators (Postgres Role Matrix & Zero-Float Calculator)
 */
function initBuildSoukSimulator() {
  // Role Matrix
  const roleChips = document.querySelectorAll('.role-chip');
  const roleOutput = document.getElementById('buildsouk-role-output');

  const roleData = {
    app: {
      sql: `<span class="sql-keyword">SET LOCAL</span> app.current_org_id = <span class="sql-str">'org_buyer_92'</span>;`,
      perms: [
        { ok: true, text: 'Read Buyer Org Orders & Invoices' },
        { ok: true, text: 'Query Shared LPO / GRN Contracts' },
        { ok: false, text: 'Access Seller Private Margins (FORCE RLS Blocked)' },
        { ok: false, text: 'Execute DDL / Drop Tables (Role Grant Blocked)' }
      ]
    },
    anon: {
      sql: `<span class="sql-keyword">SELECT</span> catalog_item_id, spec_sheet <span class="sql-keyword">FROM</span> public_catalog;`,
      perms: [
        { ok: true, text: 'Browse Public Material Price Index' },
        { ok: false, text: 'View Any Tenant Order Data (Unauthorized)' },
        { ok: false, text: 'Mutate Warehouse Inventory (Blocked)' },
        { ok: false, text: 'Access Financial Ledgers (Blocked)' }
      ]
    },
    system: {
      sql: `<span class="sql-keyword">SELECT</span> * <span class="sql-keyword">FROM</span> order_state_fsm <span class="sql-keyword">WHERE</span> status = <span class="sql-str">'PENDING_DISPATCH'</span>;`,
      perms: [
        { ok: true, text: 'Execute Automated FSM State Transitions' },
        { ok: true, text: 'Dispatch Logistics SMS & Email Webhooks' },
        { ok: true, text: 'Generate Immutable Audit Log Hash' },
        { ok: false, text: 'Bypass Bilateral Escrow Release (Trigger Blocked)' }
      ]
    },
    migrator: {
      sql: `<span class="sql-keyword">ALTER TABLE</span> invoices <span class="sql-keyword">ADD COLUMN</span> vat_breakdown jsonb;`,
      perms: [
        { ok: true, text: 'Execute DDL Migrations via Drizzle Kit' },
        { ok: true, text: 'Assert pg_catalog Policies & Grants' },
        { ok: false, text: 'Query Live Customer PII Data' },
        { ok: false, text: 'Bypass CI Schema Guard Gate' }
      ]
    }
  };

  roleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      roleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const roleKey = chip.getAttribute('data-role');
      const data = roleData[roleKey];
      if (data && roleOutput) {
        let permsHTML = data.perms.map(p => `
          <li class="perm-item ${p.ok ? 'perm-allow' : 'perm-deny'}">
            <span class="perm-icon">${p.ok ? '✓' : '✗'}</span>
            <span>${p.text}</span>
          </li>
        `).join('');

        roleOutput.innerHTML = `
          <div class="sql-preview-line">${data.sql}</div>
          <ul class="permission-check-list">${permsHTML}</ul>
        `;
      }
    });
  });

  // Zero-Float Calculator
  const slider = document.getElementById('rebar-tonnes-slider');
  const readout = document.getElementById('rebar-tonnes-val');
  const floatPreview = document.getElementById('float-math-preview');
  const bigintPreview = document.getElementById('bigint-math-preview');

  if (slider && readout && floatPreview && bigintPreview) {
    const rateAED = 2450.75;
    const vatMultiplier = 1.05; // 5% UAE VAT

    slider.addEventListener('input', () => {
      const tonnes = parseFloat(slider.value);
      readout.textContent = tonnes.toLocaleString();

      // Standard IEEE 754 float
      const subtotalFloat = tonnes * rateAED;
      const totalFloat = subtotalFloat * vatMultiplier;
      floatPreview.textContent = `${totalFloat} AED (Rounding Noise)`;

      // BigInt Micro-Fils Math (1 AED = 100 Fils = 100,000,000 Micro-Fils)
      const tonnesBig = BigInt(tonnes);
      const microFilsRate = 245075000000n; // 2450.75 AED in micro-fils
      const subtotalBig = tonnesBig * microFilsRate;
      const totalBig = (subtotalBig * 105n) / 100n;
      
      const exactAED = Number(totalBig) / 100000000;
      bigintPreview.textContent = `${exactAED.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED (0.000000 Error)`;
    });
  }
}

/**
 * 11. Nivesh Simulators (Multi-Agent Debate & Black-Scholes Greeks)
 */
function initNiveshSimulators() {
  // Multi-Agent Stock Debate Selector
  const tickerPills = document.querySelectorAll('.ticker-pill');
  const govText = document.getElementById('agent-gov-text');
  const microText = document.getElementById('agent-micro-text');
  const fundText = document.getElementById('agent-fund-text');
  const newsText = document.getElementById('agent-news-text');
  const fusionVerdict = document.getElementById('fusion-verdict-val');
  const fusionMeter = document.getElementById('fusion-meter-bar');

  const stockDebates = {
    RELIANCE: {
      gov: 'Promoter pledging 0.0%, Clean auditor report, No related-party escalation.',
      micro: 'Tight bid-ask spread ($0.05), institutional VWAP accumulation detected.',
      fund: 'Piotroski F-Score: 8/9, Beneish M-Score: -2.85 (No earnings manipulation).',
      news: 'Positive quarterly earnings call transcript sentiment (pgvector RAG score 0.89).',
      score: 88,
      verdict: 'STRONG BUY (Score: 88/100)'
    },
    TCS: {
      gov: 'Zero debt, pristine corporate governance, high institutional holding.',
      micro: 'Low volatility regime (IV: 17.5%), strong support at 200-day EMA.',
      fund: 'Return on Equity (ROE) 48.2%, Free Cash Flow conversion > 100%.',
      news: 'Strategic North American cloud migration contracts secured.',
      score: 92,
      verdict: 'STRONG BUY (Score: 92/100)'
    },
    HDFCBANK: {
      gov: 'Post-merger loan book alignment, standard provisioning coverage ratio.',
      micro: 'High options open interest at ₹1,650 strike, call skew observed.',
      fund: 'Net Interest Margin (NIM) stable at 3.65%, Gross NPA under 1.25%.',
      news: 'Management targets retail deposit expansion over next 4 quarters.',
      score: 81,
      verdict: 'ACCUMULATE (Score: 81/100)'
    }
  };

  tickerPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tickerPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const ticker = pill.getAttribute('data-ticker');
      const data = stockDebates[ticker];

      if (data) {
        if (govText) govText.textContent = data.gov;
        if (microText) microText.textContent = data.micro;
        if (fundText) fundText.textContent = data.fund;
        if (newsText) newsText.textContent = data.news;
        if (fusionVerdict) fusionVerdict.textContent = data.verdict;
        if (fusionMeter) fusionMeter.style.width = `${data.score}%`;
      }
    });
  });

  // Black-Scholes Greeks Calculator
  const spotSlider = document.getElementById('spot-slider');
  const spotVal = document.getElementById('spot-price-val');
  const ivSlider = document.getElementById('iv-slider');
  const ivVal = document.getElementById('iv-val');

  const gDelta = document.getElementById('greek-delta');
  const gGamma = document.getElementById('greek-gamma');
  const gVega = document.getElementById('greek-vega');
  const gTheta = document.getElementById('greek-theta');

  function updateGreeks() {
    if (!spotSlider || !ivSlider) return;

    const S = parseFloat(spotSlider.value);
    const sigmaPct = parseFloat(ivSlider.value);
    const sigma = sigmaPct / 100;
    const K = 2800; // Strike
    const T = 30 / 365; // 30 days
    const r = 0.065; // 6.5% risk free rate

    if (spotVal) spotVal.textContent = `₹${S.toLocaleString()}`;
    if (ivVal) ivVal.textContent = `${sigmaPct}%`;

    // Standard Normal Cumulative Distribution Function (CDF) approximation
    function normCDF(x) {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;

      const sign = x < 0 ? -1 : 1;
      const absX = Math.abs(x) / Math.sqrt(2);
      const t = 1.0 / (1.0 + p * absX);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

      return 0.5 * (1.0 + sign * y);
    }

    function normPDF(x) {
      return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
    }

    const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const delta = normCDF(d1);
    const gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));
    const vega = (S * normPDF(d1) * Math.sqrt(T)) / 100;
    const theta = (-(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normCDF(d2)) / 365;

    if (gDelta) gDelta.textContent = delta.toFixed(3);
    if (gGamma) gGamma.textContent = gamma.toFixed(4);
    if (gVega) gVega.textContent = vega.toFixed(2);
    if (gTheta) gTheta.textContent = theta.toFixed(2);
  }

  if (spotSlider && ivSlider) {
    spotSlider.addEventListener('input', updateGreeks);
    ivSlider.addEventListener('input', updateGreeks);
  }
}

/**
 * 12. Gazprea Compiler Stepper (Lowering Pipeline)
 */
function initGazpreaStepper() {
  const stageBtns = document.querySelectorAll('.stage-step-btn');
  const viewerTitle = document.getElementById('stage-viewer-title');
  const viewerTag = document.getElementById('stage-viewer-tag');
  const codeContent = document.getElementById('stage-code-content');

  const stages = [
    {
      title: 'Stage 01 — Source Code (Matrix Multiply)',
      tag: 'Gazprea Language (.gaz)',
      code: `// Gazprea Source (.gaz)
procedure main() {
    matrix[real, 2, 2] A = [[1.0, 2.0], [3.0, 4.0]];
    matrix[real, 2, 2] B = [[2.0, 0.0], [1.0, 3.0]];
    matrix[real, 2, 2] C = A ** B; // Matrix Multiplication
    -> C;
}`
    },
    {
      title: 'Stage 02 — Static Polymorphic Typed AST',
      tag: 'C++20 AST Node (CRTP)',
      code: `// CRTP AST Representation
class MatrixMulExprNode : public ExprNode<MatrixMulExprNode> {
public:
    Type check_type(SemanticContext& ctx) override {
        auto lhs_t = lhs->check_type(ctx);
        auto rhs_t = rhs->check_type(ctx);
        // Assert: lhs_t.cols == rhs_t.rows
        if (lhs_t.dim(1) != rhs_t.dim(0)) {
            ctx.emit_diagnostic("Dimension mismatch in matrix multiplication");
        }
        return Type::Matrix(lhs_t.elem_type(), lhs_t.dim(0), rhs_t.dim(1));
    }
};`
    },
    {
      title: 'Stage 03 — Multi-Dialect MLIR Lowering',
      tag: 'MLIR (linalg, memref, scf)',
      code: `// Emitted MLIR Dialects
func.func @matrix_mul(%A: memref<2x2xf32>, %B: memref<2x2xf32>, %C: memref<2x2xf32>) {
  affine.for %i = 0 to 2 {
    affine.for %j = 0 to 2 {
      affine.for %k = 0 to 2 {
        %a = affine.load %A[%i, %k] : memref<2x2xf32>
        %b = affine.load %B[%k, %j] : memref<2x2xf32>
        %c = affine.load %C[%i, %j] : memref<2x2xf32>
        %prod = arith.mulf %a, %b : f32
        %sum = arith.addf %c, %prod : f32
        affine.store %sum, %C[%i, %j] : memref<2x2xf32>
      }
    }
  }
  return
}`
    },
    {
      title: 'Stage 04 — Optimized Assembly & LLVM IR',
      tag: 'Target Assembly (x86_64 AVX2 / RISC-V)',
      code: `// Vectorized AVX2 Assembly Output
matrix_mul:
    vmovups   (%rdi), %xmm0
    vmovups   (%rsi), %xmm1
    vshufps   $0, %xmm0, %xmm0, %xmm2
    vmulps    %xmm1, %xmm2, %xmm2
    vshufps   $85, %xmm0, %xmm0, %xmm3
    vfmadd231ps %xmm1, %xmm3, %xmm2
    vmovups   %xmm2, (%rdx)
    retq`
    }
  ];

  stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const stageIdx = parseInt(btn.getAttribute('data-stage'), 10);
      const stage = stages[stageIdx];

      if (stage && codeContent) {
        if (viewerTitle) viewerTitle.textContent = stage.title;
        if (viewerTag) viewerTag.textContent = stage.tag;
        codeContent.textContent = stage.code;
      }
    });
  });
}
