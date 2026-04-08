// Utility Functions

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Copied to clipboard!');
  }
}

function showToast(message) {
  const toast = document.getElementById('copyToast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function updateUrl(param, value) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  window.history.pushState({}, '', url);
}

function highlightCode(code) {
  if (!code) return '';
  
  const lines = code.split('\n');
  const highlightedLines = lines.map(line => {
    if (line.trim().startsWith('#')) {
      return `<span class="comment-line">${escapeHtml(line)}</span>`;
    }
    const commentIndex = line.indexOf('#');
    if (commentIndex > 0) {
      const codePart = escapeHtml(line.substring(0, commentIndex));
      const commentPart = escapeHtml(line.substring(commentIndex));
      return `${codePart}<span class="comment-line">${commentPart}</span>`;
    }
    return escapeHtml(line);
  });
  
  return highlightedLines.join('\n');
}

window.copyToClipboard = copyToClipboard;
window.scrollToTop = scrollToTop;
window.escapeHtml = escapeHtml;
window.highlightCode = highlightCode;