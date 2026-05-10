
let currentDate = new Date();

let events = JSON.parse(localStorage.getItem('calendarEvents')) ||  {};

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

function buildSeedEventId(year, month, day, index) {
    return `seed-${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}-${index}`;
}

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

function initializeSchoolEvents() {
    const currentYear = new Date().getFullYear();
    seedSchoolEventsForYear(currentYear);
    seedSchoolEventsForYear(currentYear + 1);
    saveEvents();
}

function formatDateKey(day, month, year) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
}

function getMonthIndex(monthName) {
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return monthNames.indexOf(monthName);
}

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

function saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

function showEventModal(day, month, year, dateKey, dayEvents) {
    
    let modal = document.getElementById('eventModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'eventModal';
        modal.className = 'event-modal';
        document.body.appendChild(modal);
    }
    
    
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
    
    
    setTimeout(() => {
        const input = document.getElementById('eventInput');
        if (input) input.focus();
    }, 100);
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

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

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('eventInput') === document.activeElement) {
        addEventFromModal();
    }
});

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    
    const monthYearElement = document.getElementById('monthYear');
    if (monthYearElement) {
        monthYearElement.textContent = `${monthNames[month]} ${year}`;
    }
    
    
    const firstDay = new Date(year, month, 1).getDay();
    
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    
    const calendarDays = document.getElementById('calendarDays');
    
    if (!calendarDays) {
        console.error('Élément calendarDays non trouvé');
        return;
    }
    
    
    calendarDays.innerHTML = '';
    
    
    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('empty-day');
        calendarDays.appendChild(emptyDay);
    }
    
    
    const today = new Date();
    
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        
        
        const dayContent = document.createElement('div');
        dayContent.className = 'day-content';
        
        
        const dayNumber = document.createElement('span');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayContent.appendChild(dayNumber);
        
        
        const dateKey = formatDateKey(day, month, year);
        const dayEvents = events[dateKey] || [];
        
        
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
        
        
        if (day === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        
        dayElement.addEventListener('click', function() {
            handleDayClick(day, monthNames[month], year);
        });
        
        
        dayElement.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        calendarDays.appendChild(dayElement);
    }
}

function handleDayClick(day, month, year) {
    const selectedDate = `${day} ${month} ${year}`;
    const dateKey = formatDateKey(day, getMonthIndex(month), year);
    
    
    const dayEvents = events[dateKey] || [];
    
    
    showEventModal(day, month, year, dateKey, dayEvents);
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    renderCalendar();
}

document.addEventListener('DOMContentLoaded', function() {
    
    initializeSchoolEvents();

    
    renderCalendar();
    
    
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousMonth);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextMonth);
    }
    
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('eventModal');
        if (modal && event.target === modal) {
            closeEventModal();
        }
    });
});
