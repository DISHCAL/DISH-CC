function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const purchaseOption = document.getElementById('purchaseOption').value;
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost'));
    let monthlyCost = 0;

    if (purchaseOption === "mieten") {
        const rentalPeriod = document.getElementById('rentalPeriod').value;
        monthlyCost = parseFloat(selectedHardware.getAttribute(`${rentalPeriod}-cost`));
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
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    const transactions = parseFloat(document.getElementById('transactions').value);
    const girocard = parseFloat(document.getElementById('girocard').value) / 100;
    const maestro = parseFloat(document.getElementById('maestro').value) / 100;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    const businessCard = parseFloat(document.getElementById('businessCard').value) / 100;

    // Überprüfung auf fehlende Eingaben
    if (isNaN(monthlyVolume) || isNaN(transactions) || isNaN(girocard) || isNaN(maestro) || isNaN(mastercardVisa) || isNaN(businessCard)) {
        alert("Bitte stellen Sie sicher, dass alle Eingaben korrekt sind.");
        return;
    }

    const { onceCost, monthlyCost } = updateHardwareCosts();
    const purchaseOption = document.getElementById('purchaseOption').value;

    // Berechnung der Gebühren
    const girocardFee = monthlyVolume * girocard;
    const maestroFee = monthlyVolume * maestro;
    const mastercardVisaFee = monthlyVolume * mastercardVisa;
    const businessCardFee = monthlyVolume * businessCard;

    const totalFees = girocardFee + maestroFee + mastercardVisaFee + businessCardFee;

    // Gesamtkosten abhängig von Kauf oder Miete
    let totalMonthlyCost;
    if (purchaseOption === "mieten") {
        totalMonthlyCost = monthlyCost + totalFees;
    } else {
        totalMonthlyCost = monthlyCost + totalFees;
    }

    // Ergebnis anzeigen
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h3>Ergebnisse</h3>
        <p>Einmalige Kosten: ${onceCost.toFixed(2)} €</p>
        <p>Monatliche Kosten: ${totalMonthlyCost.toFixed(2)} €</p>
        <p>Gesamtgebühren (Transaktionsgebühren): ${totalFees.toFixed(2)} €</p>
    `;
}

function downloadOffer() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('DISH PAY Angebot', 20, 20);
    doc.text(document.getElementById('results').innerText, 20, 40);
    doc.save('DISH_PAY_Angebot.pdf');
}
