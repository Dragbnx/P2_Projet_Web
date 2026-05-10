

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(function(counter) {
    var target = parseInt(counter.getAttribute('data-target'), 10);
    var duration = 1200; 
    var step = target / (duration / 16);
    var current = 0;
    var timer = setInterval(function() {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current);
    }, 16);
  });
}

var statsSection = document.querySelector('.stats-section');
var statsAnimated = false;
if (statsSection) {
  var observer = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      animateCounters();
    }
  }, { threshold: 0.3 });
  observer.observe(statsSection);
}

var cards = document.querySelectorAll('.testimonial-card');
var dotsContainer = document.getElementById('carouselDots');
var currentIndex = 0;

if (dotsContainer && cards.length > 0) {
  cards.forEach(function(_, i) {
    var dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Témoignage ' + (i + 1));
    dot.addEventListener('click', function() { showCard(i); });
    dotsContainer.appendChild(dot);
  });
}

function showCard(index) {
  cards.forEach(function(c) { c.classList.remove('active'); });
  var dots = document.querySelectorAll('.carousel-dot');
  dots.forEach(function(d) { d.classList.remove('active'); });

  currentIndex = (index + cards.length) % cards.length;
  cards[currentIndex].classList.add('active');
  if (dots[currentIndex]) dots[currentIndex].classList.add('active');
}

if (cards.length > 0) showCard(0);

var prevBtn = document.querySelector('.carousel-prev');
var nextBtn = document.querySelector('.carousel-next');
if (prevBtn) prevBtn.addEventListener('click', function() { showCard(currentIndex - 1); });
if (nextBtn) nextBtn.addEventListener('click', function() { showCard(currentIndex + 1); });

