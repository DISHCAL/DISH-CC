// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Initial setup for PAY calculator
    toggleCalculationFields();
    toggleRentalOptions();
    updateRentalPrices();
    openTab(null, 'pay'); // Open PAY tab by default

    // Initial setup for TOOLS calculator
    toggleDishReservationDuration();
    toggleDishOrderDuration();
    toggleDishPremiumDuration();
});

/* Function to open the selected tab */
function openTab(evt, tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.add('hidden');
        content.classList.remove('active');
    }

    // Remove 'active' class from all tab links
    const tabLinks = document.getElementsByClassName('tab-link');
    for (let tab of tabLinks) {
        tab.classList.remove('active');
    }

    // Show the selected tab content
    const activeTab = document.getElementById(tabName);
    if (activeTab) {
        activeTab.classList.remove('hidden');
        activeTab.classList.add('active');
    }

    // Add 'active' class to the clicked tab link
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
    }
}

/* PAY Calculator Functions */

/* Toggle additional fields based on calculation type */
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

/* Toggle rental options based on purchase or rent */
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');

    if (purchaseOption === "mieten") {
        rentalOptions.classList.remove('hidden');
    } else {
        rentalOptions.classList.add('hidden');
    }
}

/* Update rental prices based on selected hardware and rental period */
function updateRentalPrices() {
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const rentalPeriodSelect = document.getElementById('rentalPeriod');

    const rentalPeriod = rentalPeriodSelect.value;
    const price12 = selectedHardware.getAttribute('data-price-12');
    const price36 = selectedHardware.getAttribute('data-price-36');
    const price60 = selectedHardware.getAttribute('data-price-60');

    // Update options with current prices
    rentalPeriodSelect.options[0].text = `12 Monate - ${price12} €/Monat`;
    rentalPeriodSelect.options[1].text = `36 Monate - ${price36} €/Monat`;
    rentalPeriodSelect.options[2].text = `60 Monate - ${price60} €/Monat`;
}

/* Update hardware costs based on purchase or rent */
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
        monthlyCost = 0;  // No monthly cost when purchasing
    }

    return { onceCost: priceOnce, monthlyCost };
}

/* Validate percentage inputs */
function validatePayPercentages() {
    const calculationType = document.getElementById('calculationType').value;
    const girocard = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const maestro = parseFloat(document.getElementById('maestro').value) || 0;
    const businessCard = parseFloat(document.getElementById('businessCard').value) || 0;

    let totalPercentage = girocard + mastercardVisa;
    if (calculationType === 'ausführlich') {
        totalPercentage += maestro + businessCard;
    }

    if (totalPercentage !== 100) {
        alert("Die Summe der Prozentsätze muss genau 100% ergeben.");
        return false;
    }
    return true;
}

/* Calculate PAY costs */
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

    const competitorGirocardFeePercentage = parseFloat(document.getElementById('competitorGirocardFee').value) || 0;
    const competitorMastercardVisaFeePercentage = parseFloat(document.getElementById('competitorMastercardVisaFee').value) || 0;
    const competitorMaestroFeePercentage = parseFloat(document.getElementById('competitorMaestroFee').value) || 0;
    const competitorBusinessCardFeePercentage = parseFloat(document.getElementById('competitorBusinessCardFee').value) || 0;

    const { onceCost, monthlyCost: hardwareMonthlyCost } = updateHardwareCosts();

    // Our fees
    const girocardRevenue = monthlyVolume * (girocardFeePercentage / 100);
    const mastercardVisaRevenue = monthlyVolume * (mastercardVisaFeePercentage / 100);
    const maestroRevenue = calculationType === 'ausführlich' ? (monthlyVolume * (maestroFeePercentage / 100)) : 0;
    const businessCardRevenue = calculationType === 'ausführlich' ? (monthlyVolume * (businessCardFeePercentage / 100)) : 0;

    let girocardFee;
    if (monthlyVolume > 10000) {
        girocardFee = girocardRevenue * 0.0029;
    } else {
        girocardFee = girocardRevenue * 0.0039;
    }
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

    // One-time costs
    const oneTimeCost = purchaseOption === "kaufen" ? onceCost : 0;

    // VAT calculations
    const oneTimeMwSt = oneTimeCost * 0.19;
    const oneTimeBrutto = oneTimeCost + oneTimeMwSt;

    const totalNetto = totalMonthlyCost;
    const totalMwSt = totalNetto * 0.19;
    const totalBrutto = totalNetto + totalMwSt;

    // Competitor fees
    const competitorGirocardFee = monthlyVolume * (competitorGirocardFeePercentage / 100);
    const competitorMastercardVisaFee = monthlyVolume * (competitorMastercardVisaFeePercentage / 100);
    const competitorMaestroFee = calculationType === 'ausführlich' ? (monthlyVolume * (competitorMaestroFeePercentage / 100)) : 0;
    const competitorBusinessCardFee = calculationType === 'ausführlich' ? (monthlyVolume * (competitorBusinessCardFeePercentage / 100)) : 0;

    let competitorTotalFee;
    if (monthlyVolume > 10000) {
        competitorTotalFee = competitorGirocardFee * 0.0029 + competitorMastercardVisaFee * 0.0089 + competitorMaestroFee * 0.0089 + competitorBusinessCardFee * 0.0289;
    } else {
        competitorTotalFee = competitorGirocardFee * 0.0039 + competitorMastercardVisaFee * 0.0089 + competitorMaestroFee * 0.0089 + competitorBusinessCardFee * 0.0289;
    }

    const competitorTransactionFee = transactions * 0.06; // Assuming same transaction fee

    const competitorTotalMonthlyCost = competitorTotalFee + competitorTransactionFee;

    // Savings calculation only for 'ausführlich'
    let savingsBrutto = 0;
    if (calculationType === 'ausführlich') {
        const savingsNetto = competitorTotalMonthlyCost - totalMonthlyCost;
        savingsBrutto = savingsNetto * 1.19; // Including VAT
    }

    // Display results
    document.getElementById('payOneTimeCostNetto').innerText = oneTimeCost.toFixed(2);
    document.getElementById('payOneTimeCostMwSt').innerText = oneTimeMwSt.toFixed(2);
    document.getElementById('payOneTimeCostBrutto').innerText = oneTimeBrutto.toFixed(2);
    document.getElementById('payTotalNetto').innerText = totalNetto.toFixed(2);
    document.getElementById('payTotalMwSt').innerText = totalMwSt.toFixed(2);
    document.getElementById('payTotalBrutto').innerText = totalBrutto.toFixed(2);
    document.getElementById('competitorTotalNetto').innerText = (competitorTotalMonthlyCost / 1.19).toFixed(2);
    document.getElementById('competitorTotalMwSt').innerText = (competitorTotalMonthlyCost - (competitorTotalMonthlyCost / 1.19)).toFixed(2);
    document.getElementById('competitorTotalBrutto').innerText = competitorTotalMonthlyCost.toFixed(2);

    if (calculationType === 'ausführlich') {
        document.getElementById('savingsBrutto').innerText = savingsBrutto.toFixed(2);
        document.getElementById('savingsRow').classList.remove('hidden');
    } else {
        document.getElementById('savingsBrutto').innerText = '0.00';
        document.getElementById('savingsRow').classList.add('hidden');
    }

    // Apply discounts
    const payDiscountAmount = parseFloat(document.getElementById('payDiscountAmount').value) || 0;
    const payFreeMonths = parseInt(document.getElementById('payFreeMonths').value) || 0;

    // Adjust one-time and monthly costs based on discounts
    const discountedOneTimeBrutto = oneTimeBrutto - payDiscountAmount;
    const discountedTotalBrutto = totalBrutto - (payFreeMonths * 0.06); // Assuming 0.06 €/Monat Rabatt pro freiem Monat

    document.getElementById('payOneTimeCostBrutto').innerText = discountedOneTimeBrutto.toFixed(2);
    document.getElementById('payTotalBrutto').innerText = discountedTotalBrutto.toFixed(2);

    // Show results
    const payResult = document.getElementById('payResult');
    payResult.classList.remove('hidden');

    // Store results in dataset for email
    payResult.dataset.oneTimeCostNetto = oneTimeCost.toFixed(2);
    payResult.dataset.oneTimeCostMwSt = oneTimeMwSt.toFixed(2);
    payResult.dataset.oneTimeCostBrutto = discountedOneTimeBrutto.toFixed(2);
    payResult.dataset.totalNetto = totalNetto.toFixed(2);
    payResult.dataset.totalMwSt = totalMwSt.toFixed(2);
    payResult.dataset.totalBrutto = discountedTotalBrutto.toFixed(2);
    payResult.dataset.competitorTotalMonthlyCost = competitorTotalMonthlyCost.toFixed(2);
    payResult.dataset.savingsBrutto = savingsBrutto.toFixed(2);
}

/* POS Calculator Functions */

/* Calculate POS costs */
function calculatePosCosts() {
    // One-time costs
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

    // Monthly costs
    const mainLicense = document.getElementById('mainLicense').checked ? 69.00 : 0;
    const datevApi = document.getElementById('datevApi').checked ? 25.00 : 0;
    const voucherFunction = document.getElementById('voucherFunction').checked ? 10.00 : 0;
    const tapToPayLicense = document.getElementById('tapToPayLicense').checked ? 7.50 : 0;

    const handDeviceLicense = parseInt(document.getElementById('handDeviceLicense').value) || 0;
    const handDeviceLicenseCost = handDeviceLicense * 10.00; // Example price per license

    const totalMonthlyNetto = mainLicense + datevApi + voucherFunction + tapToPayLicense + handDeviceLicenseCost;
    const monthlyMwSt = totalMonthlyNetto * 0.19;
    const monthlyBrutto = totalMonthlyNetto + monthlyMwSt;

    // Discount
    const posDiscountAmount = parseFloat(document.getElementById('posDiscountAmount').value) || 0;
    const posFreeMonths = parseInt(document.getElementById('posFreeMonths').value) || 0;

    // Discount logic: subtract discount amount and apply free months
    const discountedOneTimeBrutto = oneTimeBrutto - posDiscountAmount;
    const discountedMonthlyBrutto = monthlyBrutto - (posFreeMonths * 0.06); // Assuming 0.06 €/Monat Rabatt pro freiem Monat

    // Display results
    document.getElementById('posOneTimeCostNetto').innerText = totalOneTimeNetto.toFixed(2);
    document.getElementById('posOneTimeCostMwSt').innerText = oneTimeMwSt.toFixed(2);
    document.getElementById('posOneTimeCostBrutto').innerText = discountedOneTimeBrutto.toFixed(2);
    document.getElementById('posTotalNetto').innerText = totalMonthlyNetto.toFixed(2);
    document.getElementById('posTotalMwSt').innerText = monthlyMwSt.toFixed(2);
    document.getElementById('posTotalBrutto').innerText = discountedMonthlyBrutto.toFixed(2);

    // Show results
    const posResult = document.getElementById('posResult');
    posResult.classList.remove('hidden');

    // Store results in dataset for email
    posResult.dataset.oneTimeCostNetto = totalOneTimeNetto.toFixed(2);
    posResult.dataset.oneTimeCostMwSt = oneTimeMwSt.toFixed(2);
    posResult.dataset.oneTimeCostBrutto = discountedOneTimeBrutto.toFixed(2);
    posResult.dataset.totalNetto = totalMonthlyNetto.toFixed(2);
    posResult.dataset.totalMwSt = monthlyMwSt.toFixed(2);
    posResult.dataset.totalBrutto = discountedMonthlyBrutto.toFixed(2);
}

/* TOOLS Calculator Functions */

/* Toggle Dish Reservation Duration */
function toggleDishReservationDuration() {
    const dishReservation = document.getElementById('dishReservation');
    const durationSelect = document.getElementById('dishReservationDuration');
    durationSelect.disabled = !dishReservation.checked;
}

/* Toggle Dish Order Duration */
function toggleDishOrderDuration() {
    const dishOrder = document.getElementById('dishOrder');
    const durationSelect = document.getElementById('dishOrderDuration');
    durationSelect.disabled = !dishOrder.checked;
}

/* Toggle Dish Premium Duration */
function toggleDishPremiumDuration() {
    const dishPremium = document.getElementById('dishPremium');
    const durationSelect = document.getElementById('dishPremiumDuration');
    durationSelect.disabled = !dishPremium.checked;
}

/* Calculate TOOLS costs */
function calculateToolsCosts() {
    // One-time costs
    let oneTimeCostNetto = 0;
    let oneTimeCostMwSt = 0;
    let oneTimeBrutto = 0;

    // Monthly costs
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

    // VAT calculations
    oneTimeCostMwSt = oneTimeCostNetto * 0.19;
    oneTimeBrutto = oneTimeCostNetto + oneTimeCostMwSt;

    monthlyCostMwSt = monthlyCostNetto * 0.19;
    monthlyCostBrutto = monthlyCostNetto + monthlyCostMwSt;

    // Discount
    const toolsDiscountAmount = parseFloat(document.getElementById('toolsDiscountAmount').value) || 0;
    const toolsFreeMonths = parseInt(document.getElementById('toolsFreeMonths').value) || 0;

    // Discount logic: subtract discount amount and apply free months
    const discountedOneTimeBrutto = oneTimeBrutto - toolsDiscountAmount;
    const discountedMonthlyBrutto = monthlyBrutto - (toolsFreeMonths * 0.06); // Assuming 0.06 €/Monat Rabatt pro freiem Monat

    // Display results
    document.getElementById('toolsOneTimeCostNetto').innerText = oneTimeCostNetto.toFixed(2);
    document.getElementById('toolsOneTimeCostMwSt').innerText = oneTimeCostMwSt.toFixed(2);
    document.getElementById('toolsOneTimeCostBrutto').innerText = discountedOneTimeBrutto.toFixed(2);
    document.getElementById('toolsTotalNetto').innerText = monthlyCostNetto.toFixed(2);
    document.getElementById('toolsTotalMwSt').innerText = monthlyCostMwSt.toFixed(2);
    document.getElementById('toolsTotalBrutto').innerText = discountedMonthlyBrutto.toFixed(2);

    // Show results
    const toolsResult = document.getElementById('toolsResult');
    toolsResult.classList.remove('hidden');

    // Store results in dataset for email
    toolsResult.dataset.oneTimeCostNetto = oneTimeCostNetto.toFixed(2);
    toolsResult.dataset.oneTimeCostMwSt = oneTimeCostMwSt.toFixed(2);
    toolsResult.dataset.oneTimeCostBrutto = discountedOneTimeBrutto.toFixed(2);
    toolsResult.dataset.totalNetto = monthlyCostNetto.toFixed(2);
    toolsResult.dataset.totalMwSt = monthlyCostMwSt.toFixed(2);
    toolsResult.dataset.totalBrutto = discountedMonthlyBrutto.toFixed(2);
}

/* Function to generate and show email content in modal */
function sendEmail(calculatorType) {
    const customerName = document.getElementById('customerName').value.trim();
    const salutation = document.getElementById('salutation').value;

    if (customerName === "") {
        alert("Bitte geben Sie Ihren Namen ein.");
        return;
    }

    let emailSubject = "";
    let emailBodyHTML = "";

    // General greeting
    const baseGreeting = `<p>Sehr geehrte${salutation === 'Herr' ? 'r Herr' : 'e Frau'} ${customerName},</p>`;
    const baseIntroduction = `<p>vielen Dank für Ihr Interesse an unserem DISH ${calculatorType} Produkt. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.</p>`;

    let tableHTML = "";

    if (calculatorType === 'PAY') {
        emailSubject = "Ihr DISH PAY Angebot";

        const payResult = document.getElementById('payResult');
        const oneTimeNetto = payResult.dataset.oneTimeCostNetto;
        const oneTimeMwSt = payResult.dataset.oneTimeCostMwSt;
        const oneTimeBrutto = payResult.dataset.oneTimeCostBrutto;
        const totalNetto = payResult.dataset.totalNetto;
        const totalMwSt = payResult.dataset.totalMwSt;
        const totalBrutto = payResult.dataset.totalBrutto;
        const competitorTotalMonthlyCost = payResult.dataset.competitorTotalMonthlyCost;
        const savingsBrutto = payResult.dataset.savingsBrutto;

        // Formatted table as HTML
        tableHTML = `
<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <thead>
        <tr style="background-color: #e67e22; color: #fff;">
            <th>Beschreibung</th>
            <th>Betrag (€)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Gesamte Einmalige Kosten Netto</td>
            <td>${oneTimeNetto}</td>
        </tr>
        <tr>
            <td>Mehrwertsteuer (19%)</td>
            <td>${oneTimeMwSt}</td>
        </tr>
        <tr style="background-color: #ffe5cc; font-weight: bold;">
            <td>Gesamtbetrag</td>
            <td>${oneTimeBrutto}</td>
        </tr>
        <tr>
            <td>Gesamte Monatliche Kosten Netto</td>
            <td>${totalNetto}</td>
        </tr>
        <tr>
            <td>Mehrwertsteuer (19%)</td>
            <td>${totalMwSt}</td>
        </tr>
        <tr style="background-color: #ffe5cc; font-weight: bold;">
            <td>Gesamtbetrag</td>
            <td>${totalBrutto}</td>
        </tr>
        <tr>
            <td>Wettbewerber Gesamte Monatliche Kosten Netto</td>
            <td>${(competitorTotalMonthlyCost / 1.19).toFixed(2)}</td>
        </tr>
        <tr>
            <td>Wettbewerber Mehrwertsteuer (19%)</td>
            <td>${(competitorTotalMonthlyCost - (competitorTotalMonthlyCost / 1.19)).toFixed(2)}</td>
        </tr>
        <tr style="background-color: #ffe5cc; font-weight: bold;">
            <td>Wettbewerber Gesamtbetrag</td>
            <td>${competitorTotalMonthlyCost}</td>
        </tr>
        <tr id="emailSavingsRow">
            <td style="color: red; font-weight: bold;">Ersparnis Brutto</td>
            <td style="color: red; font-weight: bold;">${savingsBrutto}</td>
        </tr>
    </tbody>
</table>
`;

    }

    if (calculatorType === 'POS') {
        emailSubject = "Ihr DISH POS Angebot";

        const posResult = document.getElementById('posResult');
        const oneTimeNetto = posResult.dataset.oneTimeCostNetto;
        const oneTimeMwSt = posResult.dataset.oneTimeCostMwSt;
        const oneTimeBrutto = posResult.dataset.oneTimeCostBrutto;
        const totalNetto = posResult.dataset.totalNetto;
        const totalMwSt = posResult.dataset.totalMwSt;
        const totalBrutto = posResult.dataset.totalBrutto;

        // Formatted table as HTML
        tableHTML = `
<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <thead>
        <tr style="background-color: #e67e22; color: #fff;">
            <th>Beschreibung</th>
            <th>Betrag (€)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Gesamte Einmalige Kosten Netto</td>
            <td>${oneTimeNetto}</td>
        </tr>
        <tr>
            <td>Mehrwertsteuer (19%)</td>
            <td>${oneTimeMwSt}</td>
        </tr>
        <tr style="background-color: #ffe5cc; font-weight: bold;">
            <td>Gesamtbetrag</td>
            <td>${oneTimeBrutto}</td>
        </tr>
        <tr>
            <td>Gesamte Monatliche Kosten Netto</td>
            <td>${totalNetto}</td>
        </tr>
        <tr>
            <td>Mehrwertsteuer (19%)</td>
            <td>${totalMwSt}</td>
        </tr>
        <tr style="background-color: #ffe5cc; font-weight: bold;">
            <td>Gesamtbetrag</td>
            <td>${totalBrutto}</td>
        </tr>
    </tbody>
</table>
`;
    }

    if (calculatorType === 'TOOLS') {
        emailSubject = "Ihr DISH TOOLS Angebot";

        const toolsResult = document.getElementById('toolsResult');
        const oneTimeNetto = toolsResult.dataset.oneTimeCostNetto;
        const oneTimeMwSt = toolsResult.dataset.oneTimeCostMwSt;
        const oneTimeBrutto = toolsResult.dataset.oneTimeCostBrutto;
        const totalNetto = toolsResult.dataset.totalNetto;
        const totalMwSt = toolsResult.dataset.totalMwSt;
        const totalBrutto = toolsResult.dataset.totalBrutto;

        // Formatted table as HTML
        tableHTML = `
<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
    <thead>
        <tr style="background-color: #e67e22; color: #fff;">
            <th>Beschreibung</th>
            <th>Betrag (€)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Gesamte Einmalige Kosten Netto</td>
            <td>${oneTimeNetto}</td>
        </tr>
        <tr>
            <td>Mehrwertsteuer (19%)</td>
            <td>${oneTimeMwSt}</td>
        </tr>
        <tr style="background-color: #ffe5cc; font-weight: bold;">
            <td>Gesamtbetrag</td>
            <td>${oneTimeBrutto}</td>
        </tr>
        <tr>
            <td>Gesamte Monatliche Kosten Netto</td>
            <td>${totalNetto}</td>
        </tr>
        <tr>
            <td>Mehrwertsteuer (19%)</td>
            <td>${totalMwSt}</td>
        </tr>
        <tr style="background-color: #ffe5cc; font-weight: bold;">
            <td>Gesamtbetrag</td>
            <td>${totalBrutto}</td>
        </tr>
    </tbody>
</table>
`;
    }

    const baseConclusion = `<p>---</p>
<p>Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unserem DISH ${calculatorType} einen echten Mehrwert bieten zu dürfen.</p>
<p>Mit freundlichen Grüßen,<br>Ihr DISH Team</p>`;

    emailBodyHTML = baseGreeting + baseIntroduction + tableHTML + baseConclusion;

    // Insert the email content into the modal
    document.getElementById('emailContent').innerHTML = emailBodyHTML;

    // Show the modal
    const modal = document.getElementById('emailContentContainer');
    modal.classList.remove('hidden');
}

/* Function to copy and send email */
function copyAndSendEmail() {
    const emailContentElement = document.getElementById('emailContent');
    const emailText = emailContentElement.innerText;

    navigator.clipboard.writeText(emailText).then(function() {
        alert('Der E-Mail-Inhalt wurde in die Zwischenablage kopiert und der E-Mail-Client wird geöffnet.');

        // Generate mailto link
        const emailSubjectElement = document.getElementById('emailContent').innerHTML.match(/<p>Sehr geehrte.*?<\/p>/);
        const emailSubject = document.title + " Angebot"; // Alternatively, use specific subject based on the calculator

        const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailText)}`;

        // Open the mail client
        window.location.href = mailtoLink;

        // Close the modal
        closeEmailContent();
    }, function(err) {
        alert('Kopieren fehlgeschlagen. Bitte versuchen Sie es manuell.');
    });
}

/* Function to close the email modal */
function closeEmailContent() {
    const modal = document.getElementById('emailContentContainer');
    modal.classList.add('hidden');
}
