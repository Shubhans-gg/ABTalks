/* ═══════════════════════════════════════════════════════════
   AB TALKS — Client-Side JavaScript
   Scroll reveals, form handling, LinkedIn post generator,
   streak shields, and micro-interactions.
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initProgressRing();
});


/* ─── Scroll Reveal ──────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}


/* ─── Progress Ring Animation ────────────────────────────── */
function initProgressRing() {
  const ring = document.querySelector('.progress-ring-fill');
  if (!ring) return;

  const circumference = 314.159; // 2 * π * 50
  const targetOffset = parseFloat(ring.getAttribute('data-target'));

  // Start fully empty, then animate to target
  ring.style.strokeDashoffset = circumference;

  requestAnimationFrame(() => {
    setTimeout(() => {
      ring.style.strokeDashoffset = targetOffset;
    }, 300);
  });
}


/* ─── Objective Checkboxes ───────────────────────────────── */
function toggleObjective(el) {
  const isChecked = el.classList.contains('checked');

  if (isChecked) {
    el.classList.remove('checked');
    el.innerHTML = '';
    el.setAttribute('aria-checked', 'false');
    el.parentElement.querySelector('.objective-text').style.textDecoration = 'none';
    el.parentElement.querySelector('.objective-text').style.color = '';
  } else {
    el.classList.add('checked');
    el.innerHTML = '✓';
    el.setAttribute('aria-checked', 'true');
    el.parentElement.querySelector('.objective-text').style.textDecoration = 'line-through';
    el.parentElement.querySelector('.objective-text').style.color = 'var(--text-muted)';
  }
}


/* ─── Form Submission ────────────────────────────────────── */
async function submitDay(event) {
  event.preventDefault();

  const form = document.getElementById('submission-form');
  const submitBtn = document.getElementById('submit-btn');
  const githubUrl = document.getElementById('github-url').value;
  const linkedinUrl = document.getElementById('linkedin-url').value;

  // Validate
  if (!githubUrl) {
    showToast('Please enter your GitHub URL', 'error');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '⏳ Submitting...';

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day: window.dayData.day,
        github_url: githubUrl,
        linkedin_url: linkedinUrl
      })
    });

    const data = await response.json();

    if (data.success) {
      showToast(data.message, 'success');

      // Transform submit button to success state
      submitBtn.innerHTML = '✅ Submitted!';
      submitBtn.classList.remove('btn-success');
      submitBtn.style.background = 'var(--accent-green-dim)';
      submitBtn.style.color = 'var(--accent-green)';
      submitBtn.style.boxShadow = 'none';

      // Disable form inputs
      document.getElementById('github-url').disabled = true;
      document.getElementById('linkedin-url').disabled = true;
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    showToast('Something went wrong. Please try again.', 'error');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🚀 Submit Day ' + window.dayData.day;
  }
}


/* ─── LinkedIn Post Generator ────────────────────────────── */
async function generatePost() {
  const githubUrl = document.getElementById('github-url')?.value || '';

  try {
    const response = await fetch('/api/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day: window.dayData.day,
        title: window.dayData.title,
        track: window.dayData.track,
        github_url: githubUrl
      })
    });

    const data = await response.json();
    document.getElementById('generated-post').value = data.post;
    openModal();
  } catch (err) {
    showToast('Could not generate post. Please try again.', 'error');
  }
}


/* ─── Copy Post ──────────────────────────────────────────── */
async function copyPost() {
  const textarea = document.getElementById('generated-post');
  const text = textarea.value;

  try {
    await navigator.clipboard.writeText(text);
    showToast('📋 Post copied to clipboard!', 'success');
    closeModal();
  } catch (err) {
    // Fallback for older browsers
    textarea.select();
    document.execCommand('copy');
    showToast('📋 Post copied to clipboard!', 'success');
    closeModal();
  }
}


/* ─── Streak Shield ──────────────────────────────────────── */
async function useShield(dayNumber) {
  const btn = document.getElementById('shield-btn-' + dayNumber);
  if (!btn) return;

  btn.disabled = true;
  btn.innerHTML = '⏳ Activating...';

  try {
    const response = await fetch('/api/use-shield', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day: dayNumber })
    });

    const data = await response.json();

    if (data.success) {
      showToast(data.message, 'success');
      btn.innerHTML = '✅ Shield Activated';
      btn.classList.remove('btn-success');
      btn.style.background = 'var(--accent-amber-dim)';
      btn.style.color = 'var(--accent-amber)';
      btn.style.boxShadow = 'none';

      // Update the missed card visually
      const missedCard = btn.closest('.missed-card');
      if (missedCard) {
        missedCard.style.borderColor = 'rgba(245, 158, 11, 0.2)';
        missedCard.querySelector('.missed-icon').textContent = '🛡️';
        missedCard.querySelector('h3').textContent = 'Day Protected!';
        missedCard.querySelector('h3').style.color = 'var(--accent-amber)';
      }
    }
  } catch (err) {
    showToast('Could not activate shield. Try again.', 'error');
    btn.disabled = false;
    btn.innerHTML = '🛡️ Use Streak Shield';
  }
}


/* ─── Modal ──────────────────────────────────────────────── */
function openModal() {
  const modal = document.getElementById('post-modal');
  if (!modal) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', handleEscKey);
}

function closeModal() {
  const modal = document.getElementById('post-modal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
  if (e.key === 'Escape') closeModal();
}


/* ─── Toast Notifications ────────────────────────────────── */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) {
    // Create toast if it doesn't exist on this page
    const t = document.createElement('div');
    t.className = 'toast';
    t.id = 'toast';
    document.body.appendChild(t);
    return showToast(message, type);
  }

  toast.textContent = message;
  toast.className = 'toast toast-' + type + ' show';

  // Auto-hide after 3 seconds
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}


/* ─── Smooth Scroll for Anchor Links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
