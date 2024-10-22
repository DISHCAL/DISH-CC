function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Kundeninformationen
    const gender = document.getElementById('gender').value;
    const customerName = document.getElementById('customerName').value;

    // Überprüfen, ob der Kundenname eingegeben wurde
    if (!customerName.trim()) {
        alert("Bitte geben Sie den Kundennamen ein, bevor Sie das PDF herunterladen.");
        return;
    }

    const calculationType = document.getElementById('calculationType').value;

    // Kundenansprache
    let customerAddress = `Sehr geehrte${gender === 'Frau' ? ' Frau' : 'r Herr'} ${customerName},`;
    let offerText = `
    Vielen Dank für Ihr Interesse an DISH PAY.
    Anbei erhalten Sie unser unverbindliches Angebot basierend auf Ihren Eingaben.
    Unten finden Sie eine detaillierte Übersicht der Kosten.
    `;

    // PDF-Dokument starten
    doc.setFontSize(18);
    doc.text("DISH PAY Angebot", 10, 20);
    doc.setFontSize(12);
    doc.text(customerAddress, 10, 40);
    doc.text(offerText, 10, 50);

    // Tabelleninhalte erstellen
    const tableContent = [];

    if (calculationType === 'schnell') {
        tableContent.push(
            ['Kostenart', 'Betrag'],
            ['Monatliche Hardwarekosten', '44,90 €'],
            ['SIM-Kosten', 'Keine SIM/Servicegebühr'],
            ['Gebühren gesamt', 'Wird berechnet'],
            ['Monatliche Gesamtkosten', 'Wird berechnet']
        );
    } else if (calculationType === 'ausführlich') {
        const dishPayTotalCost = calculateDishPayCosts();
        const competitorCost = calculateCompetitorCosts();
        const savings = (competitorCost - dishPayTotalCost).toFixed(2);

        tableContent.push(
            ['Kostenart', 'Betrag'],
            ['Monatliche Hardwarekosten', '44,90 €'],
            ['SIM-Kosten', 'Wird berechnet'],
            ['Gebühren gesamt', `${dishPayTotalCost.toFixed(2)} €`],
            ['Wettbewerberkosten', `${competitorCost.toFixed(2)} €`],
            ['Monatliche Ersparnis mit DISH PAY', `${savings} €`],
            ['Monatliche Gesamtkosten', 'Wird berechnet']
        );
    }

    // Tabelle im PDF einfügen
    doc.autoTable({
        head: [['Kategorie', 'Kosten']],
        body: tableContent,
        startY: 80,
        styles: {
            fillColor: [255, 165, 0], // Orange Farbe für die Tabelle
            textColor: [0, 0, 0],     // Schwarzer Text
        },
        headStyles: {
            fillColor: [255, 140, 0], // Dunklere Orange für den Kopf
        },
        alternateRowStyles: {
            fillColor: [255, 235, 205], // Hellere Orange für abwechselnde Zeilen
        },
    });

    // Gebührenhinweis hinzufügen
    const feeDisclaimer = `
    Hinweis zu den Gebühren:
    - Transaktionspreis: 0,06 € pro Transaktion
    - Girocard-Gebühr bis 10.000 € monatlich: 0,39%
    - Girocard-Gebühr über 10.000 € monatlich: 0,29%
    - Disagio Maestro / VPAY: 0,89%
    - Disagio Mastercard/VISA Privatkunden: 0,89%
    - Disagio Mastercard/VISA Business und NICHT-EWR-RAUM: 2,89%
    `;
    
    doc.setFontSize(12);
    doc.text("Hinweis zu den Gebühren:", 10, 140);
    doc.setFontSize(10);
    doc.text(feeDisclaimer, 10, 150);

    // Rechtlicher Hinweis hinzufügen
    const legalText = `
    Dieses Angebot ist freibleibend und unverbindlich. 
    Es dient lediglich als Information und stellt kein rechtlich bindendes Angebot dar. 
    Die angegebenen Gebühren und Kosten können je nach tatsächlichem Transaktionsvolumen variieren. 
    Bei Rückfragen stehen wir Ihnen gerne zur Verfügung.
    `;
    doc.setFontSize(10);
    doc.text(legalText, 10, 190);

    // PDF-Datei generieren und herunterladen
    doc.save(`${customerName}_DISH_PAY_Angebot.pdf`);
}
