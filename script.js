(() => {
  const STORAGE_KEY = 'sd-portfolio-data-v1';
  const fallback = window.PORTFOLIO_DATA || {};
  let data = fallback;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) data = JSON.parse(saved);
  } catch (error) { console.warn('Could not read saved portfolio data.', error); }
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safe = (value = '') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const profile = data.profile || {};

  // Fill personal details from the single editable data file.
  const setText = (id, value) => { const el = document.getElementById(id); if (el && value != null) el.textContent = value; };
  setText('brandName', (profile.name || 'SATYANAND DUBEY').toUpperCase());
  setText('availability', profile.availability || 'AVAILABLE FOR SELECT PROJECTS');
  setText('heroLocation', (profile.location || 'INDIA').toUpperCase());
  setText('heroIntro', profile.intro);
  setText('aboutText', profile.about);
  setText('approachText', profile.approach);
  setText('agencyName', profile.agency);
  setText('agencyLocation', profile.agencyLocation || profile.location);
  setText('year', new Date().getFullYear());

  const email = profile.email || '';
  const instagram = profile.instagram || '';
  const phone = profile.phone || '';
  const whatsapp = profile.whatsapp || (phone || '').replace(/\D/g, '');
  const emailButton = $('#emailButton');
  const emailText = $('#emailText');
  const phoneText = $('#phoneText');
  const instaLink = $('#instagramLink');
  const waButton = $('#whatsappButton');
  if (emailButton) emailButton.href = `mailto:${email}`;
  if (emailText) { emailText.href = `mailto:${email}`; emailText.textContent = email; }
  if (phoneText) { phoneText.href = `tel:${phone.replace(/\s+/g, '')}`; phoneText.textContent = phone; }
  if (instaLink) { instaLink.href = instagram; instaLink.textContent = `@${(instagram.match(/instagram\.com\/([^/?]+)/i) || [,'visualssatyam'])[1]} ↗`; }
  if (waButton) waButton.href = `https://wa.me/${whatsapp}`;

  // Counters.
  const statsGrid = $('#statsGrid');
  (data.stats || []).forEach((stat, index) => {
    const node = document.createElement('div');
    node.className = 'stat reveal';
    node.style.transitionDelay = `${index * 100}ms`;
    node.innerHTML = `<strong>${safe(stat.value)}</strong><span>${safe(stat.label)}</span>`;
    statsGrid?.appendChild(node);
  });

  // Editing tools.
  const toolsList = $('#toolsList');
  (data.tools || []).forEach(tool => {
    const chip = document.createElement('span');
    chip.className = 'tool-chip'; chip.textContent = tool;
    toolsList?.appendChild(chip);
  });

  // Services.
  const serviceList = $('#serviceList');
  (data.services || []).forEach((service, index) => {
    const row = document.createElement('article');
    row.className = 'service-row reveal';
    row.innerHTML = `<span class="service-number">${safe(service.number || String(index + 1).padStart(2,'0'))}</span><h3>${safe(service.title)}</h3><p>${safe(service.description)}</p><span class="service-tag">${safe(service.tag || 'CREATIVE EDITING')}</span><span class="service-arrow">↗</span>`;
    serviceList?.appendChild(row);
  });

  // Portfolio filtering and cards.
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const filters = ['All', ...new Set(projects.map(project => project.category).filter(Boolean))];
  const filterRow = $('#filterRow');
  const projectGrid = $('#projectGrid');
  const workCount = $('#workCount');
  let activeFilter = 'All';
  function renderFilters() {
    if (!filterRow) return;
    filterRow.innerHTML = '';
    filters.forEach(filter => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = `filter-btn${filter === activeFilter ? ' active' : ''}`;
      button.textContent = filter === 'All' ? 'All work' : filter;
      button.addEventListener('click', () => { activeFilter = filter; renderFilters(); renderProjects(); });
      filterRow.appendChild(button);
    });
  }
  function projectVisual(project, index) {
    const bg = project.poster ? `style="background-image:linear-gradient(0deg,rgba(9,18,14,.48),transparent 70%),url('${safe(project.poster)}');background-size:cover;background-position:center"` : '';
    const fallbackText = project.placeholder || !project.poster ? `<span class="visual-shape one"></span><span class="visual-shape two"></span><span class="visual-shape three"></span>` : '';
    const title = project.placeholder ? 'YOUR NEXT<br /><em>GREAT EDIT.</em>' : safe(project.title).replace(/\s\+\s/g, ' + ');
    return `<div class="project-visual" ${bg}>
      ${fallbackText}<div class="visual-vignette"></div>
      <span class="visual-index">CUT / ${String(index + 1).padStart(2,'0')}</span>
      <span class="visual-format">${safe(project.format || 'VIDEO')}</span>
      <div class="visual-title">${title}</div>
    </div>`;
  }
  function renderProjects() {
    if (!projectGrid) return;
    projectGrid.innerHTML = '';
    const visible = projects.filter(project => activeFilter === 'All' || project.category === activeFilter);
    if (workCount) workCount.textContent = `${String(visible.length).padStart(2,'0')} ${visible.length === 1 ? 'PROJECT' : 'PROJECTS'}`;
    visible.forEach((project, index) => {
      const card = document.createElement('article');
      card.className = 'project-card reveal';
      card.dataset.accent = project.accent || 'lime';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open ${project.title}`);
      card.innerHTML = `${projectVisual(project, index)}
        <div class="project-topline"><span>${safe(project.category || 'CREATIVE EDIT')}</span><span>${safe(project.year || '—')} / ${safe(project.format || 'VIDEO')}</span></div>
        <div class="project-info"><div><h3>${safe(project.title)}</h3><p>${safe(project.description || '')}</p></div><span class="project-play"><span>↗</span></span></div>`;
      card.addEventListener('click', () => openProject(project));
      card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(project); } });
      projectGrid.appendChild(card);
    });
    observeReveals();
  }
  renderFilters(); renderProjects();

  // In-page video player. MP4 is the most reliable format; YouTube and Vimeo embeds are also supported.
  const modal = $('#videoModal');
  const modalPlayer = $('#modalPlayer');
  const modalTitle = $('#modalTitle');
  const modalCategory = $('#modalCategory');
  function youtubeId(url) {
    try { const parsed = new URL(url); if (parsed.hostname.includes('youtu.be')) return parsed.pathname.slice(1); return parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop(); }
    catch { return url; }
  }
  function vimeoId(url) { const match = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/); return match ? match[1] : url; }
  function openProject(project) {
    if (!modal || !modalPlayer) return;
    modalTitle.textContent = project.title;
    modalCategory.textContent = `${project.category || 'PROJECT'} / ${project.format || 'VIDEO'}`;
    modalPlayer.innerHTML = '';
    const url = (project.videoUrl || '').trim();
    if (!url) {
      modalPlayer.innerHTML = `<div class="modal-empty"><b>This edit slot is ready for your video.</b><p>Add an MP4 file path or direct video URL in <strong>data/portfolio.js</strong>.<br />Example: assets/reels/my-edit.mp4</p></div>`;
    } else if ((project.videoType || 'mp4').toLowerCase() === 'youtube') {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId(url))}?autoplay=1&rel=0`;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true; frame.title = project.title; modalPlayer.appendChild(frame);
    } else if ((project.videoType || '').toLowerCase() === 'vimeo') {
      const frame = document.createElement('iframe'); frame.src = `https://player.vimeo.com/video/${encodeURIComponent(vimeoId(url))}?autoplay=1`;
      frame.allow = 'autoplay; fullscreen; picture-in-picture'; frame.allowFullscreen = true; frame.title = project.title; modalPlayer.appendChild(frame);
    } else {
      const video = document.createElement('video'); video.src = url; video.controls = true; video.autoplay = true; video.playsInline = true; video.preload = 'metadata';
      if (project.poster) video.poster = project.poster;
      modalPlayer.appendChild(video);
      video.play().catch(() => {});
    }
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open');
    $('#modalClose')?.focus();
  }
  function closeModal() {
    if (!modal || !modalPlayer) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open');
    modalPlayer.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); });
    modalPlayer.innerHTML = '';
  }
  $('#modalClose')?.addEventListener('click', closeModal);
  $$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  // Responsive navigation.
  const menuToggle = $('#menuToggle'); const navLinks = $('#navLinks');
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded)); navLinks?.classList.toggle('open', !expanded);
  });
  $$('#navLinks a').forEach(link => link.addEventListener('click', () => { menuToggle?.setAttribute('aria-expanded','false'); navLinks?.classList.remove('open'); }));

  // Scroll interactions: reveal, sticky header and reading progress.
  const header = $('.site-header'); const progress = $('#pageProgress');
  function updateScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    header?.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateScroll, { passive: true }); updateScroll();
  let revealObserver;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(el => el.classList.add('is-visible')); return; }
    if (!revealObserver) revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: .12 });
    $$('.reveal:not(.is-visible)').forEach(el => revealObserver.observe(el));
  }
  observeReveals();
})();
