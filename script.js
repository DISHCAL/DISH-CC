function toggleCompetitorFields() {
    const competitorSection = document.getElementById('competitorSection');
    competitorSection.style.display = document.getElementById('competitorInclude').value === 'ja' ? 'block' : 'none';
}

function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const purchaseOption = document.getElementById('hardwareOptionPurchase').value;
    const rentalPeriod = document.getElementById('rentalPeriod').value;

    let monthlyHardwareCost = purchaseOption === 'kaufen' ? 0 : parseFloat(hardwareSelect.selectedOptions[0].getAttribute(`data-monthly-cost-${rentalPeriod}`)) || 0;

    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = `<h4>Monatliche Hardware Kosten: €${monthlyHardwareCost.toFixed(2)}</h4>`;
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseInt(document.getElementById('transactions').value) || 0;
    const girocard = parseFloat(document.getElementById('girocard').value) || 0;
    const maestro = parseFloat(document.getElementById('maestro').value) || 0;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const businessCard = parseFloat(document.getElementById('businessCard').value) || 0;

    const hardwareSelect = document.getElementById('hardwareOption');
    const hardwareName = hardwareSelect.options[hardwareSelect.selectedIndex].text;

    const purchaseOption = document.getElementById('hardwareOptionPurchase').value;
    const rentalPeriod = document.getElementById('rentalPeriod').value;

    let monthlyHardwareCost = purchaseOption === "kaufen"
        ? parseFloat(hardwareSelect.selectedOptions[0].getAttribute('data-once-cost')) / (rentalPeriod === "12" ? 12 : rentalPeriod === "36" ? 36 : 60)
        : parseFloat(hardwareSelect.selectedOptions[0].getAttribute(`data-monthly-cost-${rentalPeriod}`)) || 0;

    let totalCost = monthlyHardwareCost;

    if (document.getElementById('competitorInclude').value === 'ja') {
        const competitorFee = parseFloat(document.getElementById('competitorFee').value) || 0;
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) || 0;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) || 0;
        const competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) || 0;
        const competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) || 0;

        const competitorTotal = (competitorFee * transactions) +
            (monthlyVolume * girocard / 100 * competitorGirocardFee) +
            (monthlyVolume * maestro / 100 * competitorMaestroFee) +
            (monthlyVolume * mastercardVisa / 100 * competitorMastercardFee) +
            (monthlyVolume * businessCard / 100 * competitorBusinessFee);

        totalCost += competitorTotal;
    }

    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = `
        <h4>Gesamtkosten:</h4>
        <p>Hardware: ${hardwareName}</p>
        <p>Monatliche Hardware Kosten: €${monthlyHardwareCost.toFixed(2)}</p>
        <p>Geplanter Kartenumsatz pro Monat: €${monthlyVolume.toFixed(2)}</p>
        <p>Erwartete Transaktionen: ${transactions}</p>
        <p>Girocard: ${girocard}%</p>
        <p>Maestro: ${maestro}%</p>
        <p>Mastercard / VISA: ${mastercardVisa}%</p>
        <p>Business Card: ${businessCard}%</p>
        <h4>Gesamtkosten: €${totalCost.toFixed(2)}</h4>
    `;
}

function downloadOffer() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseInt(document.getElementById('transactions').value) || 0;
    const girocard = parseFloat(document.getElementById('girocard').value) || 0;
    const maestro = parseFloat(document.getElementById('maestro').value) || 0;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const businessCard = parseFloat(document.getElementById('businessCard').value) || 0;

    const hardwareSelect = document.getElementById('hardwareOption');
    const hardwareName = hardwareSelect.options[hardwareSelect.selectedIndex].text;

    const purchaseOption = document.getElementById('hardwareOptionPurchase').value;
    const rentalPeriod = document.getElementById('rentalPeriod').value;

    let monthlyHardwareCost = purchaseOption === "kaufen"
        ? parseFloat(hardwareSelect.selectedOptions[0].getAttribute('data-once-cost')) / (rentalPeriod === "12" ? 12 : rentalPeriod === "36" ? 36 : 60)
        : parseFloat(hardwareSelect.selectedOptions[0].getAttribute(`data-monthly-cost-${rentalPeriod}`)) || 0;

    let totalCost = monthlyHardwareCost;

    if (document.getElementById('competitorInclude').value === 'ja') {
        const competitorFee = parseFloat(document.getElementById('competitorFee').value) || 0;
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) || 0;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) || 0;
        const competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) || 0;
        const competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) || 0;

        const competitorTotal = (competitorFee * transactions) +
            (monthlyVolume * girocard / 100 * competitorGirocardFee) +
            (monthlyVolume * maestro / 100 * competitorMaestroFee) +
            (monthlyVolume * mastercardVisa / 100 * competitorMastercardFee) +
            (monthlyVolume * businessCard / 100 * competitorBusinessFee);

        totalCost += competitorTotal;
    }

    // Angebotstext
    let offerText = `DISH PAY Angebot\n\n`;
    offerText += `Hardware: ${hardwareName} (Monatliche Kosten: €${monthlyHardwareCost.toFixed(2)})\n`;
    offerText += `Geplanter Kartenumsatz pro Monat: €${monthlyVolume.toFixed(2)}\n`;
    offerText += `Erwartete Transaktionen: ${transactions}\n`;
    offerText += `Girocard: ${girocard}%\n`;
    offerText += `Maestro: ${maestro}%\n`;
    offerText += `Mastercard / VISA: ${mastercardVisa}%\n`;
    offerText += `Business Card: ${businessCard}%\n`;
    offerText += `\nGesamtkosten: €${totalCost.toFixed(2)}\n\n`;

    // Rechtliche Hinweise
    offerText += `\nWichtiger Hinweis: Dieses Angebot ist unverbindlich und stellt keine Kaufverpflichtung dar. Wir empfehlen Ihnen, die Optionen zu prüfen und bei Fragen Kontakt mit uns aufzunehmen.\n\n`;
    offerText += `Wir freuen uns darauf, Sie als Kunden zu gewinnen!`;

    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(offerText, 10, 10);
    doc.save('DISH_PAY_Angebot.pdf');
}
