function getGreetingMessage() {
    const hour = new Date().getHours();
    const isGuest = sessionStorage.getItem('isGuest') === 'true';
    const username = sessionStorage.getItem('username') || '';
    const firstName = isGuest ? '' : username.trim().split(' ')[0];

    let greeting;
    if (hour >= 6 && hour < 12) {
        greeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'Good day';
    } else {
        greeting = 'Good evening';
    }

    return firstName ? `${greeting}, ${firstName}!` : `${greeting}!`;
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
        z-index: 500;
        pointer-events: none;
    `;

    const greetingText = document.createElement('p');
    greetingText.textContent = getGreetingMessage();
    greetingText.style.cssText = `
        font-size: 60px;
        font-weight: 700;
        color: #2A3647;
        text-align: center;
        padding: 0 24px;
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.8s ease, transform 0.8s ease;
    `;

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