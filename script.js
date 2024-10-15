function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const detailedFields = document.getElementById('detailedFields');
    detailedFields.style.display = calculationType === 'schnell' ? 'none' : 'block';
}

function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');
    rentalOptions.style.display = purchaseOption === "mieten" ? 'block' : 'none';
}

function updateRentalPrices() {
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const rentalPeriodSelect = document.getElementById('rentalPeriod');
    const price12 = selectedHardware.getAttribute('data-price-12');
    const price36 = selectedHardware.getAttribute('data-price-36');
    const price60 = selectedHardware.getAttribute('data-price-60');

    rentalPeriodSelect.options[0].text = `12 Monate - ${price12} €/Monat`;
    rentalPeriodSelect.options[1].text = `36 Monate - ${price36} €/Monat`;
    rentalPeriodSelect.options[2].text = `60 Monate - ${price60} €/Monat`;
}

function updateHardwareCosts() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    
    // Hardwarekosten
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

function calculateCosts() {
    const calculationType = document.getElementById('calculationType').value;
    const purchaseOption = document.getElementById('purchaseOption').value;
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseFloat(document.getElementById('transactions').value) || 0;
    
    const girocardFeePercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaFeePercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    let maestroFeePercentage = 0;
    let businessCardFeePercentage = 0;

    if (calculationType === 'ausführlich') {
        maestroFeePercentage = parseFloat(document.getElementById('maestro').value) || 0;
        businessCardFeePercentage = parseFloat(document.getElementById('businessCard').value) || 0;
    }

    // Validierung der Kartenprozentsätze
    const totalPercentage = girocardFeePercentage + mastercardVisaFeePercentage + maestroFeePercentage + businessCardFeePercentage;
    if (totalPercentage !== 100) {
        alert("Die Summe der Kartenprozentsätze muss 100% ergeben.");
        return;
    }

    // Hardwarekosten
    const { onceCost, monthlyCost: hardwareMonthlyCost } = updateHardwareCosts();

    // Berechnung des Kartenumsatzes (Disagio-Gebühren)
    const girocardRevenue = monthlyVolume * (girocardFeePercentage / 100);
    const mastercardVisaRevenue = monthlyVolume * (mastercardVisaFeePercentage / 100);
    const maestroRevenue = monthlyVolume * (maestroFeePercentage / 100);
    const businessCardRevenue = monthlyVolume * (businessCardFeePercentage / 100);

    const girocardFee = girocardRevenue * (monthlyVolume > 10000 ? 0.0029 : 0.0039);
    const mastercardVisaFee = mastercardVisaRevenue * 0.0089;
    const maestroFee = maestroRevenue * 0.0089;
    const businessCardFee = businessCardRevenue * 0.0289;

    // Gesamte Disagio-Gebühren
    const totalDisagioFees = girocardFee + mastercardVisaFee + maestroFee + businessCardFee;

    // Transaktionsgebühren
    const transactionFee = transactions * 0.06;

    // SIM/Servicegebühr (nur bei bestimmten Terminals)
    let simServiceFee = 0;
    const hardwareSelect = document.getElementById('hardware').value;
    if (hardwareSelect === "S1F2" || hardwareSelect === "V400C") {
        simServiceFee = 3.90;
    }

    // Monatliche Gesamtkosten
    const totalMonthlyCost = totalDisagioFees + transactionFee + hardwareMonthlyCost + simServiceFee;

    // Anzeige der Ergebnisse
    if (calculationType === 'schnell') {
        // Bei schneller Berechnung: Gebühren und Hardware getrennt anzeigen
        document.getElementById('disagioFees').innerText = `Gebühren gesamt: ${(totalDisagioFees + transactionFee).toFixed(2)} €`;
        document.getElementById('monthlyCost').innerText = `Monatliche Hardwarekosten (Miete): ${hardwareMonthlyCost.toFixed(2)} €`;
        document.getElementById('simServiceFee').innerText = simServiceFee > 0 ? `SIM/Servicegebühr: ${simServiceFee.toFixed(2)} €` : "";
        document.getElementById('totalCost').innerText = `Monatliche Gesamtkosten: ${totalMonthlyCost.toFixed(2)} €`;

        // Einmalige Kosten nur bei Kauf anzeigen
        document.getElementById('oneTimeCost').innerText = purchaseOption === "kaufen" ? `Einmalige Kosten (Kauf): ${onceCost.toFixed(2)} €` : "";
    } else {
        // Bei ausführlicher Berechnung: Einzelne Kostenarten anzeigen
        document.getElementById('disagioFees').innerText = `Gebühren (Disagio): ${totalDisagioFees.toFixed(2)} €`;
        document.getElementById('transactionFee').innerText = `Transaktionsgebühren: ${transactionFee.toFixed(2)} €`;
        document.getElementById('monthlyCost').innerText = purchaseOption === "mieten" ? `Monatliche Hardwarekosten (Miete): ${hardwareMonthlyCost.toFixed(2)} €` : "";
        document.getElementById('simServiceFee').innerText = simServiceFee > 0 ? `SIM/Servicegebühr: ${simServiceFee.toFixed(2)} €` : "";
        document.getElementById('totalCost').innerText = `Monatliche Gesamtkosten: ${totalMonthlyCost.toFixed(2)} €`;

        // Einmalige Kosten nur bei Kauf anzeigen
        document.getElementById('oneTimeCost').innerText = purchaseOption === "kaufen" ? `Einmalige Kosten (Kauf): ${onceCost.toFixed(2)} €` : "";
    }

    // Wettbewerberberechnung (nur bei ausführlicher Berechnung)
    if (calculationType === 'ausführlich') {
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100 || 0;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100 || 0;
        const competitorMastercardVisaFee = parseFloat(document.getElementById('competitorMastercardVisaFee').value) / 100 || 0;
        const competitorBusinessCardFee = parseFloat(document.getElementById('competitorBusinessCardFee').value) / 100 || 0;

        const competitorGirocardCost = girocardRevenue * competitorGirocardFee;
        const competitorMaestroCost = maestroRevenue * competitorMaestroFee;
        const competitorMastercardVisaCost = mastercardVisaRevenue * competitorMastercardVisaFee;
        const competitorBusinessCardCost = businessCardRevenue * competitorBusinessCardFee;

        const competitorTotalFees = competitorGirocardCost + competitorMaestroCost + competitorMastercardVisaCost + competitorBusinessCardCost + transactionFee + hardwareMonthlyCost + simServiceFee;

        document.getElementById('competitorTotal').innerText = `Wettbewerberkosten pro Monat: ${competitorTotalFees.toFixed(2)} €`;
        document.getElementById('competitorSavings').innerText = `Monatliche Ersparnis mit DISH PAY: ${(competitorTotalFees - totalMonthlyCost).toFixed(2)} €`;
    } else {
        document.getElementById('competitorTotal').innerText = "";
        document.getElementById('competitorSavings').innerText = "";
    }
}
