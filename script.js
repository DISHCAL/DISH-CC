document.addEventListener("DOMContentLoaded", () => {
    // Event Listener für dynamische Updates
    document.getElementById('calculationType').addEventListener('change', toggleCalculationFields);
    document.getElementById('purchaseOption').addEventListener('change', () => {
        toggleRentalOptions();
        updateRentalPrices();
    });
    document.getElementById('hardware').addEventListener('change', updateRentalPrices);
    document.getElementById('calculateButton').addEventListener('click', calculateCosts);
    document.getElementById('generatePdfButton').addEventListener('click', generatePDF);
});

// Umschalten der Berechnungsfelder (schnell/ausführlich)
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const businessCardField = document.getElementById('businessCardField');
    const maestroField = document.getElementById('maestroField');
    const competitorSection = document.getElementById('competitorSection');

    if (calculationType === 'schnell') {
        businessCardField.classList.add('hidden');
        maestroField.classList.add('hidden');
        competitorSection.classList.add('hidden');
    } else {
        businessCardField.classList.remove('hidden');
        maestroField.classList.remove('hidden');
        competitorSection.classList.remove('hidden');
    }
}

// Umschalten der Mietoptionen
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');
    rentalOptions.style.display = purchaseOption === "mieten" ? 'block' : 'none';
}

// Mietpreise basierend auf der ausgewählten Hardware aktualisieren
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

// Sicherstellen, dass die Summe der Prozentsätze 100 ergibt
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

// Kosten berechnen
function calculateCosts() {
    if (!validatePercentages()) {
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

    // Hardwarekosten berechnen
    const { onceCost, monthlyCost: hardwareMonthlyCost } = updateHardwareCosts();

    // Kartentransaktionsgebühren berechnen
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

    // SIM/Servicegebühr (nur bei Kauf)
    let simServiceFee = 0;
    const hardwareSelect = document.getElementById('hardware').value;
    if (purchaseOption === "kaufen" && (hardwareSelect === "S1F2" || hardwareSelect === "V400C")) {
        simServiceFee = 3.90;
    }

    // Gesamtkosten pro Monat
    const totalMonthlyCost = totalDisagioFees + transactionFee + hardwareMonthlyCost + simServiceFee;

    // Ergebnisse anzeigen
    document.getElementById('disagioFees').innerText = `Gebühren gesamt: ${(totalDisagioFees + transactionFee).toFixed(2)} €`;
    document.getElementById('monthlyCost').innerText = purchaseOption === "mieten" ? `Monatliche Hardwarekosten (Miete): ${hardwareMonthlyCost.toFixed(2)} €` : "";
    document.getElementById('simServiceFee').innerText = simServiceFee > 0 ? `SIM/Servicegebühr (nur bei Kauf): ${simServiceFee.toFixed(2)} €` : "Keine SIM/Servicegebühr";
    document.getElementById('totalCost').innerText = `Monatliche Gesamtkosten: ${totalMonthlyCost.toFixed(2)} €`;
    document.getElementById('oneTimeCost').innerText = purchaseOption === "kaufen" ? `Einmalige Kosten (Kauf): ${onceCost.toFixed(2)} €` : "";
}

// Hardwarekosten aktualisieren
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

// PDF generieren
function generatePDF() {
    const doc = new jspdf.jsPDF();

    // Titel setzen
    doc.setFontSize(18);
    doc.setTextColor("#e67e22");
    doc.text("DISH PAY Angebot", 10, 10);

    // Tabelle hinzufügen
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Gebühren gesamt: ${document.getElementById('disagioFees').innerText.split(": ")[1]}`, 10, 30);
    doc.text(`Monatliche Hardwarekosten: ${document.getElementById('monthlyCost').innerText.split(": ")[1] || '-'}`, 10, 40);
    doc.text(`SIM/Servicegebühr: ${document.getElementById('simServiceFee').innerText.split(": ")[1] || '-'}`, 10, 50);
    doc.text(`Monatliche Gesamtkosten: ${document.getElementById('totalCost').innerText.split(": ")[1]}`, 10, 60);
    doc.text(`Einmalige Kosten (bei Kauf): ${document.getElementById('oneTimeCost').innerText.split(": ")[1] || '-'}`, 10, 70);

    // PDF speichern
    doc.save("DISH_Angebot.pdf");
}

