/**
 * Premium Full Stack Developer Portfolio - Interactions & Logic
 * Author: Antigravity AI
 * Technology: Vanilla JavaScript ES6
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initNavbar();
    initScrollReveal();
    initBackToTop();
    initSkillProgress();
    initTextSwitcher();
    initContactForm();
    initGitHubRepos();
});

/**
 * 1. Sticky & Collapsing Navbar Actions
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar-custom');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Add scrolled class when page is scrolled
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page loads scrolled

    // Auto-close mobile navbar on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    // ScrollSpy: Highlight active navbar link
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px' // Adjust active threshold range
    });

    sections.forEach(section => scrollSpyObserver.observe(section));
}

/**
 * 2. Scroll Reveal Animations (Intersection Observer)
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale-in'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Unobserve once shown to optimize performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * 3. Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 4. Skill Progress Bars Animation
 * Triggers animation only when Skills section is scrolled into view
 */
function initSkillProgress() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const progressBars = document.querySelectorAll('.skill-progress-bar');
    
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const percent = bar.getAttribute('data-percent');
                    bar.style.width = `${percent}%`;
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    skillsObserver.observe(skillsSection);
}


/**
 * 6. Contact Form — Real Email Delivery via EmailJS
 *
 * ── SETUP (one-time, ~5 minutes) ──────────────────────────────────────────
 *  1. Sign up free at https://www.emailjs.com/
 *  2. Create a Gmail "Email Service" (connect your vjsathish1906@gmail.com)
 *  3. Create an "Email Template" with these template variables:
 *        {{from_name}}   {{from_email}}   {{subject}}   {{message}}
 *  4. Replace the three placeholder strings below with your real IDs:
 *        EMAILJS_PUBLIC_KEY  → Account → API Keys
 *        EMAILJS_SERVICE_ID  → Email Services → Service ID
 *        EMAILJS_TEMPLATE_ID → Email Templates → Template ID
 * ──────────────────────────────────────────────────────────────────────────
 */
const EMAILJS_PUBLIC_KEY  = 'Eog-lYO_MT1u_xcpv';   // ✅ Public Key
const EMAILJS_SERVICE_ID  = 'service_3h0oa6q';      // ✅ Service ID
const EMAILJS_TEMPLATE_ID = 'template_u2e2gdb';     // ✅ Template ID

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Bootstrap validation check
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const name    = document.getElementById('contactName').value.trim();
        const email   = document.getElementById('contactEmail').value.trim();
        const phone   = document.getElementById('contactPhone').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        const submitBtn      = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        submitBtn.disabled  = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

        // Guard: warn if credentials not yet replaced
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            console.warn('[Contact Form] EmailJS credentials not configured. Please follow the SETUP steps in script.js.');
            submitBtn.disabled  = false;
            submitBtn.innerHTML = originalBtnText;
            showToast('Setup Required', 'EmailJS is not configured yet. See the script.js setup instructions.', 'error');
            return;
        }

        // Initialize EmailJS (idempotent — safe to call multiple times)
        emailjs.init(EMAILJS_PUBLIC_KEY);

        // Send the email
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name:    name,
            from_email:   email,
            phone_number: phone || 'Not provided',
            subject:      subject,
            message:      message,
            reply_to:     email
        })
        .then(() => {
            submitBtn.disabled  = false;
            submitBtn.innerHTML = originalBtnText;
            showToast('Message Sent! ✅', `Thank you, ${name}! I'll get back to you at ${email} soon.`, 'success');
            form.reset();
            form.classList.remove('was-validated');
        })
        .catch((error) => {
            console.error('[EmailJS Error]', error);
            submitBtn.disabled  = false;
            submitBtn.innerHTML = originalBtnText;
            showToast('Send Failed ❌', 'Something went wrong. Please try emailing directly at vjsathish1906@gmail.com', 'error');
        });
    });
}

/**
 * Helper: Show visual toast notification using Bootstrap standard toast structure
 */
function showToast(title, message, type = 'success') {
    // Create toast container if not exists
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastId = `toast-${Date.now()}`;
    const borderClass = type === 'success' ? 'border-success' : 'border-danger';
    const textClass = type === 'success' ? 'text-success' : 'text-danger';
    const iconClass = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';

    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center bg-white border ${borderClass}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi ${iconClass} ${textClass} fs-5"></i>
                        <div>
                            <strong class="${textClass}">${title}</strong>
                            <div class="text-muted mt-1 small">${message}</div>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastEl = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
    bsToast.show();

    // Remove element after hide
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

/**
 * 7. Dynamic Word/Text Typing Animation
 */
function initTextSwitcher() {
    const textElement = document.getElementById('dynamic-text');
    if (!textElement) return;
    
    const words = ["MERN Stack Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 40 : 100;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

/* ============================================================
 * 8. GitHub Repos Auto-Sync (GitHub REST API v3)
 * Fetches all public repos for Venkadesh-463 and renders
 * them as live project cards — zero manual work needed.
 * ============================================================ */
function initGitHubRepos() {
    const GITHUB_USERNAME = 'Venkadesh-463';
    const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

    // Repos to skip (leetcode practice, forks, etc.)
    const SKIP_REPOS = ['Leetcode'];

    // Language color map (GitHub-style)
    const LANG_COLORS = {
        JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
        PHP: '#4F5D95', Java: '#b07219', 'C++': '#f34b7d', C: '#555555',
        HTML: '#e34c26', CSS: '#563d7c', Ruby: '#701516', Go: '#00ADD8',
        Rust: '#dea584', Dart: '#00B4AB', Swift: '#F05138', Kotlin: '#A97BFF',
        Shell: '#89e051', Vue: '#41b883', default: '#8b949e'
    };

    const grid       = document.getElementById('github-repos-grid');
    const statusDot  = document.getElementById('github-status-dot');
    const statusText = document.getElementById('github-status-text');
    const lastSynced = document.getElementById('github-last-synced');

    if (!grid) return;

    // ── Fetch repos ──────────────────────────────────────────
    fetch(API_URL)
        .then(res => {
            if (res.status === 403) throw new Error('rate_limited');
            if (!res.ok)           throw new Error('api_error');
            return res.json();
        })
        .then(repos => {
            // Filter: exclude forks & skipped repos
            const filtered = repos.filter(r => !r.fork && !SKIP_REPOS.includes(r.name));

            // Update status → green
            setStatus('live', `${filtered.length} repositories loaded`);

            // Clear skeleton loaders
            grid.innerHTML = '';

            if (filtered.length === 0) {
                grid.innerHTML = '<p class="text-center text-muted">No public repositories found.</p>';
                return;
            }

            // Render each repo card with staggered animation delay
            filtered.forEach((repo, index) => {
                const card = buildRepoCard(repo, index, LANG_COLORS);
                grid.insertAdjacentHTML('beforeend', card);
            });

            // Re-run scroll reveal on newly added cards
            document.querySelectorAll('.repo-card-col').forEach(el => {
                el.classList.add('reveal-fade-up');
                setTimeout(() => el.classList.add('reveal-visible'), 50);
            });

            // Timestamp
            const now = new Date();
            lastSynced.textContent = `🕐 Last synced: ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        })
        .catch(err => {
            if (err.message === 'rate_limited') {
                setStatus('warn', 'GitHub API rate limit reached — showing cached data');
                grid.innerHTML = buildErrorCard('⚠️ Rate Limited', 'You\'ve hit GitHub\'s 60 req/hr limit. Please wait a few minutes and refresh the page.', 'warning');
            } else {
                setStatus('error', 'Failed to load repositories');
                grid.innerHTML = buildErrorCard('❌ Connection Error', 'Could not reach GitHub API. Please check your internet connection and try refreshing.', 'error');
            }
        });

    // ── Build a single repo card HTML string ─────────────────
    function buildRepoCard(repo, index, colors) {
        const lang      = repo.language || 'N/A';
        const langColor = colors[lang] || colors.default;
        const desc      = repo.description || 'No description provided.';
        const stars     = repo.stargazers_count;
        const forks     = repo.watchers_count;
        const updatedAt = timeAgo(repo.updated_at);
        const topics    = (repo.topics || []).slice(0, 3);

        const topicsHTML = topics.length
            ? topics.map(t => `<span class="repo-topic">${t}</span>`).join('')
            : '';

        const delay = Math.min(index * 60, 500);

        return `
        <div class="col-lg-4 col-md-6 repo-card-col" style="animation-delay:${delay}ms">
            <div class="repo-card" id="repo-${repo.name.toLowerCase().replace(/[^a-z0-9]/g,'-')}">
                <div class="repo-card-header">
                    <div class="repo-name-row">
                        <i class="bi bi-book repo-icon"></i>
                        <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-name">${repo.name}</a>
                        ${repo.private ? '<span class="repo-badge-private">Private</span>' : '<span class="repo-badge-public">Public</span>'}
                    </div>
                    <p class="repo-desc">${desc}</p>
                </div>
                <div class="repo-card-footer">
                    ${topicsHTML ? `<div class="repo-topics">${topicsHTML}</div>` : ''}
                    <div class="repo-meta">
                        <span class="repo-lang">
                            <span class="repo-lang-dot" style="background:${langColor}"></span>
                            ${lang}
                        </span>
                        <span class="repo-stat" title="Stars">
                            <i class="bi bi-star"></i> ${stars}
                        </span>
                        <span class="repo-stat" title="Watchers">
                            <i class="bi bi-eye"></i> ${forks}
                        </span>
                        <span class="repo-updated">Updated ${updatedAt}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-view-btn">
                        <i class="bi bi-github"></i> View Repo
                    </a>
                </div>
            </div>
        </div>`;
    }

    // ── Error / fallback card ─────────────────────────────────
    function buildErrorCard(title, msg, type) {
        const icon = type === 'warning' ? 'bi-exclamation-triangle-fill text-warning' : 'bi-wifi-off text-danger';
        return `
        <div class="col-12 text-center py-4">
            <i class="bi ${icon} fs-1 mb-3 d-block"></i>
            <h5 class="mb-2">${title}</h5>
            <p class="text-muted">${msg}</p>
            <button onclick="location.reload()" class="btn btn-custom btn-custom-secondary mt-2">
                <i class="bi bi-arrow-clockwise"></i> Retry
            </button>
        </div>`;
    }

    // ── Status bar helper ─────────────────────────────────────
    function setStatus(state, message) {
        statusText.textContent = message;
        statusDot.className = 'github-status-dot';
        if (state === 'live')  statusDot.classList.add('status-live');
        if (state === 'warn')  statusDot.classList.add('status-warn');
        if (state === 'error') statusDot.classList.add('status-error');
    }

    // ── Relative time helper ──────────────────────────────────
    function timeAgo(dateStr) {
        const diff  = Date.now() - new Date(dateStr).getTime();
        const mins  = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days  = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years  = Math.floor(days / 365);
        if (mins  < 1)   return 'just now';
        if (mins  < 60)  return `${mins}m ago`;
        if (hours < 24)  return `${hours}h ago`;
        if (days  < 30)  return `${days}d ago`;
        if (months < 12) return `${months}mo ago`;
        return `${years}y ago`;
    }
}
