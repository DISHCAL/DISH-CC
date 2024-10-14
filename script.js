function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const competitor = document.getElementById('competitor').value;

    // Berechnung der DISH Kosten
    let dishCost = 0;
    if (monthlyVolume < 10000) {
        dishCost = monthlyVolume * 0.0039; // 0,39%
    } else {
        dishCost = monthlyVolume * 0.0029; // 0,29%
    }

    // Wettbewerber Kosten (optional)
    if (competitor === 'yes') {
        dishCost += monthlyVolume * 0.0079; // Beispielgebühr für Wettbewerber
    }

    document.getElementById('monthlyDishCost').innerText = dishCost.toFixed(2);

    updateHardwareDetails(); // Hardware-Kosten aktualisieren
}

function updateHardwareDetails() {
    const hardwareCost = parseFloat(document.getElementById('hardware').value) || 0;
    const rentalDuration = parseInt(document.getElementById('rentalDuration').value) || 0;

    // Einmalige Hardwarekosten
    document.getElementById('oneTimeHardwareCost').innerText = hardwareCost.toFixed(2);

    // Monatliche Mietkosten
    let monthlyRentalCost = 0;
    switch (rentalDuration) {
        case 12:
            monthlyRentalCost = (hardwareCost === 499 ? 44.90 : hardwareCost === 399 ? 39.90 : 0);
            break;
        case 36:
            monthlyRentalCost = (hardwareCost === 499 ? 18.90 : hardwareCost === 399 ? 16.90 : 0);
            break;
        case 60:
            monthlyRentalCost = (hardwareCost === 499 ? 14.90 : hardwareCost === 399 ? 12.90 : 0);
            break;
        default:
            break;
    }

    document.getElementById('monthlyRentalCost').innerText = monthlyRentalCost.toFixed(2);
}

function downloadOffer() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(12);
    pdf.text('DISH PAY - Ihr individuelles Angebot', 10, 10);
    pdf.text('----------------------------------------', 10, 15);
    pdf.text('Wir freuen uns, Ihnen unser Angebot für die DISH PAY Lösung zu unterbreiten.', 10, 20);
    pdf.text('Mit DISH PAY profitieren Sie von unseren attraktiven Konditionen und einem benutzerfreundlichen System.', 10, 25);

    const dishCost = document.getElementById('monthlyDishCost').innerText;
    const hardwareCost = document.getElementById('oneTimeHardwareCost').innerText;
    const monthlyRentalCost = document.getElementById('monthlyRentalCost').innerText;

    pdf.text(`Monatliche DISH Kosten: ${dishCost} €`, 10, 35);
    pdf.text(`Einmalige Hardwarekosten: ${hardwareCost} €`, 10, 45);
    pdf.text(`Monatliche Mietkosten der Hardware: ${monthlyRentalCost} €`, 10, 55);

    // Füge die Gebührenübersicht hinzu
    pdf.text('Wichtige Informationen zu den Gebühren:', 10, 65);
    pdf.text('EC-Karten Gebühr unter 10.000 €: 0,39 %', 10, 70);
    pdf.text('EC-Karten Gebühr über 10.000 €: 0,29 %', 10, 75);
    pdf.text('Maestro / VPAY Gebühr: 0,79 %', 10, 80);
    pdf.text('Mastercard Gebühr: 0,89 %', 10, 85);
    pdf.text('Business Card Gebühr: 2,89 %', 10, 90);

    pdf.text('* Hinweis: Alle Preise verstehen sich zzgl. gesetzlicher Umsatzsteuer.', 10, 100);
    pdf.text('* Dieses Angebot ist freibleibend und unverbindlich.', 10, 105);
    pdf.text('Wir sind stets darum bemüht, Ihre Wünsche zu erfüllen und Ihnen den bestmöglichen Service zu bieten.', 10, 110);
    pdf.text('Für weitere Informationen oder Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.', 10, 115);
    pdf.text('Wir freuen uns auf eine erfolgreiche Zusammenarbeit!', 10, 120);
    pdf.text('Ihr DISH Team', 10, 125);

    pdf.save('DISH_PAY_Angebot.pdf');
}
