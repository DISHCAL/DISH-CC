function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const rentalPeriod = document.getElementById('rentalPeriod').value;
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost'));
    let monthlyCost = 0;

    if (rentalPeriod === "mieten") {
        const rentalDuration = document.querySelector('input[name="rentalDuration"]:checked');
        if (rentalDuration) {
            monthlyCost = parseFloat(selectedHardware.getAttribute(`data-${rentalDuration.value}-m-cost`));
        }
    } else {
        monthlyCost = 0; // Beim Kauf gibt es keine monatlichen Kosten, aber einmalige Kosten
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

    if (isNaN(monthlyVolume) || isNaN(transactions) || isNaN(girocard) || isNaN(maestro) || isNaN(mastercardVisa) || isNaN(businessCard)) {
        alert("Bitte füllen Sie alle erforderlichen Felder aus.");
        return;
    }

    // Berechnung der Gebühren
    const girocardFee = monthlyVolume * girocard * (monthlyVolume < 10000 ? 0.0039 : 0.0029);
    const maestroFee = monthlyVolume * maestro * 0.0079;
    const mastercardVisaFee = monthlyVolume * mastercardVisa * 0.0089;
    const businessCardFee = monthlyVolume * businessCard * 0.0289;

    const totalFees = girocardFee + maestroFee + mastercardVisaFee + businessCardFee;

    // Gesamtkosten
    const totalMonthlyCosts = totalFees + monthlyCost;
    const totalOnceCosts = onceCost;

    // Ergebnisse anzeigen
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h3>Berechnungsergebnisse</h3>
        <p><strong>Einmalige Kosten:</strong> ${totalOnceCosts.toFixed(2)} €</p>
        <p><strong>Monatliche Kosten (inkl. Gebühren):</strong> ${totalMonthlyCosts.toFixed(2)} €</p>
    `;
}

function downloadOffer() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("DISH PAY Angebot", 20, 20);
    doc.text(`Geplanter Umsatz: ${document.getElementById('monthlyVolume').value} €`, 20, 30);
    doc.text(`Anzahl Transaktionen: ${document.getElementById('transactions').value}`, 20, 40);
    doc.text(`Einmalige Kosten: ${document.getElementById('results').querySelector('strong').innerText.split(': ')[1]}`, 20, 50);
    doc.text(`Monatliche Kosten: ${document.getElementById('results').querySelectorAll('strong')[1].innerText.split(': ')[1]}`, 20, 60);

    doc.save("DISH_PAY_Angebot.pdf");
}
