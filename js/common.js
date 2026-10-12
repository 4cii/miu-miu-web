
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

  // gerakin lingkaran besar smooth
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