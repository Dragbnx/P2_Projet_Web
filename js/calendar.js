// Initialiser la date actuelle
let currentDate = new Date();

// Stockage des événements (clé: YYYY-MM-DD, valeur: tableau d'événements)
let events = JSON.parse(localStorage.getItem('calendarEvents')) ||  {};

// Modèle d'événements académiques (récurrents chaque année)
const schoolEventsTemplate = [
    { month: 0, day: 18, type: 'JPO', name: 'Journée portes ouvertes - Campus EFREI' },
    { month: 1, day: 7, type: 'Conférence', name: 'Conférence cybersécurité et SOC' },
    { month: 2, day: 14, type: 'Atelier', name: 'Atelier CV et portfolio développeur' },
    { month: 2, day: 29, type: 'Hackathon', name: 'Hackathon IA & data 24h' },
    { month: 3, day: 11, type: 'Meetup', name: 'Meetup cloud et DevOps' },
    { month: 4, day: 8, type: 'Conférence', name: 'Conférence architecture logicielle et microservices' },
    { month: 4, day: 15, type: 'JPO', name: 'JPO Bachelor Informatique et projets étudiants' },
    { month: 4, day: 22, type: 'Forum', name: 'Forum entreprises tech et alternance' },
    { month: 4, day: 27, type: 'Hackathon', name: 'Hackathon cybersécurité Blue Team vs Red Team' },
    { month: 5, day: 6, type: 'Workshop', name: 'Workshop React et architecture frontend' },
    { month: 5, day: 12, type: 'Meetup', name: 'Meetup alumni data & IA appliquée' },
    { month: 5, day: 18, type: 'Atelier', name: 'Atelier préparation entretiens techniques' },
    { month: 5, day: 20, type: 'Conférence', name: 'Conférence innovation IA générative' },
    { month: 8, day: 12, type: 'Rentrée', name: 'Semaine d\'intégration pôle informatique' },
    { month: 9, day: 3, type: 'JPO', name: 'JPO spécial parcours informatique' },
    { month: 10, day: 15, type: 'Compétition', name: 'Capture The Flag inter-écoles' },
    { month: 11, day: 5, type: 'Salon', name: 'Salon projets étudiants et démonstrations' }
];

/**
 * Retourne un ID stable pour les événements générés par le système
 */
function buildSeedEventId(year, month, day, index) {
    return `seed-${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}-${index}`;
}

/**
 * Injecte les événements académiques pour une année si absents
 */
function seedSchoolEventsForYear(year) {
    schoolEventsTemplate.forEach((template, index) => {
        const dateKey = formatDateKey(template.day, template.month, year);

        if (!events[dateKey]) {
            events[dateKey] = [];
        }

        const alreadyExists = events[dateKey].some((event) => event.name === template.name);
        if (!alreadyExists) {
            events[dateKey].push({
                id: buildSeedEventId(year, template.month, template.day, index),
                name: template.name,
                type: template.type,
                source: 'school'
            });
        }
    });
}

/**
 * Initialise les événements école de l'année courante et suivante
 */
function initializeSchoolEvents() {
    const currentYear = new Date().getFullYear();
    seedSchoolEventsForYear(currentYear);
    seedSchoolEventsForYear(currentYear + 1);
    saveEvents();
}

/**
 * Formate une clé de date (YYYY-MM-DD)
 */
function formatDateKey(day, month, year) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
}

/**
 * Récupère l'index du mois à partir de son nom
 */
function getMonthIndex(monthName) {
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return monthNames.indexOf(monthName);
}

/**
 * Ajoute un événement à une date
 */
function addEvent(dateKey, eventName) {
    if (!events[dateKey]) {
        events[dateKey] = [];
    }
    
    if (eventName.trim() !== '') {
        events[dateKey].push({
            id: Date.now(),
            name: eventName.trim(),
            type: 'Perso',
            time: new Date().toLocaleTimeString(),
            source: 'user'
        });
        saveEvents();
        renderCalendar();
    }
}

/**
 * Supprime un événement
 */
function deleteEvent(dateKey, eventId) {
    if (events[dateKey]) {
        events[dateKey] = events[dateKey].filter(event => event.id !== eventId);
        if (events[dateKey].length === 0) {
            delete events[dateKey];
        }
        saveEvents();
        renderCalendar();
    }
}

/**
 * Sauvegarde les événements dans localStorage
 */
function saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

/**
 * Affiche un modal pour gérer les événements d'un jour
 */
function showEventModal(day, month, year, dateKey, dayEvents) {
    // Créer ou récupérer le modal
    let modal = document.getElementById('eventModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'eventModal';
        modal.className = 'event-modal';
        document.body.appendChild(modal);
    }
    
    // Générer le contenu du modal
    let eventsList = dayEvents.map(event => `
        <div class="event-item">
            <span class="event-name">${event.type ? `[${event.type}] ` : ''}${event.name}</span>
            <button class="delete-event-btn" onclick='deleteEvent("${dateKey}", ${JSON.stringify(event.id)})'>✕</button>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="event-modal-content">
            <div class="event-modal-header">
                <h3>${day} ${month} ${year}</h3>
                <button class="close-modal" onclick="closeEventModal()">✕</button>
            </div>
            
            <div class="event-modal-body">
                <h4>Événements du jour</h4>
                <div class="events-list">
                    ${eventsList || '<p class="no-events">Aucun événement</p>'}
                </div>
                
                <div class="add-event-form">
                    <h4>Ajouter un événement</h4>
                    <input 
                        type="text" 
                        id="eventInput" 
                        data-date-key="${dateKey}"
                        placeholder="Nom de l'événement..."
                        maxlength="50"
                    />
                    <button onclick="addEventFromModal('${dateKey}')">Ajouter</button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Focus sur l'input
    setTimeout(() => {
        const input = document.getElementById('eventInput');
        if (input) input.focus();
    }, 100);
}

/**
 * Ferme le modal d'événements
 */
function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Ajoute un événement depuis le modal
 */
function addEventFromModal(dateKey) {
    const input = document.getElementById('eventInput');
    if (input) {
        const resolvedDateKey = dateKey || input.dataset.dateKey;
        if (resolvedDateKey) {
            addEvent(resolvedDateKey, input.value);
        }
        closeEventModal();
    }
}

/**
 * Gère la touche Entrée dans le formulaire d'événement
 */
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('eventInput') === document.activeElement) {
        addEventFromModal();
    }
});

/**
 * Génère et affiche le calendrier pour le mois actuel
 */
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Noms des mois en français
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    // Afficher le mois et l'année dans le header
    const monthYearElement = document.getElementById('monthYear');
    if (monthYearElement) {
        monthYearElement.textContent = `${monthNames[month]} ${year}`;
    }
    
    // Obtenir le premier jour du mois (0 = dimanche)
    const firstDay = new Date(year, month, 1).getDay();
    
    // Obtenir le nombre de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Ajuster pour que la semaine commence par lundi
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    // Récupérer l'élément contenant les jours
    const calendarDays = document.getElementById('calendarDays');
    
    if (!calendarDays) {
        console.error('Élément calendarDays non trouvé');
        return;
    }
    
    // Effacer les jours précédents
    calendarDays.innerHTML = '';
    
    // Ajouter les cases vides avant le premier jour du mois
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('empty-day');
        calendarDays.appendChild(emptyDay);
    }
    
    // Obtenir la date d'aujourd'hui
    const today = new Date();
    
    // Ajouter tous les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        
        // Créer le container pour le jour et les événements
        const dayContent = document.createElement('div');
        dayContent.className = 'day-content';
        
        // Ajouter le numéro du jour
        const dayNumber = document.createElement('span');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayContent.appendChild(dayNumber);
        
        // Vérifier s'il y a des événements pour ce jour
        const dateKey = formatDateKey(day, month, year);
        const dayEvents = events[dateKey] || [];
        
        // Ajouter les indicateurs d'événements
        if (dayEvents.length > 0) {
            const eventIndicators = document.createElement('div');
            eventIndicators.className = 'event-indicators';
            
            for (let i = 0; i < Math.min(dayEvents.length, 3); i++) {
                const indicator = document.createElement('span');
                indicator.className = 'event-dot';
                indicator.title = dayEvents[i].name;
                eventIndicators.appendChild(indicator);
            }
            
            if (dayEvents.length > 3) {
                const moreIndicator = document.createElement('span');
                moreIndicator.className = 'event-dot more';
                moreIndicator.textContent = '+' + (dayEvents.length - 3);
                moreIndicator.title = `${dayEvents.length - 3} événement(s) de plus`;
                eventIndicators.appendChild(moreIndicator);
            }
            
            dayContent.appendChild(eventIndicators);
        }
        
        dayElement.appendChild(dayContent);
        
        // Mettre en évidence le jour actuel
        if (day === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Ajouter un événement de clic pour afficher la date sélectionnée
        dayElement.addEventListener('click', function() {
            handleDayClick(day, monthNames[month], year);
        });
        
        // Ajouter un événement de survol pour améliorer l'UX
        dayElement.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        calendarDays.appendChild(dayElement);
    }
}

/**
 * Gère le clic sur un jour du calendrier
 * @param {number} day - Le jour du mois
 * @param {string} month - Le nom du mois
 * @param {number} year - L'année
 */
function handleDayClick(day, month, year) {
    const selectedDate = `${day} ${month} ${year}`;
    const dateKey = formatDateKey(day, getMonthIndex(month), year);
    
    // Obtenir les événements du jour
    const dayEvents = events[dateKey] || [];
    
    // Afficher un modal pour gérer les événements
    showEventModal(day, month, year, dateKey, dayEvents);
}

/**
 * Navigation au mois précédent
 */
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

/**
 * Navigation au mois suivant
 */
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

/**
 * Aller au mois actuel
 */
function goToToday() {
    currentDate = new Date();
    renderCalendar();
}

/**
 * Initialiser le calendrier au chargement de la page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les événements académiques prédéfinis
    initializeSchoolEvents();

    // Afficher le calendrier
    renderCalendar();
    
    // Attacher les événements aux boutons de navigation
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousMonth);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextMonth);
    }
    
    // Fermer le modal en cliquant en dehors
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('eventModal');
        if (modal && event.target === modal) {
            closeEventModal();
        }
    });
});
