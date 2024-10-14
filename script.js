function calculateCosts() {
    // Eingaben
    let monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    let girocardPercent = parseFloat(document.getElementById('girocard').value) / 100;
    let maestroPercent = parseFloat(document.getElementById('maestro').value) / 100;
    let mastercardVisaPercent = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    let businessCardPercent = parseFloat(document.getElementById('businessCard').value) / 100;
    let transactions = parseInt(document.getElementById('transactions').value);

    // Gebühren von DISH
    const girocardFee = 0.0039;
    const maestroFee = 0.0079;
    const mastercardFee = 0.0089;
    const businessCardFee = 0.0289;

    // Hardwarekosten (aus dem Dropdown-Menü ausgewählt)
    let hardwareOption = document.getElementById('hardwareOption').value;
    let hardwareCost;
    switch (hardwareOption) {
        case 'S1F2':
            hardwareCost = 499;
            break;
        case 'P00C':
            hardwareCost = 399;
            break;
        case 'MotoG14':
            hardwareCost = 119;
            break;
        case 'Tap2Pay':
            hardwareCost = 79;
            break;
    }

    // Wettbewerber-Gebühr
    let competitorFee = parseFloat(document.getElementById('competitorFee').value);

    // Berechnungen
    let girocardCost = monthlyVolume * girocardPercent * girocardFee;
    let maestroCost = monthlyVolume * maestroPercent * maestroFee;
    let mastercardCost = monthlyVolume * mastercardVisaPercent * mastercardFee;
    let businessCardCost = monthlyVolume * businessCardPercent * businessCardFee;

    let totalDishCost = girocardCost + maestroCost + mastercardCost + businessCardCost + hardwareCost;

    // Kosten bei Wettbewerbern
    let competitorCost = transactions * competitorFee;

    // Ergebnisse anzeigen
    let results = document.getElementById('results');
    results.innerHTML = `
        <p>Gesamtkosten DISH: €${totalDishCost.toFixed(2)}</p>
        <p>Wettbewerberkosten: €${competitorCost.toFixed(2)}</p>
        <p>Monatliche Einsparungen mit DISH: €${(competitorCost - totalDishCost).toFixed(2)}</p>
    `;
}
