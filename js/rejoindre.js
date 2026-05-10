

var jobsGrid = document.getElementById('jobsGrid');
var posteSelect = document.getElementById('poste');

if (jobsGrid && posteSelect) {
  postes.forEach(function(p) {
    
    var card = document.createElement('article');
    card.className = 'job-card';
    var badgeClass = p.ouvert ? 'ouvert' : 'ferme';
    var badgeLabel = p.ouvert ? 'Ouvert' : 'Fermé';
    card.innerHTML =
      '<div class="job-header">' +
        '<h3 class="job-title">' + p.titre + '</h3>' +
        '<span class="job-badge ' + badgeClass + '">' + badgeLabel + '</span>' +
      '</div>' +
      '<p class="job-type">' + p.type + '</p>' +
      '<p class="job-desc">' + p.description + '</p>';
    jobsGrid.appendChild(card);

    
    if (p.ouvert) {
      var option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.titre;
      posteSelect.appendChild(option);
    }
  });
}

var form        = document.getElementById('candidatureForm');
var formSuccess = document.getElementById('formSuccess');

function showError(fieldId, message) {
  var field = document.getElementById(fieldId);
  var errEl = document.getElementById('err-' + fieldId);
  if (field)  field.classList.add('invalid');
  if (errEl) errEl.textContent = message;
}
function clearError(fieldId) {
  var field = document.getElementById(fieldId);
  var errEl = document.getElementById('err-' + fieldId);
  if (field)  field.classList.remove('invalid');
  if (errEl) errEl.textContent = '';
}

function validateForm() {
  var valid = true;

  
  clearError('prenom');
  var prenom = document.getElementById('prenom').value.trim();
  if (!prenom) { showError('prenom', 'Le prénom est requis.'); valid = false; }

  
  clearError('nom');
  var nom = document.getElementById('nom').value.trim();
  if (!nom) { showError('nom', 'Le nom est requis.'); valid = false; }

  
  clearError('email');
  var email = document.getElementById('email').value.trim();
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) { showError('email', 'L\'adresse e-mail est requise.'); valid = false; }
  else if (!emailRegex.test(email)) { showError('email', 'L\'adresse e-mail n\'est pas valide.'); valid = false; }

  
  clearError('poste');
  var poste = document.getElementById('poste').value;
  if (!poste) { showError('poste', 'Veuillez choisir un poste.'); valid = false; }

  
  clearError('motivation');
  var motivation = document.getElementById('motivation').value.trim();
  if (!motivation) { showError('motivation', 'La lettre de motivation est requise.'); valid = false; }
  else if (motivation.length < 50) { showError('motivation', 'La lettre doit contenir au moins 50 caractères.'); valid = false; }

  
  clearError('cv');
  var cvInput = document.getElementById('cv');
  if (!cvInput.files || cvInput.files.length === 0) {
    showError('cv', 'Veuillez joindre votre CV (PDF).'); valid = false;
  } else {
    var file = cvInput.files[0];
    if (file.type !== 'application/pdf') {
      showError('cv', 'Le fichier doit être au format PDF.'); valid = false;
    } else if (file.size > 5 * 1024 * 1024) {
      showError('cv', 'Le fichier ne doit pas dépasser 5 Mo.'); valid = false;
    }
  }

  return valid;
}

if (form) {
  form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    if (validateForm()) {
      
      
      form.reset();
      formSuccess.classList.remove('hidden');
      form.querySelector('.form-submit').disabled = true;
    }
  });
}
