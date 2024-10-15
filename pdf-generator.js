function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Titel
    doc.setFontSize(18);
    doc.setTextColor("#e67e22");
    doc.text("DISH PAY Angebot", 10, 10);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Die Informationen aus den Ergebnisfeldern abrufen
    const totalCostText = document.getElementById('totalCost').innerText.split(":")[1] || "-";
    const monthlyCostText = document.getElementById('monthlyCost').innerText.split(":")[1] || "-";
    const simServiceFeeText = document.getElementById('simServiceFee').innerText.split(":")[1] || "-";
    const oneTimeCostText = document.getElementById('oneTimeCost').innerText.split(":")[1] || "-";
    const totalDisagioFeeText = document.getElementById('disagioFees').innerText.split(":")[1] || "-";

    // Erstellen einer Tabelle für die Kostenübersicht
    doc.autoTable({
        startY: 20,
        head: [['Beschreibung', 'Betrag (€)']],
        body: [
            ['Gebühren gesamt', totalDisagioFeeText.trim()],
            ['Monatliche Hardwarekosten', monthlyCostText.trim()],
            ['SIM/Servicegebühr', simServiceFeeText.trim()],
            ['Monatliche Gesamtkosten', totalCostText.trim()],
            ['Einmalige Kosten (bei Kauf)', oneTimeCostText.trim()]
        ]
    });

    // Angebotstext hinzufügen
    doc.setFontSize(16);
    doc.setTextColor("#e67e22");
    doc.text("Wir freuen uns, Ihnen dieses attraktive Angebot von DISH PAY", 10, doc.autoTable.previous.finalY + 10);
    doc.text("präsentieren zu dürfen.", 10, doc.autoTable.previous.finalY + 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Mit unserer Lösung ermöglichen wir Ihnen eine schnelle, sichere", 10, doc.autoTable.previous.finalY + 30);
    doc.text("und effiziente Zahlungsabwicklung, die perfekt auf die Bedürfnisse", 10, doc.autoTable.previous.finalY + 40);
    doc.text("Ihres Geschäfts zugeschnitten ist.", 10, doc.autoTable.previous.finalY + 50);

    doc.text("Sichern Sie sich jetzt Ihre maßgeschneiderte Lösung und starten Sie durch!", 10, doc.autoTable.previous.finalY + 70);

    // Gruß und rechtlicher Hinweis
    doc.text("Ihr DISH Team", 10, doc.autoTable.previous.finalY + 90);

    doc.setFontSize(10);
    doc.text("Rechtlicher Hinweis:", 10, doc.autoTable.previous.finalY + 110);
    doc.text("Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken.", 10, doc.autoTable.previous.finalY + 120);

    // Speichern der PDF-Datei
    doc.save("DISH_Angebot.pdf");
}
