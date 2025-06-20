// Helper: Pop-up prompt for reply type, with unique classes for styling
function createPrompt(callback) {
    // Create overlay with a unique class
    const overlay = document.createElement('div');
    overlay.className = 'hs-reply-interceptor-overlay';
    overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        background:rgba(0,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center;
    `;

    // Create popup with a unique class
    const popup = document.createElement('div');
    popup.className = 'hs-reply-interceptor-popup';
    popup.style = `
        background:#fff;padding:24px 32px;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.25);
        font-family:sans-serif;min-width:250px;text-align:center;
    `;
    popup.innerHTML = '<h3 style="margin-top:0;">Reply Type</h3><p>Is this an Acknowledgement or an Actual reply?</p>';

    // Create buttons with unique classes for future-proofing
    const ackBtn = document.createElement('button');
    ackBtn.textContent = 'Acknowledgement';
    ackBtn.className = 'hs-reply-interceptor-btn hs-reply-interceptor-ack-btn';
    ackBtn.style = 'margin-right:15px;';
    const replyBtn = document.createElement('button');
    replyBtn.textContent = 'Actual Reply';
    replyBtn.className = 'hs-reply-interceptor-btn hs-reply-interceptor-reply-btn';

    popup.appendChild(ackBtn);
    popup.appendChild(replyBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    ackBtn.onclick = function() { callback('Acknowledgement'); overlay.remove(); };
    replyBtn.onclick = function() { callback('Actual Reply'); overlay.remove(); };
}

// Open the status dropdown
function openStatusDropdown() {
    const dropdownButton = document.querySelector('button[data-test-id="ReferenceLiteSearchSelectV2"]');
    if (!dropdownButton) {
        alert('Could not find the ticket status dropdown.');
        return;
    }
    dropdownButton.click();
}

// Main: Attach listener to Send buttons
function attachInterceptor() {
    const sendButtons = document.querySelectorAll('button[data-test-id="composer-send-button"]');
    sendButtons.forEach((btn) => {
        if (!btn._intercepted) {
            btn._intercepted = true;
            btn.addEventListener('click', function(e) {
                // Only proceed if enabled
                if (btn.getAttribute('aria-disabled') !== "false") {
                    return;
                }
                // Only trigger if button label CONTAINS "Send"
                const btnText = btn.innerText.trim();
                if (/Send/i.test(btnText)) {
                    e.preventDefault();
                    createPrompt(function(answer) {
                        openStatusDropdown();
                        setTimeout(() => btn.click(), 500); // Wait for dropdown to open
                    });
                }
                // If not 'Send', do nothing!
            }, true);
        }
    });
}

// Re-attach observer for SPA navigation (HubSpot is a single-page app)
const observer = new MutationObserver(attachInterceptor);
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
window.addEventListener('DOMContentLoaded', attachInterceptor);
