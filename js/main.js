// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // --------- Configuration ---------
  // If your backend is deployed elsewhere, set the full URL here, e.g.
  // const CHAT_API_URL = 'https://your-backend.vercel.app/chat';
  const CHAT_API_URL = '/chat'; // default: same origin

  // --------- Quick guards ---------
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded. Some animations will be disabled.');
  } else {
    gsap.registerPlugin();
    gsap.to('body', { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' });
  }

  // --------- Mobile nav toggle ---------
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });

  // --------- Theme toggle ---------
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  if (savedTheme === 'light') document.body.classList.add('light-theme');
  if (themeToggle) {
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeToggle.textContent = isLight ? '🌙' : '☀️';
      if (window.gsap) gsap.fromTo('body', { opacity: 0.92 }, { opacity: 1, duration: 0.4 });
    });
  }

  // --------- Small hero & profile animations ---------
  const profileCard = document.getElementById('profileCard');
  if (profileCard && window.gsap) {
    gsap.to(profileCard, { y: -8, duration: 2.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    profileCard.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / 30;
      const dy = (e.clientY - cy) / 30;
      gsap.to(profileCard, { rotationY: dx, rotationX: -dy, transformPerspective: 900, duration: 0.45, ease: 'power3.out' });
    });
    profileCard.addEventListener('mouseleave', () => gsap.to(profileCard, { rotationY: 0, rotationX: 0, duration: 0.5 }));
  }

  const profileImg = document.querySelector('.pfp');
  if (profileImg && window.gsap) {
    gsap.from(profileImg, { scale: 0.92, rotate: -4, opacity: 0, duration: 1.0, ease: 'power2.out', scrollTrigger: { trigger: profileImg, start: 'top 90%' }});
    gsap.to(profileImg, { y: -6, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }
  const aboutPhoto = document.querySelector('.about-photo');
  if (aboutPhoto && window.gsap) gsap.to(aboutPhoto, { y: -6, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  // --------- Counters ---------
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target || '0', 10);
    if (!isNaN(target) && window.gsap) {
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target,
        duration: 1.6,
        snap: { innerText: 1 },
        ease: 'power1.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    }
  });

  // --------- Slider (home) ---------
  (function() {
    const slider = document.getElementById('projectSlider');
    if (!slider) return;
    let index = 0;
    const slides = slider.querySelectorAll('.slide');
    const prev = document.getElementById('prevSlide');
    const next = document.getElementById('nextSlide');

    const getWidth = () => {
      const s = slides[0];
      return s ? s.getBoundingClientRect().width + parseFloat(getComputedStyle(s).marginRight || 0) : 320;
    };
    const update = () => {
      const w = getWidth();
      if (window.gsap) gsap.to(slider, { x: -index * w, duration: 0.6, ease: 'power2.out' });
    };
    prev?.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
    next?.addEventListener('click', () => { index = Math.min(slides.length - 1, index + 1); update(); });
    setInterval(() => { index = (index + 1) % slides.length; update(); }, 4800);
    window.addEventListener('resize', update);
  })();

  // --------- Draggable carousel ---------
  (function() {
    const track = document.getElementById('carouselTrack');
    if (!track || typeof Draggable === 'undefined') return;
    gsap.set(track, { x: 0 });
    const bounds = { minX: -(track.scrollWidth - (track.parentElement?.clientWidth || 0)), maxX: 0 };
    Draggable.create(track, { type: 'x', bounds, inertia: true, edgeResistance: 0.85 });

    document.getElementById('prevBtn')?.addEventListener('click', () => {
      const cur = track._gsTransform ? track._gsTransform.x : 0;
      const nextX = Math.min(cur + 320, 0);
      gsap.to(track, { x: nextX, duration: 0.6, ease: 'power2.out' });
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => {
      const cur = track._gsTransform ? track._gsTransform.x : 0;
      const max = -(track.scrollWidth - (track.parentElement?.clientWidth || 0));
      const nextX = Math.max(cur - 320, max);
      gsap.to(track, { x: nextX, duration: 0.6, ease: 'power2.out' });
    });
  })();

  // --------- Cards tilt ---------
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const px = (x / r.width - 0.5) * 12;
      const py = (y / r.height - 0.5) * -8;
      if (window.gsap) gsap.to(card, { rotationY: px, rotationX: py, transformPerspective: 900, duration: 0.35, ease: 'power3.out' });
    });
    card.addEventListener('mouseleave', () => { if (window.gsap) gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.45 }); });
  });

  // --------- Chatbot UI (Option B) ---------
  const bubble = document.getElementById('chat-bubble');
  const win = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const messagesWrap = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');

  let chatOpen = false;
  let conversation = []; // session memory while page open

  function openChat() {
    if (!win || !bubble) return;
    chatOpen = true;
    win.setAttribute('aria-hidden', 'false');
    if (window.gsap) gsap.to(win, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
    chatInput.focus();
  }
  function closeChat() {
    chatOpen = false;
    win.setAttribute('aria-hidden', 'true');
    if (window.gsap) gsap.to(win, { y: 18, opacity: 0, duration: 0.35, ease: 'power2.in' });
  }

  bubble?.addEventListener('click', () => {
    if (chatOpen) closeChat(); else openChat();
  });
  closeBtn?.addEventListener('click', closeChat);

  function appendMessage(text, cls = 'bot') {
    const el = document.createElement('div');
    el.className = cls === 'user' ? 'message user' : 'message';
    el.textContent = text;
    messagesWrap.appendChild(el);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  function appendTyping() {
    const el = document.createElement('div');
    el.className = 'typing';
    el.id = 'typing-indicator';
    el.textContent = 'Assistant is typing...';
    messagesWrap.appendChild(el);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }
  function removeTyping() {
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
  }

  async function sendMessage(msg) {
    if (!msg || !msg.trim()) return;
    appendMessage(msg, 'user');
    chatInput.value = '';
    appendTyping();
    conversation.push({ role: 'user', content: msg });

    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, conversation: conversation })
      });

      if (!res.ok) throw new Error('Network response not ok');

      const data = await res.json();
      removeTyping();
      appendMessage(data.reply || 'Sorry, no response from assistant.');
      conversation.push({ role: 'assistant', content: data.reply || '' });
    } catch (err) {
      removeTyping();
      appendMessage('Sorry — something went wrong. Try again later.');
      console.error(err);
    }
  }

  // Submit on button
  chatSend?.addEventListener('click', () => sendMessage(chatInput.value));

  // Submit on Enter
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput.value);
    }
  });

  // Add a small welcome message on open
  bubble?.addEventListener('click', () => {
    if (!messagesWrap.querySelector('.message')) {
      appendMessage("Hi — I'm Navneet's assistant. Ask me about his projects, skills, or anything else!", 'bot');
    }
  });

  // When page loads, small ping to bot (optional) to preload GPT (keeps fast)
  // Don't call automatically to avoid unnecessary API usage — leave commented
  // sendMessage("Hello");
});
