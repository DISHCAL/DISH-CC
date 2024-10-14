function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const rentalPeriod = document.getElementById('rentalPeriod').value;
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost'));
    let monthlyCost = 0;

    if (rentalPeriod === "mieten") {
        monthlyCost = parseFloat(selectedHardware.getAttribute(`data-12m-cost`)); // Standard für Mieten auf 12 Monate
    }

    return { onceCost, monthlyCost };
}

function toggleCompetitorFields() {
    const competitorSection = document.getElementById('competitorSection');
    competitorSection.style.display = document.getElementById('competitorInclude').value === "ja" ? 'block' : 'none';
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    const transactions = parseInt(document.getElementById('transactions').value);
    const girocard = parseFloat(document.getElementById('girocard').value) / 100;
    const maestro = parseFloat(document.getElementById('maestro').value) / 100;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    const businessCard = parseFloat(document.getElementById('businessCard').value) / 100;

    const competitorInclude = document.getElementById('competitorInclude').value;

    // Hardwarekosten ermitteln
    const { onceCost, monthlyCost } = updateHardwareCosts();

    // Validierung der Eingaben
    if (isNaN(monthlyVolume) || isNaN(transactions) || 
        isNaN(girocard) || isNaN(maestro) || 
        isNaN(mastercardVisa) || isNaN(businessCard)) {
        document.getElementById('results').innerHTML = '<p>Bitte geben Sie gültige Werte ein.</p>';
        return; // Abbrechen, wenn ungültige Eingaben vorliegen
    }

    // Gebührenberechnung
    const girocardFee = monthlyVolume * girocard * (monthlyVolume < 10000 ? 0.0039 : 0.0029);
    const maestroFee = monthlyVolume * maestro * 0.0079;
    const mastercardVisaFee = monthlyVolume * mastercardVisa * 0.0089;
    const businessCardFee = monthlyVolume * businessCard * 0.0289;

    const totalFees = girocardFee + maestroFee + mastercardVisaFee + businessCardFee;
    const totalMonthlyCost = monthlyCost + (totalFees / transactions); // Verteilung der Gebühren auf Transaktionen

    let resultsHtml = `<h3>Ergebnisse</h3>
                       <p>Einmalige Kosten: €${onceCost.toFixed(2)}</p>
                       <p>Monatliche Kosten: €${monthlyCost.toFixed(2)}</p>
                       <p>Gesamte Gebühren pro Monat: €${totalFees.toFixed(2)}</p>
                       <p>Gesamtkosten pro Transaktion: €${(totalFees / transactions).toFixed(2)}</p>
                       <p>Gesamtkosten: €${(onceCost + totalMonthlyCost * 12).toFixed(2)}</p>`;

    if (competitorInclude === "ja") {
        const competitorFee = parseFloat(document.getElementById('competitorFee').value) || 0;
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100 || 0;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100 || 0;
        const competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) / 100 || 0;
        const competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) / 100 || 0;

        const competitorTotalFees = (monthlyVolume * competitorGirocardFee * (monthlyVolume < 10000 ? 0.0039 : 0.0029)) + 
                                    (monthlyVolume * competitorMaestroFee * 0.0079) + 
                                    (monthlyVolume * competitorMastercardFee * 0.0089) + 
                                    (monthlyVolume * competitorBusinessFee * 0.0289);

        resultsHtml += `<p>Wettbewerber Gebühren pro Monat: €${competitorTotalFees.toFixed(2)}</p>`;
    }

    document.getElementById('results').innerHTML = resultsHtml;
}
