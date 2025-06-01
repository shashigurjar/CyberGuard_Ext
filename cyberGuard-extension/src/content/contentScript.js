
const collectedUrls = new Set();
const collectedImages = new Set();
const emails = new Array();
const inputFields = new Array();
let mutationTimer = null;
let observer = null;

// Extract anchor tag URLs
function extractAnchorLinks() {
  const anchors = document.querySelectorAll('a[href]');
  anchors.forEach(anchor => {
    const href = anchor.href;
    if (href && href.startsWith('http')) {
      collectedUrls.add(href);
    }
  });
}

// Extract image sources
function extractImageSources() {
  const images = document.querySelectorAll('img[src]');
  images.forEach(img => {
    const src = img.src;
    if (src && (src.startsWith('http') || src.startsWith('data:'))) {
      collectedImages.add(src);
    }
  });
}

// Extract possible user-related data
function extractUserData() {
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

    document.querySelectorAll('body *').forEach(el => {
        const text = el.innerText || el.value || '';
        const match = text.match(emailRegex);
        if (match) emails.push(match[0]);
    });

    inputFields = Array.from(document.querySelectorAll('input'))
        .map(input => ({
            type: input.type,
            name: input.name || '',
            value: input.value || '',
        }));

}

// Debounced send to background after DOM stabilizes
function scheduleSendOnce() {
  if (mutationTimer) clearTimeout(mutationTimer);

  mutationTimer = setTimeout(() => {
    if (observer) observer.disconnect(); // Stop watching
    sendDataToBackground();
  }, 3000);
}

// Send collected data to background script
function sendDataToBackground() {
  chrome.runtime.sendMessage({
    type: 'PAGE_DATA',
    payload: {
      pageUrl: window.location.href,
      anchorUrls: Array.from(collectedUrls),
      imageUrls: Array.from(collectedImages),
      userData: {
        emails,
        inputFields
      }
    }
  });
}

// Start observation when script loads
function startObservation() {
  extractAnchorLinks();
  extractImageSources();
  scheduleSendOnce();

  observer = new MutationObserver(() => {
    extractAnchorLinks();
    extractImageSources();
    scheduleSendOnce();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

startObservation();
