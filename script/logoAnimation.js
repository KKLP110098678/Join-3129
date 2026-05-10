/**
 * Gibt die Logo-Dimensionen und Position je nach Bildschirmgröße zurück.
 * @returns {{ height: string, width: string, left: string, top: string }}
 */
function getLogoTargetStyles() {
    if (window.innerWidth <= 768) {
        return { height: '80px', width: '66px', left: '40px', top: '40px' };
    }
    return { height: '121.97px', width: '100.03px', left: '77px', top: '80px' };
}


/**
 * Setzt die finalen Styles des Logos nach der Animation.
 * @param {HTMLElement} animationLogo - Das Logo-Element.
 */
function applyLogoStyles(animationLogo) {
    const styles = getLogoTargetStyles();
    animationLogo.style.transform = 'translate(0, 0)';
    animationLogo.style.height = styles.height;
    animationLogo.style.width = styles.width;
    animationLogo.style.left = styles.left;
    animationLogo.style.top = styles.top;
    animationLogo.style.filter = 'brightness(1) invert(0)';
    animationLogo.style.transition = 'height 1s, width 1s, left 1s, top 1s, filter 1s, transform 1s';
}


/**
 * Blendet den Animationshintergrund aus und versteckt ihn nach 3 Sekunden.
 * @param {HTMLElement} animationBackground - Das Hintergrund-Element.
 */
function fadeOutBackground(animationBackground) {
    animationBackground.style.opacity = '0';
    animationBackground.style.transition = 'opacity 3s';
    setTimeout(() => { animationBackground.style.display = 'none'; }, 3000);
}


/**
 * Startet die Logo-Einblendanimation auf der Login-Seite.
 */
function animateLogo() {
    const animationBackground = document.getElementById('animation-background');
    const animationLogo = document.getElementById('animation-logo');

    setTimeout(() => {
        applyLogoStyles(animationLogo);
        fadeOutBackground(animationBackground);
    }, 100);
}