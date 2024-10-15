document.addEventListener("DOMContentLoaded", () => {
    // Event listeners for dynamic updates
    document.getElementById('calculationType').addEventListener('change', toggleCalculationFields);
    document.getElementById('purchaseOption').addEventListener('change', () => {
        toggleRentalOptions();
        updateRentalPrices();
    });
    document.getElementById('hardware').addEventListener('change', updateRentalPrices);
    document.getElementById('calculateButton').addEventListener('click', calculateCosts);
    document.getElementById('generatePdfButton').addEventListener('click', generatePDF);
});

// Toggle fields for calculation type (quick/detailed)
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

// Toggle rental options
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');
    rentalOptions.style.display = purchaseOption === "mieten" ? 'block' : 'none';
}

// Update rental prices based on selected hardware
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

// Validate that percentage inputs sum up to 100%
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

// Calculate costs
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

    // Hardware costs
    const { onceCost, monthlyCost: hardwareMonthlyCost } = updateHardwareCosts();

    // Calculate card transaction fees
    const girocardRevenue = monthlyVolume * (girocardFeePercentage / 100);
    const mastercardVisaRevenue = monthlyVolume * (mastercardVisaFeePercentage / 100);
    const maestroRevenue = monthlyVolume * (maestroFeePercentage / 100);
    const businessCardRevenue = monthlyVolume * (businessCardFeePercentage / 100);

    const girocardFee = girocardRevenue * (monthlyVolume > 10000 ? 0.0029 : 0.0039);
    const mastercardVisaFee = mastercardVisaRevenue * 0.0089;
    const maestroFee = maestroRevenue * 0.0089;
    const businessCardFee = businessCardRevenue * 0.0289;

    // Total fees
    const totalDisagioFees = girocardFee + mastercardVisaFee + maestroFee + businessCardFee;

    // Transaction fees
    const transactionFee = transactions * 0.06;

    // SIM/Service fee (only for purchase)
    let simServiceFee = 0;
    const hardwareSelect = document.getElementById('hardware').value;
    if (purchaseOption === "kaufen" && (hardwareSelect === "S1F2" || hardwareSelect === "V400C")) {
        simServiceFee = 3.90;
    }

    // Total monthly cost
    const totalMonthlyCost = totalDisagioFees + transactionFee + hardwareMonthlyCost + simServiceFee;

    // Display results
    document.getElementById('disagioFees').innerText = `Gebühren gesamt: ${(totalDisagioFees + transactionFee).toFixed(2)} €`;
    document.getElementById('monthlyCost').innerText = purchaseOption === "mieten" ? `Monatliche Hardwarekosten (Miete): ${hardwareMonthlyCost.toFixed(2)} €` : "";
    document.getElementById('simServiceFee').innerText = simServiceFee > 0 ? `SIM/Servicegebühr (nur bei Kauf): ${simServiceFee.toFixed(2)} €` : "Keine SIM/Servicegebühr";
    document.getElementById('totalCost').innerText = `Monatliche Gesamtkosten: ${totalMonthlyCost.toFixed(2)} €`;
    document.getElementById('oneTimeCost').innerText = purchaseOption === "kaufen" ? `Einmalige Kosten (Kauf): ${onceCost.toFixed(2)} €` : "";
}

// Generate PDF
function generatePDF() {
    const doc = new jspdf.jsPDF();

    // Set title
    doc.setFontSize(18);
    doc.setTextColor("#e67e22");
    doc.text("DISH PAY Angebot", 10, 10);

    // Add table
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Gebühren gesamt: ${document.getElementById('disagioFees').innerText.split(": ")[1]}`, 10, 30);
    doc.text(`Monatliche Hardwarekosten: ${document.getElementById('monthlyCost').innerText.split(": ")[1] || '-'}`, 10, 40);
    doc.text(`SIM/Servicegebühr: ${document.getElementById('simServiceFee').innerText.split(": ")[1] || '-'}`, 10, 50);
    doc.text(`Monatliche Gesamtkosten: ${document.getElementById('totalCost').innerText.split(": ")[1]}`, 10, 60);
    doc.text(`Einmalige Kosten (bei Kauf): ${document.getElementById('oneTimeCost').innerText.split(": ")[1] || '-'}`, 10, 70);

    // Save the PDF
    doc.save("DISH_Angebot.pdf");
}
