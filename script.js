// script.js

document.addEventListener('DOMContentLoaded', () => {
    togglePayCalculationFields();
    togglePayRentalOptions();
    updatePayRentalPrices();
    openTab(null, 'PAY'); // Standardmäßig PAY Rechner öffnen
});

/* Allgemeine Tab-Funktion */
function openTab(evt, tabName) {
    // Verstecke alle Tab-Inhalte
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.remove('active');
    }

    // Entferne die aktive Klasse von allen Tabs
    const tabLinks = document.getElementsByClassName('tab-link');
    for (let tab of tabLinks) {
        tab.classList.remove('active');
    }

    // Zeige den ausgewählten Tab-Inhalt
    document.getElementById(tabName).classList.add('active');

    // Füge die aktive Klasse zum geklickten Tab hinzu
    if (evt) {
        evt.currentTarget.classList.add('active');
    }
}

/* PAY Rechner Funktionen */

/* Funktion zum Umschalten der Berechnungsfelder (schnell/ausfuehrlich) */
function togglePayCalculationFields() {
    const calculationType = document.getElementById('payCalculationType').value;
    const maestroField = document.getElementById('payMaestroField');
    const businessCardField = document.getElementById('payBusinessCardField');
    const competitorMaestroField = document.getElementById('payCompetitorMaestroField');
    const competitorBusinessCardField = document.getElementById('payCompetitorBusinessCardField');
    const competitorSection = document.getElementById('payCompetitorSection');

    if (calculationType === 'schnell') {
        maestroField.classList.add('hidden');
        businessCardField.classList.add('hidden');
        competitorMaestroField.classList.add('hidden');
        competitorBusinessCardField.classList.add('hidden');
        competitorSection.classList.add('hidden');
    } else {
        maestroField.classList.remove('hidden');
        businessCardField.classList.remove('hidden');
        competitorMaestroField.classList.remove('hidden');
        competitorBusinessCardField.classList.remove('hidden');
        competitorSection.classList.remove('hidden');
    }
}

/* Funktion zum Umschalten der Mietoptionen im PAY Rechner */
function togglePayRentalOptions() {
    const purchaseOption = document.getElementById('payPurchaseOption').value;
    const rentalOptions = document.getElementById('payRentalOptions');
    rentalOptions.style.display = purchaseOption === "mieten" ? 'block' : 'none';
}

/* Funktion zum Aktualisieren der Mietpreise basierend auf ausgewählter Hardware und Mietdauer */
function updatePayRentalPrices() {
    const hardwareSelect = document.getElementById('payHardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const rentalPeriodSelect = document.getElementById('payRentalPeriod');

    // Aktualisieren der Mietdauer-Texte
    rentalPeriodSelect.options[0].text = `12 Monate - ${selectedHardware.getAttribute('data-price-12')} €/Monat`;
    rentalPeriodSelect.options[1].text = `36 Monate - ${selectedHardware.getAttribute('data-price-36')} €/Monat`;
    rentalPeriodSelect.options[2].text = `60 Monate - ${selectedHardware.getAttribute('data-price-60')} €/Monat`;
}

/* Funktion zur Berechnung der PAY Kosten */
function calculatePayCosts() {
    // Kundennamen erfassen
    const customerName = document.getElementById('payCustomerName').value.trim();
    if (!customerName) {
        alert("Bitte geben Sie den Kundennamen ein.");
        return;
    }

    if (!validatePayPercentages()) {
        return;
    }

    const calculationType = document.getElementById('payCalculationType').value;
    const purchaseOption = document.getElementById('payPurchaseOption').value;
    const monthlyVolume = parseFloat(document.getElementById('payMonthlyVolume').value) || 0;
    const transactions = parseFloat(document.getElementById('payTransactions').value) || 0;

    const girocardFeePercentage = parseFloat(document.getElementById('payGirocard').value) || 0;
    const mastercardVisaFeePercentage = parseFloat(document.getElementById('payMastercardVisa').value) || 0;
    const maestroFeePercentage = calculationType === 'ausfuehrlich' ? (parseFloat(document.getElementById('payMaestro').value) || 0) : 0;
    const businessCardFeePercentage = calculationType === 'ausfuehrlich' ? (parseFloat(document.getElementById('payBusinessCard').value) || 0) : 0;

    const { onceCost, monthlyCost: hardwareMonthlyCost } = updatePayHardwareCosts();

    // Einnahmen basierend auf Prozentsätzen
    const girocardRevenue = monthlyVolume * (girocardFeePercentage / 100);
    const mastercardVisaRevenue = monthlyVolume * (mastercardVisaFeePercentage / 100);
    const maestroRevenue = monthlyVolume * (maestroFeePercentage / 100);
    const businessCardRevenue = monthlyVolume * (businessCardFeePercentage / 100);

    // Gebührenraten
    let girocardFeeRate = 0;
    if (girocardRevenue <= 10000) {
        girocardFeeRate = 0.0039; // 0,39%
    } else {
        girocardFeeRate = 0.0029; // 0,29%
    }

    const girocardFee = girocardRevenue * girocardFeeRate;
    const mastercardVisaFee = mastercardVisaRevenue * 0.0089;
    const maestroFee = maestroRevenue * 0.0089;
    const businessCardFee = businessCardRevenue * 0.0289;

    const totalDisagioFeesNetto = girocardFee + mastercardVisaFee + maestroFee + businessCardFee;
    const transactionFeeNetto = transactions * 0.06;

    let simServiceFeeNetto = 0;
    const hardwareSelectValue = document.getElementById('payHardware').value;
    if (purchaseOption === "kaufen" && (hardwareSelectValue === "S1F2" || hardwareSelectValue === "V400C")) {
        simServiceFeeNetto = 3.90;
    }

    const totalMonthlyCostNetto = totalDisagioFeesNetto + transactionFeeNetto + hardwareMonthlyCost + simServiceFeeNetto;

    // Rabatt einlesen (optional, kann hier hinzugefügt werden, falls benötigt)

    // Mehrwertsteuer berechnen
    const mwstRate = 0.19;
    const totalDisagioFeesMwSt = totalDisagioFeesNetto * mwstRate;
    const transactionFeeMwSt = transactionFeeNetto * mwstRate;
    const hardwareMonthlyCostMwSt = hardwareMonthlyCost * mwstRate;
    const simServiceFeeMwSt = simServiceFeeNetto * mwstRate;
    const totalMonthlyCostMwSt = totalMonthlyCostNetto * mwstRate;

    const totalMonthlyCostBrutto = totalMonthlyCostNetto + totalMonthlyCostMwSt;

    // Einmalige Kosten
    let einmaligeKostenNetto = 0;
    let einmaligeKostenMwSt = 0;
    let einmaligeKostenBrutto = 0;
    if (purchaseOption === "kaufen") {
        einmaligeKostenNetto = onceCost;
        einmaligeKostenMwSt = einmaligeKostenNetto * mwstRate;
        einmaligeKostenBrutto = einmaligeKostenNetto + einmaligeKostenMwSt;
    }

    // Gesamtkosten
    const totalNetto = totalMonthlyCostNetto + einmaligeKostenNetto;
    const totalMwSt = totalMonthlyCostMwSt + einmaligeKostenMwSt;
    const totalBrutto = totalNetto + totalMwSt;

    // Ergebnis anzeigen
    document.getElementById('payDisagioFeesNetto').innerText = totalDisagioFeesNetto.toFixed(2);
    document.getElementById('payDisagioFeesMwSt').innerText = totalDisagioFeesMwSt.toFixed(2);
    document.getElementById('payDisagioFeesBrutto').innerText = (totalDisagioFeesNetto + totalDisagioFeesMwSt).toFixed(2);

    document.getElementById('payMonthlyCostNetto').innerText = hardwareMonthlyCost.toFixed(2);
    document.getElementById('payMonthlyCostMwSt').innerText = hardwareMonthlyCostMwSt.toFixed(2);
    document.getElementById('payMonthlyCostBrutto').innerText = (hardwareMonthlyCost + hardwareMonthlyCostMwSt).toFixed(2);

    document.getElementById('paySimServiceFeeNetto').innerText = simServiceFeeNetto.toFixed(2);
    document.getElementById('paySimServiceFeeMwSt').innerText = simServiceFeeMwSt.toFixed(2);
    document.getElementById('paySimServiceFeeBrutto').innerText = (simServiceFeeNetto + simServiceFeeMwSt).toFixed(2);

    document.getElementById('payOneTimeCostNetto').innerText = einmaligeKostenNetto.toFixed(2);
    document.getElementById('payOneTimeCostMwSt').innerText = einmaligeKostenMwSt.toFixed(2);
    document.getElementById('payOneTimeCostBrutto').innerText = einmaligeKostenBrutto.toFixed(2);

    document.getElementById('payTotalNetto').innerText = `${totalNetto.toFixed(2)} €`;
    document.getElementById('payTotalMwSt').innerText = `${totalMwSt.toFixed(2)} €`;
    document.getElementById('payTotalBrutto').innerText = `${totalBrutto.toFixed(2)} €`;
}

/* Funktion zur Aktualisierung der Hardwarekosten im PAY Rechner */
function updatePayHardwareCosts() {
    const purchaseOption = document.getElementById('payPurchaseOption').value;
    const hardwareSelect = document.getElementById('payHardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    
    const priceOnce = parseFloat(selectedHardware.getAttribute('data-price-once')) || 0;
    let monthlyCost = 0;

    if (purchaseOption === "mieten") {
        const rentalPeriod = document.getElementById('payRentalPeriod').value;
        if (rentalPeriod === "12") {
            monthlyCost = parseFloat(selectedHardware.getAttribute('data-price-12')) || 0;
        } else if (rentalPeriod === "36") {
            monthlyCost = parseFloat(selectedHardware.getAttribute('data-price-36')) || 0;
        } else if (rentalPeriod === "60") {
            monthlyCost = parseFloat(selectedHardware.getAttribute('data-price-60')) || 0;
        }
    } else {
        monthlyCost = 0;  // Keine monatlichen Hardwarekosten bei Kauf
    }

    return { onceCost: priceOnce, monthlyCost };
}

/* Funktion zur Validierung der PAY Prozentangaben */
function validatePayPercentages() {
    const calculationType = document.getElementById('payCalculationType').value;
    let totalPercentage = 0;

    const girocard = parseFloat(document.getElementById('payGirocard').value) || 0;
    const mastercardVisa = parseFloat(document.getElementById('payMastercardVisa').value) || 0;
    const maestro = calculationType === 'ausfuehrlich' ? (parseFloat(document.getElementById('payMaestro').value) || 0) : 0;
    const businessCard = calculationType === 'ausfuehrlich' ? (parseFloat(document.getElementById('payBusinessCard').value) || 0) : 0;

    totalPercentage = girocard + mastercardVisa + maestro + businessCard;

    if (totalPercentage !== 100) {
        alert("Die Summe der Prozentsätze muss genau 100% ergeben.");
        return false;
    }
    return true;
}

/* Funktion zur Erstellung und Versendung der E-Mail */
function sendEmail(calculatorType) {
    let customerName = "";
    let emailBody = "";
    let subject = "";

    if (calculatorType === 'PAY') {
        customerName = document.getElementById('payCustomerName').value.trim();
        if (!customerName) {
            alert("Bitte geben Sie den Kundennamen ein.");
            return;
        }

        // Sammeln der Kosten aus den Ergebnissen
        const oneTimeCostNetto = document.getElementById('payOneTimeCostNetto').innerText;
        const oneTimeCostMwSt = document.getElementById('payOneTimeCostMwSt').innerText;
        const oneTimeCostBrutto = document.getElementById('payOneTimeCostBrutto').innerText;

        const monthlyCostNetto = document.getElementById('payMonthlyCostNetto').innerText;
        const monthlyCostMwSt = document.getElementById('payMonthlyCostMwSt').innerText;
        const monthlyCostBrutto = document.getElementById('payMonthlyCostBrutto').innerText;

        const simServiceFeeNetto = document.getElementById('paySimServiceFeeNetto').innerText;
        const simServiceFeeMwSt = document.getElementById('paySimServiceFeeMwSt').innerText;
        const simServiceFeeBrutto = document.getElementById('paySimServiceFeeBrutto').innerText;

        const totalNetto = document.getElementById('payTotalNetto').innerText;
        const totalMwSt = document.getElementById('payTotalMwSt').innerText;
        const totalBrutto = document.getElementById('payTotalBrutto').innerText;

        // Erstellen des Angebotsinhalts basierend auf den Ergebnissen
        emailBody = `
Sehr geehrte/r ${customerName},

vielen Dank für Ihr Interesse an unserem Kassensystem DISH PAY. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.

---
#### **Einmalige Kosten**

| **Produkt / Service** | **Betrag (€)** |
|-----------------------|-----------------|
| **Einmalige Kosten (Kauf)** | ${oneTimeCostNetto} € |
| **Mehrwertsteuer (19%)** | ${oneTimeCostMwSt} € |
| **Gesamtbetrag (€)** | ${oneTimeCostBrutto} € |

---
#### **Monatliche Kosten**

| **Lizenz / Service** | **Betrag (€)** |
|----------------------|-----------------|
| **Monatliche Hardwarekosten** | ${monthlyCostNetto} € |
| **SIM/Servicegebühr** | ${simServiceFeeNetto} € |
| **Mehrwertsteuer (19%)** | ${monthlyCostMwSt} €, ${simServiceFeeMwSt} € |
| **Gesamtbetrag (€)** | ${monthlyCostBrutto} €, ${simServiceFeeBrutto} € |

---
#### **Zusammenfassung**

- **Einmalige Kosten**: **Netto: ${oneTimeCostNetto} €**, **MwSt: ${oneTimeCostMwSt} €**, **Gesamtbetrag: ${oneTimeCostBrutto} €**
- **Monatliche Kosten**: **Netto: ${monthlyCostNetto} €**, **MwSt: ${monthlyCostMwSt} €**, **Gesamtbetrag: ${monthlyCostBrutto} €**

---
**Hinweis:**  

*Die Kosten für die Access Points sind nicht mehr in der Kostenübersicht enthalten.*

**Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unserem Kassensystem DISH PAY einen echten Mehrwert bieten zu dürfen.**

**Mit freundlichen Grüßen,  
Ihr DISH Team**

Rechtlicher Hinweis:  
Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. Die angegebenen Preise und Konditionen können sich ändern. Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.
        `;
        subject = 'Ihr DISH PAY Angebot';

    } else if (calculatorType === 'POS') {
        // POS Rechner E-Mail Inhalt erstellen
        const customerName = document.getElementById('posCustomerName').value.trim();
        if (!customerName) {
            alert("Bitte geben Sie den Kundennamen ein.");
            return;
        }

        const totalHardwareNetto = document.getElementById('posTotalHardwareNetto').innerText;
        const totalHardwareMwSt = document.getElementById('posTotalHardwareMwSt').innerText;
        const totalHardwareBrutto = document.getElementById('posTotalHardwareBrutto').innerText;

        const totalLicenseNetto = document.getElementById('posTotalLicenseNetto').innerText;
        const totalLicenseMwSt = document.getElementById('posTotalLicenseMwSt').innerText;
        const totalLicenseBrutto = document.getElementById('posTotalLicenseBrutto').innerText;

        const discountNetto = document.getElementById('posDiscountNetto').innerText;
        const discountMwSt = document.getElementById('posDiscountMwSt').innerText;
        const discountBrutto = document.getElementById('posDiscountBrutto').innerText;

        const oneTimeCostNetto = document.getElementById('posOneTimeCostNetto').innerText;
        const oneTimeCostMwSt = document.getElementById('posOneTimeCostMwSt').innerText;
        const oneTimeCostBrutto = document.getElementById('posOneTimeCostBrutto').innerText;

        const totalNetto = document.getElementById('posTotalNetto').innerText;
        const totalMwSt = document.getElementById('posTotalMwSt').innerText;
        const totalBrutto = document.getElementById('posTotalBrutto').innerText;

        emailBody = `
Sehr geehrte/r ${customerName},

vielen Dank für Ihr Interesse an unserem Kassensystem DISH POS. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.

---
#### **Einmalige Kosten**

| **Produkt / Service** | **Betrag (€)** |
|-----------------------|-----------------|
| **Gesamtkosten Hardware** | ${totalHardwareNetto} € |
| **Mehrwertsteuer (19%)** | ${totalHardwareMwSt} € |
| **Gesamtbetrag (€)** | ${totalHardwareBrutto} € |

| **Produkt / Service** | **Betrag (€)** |
|-----------------------|-----------------|
| **Gesamtkosten Lizenzen und Services** | ${totalLicenseNetto} € |
| **Mehrwertsteuer (19%)** | ${totalLicenseMwSt} € |
| **Gesamtbetrag (€)** | ${totalLicenseBrutto} € |

| **Produkt / Service** | **Betrag (€)** |
|-----------------------|-----------------|
| **Rabattbetrag** | ${discountNetto} € |
| **Mehrwertsteuer (19%)** | ${discountMwSt} € |
| **Gesamtbetrag (€)** | ${discountBrutto} € |

| **Produkt / Service** | **Betrag (€)** |
|-----------------------|-----------------|
| **Einmalige Kosten (Kauf)** | ${oneTimeCostNetto} € |
| **Mehrwertsteuer (19%)** | ${oneTimeCostMwSt} € |
| **Gesamtbetrag (€)** | ${oneTimeCostBrutto} € |

---
#### **Gesamtkosten**

- **Gesamtkosten**: **Netto: ${totalNetto} €**, **MwSt: ${totalMwSt} €**, **Gesamtbetrag: ${totalBrutto} €**

---
**Hinweis:**  


**Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unserem Kassensystem DISH POS einen echten Mehrwert bieten zu dürfen.**

**Mit freundlichen Grüßen,  
Ihr DISH Team**

Rechtlicher Hinweis:  
Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. Die angegebenen Preise und Konditionen können sich ändern. Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.
        `;
        subject = 'Ihr DISH POS Angebot';

    } else if (calculatorType === 'TOOLS') {
        // TOOLS Rechner E-Mail Inhalt erstellen
        const customerName = document.getElementById('toolsCustomerName').value.trim();
        if (!customerName) {
            alert("Bitte geben Sie den Kundennamen ein.");
            return;
        }

        const monthlyCostNetto = document.getElementById('toolsMonthlyCostNetto').innerText;
        const monthlyCostMwSt = document.getElementById('toolsMonthlyCostMwSt').innerText;
        const monthlyCostBrutto = document.getElementById('toolsMonthlyCostBrutto').innerText;

        const activationCostNetto = document.getElementById('toolsActivationCostNetto').innerText;
        const activationCostMwSt = document.getElementById('toolsActivationCostMwSt').innerText;
        const activationCostBrutto = document.getElementById('toolsActivationCostBrutto').innerText;

        const discountNetto = document.getElementById('toolsDiscountNetto').innerText;
        const discountMwSt = document.getElementById('toolsDiscountMwSt').innerText;
        const discountBrutto = document.getElementById('toolsDiscountBrutto').innerText;

        const totalNetto = document.getElementById('toolsTotalNetto').innerText;
        const totalMwSt = document.getElementById('toolsTotalMwSt').innerText;
        const totalBrutto = document.getElementById('toolsTotalBrutto').innerText;

        emailBody = `
Sehr geehrte/r ${customerName},

vielen Dank für Ihr Interesse an unseren DISH-Lösungen. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.

---
#### **Einmalige Kosten**

| **Produkt / Service** | **Betrag (€)** |
|-----------------------|-----------------|
| **Einmalige Kosten (Kauf)** | ${activationCostNetto} € |
| **Mehrwertsteuer (19%)** | ${activationCostMwSt} € |
| **Gesamtbetrag (€)** | ${activationCostBrutto} € |

---
#### **Monatliche Kosten**

| **Lizenz / Service** | **Betrag (€)** |
|----------------------|-----------------|
| **Monatliche Kosten** | ${monthlyCostNetto} € |
| **Mehrwertsteuer (19%)** | ${monthlyCostMwSt} € |
| **Gesamtbetrag (€)** | ${monthlyCostBrutto} € |

---
#### **Zusammenfassung**

- **Einmalige Kosten**: **Netto: ${activationCostNetto} €**, **MwSt: ${activationCostMwSt} €**, **Gesamtbetrag: ${activationCostBrutto} €**
- **Monatliche Kosten**: **Netto: ${monthlyCostNetto} €**, **MwSt: ${monthlyCostMwSt} €**, **Gesamtbetrag: ${monthlyCostBrutto} €**

---
**Hinweis:**  



**Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unseren DISH-Lösungen einen echten Mehrwert bieten zu dürfen.**

**Mit freundlichen Grüßen,  
Ihr DISH Team**

Rechtlicher Hinweis:  
Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. Die angegebenen Preise und Konditionen können sich ändern. Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.
        `;
        subject = 'Ihr DISH TOOLS Angebot';
    }

    // Öffnen des E-Mail-Clients mit vorgefertigtem Inhalt
    const body = encodeURIComponent(emailBody);
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
}

/* POS Rechner Funktionen */

/* Funktion zur Berechnung der POS Kosten */
function calculatePosCosts() {
    // Kundennamen erfassen
    const customerName = document.getElementById('posCustomerName').value.trim();
    if (!customerName) {
        alert("Bitte geben Sie den Kundennamen ein.");
        return;
    }

    const hardwareSelect = document.getElementById('posHardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const quantity = parseInt(selectedHardware.getAttribute('data-quantity')) || 1;

    const priceOnce = parseFloat(selectedHardware.getAttribute('data-price-once')) || 0;
    const price12 = parseFloat(selectedHardware.getAttribute('data-price-12')) || 0;
    const price36 = parseFloat(selectedHardware.getAttribute('data-price-36')) || 0;
    const price60 = parseFloat(selectedHardware.getAttribute('data-price-60')) || 0;

    const discount = parseFloat(document.getElementById('posDiscount').value) || 0;

    // Berechnung der einmaligen Kosten
    const einmaligeKostenNetto = priceOnce * quantity;
    const einmaligeKostenMwSt = einmaligeKostenNetto * 0.19;
    const einmaligeKostenBrutto = einmaligeKostenNetto + einmaligeKostenMwSt;

    // Berechnung der Lizenzen und Services (Beispielwerte, anpassen nach Bedarf)
    const totalLicenseNetto = 69.00 + (29.00 * 4) + 25.00 + 10.00 + 34.90;
    const totalLicenseMwSt = totalLicenseNetto * 0.19;
    const totalLicenseBrutto = totalLicenseNetto + totalLicenseMwSt;

    // Rabatt anwenden
    const discountNetto = discount;
    const discountMwSt = discountNetto * 0.19;
    const discountBrutto = discountNetto + discountMwSt;

    // Gesamtkosten berechnen
    const totalNetto = einmaligeKostenNetto + totalLicenseNetto - discountNetto;
    const totalMwSt = einmaligeKostenMwSt + totalLicenseMwSt - discountMwSt;
    const totalBrutto = einmaligeKostenBrutto + totalLicenseBrutto - discountBrutto;

    // Ergebnis anzeigen
    document.getElementById('posTotalHardwareNetto').innerText = einmaligeKostenNetto.toFixed(2);
    document.getElementById('posTotalHardwareMwSt').innerText = einmaligeKostenMwSt.toFixed(2);
    document.getElementById('posTotalHardwareBrutto').innerText = einmaligeKostenBrutto.toFixed(2);

    document.getElementById('posTotalLicenseNetto').innerText = totalLicenseNetto.toFixed(2);
    document.getElementById('posTotalLicenseMwSt').innerText = totalLicenseMwSt.toFixed(2);
    document.getElementById('posTotalLicenseBrutto').innerText = totalLicenseBrutto.toFixed(2);

    document.getElementById('posDiscountNetto').innerText = `-${discountNetto.toFixed(2)}`;
    document.getElementById('posDiscountMwSt').innerText = `-${discountMwSt.toFixed(2)}`;
    document.getElementById('posDiscountBrutto').innerText = `-${discountBrutto.toFixed(2)}`;

    document.getElementById('posTotalNetto').innerText = `${totalNetto.toFixed(2)} €`;
    document.getElementById('posTotalMwSt').innerText = `${totalMwSt.toFixed(2)} €`;
    document.getElementById('posTotalBrutto').innerText = `${totalBrutto.toFixed(2)} €`;
}

/* TOOLS Rechner Funktionen */

/* Funktion zum Umschalten der DISH Reservation Dauer */
function toggleDishReservationDuration() {
    const dishReservation = document.getElementById('dishReservation').checked;
    const dishReservationDuration = document.getElementById('dishReservationDuration');
    dishReservationDuration.classList.toggle('hidden', !dishReservation);
}

/* Funktion zum Umschalten der DISH Order Dauer */
function toggleDishOrderDuration() {
    const dishOrder = document.getElementById('dishOrder').checked;
    const dishOrderDuration = document.getElementById('dishOrderDuration');
    dishOrderDuration.classList.toggle('hidden', !dishOrder);
}

/* Funktion zum Umschalten der DISH Premium Dauer */
function toggleDishPremiumDuration() {
    const dishPremium = document.getElementById('dishPremium').checked;
    const dishPremiumDuration = document.getElementById('dishPremiumDuration');
    dishPremiumDuration.classList.toggle('hidden', !dishPremium);
}

/* Funktion zur Berechnung der TOOLS Kosten */
function calculateToolsCosts() {
    // Kundennamen erfassen
    const customerName = document.getElementById('toolsCustomerName').value.trim();
    if (!customerName) {
        alert("Bitte geben Sie den Kundennamen ein.");
        return;
    }

    // Auswahl der Lösungen und Vertragslaufzeiten
    let monthlyCostNetto = 0;
    let activationCostNetto = 0;

    if (document.getElementById('dishStarter').checked) {
        // Beispielwerte, anpassen nach Bedarf
        monthlyCostNetto += 10.00; // DISH Starter monatlich
    }

    if (document.getElementById('dishReservation').checked) {
        const duration = document.getElementById('dishReservationDurationSelect').value;
        if (duration === "36") {
            monthlyCostNetto += 34.90;
        } else if (duration === "12") {
            monthlyCostNetto += 44.00;
        } else if (duration === "3") {
            monthlyCostNetto += 49.00;
        }
    }

    if (document.getElementById('dishOrder').checked) {
        const duration = document.getElementById('dishOrderDurationSelect').value;
        if (duration === "12") {
            monthlyCostNetto += 49.90;
        } else if (duration === "3") {
            monthlyCostNetto += 59.90;
        }
    }

    if (document.getElementById('dishPremium').checked) {
        const duration = document.getElementById('dishPremiumDurationSelect').value;
        if (duration === "12") {
            monthlyCostNetto += 69.90;
        } else if (duration === "3") {
            monthlyCostNetto += 79.90;
        }
    }

    // Aktivierungskosten (Beispielwert, anpassen nach Bedarf)
    activationCostNetto += 0.00; // Falls es Aktivierungskosten gibt

    // Rabatt und kostenlose Monate
    const discountAmount = parseFloat(document.getElementById('toolsDiscountAmount').value) || 0;
    const freeMonths = parseInt(document.getElementById('toolsFreeMonths').value) || 0;

    // Rabatt anwenden
    const discountedActivationCostNetto = activationCostNetto - discountAmount;
    const discountedActivationCostMwSt = discountedActivationCostNetto * 0.19;
    const discountedActivationCostBrutto = discountedActivationCostNetto + discountedActivationCostMwSt;

    // Kostenlose Monate anwenden
    let adjustedMonthlyCostNetto = monthlyCostNetto;
    if (freeMonths > 0) {
        adjustedMonthlyCostNetto = monthlyCostNetto * ((12 - freeMonths) / 12);
    }

    const adjustedMonthlyCostMwSt = adjustedMonthlyCostNetto * 0.19;
    const adjustedMonthlyCostBrutto = adjustedMonthlyCostNetto + adjustedMonthlyCostMwSt;

    // Gesamtkosten berechnen
    const totalNetto = adjustedMonthlyCostNetto + discountedActivationCostNetto;
    const totalMwSt = adjustedMonthlyCostMwSt + discountedActivationCostMwSt;
    const totalBrutto = adjustedMonthlyCostBrutto + discountedActivationCostBrutto;

    // Ergebnis anzeigen
    document.getElementById('toolsMonthlyCostNetto').innerText = adjustedMonthlyCostNetto.toFixed(2);
    document.getElementById('toolsMonthlyCostMwSt').innerText = adjustedMonthlyCostMwSt.toFixed(2);
    document.getElementById('toolsMonthlyCostBrutto').innerText = adjustedMonthlyCostBrutto.toFixed(2);

    document.getElementById('toolsActivationCostNetto').innerText = discountedActivationCostNetto.toFixed(2);
    document.getElementById('toolsActivationCostMwSt').innerText = discountedActivationCostMwSt.toFixed(2);
    document.getElementById('toolsActivationCostBrutto').innerText = discountedActivationCostBrutto.toFixed(2);

    document.getElementById('toolsDiscountNetto').innerText = `-${discountAmount.toFixed(2)}`;
    document.getElementById('toolsDiscountMwSt').innerText = `-${(discountAmount * 0.19).toFixed(2)}`;
    document.getElementById('toolsDiscountBrutto').innerText = `-${(discountAmount * 1.19).toFixed(2)}`;

    document.getElementById('toolsTotalNetto').innerText = `${totalNetto.toFixed(2)} €`;
    document.getElementById('toolsTotalMwSt').innerText = `${totalMwSt.toFixed(2)} €`;
    document.getElementById('toolsTotalBrutto').innerText = `${totalBrutto.toFixed(2)} €`;
}

