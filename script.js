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

    // Hardwarekosten je nach Kauf oder Miete
    let hardwareOption = document.getElementById('hardwareOption').value;
    let hardwareOptionPurchase = document.getElementById('hardwareOptionPurchase').value;
    let hardwareCost = 0;
    let hardwareRentalCost = 0;

    if (hardwareOptionPurchase === 'mieten') {
        switch (hardwareOption) {
            case 'S1F2':
                hardwareRentalCost = 3.90;
                break;
            case 'P00C':
                hardwareRentalCost = 3.90;
                break;
            case 'MotoG14':
                hardwareRentalCost = 7.90;
                break;
            case 'Tap2Pay':
                hardwareRentalCost = 7.90;  // Kein Kaufpreis, nur Miete
                break;
        }
    } else if (hardwareOptionPurchase === 'kaufen') {
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
        }
    }

    // Schwelle für niedrige/höhere Girocard-Gebühr
    let girocardFee = monthlyVolume > 10000 ? girocardFeeHigh : girocardFeeLow;

    // Berechnung der monatlichen Gebühren für DISH
    let dishCost = transactions * transactionFee;
    dishCost += monthlyVolume * girocardPercent * girocardFee;
    dishCost += monthlyVolume * maestroPercent * maestroFee;
    dishCost += monthlyVolume * mastercardVisaPercent * mastercardFee;
    dishCost += monthlyVolume * businessCardPercent * businessCardFee;
    dishCost += hardwareRentalCost;

    // Berechnung der Wettbewerberkosten (wenn gewählt)
    let competitorInclude = document.getElementById('competitorInclude').value;
    let competitorCost = 0;

    if (competitorInclude === 'ja') {
        let competitorFee = parseFloat(document.getElementById('competitorFee').value);
        let competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100;
        let competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100;
        let competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) / 100;
        let competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) / 100;

        competitorCost = transactions * competitorFee;
        competitorCost += monthlyVolume * girocardPercent * competitorGirocardFee;
        competitorCost += monthlyVolume * maestroPercent * competitorMaestroFee;
        competitorCost += monthlyVolume * mastercardVisaPercent * competitorMastercardFee;
        competitorCost += monthlyVolume * businessCardPercent * competitorBusinessFee;
    }

    // Ergebnisse anzeigen
    document.getElementById('results').innerHTML = `
        <p><strong>Monatliche DISH Kosten:</strong> ${dishCost.toFixed(2)} €</p>
        ${competitorInclude === 'ja' ? `<p><strong>Monatliche Wettbewerber Kosten:</strong> ${competitorCost.toFixed(2)} €</p>` : ''}
    `;
}

function downloadOffer() {
    let offerText = "Hier ist Ihr Angebot basierend auf den eingegebenen Daten:";
    // Weitere Details können hinzugefügt werden
    const blob = new Blob([offerText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'DISH_PAY_Angebot.txt';
    link.click();
}
