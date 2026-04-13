function animateLogo() {
    const animationFrame = document.getElementById('animation-frame');
    const animationLogo = document.getElementById('animation-logo');


    setTimeout(() => {
        animationLogo.style.transform = 'translate(0, 0)';
        animationLogo.style.height = '121.97px';
        animationLogo.style.width = '100.03px';
        animationLogo.style.left = '77px';
        animationLogo.style.top = '80px';
        animationLogo.style.filter = 'brightness(1) invert(0)';
        animationLogo.style.transition = 'height 1s, width 1s, left 1s, top 1s, filter 1s, transform 1s';
        animationFrame.style.opacity = '0';
        animationFrame.style.transition = 'opacity 3s';
    }, 100);

    // Hide animation after 3 seconds
    setTimeout(() => {
        animationFrame.style.display = 'none';
    }, 3000);
}

