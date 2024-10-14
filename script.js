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
    } else if (purchaseOption === "kaufen") {
        monthlyCost = 0;  // Keine monatlichen Kosten bei Kauf
    }

    return { onceCost: priceOnce, monthlyCost };
}

function toggleRentalOptions() {
    const rentalOptions = document.getElementById('rentalOptions');
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.value;

    // Zeige Mietoptionen nur an, wenn "Mieten" ausgewählt ist und Hardware Mietoptionen hat
    if (selectedHardware === "MotoG14" || selectedHardware === "Tap2Pay") {
        rentalOptions.style.display = 'none'; // Keine Mietoptionen für MotoG14 oder Tap2Pay
    } else {
        rentalOptions.style.display = document.getElementById('purchaseOption').value === "mieten" ? 'block' : 'none';
    }
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
        competitorTotal = transactions * competitorFee;
    }

    // Final calculation
    const totalCost = totalRevenue + monthlyCost + onceCost;
    const competitorSavings = competitorTotal - totalCost;

    // Display results
    document.getElementById('totalRevenue').innerText = `Gesamter Umsatz: ${totalRevenue.toFixed(2)} €`;
    document.getElementById('competitorTotal').innerText = `Wettbewerberkosten: ${competitorTotal.toFixed(2)} €`;
    document.getElementById('totalCost').innerText = `Gesamtkosten: ${totalCost.toFixed(2)} €`;
    document.getElementById('competitorSavings').innerText = `Ersparnis im Vergleich zum Wettbewerber: ${competitorSavings.toFixed(2)} €`;
}
