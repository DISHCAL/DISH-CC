document.addEventListener('DOMContentLoaded', () => {
    const cardRevenueInput = document.getElementById('cardRevenue');
    const girocardInput = document.getElementById('girocard');
    const maestroInput = document.getElementById('maestro');
    const mastercardPrivatInput = document.getElementById('mastercardPrivat');
    const mastercardBusinessInput = document.getElementById('mastercardBusiness');
    const transactionsInput = document.getElementById('transactions');

    const monthlyCostDisplay = document.getElementById('monthlyCost');
    const savingsDisplay = document.getElementById('savings');

    // Funktion zur Berechnung der monatlichen Kosten
    function calculateMonthlyCosts() {
        const girocardRevenue = parseFloat(girocardInput.value);
        const maestroRevenue = parseFloat(maestroInput.value);
        const mastercardPrivatRevenue = parseFloat(mastercardPrivatInput.value);
        const mastercardBusinessRevenue = parseFloat(mastercardBusinessInput.value);
        const transactions = parseInt(transactionsInput.value);

        // Berechnung der Gebühren (hier können die tatsächlichen Formeln verwendet werden)
        const girocardFee = girocardRevenue * 0.0039; // 0.39%
        const maestroFee = maestroRevenue * 0.0089; // 0.89%
        const mastercardPrivatFee = mastercardPrivatRevenue * 0.0089; // 0.89%
        const mastercardBusinessFee = mastercardBusinessRevenue * 0.0289; // 2.89%

        const totalFees = girocardFee + maestroFee + mastercardPrivatFee + mastercardBusinessFee;
        const monthlyCost = totalFees + (transactions * 0.06); // Beispiel Transaktionskosten

        // Anzeige der Ergebnisse
        monthlyCostDisplay.textContent = "Monatliche Kosten: " + monthlyCost.toFixed(2) + " €";
        savingsDisplay.textContent = "Monatliche Ersparnis: " + (245.19 - monthlyCost).toFixed(2) + " €"; // Beispiel Ersparnis
    }

    // Event-Listener für Eingabefelder zur Neuberechnung bei Änderung
    cardRevenueInput.addEventListener('input', calculateMonthlyCosts);
    girocardInput.addEventListener('input', calculateMonthlyCosts);
    maestroInput.addEventListener('input', calculateMonthlyCosts);
    mastercardPrivatInput.addEventListener('input', calculateMonthlyCosts);
    mastercardBusinessInput.addEventListener('input', calculateMonthlyCosts);
    transactionsInput.addEventListener('input', calculateMonthlyCosts);

    // Anfangsberechnung
    calculateMonthlyCosts();
});
