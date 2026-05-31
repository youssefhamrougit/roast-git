// upload.js — handles file input, drag-and-drop, preview

let uploadedImageBase64 = null;
let uploadedMimeType = null;

const zone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadIdle = document.getElementById('uploadIdle');
const uploadPreview = document.getElementById('uploadPreview');
const previewImg = document.getElementById('previewImg');
const roastBtn = document.getElementById('roastBtn');

// Click on zone opens file picker
zone.addEventListener('click', (e) => {
  if (e.target === zone || e.target.closest('#uploadIdle')) {
    fileInput.click();
  }
});

// File selected via input
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

// Drag and drop
zone.addEventListener('dragover', (e) => {
  e.preventDefault();
  zone.classList.add('drag-over');
});

zone.addEventListener('dragleave', () => {
  zone.classList.remove('drag-over');
});

zone.addEventListener('drop', (e) => {
  e.preventDefault();
  zone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleFile(file);
});

// Paste from clipboard
document.addEventListener('paste', (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      handleFile(item.getAsFile());
      break;
    }
  }
});

function handleFile(file) {
  uploadedMimeType = file.type || 'image/png';
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageBase64 = e.target.result.split(',')[1];
    previewImg.src = e.target.result;
    uploadIdle.style.display = 'none';
    uploadPreview.style.display = 'block';
    roastBtn.disabled = false;
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  uploadedImageBase64 = null;
  uploadedMimeType = null;
  fileInput.value = '';
  previewImg.src = '';
  uploadIdle.style.display = 'block';
  uploadPreview.style.display = 'none';
  roastBtn.disabled = true;
}

function resetAll() {
  resetUpload();
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('uploadSection') && (document.getElementById('uploadSection').style.display = 'block');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
