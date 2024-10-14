function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const rentalPeriod = document.getElementById('rentalPeriod').value;
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost'));
    let monthlyCost = 0;

    if (rentalPeriod === "mieten") {
        monthlyCost = parseFloat(selectedHardware.getAttribute(`data-12m-cost`)); // Standard für Mieten auf 12 Monate
    } else {
        monthlyCost = parseFloat(selectedHardware.getAttribute(`data-60m-cost`)); // Standard für Kauf auf 60 Monate
    }

    return { onceCost, monthlyCost };
}

function toggleCompetitorFields() {
    const competitorSection = document.getElementById('competitorSection');
    competitorSection.style.display = document.getElementById('competitorInclude').value === "ja" ? 'block' : 'none';
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    const transactions = parseFloat(document.getElementById('transactions').value);
    const girocard = parseFloat(document.getElementById('girocard').value) / 100;
    const maestro = parseFloat(document.getElementById('maestro').value) / 100;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    const businessCard = parseFloat(document.getElementById('businessCard').value) / 100;

    const { onceCost, monthlyCost } = updateHardwareCosts();

    // Berechnung der Gebühren
    const girocardFee = monthlyVolume * girocard * 0.0039; // 0,39% für Girocard
    const maestroFee = monthlyVolume * maestro * 0.0079; // 0,79% für Maestro
    const mastercardFee = monthlyVolume * mastercardVisa * 0.0089; // 0,89% für Mastercard/VISA
    const businessFee = monthlyVolume * businessCard * 0.0289; // 2,89% für Business Card

    const totalFees = girocardFee + maestroFee + mastercardFee + businessFee;

    // Ergebnisse anzeigen
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h4>Berechnete Kosten:</h4>
        <p>Einmalige Hardwarekosten: ${onceCost.toFixed(2)} €</p>
        <p>Monatliche Hardwarekosten: ${monthlyCost.toFixed(2)} €</p>
        <p>Gesamte monatliche Transaktionsgebühren: ${totalFees.toFixed(2)} €</p>
        <p>Gesamtkosten im ersten Monat: ${(totalFees + onceCost + monthlyCost).toFixed(2)} €</p>
        <p>Monatliche Gesamtkosten (nach dem ersten Monat): ${(totalFees + monthlyCost).toFixed(2)} €</p>
    `;

    // Wettbewerberdaten verarbeiten
    if (document.getElementById('competitorInclude').value === "ja") {
        const competitorFee = parseFloat(document.getElementById('competitorFee').value);
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100;
        const competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) / 100;
        const competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) / 100;

        const competitorTotalFees = transactions * competitorFee
            + monthlyVolume * competitorGirocardFee
            + monthlyVolume * competitorMaestroFee
            + monthlyVolume * competitorMastercardFee
            + monthlyVolume * competitorBusinessFee;

        resultsDiv.innerHTML += `
            <h4>Wettbewerber Kosten:</h4>
            <p>Gesamte monatliche Kosten des Wettbewerbers: ${competitorTotalFees.toFixed(2)} €</p>
        `;
    }
}

function downloadOffer() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("DISH PAY Angebot", 20, 20);
    
    const resultsDiv = document.getElementById('results');
    doc.setFontSize(12);
    doc.text(resultsDiv.innerText, 20, 30);
    
    doc.save('DISH_PAY_Angebot.pdf');
}
