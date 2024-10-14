function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const purchaseOption = document.getElementById('purchaseOption').value;
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost')) || 0;
    let monthlyCost = 0;

    if (purchaseOption === "mieten") {
        const rentalPeriod = document.getElementById('rentalPeriod').value;
        monthlyCost = parseFloat(selectedHardware.getAttribute(`${rentalPeriod}-cost`)) || 0;
    } else {
        // Use the monthly cost of the hardware for purchase option
        monthlyCost = parseFloat(selectedHardware.getAttribute('data-monthly-cost')) || 0;
    }

    return { onceCost, monthlyCost };
}

function toggleRentalOptions() {
    const rentalOptions = document.getElementById('rentalOptions');
    rentalOptions.style.display = document.getElementById('purchaseOption').value === "mieten" ? 'block' : 'none';
}

function toggleCompetitorFields() {
    const competitorSection = document.getElementById('competitorSection');
    competitorSection.style.display = document.getElementById('competitorInclude').value === "ja" ? 'block' : 'none';
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseFloat(document.getElementById('transactions').value) || 0;

    const girocardFee = parseFloat(document.getElementById('girocard').value) || 0;
    const maestroFee = parseFloat(document.getElementById('maestro').value) || 0;
    const mastercardVisaFee = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const businessCardFee = parseFloat(document.getElementById('businessCard').value) || 0;

    const competitorIncluded = document.getElementById('competitorInclude').value === "ja";

    // Hardware costs
    const purchaseOption = document.getElementById('purchaseOption').value;
    const { onceCost, monthlyCost } = updateHardwareCosts();

    // Fee calculations
    const girocardRevenue = (monthlyVolume * (girocardFee / 100));
    const maestroRevenue = (monthlyVolume * (maestroFee / 100));
    const mastercardVisaRevenue = (monthlyVolume * (mastercardVisaFee / 100));
    const businessCardRevenue = (monthlyVolume * (businessCardFee / 100));

    const totalRevenue = girocardRevenue + maestroRevenue + mastercardVisaRevenue + businessCardRevenue;

    // Competitor fees (if applicable)
    let competitorTotal = 0;
    if (competitorIncluded) {
        const competitorFee = parseFloat(document.getElementById('competitorFee').value) || 0;
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) || 0;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) || 0;
        const competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) || 0;
        const competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) || 0;

        competitorTotal = (competitorFee * transactions) +
            (monthlyVolume * (competitorGirocardFee / 100)) +
            (monthlyVolume * (competitorMaestroFee / 100)) +
            (monthlyVolume * (competitorMastercardFee / 100)) +
            (monthlyVolume * (competitorBusinessFee / 100));
    }

    // Final calculations
    const totalMonthlyCost = monthlyCost + competitorTotal;
    const totalOnceCost = purchaseOption === "kaufen" ? onceCost : 0;

    // Display results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h3>Berechnungsergebnisse</h3>
        <p>Einmalige Kosten: €${totalOnceCost.toFixed(2)}</p>
        <p>Monatliche Kosten: €${totalMonthlyCost.toFixed(2)}</p>
        <p>Gesamte Transaktionsgebühren: €${totalRevenue.toFixed(2)}</p>
    `;
}

function downloadOffer() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("DISH PAY Angebot", 10, 10);
    doc.text(document.getElementById('results').innerText, 10, 20);
    doc.save("angebot.pdf");
}
