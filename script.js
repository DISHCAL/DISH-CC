document.addEventListener("DOMContentLoaded", () => {
    // Event listeners für dynamische Updates
    document.getElementById('calculationType').addEventListener('change', toggleCalculationFields);
    document.getElementById('purchaseOption').addEventListener('change', () => {
        toggleRentalOptions();
        updateRentalPrices();
    });
    document.getElementById('hardware').addEventListener('change', updateRentalPrices);
});

// Funktion zum Umschalten der Berechnungsfelder (schnell/ausführlich)
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const businessCardField = document.getElementById('businessCardField');
    const maestroField = document.getElementById('maestroField');
    const competitorMaestroField = document.getElementById('competitorMaestroField');
    const competitorBusinessCardField = document.getElementById('competitorBusinessCardField');
    const competitorSection = document.getElementById('competitorSection');

    // Bei schneller Berechnung nur Girocard und Mastercard/VISA anzeigen
    if (calculationType === 'schnell') {
        businessCardField.classList.add('hidden');
        maestroField.classList.add('hidden');
        competitorMaestroField.classList.add('hidden');
        competitorBusinessCardField.classList.add('hidden');
        competitorSection.classList.add('hidden');  // Wettbewerber ausblenden
    } else {
        // Bei ausführlicher Berechnung alle Felder anzeigen
        businessCardField.classList.remove('hidden');
        maestroField.classList.remove('hidden');
        competitorMaestroField.classList.remove('hidden');
        competitorBusinessCardField.classList.remove('hidden');
        competitorSection.classList.remove('hidden');  // Wettbewerber anzeigen
    }
}

// Funktion zum Umschalten der Mietoptionen
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');
    rentalOptions.style.display = purchaseOption === "mieten" ? 'block' : 'none';
}

// Funktion zum Aktualisieren der Mietpreise basierend auf der Hardware-Auswahl
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

// Funktion zur Generierung eines PDFs
function generatePDF() {
    const doc = new jspdf.jsPDF();

    // Titel des PDFs
    doc.setFontSize(18);
    doc.setTextColor("#e67e22");
    doc.text("DISH PAY Angebot", 10, 10);

    // Tabellenform für die Ergebnisse
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.autoTable({
        startY: 20,
        head: [['Beschreibung', 'Betrag (€)']],
        body: [
            ['Gebühren gesamt', document.getElementById('disagioFees').innerText.split(":")[1]],
            ['Monatliche Hardwarekosten', document.getElementById('monthlyCost').innerText.split(":")[1] || '-'],
            ['SIM/Servicegebühr', document.getElementById('simServiceFee').innerText.split(":")[1] || '-'],
            ['Monatliche Gesamtkosten', document.getElementById('totalCost').innerText.split(":")[1]],
            ['Einmalige Kosten (bei Kauf)', document.getElementById('oneTimeCost').innerText.split(":")[1] || '-']
        ]
    });

    // Kundenorientierter Text
    doc.setFontSize(16);
    doc.setTextColor("#e67e22");
    doc.text("Wir freuen uns, Ihnen dieses attraktive Angebot von DISH PAY", 10, doc.autoTable.previous.finalY + 10);
    doc.text("präsentieren zu dürfen.", 10, doc.autoTable.previous.finalY + 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Mit unserer Lösung ermöglichen wir Ihnen eine schnelle, sichere", 10, doc.autoTable.previous.finalY + 30);
    doc.text("und effiziente Zahlungsabwicklung, die perfekt auf die Bedürfnisse", 10, doc.autoTable.previous.finalY + 40);
    doc.text("Ihres Geschäfts zugeschnitten ist. Profitieren Sie von transparenter", 10, doc.autoTable.previous.finalY + 50);
    doc.text("Preisgestaltung, unkomplizierter Nutzung und modernster Technologie.", 10, doc.autoTable.previous.finalY + 60);

    doc.text("Sichern Sie sich jetzt Ihre maßgeschneiderte Lösung und starten Sie durch!", 10, doc.autoTable.previous.finalY + 80);

    doc.text("Ihr DISH Team", 10, doc.autoTable.previous.finalY + 100);
    doc.text("Zuverlässige Zahlungsabwicklung für erfolgreiche Geschäfte.", 10, doc.autoTable.previous.finalY + 110);

    // Rechtlicher Hinweis
    doc.setFontSize(10);
    doc.text("Rechtlicher Hinweis:", 10, doc.autoTable.previous.finalY + 130);
    doc.text("Dieses Angebot ist unverbindlich und dient ausschließlich zu", 10, doc.autoTable.previous.finalY + 140);
    doc.text("Informationszwecken. Die angegebenen Preise und Konditionen", 10, doc.autoTable.previous.finalY + 150);
    doc.text("können sich ändern. Für eine rechtsverbindliche Auskunft", 10, doc.autoTable.previous.finalY + 160);
    doc.text("kontaktieren Sie uns bitte direkt.", 10, doc.autoTable.previous.finalY + 170);

    // PDF speichern
    doc.save("DISH_Angebot.pdf");
}
