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
    let hardwareCost = 0;
    let simServiceFee = 0;

    if (purchaseOption === 'kaufen') {
        hardwareCost = 399.00; // Beispielhafter Kaufpreis
        simServiceFee = 3.90; // SIM/Service-Gebühr beim Kauf
    } else {
        hardwareCost = 44.90; // Monatliche Mietkosten
        simServiceFee = 0;    // Keine SIM/Service-Gebühr beim Mieten
    }

    // Gesamtkosten DISH PAY
    const totalMonthlyCost = (purchaseOption === 'kaufen') ? totalDishPayFees + simServiceFee : hardwareCost + totalDishPayFees;

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
    let resultHtml = '';

    if (purchaseOption === 'kaufen') {
        resultHtml += `<div class="result-item"><strong>Hardwarekosten (einmalig Kauf):</strong> ${hardwareCost.toFixed(2)} €</div>`;
        resultHtml += `<div class="result-item"><strong>SIM/Service-Gebühr (monatlich):</strong> ${simServiceFee.toFixed(2)} €</div>`;
    } else {
        resultHtml += `<div class="result-item"><strong>Hardwarekosten (monatlich Miete):</strong> ${hardwareCost.toFixed(2)} €</div>`;
    }

    resultHtml += `<div class="result-item"><strong>Gesamte Gebühren (DISH PAY):</strong> ${totalDishPayFees.toFixed(2)} €</div>`;

    if (calculationType === 'ausführlich') {
        resultHtml += `
            <div class="result-item"><strong>Wettbewerberkosten:</strong> ${totalCompetitorCost.toFixed(2)} €</div>
            <div class="result-item"><strong>Monatliche Ersparnis mit DISH PAY:</strong> ${savings.toFixed(2)} €</div>
        `;
    }

    resultHtml += `<div class="result-item total-cost"><strong>Gesamte monatliche Kosten:</strong> ${totalMonthlyCost.toFixed(2)} €</div>`;

    // Animation der Ergebnisse
    animateResult(resultHtml);

    document.getElementById('downloadPdfButton').disabled = false;
}

function animateResult(htmlContent) {
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = ''; // Vorherigen Inhalt löschen

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const resultItems = tempDiv.querySelectorAll('.result-item');
    let index = 0;

    function showNextItem() {
        if (index < resultItems.length) {
            const item = resultItems[index];
            resultArea.appendChild(item);
            index++;
            setTimeout(showNextItem, 300); // Zeitverzögerung zwischen den Items
        }
    }

    showNextItem();
}
