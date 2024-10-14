function toggleRentalFields() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalPeriod = document.getElementById('rentalPeriod');
    const rentalPeriodLabel = document.getElementById('rentalPeriodLabel');

    if (purchaseOption === 'mieten') {
        rentalPeriod.style.display = 'block';
        rentalPeriodLabel.style.display = 'block';
    } else {
        rentalPeriod.style.display = 'none';
        rentalPeriodLabel.style.display = 'none';
    }
}

function updateHardwareCosts() {
    const hardwareOption = document.getElementById('hardwareOption');
    const selectedHardware = hardwareOption.options[hardwareOption.selectedIndex];
    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost'));
    const monthlyCost12 = parseFloat(selectedHardware.getAttribute('data-monthly-cost-12'));
    const monthlyCost36 = parseFloat(selectedHardware.getAttribute('data-monthly-cost-36'));
    const monthlyCost60 = parseFloat(selectedHardware.getAttribute('data-monthly-cost-60'));
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalPeriod = document.getElementById('rentalPeriod').value;

    let totalMonthlyCost = 0;

    if (purchaseOption === 'kaufen') {
        totalMonthlyCost = 0; // Keine monatlichen Kosten, wenn gekauft
    } else if (purchaseOption === 'mieten') {
        if (rentalPeriod === '12') {
            totalMonthlyCost = monthlyCost12;
        } else if (rentalPeriod === '36') {
            totalMonthlyCost = monthlyCost36;
        } else if (rentalPeriod === '60') {
            totalMonthlyCost = monthlyCost60;
        }
    }

    const results = document.getElementById('results');
    results.innerHTML = `
        <p><strong>Einmalige Kosten:</strong> ${onceCost.toFixed(2)} €</p>
        <p><strong>Monatliche Kosten:</strong> ${totalMonthlyCost.toFixed(2)} €</p>
    `;
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) / 100;
    const maestroPercentage = parseFloat(document.getElementById('maestro').value) / 100;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) / 100;

    // Umsatzverteilung
    const girocardAmount = monthlyVolume * girocardPercentage;
    const maestroAmount = monthlyVolume * maestroPercentage;
    const mastercardVisaAmount = monthlyVolume * mastercardVisaPercentage;
    const businessCardAmount = monthlyVolume * businessCardPercentage;

    // Gebührenberechnung
    const girocardFee = (girocardAmount <= 10000) ? girocardAmount * 0.0039 : girocardAmount * 0.0029;
    const maestroFee = maestroAmount * 0.0089;
    const mastercardVisaFee = mastercardVisaAmount * 0.0089;
    const businessCardFee = businessCardAmount * 0.0289;

    const totalFees = girocardFee + maestroFee + mastercardVisaFee + businessCardFee;

    const hardwareOption = document.getElementById('hardwareOption');
    const selectedHardware = hardwareOption.options[hardwareOption.selectedIndex];
    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost'));
    const purchaseOption = document.getElementById('purchaseOption').value;

    let totalMonthlyCost = totalFees + ((purchaseOption === 'kaufen') ? 0 : parseFloat(document.getElementById('rentalPeriod').value));

    const results = document.getElementById('results');
    results.innerHTML = `
        <h3>Ergebnis</h3>
        <p><strong>Einmalige Kosten:</strong> ${onceCost.toFixed(2)} €</p>
        <p><strong>Monatliche Gebühren (inkl. Transaktionskosten):</strong> ${totalMonthlyCost.toFixed(2)} €</p>
    `;
}

function downloadOffer() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("DISH PAY Angebot", 20, 20);
    doc.text("Monatliche Kostenberechnung", 20, 30);

    const results = document.getElementById('results').innerHTML;
    doc.fromHTML(results, 20, 40);

    doc.save("angebot_dish_pay.pdf");
}
