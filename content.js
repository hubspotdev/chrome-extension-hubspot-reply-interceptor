// Helper: Pop-up prompt for reply type
function createPrompt(callback) {
    const overlay = document.createElement('div');
    overlay.style = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        background:rgba(0,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center;`;

    const popup = document.createElement('div');
    popup.style = `
        background:#fff;padding:24px 32px;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.25);
        font-family:sans-serif;min-width:250px;text-align:center;`;
    popup.innerHTML = '<h3>Reply Type</h3><p>Is this an Acknowledgement or an Actual reply?</p>';

    const ackBtn = document.createElement('button');
    ackBtn.textContent = 'Acknowledgement';
    ackBtn.style = 'margin-right:15px;';
    const replyBtn = document.createElement('button');
    replyBtn.textContent = 'Actual Reply';

    popup.appendChild(ackBtn);
    popup.appendChild(replyBtn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    ackBtn.onclick = function() { callback('Acknowledgement'); overlay.remove(); };
    replyBtn.onclick = function() { callback('Actual Reply'); overlay.remove(); };
}

// Helper: Set ticket status by simulating a dropdown selection
function setStatus(answer) {
    // Adjust these strings based on your actual HubSpot status options
    const ackStatus = "Waiting on us";
    const replyStatus = "Waiting on contact"; // Change to "Waiting on customer" if that's what's in your UI

    const targetText = answer === 'Acknowledgement' ? ackStatus : replyStatus;

    // 1. Find the dropdown button
    const dropdownButton = document.querySelector('div[data-test-id="ReferenceLiteSearchSelect"][role="button"]');
    if (!dropdownButton) {
        alert('Could not find the ticket status dropdown.');
        return;
    }

    // 2. Open the dropdown (if not already open)
    dropdownButton.click();

    // 3. After dropdown options render, pick the correct one
    setTimeout(() => {
        let found = false;
        // Try various option selectors to be robust
        const options = Array.from(document.querySelectorAll('li[role="option"], button[role="option"], div[role="option"]'));
        for (let option of options) {
            if (option.textContent.trim() === targetText) {
                option.click();
                found = true;
                break;
            }
        }
        if (!found) {
            alert('Status option "' + targetText + '" not found. Please verify the exact status label in your UI.');
        }
    }, 300); // May tweak delay depending on your environment
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
                // Only trigger if button label is "Send"
                const btnText = btn.innerText.trim();
                if (btnText === "Send") {
                    e.preventDefault();
                    createPrompt(function(answer) {
                        setStatus(answer);
                        setTimeout(() => btn.click(), 700); // Wait for status update
                    });
                }
                // If not "Send" (e.g. "Add comment"), do nothing!
            }, true);
        }
    });
}

// Re-attach observer for SPA navigation (HubSpot is a single-page app)
const observer = new MutationObserver(attachInterceptor);
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
window.addEventListener('DOMContentLoaded', attachInterceptor);
