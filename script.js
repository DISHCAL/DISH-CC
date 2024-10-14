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
    const onceCost = hardwareSelect.selectedOptions[0].getAttribute('data-once-cost');
    const monthlyCost = hardwareSelect.selectedOptions[0].getAttribute('data-monthly-cost');

    document.getElementById('onceCost').value = onceCost;
    document.getElementById('monthlyCost').value = monthlyCost;
}

function calculateCosts() {
    // Eingaben des Benutzers
    let monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    let transactions = parseFloat(document.getElementById('transactions').value);

    // Überprüfen auf fehlende Werte
    if (isNaN(monthlyVolume) || isNaN(transactions)) {
        alert('Bitte stellen Sie sicher, dass alle Werte eingegeben sind.');
        return;
    }

    // Gebührenprozentwerte
    const girocardPercent = parseFloat(document.getElementById('girocard').value) / 100;
    const maestroPercent = parseFloat(document.getElementById('maestro').value) / 100;
    const mastercardVisaPercent = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    const businessCardPercent = parseFloat(document.getElementById('businessCard').value) / 100;

    // Hardwareoptionen
    let hardwareOption = document.getElementById('hardwareOption');
    let hardwareRentalCost = hardwareOption.selectedOptions[0].getAttribute('data-monthly-cost'); // Monatliche Mietkosten
    let hardwareCost = hardwareOption.selectedOptions[0].getAttribute('data-once-cost'); // Einmalige Kosten

    // Berechnung der DISH Kosten
    let dishCost = transactions * 0.0089 + parseFloat(hardwareRentalCost);

    // Gebührenberechnung
    let girocardFee = monthlyVolume < 10000 ? 0.0039 : 0.0029; // Gebühren je nach Umsatz
    dishCost += transactions * girocardFee;
    dishCost += monthlyVolume * maestroPercent * 0.0079;
    dishCost += monthlyVolume * mastercardVisaPercent * 0.0089;
    dishCost += monthlyVolume * businessCardPercent * 0.0289;

    // Wettbewerberkosten (wenn gewählt)
    let competitorInclude = document.getElementById('competitorInclude').value;
    let competitorCost = 0;

    if (competitorInclude === 'ja') {
        let competitorFee = parseFloat(document.getElementById('competitorFee').value);
        let competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100;
        let competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100;
        let competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) / 100;
        let competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) / 100;

        competitorCost = transactions * competitorFee;
        competitorCost += monthlyVolume * girocardPercent * competitorGirocardFee;
        competitorCost += monthlyVolume * maestroPercent * competitorMaestroFee;
        competitorCost += monthlyVolume * mastercardVisaPercent * competitorMastercardFee;
        competitorCost += monthlyVolume * businessCardPercent * competitorBusinessFee;
    }

    // Ergebnisse anzeigen
    document.getElementById('results').innerHTML = `
        <p><strong>Monatliche DISH Kosten:</strong> ${dishCost.toFixed(2).replace('.', ',')} €</p>
        ${competitorInclude === 'ja' ? `<p><strong>Monatliche Wettbewerber Kosten:</strong> ${competitorCost.toFixed(2).replace('.', ',')} €</p>` : ''}
        <p><strong>Einmalige Hardwarekosten:</strong> ${hardwareCost} €</p>
        <p><strong>Monatliche Mietkosten der Hardware:</strong> ${hardwareRentalCost} €</p>
    `;
}

function downloadOffer() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(12);
    pdf.text('DISH PAY - Angebot', 10, 10);
    pdf.text('-----------------------', 10, 15);
    pdf.text('Hier ist Ihr Angebot basierend auf den eingegebenen Daten.', 10, 20);
    pdf.text('Dieses Angebot ist unverbindlich und dient lediglich zur Information.', 10, 25);
    
    // Extrahiere die Ergebnisse aus der Anzeige
    const dishCost = document.getElementById('results').innerText.match(/Monatliche DISH Kosten:\s*(\d+,\d+)/)[1];
    const competitorInclude = document.getElementById('competitorInclude').value;

    pdf.text(`Monatliche DISH Kosten: ${dishCost} €`, 10, 35);
    
    if (competitorInclude === 'ja') {
        const competitorCost = document.getElementById('results').innerText.match(/Monatliche Wettbewerber Kosten:\s*(\d+,\d+)/)[1];
        pdf.text(`Monatliche Wettbewerber Kosten: ${competitorCost} €`, 10, 40);
    }

    // Einmalige und monatliche Hardwarekosten
    const hardwareCost = document.getElementById('results').innerText.match(/Einmalige Hardwarekosten:\s*(\d+,\d+)/)[1];
    const monthlyRentalCost = document.getElementById('results').innerText.match(/Monatliche Mietkosten der Hardware:\s*(\d+,\d+)/)[1];

    pdf.text(`Einmalige Hardwarekosten: ${hardwareCost} €`, 10, 45);
    pdf.text(`Monatliche Mietkosten der Hardware: ${monthlyRentalCost} €`, 10, 50);

    // Füge die Gebührenübersicht hinzu
    pdf.text('Wichtige Informationen zu den Gebühren:', 10, 55);
    pdf.text('EC-Karten Gebühr unter 10.000 €: 0,39 %', 10, 60);
    pdf.text('EC-Karten Gebühr über 10.000 €: 0,29 %', 10, 65);
    pdf.text('Maestro / VPAY Gebühr: 0,79 %', 10, 70);
    pdf.text('Mastercard Gebühr: 0,89 %', 10, 75);
    pdf.text('Business Card Gebühr: 2,89 %', 10, 80);

    pdf.text('* Hinweis: Alle Preise verstehen sich zzgl. gesetzlicher Umsatzsteuer.', 10, 90);
    pdf.text('* Dieses Angebot ist freibleibend und unverbindlich.', 10, 95);
    pdf.text('Wir wachen auf gute Geschäfte, Ihr DISH Team.', 10, 100); // Kundenorientierter Text

    // Speichern der PDF
    pdf.save('DISH_PAY_Angebot.pdf');
}

