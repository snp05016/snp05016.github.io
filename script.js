/**
 * Saumya Patel | Minimalist Portfolio Scripts
 * Fast, Vanilla JS, Zero Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initClipboardCopy();
});

/**
 * Copy email to clipboard with subtle toast confirmation
 */
function initClipboardCopy() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email') || 'snp050106@gmail.com';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        showToast(`Copied ${email} to clipboard`);
      } catch (err) {
        showToast(`Email: ${email}`);
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }
}
