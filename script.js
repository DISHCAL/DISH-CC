// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Initiale Einstellungen für PAY-Rechner
    toggleCalculationFields();
    toggleRentalOptions();
    updateRentalPrices();
    openTab(null, 'pay'); // Standardmäßig PAY-Rechner öffnen

    // Initiale Einstellungen für TOOLS-Rechner
    toggleDishReservationDuration();
    toggleDishOrderDuration();
    toggleDishPremiumDuration();
});

/* Allgemeine Tab-Funktion */
function openTab(evt, tabName) {
    // Verstecke alle Tab-Inhalte
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.remove('active');
        content.classList.add('hidden');
    }

    // Entferne die aktive Klasse von allen Tabs
    const tabLinks = document.getElementsByClassName('tab-link');
    for (let tab of tabLinks) {
        tab.classList.remove('active');
    }

    // Zeige den ausgewählten Tab-Inhalt
    const activeTab = document.getElementById(tabName);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.classList.remove('hidden');
    }

    // Füge die aktive Klasse zum geklickten Tab hinzu
    if (evt) {
        evt.currentTarget.classList.add('active');
    }
}

/* PAY Rechner Funktionen */

/* Funktion zum Umschalten der Berechnungsfelder (schnell/ausführlich) */
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const maestroField = document.getElementById('maestroField');
    const businessCardField = document.getElementById('businessCardField');
    const competitorSection = document.getElementById('competitorSection');

    if (calculationType === 'schnell') {
        maestroField.classList.add('hidden');
        businessCardField.classList.add('hidden');
        competitorSection.classList.add('hidden');
    } else {
        maestroField.classList.remove('hidden');
        businessCardField.classList.remove('hidden');
        competitorSection.classList.remove('hidden');
    }
}

/* Funktion zum Umschalten der Mietoptionen im PAY-Rechner */
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');

    if (purchaseOption === "mieten") {
        rentalOptions.style.display = 'block';
    } else {
        rentalOptions.style.display = 'none';
    }
}

/* Funktion zum Aktualisieren der Mietpreise basierend auf ausgewählter Hardware und Mietdauer */
function updateRentalPrices() {
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const rentalPeriodSelect = document.getElementById('rentalPeriod');

    // Aktualisieren der Mietdauer-Texte
    const rentalPeriod = rentalPeriodSelect.value;
    rentalPeriodSelect.options[0].text = `12 Monate - ${selectedHardware.getAttribute('data-price-12')} €/Monat`;
    rentalPeriodSelect.options[1].text = `36 Monate - ${selectedHardware.getAttribute('data-price-36')} €/Monat`;
    rentalPeriodSelect.options[2].text = `60 Monate - ${selectedHardware.getAttribute('data-price-60')} €/Monat`;
}

/* Funktion zur Aktualisierung der Hardware-Kosten */
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

/* Funktion zur Validierung der Prozentwerte im PAY-Rechner */
function validatePayPercentages() {
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

/* Funktion zur Berechnung der PAY-Kosten */
function calculatePayCosts() {
    if (!validatePayPercentages()) {
        return;
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

    const girocardFee = monthlyVolume > 10000 ? girocardRevenue * 0.0029 : girocardRevenue * 0.0039;
    const mastercardVisaFee = mastercardVisaRevenue * 0.0089;
    const maestroFee = maestroRevenue * 0.0089;
    const businessCardFee = businessCardRevenue * 0.0289;

    const totalDisagioFees = girocardFee + mastercardVisaFee + maestroFee + businessCardFee;
    const transactionFee = transactions * 0.06;

    let simServiceFee = 0;
    const hardwareSelect = document.getElementById('hardware').value;
    if (purchaseOption === "kaufen" && (hardwareSelect === "S1F2" || hardwareSelect === "V400C")) {
        simServiceFee = 3.90;
    }

    const totalMonthlyCost = totalDisagioFees + transactionFee + hardwareMonthlyCost + simServiceFee;

    // Einmalige Kosten
    const oneTimeCost = purchaseOption === "kaufen" ? onceCost : 0;

    // Mehrwertsteuerberechnung
    const oneTimeMwSt = oneTimeCost * 0.19;
    const oneTimeBrutto = oneTimeCost + oneTimeMwSt;

    const totalNetto = totalMonthlyCost;
    const totalMwSt = totalNetto * 0.19;
    const totalBrutto = totalNetto + totalMwSt;

    // Ergebnisse anzeigen
    document.getElementById('payOneTimeCostNetto').innerText = oneTimeCost.toFixed(2);
    document.getElementById('payOneTimeCostMwSt').innerText = oneTimeMwSt.toFixed(2);
    document.getElementById('payOneTimeCostBrutto').innerText = oneTimeBrutto.toFixed(2);
    document.getElementById('payTotalNetto').innerText = totalNetto.toFixed(2);
    document.getElementById('payTotalMwSt').innerText = totalMwSt.toFixed(2);
    document.getElementById('payTotalBrutto').innerText = totalBrutto.toFixed(2);

    // Ergebnisbereich anzeigen
    const payResult = document.getElementById('payResult');
    payResult.classList.remove('hidden');
}

/* Funktion zur Erstellung und Anzeige der E-Mail */
function sendEmail(calculatorType) {
    const customerName = document.getElementById('customerName').value.trim();
    const salutation = document.getElementById('salutation').value;

    if (customerName === "") {
        alert("Bitte geben Sie Ihren Namen ein.");
        return;
    }

    let emailContent = `**Sehr gee${salutation === 'Herr' ? 'r Herr' : 'e Frau'} ${customerName},**\n\n`;
    emailContent += `vielen Dank für Ihr Interesse an unserem DISH Produkt ${calculatorType}. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.\n\n`;

    if (calculatorType === 'PAY') {
        emailContent += `### Einmalige Kosten\n\n`;
        emailContent += `| Produkt / Service | Menge | Preis pro Stück (€) | Gesamtkosten (€) |\n`;
        emailContent += `|-------------------|-------|---------------------|------------------|\n`;
        emailContent += `| Hardware Kauf     | ${document.getElementById('hardware').value === "mieten" ? '0' : '1'} | ${document.getElementById('hardware').value === "mieten" ? '0.00' : document.getElementById('hardware').options[document.getElementById('hardware').selectedIndex].getAttribute('data-price-once')} | ${document.getElementById('payOneTimeCostNetto').innerText} |\n`;
        emailContent += `|-------------------|-------|---------------------|------------------|\n`;
        emailContent += `| **Gesamt einmalige Kosten** | | | **${document.getElementById('payOneTimeCostNetto').innerText}** |\n\n`;

        emailContent += `### Monatliche Kosten\n\n`;
        emailContent += `| Lizenz / Service | Menge | Preis pro Stück (€) | Gesamtkosten (€) |\n`;
        emailContent += `|------------------|-------|---------------------|------------------|\n`;
        emailContent += `| Transaktionsgebühr | ${document.getElementById('transactions').value} | 0.06 | ${ (parseFloat(document.getElementById('transactions').value) * 0.06).toFixed(2) } |\n`;
        emailContent += `| Disagio Gebühren | 1 | - | ${document.getElementById('payTotalNetto').innerText} |\n`;
        emailContent += `| SIM/Servicegebühr | ${hardwareSelect === "S1F2" || hardwareSelect === "V400C" ? '1' : '0'} | ${simServiceFee.toFixed(2)} | ${simServiceFee.toFixed(2)} |\n`;
        emailContent += `|------------------|-------|---------------------|------------------|\n`;
        emailContent += `| **Gesamte monatliche Kosten** | | | **${document.getElementById('payTotalBrutto').innerText}** |\n\n`;

        emailContent += `### Zusammenfassung\n`;
        emailContent += `- **Einmalige Kosten:** ${document.getElementById('payOneTimeCostBrutto').innerText} €\n`;
        emailContent += `- **Monatliche Kosten:** ${document.getElementById('payTotalBrutto').innerText} €\n\n`;
    }

    // Hier können ähnliche Blöcke für POS und TOOLS hinzugefügt werden

    emailContent += `---\n\n`;
    emailContent += `**Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unserem Kassensystem DISH POS einen echten Mehrwert bieten zu dürfen.**\n\n`;
    emailContent += `**Mit freundlichen Grüßen,\nIhr DISH Team**`;

    // Inhalt in das Modal einfügen und anzeigen
    document.getElementById('emailContent').innerText = emailContent;
    const modal = document.getElementById('emailContentContainer');
    modal.classList.remove('hidden');
}

/* Funktion zum Schließen des Modals */
function closeEmailContent() {
    const modal = document.getElementById('emailContentContainer');
    modal.classList.add('hidden');
}

/* POS Rechner Funktionen */

/* Funktion zur Validierung der POS-Prozentwerte (optional, falls benötigt) */
/* Kann ähnlich wie PAY-Validierung implementiert werden */

/* Funktion zur Berechnung der POS-Kosten */
function calculatePosCosts() {
    // Beispielhafte Berechnung - muss an die tatsächlichen Anforderungen angepasst werden
    // Hier solltest du die Berechnungen basierend auf den eingegebenen Werten durchführen

    // Einmalige Kosten
    const screenSunmi = parseFloat(document.getElementById('screenSunmi').value) || 0;
    const tseHardware = parseFloat(document.getElementById('tseHardware').value) || 0;
    const menuService = parseFloat(document.getElementById('menuService').value) || 0;
    const setupService = parseFloat(document.getElementById('setupService').value) || 0;
    const mobileDevice = parseFloat(document.getElementById('mobileDevice').value) || 0;
    const epsonPrinter = parseFloat(document.getElementById('epsonPrinter').value) || 0;
    const chargingStation = parseFloat(document.getElementById('chargingStation').value) || 0;
    const accessPoint = parseFloat(document.getElementById('accessPoint').value) || 0;
    const routerER605 = parseFloat(document.getElementById('routerER605').value) || 0;
    const switchLite = parseFloat(document.getElementById('switchLite').value) || 0;
    const cashDrawer = parseFloat(document.getElementById('cashDrawer').value) || 0;
    const qrOrdering = parseFloat(document.getElementById('qrOrdering').value) || 0;
    const dishAggregator = parseFloat(document.getElementById('dishAggregator').value) || 0;

    const totalOneTimeNetto = screenSunmi + tseHardware + menuService + setupService + mobileDevice + epsonPrinter + chargingStation + accessPoint + routerER605 + switchLite + cashDrawer + qrOrdering + dishAggregator;
    const oneTimeMwSt = totalOneTimeNetto * 0.19;
    const oneTimeBrutto = totalOneTimeNetto + oneTimeMwSt;

    // Monatliche Kosten
    const mainLicense = document.getElementById('mainLicense').checked ? 69.00 : 0;
    const datevApi = document.getElementById('datevApi').checked ? 25.00 : 0;
    const voucherFunction = document.getElementById('voucherFunction').checked ? 10.00 : 0;
    const tapToPayLicense = document.getElementById('tapToPayLicense').checked ? 7.50 : 0;

    const handDeviceLicense = parseInt(document.getElementById('handDeviceLicense').value) || 0;
    const handDeviceLicenseCost = handDeviceLicense * 10.00; // Beispielpreis pro Lizenz

    const totalMonthlyNetto = mainLicense + datevApi + voucherFunction + tapToPayLicense + handDeviceLicenseCost;
    const monthlyMwSt = totalMonthlyNetto * 0.19;
    const monthlyBrutto = totalMonthlyNetto + monthlyMwSt;

    // Rabatt
    const posDiscountAmount = parseFloat(document.getElementById('posDiscountAmount').value) || 0;
    const posFreeMonths = parseInt(document.getElementById('posFreeMonths').value) || 0;

    const discountedOneTimeBrutto = oneTimeBrutto - posDiscountAmount;
    const discountedMonthlyBrutto = monthlyBrutto - posDiscountAmount; // Anpassung je nach Rabattlogik

    // Ergebnisse anzeigen
    document.getElementById('posOneTimeCostNetto').innerText = totalOneTimeNetto.toFixed(2);
    document.getElementById('posOneTimeCostMwSt').innerText = oneTimeMwSt.toFixed(2);
    document.getElementById('posOneTimeCostBrutto').innerText = oneTimeBrutto.toFixed(2);
    document.getElementById('posTotalNetto').innerText = totalMonthlyNetto.toFixed(2);
    document.getElementById('posTotalMwSt').innerText = monthlyMwSt.toFixed(2);
    document.getElementById('posTotalBrutto').innerText = monthlyBrutto.toFixed(2);

    // Ergebnisbereich anzeigen
    const posResult = document.getElementById('posResult');
    posResult.classList.remove('hidden');
}

/* TOOLS Rechner Funktionen */

/* Funktionen zum Umschalten der Vertragslaufzeiten */
function toggleDishReservationDuration() {
    const dishReservation = document.getElementById('dishReservation');
    const durationSelect = document.getElementById('dishReservationDuration');
    durationSelect.disabled = !dishReservation.checked;
}

function toggleDishOrderDuration() {
    const dishOrder = document.getElementById('dishOrder');
    const durationSelect = document.getElementById('dishOrderDuration');
    durationSelect.disabled = !dishOrder.checked;
}

function toggleDishPremiumDuration() {
    const dishPremium = document.getElementById('dishPremium');
    const durationSelect = document.getElementById('dishPremiumDuration');
    durationSelect.disabled = !dishPremium.checked;
}

/* Funktion zur Berechnung der TOOLS-Kosten */
function calculateToolsCosts() {
    // Beispielhafte Berechnung - muss an die tatsächlichen Anforderungen angepasst werden
    // Hier solltest du die Berechnungen basierend auf den eingegebenen Werten durchführen

    // Einmalige Kosten
    let oneTimeCostNetto = 0;
    let oneTimeCostMwSt = 0;
    let oneTimeCostBrutto = 0;

    // Monatliche Kosten
    let monthlyCostNetto = 0;
    let monthlyCostMwSt = 0;
    let monthlyCostBrutto = 0;

    // DISH STARTER
    if (document.getElementById('dishStarter').checked) {
        oneTimeCostNetto += 69.00;
        monthlyCostNetto += 10.00;
    }

    // DISH RESERVATION
    if (document.getElementById('dishReservation').checked) {
        const duration = document.getElementById('dishReservationDuration').value;
        const activationFee = parseFloat(document.getElementById('dishReservationDuration').selectedOptions[0].getAttribute('data-activation-fee')) || 0;
        let monthly = 0;
        if (duration === "36") {
            monthly = 34.90;
        } else if (duration === "12") {
            monthly = 44.00;
        } else if (duration === "3") {
            monthly = 49.00;
        }
        oneTimeCostNetto += activationFee;
        monthlyCostNetto += monthly;
    }

    // DISH ORDER
    if (document.getElementById('dishOrder').checked) {
        const duration = document.getElementById('dishOrderDuration').value;
        const activationFee = parseFloat(document.getElementById('dishOrderDuration').selectedOptions[0].getAttribute('data-activation-fee')) || 0;
        let monthly = 0;
        if (duration === "12") {
            monthly = 49.90;
        } else if (duration === "3") {
            monthly = 59.90;
        }
        oneTimeCostNetto += activationFee;
        monthlyCostNetto += monthly;
    }

    // DISH PREMIUM
    if (document.getElementById('dishPremium').checked) {
        const duration = document.getElementById('dishPremiumDuration').value;
        const activationFee = parseFloat(document.getElementById('dishPremiumDuration').selectedOptions[0].getAttribute('data-activation-fee')) || 0;
        let monthly = 0;
        if (duration === "12") {
            monthly = 69.90;
        } else if (duration === "3") {
            monthly = 79.90;
        }
        oneTimeCostNetto += activationFee;
        monthlyCostNetto += monthly;
    }

    // Rabatt
    const toolsDiscountAmount = parseFloat(document.getElementById('toolsDiscountAmount').value) || 0;
    const toolsFreeMonths = parseInt(document.getElementById('toolsFreeMonths').value) || 0;

    // Mehrwertsteuerberechnung
    oneTimeCostMwSt = oneTimeCostNetto * 0.19;
    oneTimeCostBrutto = oneTimeCostNetto + oneTimeCostMwSt;

    monthlyCostMwSt = monthlyCostNetto * 0.19;
    monthlyCostBrutto = monthlyCostNetto + monthlyCostMwSt;

    // Rabatt anwenden
    oneTimeCostBrutto -= toolsDiscountAmount;
    monthlyCostBrutto -= toolsDiscountAmount; // Anpassung je nach Rabattlogik

    // Ergebnisse anzeigen
    document.getElementById('toolsOneTimeCostNetto').innerText = oneTimeCostNetto.toFixed(2);
    document.getElementById('toolsOneTimeCostMwSt').innerText = oneTimeCostMwSt.toFixed(2);
    document.getElementById('toolsOneTimeCostBrutto').innerText = oneTimeCostBrutto.toFixed(2);
    document.getElementById('toolsTotalNetto').innerText = monthlyCostNetto.toFixed(2);
    document.getElementById('toolsTotalMwSt').innerText = monthlyCostMwSt.toFixed(2);
    document.getElementById('toolsTotalBrutto').innerText = monthlyCostBrutto.toFixed(2);

    // Ergebnisbereich anzeigen
    const toolsResult = document.getElementById('toolsResult');
    toolsResult.classList.remove('hidden');
}

/* Funktionen für das TOOLS-Rechner Dropdown */

/* Funktion zum Umschalten der Vertragslaufzeiten für TOOLS */
function toggleDishReservationDuration() {
    const dishReservation = document.getElementById('dishReservation');
    const durationSelect = document.getElementById('dishReservationDuration');
    durationSelect.disabled = !dishReservation.checked;
}

function toggleDishOrderDuration() {
    const dishOrder = document.getElementById('dishOrder');
    const durationSelect = document.getElementById('dishOrderDuration');
    durationSelect.disabled = !dishOrder.checked;
}

function toggleDishPremiumDuration() {
    const dishPremium = document.getElementById('dishPremium');
    const durationSelect = document.getElementById('dishPremiumDuration');
    durationSelect.disabled = !dishPremium.checked;
}

/* Funktion zum Erstellen und Anzeigen des Angebots per E-Mail */
function sendEmail(calculatorType) {
    const customerName = document.getElementById('customerName').value.trim();
    const salutation = document.getElementById('salutation').value;

    if (customerName === "") {
        alert("Bitte geben Sie Ihren Namen ein.");
        return;
    }

    let emailContent = `**Sehr geehr${salutation === 'Herr' ? 'er Herr' : 'e Frau'} ${customerName},**\n\n`;
    emailContent += `vielen Dank für Ihr Interesse an unserem DISH Produkt ${calculatorType}. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.\n\n`;

    if (calculatorType === 'PAY') {
        emailContent += `### Einmalige Kosten\n\n`;
        emailContent += `| Produkt / Service | Menge | Preis pro Stück (€) | Gesamtkosten (€) |\n`;
        emailContent += `|-------------------|-------|---------------------|------------------|\n`;
        const hardwareValue = document.getElementById('hardware').value;
        const hardwarePriceOnce = document.getElementById('hardware').selectedOptions[0].getAttribute('data-price-once');
        const hardwareKauf = hardwareValue !== "mieten" ? 1 : 0;
        emailContent += `| Hardware Kauf     | ${hardwareKauf} | ${hardwarePriceOnce} | ${document.getElementById('payOneTimeCostNetto').innerText} |\n`;
        emailContent += `|-------------------|-------|---------------------|------------------|\n`;
        emailContent += `| **Gesamt einmalige Kosten** | | | **${document.getElementById('payOneTimeCostBrutto').innerText}** |\n\n`;

        emailContent += `### Monatliche Kosten\n\n`;
        emailContent += `| Lizenz / Service | Menge | Preis pro Stück (€) | Gesamtkosten (€) |\n`;
        emailContent += `|------------------|-------|---------------------|------------------|\n`;
        emailContent += `| Transaktionsgebühr | ${document.getElementById('transactions').value} | 0.06 | ${(parseFloat(document.getElementById('transactions').value) * 0.06).toFixed(2)} |\n`;
        emailContent += `| Disagio Gebühren | 1 | - | ${document.getElementById('payTotalNetto').innerText} |\n`;
        const simServiceFee = document.getElementById('hardware').value === "S1F2" || document.getElementById('hardware').value === "V400C" ? 3.90 : 0;
        emailContent += `| SIM/Servicegebühr | ${simServiceFee > 0 ? '1' : '0'} | ${simServiceFee.toFixed(2)} | ${simServiceFee.toFixed(2)} |\n`;
        emailContent += `|------------------|-------|---------------------|------------------|\n`;
        emailContent += `| **Gesamte monatliche Kosten** | | | **${document.getElementById('payTotalBrutto').innerText}** |\n\n`;

        emailContent += `### Zusammenfassung\n`;
        emailContent += `- **Einmalige Kosten:** ${document.getElementById('payOneTimeCostBrutto').innerText} €\n`;
        emailContent += `- **Monatliche Kosten:** ${document.getElementById('payTotalBrutto').innerText} €\n\n`;
    }

    if (calculatorType === 'POS') {
        emailContent += `### Einmalige Kosten\n\n`;
        emailContent += `| Produkt / Service | Menge | Preis pro Stück (€) | Gesamtkosten (€) |\n`;
        emailContent += `|-------------------|-------|---------------------|------------------|\n`;

        const posOneTimeNetto = parseFloat(document.getElementById('posOneTimeCostNetto').innerText) || 0;
        emailContent += `| Gesamte Einmalige Kosten Netto | - | - | ${posOneTimeNetto.toFixed(2)} |\n`;
        emailContent += `| Mehrwertsteuer (19%) | - | - | ${document.getElementById('posOneTimeCostMwSt').innerText} |\n`;
        emailContent += `| **Gesamtbetrag** | - | - | **${document.getElementById('posOneTimeCostBrutto').innerText}** |\n\n`;

        emailContent += `### Monatliche Kosten\n\n`;
        emailContent += `| Lizenz / Service | Menge | Preis pro Stück (€) | Gesamtkosten (€) |\n`;
        emailContent += `|------------------|-------|---------------------|------------------|\n`;

        const posTotalNetto = parseFloat(document.getElementById('posTotalNetto').innerText) || 0;
        emailContent += `| Gesamte Monatliche Kosten Netto | - | - | ${posTotalNetto.toFixed(2)} |\n`;
        emailContent += `| Mehrwertsteuer (19%) | - | - | ${document.getElementById('posTotalMwSt').innerText} |\n`;
        emailContent += `| **Gesamtbetrag** | - | - | **${document.getElementById('posTotalBrutto').innerText}** |\n\n`;

        emailContent += `### Zusammenfassung\n`;
        emailContent += `- **Einmalige Kosten:** ${document.getElementById('posOneTimeCostBrutto').innerText} €\n`;
        emailContent += `- **Monatliche Kosten:** ${document.getElementById('posTotalBrutto').innerText} €\n\n`;
    }

    if (calculatorType === 'TOOLS') {
        emailContent += `### Einmalige Kosten\n\n`;
        emailContent += `| Produkt / Service | Menge | Preis pro Stück (€) | Gesamtkosten (€) |\n`;
        emailContent += `|-------------------|-------|---------------------|------------------|\n`;

        const toolsOneTimeNetto = parseFloat(document.getElementById('toolsOneTimeCostNetto').innerText) || 0;
        emailContent += `| Gesamte Einmalige Kosten Netto | - | - | ${toolsOneTimeNetto.toFixed(2)} |\n`;
        emailContent += `| Mehrwertsteuer (19%) | - | - | ${document.getElementById('toolsOneTimeCostMwSt').innerText} |\n`;
        emailContent += `| **Gesamtbetrag** | - | - | **${document.getElementById('toolsOneTimeCostBrutto').innerText}** |\n\n`;

        emailContent += `### Monatliche Kosten\n\n`;
        emailContent += `| Lizenz / Service | Menge | Preis pro Stück (€) | Gesamtkosten (€) |\n`;
        emailContent += `|------------------|-------|---------------------|------------------|\n`;

        const toolsTotalNetto = parseFloat(document.getElementById('toolsTotalNetto').innerText) || 0;
        emailContent += `| Gesamte Monatliche Kosten Netto | - | - | ${toolsTotalNetto.toFixed(2)} |\n`;
        emailContent += `| Mehrwertsteuer (19%) | - | - | ${document.getElementById('toolsTotalMwSt').innerText} |\n`;
        emailContent += `| **Gesamtbetrag** | - | - | **${document.getElementById('toolsTotalBrutto').innerText}** |\n\n`;

        emailContent += `### Zusammenfassung\n`;
        emailContent += `- **Einmalige Kosten:** ${document.getElementById('toolsOneTimeCostBrutto').innerText} €\n`;
        emailContent += `- **Monatliche Kosten:** ${document.getElementById('toolsTotalBrutto').innerText} €\n\n`;
    }

    emailContent += `---\n\n`;
    emailContent += `**Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unserem Kassensystem DISH POS einen echten Mehrwert bieten zu dürfen.**\n\n`;
    emailContent += `**Mit freundlichen Grüßen,\nIhr DISH Team**`;

    // Inhalt in das Modal einfügen und anzeigen
    document.getElementById('emailContent').innerText = emailContent;
    const modal = document.getElementById('emailContentContainer');
    modal.classList.remove('hidden');
}

/* Funktion zum Schließen des Modals */
function closeEmailContent() {
    const modal = document.getElementById('emailContentContainer');
    modal.classList.add('hidden');
}
