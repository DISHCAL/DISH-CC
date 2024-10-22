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

function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalDurationSection = document.getElementById('rentalDurationSection');

    if (purchaseOption === 'mieten') {
        rentalDurationSection.classList.remove('hidden');
    } else {
        rentalDurationSection.classList.add('hidden');
    }
}

function calculateCosts() {
    // Überprüfen, ob Pflichtfelder ausgefüllt sind
    const requiredFields = ['customerName', 'monthlyVolume', 'transactions', 'girocard', 'mastercardVisa'];
    let allFieldsFilled = true;

    requiredFields.forEach(function(fieldId) {
        const field = document.getElementById(fieldId);
        const errorField = document.getElementById(fieldId + 'Error');
        if (!field.value) {
            field.classList.add('error');
            if (errorField) errorField.textContent = 'Dieses Feld ist erforderlich.';
            allFieldsFilled = false;
        } else {
            field.classList.remove('error');
            if (errorField) errorField.textContent = '';
        }
    });

    if (!allFieldsFilled) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }

    // Überprüfen, ob die Summe der Prozentangaben 100% ergibt
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const vpayPercentage = parseFloat(document.getElementById('vpay').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    const totalPercentage = girocardPercentage + mastercardVisaPercentage + vpayPercentage + businessCardPercentage;

    if (totalPercentage !== 100) {
        const percentageError = document.getElementById('percentageError');
        percentageError.textContent = 'Die Summe der Prozentangaben muss 100% ergeben.';
        return;
    } else {
        document.getElementById('percentageError').textContent = '';
    }

    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseInt(document.getElementById('transactions').value) || 0;

    // Berechnung der Girocard-Gebühren
    const girocardVolume = monthlyVolume * (girocardPercentage / 100);
    let girocardFeeRate = 0;

    if (girocardVolume <= 10000) {
        girocardFeeRate = 0.0039; // 0,39%
    } else {
        girocardFeeRate = 0.0029; // 0,29%
    }

    const girocardCost = girocardVolume * girocardFeeRate;

    // Berechnungen für andere Gebühren
    const mastercardVisaVolume = monthlyVolume * (mastercardVisaPercentage / 100);
    const vpayVolume = monthlyVolume * (vpayPercentage / 100);
    const businessCardVolume = monthlyVolume * (businessCardPercentage / 100);

    const mastercardVisaCost = mastercardVisaVolume * 0.0089; // 0,89%
    const vpayCost = vpayVolume * 0.0089; // 0,89%
    const businessCardCost = businessCardVolume * 0.0289; // 2,89%

    // Transaktionskosten
    const transactionCost = transactions * 0.06;

    // Gesamtkosten DISH PAY Gebühren
    const totalDishPayFees = girocardCost + mastercardVisaCost + vpayCost + businessCardCost + transactionCost;

    // Hardwarekosten
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalDuration = document.getElementById('rentalDuration').value;
    const hardwareSelection = document.getElementById('hardware').value;

    let hardwareCost = 0;
    let simServiceFee = '-';
    let oneTimeCost = '-';

    // Hardwarepreise entsprechend der Auswahl
    if (purchaseOption === 'kaufen') {
        switch (hardwareSelection) {
            case 'S1F2':
                hardwareCost = 0; // Keine monatlichen Kosten beim Kauf
                oneTimeCost = 499.00;
                simServiceFee = 3.90;
                break;
            case 'V400C':
                hardwareCost = 0;
                oneTimeCost = 399.00;
                simServiceFee = 3.90;
                break;
            case 'Moto G14':
                hardwareCost = 0;
                oneTimeCost = 119.00;
                simServiceFee = 7.90;
                break;
            case 'Tap2Pay':
                hardwareCost = 0;
                oneTimeCost = 0; // Kauf nicht verfügbar
                simServiceFee = 0;
                break;
            default:
                hardwareCost = 0;
        }
    } else if (purchaseOption === 'mieten') {
        switch (hardwareSelection) {
            case 'S1F2':
                if (rentalDuration === '12M') hardwareCost = 44.90;
                else if (rentalDuration === '36M') hardwareCost = 18.90;
                else if (rentalDuration === '60M') hardwareCost = 14.90;
                break;
            case 'V400C':
                if (rentalDuration === '12M') hardwareCost = 39.90;
                else if (rentalDuration === '36M') hardwareCost = 16.90;
                else if (rentalDuration === '60M') hardwareCost = 12.90;
                break;
            case 'Moto G14':
                hardwareCost = 0; // Miete nicht verfügbar
                break;
            case 'Tap2Pay':
                hardwareCost = 7.90; // Nur 12M verfügbar
                break;
            default:
                hardwareCost = 0;
        }
        simServiceFee = '-'; // Bei Miete keine SIM/Service-Gebühr
        oneTimeCost = '-'; // Keine einmaligen Kosten bei Miete
    }

    // Gesamtkosten DISH PAY
    const totalMonthlyCost = hardwareCost + (simServiceFee !== '-' ? simServiceFee : 0) + totalDishPayFees;

    // Wettbewerber Gebühren (falls Felder ausgefüllt)
    let totalCompetitorCost = 0;
    const calculationType = document.getElementById('calculationType').value;

    if (calculationType === 'ausführlich') {
        const competitorGirocard = parseFloat(document.getElementById('competitorGirocard').value) || 0;
        const competitorMaestro = parseFloat(document.getElementById('competitorMaestro').value) || 0;
        const competitorMastercardVisa = parseFloat(document.getElementById('competitorMastercardVisa').value) || 0;
        const competitorBusinessCard = parseFloat(document.getElementById('competitorBusinessCard').value) || 0;

        const competitorGirocardCost = girocardVolume * (competitorGirocard / 100);
        const competitorMaestroCost = vpayVolume * (competitorMaestro / 100);
        const competitorMastercardVisaCost = mastercardVisaVolume * (competitorMastercardVisa / 100);
        const competitorBusinessCardCost = businessCardVolume * (competitorBusinessCard / 100);

        const competitorTransactionCost = transactions * 0.06; // Angenommen gleicher Transaktionspreis

        totalCompetitorCost = competitorGirocardCost + competitorMaestroCost + competitorMastercardVisaCost + competitorBusinessCardCost + competitorTransactionCost;
    }

    const savings = totalCompetitorCost - totalDishPayFees;

    // Ergebnisdarstellung
    let resultHtml = '<table class="result-table">';

    // DISH PAY Kosten
    resultHtml += '<tr><td colspan="2"><strong>DISH PAY Kosten</strong></td></tr>';

    resultHtml += `<tr><td>Hardwarekosten (monatlich)</td><td>${hardwareCost ? hardwareCost.toFixed(2) + ' €' : '-'}</td></tr>`;
    resultHtml += `<tr><td>SIM/Service-Gebühr (monatlich)</td><td>${simServiceFee !== '-' ? simServiceFee.toFixed(2) + ' €' : '-'}</td></tr>`;
    resultHtml += `<tr><td>Gebühren</td><td>${totalDishPayFees.toFixed(2)} €</td></tr>`;
    resultHtml += `<tr><td>Einmalige Kosten</td><td>${oneTimeCost !== '-' ? oneTimeCost.toFixed(2) + ' €' : '-'}</td></tr>`;
    resultHtml += `<tr class="total-cost"><td>Gesamte monatliche Kosten</td><td>${totalMonthlyCost.toFixed(2)} €</td></tr>`;

    // Trennung zwischen DISH PAY und Wettbewerber
    if (calculationType === 'ausführlich') {
        resultHtml += '<tr><td colspan="2"><strong>Wettbewerber Kosten</strong></td></tr>';
        resultHtml += `<tr><td>Wettbewerber Gebühren</td><td>${totalCompetitorCost.toFixed(2)} €</td></tr>`;
        resultHtml += `<tr class="highlight"><td>Ersparnis mit DISH PAY</td><td>${savings.toFixed(2)} €</td></tr>`;
    }

    resultHtml += '</table>';

    // Ergebnisbereich aktualisieren
    document.getElementById('resultArea').innerHTML = resultHtml;

    document.getElementById('downloadPdfButton').disabled = false;
}
