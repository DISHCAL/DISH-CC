function calculateCosts() {
    const transactions = parseFloat(document.getElementById('transactions').value) || 0;
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;

    const girocardCost = (monthlyVolume * (girocardPercentage / 100)) * 0.0039; // Girocard-Gebühr
    const mastercardVisaCost = (monthlyVolume * (mastercardVisaPercentage / 100)) * 0.0089; // Mastercard/VISA-Gebühr

    let maestroCost = 0;
    let businessCardCost = 0;
    let competitorMaestroCost = 0;
    let competitorBusinessCardCost = 0;

    const calculationType = document.getElementById('calculationType').value;
    if (calculationType === 'ausführlich') {
        const maestroPercentage = parseFloat(document.getElementById('maestro').value) || 0;
        const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;

        maestroCost = (monthlyVolume * (maestroPercentage / 100)) * 0.0089; // Maestro-Gebühr
        businessCardCost = (monthlyVolume * (businessCardPercentage / 100)) * 0.015; // Business Card-Gebühr

        // Wettbewerber Kosten
        const competitorGirocardPercentage = parseFloat(document.getElementById('competitorMaestro').value) || 0;
        const competitorMastercardVisaPercentage = parseFloat(document.getElementById('competitorBusinessCard').value) || 0;

        competitorMaestroCost = (monthlyVolume * (competitorGirocardPercentage / 100)) * 0.0089;
        competitorBusinessCardCost = (monthlyVolume * (competitorMastercardVisaPercentage / 100)) * 0.015;
    }

    const totalCost = girocardCost + mastercardVisaCost + maestroCost + businessCardCost;
    const competitorTotalCost = competitorMaestroCost + competitorBusinessCardCost;

    // Miet-/Kaufoptionen und SIM-Kosten
    const purchaseOption = document.getElementById('purchaseOption').value;
    let simFee = 0;

    if (purchaseOption === 'kaufen') {
        simFee = 3.90; // SIM-Kosten von 3,90 € nur bei Kauf
    }

    let resultHtml = `
        <strong>Monatliche Hardwarekosten (${purchaseOption === 'mieten' ? 'Miete' : 'Kauf'}):</strong> 44,90 €<br>
        <strong>SIM-Kosten:</strong> ${simFee === 0 ? 'Keine SIM/Servicegebühr' : `${simFee} €`}<br>
        <strong>Gebühren gesamt:</strong> ${(girocardCost + mastercardVisaCost).toFixed(2)} €<br>
        <strong>Monatliche Gesamtkosten:</strong> ${(totalCost + simFee).toFixed(2)} €<br>
    `;

    if (calculationType === 'ausführlich') {
        const savings = competitorTotalCost - totalCost;

        resultHtml += `
            <strong>Wettbewerberkosten pro Monat:</strong> ${competitorTotalCost.toFixed(2)} €<br>
            <strong>Monatliche Ersparnis mit DISH PAY:</strong> ${savings.toFixed(2)} €<br>
        `;
    }

    document.getElementById('resultArea').innerHTML = resultHtml;

    // Aktivieren des PDF-Buttons
    document.getElementById('downloadPdfButton').disabled = false;
}
