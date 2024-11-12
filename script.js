// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Tooltips initialisieren
    tippy('[data-tippy-content]', {
        placement: 'right',
    });

    // Standardmäßig PAY-Rechner anzeigen
    openCalculator(null, 'pay');

    // PAY-Hardware-Optionen initialisieren
    updatePayHardwareOptions();

    // Event Listener für PAY-Rechner
    document.getElementById('payPurchaseOption').addEventListener('change', () => {
        togglePayRentalOptions();
        updatePayHardwareOptions();
    });

    const payRentalDurationElement = document.getElementById('payRentalDuration');
    if (payRentalDurationElement) {
        payRentalDurationElement.addEventListener('change', updatePayHardwareOptions);
    }
});

// Funktion zum Umschalten zwischen den Rechnern
function openCalculator(evt, calculatorName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('active');
    });

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(calculatorName).classList.remove('hidden');
    document.getElementById(calculatorName).classList.add('active');

    if (evt) {
        evt.currentTarget.classList.add('active');
    } else {
        // Standardmäßig den ersten Tab aktivieren
        document.querySelector('.tab-link').classList.add('active');
    }
}

/* PAY-Rechner-Funktionen */

// Funktion zum Umschalten der Mietoptionen
function togglePayRentalOptions() {
    const purchaseOption = document.getElementById('payPurchaseOption').value;
    const rentalDurationSection = document.getElementById('payRentalDurationSection');

    if (purchaseOption === 'mieten') {
        rentalDurationSection.classList.remove('hidden');
    } else {
        rentalDurationSection.classList.add('hidden');
    }

    // Hardware-Dropdown aktualisieren
    updatePayHardwareOptions();
}

// Funktion zum Aktualisieren der Hardware-Optionen basierend auf Kauf oder Miete
function updatePayHardwareOptions() {
    const purchaseOption = document.getElementById('payPurchaseOption').value;
    const hardwareSelect = document.getElementById('payHardware');
    const rentalDurationElement = document.getElementById('payRentalDuration');
    const rentalDuration = rentalDurationElement ? rentalDurationElement.value : '12M';

    // Aktuelle Auswahl speichern
    const currentSelection = hardwareSelect.value;

    // Hardware-Optionen zurücksetzen
    hardwareSelect.innerHTML = '';

    if (purchaseOption === 'kaufen') {
        hardwareSelect.innerHTML = `
            <option value="S1F2">S1F2 Terminal - Kauf: 499,00 €</option>
            <option value="V400C">V400C Terminal - Kauf: 399,00 €</option>
            <option value="Moto G14">Moto G14 Terminal - Kauf: 119,00 €</option>
        `;
    } else {
        // Mietpreise entsprechend der Mietdauer anzeigen
        let s1f2Price = 0;
        let v400cPrice = 0;
        let tap2payPrice = 7.90; // Nur 12M verfügbar

        if (rentalDuration === '12M') {
            s1f2Price = 44.90;
            v400cPrice = 39.90;
        } else if (rentalDuration === '36M') {
            s1f2Price = 18.90;
            v400cPrice = 16.90;
        } else if (rentalDuration === '60M') {
            s1f2Price = 14.90;
            v400cPrice = 12.90;
        }

        hardwareSelect.innerHTML = `
            <option value="S1F2">S1F2 Terminal - Miete: ${s1f2Price.toFixed(2)} €/Monat</option>
            <option value="V400C">V400C Terminal - Miete: ${v400cPrice.toFixed(2)} €/Monat</option>
            <option value="Tap2Pay">Tap2Pay Lizenz - Miete: ${tap2payPrice.toFixed(2)} €/Monat</option>
        `;
    }

    // Wenn die vorherige Auswahl noch vorhanden ist, diese wieder auswählen
    if (hardwareSelect.querySelector(`option[value="${currentSelection}"]`)) {
        hardwareSelect.value = currentSelection;
    } else {
        hardwareSelect.selectedIndex = 0;
    }
}

function calculatePay() {
    // Eingaben validieren
    const salutation = document.getElementById('paySalutation').value;
    const customerName = document.getElementById('payCustomerName').value.trim();
    const customerNameError = document.getElementById('payCustomerNameError');

    if (!customerName) {
        customerNameError.textContent = 'Bitte geben Sie den Kundennamen ein.';
        return;
    } else {
        customerNameError.textContent = '';
    }

    const monthlyVolume = parseFloat(document.getElementById('payMonthlyVolume').value);
    const transactions = parseInt(document.getElementById('payTransactions').value);
    const averageReceipt = parseFloat(document.getElementById('payAverageReceipt').value);
    const girocardPercentage = parseFloat(document.getElementById('payGirocard').value);
    const mastercardVisaPercentage = parseFloat(document.getElementById('payMastercardVisa').value);
    const vpayPercentage = parseFloat(document.getElementById('payVpay').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('payBusinessCard').value) || 0;

    // Weitere Validierung
    let isValid = true;
    if (isNaN(monthlyVolume) || monthlyVolume <= 0) {
        document.getElementById('payMonthlyVolumeError').textContent = 'Bitte geben Sie einen gültigen Betrag ein.';
        isValid = false;
    } else {
        document.getElementById('payMonthlyVolumeError').textContent = '';
    }

    if (isNaN(transactions) || transactions <= 0) {
        document.getElementById('payTransactionsError').textContent = 'Bitte geben Sie eine gültige Anzahl ein.';
        isValid = false;
    } else {
        document.getElementById('payTransactionsError').textContent = '';
    }

    if (isNaN(averageReceipt) || averageReceipt <= 0) {
        document.getElementById('payAverageReceiptError').textContent = 'Bitte geben Sie einen gültigen Betrag ein.';
        isValid = false;
    } else {
        document.getElementById('payAverageReceiptError').textContent = '';
    }

    if (isNaN(girocardPercentage) || girocardPercentage < 0) {
        document.getElementById('payGirocardError').textContent = 'Bitte geben Sie einen gültigen Prozentsatz ein.';
        isValid = false;
    } else {
        document.getElementById('payGirocardError').textContent = '';
    }

    if (isNaN(mastercardVisaPercentage) || mastercardVisaPercentage < 0) {
        document.getElementById('payMastercardVisaError').textContent = 'Bitte geben Sie einen gültigen Prozentsatz ein.';
        isValid = false;
    } else {
        document.getElementById('payMastercardVisaError').textContent = '';
    }

    if (isNaN(vpayPercentage) || vpayPercentage < 0) {
        document.getElementById('payVpayError').textContent = 'Bitte geben Sie einen gültigen Prozentsatz ein.';
        isValid = false;
    } else {
        document.getElementById('payVpayError').textContent = '';
    }

    if (isNaN(businessCardPercentage) || businessCardPercentage < 0) {
        document.getElementById('payBusinessCardError').textContent = 'Bitte geben Sie einen gültigen Prozentsatz ein.';
        isValid = false;
    } else {
        document.getElementById('payBusinessCardError').textContent = '';
    }

    const totalPercentage = girocardPercentage + mastercardVisaPercentage + vpayPercentage + businessCardPercentage;
    if (totalPercentage !== 100) {
        document.getElementById('payPercentageError').textContent = 'Die Summe der Prozentangaben muss 100% ergeben.';
        isValid = false;
    } else {
        document.getElementById('payPercentageError').textContent = '';
    }

    if (!isValid) {
        return;
    }

    // Berechnungen durchführen
    const girocardVolume = monthlyVolume * (girocardPercentage / 100);
    const mastercardVisaVolume = monthlyVolume * (mastercardVisaPercentage / 100);
    const vpayVolume = monthlyVolume * (vpayPercentage / 100);
    const businessCardVolume = monthlyVolume * (businessCardPercentage / 100);

    let girocardFeeRate = 0;
    if (girocardVolume <= 10000) {
        girocardFeeRate = 0.0039; // 0,39%
    } else {
        girocardFeeRate = 0.0029; // 0,29%
    }
    const girocardCost = girocardVolume * girocardFeeRate;
    const mastercardVisaCost = mastercardVisaVolume * 0.0089; // 0,89%
    const vpayCost = vpayVolume * 0.0089; // 0,89%
    const businessCardCost = businessCardVolume * 0.0289; // 2,89%

    const transactionCost = transactions * 0.06;

    const totalFees = girocardCost + mastercardVisaCost + vpayCost + businessCardCost + transactionCost;

    // Wettbewerbsgebühren
    const competitorFees = parseFloat(document.getElementById('competitorFees').value) || 0;

    // Ersparnis berechnen
    const savings = competitorFees - totalFees;

    // Hardwarekosten
    const purchaseOption = document.getElementById('payPurchaseOption').value;
    const rentalDuration = document.getElementById('payRentalDuration').value;
    const hardwareSelection = document.getElementById('payHardware').value;

    let hardwareCost = 0;
    let simServiceFee = 0;
    let oneTimeCost = 0;

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
    } else {
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
        simServiceFee = 0; // Bei Miete keine SIM/Service-Gebühr
        oneTimeCost = 0; // Keine einmaligen Kosten bei Miete
    }

    // Gesamtkosten
    const totalMonthlyCostNet = hardwareCost + simServiceFee + totalFees;
    const mwstRate = 0.19;
    const mwstAmount = totalMonthlyCostNet * mwstRate;
    const totalMonthlyCostGross = totalMonthlyCostNet + mwstAmount;

    // Ergebnis anzeigen
    const resultArea = document.getElementById('payResultArea');
    let resultHtml = `
        <h2>Angebot für ${salutation} ${customerName}</h2>
        <p>Vielen Dank für Ihr Interesse an DISH PAY!</p>
        <table class="result-table">
            <tr>
                <th>Posten</th>
                <th>Betrag (€)</th>
            </tr>
    `;
    if (purchaseOption === 'kaufen') {
        resultHtml += `
            <tr>
                <td>Einmalige Hardwarekosten (Netto)</td>
                <td>${oneTimeCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td>SIM/Service-Gebühr monatlich (Netto)</td>
                <td>${simServiceFee.toFixed(2)}</td>
            </tr>
        `;
    } else {
        resultHtml += `
            <tr>
                <td>Monatliche Mietkosten (Netto)</td>
                <td>${hardwareCost.toFixed(2)}</td>
            </tr>
        `;
    }
    resultHtml += `
            <tr>
                <td>Transaktionskosten monatlich (Netto)</td>
                <td>${transactionCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Gesamte Gebühren monatlich (Netto)</td>
                <td>${totalFees.toFixed(2)}</td>
            </tr>
            <tr>
                <th>Gesamtkosten monatlich (Netto)</th>
                <th>${totalMonthlyCostNet.toFixed(2)}</th>
            </tr>
            <tr>
                <td>Mehrwertsteuer (19%)</td>
                <td>${mwstAmount.toFixed(2)}</td>
            </tr>
            <tr>
                <th>Gesamtkosten monatlich (Brutto)</th>
                <th>${totalMonthlyCostGross.toFixed(2)}</th>
            </tr>
    `;

    if (competitorFees > 0) {
        resultHtml += `
            <tr>
                <td>Aktuelle Wettbewerbsgebühren (Netto)</td>
                <td>${competitorFees.toFixed(2)}</td>
            </tr>
            <tr>
                <th>Ersparnis pro Monat (Netto)</th>
                <th>${savings.toFixed(2)}</th>
            </tr>
        `;
    }

    resultHtml += `
        </table>
        <h3>Details der Gebühren:</h3>
        <ul>
            <li>Girocard Gebühren (${girocardPercentage}%): ${girocardCost.toFixed(2)} €</li>
            <li>Mastercard/VISA Gebühren (${mastercardVisaPercentage}%): ${mastercardVisaCost.toFixed(2)} €</li>
            <li>Maestro/VPAY Gebühren (${vpayPercentage}%): ${vpayCost.toFixed(2)} €</li>
            <li>Business Card Gebühren (${businessCardPercentage}%): ${businessCardCost.toFixed(2)} €</li>
            <li>Transaktionskosten: ${transactionCost.toFixed(2)} €</li>
        </ul>
        <p>Dieses Angebot ist unverbindlich und dient zu Ihrer Information.</p>
    `;

    resultArea.innerHTML = resultHtml;

    // E-Mail-Button aktivieren
    document.getElementById('paySendEmailButton').disabled = false;
}

function sendPayEmail() {
    const resultArea = document.getElementById('payResultArea');

    const emailContentContainer = document.getElementById('emailContentContainer');
    const emailContent = document.getElementById('emailContent');

    emailContent.innerHTML = resultArea.innerHTML;

    // Modal anzeigen
    emailContentContainer.classList.remove('hidden');
}

function closeEmailContent() {
    const emailContentContainer = document.getElementById('emailContentContainer');
    emailContentContainer.classList.add('hidden');
}

/* POS-Rechner-Funktionen */
function calculatePos() {
    // Eingaben validieren
    const salutation = document.getElementById('posSalutation').value;
    const customerName = document.getElementById('posCustomerName').value.trim();
    const customerNameError = document.getElementById('posCustomerNameError');

    if (!customerName) {
        customerNameError.textContent = 'Bitte geben Sie den Kundennamen ein.';
        return;
    } else {
        customerNameError.textContent = '';
    }

    // Preise definieren
    const prices = {
        hardware: {
            sunmi: 493.00,
            tse: 159.00,
            menueingabe: 300.00,
            einrichtung: 599.00,
            handheld: 220.00,
            drucker: 229.00,
            ladestation: 79.00,
            accesspoint: 189.00,
            router: 55.00,
            switch: 107.00
        },
        optional: {
            kassenschublade: 69.00,
            qrOrdering: 49.00,
            aggregator: 59.00
        },
        licenses: {
            hauptlizenz: 69.00,
            datev: 25.00,
            gutschein: 10.00,
            tap2pay: 7.50
        }
    };

    // Eingaben auslesen
    const quantities = {
        sunmi: parseInt(document.getElementById('sunmi').value) || 0,
        tse: parseInt(document.getElementById('tse').value) || 0,
        menueingabe: parseInt(document.getElementById('menueingabe').value) || 0,
        einrichtung: parseInt(document.getElementById('einrichtung').value) || 0,
        handheld: parseInt(document.getElementById('handheld').value) || 0,
        drucker: parseInt(document.getElementById('drucker').value) || 0,
        ladestation: parseInt(document.getElementById('ladestation').value) || 0,
        accesspoint: parseInt(document.getElementById('accesspoint').value) || 0,
        router: parseInt(document.getElementById('router').value) || 0,
        switch: parseInt(document.getElementById('switch').value) || 0,
        kassenschublade: parseInt(document.getElementById('kassenschublade').value) || 0,
        qrOrdering: parseInt(document.getElementById('qrOrdering').value) || 0,
        aggregator: parseInt(document.getElementById('aggregator').value) || 0
    };

    const licenses = {
        hauptlizenz: document.getElementById('hauptlizenz').checked,
        datev: document.getElementById('datev').checked,
        gutschein: document.getElementById('gutschein').checked,
        tap2pay: document.getElementById('tap2pay').checked
    };

    // Berechnungen durchführen
    let totalHardwareCost = 0;
    totalHardwareCost += quantities.sunmi * prices.hardware.sunmi;
    totalHardwareCost += quantities.tse * prices.hardware.tse;
    totalHardwareCost += quantities.menueingabe * prices.hardware.menueingabe;
    totalHardwareCost += quantities.einrichtung * prices.hardware.einrichtung;
    totalHardwareCost += quantities.handheld * prices.hardware.handheld;
    totalHardwareCost += quantities.drucker * prices.hardware.drucker;
    totalHardwareCost += quantities.ladestation * prices.hardware.ladestation;
    totalHardwareCost += quantities.accesspoint * prices.hardware.accesspoint;
    totalHardwareCost += quantities.router * prices.hardware.router;
    totalHardwareCost += quantities.switch * prices.hardware.switch;

    let totalOptionalCost = 0;
    totalOptionalCost += quantities.kassenschublade * prices.optional.kassenschublade;
    totalOptionalCost += quantities.qrOrdering * prices.optional.qrOrdering;
    totalOptionalCost += quantities.aggregator * prices.optional.aggregator;

    let totalMonthlyCost = 0;
    if (licenses.hauptlizenz) {
        totalMonthlyCost += prices.licenses.hauptlizenz;
    }
    if (licenses.datev) {
        totalMonthlyCost += prices.licenses.datev;
    }
    if (licenses.gutschein) {
        totalMonthlyCost += prices.licenses.gutschein;
    }
    if (licenses.tap2pay) {
        totalMonthlyCost += prices.licenses.tap2pay;
    }

    // MwSt berechnen
    const mwstRate = 0.19;
    const totalHardwareCostMwst = totalHardwareCost * mwstRate;
    const totalOptionalCostMwst = totalOptionalCost * mwstRate;
    const totalMonthlyCostMwst = totalMonthlyCost * mwstRate;

    const totalHardwareCostBrutto = totalHardwareCost + totalHardwareCostMwst;
    const totalOptionalCostBrutto = totalOptionalCost + totalOptionalCostMwst;
    const totalMonthlyCostBrutto = totalMonthlyCost + totalMonthlyCostMwst;

    // Ergebnis anzeigen
    const resultArea = document.getElementById('posResultArea');
    resultArea.innerHTML = `
        <h2>Angebot für ${salutation} ${customerName}</h2>
        <p>Vielen Dank für Ihr Interesse an DISH POS!</p>
        <table class="result-table">
            <tr>
                <th>Posten</th>
                <th>Nettobetrag (€)</th>
                <th>MwSt (€)</th>
                <th>Bruttobetrag (€)</th>
            </tr>
            <tr>
                <td>Gesamtkosten Hardware</td>
                <td>${totalHardwareCost.toFixed(2)}</td>
                <td>${totalHardwareCostMwst.toFixed(2)}</td>
                <td>${totalHardwareCostBrutto.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Optionale Kosten</td>
                <td>${totalOptionalCost.toFixed(2)}</td>
                <td>${totalOptionalCostMwst.toFixed(2)}</td>
                <td>${totalOptionalCostBrutto.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Monatliche Kosten</td>
                <td>${totalMonthlyCost.toFixed(2)}</td>
                <td>${totalMonthlyCostMwst.toFixed(2)}</td>
                <td>${totalMonthlyCostBrutto.toFixed(2)}</td>
            </tr>
        </table>
        <p>Dieses Angebot ist unverbindlich und dient zu Ihrer Information.</p>
    `;

    // E-Mail-Button aktivieren
    document.getElementById('posSendEmailButton').disabled = false;
}

function sendPosEmail() {
    const resultArea = document.getElementById('posResultArea');

    const emailContentContainer = document.getElementById('emailContentContainer');
    const emailContent = document.getElementById('emailContent');

    emailContent.innerHTML = resultArea.innerHTML;

    // Modal anzeigen
    emailContentContainer.classList.remove('hidden');
}

/* TOOLS-Rechner-Funktionen */
function calculateTools() {
    // Eingaben validieren
    const salutation = document.getElementById('toolsSalutation').value;
    const customerName = document.getElementById('toolsCustomerName').value.trim();
    const customerNameError = document.getElementById('toolsCustomerNameError');

    if (!customerName) {
        customerNameError.textContent = 'Bitte geben Sie den Kundennamen ein.';
        return;
    } else {
        customerNameError.textContent = '';
    }

    // Preise definieren
    const prices = {
        dishStarter: {
            monatlich: 10.00,
            aktivierung: 69.00
        },
        dishReservation: {
            monatlich12: 44.00,
            monatlich36: 34.90,
            monatlich3: 49.00,
            aktivierung: 69.00
        },
        dishOrder: {
            monatlich12: 49.90,
            monatlich3: 59.90,
            aktivierung: 299.00
        },
        dishPremium: {
            monatlich12: 69.90,
            monatlich3: 79.90,
            aktivierung: 279.00
        }
    };

    // Eingaben auslesen
    const solutions = {
        dishStarter: document.getElementById('dishStarter').checked,
        dishReservation: document.getElementById('dishReservation').checked,
        dishOrder: document.getElementById('dishOrder').checked,
        dishPremium: document.getElementById('dishPremium').checked
    };

    const contractDuration = document.getElementById('contractDuration').value;

    // Berechnungen durchführen
    let totalMonthlyCost = 0;
    let totalActivationCost = 0;

    if (solutions.dishStarter) {
        totalMonthlyCost += prices.dishStarter.monatlich;
        totalActivationCost += prices.dishStarter.aktivierung;
    }

    if (solutions.dishReservation) {
        if (contractDuration === '12M') {
            totalMonthlyCost += prices.dishReservation.monatlich12;
        } else if (contractDuration === '36M') {
            totalMonthlyCost += prices.dishReservation.monatlich36;
        } else {
            totalMonthlyCost += prices.dishReservation.monatlich3;
        }
        totalActivationCost += prices.dishReservation.aktivierung;
    }

    if (solutions.dishOrder) {
        if (contractDuration === '12M') {
            totalMonthlyCost += prices.dishOrder.monatlich12;
        } else {
            totalMonthlyCost += prices.dishOrder.monatlich3;
        }
        totalActivationCost += prices.dishOrder.aktivierung;
    }

    if (solutions.dishPremium) {
        if (contractDuration === '12M') {
            totalMonthlyCost += prices.dishPremium.monatlich12;
        } else {
            totalMonthlyCost += prices.dishPremium.monatlich3;
        }
        totalActivationCost += prices.dishPremium.aktivierung;
    }

    // MwSt berechnen
    const mwstRate = 0.19;
    const totalMonthlyCostMwst = totalMonthlyCost * mwstRate;
    const totalActivationCostMwst = totalActivationCost * mwstRate;

    const totalMonthlyCostBrutto = totalMonthlyCost + totalMonthlyCostMwst;
    const totalActivationCostBrutto = totalActivationCost + totalActivationCostMwst;

    // Ergebnis anzeigen
    const resultArea = document.getElementById('toolsResultArea');
    resultArea.innerHTML = `
        <h2>Angebot für ${salutation} ${customerName}</h2>
        <p>Vielen Dank für Ihr Interesse an DISH TOOLS!</p>
        <table class="result-table">
            <tr>
                <th>Posten</th>
                <th>Nettobetrag (€)</th>
                <th>MwSt (€)</th>
                <th>Bruttobetrag (€)</th>
            </tr>
            <tr>
                <td>Monatliche Kosten</td>
                <td>${totalMonthlyCost.toFixed(2)}</td>
                <td>${totalMonthlyCostMwst.toFixed(2)}</td>
                <td>${totalMonthlyCostBrutto.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Aktivierungsgebühren</td>
                <td>${totalActivationCost.toFixed(2)}</td>
                <td>${totalActivationCostMwst.toFixed(2)}</td>
                <td>${totalActivationCostBrutto.toFixed(2)}</td>
            </tr>
        </table>
        <p>Dieses Angebot ist unverbindlich und dient zu Ihrer Information.</p>
    `;

    // E-Mail-Button aktivieren
    document.getElementById('toolsSendEmailButton').disabled = false;
}

function sendToolsEmail() {
    const resultArea = document.getElementById('toolsResultArea');

    const emailContentContainer = document.getElementById('emailContentContainer');
    const emailContent = document.getElementById('emailContent');

    emailContent.innerHTML = resultArea.innerHTML;

    // Modal anzeigen
    emailContentContainer.classList.remove('hidden');
}
