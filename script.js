function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const competitorSection = document.getElementById('competitorSection');
    const vpayField = document.getElementById('vpayField');
    const businessCardField = document.getElementById('businessCardField');

    if (calculationType === 'ausführlich') {
        competitorSection.classList.remove('hidden');
        vpayField.classList.remove('hidden');
        businessCardField.classList.remove('hidden');
    } else {
        competitorSection.classList.add('hidden');
        vpayField.classList.add('hidden');
        businessCardField.classList.add('hidden');
    }
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const vpayPercentage = parseFloat(document.getElementById('vpay').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    const girocardCost = (monthlyVolume * (girocardPercentage / 100)) * 0.0039;
    const mastercardVisaCost = (monthlyVolume * (mastercardVisaPercentage / 100)) * 0.0089;
    const vpayCost = (monthlyVolume * (vpayPercentage / 100)) * 0.0089;
    const businessCardCost = (monthlyVolume * (businessCardPercentage / 100)) * 0.029;

    const totalDishPayCost = girocardCost + mastercardVisaCost + vpayCost + businessCardCost;

    // Wettbewerber Gebühren
    const competitorGirocard = parseFloat(document.getElementById('competitorGirocard').value) || 0;
    const competitorMaestro = parseFloat(document.getElementById('competitorMaestro').value) || 0;
    const competitorMastercardVisa = parseFloat(document.getElementById('competitorMastercardVisa').value) || 0;
    const competitorBusinessCard = parseFloat(document.getElementById('competitorBusinessCard').value) || 0;

    const competitorGirocardCost = (monthlyVolume * (competitorGirocard / 100)) * 0.0039;
    const competitorMaestroCost = (monthlyVolume * (competitorMaestro / 100)) * 0.0089;
    const competitorMastercardVisaCost = (monthlyVolume * (competitorMastercardVisa / 100)) * 0.0089;
    const competitorBusinessCardCost = (monthlyVolume * (competitorBusinessCard / 100)) * 0.029;

    const totalCompetitorCost = competitorGirocardCost + competitorMaestroCost + competitorMastercardVisaCost + competitorBusinessCardCost;

    const resultHtml = `
        <strong>Monatliche Hardwarekosten:</strong> 44,90 €<br>
        <strong>Gebühren gesamt:</strong> ${totalDishPayCost.toFixed(2)} €<br>
        <strong>Wettbewerberkosten:</strong> ${totalCompetitorCost.toFixed(2)} €<br>
        <strong>Monatliche Ersparnis mit DISH PAY:</strong> ${(totalCompetitorCost - totalDishPayCost).toFixed(2)} €<br>
    `;

    document.getElementById('resultArea').innerHTML = resultHtml;
    document.getElementById('downloadPdfButton').disabled = false;
}
