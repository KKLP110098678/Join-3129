function getGreetingMessage() {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
        return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
        return 'Good day';
    }

    return 'Good evening';
}

function getGreetingName() {
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    const username = sessionStorage.getItem('username') || '';
    return isGuest ? '' : username.trim();
}

function animateSummaryGreeting() {
    if (window.innerWidth > 1000) return;
    if (sessionStorage.getItem('greetingShown') === 'true') return;

    sessionStorage.setItem('greetingShown', 'true');

    const summaryContent = document.getElementById('summaryContent');
    if (summaryContent) summaryContent.style.opacity = '0';

    const overlay = document.createElement('div');
    overlay.id = 'greetingOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 24px;
        box-sizing: border-box;
        z-index: 500;
        pointer-events: none;
    `;

    const greetingText = document.createElement('div');
    greetingText.style.cssText = `
        width: min(100%, 640px);
        max-width: 100%;
        text-align: center;
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.8s ease, transform 0.8s ease;
        line-height: 1.05;
    `;

    const greetingName = getGreetingName();
    const greetingLine = document.createElement('span');
    greetingLine.textContent = greetingName ? `${getGreetingMessage()},` : getGreetingMessage();
    greetingLine.style.cssText = `
        display: block;
        font-size: 24px;
        font-weight: 500;
        color: #2A3647;
        margin-bottom: 8px;
    `;
    if (greetingName) {
        const nameLine = document.createElement('strong');
        nameLine.textContent = `${greetingName}!`;
        nameLine.style.cssText = `
            display: block;
            font-size: clamp(34px, 8vw, 52px);
            font-weight: 800;
            color: #005DFF;
            line-height: 1.05;
            word-break: break-word;
            white-space: normal;
        `;
        greetingText.appendChild(greetingLine);
        greetingText.appendChild(nameLine);
    } else {
        greetingLine.style.fontSize = '36px';
        greetingLine.style.fontWeight = '700';
        greetingText.appendChild(greetingLine);
    }

    overlay.appendChild(greetingText);
    document.body.appendChild(overlay);

    setTimeout(() => {
        greetingText.style.opacity = '0';
        greetingText.style.transform = 'translateY(-60px)';
    }, 1500);

    setTimeout(() => {
        overlay.remove();

        if (summaryContent) {
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
    }, 2400);
}