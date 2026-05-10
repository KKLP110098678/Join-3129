/**
 * Gibt die passende Begrüßung basierend auf der Uhrzeit zurück.
 * @returns {string} Die Begrüßungsformel.
 */
function getGreetingMessage() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good day';
    return 'Good evening';
}


/**
 * Gibt den Benutzernamen aus dem SessionStorage zurück, oder leer bei Gästen.
 * @returns {string} Der Benutzername oder ein leerer String.
 */
function getGreetingName() {
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    const username = sessionStorage.getItem('username') || '';
    return isGuest ? '' : username.trim();
}


/**
 * Prüft ob die Begrüßungsanimation angezeigt werden soll.
 * @returns {boolean} True wenn die Animation gezeigt werden soll.
 */
function shouldShowGreeting() {
    if (window.innerWidth > 1000) return false;
    if (sessionStorage.getItem('greetingShown') === 'true') return false;
    return true;
}


/**
 * Erstellt und gibt das Overlay-Element zurück.
 * @returns {HTMLElement} Das Overlay-div.
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
 * Erstellt den Begrüßungstext-Container.
 * @returns {HTMLElement} Das Text-div.
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
 * Erstellt die Begrüßungszeile (erste Zeile).
 * @param {string} greetingName - Der Benutzername.
 * @returns {HTMLElement} Das span-Element.
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
 * Erstellt die Namenszeile (zweite Zeile) für eingeloggte Nutzer.
 * @param {string} greetingName - Der Benutzername.
 * @returns {HTMLElement} Das strong-Element.
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
 * Befüllt den Begrüßungstext-Container mit Begrüßung und ggf. Name.
 * @param {HTMLElement} container - Der Text-Container.
 * @param {string} greetingName - Der Benutzername.
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
 * Blendet den Begrüßungstext aus und entfernt das Overlay.
 * @param {HTMLElement} greetingText - Der Text-Container.
 * @param {HTMLElement} overlay - Das Overlay-Element.
 * @param {HTMLElement|null} summaryContent - Der Summary-Container.
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
 * Blendet den Summary-Inhalt mit Animation ein.
 * @param {HTMLElement|null} summaryContent - Der Summary-Container.
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
 * Zeigt die Begrüßungsanimation auf kleinen Bildschirmen beim ersten Besuch.
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