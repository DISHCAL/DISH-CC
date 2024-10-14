// Funktion zur Berechnung der Hardwarekosten
function updateHardwareCosts() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    // Einmalige Kosten und monatliche Kosten aus den Datenattributen des ausgewählten Hardware-Elements
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
        monthlyCost = 0;  // Keine monatlichen Hardwarekosten bei Kauf
    }

    return { onceCost: priceOnce, monthlyCost };
}

// Funktion zum Umschalten der Mietoptionen basierend auf der Auswahl von Kauf oder Miete
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');

    // Mietoptionen nur anzeigen, wenn "Mieten" ausgewählt ist
    rentalOptions.style.display = purchaseOption === "mieten" ? 'block' : 'none';
}

// Hauptfunktion zur Berechnung der Kosten
function calculateCosts() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    
    // Prozentsätze für die Kartenarten
    const girocardFeePercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const maestroFeePercentage = parseFloat(document.getElementById('maestro').value) || 0;
    const mastercardVisaFeePercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const businessCardFeePercentage = parseFloat(document.getElementById('businessCard').value) || 0;
    
    // Hardwarekosten (aus der Funktion updateHardwareCosts)
    const { onceCost, monthlyCost: hardwareMonthlyCost } = updateHardwareCosts();
    
    // Anteile des Umsatzes für die einzelnen Kartenarten
    const girocardRevenue = monthlyVolume * (girocardFeePercentage / 100);
    const maestroRevenue = monthlyVolume * (maestroFeePercentage / 100);
    const mastercardVisaRevenue = monthlyVolume * (mastercardVisaFeePercentage / 100);
    const businessCardRevenue = monthlyVolume * (businessCardFeePercentage / 100);
    
    // Transaktionsgebühren (die relevanten Prozentsätze werden angewendet)
    const girocardFee = girocardRevenue * (monthlyVolume > 10000 ? 0.0029 : 0.0039);  // 0,29% oder 0,39% für Girocard
    const maestroFee = maestroRevenue * 0.0089;    // 0,89% für Maestro
    const mastercardVisaFee = mastercardVisaRevenue * 0.0089;  // 0,89% für Mastercard/VISA Privatkunden
    const businessCardFee = businessCardRevenue * 0.0289;  // 2,89% für Business Card (nicht-EWR Raum)

    // Gesamtsumme der Transaktionsgebühren
    const totalTransactionFees = girocardFee + maestroFee + mastercardVisaFee + businessCardFee;
    
    // Berechnung der monatlichen Gesamtkosten, falls gemietet
    let totalMonthlyCost = totalTransactionFees + hardwareMonthlyCost + 3.90;

    // Berechnung der einmaligen Kosten, falls gekauft
    let totalOneTimeCost = purchaseOption === "kaufen" ? onceCost : 0;

    // Ausgabe der Ergebnisse
    if (purchaseOption === "kaufen") {
        document.getElementById('oneTimeCost').innerText = `Einmalige Kosten (Kauf): ${totalOneTimeCost.toFixed(2)} €`;
        document.getElementById('monthlyCost').innerText = "";  // Keine monatlichen Mietkosten bei Kauf
    } else {
        document.getElementById('monthlyCost').innerText = `Monatliche Hardwarekosten (Miete): ${hardwareMonthlyCost.toFixed(2)} €`;
        document.getElementById('oneTimeCost').innerText = "";  // Keine einmaligen Kaufkosten bei Miete
    }

    document.getElementById('totalRevenue').innerText = `Transaktionsgebühren pro Monat: ${totalTransactionFees.toFixed(2)} €`;
    document.getElementById('totalCost').innerText = `Monatliche Gesamtkosten: ${totalMonthlyCost.toFixed(2)} €`;

    // Wenn Wettbewerbsgebühren berechnet werden sollen
    const competitorIncluded = document.getElementById('competitorInclude').value === "ja";
    if (competitorIncluded) {
        const transactions = parseFloat(document.getElementById('transactions').value) || 0;
        const competitorFee = parseFloat(document.getElementById('competitorFee').value) || 0;
        const competitorCreditFee = parseFloat(document.getElementById('competitorCreditFee').value) || 0;
        const competitorClearingFee = parseFloat(document.getElementById('competitorClearing').value) || 0;
        
        const competitorTotal = transactions * (competitorFee + competitorCreditFee + competitorClearingFee);
        const competitorSavings = competitorTotal - totalMonthlyCost;
        
        document.getElementById('competitorTotal').innerText = `Wettbewerberkosten pro Monat: ${competitorTotal.toFixed(2)} €`;
        document.getElementById('competitorSavings').innerText = `Monatliche Ersparnis gegenüber Wettbewerber: ${competitorSavings.toFixed(2)} €`;
    }
}

// Funktion zur Aktualisierung der Mietpreise basierend auf der ausgewählten Hardware
function updateRentalPrices() {
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    const rentalPeriodSelect = document.getElementById('rentalPeriod');

    const price12 = selectedHardware.getAttribute('data-price-12');
    const price36 = selectedHardware.getAttribute('data-price-36');
    const price60 = selectedHardware.getAttribute('data-price-60');

    rentalPeriodSelect.options[0].text = `12 Monate - ${price12} €/Monat`;
    rentalPeriodSelect.options[1].text = `36 Monate - ${price36} €/Monat`;
    rentalPeriodSelect.options[2].text = `60 Monate - ${price60} €/Monat`;
}

// PDF-Generierung mit jsPDF (angepasst)
function downloadPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // Orange Farbe definieren
    const orangeColor = [255, 111, 0];

    // Setze Schriftart und Farbe
    doc.setFontSize(12);
    doc.setTextColor(...orangeColor);

    // Kundentext
    const text = `
Guten Tag,

hier ist Ihr unverbindliches Angebot basierend auf Ihren Berechnungen.
Unten sind die detaillierten Kosten aufgelistet.

Gute Geschäfte wünscht Ihnen
Ihr DISH Team

Wichtige rechtliche Hinweise:
Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken.

Ergebnisse:
${document.getElementById('oneTimeCost').innerText}
${document.getElementById('monthlyCost').innerText}
${document.getElementById('totalRevenue').innerText}
${document.getElementById('totalCost').innerText}

Ersparnis im Vergleich zum Wettbewerber (falls berechnet):
${document.getElementById('competitorSavings').innerText || 'N/A'}
`;

    // Text in die PDF einfügen
    const lines = doc.splitTextToSize(text, 180);
    doc.text(15, 20, lines);

    // PDF speichern
    doc.save("dish-pay-angebot.pdf");
}

window.onload = function() {
    updateRentalPrices();
    toggleRentalOptions();
};

