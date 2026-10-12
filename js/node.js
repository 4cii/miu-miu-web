gsap.registerPlugin(ScrollTrigger);

const slider = document.querySelector('.slider-sect');
const track  = document.querySelector('.slider-track');
const slides = gsap.utils.toArray('.slider');
const bar = document.querySelector('.progress-bar');

const aboutSect = document.querySelector('.about');
const aboutHeading = document.querySelector('.about-heading');

// dividing words/chars 
function splitChars(el) {
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());

  const walk = (parent) => {
    [...parent.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/\s+/).filter(Boolean).forEach((word) => {
          const w = document.createElement('span');
          w.className = 'word';
          w.setAttribute('aria-hidden', 'true');
          [...word].forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'char';
            c.textContent = ch;
            w.appendChild(c);
          });
          frag.appendChild(w);
        });
        parent.replaceChild(frag, node);
      } else if (node.nodeName !== 'BR') {
        walk(node);
      }
    });
  };

  walk(el);
  return el.querySelectorAll('.char');
}

// ---------- SLIDER ----------

// timeline/slide
const tls = slides.map((slide) => {
  const img      = slide.querySelector('.slide-img');
  const headings = slide.querySelectorAll('.top-heading, .bottom-heading');
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0);

  headings.forEach((h, i) => {
    const chars = splitChars(h);
    tl.fromTo(chars,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power1.out', stagger: 0.04 },
      i === 0 ? 0.3 : '>+=0.15'
    );
  });

  return tl;
});

let active = -1;
function setActive(i) {
  if (i === active) return;
  if (active > -1) tls[active].timeScale(1.6).reverse();
  tls[i].timeScale(1).play();
  active = i;
}

// scroll vertikal 
gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: slider,
    pin: true,
    scrub: 1,
    start: 'top top',
    end: () => '+=' + (track.scrollWidth - window.innerWidth),
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      gsap.set(bar, { scaleX: self.progress });
      setActive(Math.round(self.progress * (slides.length - 1)));
    }
  }
});

// 1st slide appeared.
setActive(0);

// ---------- ABOUT ----------

// dividing chars
const aboutChars = splitChars(aboutHeading);

gsap.to(aboutChars, {
  opacity: 1,
  duration: 0.5,
  ease: 'power1.out',
  stagger: 0.04,
  scrollTrigger: {
    trigger: aboutSect,
    start: 'top 60%',
    toggleActions: 'play none none reverse'
  }
});

// ---------- ORBIT KARTU ----------
const ring  = document.querySelector('.element-cards');
const cards = gsap.utils.toArray('.element-cards > div');
const orbit = { angle: 0 };
let radius  = 0;

function placeCards() {
  cards.forEach((card, i) => {
    // sebar rata di lingkaran, mulai dari titik atas (jam 12)
    const a = orbit.angle + (i / cards.length) * Math.PI * 2 - Math.PI / 2;
    gsap.set(card, {
      xPercent: -50,
      yPercent: -50,
      x: Math.cos(a) * radius,
      y: Math.sin(a) * radius
    });
  });
}

function measure() {
  radius = ring.clientWidth * 0.34;      // 34% 
  placeCards();
}

measure();
window.addEventListener('resize', measure);

// 1 row 30s
const spin = gsap.to(orbit, {
  angle: Math.PI * 2,
  duration: 30,
  ease: 'none',
  repeat: -1,
  onUpdate: placeCards
});

// hover
cards.forEach((card) => {
  card.addEventListener('mouseenter', () => gsap.to(spin, { timeScale: 0, duration: 0.4 }));
  card.addEventListener('mouseleave', () => gsap.to(spin, { timeScale: 1, duration: 0.6 }));
})

// ---------- COUNTER ----------
document.querySelectorAll('.counts').forEach((el) => {
  const target = Number(el.dataset.target);
  const state  = { val: 0 };

  gsap.to(state, {
    val: target,
    duration: 2,
    ease: 'power1.out',
    onUpdate: () => {
      el.textContent = Math.round(state.val).toLocaleString('en-US');
    },
    scrollTrigger: {
      trigger: el,
      start: 'top 80%',
      once: true
    }
  });
});

// recount
document.fonts.ready.then(() => ScrollTrigger.refresh());

// ---------- CURSOR ----------
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");

  let mouseX = 0,
    mouseY = 0;
  let posX = 0,
    posY = 0;

  // gerakin titik kecil langsung
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  // lingkaran besar smooth
  function loop() {
    posX += (mouseX - posX) * 0.1;
    posY += (mouseY - posY) * 0.1;
    follower.style.left = posX + "px";
    follower.style.top = posY + "px";
    requestAnimationFrame(loop);
  }
  loop();
});

// ---------- SIDEBAR ----------
const menuBtn  = document.querySelector('.menu-toggle');
const sidebar  = document.getElementById('sidebar');
const overlay  = document.querySelector('.sidebar-overlay');
const closeBtn = document.querySelector('.sidebar-close');

function openMenu() {
  sidebar.classList.add('is-open');
  overlay.classList.add('is-open');
  menuBtn.setAttribute('aria-expanded', 'true');
  closeBtn.focus();
}

function closeMenu() {
  sidebar.classList.remove('is-open');
  overlay.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.focus();
}

menuBtn.addEventListener('click', (e) => {
  e.preventDefault();                     
  sidebar.classList.contains('is-open') ? closeMenu() : openMenu();
});

closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('is-open')) closeMenu();
});

// tutup otomatis setelah klik salah satu link
sidebar.querySelectorAll('.sidebar-list a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// ---------- CONTACT POPUP ----------
const contactBtn   = document.querySelector('.btn-contact');
const contactPopup = document.getElementById('contact-popup');

if (contactBtn && contactPopup) {
  const setContact = (open) => {
    contactPopup.classList.toggle('is-open', open);
    contactBtn.setAttribute('aria-expanded', String(open));
  };

  contactBtn.addEventListener('click', (e) => {
    e.preventDefault();                                   
    setContact(!contactPopup.classList.contains('is-open'));
  });

  // klik di luar popup = tutup
  document.addEventListener('click', (e) => {
    if (!contactPopup.contains(e.target) && !contactBtn.contains(e.target)) setContact(false);
  });

  // Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setContact(false);
  });
}