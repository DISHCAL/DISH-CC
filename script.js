// JavaScript file to handle cost calculations and interaction logic
function toggleRentalOptions() {
    const rentalOptions = document.getElementById('rentalOptions');
    rentalOptions.style.display = document.getElementById('purchaseOption').value === 'mieten' ? 'block' : 'none';
}

function calculateCosts() {
    // Eingabewerte holen
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseFloat(document.getElementById('transactions').value) || 0;
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const maestroPercentage = parseFloat(document.getElementById('maestro').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    // Hardware-Kosten holen
    const hardwareSelect = document.getElementById('hardwareOption');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const purchaseOption = document.getElementById('purchaseOption').value;
    
    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost')) || 0;
    let monthlyCost = 0;

    if (purchaseOption === "mieten") {
        const rentalPeriod = document.getElementById('rentalPeriod').value;
        monthlyCost = parseFloat(selectedHardware.getAttribute(`${rentalPeriod}`)) || 0;
    } else {
        monthlyCost = parseFloat(selectedHardware.getAttribute('data-monthly-cost')) || 0;
    }

    // Berechnung der Gebühren pro Transaktion basierend auf der hochgeladenen Kalkulation
    const girocardCost = (girocardPercentage / 100) * monthlyVolume * 0.0039;
    const maestroCost = (maestroPercentage / 100) * monthlyVolume * 0.0089;
    const mastercardVisaCost = (mastercardVisaPercentage / 100) * monthlyVolume * 0.0129;
    const businessCardCost = (businessCardPercentage / 100) * monthlyVolume * 0.0289;

    // Gesamtkosten berechnen
    const totalTransactionCost = girocardCost + maestroCost + mastercardVisaCost + businessCardCost;
    const totalMonthlyCost = totalTransactionCost + monthlyCost;
    const totalOnceCost = purchaseOption === "kaufen" ? onceCost : 0;

    // Ergebnisse anzeigen
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h3>Berechnungsergebnisse:</h3>
        <p>Einmalige Kosten: € ${totalOnceCost.toFixed(2)}</p>
        <p>Monatliche Kosten: € ${totalMonthlyCost.toFixed(2)}</p>
    `;
}

function generatePDF() {
    // PDF-Erstellung mit den Ergebnissen
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Farben und Design setzen
    doc.setTextColor(255, 127, 32); // Orange Akzentfarbe
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Unverbindliches Angebot - DISH PAY', 10, 20);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Schwarzer Text
    doc.setFont('helvetica', 'normal');
    doc.text('Vielen Dank, dass Sie sich für unser DISH PAY Angebot interessieren.', 10, 35);
    doc.text('Nachfolgend finden Sie eine detaillierte Übersicht der berechneten Kosten:', 10, 45);

    // Berechnungsergebnisse einfügen
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseFloat(document.getElementById('transactions').value) || 0;
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const maestroPercentage = parseFloat(document.getElementById('maestro').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    const hardwareSelect = document.getElementById('hardwareOption');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const purchaseOption = document.getElementById('purchaseOption').value;
    
    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost')) || 0;
    let monthlyCost = 0;

    if (purchaseOption === "mieten") {
        const rentalPeriod = document.getElementById('rentalPeriod').value;
        monthlyCost = parseFloat(selectedHardware.getAttribute(`${rentalPeriod}`)) || 0;
    } else {
        monthlyCost = parseFloat(selectedHardware.getAttribute('data-monthly-cost')) || 0;
    }

    const girocardCost = (girocardPercentage / 100) * monthlyVolume * 0.0039;
    const maestroCost = (maestroPercentage / 100) * monthlyVolume * 0.0089;
    const mastercardVisaCost = (mastercardVisaPercentage / 100) * monthlyVolume * 0.0129;
    const businessCardCost = (businessCardPercentage / 100) * monthlyVolume * 0.0289;
    const totalTransactionCost = girocardCost + maestroCost + mastercardVisaCost + businessCardCost;
    const totalMonthlyCost = totalTransactionCost + monthlyCost;
    const totalOnceCost = purchaseOption === "kaufen" ? onceCost : 0;

    doc.text(`Geplanter Kartenumsatz pro Monat: € ${monthlyVolume.toFixed(2)}`, 10, 60);
    doc.text(`Erwartete Anzahl monatlicher Transaktionen: ${transactions}`, 10, 70);
    doc.text(`Einmalige Kosten: € ${totalOnceCost.toFixed(2)}`, 10, 80);
    doc.text(`Monatliche Kosten: € ${totalMonthlyCost.toFixed(2)}`, 10, 90);

    // Kundenorientierter Text
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 127, 32);
    doc.text('Warum DISH PAY?', 10, 110);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Mit DISH PAY bieten wir Ihnen eine sichere, kostengünstige und komfortable Lösung ', 10, 120);
    doc.text('für den bargeldlosen Zahlungsverkehr. Unsere modernen Terminals und transparenten ', 10, 130);
    doc.text('Kostenmodelle sorgen dafür, dass Sie Ihre Kunden schnell und zuverlässig bedienen können.', 10, 140);

    doc.setFont('helvetica', 'italic');
    doc.text('Dieses Angebot ist unverbindlich und freibleibend.', 10, 160);

    // PDF speichern
    doc.save('DISH_PAY_Angebot.pdf');
}

// Eventlistener für den Download-Button
document.getElementById('downloadOffer').addEventListener('click', generatePDF);
