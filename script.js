// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Tooltips initialisieren
    tippy('[data-tippy-content]', {
        placement: 'right',
    });

    // Standardmäßig PAY-Rechner anzeigen
    openCalculator(null, 'pay');

    // Spracheinstellung
    document.getElementById('languageSelect').addEventListener('change', changeLanguage);

    // Initiale Sprachübersetzung
    translatePage();

    // Rental Prices aktualisieren
    updateRentalPrices();

    // Berechnungsfelder initialisieren
    toggleCalculationFields();
});

function openCalculator(evt, calculatorName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('active');
    });

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(calculatorName).classList.remove('hidden');
    document.getElementById(calculatorName).classList.add('active');

    if (evt) {
        evt.currentTarget.classList.add('active');
    } else {
        // Standardmäßig den ersten Tab aktivieren
        document.querySelector('.tab-link').classList.add('active');
    }
}

// Übersetzungsfunktion
function changeLanguage() {
    currentLanguage = document.getElementById('languageSelect').value;
    translatePage();
}

function translatePage() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        element.textContent = translations[currentLanguage][key];
    });
}

// Übersetzungstexte
const translations = {
    de: {
        headline: "Kostenberechnung",
        customerNameLabel: "Anrede und Name:",
        posHeadline: "POS Kostenberechnung",
        toolsHeadline: "TOOLS Kostenberechnung",
        calculateButton: "Berechnen",
        showEmailButton: "Angebot per E-Mail anzeigen",
        closeButton: "Schließen",
        posHardwareLabel: "Hardware-Komponenten:",
        posOptionalAccessories: "Optionales Zubehör:",
        posMonthlyLicenses: "Monatliche Lizenzen und Services:",
        toolsOptions: "DISH Lösungen:",
        calculationTypeLabel: "Berechnungsart: ",
        quickCalculation: "Schnelle Berechnung",
        detailedCalculation: "Ausführliche Berechnung",
        monthlyVolumeLabel: "Geplanter Kartenumsatz pro Monat (€): ",
        transactionsLabel: "Erwartete Anzahl an monatlichen Transaktionen: ",
        girocardLabel: "Girocard (%): ",
        mastercardVisaLabel: "Mastercard / VISA (%): ",
        maestroLabel: "Maestro / VPAY (%): ",
        businessCardLabel: "Business Card (%): ",
        purchaseOptionLabel: "Kauf oder Miete: ",
        rentOption: "Mieten",
        buyOption: "Kaufen",
        hardwareLabel: "Hardware auswählen: ",
        rentalPeriodLabel: "Mietdauer: ",
        competitorFeesHeading: "Wettbewerber Gebühren:",
        competitorGirocardFeeLabel: "Girocard Gebühr (%):",
        competitorMaestroFeeLabel: "Maestro / VPAY Gebühr (%):",
        competitorMastercardVisaFeeLabel: "Mastercard / VISA Gebühr (%):",
        competitorBusinessCardFeeLabel: "Business Card Gebühr (%):",
        feesNoteHeading: "Hinweis zu den Gebühren:",
        transactionFeeInfo: "Transaktionspreis: 0,06 € pro Transaktion",
        girocardFeeInfoBelow: "Girocard-Gebühr bis 10.000 € monatlich: 0,39%",
        girocardFeeInfoAbove: "Girocard-Gebühr über 10.000 € monatlich: 0,29%",
        maestroFeeInfo: "Disagio Maestro / VPAY: 0,89%",
        mastercardVisaFeeInfo: "Disagio Mastercard/VISA Privatkunden: 0,89%",
        businessCardFeeInfo: "Disagio Mastercard/VISA Business und NICHT-EWR-RAUM: 2,89%",
        resultsHeading: "Ergebnisse:",
        disagioFees: "Gesamte Disagio-Gebühren",
        monthlyCost: "Monatliche Hardwarekosten",
        simServiceFee: "SIM/Servicegebühr",
        noSimServiceFee: "Keine SIM/Servicegebühr",
        totalMonthlyCost: "Monatliche Gesamtkosten",
        oneTimeCost: "Einmalige Kosten (bei Kauf)",
        competitorTotal: "Gesamtkosten beim Wettbewerber",
        competitorSavings: "Ihre Einsparungen gegenüber dem Wettbewerber"
    },
    en: {
        headline: "Cost Calculation",
        customerNameLabel: "Salutation and Name:",
        posHeadline: "POS Cost Calculation",
        toolsHeadline: "TOOLS Cost Calculation",
        calculateButton: "Calculate",
        showEmailButton: "Show Offer via Email",
        closeButton: "Close",
        posHardwareLabel: "Hardware Components:",
        posOptionalAccessories: "Optional Accessories:",
        posMonthlyLicenses: "Monthly Licenses and Services:",
        toolsOptions: "DISH Solutions:",
        calculationTypeLabel: "Calculation Type: ",
        quickCalculation: "Quick Calculation",
        detailedCalculation: "Detailed Calculation",
        monthlyVolumeLabel: "Planned Card Turnover per Month (€): ",
        transactionsLabel: "Expected Number of Monthly Transactions: ",
        girocardLabel: "Girocard (%): ",
        mastercardVisaLabel: "Mastercard / VISA (%): ",
        maestroLabel: "Maestro / VPAY (%): ",
        businessCardLabel: "Business Card (%): ",
        purchaseOptionLabel: "Purchase or Rent: ",
        rentOption: "Rent",
        buyOption: "Purchase",
        hardwareLabel: "Select Hardware: ",
        rentalPeriodLabel: "Rental Period: ",
        competitorFeesHeading: "Competitor Fees:",
        competitorGirocardFeeLabel: "Girocard Fee (%):",
        competitorMaestroFeeLabel: "Maestro / VPAY Fee (%):",
        competitorMastercardVisaFeeLabel: "Mastercard / VISA Fee (%):",
        competitorBusinessCardFeeLabel: "Business Card Fee (%):",
        feesNoteHeading: "Note on Fees:",
        transactionFeeInfo: "Transaction Price: €0.06 per transaction",
        girocardFeeInfoBelow: "Girocard fee up to €10,000 monthly: 0.39%",
        girocardFeeInfoAbove: "Girocard fee over €10,000 monthly: 0.29%",
        maestroFeeInfo: "Maestro / VPAY fee: 0.89%",
        mastercardVisaFeeInfo: "Mastercard/VISA private customers fee: 0.89%",
        businessCardFeeInfo: "Mastercard/VISA business and non-EU fee: 2.89%",
        resultsHeading: "Results:",
        disagioFees: "Total Disagio Fees",
        monthlyCost: "Monthly Hardware Costs",
        simServiceFee: "SIM/Service Fee",
        noSimServiceFee: "No SIM/Service Fee",
        totalMonthlyCost: "Total Monthly Costs",
        oneTimeCost: "One-time Costs (when purchasing)",
        competitorTotal: "Total Costs with Competitor",
        competitorSavings: "Your Savings Compared to Competitor"
    }
};

/* PAY-Rechner-Funktionen */
// (Der vollständige PAY-Rechner-Code ist hier enthalten)
// ... (siehe vorherigen Codeabschnitt für den vollständigen Inhalt)
// ...

/* POS-Rechner-Funktionen */
function calculatePos() {
    // Kundendaten abrufen
    const salutation = document.getElementById('salutation').value;
    const customerName = document.getElementById('customerName').value.trim();
    const customerNameError = document.getElementById('customerNameError');

    if (!customerName) {
        customerNameError.textContent = 'Bitte geben Sie den Kundennamen ein.';
        return;
    } else {
        customerNameError.textContent = '';
    }

    // Preise definieren
    const prices = {
        hardware: {
            screenSunmi: 493.00,
            tseHardware: 159.00,
            menuService: 300.00,
            onSiteSetup: 599.00,
            mobileDevice: 220.00,
            epsonPrinter: 229.00,
            chargingStation: 79.00,
            accessPoint: 189.00,
            posRouter: 55.00,
            switchLite: 107.00,
            cashDrawer: 69.00,
            qrOrdering: 49.00,
            dishAggregator: 59.00
        },
        licenses: {
            mainLicense: 69.00,
            datevApi: 25.00,
            voucherFunction: 10.00,
            tapToPayLicense: 7.50
        }
    };

    // Eingaben auslesen
    const quantities = {
        screenSunmi: parseInt(document.getElementById('screenSunmi').value) || 0,
        tseHardware: parseInt(document.getElementById('tseHardware').value) || 0,
        menuService: parseInt(document.getElementById('menuService').value) || 0,
        onSiteSetup: parseInt(document.getElementById('onSiteSetup').value) || 0,
        mobileDevice: parseInt(document.getElementById('mobileDevice').value) || 0,
        epsonPrinter: parseInt(document.getElementById('epsonPrinter').value) || 0,
        chargingStation: parseInt(document.getElementById('chargingStation').value) || 0,
        accessPoint: parseInt(document.getElementById('accessPoint').value) || 0,
        posRouter: parseInt(document.getElementById('posRouter').value) || 0,
        switchLite: parseInt(document.getElementById('switchLite').value) || 0,
        cashDrawer: parseInt(document.getElementById('cashDrawer').value) || 0,
        qrOrdering: parseInt(document.getElementById('qrOrdering').value) || 0,
        dishAggregator: parseInt(document.getElementById('dishAggregator').value) || 0
    };

    const licenses = {
        mainLicense: document.getElementById('mainLicense').checked,
        datevApi: document.getElementById('datevApi').checked,
        voucherFunction: document.getElementById('voucherFunction').checked,
        tapToPayLicense: document.getElementById('tapToPayLicense').checked
    };

    // Berechnungen durchführen
    let totalHardwareCost = 0;
    for (let item in quantities) {
        totalHardwareCost += quantities[item] * prices.hardware[item];
    }

    let totalMonthlyCost = 0;
    for (let license in licenses) {
        if (licenses[license]) {
            totalMonthlyCost += prices.licenses[license];
        }
    }

    // MwSt berechnen
    const mwstRate = 0.19;
    const totalHardwareMwst = totalHardwareCost * mwstRate;
    const totalMonthlyMwst = totalMonthlyCost * mwstRate;

    const totalHardwareBrutto = totalHardwareCost + totalHardwareMwst;
    const totalMonthlyBrutto = totalMonthlyCost + totalMonthlyMwst;

    // Ergebnis anzeigen
    const resultArea = document.getElementById('posResult');
    resultArea.innerHTML = `
        <h3>${salutation} ${customerName}, hier ist Ihr POS Angebot:</h3>
        <div class="result-section">
            <p>Gesamtkosten Hardware (Netto): ${totalHardwareCost.toFixed(2)} €</p>
            <p>Gesamtkosten Hardware (Brutto): ${totalHardwareBrutto.toFixed(2)} €</p>
            <p>Monatliche Kosten Lizenzen (Netto): ${totalMonthlyCost.toFixed(2)} €</p>
            <p>Monatliche Kosten Lizenzen (Brutto): ${totalMonthlyBrutto.toFixed(2)} €</p>
        </div>
    `;
}

/* TOOLS-Rechner-Funktionen */
function calculateTools() {
    // Kundendaten abrufen
    const salutation = document.getElementById('salutation').value;
    const customerName = document.getElementById('customerName').value.trim();
    const customerNameError = document.getElementById('customerNameError');

    if (!customerName) {
        customerNameError.textContent = 'Bitte geben Sie den Kundennamen ein.';
        return;
    } else {
        customerNameError.textContent = '';
    }

    // Preise definieren
    const prices = {
        dishStarter: {
            monthly: 10.00,
            activation: 69.00
        },
        dishReservation: {
            monthly36: 34.90,
            monthly12: 44.00,
            monthly3: 49.00,
            activation: 69.00
        },
        dishOrder: {
            monthly12: 49.90,
            monthly3: 59.90,
            activation: 299.00
        },
        dishPremium: {
            monthly12: 69.90,
            monthly3: 79.90,
            activation: 279.00
        }
    };

    // Eingaben auslesen
    const selections = {
        dishStarter: document.getElementById('dishStarter').checked,
        dishReservation: document.getElementById('dishReservation').checked,
        dishOrder: document.getElementById('dishOrder').checked,
        dishPremium: document.getElementById('dishPremium').checked
    };

    const durations = {
        dishReservation: document.getElementById('dishReservationDuration').value,
        dishOrder: document.getElementById('dishOrderDuration').value,
        dishPremium: document.getElementById('dishPremiumDuration').value
    };

    // Berechnungen durchführen
    let totalMonthlyCost = 0;
    let totalActivationCost = 0;

    if (selections.dishStarter) {
        totalMonthlyCost += prices.dishStarter.monthly;
        totalActivationCost += prices.dishStarter.activation;
    }

    if (selections.dishReservation) {
        totalActivationCost += prices.dishReservation.activation;
        if (durations.dishReservation === '36') {
            totalMonthlyCost += prices.dishReservation.monthly36;
        } else if (durations.dishReservation === '12') {
            totalMonthlyCost += prices.dishReservation.monthly12;
        } else if (durations.dishReservation === '3') {
            totalMonthlyCost += prices.dishReservation.monthly3;
        }
    }

    if (selections.dishOrder) {
        totalActivationCost += prices.dishOrder.activation;
        if (durations.dishOrder === '12') {
            totalMonthlyCost += prices.dishOrder.monthly12;
        } else if (durations.dishOrder === '3') {
            totalMonthlyCost += prices.dishOrder.monthly3;
        }
    }

    if (selections.dishPremium) {
        totalActivationCost += prices.dishPremium.activation;
        if (durations.dishPremium === '12') {
            totalMonthlyCost += prices.dishPremium.monthly12;
        } else if (durations.dishPremium === '3') {
            totalMonthlyCost += prices.dishPremium.monthly3;
        }
    }

    // MwSt berechnen
    const mwstRate = 0.19;
    const totalMonthlyMwst = totalMonthlyCost * mwstRate;
    const totalActivationMwst = totalActivationCost * mwstRate;

    const totalMonthlyBrutto = totalMonthlyCost + totalMonthlyMwst;
    const totalActivationBrutto = totalActivationCost + totalActivationMwst;

    // Ergebnis anzeigen
    const resultArea = document.getElementById('toolsResult');
    resultArea.innerHTML = `
        <h3>${salutation} ${customerName}, hier ist Ihr TOOLS Angebot:</h3>
        <div class="result-section">
            <p>Monatliche Kosten (Netto): ${totalMonthlyCost.toFixed(2)} €</p>
            <p>Monatliche Kosten (Brutto): ${totalMonthlyBrutto.toFixed(2)} €</p>
            <p>Aktivierungskosten (Netto): ${totalActivationCost.toFixed(2)} €</p>
            <p>Aktivierungskosten (Brutto): ${totalActivationBrutto.toFixed(2)} €</p>
        </div>
    `;
}

function showEmailContent(calculator) {
    const emailContentContainer = document.getElementById('emailContentContainer');
    const emailContent = document.getElementById('emailContent');
    let content = '';

    if (calculator === 'pay') {
        content = document.getElementById('result').innerHTML;
    } else if (calculator === 'pos') {
        content = document.getElementById('posResult').innerHTML;
    } else if (calculator === 'tools') {
        content = document.getElementById('toolsResult').innerHTML;
    }

    emailContent.innerHTML = content;
    emailContentContainer.classList.add('show');
}

function closeEmailContent() {
    const emailContentContainer = document.getElementById('emailContentContainer');
    emailContentContainer.classList.remove('show');
}
