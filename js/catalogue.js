document.addEventListener('DOMContentLoaded', () => {
  const projects = [
    {
      id: 1,
      title: 'GTA VI — Portage étudiant',
      author: 'Équipe Mirage',
      year: 2026,
      tags: ['jeu', 'AAA'],
      desc: "Participation à GTA VI en tant que developpeurs actif du projet, en étroite collaboration avec Rockstar Games.",
    },
    {
      id: 2,
      title: 'Smart Garden',
      author: 'Team GreenTech',
      year: 2024,
      tags: ['IoT', 'hardware'],
      desc: 'Système de surveillance de plantes avec alertes et irrigation automatique.',
    },
    {
      id: 3,
      title: 'VisioClass',
      author: 'EduSoft',
      year: 2025,
      tags: ['web', 'education'],
      desc: 'Plateforme de classes virtuelles optimisée pour l’enseignement supérieur.',
    },
    {
      id: 4,
      title: 'DataViz Interactive',
      author: 'VizLab',
      year: 2023,
      tags: ['data', 'visualisation'],
      desc: 'Outils interactifs pour explorer des jeux de données volumineux.',
    },
    {
      id: 5,
      title: 'RoboArm',
      author: 'Makers',
      year: 2022,
      tags: ['robotique', 'hardware'],
      desc: 'Bras robotique open-source pour prototypage rapide.',
    },
    {
      id: 6,
      title: 'SecureChat',
      author: 'CryptoClub',
      year: 2025,
      tags: ['sécurité', 'réseau'],
      desc: "Application de messagerie chiffrée avec audits de sécurité intégrés.",
    }
  ];

  const el = {
    container: document.getElementById('projects'),
    search: document.getElementById('search'),
    sort: document.getElementById('sort'),
    reset: document.getElementById('reset'),
  };

  function render(list) {
    if (!el.container) return;
    el.container.innerHTML = '';
    if (list.length === 0) {
      el.container.innerHTML = '<p class="no-results">Aucun projet trouvé.</p>';
      return;
    }

    const frag = document.createDocumentFragment();
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'project-card' + (p.tags && p.tags.includes('troll') ? ' troll' : '');

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = p.title;

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${p.author} • ${p.year}`;

      const tags = document.createElement('div');
      tags.className = 'tags';
      (p.tags || []).forEach(t => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        tags.appendChild(span);
      });

      const desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = p.desc;

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(tags);
      card.appendChild(desc);

      frag.appendChild(card);
    });

    el.container.appendChild(frag);
  }

  function filterAndSort() {
    const q = el.search.value.trim().toLowerCase();
    let results = projects.filter(p => {
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        (p.desc && p.desc.toLowerCase().includes(q)) ||
        (p.tags && p.tags.join(' ').toLowerCase().includes(q))
      );
    });

    const mode = el.sort.value;
    if (mode === 'newest') results.sort((a,b)=> b.year - a.year);
    else if (mode === 'oldest') results.sort((a,b)=> a.year - b.year);
    else if (mode === 'title-asc') results.sort((a,b)=> a.title.localeCompare(b.title));
    else if (mode === 'title-desc') results.sort((a,b)=> b.title.localeCompare(a.title));

    render(results);
  }

  if (el.search) el.search.addEventListener('input', filterAndSort);
  if (el.sort) el.sort.addEventListener('change', filterAndSort);
  if (el.reset) el.reset.addEventListener('click', () => {
    el.search.value = '';
    el.sort.value = 'newest';
    filterAndSort();
  });

  // initial render
  el.sort.value = 'newest';
  filterAndSort();
});
