/**
 * Returns the appropriate greeting based on the time of day.
 * @returns {string} The greeting phrase.
 */
function getGreetingMessage() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good day';
    return 'Good evening';
}


/**
 * Returns the username from session storage, or empty string for guests.
 * @returns {string} The username or an empty string.
 */
function getGreetingName() {
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    const username = sessionStorage.getItem('username') || '';
    return isGuest ? '' : username.trim();
}


/**
 * Checks if the greeting animation should be displayed.
 * @returns {boolean} True if the animation should be shown.
 */
function shouldShowGreeting() {
    if (window.innerWidth > 1000) return false;
    if (sessionStorage.getItem('greetingShown') === 'true') return false;
    return true;
}


/**
 * Creates and returns the overlay element.
 * @returns {HTMLElement} The overlay div.
 */
function createGreetingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'greetingOverlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        padding: 0 24px; box-sizing: border-box;
        z-index: 500; pointer-events: none;
    `;
    return overlay;
}


/**
 * Creates the greeting text container.
 * @returns {HTMLElement} The text div.
 */
function createGreetingTextContainer() {
    const greetingText = document.createElement('div');
    greetingText.style.cssText = `
        width: min(100%, 640px); max-width: 100%;
        text-align: center; opacity: 1; transform: translateY(0);
        transition: opacity 0.8s ease, transform 0.8s ease;
        line-height: 1.05;
    `;
    return greetingText;
}


/**
 * Creates the greeting line (first line).
 * @param {string} greetingName - The username.
 * @returns {HTMLElement} The span element.
 */
function createGreetingLine(greetingName) {
    const greetingLine = document.createElement('span');
    greetingLine.textContent = greetingName ? `${getGreetingMessage()},` : getGreetingMessage();
    greetingLine.style.cssText = `
        display: block; font-size: 24px; font-weight: 500;
        color: #2A3647; margin-bottom: 8px;
    `;
    return greetingLine;
}


/**
 * Creates the name line (second line) for logged-in users.
 * @param {string} greetingName - The username.
 * @returns {HTMLElement} The strong element.
 */
function createNameLine(greetingName) {
    const nameLine = document.createElement('strong');
    nameLine.textContent = `${greetingName}!`;
    nameLine.style.cssText = `
        display: block; font-size: clamp(34px, 8vw, 52px);
        font-weight: 800; color: #005DFF;
        line-height: 1.05; word-break: break-word; white-space: normal;
    `;
    return nameLine;
}


/**
 * Fills the greeting text container with greeting and optional name.
 * @param {HTMLElement} container - The text container.
 * @param {string} greetingName - The username.
 */
function populateGreetingContainer(container, greetingName) {
    const greetingLine = createGreetingLine(greetingName);
    if (greetingName) {
        container.appendChild(greetingLine);
        container.appendChild(createNameLine(greetingName));
    } else {
        greetingLine.style.fontSize = '36px';
        greetingLine.style.fontWeight = '700';
        container.appendChild(greetingLine);
    }
}


/**
 * Fades out the greeting text and removes the overlay.
 * @param {HTMLElement} greetingText - The text container.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement|null} summaryContent - The summary container.
 */
function fadeOutGreeting(greetingText, overlay, summaryContent) {
    setTimeout(() => {
        greetingText.style.opacity = '0';
        greetingText.style.transform = 'translateY(-60px)';
    }, 1500);

    setTimeout(() => {
        overlay.remove();
        revealSummaryContent(summaryContent);
    }, 2400);
}


/**
 * Fades in the summary content with animation.
 * @param {HTMLElement|null} summaryContent - The summary container.
 */
function revealSummaryContent(summaryContent) {
    if (!summaryContent) return;
    summaryContent.style.transform = 'translateY(60px)';
    summaryContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    summaryContent.style.opacity = '0';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            summaryContent.style.opacity = '1';
            summaryContent.style.transform = 'translateY(0)';
        });
    });
}


/**
 * Shows the greeting animation on small screens on the first visit.
 */
function animateSummaryGreeting() {
    if (!shouldShowGreeting()) return;
    sessionStorage.setItem('greetingShown', 'true');

    const summaryContent = document.getElementById('summaryContent');
    if (summaryContent) summaryContent.style.opacity = '0';

    const greetingName = getGreetingName();
    const overlay = createGreetingOverlay();
    const greetingText = createGreetingTextContainer();

    populateGreetingContainer(greetingText, greetingName);
    overlay.appendChild(greetingText);
    document.body.appendChild(overlay);

    fadeOutGreeting(greetingText, overlay, summaryContent);
}