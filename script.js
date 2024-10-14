// Funktion zur Umschaltung zwischen schneller und ausführlicher Berechnung
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const detailedFields = document.getElementById('detailedFields');

    if (calculationType === 'schnell') {
        // Schnelle Berechnung: Zusätzliche Felder ausblenden
        detailedFields.style.display = 'none';
    } else if (calculationType === 'ausführlich') {
        // Ausführliche Berechnung: Zusätzliche Felder einblenden
        detailedFields.style.display = 'block';
    }
}

// Funktion zur Umschaltung der Mietoptionen basierend auf der Auswahl von Kauf oder Miete
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');

    // Mietoptionen nur anzeigen, wenn "Mieten" ausgewählt ist
    rentalOptions.style.display = purchaseOption === "mieten" ? 'block' : 'none';
}

// Funktion zur Aktualisierung der Mietpreise
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

// Funktion zur Berechnung der Hardwarekosten
function updateHardwareCosts() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const hardwareValue = hardwareSelect.value;

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

    return { onceCost: priceOnce, monthlyCost, hardwareValue };
}

// Hauptfunktion zur Berechnung der Kosten
function calculateCosts() {
    const calculationType = document.getElementById('calculationType').value;
    const purchaseOption = document.getElementById('purchaseOption').value;
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;

    // Prozentsätze für die Kartenarten
    const girocardFeePercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaFeePercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    let maestroFeePercentage = 0;
    let businessCardFeePercentage = 0;

    if (calculationType === 'ausführlich') {
        maestroFeePercentage = parseFloat(document.getElementById('maestro').value) || 0;
        businessCardFeePercentage = parseFloat(document.getElementById('businessCard').value) || 0;
    }

    // Validierung, dass die Summe der Prozentsätze 100% ergibt
    const totalPercentage = girocardFeePercentage + mastercardVisaFeePercentage + maestroFeePercentage + businessCardFeePercentage;
    if (totalPercentage !== 100) {
        alert("Die Summe der Kartenprozentsätze muss 100% ergeben.");
        return;
    }

    // Hardwarekosten
    const { onceCost, monthlyCost: hardwareMonthlyCost, hardwareValue } = updateHardwareCosts();

    // Anteile des Umsatzes für die einzelnen Kartenarten
    const girocardRevenue = monthlyVolume * (girocardFeePercentage / 100);
    const mastercardVisaRevenue = monthlyVolume * (mastercardVisaFeePercentage / 100);
    const maestroRevenue = monthlyVolume * (maestroFeePercentage / 100);
    const businessCardRevenue = monthlyVolume * (businessCardFeePercentage / 100);

    // Transaktionsgebühren DISH PAY
    const girocardFee = girocardRevenue * (monthlyVolume > 10000 ? 0.0029 : 0.0039);
    const mastercardVisaFee = mastercardVisaRevenue * 0.0089;
    const maestroFee = maestroRevenue * 0.0089;
    const businessCardFee = businessCardRevenue * 0.0289;

    // Gesamtsumme der Transaktionsgebühren DISH PAY
    const totalTransactionFees = girocardFee + mastercardVisaFee + maestroFee + businessCardFee;

    // SIM/Servicegebühr von 3,90 € nur für S1F2 und V400C Terminals
    let simServiceFee = 0;
    if (hardwareValue === "S1F2" || hardwareValue === "V400C") {
        simServiceFee = 3.90;
    }

    // Monatliche Gesamtkosten DISH PAY
    const totalMonthlyCost = totalTransactionFees + hardwareMonthlyCost + simServiceFee;

    // Einmalige Gesamtkosten DISH PAY
    const totalOneTimeCost = purchaseOption === "kaufen" ? onceCost : 0;

    // Ergebnisse anzeigen
    if (purchaseOption === "kaufen") {
        document.getElementById('oneTimeCost').innerText = `Einmalige Kosten (Kauf): ${totalOneTimeCost.toFixed(2)} €`;
        document.getElementById('monthlyCost').innerText = "";  // Keine monatlichen Mietkosten bei Kauf
    } else {
        document.getElementById('monthlyCost').innerText = `Monatliche Hardwarekosten (Miete): ${hardwareMonthlyCost.toFixed(2)} €`;
        document.getElementById('oneTimeCost').innerText = "";  // Keine einmaligen Kaufkosten bei Miete
    }

    document.getElementById('totalRevenue').innerText = `Transaktionsgebühren pro Monat: ${totalTransactionFees.toFixed(2)} €`;

    if (simServiceFee > 0) {
        document.getElementById('simServiceFee').innerText = `SIM/Servicegebühr: ${simServiceFee.toFixed(2)} €`;
    } else {
        document.getElementById('simServiceFee').innerText = ""; // Leer lassen, wenn keine Gebühr anfällt
    }

    document.getElementById('totalCost').innerText = `Monatliche Gesamtkosten DISH PAY: ${totalMonthlyCost.toFixed(2)} €`;
}

// PDF-Generierung mit jsPDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // Orange Farbe definieren
    const orangeColor = [255, 111, 0];

    // Setze Schriftart und Farbe
    doc.setFontSize(12);
    doc.setTextColor(...orangeColor);

    // SIM/Servicegebühr Text abrufen
    const simServiceFeeText = document.getElementById('simServiceFee').innerText;

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
${simServiceFeeText}
${document.getElementById('totalCost').innerText}
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
    toggleCalculationFields();
};

