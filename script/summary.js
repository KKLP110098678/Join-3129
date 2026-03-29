function addSummary() {
    let dashboardRef = document.getElementById('dashboardContent');

    dashboardRef.innerHTML += summaryTemplate();
}

function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 18) {
        return "Good day";
    } else {
        return "Good evening";
    }
}