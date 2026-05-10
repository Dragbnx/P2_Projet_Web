var grid        = document.getElementById('teachersGrid');
var noResults   = document.getElementById('noResults');
var searchInput = document.getElementById('searchInput');
var filterGroup = document.querySelector('.filter-group');
var activeFilter = 'tous';

var specialites = ['tous'];
enseignants.forEach(function(e) {
  if (specialites.indexOf(e.specialite) === -1) {
    specialites.push(e.specialite);
  }
});

specialites.forEach(function(s) {
  if (s === 'tous') return;
  var btn = document.createElement('button');
  btn.className = 'filter-btn';
  btn.setAttribute('data-filter', s);
  btn.textContent = s;
  btn.addEventListener('click', function() { setFilter(s); });
  filterGroup.appendChild(btn);
});

var tousBtn = filterGroup.querySelector('[data-filter="tous"]');
if (tousBtn) tousBtn.addEventListener('click', function() { setFilter('tous'); });

function setFilter(val) {
  activeFilter = val;
  document.querySelectorAll('.filter-btn').forEach(function(b) {
    b.classList.toggle('filter-active', b.getAttribute('data-filter') === val);
  });
  renderCards();
}

if (searchInput) {
  searchInput.addEventListener('input', renderCards);
}

function getInitials(prenom, nom) {
  return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
}

function renderCards() {
  var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  grid.innerHTML = '';
  var count = 0;

  enseignants.forEach(function(e, index) {
    if (activeFilter !== 'tous' && e.specialite !== activeFilter) return;
    var fullName = (e.prenom + ' ' + e.nom).toLowerCase();
    if (query && fullName.indexOf(query) === -1 && e.specialite.toLowerCase().indexOf(query) === -1) return;

    count++;
    var card = document.createElement('article');
    card.className = 'teacher-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Voir le profil de ' + e.prenom + ' ' + e.nom);

    var avatarHTML;
    if (e.photo) {
      avatarHTML = '<div class="teacher-avatar"><img src="' + e.photo + '" alt="Photo de ' + e.prenom + ' ' + e.nom + '" /></div>';
    } else {
      avatarHTML = '<div class="teacher-avatar">' + getInitials(e.prenom, e.nom) + '</div>';
    }

    var statutClass = e.statut === 'Vacataire' ? 'vacataire' : '';
    card.innerHTML =
      avatarHTML +
      '<p class="teacher-name">' + e.prenom + ' ' + e.nom + '</p>' +
      '<p class="teacher-specialite">' + e.specialite + '</p>' +
      '<span class="teacher-statut ' + statutClass + '">' + e.statut + '</span>';

    card.addEventListener('click', function() { openModal(index); });
    card.addEventListener('keydown', function(ev) {
      if (ev.key === 'Enter' || ev.key === ' ') openModal(index);
    });

    grid.appendChild(card);
  });

  noResults.classList.toggle('hidden', count > 0);
}

renderCards();

var modalOverlay    = document.getElementById('modalOverlay');
var modalClose      = document.getElementById('modalClose');
var modalAvatar     = document.getElementById('modalAvatar');
var modalName       = document.getElementById('modalName');
var modalSpecialite = document.getElementById('modalSpecialite');
var modalStatut     = document.getElementById('modalStatut');
var modalEmail      = document.getElementById('modalEmail');

function openModal(index) {
  var e = enseignants[index];
  if (e.photo) {
    modalAvatar.innerHTML = '<img src="' + e.photo + '" alt="Photo de ' + e.prenom + ' ' + e.nom + '" style="width:90px;height:90px;border-radius:50%;object-fit:cover;" />';
  } else {
    modalAvatar.textContent = getInitials(e.prenom, e.nom);
  }
  modalName.textContent       = e.prenom + ' ' + e.nom;
  modalSpecialite.textContent = e.specialite;
  modalStatut.textContent     = e.statut;
  modalEmail.textContent      = e.email;
  modalEmail.href             = 'mailto:' + e.email;

  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', function(ev) {
    if (ev.target === modalOverlay) closeModal();
  });
}
document.addEventListener('keydown', function(ev) {
  if (ev.key === 'Escape') closeModal();
});
