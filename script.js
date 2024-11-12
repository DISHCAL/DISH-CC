// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Tooltips initialisieren
    tippy('[data-tippy-content]', {
        placement: 'right',
    });

    // Hardware-Optionen initialisieren
    updateHardwareOptions();

    // Event Listener hinzufügen
    const rentalDurationElement = document.getElementById('rentalDuration');
    if (rentalDurationElement) {
        rentalDurationElement.addEventListener('change', updateHardwareOptions);
    }

    const purchaseOptionElement = document.getElementById('purchaseOption');
    if (purchaseOptionElement) {
        purchaseOptionElement.addEventListener('change', () => {
            toggleRentalOptions();
            updateHardwareOptions();
        });
    }

    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.addEventListener('click', startCalculation);
    }

    const sendEmailButton = document.getElementById('sendEmailButton');
    if (sendEmailButton) {
        sendEmailButton.addEventListener('click', sendEmail);
    }
});

// Funktion zum Umschalten der Berechnungsfelder
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const vpayField = document.getElementById('vpayField');
    const businessCardField = document.getElementById('businessCardField');

    if (calculationType === 'ausfuehrlich') {
        vpayField.classList.remove('hidden');
        businessCardField.classList.remove('hidden');
    } else {
        vpayField.classList.add('hidden');
        businessCardField.classList.add('hidden');

        // Felder für vpay und businessCard zurücksetzen
        document.getElementById('vpay').value = 0;
        document.getElementById('businessCard').value = 0;
    }
}

// Funktion zum Umschalten der Mietoptionen
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalDurationSection = document.getElementById('rentalDurationSection');

    if (purchaseOption === 'mieten') {
        rentalDurationSection.classList.remove('hidden');
    } else {
        rentalDurationSection.classList.add('hidden');
    }

    // Hardware-Dropdown aktualisieren
    updateHardwareOptions();
}

// Funktion zum Aktualisieren der Hardware-Optionen basierend auf Kauf oder Miete
function updateHardwareOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const hardwareSelect = document.getElementById('hardware');
    const rentalDurationElement = document.getElementById('rentalDuration');
    const rentalDuration = rentalDurationElement ? rentalDurationElement.value : '12M';

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
        // Mietpreise entsprechend der Mietdauer anzeigen
        let s1f2Price = 0;
        let v400cPrice = 0;
        let tap2payPrice = 7.90; // Nur 12M verfügbar

        if (rentalDuration === '12M') {
            s1f2Price = 44.90;
            v400cPrice = 39.90;
        } else if (rentalDuration === '36M') {
            s1f2Price = 18.90;
            v400cPrice = 16.90;
        } else if (rentalDuration === '60M') {
            s1f2Price = 14.90;
            v400cPrice = 12.90;
        }

        hardwareSelect.innerHTML = `
            <option value="S1F2">S1F2 Terminal - Miete: ${s1f2Price.toFixed(2)} €/Monat</option>
            <option value="V400C">V400C Terminal - Miete: ${v400cPrice.toFixed(2)} €/Monat</option>
            <option value="Tap2Pay">Tap2Pay Lizenz - Miete: ${tap2payPrice.toFixed(2)} €/Monat</option>
        `;
    }

    // Wenn die vorherige Auswahl noch vorhanden ist, diese wieder auswählen
    if (hardwareSelect.querySelector(`option[value="${currentSelection}"]`)) {
        hardwareSelect.value = currentSelection;
    } else {
        hardwareSelect.selectedIndex = 0;
    }
}

// Funktion zur Validierung der Eingaben
function validateInputs() {
    let isValid = true;

    // Fehlermeldungen zurücksetzen
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });

    // Rote Rahmen entfernen
    document.querySelectorAll('.error').forEach(element => {
        element.classList.remove('error');
    });

    // Pflichtfelder überprüfen
    const requiredFields = ['customerName', 'monthlyVolume', 'transactions', 'girocard', 'mastercardVisa'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorField = document.getElementById(fieldId + 'Error');
        if (!field.value || field.value.trim() === '') {
            field.classList.add('error');
            if (errorField) errorField.textContent = 'Dieses Feld ist erforderlich.';
            isValid = false;
        }
    });

    // Numerische Felder überprüfen
    const numericFields = ['monthlyVolume', 'transactions', 'girocard', 'mastercardVisa', 'vpay', 'businessCard'];
    numericFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = parseFloat(field.value);
        if (field.value !== '' && (isNaN(value) || value < 0)) {
            field.classList.add('error');
            const errorField = document.getElementById(fieldId + 'Error');
            if (errorField) errorField.textContent = 'Bitte geben Sie eine gültige positive Zahl ein.';
            isValid = false;
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
        if (percentageError) {
            percentageError.textContent = 'Die Summe der Prozentangaben muss 100% ergeben.';
        }
        isValid = false;
    }

    return isValid;
}

// Funktion zum Sammeln der Berechnungsdaten
function getCalculationData() {
    if (!validateInputs()) {
        return null;
    }

    const calculationType = document.getElementById('calculationType').value;
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseInt(document.getElementById('transactions').value) || 0;
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
    const totalDishPayFeesPercentage = totalSales > 0 ? ((totalDishPayFees / totalSales) * 100).toFixed(2) : 0;

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

    return {
        salutation: document.getElementById('salutation').value,
        customerName: document.getElementById('customerName').value.trim(),
        calculationType,
        monthlyVolume,
        transactions,
        girocardPercentage,
        mastercardVisaPercentage,
        vpayPercentage,
        businessCardPercentage,
        girocardVolume,
        mastercardVisaVolume,
        vpayVolume,
        businessCardVolume,
        girocardFeeRate,
        girocardCost,
        mastercardVisaCost,
        vpayCost,
        businessCardCost,
        transactionCost,
        totalDishPayFees,
        totalSales,
        totalDishPayFeesPercentage,
        purchaseOption,
        rentalDuration,
        hardwareSelection,
        hardwareCost,
        simServiceFee,
        oneTimeCost,
        totalMonthlyCost
    };
}

// Hauptfunktion zur Berechnung der Kosten
function startCalculation() {
    // Validierung der Eingaben
    if (!validateInputs()) {
        return;
    }

    // Berechnungen durchführen
    const calculationData = getCalculationData();

    if (!calculationData) {
        return;
    }

    // Ergebnisdarstellung aktualisieren
    displayResults(calculationData);

    // Bon-Animation anzeigen
    showReceiptAnimation(calculationData);

    // E-Mail-Button aktivieren
    document.getElementById('sendEmailButton').disabled = false;
}

// Funktion zur Anzeige der Ergebnisse
function displayResults(data) {
    // Ergebnisbereich aktualisieren (kann angepasst werden, wenn notwendig)
}

// Funktion zum Versenden des Angebots per E-Mail
function sendEmail() {
    const calculationData = getCalculationData();
    if (!calculationData) {
        return;
    }

    const {
        salutation,
        customerName,
        totalMonthlyCost,
        totalDishPayFeesPercentage,
        purchaseOption,
        hardwareSelection,
        currentLanguage
    } = calculationData;

    // E-Mail-Inhalt vorbereiten
    const subject = encodeURIComponent("Ihr DISH PAY Angebot");
    let body = `${salutation} ${customerName},\n\n`;
    body += "Vielen Dank für Ihr Interesse an DISH PAY.\n\n";
    body += "Wir freuen uns, Ihnen folgendes unverbindliches Angebot unterbreiten zu dürfen:\n\n";
    body += `Gesamtkosten: ${totalMonthlyCost.toFixed(2)} €\n`;
    body += `Durchschnittliche Gebühr: ${totalDishPayFeesPercentage}%\n`;
    body += `Hardware: ${hardwareSelection} (${purchaseOption})\n\n`;
    body += "Dieses Angebot ist unverbindlich und dient zu Ihrer Information.\n\n";
    body += "Mit freundlichen Grüßen,\nIhr DISH PAY Team";

    body = encodeURIComponent(body);

    // Mailto-Link erstellen
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Funktion zur Anzeige der Bon-Animation
function showReceiptAnimation(data) {
    const receiptContainer = document.getElementById('receiptContainer');
    const receiptContent = document.getElementById('receiptContent');

    // Bon-Inhalt erstellen
    let receiptHtml = `<h4>${data.customerName}</h4>`;
    receiptHtml += `<p>Vielen Dank für Ihr Interesse an DISH PAY!</p>`;
    receiptHtml += `<p>Wir freuen uns, Ihnen folgendes unverbindliches Angebot zu unterbreiten:</p>`;
    receiptHtml += `<table>`;
    receiptHtml += `<tr><td>Gesamtkosten:</td><td>${data.totalMonthlyCost.toFixed(2)} €</td></tr>`;
    receiptHtml += `<tr><td>Durchschnittliche Gebühr:</td><td>${data.totalDishPayFeesPercentage}%</td></tr>`;
    receiptHtml += `<tr><td>Hardware:</td><td>${data.hardwareSelection} (${data.purchaseOption})</td></tr>`;
    receiptHtml += `</table>`;
    receiptHtml += `<p>Dieses Angebot ist unverbindlich und dient zu Ihrer Information.</p>`;

    receiptContent.innerHTML = receiptHtml;

    // Animation starten
    receiptContainer.classList.remove('hidden');
    receiptContainer.classList.add('animate');

    // Nach der Animation den Bon in die Ecke verschieben
    setTimeout(() => {
        receiptContainer.classList.remove('animate');
        receiptContainer.classList.add('pinned');

        // Nach einigen Sekunden den Bon wieder ausblenden
        setTimeout(() => {
            receiptContainer.classList.add('hidden');
            receiptContainer.classList.remove('pinned');
        }, 5000); // Bon bleibt 5 Sekunden in der Ecke
    }, 3000); // Dauer der Animation (3 Sekunden)
}
