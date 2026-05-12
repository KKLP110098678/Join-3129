/**
 * Returns the logo dimensions and position depending on the screen size.
 * @returns {{ height: string, width: string, left: string, top: string }}
 */
function getLogoTargetStyles() {
    if (window.innerWidth <= 768) {
        return { height: '80px', width: '66px', left: '40px', top: '40px' };
    }
    return { height: '121.97px', width: '100.03px', left: '77px', top: '80px' };
}


/**
 * Sets the final styles of the logo after the animation.
 * @param {HTMLElement} animationLogo - The logo element.
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
 * Fades out the animation background and hides it after 3 seconds.
 * @param {HTMLElement} animationBackground - The background element.
 */
function fadeOutBackground(animationBackground) {
    animationBackground.style.opacity = '0';
    animationBackground.style.transition = 'opacity 3s';
    setTimeout(() => { animationBackground.style.display = 'none'; }, 3000);
}


/**
 * Starts the logo fade-in animation on the login page.
 */
function animateLogo() {
    const animationBackground = document.getElementById('animation-background');
    const animationLogo = document.getElementById('animation-logo');

    setTimeout(() => {
        applyLogoStyles(animationLogo);
        fadeOutBackground(animationBackground);
    }, 100);
}