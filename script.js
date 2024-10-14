function calculateCosts() {
    // Eingaben des Benutzers
    let monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    let girocardPercent = parseFloat(document.getElementById('girocard').value) / 100;
    let maestroPercent = parseFloat(document.getElementById('maestro').value) / 100;
    let mastercardVisaPercent = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    let businessCardPercent = parseFloat(document.getElementById('businessCard').value) / 100;
    let transactions = parseInt(document.getElementById('transactions').value);

    // Transaktionsgebühren von DISH
    const girocardFeeLow = 0.0039;  // Girocard Gebühr unter 10.000€
    const girocardFeeHigh = 0.0029; // Girocard Gebühr über 10.000€
    const maestroFee = 0.0079;
    const mastercardFee = 0.0089;
    const businessCardFee = 0.0289;
    const transactionFee = 0.06; // Transaktionsgebühr pro Transaktion (0,06 €)

    // Schwelle für niedrige/höhere Girocard-Gebühr
    let girocardFee = monthlyVolume > 10000 ? girocardFeeHigh : girocardFeeLow;

    // Hardwarekosten
    let hardwareOption = document.getElementById('hardwareOption').value;
    let hardwareCost = 0;
    let hardwareRentalCost = 0;

    switch (hardwareOption) {
        case 'S1F2':
            hardwareCost = 499;
            hardwareRentalCost = 3.90;
            break;
        case 'P00C':
            hardwareCost = 399;
            hardwareRentalCost = 3.90;
            break;
        case 'MotoG14':
            hardwareCost = 119;
            hardwareRentalCost = 7.90;
            break;
        case 'Tap2Pay':
            hardwareRentalCost = 7.90;  // Kein Kaufpreis, nur Miete
            break;
    }

    // Berechnungen für DISH
    let girocardCost = monthlyVolume * girocardPercent * girocardFee;
    let maestroCost = monthlyVolume * maestroPercent * maestroFee;
    let mastercardCost = monthlyVolume * mastercardVisaPercent * mastercardFee;
    let businessCardCost = monthlyVolume * businessCardPercent * businessCardFee;
    let transactionCost = transactions * transactionFee;

    let totalDishCost = girocardCost + maestroCost + mastercardCost + businessCardCost + transactionCost + hardwareRentalCost;

    // Wettbewerberkosten
    let competitorFee = parseFloat(document.getElementById('competitorFee').value);
    let competitorCost = transactions * competitorFee;

    // Ergebnisse anzeigen
    let results = document.getElementById('results');
    results.innerHTML = `
        <p><strong>Gesamtkosten DISH:</strong> €${totalDishCost.toFixed(2)}</p>
        <p><strong>Wettbewerberkosten:</strong> €${competitorCost.toFixed(2)}</p>
        <p><strong>Monatliche Einsparungen mit DISH:</strong> €${(competitorCost - totalDishCost).toFixed(2)}</p>
    `;
}

function downloadOffer() {
    const element = document.createElement('a');
    const offerText = `
        DISH PAY - Kartenzahlung Angebot

        Geplanter Umsatz pro Monat: €${document.getElementById('monthlyVolume').value}
        Anzahl der Transaktionen: ${document.getElementById('transactions').value}

        Gesamtkosten DISH: €${totalDishCost.toFixed(2)}
        Wettbewerberkosten: €${competitorCost.toFixed(2)}
        Monatliche Einsparungen mit DISH: €${(competitorCost - totalDishCost).toFixed(2)}

        Hardware: ${document.getElementById('hardwareOption').value}
    `;
    const file = new Blob([offerText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'DISH_PAY_Angebot.txt';
    document.body.appendChild(element); 
    element.click();
}
