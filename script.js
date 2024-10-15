// Funktion zum Umschalten der Berechnungsfelder (schnell/ausführlich)
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const businessCardField = document.getElementById('businessCardField');
    const maestroField = document.getElementById('maestroField');
    const competitorMaestroField = document.getElementById('competitorMaestroField');
    const competitorBusinessCardField = document.getElementById('competitorBusinessCardField');
    const competitorSection = document.getElementById('competitorSection');

    if (calculationType === 'schnell') {
        businessCardField.classList.add('hidden');
        maestroField.classList.add('hidden');
        competitorMaestroField.classList.add('hidden');
        competitorBusinessCardField.classList.add('hidden');
        competitorSection.classList.add('hidden');
    } else {
        businessCardField.classList.remove('hidden');
        maestroField.classList.remove('hidden');
        competitorMaestroField.classList.remove('hidden');
        competitorBusinessCardField.classList.remove('hidden');
        competitorSection.classList.remove('hidden');
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

// Funktion zum Aktualisieren der Hardwarekosten
function updateHardwareCosts() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    
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
    } else {
        monthlyCost = 0;
    }

    return { onceCost: priceOnce, monthlyCost };
}

// Funktion zur Sicherstellung, dass die Summe der Prozentsätze 100 ergibt
function validatePercentages() {
    const girocard = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const maestro = parseFloat(document.getElementById('maestro').value) || 0;
    const businessCard = parseFloat(document.getElementById('businessCard').value) || 0;
    
    const totalPercentage = girocard + mastercardVisa + maestro + businessCard;

    if (totalPercentage !== 100) {
        alert("Die Summe der Prozentsätze muss genau 100% ergeben.");
        return false;
    }
    return true;
}

// Funktion zur Berechnung der Kosten
function calculateCosts() {
    if (!validatePercentages()) {
        return;
    }

    const calculationType = document.getElementById('calculationType').value;
    const purchaseOption = document.getElementById('purchaseOption').value;
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseFloat(document.getElementById('transactions').value) || 0;
    
    const girocardFeePercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaFeePercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const maestroFeePercentage = parseFloat(document.getElementById('maestro').value) || 0;
    const businessCardFeePercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    const { onceCost, monthlyCost: hardwareMonthlyCost } = updateHardwareCosts();

    // Berechnung des Kartenumsatzes (Disagio-Gebühren)
    const girocardRevenue = monthlyVolume * (girocardFeePercentage / 100);
    const mastercardVisaRevenue = monthlyVolume * (mastercardVisaFeePercentage / 100);
    const maestroRevenue = monthlyVolume * (maestroFeePercentage / 100);
    const businessCardRevenue = monthlyVolume * (businessCardFeePercentage / 100);

    const girocardFee = girocardRevenue * (monthlyVolume > 10000 ? 0.0029 : 0.0039);
    const mastercardVisaFee = mastercardVisaRevenue * 0.0089;
    const maestroFee = maestroRevenue * 0.0089;
    const businessCardFee = businessCardRevenue * 0.0289;

    // Gesamte Disagio-Gebühren
    const totalDisagioFees = girocardFee + mastercardVisaFee + maestroFee + businessCardFee;

    // Transaktionsgebühren
    const transactionFee = transactions * 0.06;

    // SIM/Servicegebühr (nur beim Kauf der Hardware, fällt bei Miete weg)
    let simServiceFee = 0;
    const hardwareSelect = document.getElementById('hardware').value;
    if (purchaseOption === "kaufen" && (hardwareSelect === "S1F2" || hardwareSelect === "V400C")) {
        simServiceFee = 3.90;
    }

    // Monatliche Gesamtkosten
    const totalMonthlyCost = totalDisagioFees + transactionFee + hardwareMonthlyCost + simServiceFee;

    // Anzeige der Ergebnisse
    document.getElementById('disagioFees').innerText = `Gebühren gesamt: ${(totalDisagioFees + transactionFee).toFixed(2)} €`;
    document.getElementById('monthlyCost').innerText = purchaseOption === "mieten" ? `Monatliche Hardwarekosten (Miete): ${hardwareMonthlyCost.toFixed(2)} €` : "";
    document.getElementById('simServiceFee').innerText = simServiceFee > 0 ? `SIM/Servicegebühr (nur bei Kauf): ${simServiceFee.toFixed(2)} €` : "Keine SIM/Servicegebühr";
    document.getElementById('totalCost').innerText = `Monatliche Gesamtkosten: ${totalMonthlyCost.toFixed(2)} €`;

    document.getElementById('oneTimeCost').innerText = purchaseOption === "kaufen" ? `Einmalige Kosten (Kauf): ${onceCost.toFixed(2)} €` : "";

    // Wettbewerberberechnung (nur bei ausführlicher Berechnung)
    if (calculationType === 'ausführlich') {
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100 || 0;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100 || 0;
        const competitorMastercardVisaFee = parseFloat(document.getElementById('competitorMastercardVisaFee').value) / 100 || 0;
        const competitorBusinessCardFee = parseFloat(document.getElementById('competitorBusinessCardFee').value) / 100 || 0;

        const competitorGirocardCost = girocardRevenue * competitorGirocardFee;
        const competitorMaestroCost = maestroRevenue * competitorMaestroFee;
        const competitorMastercardVisaCost = mastercardVisaRevenue * competitorMastercardVisaFee;
        const competitorBusinessCardCost = businessCardRevenue * competitorBusinessCardFee;

        const competitorTotalFees = competitorGirocardCost + competitorMaestroCost + competitorMastercardVisaCost + competitorBusinessCardCost + transactionFee + hardwareMonthlyCost + simServiceFee;

        document.getElementById('competitorTotal').innerText = `Wettbewerberkosten pro Monat: ${competitorTotalFees.toFixed(2)} €`;
        document.getElementById('competitorSavings').innerText = `Monatliche Ersparnis mit DISH PAY: ${(competitorTotalFees - totalMonthlyCost).toFixed(2)} €`;
    } else {
        document.getElementById('competitorTotal').innerText = "";
        document.getElementById('competitorSavings').innerText = "";
    }
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
