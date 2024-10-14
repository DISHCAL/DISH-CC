// JavaScript file to handle cost calculations and interaction logic
function toggleRentalOptions() {
    const rentalOptions = document.getElementById('rentalOptions');
    rentalOptions.style.display = document.getElementById('purchaseOption').value === 'mieten' ? 'block' : 'none';
}

function calculateCosts() {
    // Eingabewerte holen
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseFloat(document.getElementById('transactions').value) || 0;
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const maestroPercentage = parseFloat(document.getElementById('maestro').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    // Hardware-Kosten holen
    const hardwareSelect = document.getElementById('hardwareOption');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const purchaseOption = document.getElementById('purchaseOption').value;
    
    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost')) || 0;
    let monthlyCost = 0;

    if (purchaseOption === "mieten") {
        const rentalPeriod = document.getElementById('rentalPeriod').value;
        monthlyCost = parseFloat(selectedHardware.getAttribute(`${rentalPeriod}`)) || 0;
    } else {
        monthlyCost = parseFloat(selectedHardware.getAttribute('data-monthly-cost')) || 0;
    }

    // Berechnung der Gebühren pro Transaktion
    const girocardCost = (girocardPercentage / 100) * monthlyVolume * 0.0039;
    const maestroCost = (maestroPercentage / 100) * monthlyVolume * 0.0089;
    const mastercardVisaCost = (mastercardVisaPercentage / 100) * monthlyVolume * 0.0129;
    const businessCardCost = (businessCardPercentage / 100) * monthlyVolume * 0.0289;

    // Gesamtkosten berechnen
    const totalTransactionCost = girocardCost + maestroCost + mastercardVisaCost + businessCardCost;
    const totalMonthlyCost = totalTransactionCost + monthlyCost;
    const totalOnceCost = purchaseOption === "kaufen" ? onceCost : 0;

    // Ergebnisse anzeigen
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h3>Berechnungsergebnisse:</h3>
        <p>Einmalige Kosten: € ${totalOnceCost.toFixed(2)}</p>
        <p>Monatliche Kosten: € ${totalMonthlyCost.toFixed(2)}</p>
    `;
}
