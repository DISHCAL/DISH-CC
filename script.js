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
    const rentalPeriodSelect = document.getElementById('rentalPeriod');
    const purchaseOption = document.getElementById('hardwareOptionPurchase').value;

    const onceCost = parseFloat(hardwareSelect.selectedOptions[0].getAttribute('data-once-cost')) || 0;
    let monthlyCost = 0;

    if (purchaseOption === "kaufen") {
        monthlyCost = parseFloat(hardwareSelect.selectedOptions[0].getAttribute('data-monthly-cost-12')) || 0; // kein Mietpreis
    } else {
        const rentalPeriod = rentalPeriodSelect.value;
        monthlyCost = parseFloat(hardwareSelect.selectedOptions[0].getAttribute(`data-monthly-cost-${rentalPeriod}`)) || 0;
    }

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
    const purchaseOption = document.getElementById('hardwareOptionPurchase').value;
    const rentalPeriod = document.getElementById('rentalPeriod').value;
    const monthlyHardwareCost = purchaseOption === 'kaufen' ? 0 : parseFloat(hardwareSelect.selectedOptions[0].getAttribute(`data-monthly-cost-${rentalPeriod}`)) || 0;

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

    const purchaseOption = document.getElementById('hardwareOptionPurchase').value;
    const rentalPeriod = document.getElementById('rentalPeriod').value;

    let monthlyHardwareCost = 0;
    if (purchaseOption === "kaufen") {
        monthlyHardwareCost = 0;
    } else {
        monthlyHardwareCost = parseFloat(hardwareSelect.selectedOptions[0].getAttribute(`data-monthly-cost-${rentalPeriod}`)) || 0;
    }

    const competitorInclude = document.getElementById('competitorInclude').value;

    let offerText = `DISH PAY Angebot\n\nHardware: ${hardwareName} (Monatliche Kosten: €${monthlyHardwareCost.toFixed(2)})\n`;
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
