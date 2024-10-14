function toggleCompetitorFields() {
    const competitorSection = document.getElementById('competitorSection');
    const competitorSelect = document.getElementById('competitorInclude').value;

    if (competitorSelect === 'ja') {
        competitorSection.style.display = 'block';
    } else {
        competitorSection.style.display = 'none';
    }
}

function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const onceCost = hardwareSelect.selectedOptions[0].getAttribute('data-once-cost');
    const monthlyCost = hardwareSelect.selectedOptions[0].getAttribute('data-monthly-cost');

    document.getElementById('onceCost').value = onceCost;
    document.getElementById('monthlyCost').value = monthlyCost;
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseInt(document.getElementById('transactions').value) || 0;
    const girocard = parseFloat(document.getElementById('girocard').value) || 0;
    const maestro = parseFloat(document.getElementById('maestro').value) || 0;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const businessCard = parseFloat(document.getElementById('businessCard').value) || 0;

    const hardwareSelect = document.getElementById('hardwareOption');
    const monthlyHardwareCost = parseFloat(hardwareSelect.selectedOptions[0].getAttribute('data-monthly-cost')) || 0;

    const competitorInclude = document.getElementById('competitorInclude').value;

    let totalCost = monthlyHardwareCost;

    if (competitorInclude === 'ja') {
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
    resultDiv.innerHTML = `<h4>Gesamtkosten: €${totalCost.toFixed(2)}</h4>`;
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

    const competitorInclude = document.getElementById('competitorInclude').value;

    let offerText = `DISH PAY Angebot\n\nHardware: ${hardwareName}\n`;
    offerText += `Geplanter Kartenumsatz pro Monat: €${monthlyVolume.toFixed(2)}\n`;
    offerText += `Erwartete Transaktionen: ${transactions}\n`;
    offerText += `Girocard: ${girocard}%\n`;
    offerText += `Maestro: ${maestro}%\n`;
    offerText += `Mastercard / VISA: ${mastercardVisa}%\n`;
    offerText += `Business Card: ${businessCard}%\n\n`;

    if (competitorInclude === 'ja') {
        const competitorFee = parseFloat(document.getElementById('competitorFee').value) || 0;
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) || 0;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) || 0;
        const competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) || 0;
        const competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) || 0;

        offerText += `Wettbewerber Gebühr pro Transaktion: €${competitorFee}\n`;
        offerText += `Wettbewerber Girocard Gebühr: ${competitorGirocardFee}%\n`;
        offerText += `Wettbewerber Maestro Gebühr: ${competitorMaestroFee}%\n`;
        offerText += `Wettbewerber Mastercard Gebühr: ${competitorMastercardFee}%\n`;
        offerText += `Wettbewerber Business Card Gebühr: ${competitorBusinessFee}%\n`;
    }

    doc.text(offerText, 10, 10);
    doc.save('DISH_PAY_Angebot.pdf');
}
