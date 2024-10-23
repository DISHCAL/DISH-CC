function generatePDF() {
    const { jsPDF } = window.jspdf;

    // Kundeninformationen
    const salutation = document.getElementById('salutation').value;
    const customerName = document.getElementById('customerName').value;

    // Überprüfen, ob der Kundenname eingegeben wurde
    if (!customerName.trim()) {
        alert("Bitte geben Sie den Kundennamen ein, bevor Sie das PDF herunterladen.");
        return;
    }

    // Berechnung erneut durchführen, um die aktuellen Werte zu erfassen
    const calculationType = document.getElementById('calculationType').value;
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseInt(document.getElementById('transactions').value) || 0;
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const vpayPercentage = parseFloat(document.getElementById('vpay').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    // Berechnung der Umsätze pro Kartenart
    const girocardVolume = monthlyVolume * (girocardPercentage / 100);
    const mastercardVisaVolume = monthlyVolume * (mastercardVisaPercentage / 100);
    const vpayVolume = monthlyVolume * (vpayPercentage / 100);
    const businessCardVolume = monthlyVolume * (businessCardPercentage / 100);

    // Berechnung der Girocard-Gebühren
    let girocardFeeRate = 0;
    if (girocardVolume <= 10000) {
        girocardFeeRate = 0.0039; // 0,39%
    } else {
        girocardFeeRate = 0.0029; // 0,29%
    }
    const girocardCost = girocardVolume * girocardFeeRate;

    // Berechnungen für andere Gebühren
    const mastercardVisaCost = mastercardVisaVolume * 0.0089; // 0,89%
    const vpayCost = vpayVolume * 0.0089; // 0,89%
    const businessCardCost = businessCardVolume * 0.0289; // 2,89%

    // Transaktionskosten
    const transactionCost = transactions * 0.06;

    // Gesamtkosten DISH PAY Gebühren
    const totalDishPayFees = girocardCost + mastercardVisaCost + vpayCost + businessCardCost + transactionCost;

    // Durchschnittliche Gebühr in Prozent berechnen
    const totalSales = girocardVolume + mastercardVisaVolume + vpayVolume + businessCardVolume;
    const totalDishPayFeesPercentage = totalSales > 0 ? ((totalDishPayFees / totalSales) * 100).toFixed(2) : 0;

    // Hardwarekosten
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalDuration = document.getElementById('rentalDuration').value;
    const hardwareSelection = document.getElementById('hardware').value;

    let hardwareCost = 0;
    let simServiceFee = '-';
    let oneTimeCost = '-';

    // Hardwarepreise entsprechend der Auswahl
    if (purchaseOption === 'kaufen') {
        switch (hardwareSelection) {
            case 'S1F2':
                hardwareCost = 0; // Keine monatlichen Kosten beim Kauf
                oneTimeCost = 499.00;
                simServiceFee = 3.90;
                break;
            case 'V400C':
                hardwareCost = 0;
                oneTimeCost = 399.00;
                simServiceFee = 3.90;
                break;
            case 'Moto G14':
                hardwareCost = 0;
                oneTimeCost = 119.00;
                simServiceFee = 7.90;
                break;
            default:
                hardwareCost = 0;
        }
    } else if (purchaseOption === 'mieten') {
        switch (hardwareSelection) {
            case 'S1F2':
                if (rentalDuration === '12M') hardwareCost = 44.90;
                else if (rentalDuration === '36M') hardwareCost = 18.90;
                else if (rentalDuration === '60M') hardwareCost = 14.90;
                break;
            case 'V400C':
                if (rentalDuration === '12M') hardwareCost = 39.90;
                else if (rentalDuration === '36M') hardwareCost = 16.90;
                else if (rentalDuration === '60M') hardwareCost = 12.90;
                break;
            case 'Tap2Pay':
                hardwareCost = 7.90; // Nur 12M verfügbar
                break;
            default:
                hardwareCost = 0;
        }
        simServiceFee = '-'; // Bei Miete keine SIM/Service-Gebühr
        oneTimeCost = '-'; // Keine einmaligen Kosten bei Miete
    }

    // Gesamtkosten DISH PAY
    const totalMonthlyCost = hardwareCost + (simServiceFee !== '-' ? parseFloat(simServiceFee) : 0) + totalDishPayFees;

    // PDF erstellen und herunterladen
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Angebot für ${salutation} ${customerName}`, 20, 30);

    doc.setFontSize(12);
    doc.text(`Geplanter Kartenumsatz pro Monat: ${monthlyVolume.toFixed(2)} €`, 20, 50);
    doc.text(`Erwartete Anzahl an Transaktionen: ${transactions}`, 20, 60);

    doc.text(`\nKartenarten Anteil:`, 20, 70);
    doc.text(`- Girocard: ${girocardPercentage}%`, 25, 80);
    doc.text(`- Mastercard / VISA: ${mastercardVisaPercentage}%`, 25, 90);
    if (purchaseOption === 'ausführlich') {
        doc.text(`- Maestro / VPAY: ${vpayPercentage}%`, 25, 100);
        doc.text(`- Business Card: ${businessCardPercentage}%`, 25, 110);
    }

    doc.text(`\nHardwareoption: ${purchaseOption === 'kaufen' ? 'Kauf' : 'Miete'}`, 20, 120);
    doc.text(`- ${hardwareSelection}: ${purchaseOption === 'kaufen' ? oneTimeCost.toFixed(2) + ' €' : hardwareCost.toFixed(2) + ' €/Monat'}`, 25, 130);
    if (purchaseOption === 'kaufen') {
        doc.text(`- SIM/Service-Gebühr: ${simServiceFee !== '-' ? simServiceFee.toFixed(2) + ' €' : '-'}`, 25, 140);
    }

    doc.text(`\nGesamtkosten DISH PAY: ${totalMonthlyCost.toFixed(2)} €`, 20, 150);
    doc.text(`Durchschnittliche Gebühr: ${totalDishPayFeesPercentage}%`, 20, 160);

    // Wettbewerber Kosten (falls ausführlich)
    if (calculationType === 'ausführlich') {
        doc.text(`\nWettbewerber Kosten: ${totalCompetitorCost.toFixed(2)} €`, 20, 170);
        doc.text(`Ersparnis mit DISH PAY: ${savings.toFixed(2)} €`, 20, 180);
    }

    doc.save(`${customerName}_DISH_PAY_Angebot.pdf`);
}
