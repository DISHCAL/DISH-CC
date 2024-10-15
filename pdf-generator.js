function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Titel der PDF-Datei
    doc.setFontSize(18);
    doc.setTextColor("#e67e22");
    doc.text("Angebot von DISH", 10, 10);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Abrufen der Informationen aus den Ergebnisfeldern
    const totalCostText = document.getElementById('totalCost') ? document.getElementById('totalCost').innerText.split(":")[1] || "-" : "-";
    const monthlyCostText = document.getElementById('monthlyCost') ? document.getElementById('monthlyCost').innerText.split(":")[1] || "-" : "-";
    const simServiceFeeText = document.getElementById('simServiceFee') ? document.getElementById('simServiceFee').innerText.split(":")[1] || "-" : "-";
    const oneTimeCostText = document.getElementById('oneTimeCost') ? document.getElementById('oneTimeCost').innerText.split(":")[1] || "-" : "-";
    const totalDisagioFeeText = document.getElementById('disagioFees') ? document.getElementById('disagioFees').innerText.split(":")[1] || "-" : "-";

    // Tabelle für die Kostenübersicht erstellen
    doc.autoTable({
        startY: 20,
        headStyles: { fillColor: [230, 126, 34] },  // Orange Hintergrund für Tabellenkopf
        bodyStyles: { fillColor: [245, 245, 245] }, // Grauer Hintergrund für den Tabelleninhalt
        head: [['Beschreibung', 'Betrag (€)']],
        body: [
            ['Gebühren gesamt', totalDisagioFeeText.trim()],
            ['Monatliche Hardwarekosten', monthlyCostText.trim()],
            ['SIM/Servicegebühr', simServiceFeeText.trim()],
            [{ content: 'Monatliche Gesamtkosten', styles: { fontStyle: 'bold', textColor: [230, 126, 34] } }, { content: totalCostText.trim(), styles: { fontStyle: 'bold', textColor: [230, 126, 34] } }],
            [{ content: 'Einmalige Kosten (bei Kauf)', styles: { fontStyle: 'bold', textColor: [230, 126, 34] } }, { content: oneTimeCostText.trim(), styles: { fontStyle: 'bold', textColor: [230, 126, 34] } }]
        ]
    });

    // Angebotstext hinzufügen
    doc.setFontSize(16);
    doc.setTextColor("#e67e22");
    doc.text("Ihr individuelles Angebot von DISH", 10, doc.autoTable.previous.finalY + 10);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Sehr geehrter Kunde,", 10, doc.autoTable.previous.finalY + 20);
    doc.text("wir freuen uns, Ihnen ein maßgeschneidertes Angebot für die Nutzung von", 10, doc.autoTable.previous.finalY + 30);
    doc.text("unseren DISH PAY-Lösungen unterbreiten zu dürfen. Mit unserem Angebot", 10, doc.autoTable.previous.finalY + 40);
    doc.text("profitieren Sie von einer zuverlässigen und effizienten Zahlungsabwicklung, ", 10, doc.autoTable.previous.finalY + 50);
    doc.text("die speziell auf die Bedürfnisse Ihres Unternehmens abgestimmt ist.", 10, doc.autoTable.previous.finalY + 60);

    doc.text("Ihre Vorteile auf einen Blick:", 10, doc.autoTable.previous.finalY + 75);
    doc.text("• Einfache und sichere Abwicklung von Kartenzahlungen", 10, doc.autoTable.previous.finalY + 85);
    doc.text("• Optimierte Transaktionsgebühren für maximale Kosteneffizienz", 10, doc.autoTable.previous.finalY + 95);
    doc.text("• Transparentes Preis-Leistungs-Verhältnis", 10, doc.autoTable.previous.finalY + 105);
    doc.text("• Flexibel anpassbare Hardware-Optionen, passend für Ihr Geschäftsmodell", 10, doc.autoTable.previous.finalY + 115);

    doc.text("Wir stehen Ihnen bei Fragen jederzeit gerne zur Verfügung und freuen uns,", 10, doc.autoTable.previous.finalY + 130);
    doc.text("Ihr Unternehmen mit unseren Produkten zu unterstützen.", 10, doc.autoTable.previous.finalY + 140);

    // Gruß und rechtlicher Hinweis
    doc.text("Mit freundlichen Grüßen,", 10, doc.autoTable.previous.finalY + 155);
    doc.text("Ihr DISH Team", 10, doc.autoTable.previous.finalY + 165);

    doc.setFontSize(10);
    doc.text("Rechtlicher Hinweis:", 10, doc.autoTable.previous.finalY + 180);
    doc.text("Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken.", 10, doc.autoTable.previous.finalY + 190);

    // Speichern der PDF-Datei
    doc.save("DISH_Angebot.pdf");
}
