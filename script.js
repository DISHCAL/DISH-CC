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
    // Überprüfen, ob Pflichtfelder ausgefüllt sind
    const requiredFields = ['customerName', 'monthlyVolume', 'transactions', 'girocard', 'mastercardVisa'];
    let allFieldsFilled = true;
    requiredFields.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field.value) {
            field.classList.add('error');
            allFieldsFilled = false;
        } else {
            field.classList.remove('error');
        }
    });

    if (!allFieldsFilled) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }

    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseInt(document.getElementById('transactions').value) || 0;
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const vpayPercentage = parseFloat(document.getElementById('vpay').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    // Berechnungen
    const girocardCost = (monthlyVolume * (girocardPercentage / 100)) * 0.0039;
    const mastercardVisaCost = (monthlyVolume * (mastercardVisaPercentage / 100)) * 0.0089;
    const vpayCost = (monthlyVolume * (vpayPercentage / 100)) * 0.0089;
    const businessCardCost = (monthlyVolume * (businessCardPercentage / 100)) * 0.0289;

    const transactionCost = transactions * 0.06;

    const totalDishPayCost = girocardCost + mastercardVisaCost + vpayCost + businessCardCost + transactionCost;

    // Wettbewerber Gebühren (Beispielberechnung)
    const competitorGirocard = parseFloat(document.getElementById('competitorGirocard').value) || 0;
    const competitorMaestro = parseFloat(document.getElementById('competitorMaestro').value) || 0;
    const competitorMastercardVisa = parseFloat(document.getElementById('competitorMastercardVisa').value) || 0;
    const competitorBusinessCard = parseFloat(document.getElementById('competitorBusinessCard').value) || 0;

    const competitorGirocardCost = (monthlyVolume * (girocardPercentage / 100)) * (competitorGirocard / 100);
    const competitorMaestroCost = (monthlyVolume * (vpayPercentage / 100)) * (competitorMaestro / 100);
    const competitorMastercardVisaCost = (monthlyVolume * (mastercardVisaPercentage / 100)) * (competitorMastercardVisa / 100);
    const competitorBusinessCardCost = (monthlyVolume * (businessCardPercentage / 100)) * (competitorBusinessCard / 100);

    const competitorTransactionCost = transactions * 0.06; // Angenommen gleicher Transaktionspreis

    const totalCompetitorCost = competitorGirocardCost + competitorMaestroCost + competitorMastercardVisaCost + competitorBusinessCardCost + competitorTransactionCost;

    const savings = totalCompetitorCost - totalDishPayCost;

    const resultHtml = `
        <strong>Monatliche Hardwarekosten:</strong> 44,90 €<br>
        <strong>Gebühren gesamt:</strong> ${totalDishPayCost.toFixed(2)} €<br>
        <strong>Wettbewerberkosten:</strong> ${totalCompetitorCost.toFixed(2)} €<br>
        <strong>Monatliche Ersparnis mit DISH PAY:</strong> ${savings.toFixed(2)} €<br>
    `;

    document.getElementById('resultArea').innerHTML = resultHtml;
    document.getElementById('downloadPdfButton').disabled = false;
}
