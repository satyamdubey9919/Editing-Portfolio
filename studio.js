(() => {
  const KEY = 'sd-portfolio-data-v1';
  const clone = value => JSON.parse(JSON.stringify(value));
  let data = clone(window.PORTFOLIO_DATA || {});
  try { const saved = localStorage.getItem(KEY); if (saved) data = JSON.parse(saved); } catch (error) { console.warn(error); }
  const $ = id => document.getElementById(id);
  const status = message => { $('studioStatus').textContent = message; };
  const persist = message => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); $('rawData').value = JSON.stringify(data, null, 2); renderProjects(); status(message || 'Saved in this browser. Export portfolio.js and deploy it to update the public site.'); }
    catch (error) { status(`Could not save: ${error.message}`); }
  };
  const get = id => $(id).value.trim();
  function fillProfile() {
    const p = data.profile || {};
    const map = {pName:'name',pBrand:'brand',pRole:'role',pLocation:'location',pAvailability:'availability',pEmail:'email',pInstagram:'instagram',pPhone:'phone',pWhatsapp:'whatsapp',pAgency:'agency',pAgencyLocation:'agencyLocation',pIntro:'intro',pAbout:'about',pApproach:'approach'};
    Object.entries(map).forEach(([id,key]) => { $(id).value = p[key] || ''; });
    $('pTools').value = (data.tools || []).join(', ');
  }
  fillProfile(); $('rawData').value = JSON.stringify(data, null, 2);
  $('saveProfile').addEventListener('click', () => {
    data.profile = data.profile || {};
    const map = {pName:'name',pBrand:'brand',pRole:'role',pLocation:'location',pAvailability:'availability',pEmail:'email',pInstagram:'instagram',pPhone:'phone',pWhatsapp:'whatsapp',pAgency:'agency',pAgencyLocation:'agencyLocation',pIntro:'intro',pAbout:'about',pApproach:'approach'};
    Object.entries(map).forEach(([id,key]) => data.profile[key] = get(id));
    data.tools = get('pTools').split(',').map(v => v.trim()).filter(Boolean);
    persist('Profile updated in this browser. Export portfolio.js to publish the changes.');
  });
  function clearProjectForm() {
    $('projectForm').reset(); $('projectId').value = ''; $('projectYear').value = String(new Date().getFullYear());
    $('projectFormat').value = 'VERTICAL / 9:16'; $('saveProject').textContent = 'ADD PROJECT'; $('cancelEdit').hidden = true;
  }
  function renderProjects() {
    const list = $('projectList'); list.innerHTML = '';
    const items = data.projects || [];
    $('projectTotal').textContent = `(${items.length})`;
    if (!items.length) { list.innerHTML = '<p class="studio-help">No projects yet. Add your first edit using the form above.</p>'; return; }
    items.forEach(project => {
      const row = document.createElement('div'); row.className = 'studio-item';
      const info = document.createElement('div');
      const title = document.createElement('strong'); title.textContent = project.title;
      const meta = document.createElement('small'); meta.textContent = `${project.category || 'Project'} · ${project.videoUrl ? 'Video linked' : 'No video linked'} · ${project.year || 'No year'}`;
      info.append(title, meta);
      const edit = document.createElement('button'); edit.textContent = 'EDIT'; edit.addEventListener('click', () => editProject(project.id));
      const del = document.createElement('button'); del.className = 'delete'; del.textContent = 'DELETE'; del.addEventListener('click', () => deleteProject(project.id));
      row.append(info, edit, del); list.appendChild(row);
    });
  }
  function editProject(id) {
    const p = (data.projects || []).find(item => item.id === id); if (!p) return;
    $('projectId').value = p.id; $('projectTitle').value = p.title || ''; $('projectCategory').value = p.category || 'Short-form';
    $('projectFormat').value = p.format || ''; $('projectYear').value = p.year || ''; $('projectType').value = p.videoType || 'mp4';
    $('projectAccent').value = p.accent || 'lime'; $('projectVideo').value = p.videoUrl || ''; $('projectPoster').value = p.poster || '';
    $('projectDescription').value = p.description || ''; $('saveProject').textContent = 'UPDATE PROJECT'; $('cancelEdit').hidden = false;
    $('projectForm').scrollIntoView({behavior:'smooth',block:'center'});
  }
  function deleteProject(id) {
    const p = (data.projects || []).find(item => item.id === id); if (!p) return;
    if (!window.confirm(`Delete “${p.title}” from this draft?`)) return;
    data.projects = data.projects.filter(item => item.id !== id); persist('Project deleted from this browser draft. Export portfolio.js to publish.');
  }
  $('projectForm').addEventListener('submit', event => {
    event.preventDefault();
    const title = get('projectTitle'); if (!title) return;
    data.projects = data.projects || [];
    const existingId = get('projectId');
    const project = {
      id: existingId || `project-${Date.now()}`,
      title,
      category: get('projectCategory'),
      format: get('projectFormat') || 'VIDEO',
      year: get('projectYear') || String(new Date().getFullYear()),
      description: get('projectDescription'),
      videoType: get('projectType'),
      videoUrl: get('projectVideo'),
      poster: get('projectPoster'),
      featured: false,
      accent: get('projectAccent'),
      placeholder: false
    };
    const index = data.projects.findIndex(item => item.id === existingId);
    if (index >= 0) data.projects[index] = project; else data.projects.push(project);
    persist(index >= 0 ? 'Project updated. Export portfolio.js to publish.' : 'New project added. Export portfolio.js to publish.');
    clearProjectForm();
  });
  $('cancelEdit').addEventListener('click', clearProjectForm);

  function download(filename, content, type='text/javascript') {
    const blob = new Blob([content], {type:`${type};charset=utf-8`}); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  $('exportJs').addEventListener('click', () => {
    const js = `/* Exported from Satyanand Dubey Content Studio. */\nwindow.PORTFOLIO_DATA = ${JSON.stringify(data, null, 2)};\n`;
    download('portfolio.js', js); status('portfolio.js downloaded. Replace your project’s data/portfolio.js with this file, then redeploy.');
  });
  $('exportJson').addEventListener('click', () => { download('portfolio-data.json', JSON.stringify(data,null,2), 'application/json'); status('JSON backup downloaded.'); });
  $('importJson').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return;
    try { const parsed = JSON.parse(await file.text()); if (!parsed.profile || !Array.isArray(parsed.projects)) throw new Error('Expected profile and projects fields.'); data = parsed; fillProfile(); persist('JSON imported and saved in this browser.'); }
    catch (error) { status(`Import failed: ${error.message}`); }
    event.target.value = '';
  });
  $('applyJson').addEventListener('click', () => {
    try {
      const parsed = JSON.parse($('rawData').value);
      if (!parsed.profile || !Array.isArray(parsed.projects)) throw new Error('Data must include a profile object and a projects array.');
      data = parsed; fillProfile(); persist('Valid JSON applied and saved in this browser.');
    } catch (error) { status(`JSON error: ${error.message}`); }
  });
  $('resetLocal').addEventListener('click', () => {
    if (!window.confirm('Discard this browser’s saved draft and reload the original data/portfolio.js file?')) return;
    try { localStorage.removeItem(KEY); } catch {}
    data = clone(window.PORTFOLIO_DATA || {}); fillProfile(); $('rawData').value = JSON.stringify(data,null,2); clearProjectForm(); renderProjects(); status('Browser draft cleared. Reload the public portfolio page to view the original data file.');
  });
  $('projectYear').value = String(new Date().getFullYear()); renderProjects();
})();
