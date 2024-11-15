// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Tooltips initialisieren (optional, falls benötigt)
    tippy('[data-tippy-content]', {
        placement: 'right',
    });

    // Spracheinstellung
    document.getElementById('languageSelect')
        .addEventListener('change', changeLanguage);

    // Initiale Sprachübersetzung
    translatePage();

    // Berechnungsfelder initialisieren
    toggleCalculationFields();
    toggleRentalOptions();

    // Event Listener für die Formularelemente hinzufügen
    document.getElementById('calculationType').addEventListener('change', toggleCalculationFields);
    document.getElementById('purchaseOption').addEventListener('change', toggleRentalOptions);
    document.getElementById('hardware').addEventListener('change', () => {
        updateRentalPrices();
        updateHardwareCosts();
    });
    document.getElementById('rentalPeriod').addEventListener('change', updateHardwareCosts);

    // Event Listener für die DISH Tools Rechner
    document.getElementById('dishReservation').addEventListener('change', toggleDishReservationDuration);
    document.getElementById('dishOrder').addEventListener('change', toggleDishOrderDuration);
    document.getElementById('dishPremium').addEventListener('change', toggleDishPremiumDuration);
});

/* Tab-Umschaltung */
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

    const activeContent = document.getElementById(calculatorName);
    activeContent.classList.remove('hidden');
    activeContent.classList.add('active');

    evt.currentTarget.classList.add('active');
}

/* Sprachumschaltung */
let currentLanguage = 'de';

function changeLanguage() {
    currentLanguage = document.getElementById('languageSelect').value;
    translatePage();
}

function translatePage() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

const translations = {
    de: {
        // Deutsche Übersetzungen
        customerNameLabel: "Anrede und Name:",
        calculateButton: "Berechnen",
        showEmailButton: "Angebot per E-Mail anzeigen",
        closeButton: "Schließen",
        calculationTypeLabel: "Berechnungsart:",
        quickCalculation: "Schnelle Berechnung",
        detailedCalculation: "Ausführliche Berechnung",
        monthlyVolumeLabel: "Geplanter Kartenumsatz pro Monat (€):",
        transactionsLabel: "Erwartete Anzahl an monatlichen Transaktionen:",
        girocardLabel: "Girocard (%):",
        mastercardVisaLabel: "Mastercard / VISA (%):",
        maestroLabel: "Maestro / VPAY (%):",
        businessCardLabel: "Business Card (%):",
        purchaseOptionLabel: "Kauf oder Miete:",
        rentOption: "Mieten",
        buyOption: "Kaufen",
        hardwareLabel: "Hardware auswählen:",
        rentalPeriodLabel: "Mietdauer:",
        feesNoteHeading: "Hinweis zu den Gebühren:",
        transactionFeeInfo: "Transaktionspreis: 0,06 € pro Transaktion",
        girocardFeeInfoBelow: "Girocard-Gebühr bis 10.000 € monatlich: 0,39%",
        girocardFeeInfoAbove: "Girocard-Gebühr über 10.000 € monatlich: 0,29%",
        maestroFeeInfo: "Disagio Maestro / VPAY: 0,89%",
        mastercardVisaFeeInfo: "Disagio Mastercard/VISA Privatkunden: 0,89%",
        businessCardFeeInfo: "Disagio Mastercard/VISA Business und NICHT-EWR-RAUM: 2,89%",
        payHeadline: "Kostenberechnung PAY",
        posHeadline: "POS Kostenberechnung",
        posHardwareLabel: "Hardware-Komponenten:",
        posMonthlyLicenses: "Monatliche Lizenzen und Services:",
        toolsHeadline: "TOOLS Kostenberechnung",
        toolsOptions: "DISH Lösungen:",
        noResults: "Keine Ergebnisse verfügbar."
        // Weitere Übersetzungen können hier hinzugefügt werden...
    },
    en: {
        // Englische Übersetzungen
        customerNameLabel: "Salutation and Name:",
        calculateButton: "Calculate",
        showEmailButton: "Show Offer via Email",
        closeButton: "Close",
        calculationTypeLabel: "Calculation Type:",
        quickCalculation: "Quick Calculation",
        detailedCalculation: "Detailed Calculation",
        monthlyVolumeLabel: "Planned Card Revenue per Month (€):",
        transactionsLabel: "Expected Number of Monthly Transactions:",
        girocardLabel: "Girocard (%):",
        mastercardVisaLabel: "Mastercard / VISA (%):",
        maestroLabel: "Maestro / VPAY (%):",
        businessCardLabel: "Business Card (%):",
        purchaseOptionLabel: "Purchase or Rent:",
        rentOption: "Rent",
        buyOption: "Purchase",
        hardwareLabel: "Select Hardware:",
        rentalPeriodLabel: "Rental Period:",
        feesNoteHeading: "Note on Fees:",
        transactionFeeInfo: "Transaction Price: €0.06 per transaction",
        girocardFeeInfoBelow: "Girocard Fee up to €10,000 monthly: 0.39%",
        girocardFeeInfoAbove: "Girocard Fee over €10,000 monthly: 0.29%",
        maestroFeeInfo: "Maestro / VPAY Disagio: 0.89%",
        mastercardVisaFeeInfo: "Mastercard/VISA Consumer Disagio: 0.89%",
        businessCardFeeInfo: "Mastercard/VISA Business and Non-EU: 2.89%",
        payHeadline: "PAY Cost Calculation",
        posHeadline: "POS Cost Calculation",
        posHardwareLabel: "Hardware Components:",
        posMonthlyLicenses: "Monthly Licenses and Services:",
        toolsHeadline: "TOOLS Cost Calculation",
        toolsOptions: "DISH Solutions:",
        noResults: "No results available."
        // Weitere Übersetzungen können hier hinzugefügt werden...
    }
};

/* PAY-Rechner-Funktionen */
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const detailedFields = document.querySelectorAll('.detailed-field');

    if (calculationType === 'detailliert') {
        detailedFields.forEach(field => {
            field.style.display = 'block';
        });
    } else {
        detailedFields.forEach(field => {
            field.style.display = 'none';
        });
    }
}

function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');
    rentalOptions.style.display = (purchaseOption === "mieten") ? 'block' : 'none';
}

function updateRentalPrices() {
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const rentalPeriodSelect = document.getElementById('rentalPeriod');

    // Update Mietdauer Dropdown basierend auf ausgewählter Hardware
    if (selectedHardware.value === "MotoG14" || selectedHardware.value === "TapToPay") {
        rentalPeriodSelect.innerHTML = `
            <option value="12">12 Monate</option>
        `;
    } else {
        rentalPeriodSelect.innerHTML = `
            <option value="12">12 Monate</option>
            <option value="36">36 Monate</option>
            <option value="60">60 Monate</option>
        `;
    }
}

function updateHardwareCosts() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    const priceOnce = parseFloat(selectedHardware.getAttribute('data-price-once')) || 0;
    let monthlyCost = 0;

    if (purchaseOption === "mieten") {
        const rentalPeriod = document.getElementById('rentalPeriod').value;
        if (rentalPeriod === "12") {
            monthlyCost = parseFloat(selectedHardware.getAttribute('data-price-12')) || 0;
        } else if (rentalPeriod === "36") {
            monthlyCost = parseFloat(selectedHardware.getAttribute('data-price-36')) || 0;
        } else if (rentalPeriod === "60") {
            monthlyCost = parseFloat(selectedHardware.getAttribute('data-price-60')) || 0;
        }
    } else {
        monthlyCost = 0;  // Keine monatlichen Hardwarekosten bei Kauf
    }

    return { onceCost: priceOnce, monthlyCost };
}

function validatePercentages() {
    const girocard = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const maestro = parseFloat(document.getElementById('maestro').value) || 0;
    const businessCard = parseFloat(document.getElementById('businessCard').value) || 0;

    const totalPercentage = girocard + mastercardVisa + maestro + businessCard;

    if (totalPercentage !== 100) {
        alert("Die Summe der Prozentsätze muss genau 100% ergeben.");
        return false;
    }
    return true;
}

function calculatePay() {
    if (!validatePercentages()) {
        return;
    }

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

    const calculationType = document.getElementById('calculationType').value;
    const purchaseOption = document.getElementById('purchaseOption').value;
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseFloat(document.getElementById('transactions').value) || 0;

    const girocardFeePercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaFeePercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const maestroFeePercentage = parseFloat(document.getElementById('maestro').value) || 0;
    const businessCardFeePercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    const { onceCost, monthlyCost: hardwareMonthlyCost } = updateHardwareCosts();

    const girocardRevenue = monthlyVolume * (girocardFeePercentage / 100);
    const mastercardVisaRevenue = monthlyVolume * (mastercardVisaFeePercentage / 100);
    const maestroRevenue = monthlyVolume * (maestroFeePercentage / 100);
    const businessCardRevenue = monthlyVolume * (businessCardFeePercentage / 100);

    let girocardFeeRate = 0;
    if (girocardRevenue <= 10000) {
        girocardFeeRate = 0.0039; // 0,39%
    } else {
        girocardFeeRate = 0.0029; // 0,29%
    }

    const girocardFee = girocardRevenue * girocardFeeRate;
    const mastercardVisaFee = mastercardVisaRevenue * 0.0089;
    const maestroFee = maestroRevenue * 0.0089;
    const businessCardFee = businessCardRevenue * 0.0289;

    const totalDisagioFees = girocardFee + mastercardVisaFee + maestroFee + businessCardFee;
    const transactionFee = transactions * 0.06;

    let simServiceFee = 0;
    const hardwareSelectValue = document.getElementById('hardware').value;
    if (purchaseOption === "kaufen" && (hardwareSelectValue === "S1F2" || hardwareSelectValue === "V400C")) {
        simServiceFee = 3.90;
    }

    const totalMonthlyCostBeforeDiscount = totalDisagioFees + transactionFee + hardwareMonthlyCost + simServiceFee;

    // Rabatt einlesen
    const discountAmount = parseFloat(document.getElementById('payDiscountAmount').value) || 0;

    // Rabatt anwenden
    let totalMonthlyCost = totalMonthlyCostBeforeDiscount - discountAmount;
    if (totalMonthlyCost < 0) totalMonthlyCost = 0;

    let resultHtml = `
        <h3>${salutation} ${customerName}, ${translations[currentLanguage]['headline']}</h3>
        <div class="result-section">
            <p>${(totalDisagioFees + transactionFee).toFixed(2)} € - Disagio und Transaktionsgebühren</p>
            ${ (purchaseOption === "mieten") ? `<p>${hardwareMonthlyCost.toFixed(2)} € - Monatliche Hardwarekosten</p>` : '' }
            <p>${simServiceFee > 0 ? simServiceFee.toFixed(2) + ' € - SIM/Servicegebühr' : 'Keine SIM/Servicegebühr'}</p>
            <h4>Angewendete Rabatte:</h4>
            <ul>
                <li>Rabattbetrag: -${discountAmount.toFixed(2)} €</li>
            </ul>
            <p><b>${totalMonthlyCost.toFixed(2)} € - Gesamte monatliche Kosten</b></p>
            ${(purchaseOption === "kaufen") ? `<p>${onceCost.toFixed(2)} € - Einmalige Kosten (bei Kauf)</p>` : ''}
        </div>
    `;

    const resultArea = document.getElementById('result');
    resultArea.innerHTML = resultHtml;
}

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
            setupService: 599.00,
            mobileDevice: 220.00,
            epsonPrinter: 229.00,
            chargingStation: 79.00,
            accessPoint: 189.00,
            routerER605: 55.00,
            switchLite: 107.00
        },
        optionalAccessories: {
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
        setupService: parseInt(document.getElementById('setupService').value) || 0,
        mobileDevice: parseInt(document.getElementById('mobileDevice').value) || 0,
        epsonPrinter: parseInt(document.getElementById('epsonPrinter').value) || 0,
        chargingStation: parseInt(document.getElementById('chargingStation').value) || 0,
        accessPoint: parseInt(document.getElementById('accessPoint').value) || 0,
        routerER605: parseInt(document.getElementById('routerER605').value) || 0,
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

    // Rabatte einlesen
    const discountAmount = parseFloat(document.getElementById('posDiscountAmount').value) || 0;
    const freeMonths = parseInt(document.getElementById('posFreeMonths').value) || 0;

    // Berechnungen durchführen
    let totalHardwareCost = 0;
    for (let item in quantities) {
        if (prices.hardware[item] !== undefined) {
            totalHardwareCost += quantities[item] * prices.hardware[item];
        } else if (prices.optionalAccessories[item] !== undefined) {
            totalHardwareCost += quantities[item] * prices.optionalAccessories[item];
        }
    }

    let totalMonthlyCost = 0;
    for (let license in licenses) {
        if (licenses[license]) {
            totalMonthlyCost += prices.licenses[license];
        }
    }

    // Rabatt anwenden
    totalHardwareCost -= discountAmount;
    if (totalHardwareCost < 0) totalHardwareCost = 0;

    if (freeMonths > 0) {
        totalMonthlyCost = totalMonthlyCost * ((12 - freeMonths) / 12);
    }

    // MwSt berechnen
    const mwstRate = 0.19;
    const totalHardwareMwst = totalHardwareCost * mwstRate;
    const totalMonthlyMwst = totalMonthlyCost * mwstRate;

    const totalHardwareBrutto = totalHardwareCost + totalHardwareMwst;
    const totalMonthlyBrutto = totalMonthlyCost + totalMonthlyMwst;

    // Ergebnis anzeigen
    let resultHtml = `
        <h3>${salutation} ${customerName}, ${translations[currentLanguage]['headline']}</h3>
        <div class="result-section">
            <p>${totalHardwareCost.toFixed(2)} € - Gesamtkosten Hardware (Netto)</p>
            <p>${totalHardwareBrutto.toFixed(2)} € - Gesamtkosten Hardware (Brutto)</p>
            <p>${totalMonthlyCost.toFixed(2)} € - Monatliche Kosten Lizenzen (Netto)</p>
            <p>${totalMonthlyBrutto.toFixed(2)} € - Monatliche Kosten Lizenzen (Brutto)</p>
            <h4>Angewendete Rabatte:</h4>
            <ul>
                <li>Rabattbetrag: -${discountAmount.toFixed(2)} €</li>
                <li>Anzahl kostenlose Monate: ${freeMonths}</li>
            </ul>
        </div>
    `;

    const resultArea = document.getElementById('posResult');
    resultArea.innerHTML = resultHtml;
}

/* TOOLS-Rechner-Funktionen */
function toggleDishReservationDuration() {
    const dishReservation = document.getElementById('dishReservation').checked;
    const dishReservationDuration = document.getElementById('dishReservationDuration');
    dishReservationDuration.disabled = !dishReservation;
}

function toggleDishOrderDuration() {
    const dishOrder = document.getElementById('dishOrder').checked;
    const dishOrderDuration = document.getElementById('dishOrderDuration');
    dishOrderDuration.disabled = !dishOrder;
}

function toggleDishPremiumDuration() {
    const dishPremium = document.getElementById('dishPremium').checked;
    const dishPremiumDuration = document.getElementById('dishPremiumDuration');
    dishPremiumDuration.disabled = !dishPremium;
}

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

    // Rabatte einlesen
    const discountAmount = parseFloat(document.getElementById('toolsDiscountAmount').value) || 0;
    const freeMonths = parseInt(document.getElementById('toolsFreeMonths').value) || 0;

    // Berechnungen durchführen
    let totalMonthlyCost = 0;
    let totalActivationCost = 0;

    if (selections.dishStarter) {
        totalMonthlyCost += prices.dishStarter.monthly;
        totalActivationCost += prices.dishStarter.activation;
    }

    if (selections.dishReservation) {
        totalActivationCost += prices.dishReservation.activation;
        const contractDuration = parseInt(durations.dishReservation);
        if (contractDuration === 36) {
            totalMonthlyCost += prices.dishReservation.monthly36;
        } else if (contractDuration === 12) {
            totalMonthlyCost += prices.dishReservation.monthly12;
        } else if (contractDuration === 3) {
            totalMonthlyCost += prices.dishReservation.monthly3;
        }
    }

    if (selections.dishOrder) {
        totalActivationCost += prices.dishOrder.activation;
        const contractDuration = parseInt(durations.dishOrder);
        if (contractDuration === 12) {
            totalMonthlyCost += prices.dishOrder.monthly12;
        } else if (contractDuration === 3) {
            totalMonthlyCost += prices.dishOrder.monthly3;
        }
    }

    if (selections.dishPremium) {
        totalActivationCost += prices.dishPremium.activation;
        const contractDuration = parseInt(durations.dishPremium);
        if (contractDuration === 12) {
            totalMonthlyCost += prices.dishPremium.monthly12;
        } else if (contractDuration === 3) {
            totalMonthlyCost += prices.dishPremium.monthly3;
        }
    }

    // Rabatt anwenden
    totalActivationCost -= discountAmount;
    if (totalActivationCost < 0) totalActivationCost = 0;

    if (freeMonths > 0) {
        totalMonthlyCost = totalMonthlyCost * ((12 - freeMonths) / 12);
    }

    // MwSt berechnen
    const mwstRate = 0.19;
    const totalMonthlyMwst = totalMonthlyCost * mwstRate;
    const totalActivationMwst = totalActivationCost * mwstRate;

    const totalMonthlyBrutto = totalMonthlyCost + totalMonthlyMwst;
    const totalActivationBrutto = totalActivationCost + totalActivationMwst;

    // Ergebnis anzeigen
    let resultHtml = `
        <h3>${salutation} ${customerName}, ${translations[currentLanguage]['headline']}</h3>
        <div class="result-section">
            <h4>Angewendete Rabatte:</h4>
            <ul>
                <li>Rabattbetrag: -${discountAmount.toFixed(2)} €</li>
                <li>Anzahl kostenlose Monate: ${freeMonths}</li>
            </ul>
            <p>Monatliche Kosten (Netto): ${totalMonthlyCost.toFixed(2)} €</p>
            <p>Monatliche Kosten (Brutto): ${totalMonthlyBrutto.toFixed(2)} €</p>
            <p>Aktivierungskosten (Netto): ${totalActivationCost.toFixed(2)} €</p>
            <p>Aktivierungskosten (Brutto): ${totalActivationBrutto.toFixed(2)} €</p>
        </div>
    `;

    const resultArea = document.getElementById('toolsResult');
    resultArea.innerHTML = resultHtml;
}

/* Modal-Funktionen */
function showEmailContent(calculatorType) {
    const emailContentContainer = document.getElementById('emailContentContainer');
    const emailContent = document.getElementById('emailContent');

    let content = '';

    if (calculatorType === 'pay') {
        content = document.getElementById('result').innerHTML;
    } else if (calculatorType === 'pos') {
        content = document.getElementById('posResult').innerHTML;
    } else if (calculatorType === 'tools') {
        content = document.getElementById('toolsResult').innerHTML;
    }

    emailContent.innerHTML = content;
    emailContentContainer.classList.remove('hidden');
}

function closeEmailContent() {
    const emailContentContainer = document.getElementById('emailContentContainer');
    emailContentContainer.classList.add('hidden');
}
