function toggleCompetitorFields() {
    const competitorSection = document.getElementById('competitorSection');
    const competitorSelect = document.getElementById('competitorInclude').value;

    if (competitorSelect === 'ja') {
        competitorSection.style.display = 'block';
    } else {
        competitorSection.style.display = 'none';
    }
}

function calculateCosts() {
    // Eingaben des Benutzers
    let monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    let girocardPercent = parseFloat(document.getElementById('girocard').value) / 100;
    let maestroPercent = parseFloat(document.getElementById('maestro').value) / 100;
    let mastercardVisaPercent = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    let businessCardPercent = parseFloat(document.getElementById('businessCard').value) / 100;
    let transactions = parseInt(document.getElementById('transactions').value);

    // Transaktionsgebühren von DISH
    const girocardFeeLow = 0.0039;  // Girocard Gebühr unter 10.000€
    const girocardFeeHigh = 0.0029; // Girocard Gebühr über 10.000€
    const maestroFee = 0.0079;
    const mastercardFee = 0.0089;
    const businessCardFee = 0.0289;

    // Hardwareoptionen
    let hardwareOption = document.getElementById('hardwareOption').value;
    let hardwareOptionPurchase = document.getElementById('hardwareOptionPurchase').value;
    let hardwareRentalCost = 0;
    let hardwareCost = 0;

    // Hardware Kosten
    if (hardwareOptionPurchase === 'mieten') {
        hardwareRentalCost = parseFloat(document.getElementById('monthlyCost').value); // Monatliche Mietkosten
    } else {
        hardwareCost = parseFloat(document.getElementById('onceCost').value); // Einmalige Kosten
    }

    // Berechnung der DISH Kosten
    let dishCost = transactions * transactionFee + hardwareRentalCost;

    // Berechnung der Gebühren basierend auf dem Umsatz
    let girocardFee = monthlyVolume < 10000 ? girocardFeeLow : girocardFeeHigh;

    dishCost += transactions * girocardFee * girocardPercent;
    dishCost += monthlyVolume * maestroPercent * maestroFee;
    dishCost += monthlyVolume * mastercardVisaPercent * mastercardFee;
    dishCost += monthlyVolume * businessCardPercent * businessCardFee;

    // Berechnung der Wettbewerberkosten (wenn gewählt)
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
        <p><strong>Einmalige Hardwarekosten:</strong> ${hardwareCost.toFixed(2).replace('.', ',')} €</p>
        <p><strong>Monatliche Mietkosten der Hardware:</strong> ${hardwareRentalCost.toFixed(2).replace('.', ',')} €</p>
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
