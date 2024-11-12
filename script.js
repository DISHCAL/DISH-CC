// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Tooltips initialisieren
    tippy('[data-tippy-content]', {
        placement: 'right',
    });

    // Standardmäßig PAY-Rechner anzeigen
    openCalculator(null, 'pay');
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
    const girocardPercentage = parseFloat(document.getElementById('payGirocard').value);
    const mastercardVisaPercentage = parseFloat(document.getElementById('payMastercardVisa').value);

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

    const totalPercentage = girocardPercentage + mastercardVisaPercentage;
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

    let girocardFeeRate = 0;
    if (girocardVolume <= 10000) {
        girocardFeeRate = 0.0039; // 0,39%
    } else {
        girocardFeeRate = 0.0029; // 0,29%
    }
    const girocardCost = girocardVolume * girocardFeeRate;
    const mastercardVisaCost = mastercardVisaVolume * 0.0089; // 0,89%
    const transactionCost = transactions * 0.06;

    const totalFees = girocardCost + mastercardVisaCost + transactionCost;

    // Ergebnis anzeigen
    const resultArea = document.getElementById('payResultArea');
    resultArea.innerHTML = `
        <h2>Angebot für ${salutation} ${customerName}</h2>
        <p>Vielen Dank für Ihr Interesse an DISH PAY!</p>
        <table class="result-table">
            <tr>
                <th>Posten</th>
                <th>Betrag (€)</th>
            </tr>
            <tr>
                <td>Girocard Gebühren</td>
                <td>${girocardCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Mastercard/VISA Gebühren</td>
                <td>${mastercardVisaCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Transaktionskosten</td>
                <td>${transactionCost.toFixed(2)}</td>
            </tr>
            <tr>
                <th>Gesamtkosten</th>
                <th>${totalFees.toFixed(2)}</th>
            </tr>
        </table>
        <p>Dieses Angebot ist unverbindlich und dient zu Ihrer Information.</p>
    `;

    // E-Mail-Button aktivieren
    document.getElementById('paySendEmailButton').disabled = false;
}

function sendPayEmail() {
    const salutation = document.getElementById('paySalutation').value;
    const customerName = document.getElementById('payCustomerName').value.trim();

    // Angebotstext generieren
    const emailContentContainer = document.getElementById('emailContentContainer');
    const emailContent = document.getElementById('emailContent');
    const resultArea = document.getElementById('payResultArea');

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
        // ... weitere Hardware-Komponenten
    };

    const options = {
        kassenschublade: document.getElementById('kassenschublade').checked,
        // ... weitere Optionen
    };

    const licenses = {
        hauptlizenz: document.getElementById('hauptlizenz').checked,
        // ... weitere Lizenzen
    };

    // Berechnungen durchführen
    let totalHardwareCost = 0;
    totalHardwareCost += quantities.sunmi * prices.hardware.sunmi;
    // ... weitere Berechnungen

    let totalOptionalCost = 0;
    if (options.kassenschublade) {
        totalOptionalCost += prices.optional.kassenschublade;
    }
    // ... weitere Berechnungen

    let totalMonthlyCost = 0;
    if (licenses.hauptlizenz) {
        totalMonthlyCost += prices.licenses.hauptlizenz;
    }
    // ... weitere Berechnungen

    // Ergebnis anzeigen
    const resultArea = document.getElementById('posResultArea');
    resultArea.innerHTML = `
        <h2>Angebot für ${salutation} ${customerName}</h2>
        <p>Vielen Dank für Ihr Interesse an DISH POS!</p>
        <table class="result-table">
            <tr>
                <th>Posten</th>
                <th>Betrag (€)</th>
            </tr>
            <tr>
                <td>Gesamtkosten Hardware</td>
                <td>${totalHardwareCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Optionale Kosten</td>
                <td>${totalOptionalCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Monatliche Kosten</td>
                <td>${totalMonthlyCost.toFixed(2)}</td>
            </tr>
        </table>
        <p>Dieses Angebot ist unverbindlich und dient zu Ihrer Information.</p>
    `;

    // E-Mail-Button aktivieren
    document.getElementById('posSendEmailButton').disabled = false;
}

function sendPosEmail() {
    const salutation = document.getElementById('posSalutation').value;
    const customerName = document.getElementById('posCustomerName').value.trim();

    // Angebotstext generieren
    const emailContentContainer = document.getElementById('emailContentContainer');
    const emailContent = document.getElementById('emailContent');
    const resultArea = document.getElementById('posResultArea');

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
        // ... weitere Lösungen
    };

    // Vertragslaufzeiten auslesen (wenn zutreffend)
    // ...

    // Berechnungen durchführen
    let totalMonthlyCost = 0;
    let totalActivationCost = 0;

    if (solutions.dishStarter) {
        totalMonthlyCost += prices.dishStarter.monatlich;
        totalActivationCost += prices.dishStarter.aktivierung;
    }
    // ... weitere Berechnungen

    // Ergebnis anzeigen
    const resultArea = document.getElementById('toolsResultArea');
    resultArea.innerHTML = `
        <h2>Angebot für ${salutation} ${customerName}</h2>
        <p>Vielen Dank für Ihr Interesse an DISH TOOLS!</p>
        <table class="result-table">
            <tr>
                <th>Posten</th>
                <th>Betrag (€)</th>
            </tr>
            <tr>
                <td>Monatliche Kosten</td>
                <td>${totalMonthlyCost.toFixed(2)}</td>
            </tr>
            <tr>
                <td>Aktivierungsgebühren</td>
                <td>${totalActivationCost.toFixed(2)}</td>
            </tr>
        </table>
        <p>Dieses Angebot ist unverbindlich und dient zu Ihrer Information.</p>
    `;

    // E-Mail-Button aktivieren
    document.getElementById('toolsSendEmailButton').disabled = false;
}

function sendToolsEmail() {
    const salutation = document.getElementById('toolsSalutation').value;
    const customerName = document.getElementById('toolsCustomerName').value.trim();

    // Angebotstext generieren
    const emailContentContainer = document.getElementById('emailContentContainer');
    const emailContent = document.getElementById('emailContent');
    const resultArea = document.getElementById('toolsResultArea');

    emailContent.innerHTML = resultArea.innerHTML;

    // Modal anzeigen
    emailContentContainer.classList.remove('hidden');
}

function closeEmailContent() {
    const emailContentContainer = document.getElementById('emailContentContainer');
    emailContentContainer.classList.add('hidden');
}
