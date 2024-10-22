// Beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    // Tooltips initialisieren
    tippy('[data-tippy-content]', {
        placement: 'right',
    });

    // Hardware-Optionen initialisieren
    updateHardwareOptions();

    // Assistenten initialisieren
    initializeTour();
});

// Funktion zum Umschalten der Berechnungsfelder
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const competitorSection = document.getElementById('competitorSection');
    const vpayField = document.getElementById('vpayField');
    const businessCardField = document.getElementById('businessCardField');

    if (calculationType === 'ausführlich') {
        competitorSection.classList.add('show');
        competitorSection.classList.remove('hidden');
        vpayField.classList.add('show');
        vpayField.classList.remove('hidden');
        businessCardField.classList.add('show');
        businessCardField.classList.remove('hidden');
    } else {
        competitorSection.classList.add('hidden');
        competitorSection.classList.remove('show');
        vpayField.classList.add('hidden');
        vpayField.classList.remove('show');
        businessCardField.classList.add('hidden');
        businessCardField.classList.remove('show');
    }
}

// Funktion zum Umschalten der Mietoptionen
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalDurationSection = document.getElementById('rentalDurationSection');

    if (purchaseOption === 'mieten') {
        rentalDurationSection.classList.add('show');
        rentalDurationSection.classList.remove('hidden');
    } else {
        rentalDurationSection.classList.add('hidden');
        rentalDurationSection.classList.remove('show');
    }

    // Hardware-Dropdown aktualisieren
    updateHardwareOptions();
}

// Funktion zum Aktualisieren der Hardware-Optionen basierend auf Kauf oder Miete
function updateHardwareOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const hardwareSelect = document.getElementById('hardware');

    // Aktuelle Auswahl speichern
    const currentSelection = hardwareSelect.value;

    // Hardware-Optionen zurücksetzen
    hardwareSelect.innerHTML = '';

    if (purchaseOption === 'kaufen') {
        hardwareSelect.innerHTML = `
            <option value="S1F2">S1F2 Terminal - Kauf: 499,00 €</option>
            <option value="V400C">V400C Terminal - Kauf: 399,00 €</option>
            <option value="Moto G14">Moto G14 Terminal - Kauf: 119,00 €</option>
        `;
    } else {
        hardwareSelect.innerHTML = `
            <option value="S1F2">S1F2 Terminal - Miete</option>
            <option value="V400C">V400C Terminal - Miete</option>
            <option value="Tap2Pay">Tap2Pay Lizenz - Miete</option>
        `;
    }

    // Wenn die vorherige Auswahl noch vorhanden ist, diese wieder auswählen
    if (hardwareSelect.querySelector(`option[value="${currentSelection}"]`)) {
        hardwareSelect.value = currentSelection;
    }
}

// Funktion zur Validierung der Eingaben
function validateInputs() {
    let isValid = true;

    // Pflichtfelder überprüfen
    const requiredFields = ['customerName', 'monthlyVolume', 'transactions', 'girocard', 'mastercardVisa'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorField = document.getElementById(fieldId + 'Error');
        if (!field.value || field.value.trim() === '') {
            field.classList.add('error');
            if (errorField) errorField.textContent = 'Dieses Feld ist erforderlich.';
            isValid = false;
        } else {
            field.classList.remove('error');
            if (errorField) errorField.textContent = '';
        }
    });

    // Numerische Felder überprüfen
    const numericFields = ['monthlyVolume', 'transactions', 'girocard', 'mastercardVisa', 'vpay', 'businessCard'];
    numericFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = parseFloat(field.value);
        if (isNaN(value) || value < 0) {
            field.classList.add('error');
            const errorField = document.getElementById(fieldId + 'Error');
            if (errorField) errorField.textContent = 'Bitte geben Sie eine gültige positive Zahl ein.';
            isValid = false;
        } else {
            field.classList.remove('error');
            const errorField = document.getElementById(fieldId + 'Error');
            if (errorField) errorField.textContent = '';
        }
    });

    // Prozentangaben validieren
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const vpayPercentage = parseFloat(document.getElementById('vpay').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;
    const totalPercentage = girocardPercentage + mastercardVisaPercentage + vpayPercentage + businessCardPercentage;

    if (totalPercentage !== 100) {
        const percentageError = document.getElementById('percentageError');
        percentageError.textContent = 'Die Summe der Prozentangaben muss 100% ergeben.';
        isValid = false;
    } else {
        document.getElementById('percentageError').textContent = '';
    }

    return isValid;
}

// Hauptfunktion zur Berechnung der Kosten
function calculateCosts() {
    // Eingaben validieren
    if (!validateInputs()) {
        return;
    }

    // Fortschrittsanzeige einblenden
    document.getElementById('loadingOverlay').classList.remove('hidden');

    setTimeout(() => {
        // Berechnungen durchführen
        const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
        const transactions = parseInt(document.getElementById('transactions').value) || 0;

        // Prozentangaben
        const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
        const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
        const vpayPercentage = parseFloat(document.getElementById('vpay').value) || 0;
        const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;

        // Berechnung der Umsätze pro Kartenart
        const girocardVolume = monthlyVolume * (girocardPercentage / 100);
        const mastercardVisaVolume = monthlyVolume * (mastercardVisaPercentage / 100);
        const vpayVolume = monthlyVolume * (vpayPercentage / 100);
        const businessCardVolume = monthlyVolume * (businessCardPercentage / 100);

        // Berechnung der Girocard-Gebühren
        let girocardFeeRate = 0;
        if (girocardVolume <= 10000) {
            girocardFeeRate = 0.0039; // 0,39%
        } else {
            girocardFeeRate = 0.0029; // 0,29%
        }
        const girocardCost = girocardVolume * girocardFeeRate;

        // Berechnungen für andere Gebühren
        const mastercardVisaCost = mastercardVisaVolume * 0.0089; // 0,89%
        const vpayCost = vpayVolume * 0.0089; // 0,89%
        const businessCardCost = businessCardVolume * 0.0289; // 2,89%

        // Transaktionskosten
        const transactionCost = transactions * 0.06;

        // Gesamtkosten DISH PAY Gebühren
        const totalDishPayFees = girocardCost + mastercardVisaCost + vpayCost + businessCardCost + transactionCost;

        // Durchschnittliche Gebühr in Prozent berechnen
        const totalSales = girocardVolume + mastercardVisaVolume + vpayVolume + businessCardVolume;
        const totalDishPayFeesPercentage = ((totalDishPayFees / totalSales) * 100).toFixed(2);

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
        const totalMonthlyCost = hardwareCost + (simServiceFee !== '-' ? parseFloat(simServiceFee) : 0) + totalDishPayFees;

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

        if (purchaseOption === 'kaufen') {
            resultHtml += `<tr><td>Hardwarekosten (einmalig Kauf)</td><td>${oneTimeCost !== '-' ? oneTimeCost.toFixed(2) + ' €' : '-'}</td></tr>`;
            resultHtml += `<tr><td>SIM/Service-Gebühr (monatlich)</td><td>${simServiceFee !== '-' ? parseFloat(simServiceFee).toFixed(2) + ' €' : '-'}</td></tr>`;
        } else {
            resultHtml += `<tr><td>Hardwarekosten (monatlich Miete)</td><td>${hardwareCost.toFixed(2)} €</td></tr>`;
        }

        resultHtml += `<tr><td>Gebühren</td><td>${totalDishPayFees.toFixed(2)} €</td></tr>`;
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

        // Diagramm erstellen
        renderChart(totalMonthlyCost, totalCompetitorCost);

        // Bon-Animation anzeigen
        showReceiptAnimation(totalMonthlyCost, totalDishPayFeesPercentage);

        // Fortschrittsanzeige ausblenden
        document.getElementById('loadingOverlay').classList.add('hidden');

        document.getElementById('downloadPdfButton').disabled = false;
    }, 300); // Geringere Verzögerung für schnellere Berechnung
}

// Diagramm erstellen
function renderChart(dishPayCost, competitorCost) {
    const ctx = document.getElementById('costChart').getContext('2d');
    if (window.costChartInstance) {
        window.costChartInstance.destroy();
    }
    const data = {
        labels: ['DISH PAY', 'Wettbewerber'],
        datasets: [{
            label: 'Monatliche Kosten (€)',
            data: [dishPayCost.toFixed(2), competitorCost.toFixed(2)],
            backgroundColor: ['#e67e22', '#3498db'],
        }],
    };
    window.costChartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Funktion zum Versenden des Angebots per E-Mail
function sendEmail() {
    const customerName = document.getElementById('customerName').value;
    const subject = encodeURIComponent('Ihr DISH PAY Angebot');
    const body = encodeURIComponent('Sehr geehrte/r ' + customerName + ',\n\nanbei erhalten Sie Ihr DISH PAY Angebot.\n\nMit freundlichen Grüßen,\nIhr Team');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Interaktiver Assistent initialisieren
function initializeTour() {
    // Prüfen, ob Shepherd verfügbar ist
    if (typeof Shepherd === 'undefined') {
        console.error('Shepherd.js ist nicht verfügbar.');
        return;
    }

    window.tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            scrollTo: true,
            cancelIcon: {
                enabled: true
            },
        },
    });

    // Schritte zum Assistenten hinzufügen
    tour.addStep({
        id: 'step-1',
        text: 'Willkommen beim DISH PAY Rechner! Dieser Assistent führt Sie durch die Eingabe.',
        buttons: [
            {
                text: 'Weiter',
                action: tour.next,
            }
        ]
    });

    tour.addStep({
        id: 'step-2',
        text: 'Bitte wählen Sie Ihre Anrede und geben Sie Ihren Namen ein.',
        attachTo: {
            element: '.customer-input',
            on: 'bottom',
        },
        buttons: [
            {
                text: 'Zurück',
                action: tour.back,
            },
            {
                text: 'Weiter',
                action: tour.next,
            }
        ]
    });

    // Weitere Schritte hinzufügen...
}

// Assistenten starten
function startTour() {
    if (window.tour) {
        window.tour.start();
    }
}

// Funktion zur Anzeige der Bon-Animation
function showReceiptAnimation(totalAmount, feesPercentage) {
    const receiptContent = document.getElementById('receiptContent');
    const receiptContainer = document.getElementById('receiptContainer');

    // Beispielhafte Artikel auf dem Beleg
    const items = [
        { name: '2x Hauptgericht', price: 38.00 },
        { name: '1x Flasche Wein', price: 25.00 },
        { name: '2x Dessert', price: 12.00 },
    ];

    // Gesamtsumme der Artikel berechnen
    let subtotal = 0;
    items.forEach(item => {
        subtotal += item.price;
    });

    // Gebühren
    const feeAmount = (subtotal * (feesPercentage / 100)).toFixed(2);

    // Gesamtbetrag
    const grandTotal = (parseFloat(subtotal) + parseFloat(feeAmount)).toFixed(2);

    // Beleginhalt erstellen
    let receiptHtml = '<h4>Restaurant zur Guten Laune</h4>';
    items.forEach(item => {
        receiptHtml += `<div class="item"><span>${item.name}</span><span>${item.price.toFixed(2)} €</span></div>`;
    });
    receiptHtml += `<div class="item total"><span>Zwischensumme</span><span>${subtotal.toFixed(2)} €</span></div>`;
    receiptHtml += `<div class="item highlight"><span>Gebühren (${feesPercentage}%)</span><span>${feeAmount} €</span></div>`;
    receiptHtml += `<div class="item total"><span>Gesamtsumme</span><span>${grandTotal} €</span></div>`;
    receiptHtml += `<div class="item"><span>Zahlung mit Karte</span><span>${grandTotal} €</span></div>`;
    receiptHtml += `<p style="text-align:center; margin-top:10px;">Vielen Dank für Ihren Besuch!</p>`;

    receiptContent.innerHTML = receiptHtml;

    // Animation anzeigen
    receiptContainer.classList.remove('hidden');

    // Beleg bleibt sichtbar
    // Optional: Sie können den Beleg nach einer gewissen Zeit ausblenden
}
