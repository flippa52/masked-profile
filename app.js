const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.getElementById('closeModal');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const mobileMenuPanel = document.getElementById('mobileMenuPanel');
const menuClose = document.getElementById('menuClose');
const year = document.getElementById('year');

function buildMailto(subject, body) {
  return `mailto:funterrancebouncingcastles@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (year) year.textContent = new Date().getFullYear();

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('funterrance-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

const storedTheme = localStorage.getItem('funterrance-theme');
setTheme(storedTheme || 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(current);
  });
}

function openModal(src, caption) {
  if (!modal || !modalImage || !modalCaption) return;
  modalImage.src = src;
  modalImage.alt = caption || 'Expanded gallery image';
  modalCaption.textContent = caption || '';
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closePhotoModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-lightbox]').forEach((item) => {
  item.addEventListener('click', () => openModal(item.dataset.lightbox, item.dataset.caption));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(item.dataset.lightbox, item.dataset.caption);
    }
  });
});

if (closeModal) closeModal.addEventListener('click', closePhotoModal);
if (modal) modal.addEventListener('click', (event) => {
  if (event.target === modal) closePhotoModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePhotoModal();
});

if (menuToggle && mobileMenuPanel) {
  menuToggle.addEventListener('click', () => mobileMenuPanel.classList.add('is-open'));
}
if (menuClose && mobileMenuPanel) {
  menuClose.addEventListener('click', () => mobileMenuPanel.classList.remove('is-open'));
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = bookingForm.querySelector('.form-status');
    const name = bookingForm.querySelector('#name')?.value || 'Not provided';
    const phone = bookingForm.querySelector('#phone')?.value || 'Not provided';
    const service = bookingForm.querySelector('#service')?.value || 'Not provided';
    const details = bookingForm.querySelector('#details')?.value || 'Not provided';
    const body = `Hello Funterrance,\n\nNew booking request:\nName: ${name}\nPhone: ${phone}\nService: ${service}\nEvent details: ${details}`;
    if (status) {
      status.textContent = 'Your request is opening in your email app.';
    }
    window.location.href = buildMailto('New booking request from website', body);
    bookingForm.reset();
  });
}

const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
  paymentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('paymentStatus');
    const phone = document.getElementById('phone')?.value || 'Not provided';
    const amount = document.getElementById('amount')?.value || 'Not provided';
    const packageName = document.getElementById('package')?.value || 'Not provided';
    const body = `Hello Funterrance,\n\nNew payment request:\nPackage: ${packageName}\nAmount: ${amount}\nPhone: ${phone}`;
    if (status) status.textContent = 'Your payment request is opening in your email app.';
    window.location.href = buildMailto('MPesa payment request from website', body);
  });
}
