// script.js

// Übersetzungsdaten
const translations = {
    de: {
        title: "DISH PAY Rechner",
        header: "DISH PAY Rechner",
        language_label: "Sprache:",
        salutation_label: "Anrede und Name:",
        salutation_herr: "Herr",
        salutation_frau: "Frau",
        customerName_placeholder: "Vor- und Nachname",
        calculationType_label: "Berechnungsart:",
        calculation_schnell: "Schnelle Berechnung",
        calculation_ausfuehrlich: "Ausführliche Berechnung",
        monthlyVolume_label: "Geplanter Kartenumsatz pro Monat (€):",
        transactions_label: "Erwartete Anzahl an monatlichen Transaktionen:",
        cardPercentages_label: "Kartenarten Anteil (Summe muss 100% ergeben):",
        girocard_label: "Girocard (%):",
        mastercardVisa_label: "Mastercard / VISA (%):",
        vpay_label: "Maestro / VPAY (%):",
        businessCard_label: "Business Card (%):",
        competitorSection_header: "Wettbewerber Gebühren:",
        competitorGirocard_label: "Girocard Gebühr (%):",
        competitorMaestro_label: "Maestro / VPAY Gebühr (%):",
        competitorMastercardVisa_label: "Mastercard / VISA Gebühr (%):",
        competitorBusinessCard_label: "Business Card Gebühr (%):",
        purchaseOption_label: "Kauf oder Miete:",
        purchaseOption_kaufen: "Kauf",
        purchaseOption_mieten: "Miete",
        rentalDuration_label: "Mietdauer:",
        rentalDuration_12M: "12 Monate",
        rentalDuration_36M: "36 Monate",
        rentalDuration_60M: "60 Monate",
        hardware_label: "Hardware auswählen:",
        calculate_button: "Berechnen",
        sendEmail_button: "Angebot per E-Mail versenden",
        startTour_button: "Assistent starten",
        feesNote_header: "Hinweis zu den Gebühren:",
        fees_note_transaction: "Transaktionspreis: 0,06 € pro Transaktion",
        fees_note_girocard_up_to: "Girocard-Gebühr bis 10.000 € monatlich: 0,39%",
        fees_note_girocard_over: "Girocard-Gebühr über 10.000 € monatlich: 0,29%",
        fees_note_maestro_vpay: "Disagio Maestro / VPAY: 0,89%",
        fees_note_mastercard_visa_private: "Disagio Mastercard/VISA Privatkunden: 0,89%",
        fees_note_mastercard_visa_business: "Disagio Mastercard/VISA Business und NICHT-EWR-RAUM: 2,89%",
        receiptTitle: "DISH PAY Angebot",
        receiptTotalCosts: "Gesamtkosten DISH PAY",
        receiptAverageFee: "Durchschnittliche Gebühr",
        receiptFeeAmount: "Gebührenbetrag",
        receiptTotalSum: "Gesamtsumme",
        receiptThankYou: "Vielen Dank für Ihre Anfrage!",
        competitorFees: "Wettbewerber Gebühren",
        savingsWithDISH_PAY: "Ersparnis mit DISH PAY",
        required_field: "Dieses Feld ist erforderlich.",
        invalid_number: "Bitte geben Sie eine gültige positive Zahl ein.",
        calculation_error: "Es ist ein Fehler bei der Berechnung aufgetreten. Bitte versuchen Sie es erneut.",
        email_subject: "Ihr DISH PAY Angebot",
        email_greeting: "Sehr geehrte/r",
        email_body: "anbei erhalten Sie Ihr DISH PAY Angebot:\n\n",
        email_attachment: "Bitte finden Sie das angehängte Angebot.",
        savings_with_DISH_PAY: "Ersparnis mit DISH PAY",
        percentage_error: "Die Summe der Prozentangaben muss 100% ergeben.",
        hardwareType_S1F2_kaufen: "S1F2 Terminal - Kauf: 499,00 €",
        hardwareType_V400C_kaufen: "V400C Terminal - Kauf: 399,00 €",
        hardwareType_MotoG14_kaufen: "Moto G14 Terminal - Kauf: 119,00 €",
        hardwareType_S1F2_mieten: "S1F2 Terminal - Miete:",
        hardwareType_V400C_mieten: "V400C Terminal - Miete:",
        hardwareType_Tap2Pay_mieten: "Tap2Pay Lizenz - Miete: 7,90 €/Monat",
        tour_step1: "Willkommen beim DISH PAY Rechner! Dieser Assistent führt Sie durch die Eingabe.",
        tour_step2: "Bitte wählen Sie Ihre Anrede und geben Sie Ihren Namen ein.",
        tour_step3: "Geben Sie den geplanten Kartenumsatz und die Anzahl der Transaktionen ein.",
        tour_step4: "Geben Sie den prozentualen Anteil der verschiedenen Kartenarten ein.",
        tour_step5: "Wählen Sie, ob Sie kaufen oder mieten möchten und geben Sie die Mietdauer an."
    },
    en: {
        title: "DISH PAY Calculator",
        header: "DISH PAY Calculator",
        language_label: "Language:",
        salutation_label: "Salutation and Name:",
        salutation_herr: "Mr.",
        salutation_frau: "Ms.",
        customerName_placeholder: "First and Last Name",
        calculationType_label: "Calculation Type:",
        calculation_schnell: "Quick Calculation",
        calculation_ausfuehrlich: "Detailed Calculation",
        monthlyVolume_label: "Planned Card Revenue per Month (€):",
        transactions_label: "Expected Number of Monthly Transactions:",
        cardPercentages_label: "Card Type Percentage (Total must be 100%):",
        girocard_label: "Girocard (%):",
        mastercardVisa_label: "Mastercard / VISA (%):",
        vpay_label: "Maestro / VPAY (%):",
        businessCard_label: "Business Card (%):",
        competitorSection_header: "Competitor Fees:",
        competitorGirocard_label: "Girocard Fee (%):",
        competitorMaestro_label: "Maestro / VPAY Fee (%):",
        competitorMastercardVisa_label: "Mastercard / VISA Fee (%):",
        competitorBusinessCard_label: "Business Card Fee (%):",
        purchaseOption_label: "Purchase or Rent:",
        purchaseOption_kaufen: "Purchase",
        purchaseOption_mieten: "Rent",
        rentalDuration_label: "Rental Duration:",
        rentalDuration_12M: "12 Months",
        rentalDuration_36M: "36 Months",
        rentalDuration_60M: "60 Months",
        hardware_label: "Select Hardware:",
        calculate_button: "Calculate",
        sendEmail_button: "Send Offer via Email",
        startTour_button: "Start Assistant",
        feesNote_header: "Note on Fees:",
        fees_note_transaction: "Transaction Price: €0.06 per transaction",
        fees_note_girocard_up_to: "Girocard Fee up to €10,000 monthly: 0.39%",
        fees_note_girocard_over: "Girocard Fee over €10,000 monthly: 0.29%",
        fees_note_maestro_vpay: "Maestro / VPAY Fee: 0.89%",
        fees_note_mastercard_visa_private: "Mastercard/VISA Fee for Private Customers: 0.89%",
        fees_note_mastercard_visa_business: "Mastercard/VISA Fee for Business and NON-EEA AREA: 2.89%",
        receiptTitle: "DISH PAY Offer",
        receiptTotalCosts: "Total DISH PAY Costs",
        receiptAverageFee: "Average Fee",
        receiptFeeAmount: "Fee Amount",
        receiptTotalSum: "Total Sum",
        receiptThankYou: "Thank you for your inquiry!",
        competitorFees: "Competitor Fees",
        savingsWithDISH_PAY: "Savings with DISH PAY",
        required_field: "This field is required.",
        invalid_number: "Please enter a valid positive number.",
        calculation_error: "An error occurred during the calculation. Please try again.",
        email_subject: "Your DISH PAY Offer",
        email_greeting: "Dear",
        email_body: "Please find your DISH PAY offer below:\n\n",
        email_attachment: "Please find the attached offer.",
        savings_with_DISH_PAY: "Savings with DISH PAY",
        percentage_error: "The sum of percentage inputs must equal 100%.",
        hardwareType_S1F2_kaufen: "S1F2 Terminal - Purchase: €499.00",
        hardwareType_V400C_kaufen: "V400C Terminal - Purchase: €399.00",
        hardwareType_MotoG14_kaufen: "Moto G14 Terminal - Purchase: €119.00",
        hardwareType_S1F2_mieten: "S1F2 Terminal - Rent:",
        hardwareType_V400C_mieten: "V400C Terminal - Rent:",
        hardwareType_Tap2Pay_mieten: "Tap2Pay License - Rent: €7.90/Month",
        tour_step1: "Welcome to the DISH PAY Calculator! This assistant will guide you through the input.",
        tour_step2: "Please select your salutation and enter your name.",
        tour_step3: "Enter the planned card revenue and the number of transactions.",
        tour_step4: "Enter the percentage share of the different card types.",
        tour_step5: "Choose whether you want to purchase or rent and specify the rental duration."
    }
};

// Aktuelle Sprache
let currentLanguage = 'de';

// Funktion zur Sprachänderung
function changeLanguage() {
    const languageSelect = document.getElementById('language');
    currentLanguage = languageSelect.value;
    applyTranslations();
}

// Funktion zum Anwenden der Übersetzungen
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    // Platzhalterübersetzungen
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[currentLanguage][key]) {
            element.placeholder = translations[currentLanguage][key];
        }
    });

    // Update options in selects
    document.querySelectorAll('select').forEach(select => {
        select.querySelectorAll('option[data-i18n]').forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (translations[currentLanguage][key]) {
                option.textContent = translations[currentLanguage][key];
            }
        });
    });

    // Aktualisiere die Tour-Schritte mit der neuen Sprache
    if (window.tour) {
        initializeTour(); // Tour neu initialisieren
    }
}

// Initiale Übersetzung anwenden
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();

    // Tooltips initialisieren
    tippy('[data-tippy-content]', {
        placement: 'right',
    });

    // Hardware-Optionen initialisieren
    updateHardwareOptions();

    // Assistenten initialisieren
    initializeTour();

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

    const startTourButton = document.getElementById('startTourButton');
    if (startTourButton) {
        startTourButton.addEventListener('click', startTour);
    }
});

// Funktion zum Umschalten der Berechnungsfelder
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const competitorSection = document.getElementById('competitorSection');
    const vpayField = document.getElementById('vpayField');
    const businessCardField = document.getElementById('businessCardField');

    if (calculationType === 'ausfuehrlich') {
        competitorSection.classList.remove('hidden');
        vpayField.classList.remove('hidden');
        businessCardField.classList.remove('hidden');
    } else {
        competitorSection.classList.add('hidden');
        vpayField.classList.add('hidden');
        businessCardField.classList.add('hidden');

        // Felder für vpay und businessCard zurücksetzen
        document.getElementById('vpay').value = 0;
        document.getElementById('businessCard').value = 0;

        // Fehlernachrichten zurücksetzen
        const errorFields = ['vpayError', 'businessCardError'];
        errorFields.forEach(id => {
            const errorField = document.getElementById(id);
            if (errorField) errorField.textContent = '';
        });

        // Prozentangaben anpassen
        validateInputs();
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
            <option value="S1F2" data-i18n="hardware_option_S1F2">S1F2 Terminal - Kauf: 499,00 €</option>
            <option value="V400C" data-i18n="hardware_option_V400C">V400C Terminal - Kauf: 399,00 €</option>
            <option value="Moto G14" data-i18n="hardware_option_MotoG14">Moto G14 Terminal - Kauf: 119,00 €</option>
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
            <option value="S1F2" data-i18n="hardware_option_S1F2_rent">S1F2 Terminal - Miete: ${s1f2Price.toFixed(2)} €/Monat</option>
            <option value="V400C" data-i18n="hardware_option_V400C_rent">V400C Terminal - Miete: ${v400cPrice.toFixed(2)} €/Monat</option>
            <option value="Tap2Pay" data-i18n="hardware_option_Tap2Pay_rent">Tap2Pay Lizenz - Miete: ${tap2payPrice.toFixed(2)} €/Monat</option>
        `;
    }

    // Wenn die vorherige Auswahl noch vorhanden ist, diese wieder auswählen
    if (hardwareSelect.querySelector(`option[value="${currentSelection}"]`)) {
        hardwareSelect.value = currentSelection;
    } else {
        hardwareSelect.selectedIndex = 0;
    }

    // Prozentangaben validieren nach Aktualisierung der Hardware-Optionen
    validateInputs();
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
            if (errorField) errorField.textContent = translations[currentLanguage]['required_field'];
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
        if (field.value !== '' && (isNaN(value) || value < 0)) {
            field.classList.add('error');
            const errorField = document.getElementById(fieldId + 'Error');
            if (errorField) errorField.textContent = translations[currentLanguage]['invalid_number'];
            isValid = false;
        } else {
            // Nur entfernen, wenn das Feld nicht leer ist (um spätere Validierungen zu ermöglichen)
            if (field.value !== '') {
                field.classList.remove('error');
                const errorField = document.getElementById(fieldId + 'Error');
                if (errorField) errorField.textContent = '';
            }
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
            percentageError.textContent = translations[currentLanguage]['percentage_error'];
        }
        isValid = false;
    } else {
        const percentageError = document.getElementById('percentageError');
        if (percentageError) {
            percentageError.textContent = '';
        }
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

    // Wettbewerber Gebühren (falls Felder ausgefüllt)
    let totalCompetitorCost = 0;
    if (calculationType === 'ausfuehrlich') {
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
        totalMonthlyCost,
        totalCompetitorCost,
        savings,
        currentLanguage
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
    const {
        purchaseOption,
        simServiceFee,
        oneTimeCost,
        hardwareCost,
        totalMonthlyCost,
        totalDishPayFees,
        totalDishPayFeesPercentage,
        calculationType,
        totalCompetitorCost,
        savings
    } = data;

    // Ergebnisdarstellung
    let resultHtml = '<table class="result-table">';

    // DISH PAY Kosten
    resultHtml += `<tr><td colspan="2"><strong>${translations[data.currentLanguage]['receiptTitle']}</strong></td></tr>`;

    if (purchaseOption === 'kaufen') {
        resultHtml += `<tr><td>${translations[data.currentLanguage]['receiptTotalCosts']}</td><td>${oneTimeCost !== '-' ? oneTimeCost.toFixed(2) + ' €' : '-'}</td></tr>`;
        resultHtml += `<tr><td>${translations[data.currentLanguage]['receiptAverageFee']}</td><td>${simServiceFee !== '-' ? parseFloat(simServiceFee).toFixed(2) + ' €' : '-'}</td></tr>`;
    } else {
        resultHtml += `<tr><td>${translations[data.currentLanguage]['receiptTotalCosts']}</td><td>${hardwareCost.toFixed(2)} €</td></tr>`;
    }

    resultHtml += `<tr><td>${translations[data.currentLanguage]['receiptFeeAmount']}</td><td>${totalDishPayFees.toFixed(2)} €</td></tr>`;
    resultHtml += `<tr class="total-cost"><td>${translations[data.currentLanguage]['receiptTotalSum']}</td><td>${totalMonthlyCost.toFixed(2)} €</td></tr>`;

    // Trennung zwischen DISH PAY und Wettbewerber
    if (calculationType === 'ausfuehrlich') {
        resultHtml += `<tr><td colspan="2"><strong>${translations[data.currentLanguage]['competitorSection_header']}</strong></td></tr>`;
        resultHtml += `<tr><td>${translations[data.currentLanguage]['competitorFees']}</td><td>${totalCompetitorCost.toFixed(2)} €</td></tr>`;
        resultHtml += `<tr class="highlight"><td>${translations[data.currentLanguage]['savingsWithDISH_PAY']}</td><td>${savings.toFixed(2)} €</td></tr>`;
    }

    resultHtml += '</table>';

    // Ergebnisbereich aktualisieren
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = resultHtml;
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
        purchaseOption,
        simServiceFee,
        oneTimeCost,
        hardwareCost,
        totalMonthlyCost,
        totalDishPayFees,
        totalDishPayFeesPercentage,
        calculationType,
        totalCompetitorCost,
        savings,
        currentLanguage
    } = calculationData;

    // E-Mail-Inhalt vorbereiten
    const subject = encodeURIComponent(translations[currentLanguage]['email_subject']);
    let body = `${translations[currentLanguage]['email_greeting']} ${salutation} ${customerName},\n\n`;
    body += translations[currentLanguage]['email_body'];

    body += `\n\n${translations[currentLanguage]['receiptTitle']}\n`;

    if (purchaseOption === 'kaufen') {
        body += `${translations[currentLanguage]['receiptTotalCosts']}: ${oneTimeCost !== '-' ? oneTimeCost.toFixed(2) + ' €' : '-'}\n`;
        body += `${translations[currentLanguage]['receiptAverageFee']}: ${simServiceFee !== '-' ? parseFloat(simServiceFee).toFixed(2) + ' €' : '-'}\n`;
    } else {
        body += `${translations[currentLanguage]['receiptTotalCosts']}: ${hardwareCost.toFixed(2)} €\n`;
    }

    body += `${translations[currentLanguage]['receiptFeeAmount']}: ${totalDishPayFees.toFixed(2)} €\n`;
    body += `${translations[currentLanguage]['receiptTotalSum']}: ${totalMonthlyCost.toFixed(2)} €\n`;

    if (calculationType === 'ausfuehrlich') {
        body += `\n${translations[currentLanguage]['competitorFees']}: ${totalCompetitorCost.toFixed(2)} €\n`;
        body += `${translations[currentLanguage]['savingsWithDISH_PAY']}: ${savings.toFixed(2)} €\n`;
    }

    body = encodeURIComponent(body);

    // Mailto-Link erstellen
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
            classes: 'shadow-md bg-purple-dark',
        },
    });

    // Schritte zum Assistenten hinzufügen
    window.tour.addStep({
        id: 'step-1',
        text: translations[currentLanguage]['tour_step1'],
        buttons: [
            {
                text: currentLanguage === 'de' ? 'Weiter' : 'Next',
                action: window.tour.next,
            }
        ]
    });

    window.tour.addStep({
        id: 'step-2',
        text: translations[currentLanguage]['tour_step2'],
        attachTo: {
            element: '.customer-input',
            on: 'bottom',
        },
        buttons: [
            {
                text: currentLanguage === 'de' ? 'Zurück' : 'Back',
                action: window.tour.back,
            },
            {
                text: currentLanguage === 'de' ? 'Weiter' : 'Next',
                action: window.tour.next,
            }
        ]
    });

    window.tour.addStep({
        id: 'step-3',
        text: translations[currentLanguage]['tour_step3'],
        attachTo: {
            element: '#monthlyVolume',
            on: 'top',
        },
        buttons: [
            {
                text: currentLanguage === 'de' ? 'Zurück' : 'Back',
                action: window.tour.back,
            },
            {
                text: currentLanguage === 'de' ? 'Weiter' : 'Next',
                action: window.tour.next,
            }
        ]
    });

    window.tour.addStep({
        id: 'step-4',
        text: translations[currentLanguage]['tour_step4'],
        attachTo: {
            element: '.percentage-group',
            on: 'bottom',
        },
        buttons: [
            {
                text: currentLanguage === 'de' ? 'Zurück' : 'Back',
                action: window.tour.back,
            },
            {
                text: currentLanguage === 'de' ? 'Weiter' : 'Next',
                action: window.tour.next,
            }
        ]
    });

    window.tour.addStep({
        id: 'step-5',
        text: translations[currentLanguage]['tour_step5'],
        attachTo: {
            element: '#purchaseOption',
            on: 'bottom',
        },
        buttons: [
            {
                text: currentLanguage === 'de' ? 'Zurück' : 'Back',
                action: window.tour.back,
            },
            {
                text: currentLanguage === 'de' ? 'Fertig' : 'Finish',
                action: window.tour.complete,
            }
        ]
    });
}

// Assistenten starten
function startTour() {
    if (window.tour) {
        window.tour.start();
    }
}

// Funktion zur Anzeige der Bon-Animation
function showReceiptAnimation(data) {
    const receiptContainer = document.getElementById('receiptContainer');
    const receiptContent = document.getElementById('receiptContent');

    // Bon-Inhalt erstellen
    let receiptHtml = `<h4>${translations[data.currentLanguage]['receiptTitle']}</h4>`;
    receiptHtml += `<p>${translations[data.currentLanguage]['salutation']}: ${data.salutation} ${data.customerName}</p>`;
    receiptHtml += `<p>${translations[data.currentLanguage]['receiptTotalCosts']}: ${data.totalMonthlyCost.toFixed(2)} €</p>`;
    receiptHtml += `<p>${translations[data.currentLanguage]['receiptAverageFee']}: ${data.totalDishPayFeesPercentage}%</p>`;
    receiptHtml += `<p>${translations[data.currentLanguage]['receiptFeeAmount']}: ${data.totalDishPayFees.toFixed(2)} €</p>`;

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
