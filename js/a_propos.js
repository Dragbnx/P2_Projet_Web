

var etudiants = {
    pablo: {
        photo:     "../img/pablo.png",
        nom:       "Pablo BIRAN",
        role:      "Développeur Web",
        citation:  "A vaincre sans péril, on triomphe sans sourcil.",
        pages:     ["Accueil", "Équipe enseignante", "Nous rejoindre", "À propos"]
    },
    paul: {
        photo:     "../img/paul.png",
        nom:       "Paul CARAMANIAN",
        role:      "Développeur Web",
        citation:  "Lé z'orks perdent jamais. Si k'on gagne, on gagne, si k'on meurt, on meurt alors ça kompte pas. Si k'on s'en va pour pas mourir, ça kompte pas non plus, pask'on revient après pour s'battre encore!",
        pages:     ["Cours & Formations", "Projets étudiants", "À propos"]
    }
};

var cards = document.querySelectorAll('.student-card');
cards.forEach(function(card) {
    card.addEventListener('click', function() {
        openModal(card.getAttribute('data-student'));
    });
    card.addEventListener('keydown', function(ev) {
        if (ev.key === 'Enter' || ev.key === ' ') openModal(card.getAttribute('data-student'));
    });
});

var modal      = document.getElementById('studentModal');
var modalClose = document.getElementById('modalClose');
var modalAvatar = document.getElementById('modalAvatar');
var modalName  = document.getElementById('modalName');
var modalRole  = document.getElementById('modalRole');
var modalQuote = document.getElementById('modalQuote');
var modalPages = document.getElementById('modalPages');

function openModal(key) {
    var e = etudiants[key];
    if (!e) return;

    modalAvatar.innerHTML = '<img src="' + e.photo + '" alt="Photo de ' + e.nom + '" style="width:100px;height:100px;border-radius:50%;object-fit:cover;" />';
    modalName.textContent   = e.nom;
    modalRole.textContent   = e.role;
    modalQuote.textContent  = '\u00ab\u00a0' + e.citation + '\u00a0\u00bb';

    modalPages.innerHTML = '';
    e.pages.forEach(function(p) {
        var li = document.createElement('li');
        li.textContent = p;
        modalPages.appendChild(li);
    });

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
    modal.addEventListener('click', function(ev) {
        if (ev.target === modal) closeModal();
    });
}
document.addEventListener('keydown', function(ev) {
    if (ev.key === 'Escape') closeModal();
});
