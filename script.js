// Tab-Umschaltung
function openCalculator(evt, calculatorName) {
    // Alle Inhalte verstecken
    var tabcontent = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // Alle Tabs inaktiv setzen
    var tablinks = document.getElementsByClassName("tab-link");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Aktiven Inhalt anzeigen und Tab aktiv setzen
    document.getElementById(calculatorName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Standardmäßig PAY anzeigen
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pay').classList.add('active');
    populateHardwareOptions();
    toggleCalculationFields();
    toggleRentalOptions();
});

// Hardware-Optionen initialisieren
function populateHardwareOptions() {
    var hardwareSelect = document.getElementById('hardware');
    var purchaseOption = document.getElementById('purchaseOption').value;

    var hardwareOptions = [
        {
            name: 'S1F2 Terminal',
            purchasePrice: 499.00,
            rentPrices: { '12': 34.90, '36': 18.90, '60': 14.90 }
        },
        {
            name: 'V400C Terminal',
            purchasePrice: 399.00,
            rentPrices: { '12': 39.90, '36': 16.90, '60': 12.90 }
        },
        {
            name: 'Moto G14 Terminal',
            purchasePrice: 119.00,
            rentPrices: {} // Keine Mietoptionen
        },
        {
            name: 'Tap2Pay Lizenz',
            purchasePrice: 0.00,
            rentPrices: { '12': 7.90 }
        }
    ];

    hardwareSelect.innerHTML = '';

    hardwareOptions.forEach(function(option) {
        var optionElement = document.createElement('option');
        optionElement.value = option.name;

        if (purchaseOption === 'kaufen') {
            optionElement.text = option.name + ' - Kauf: ' + option.purchasePrice.toFixed(2) + ' €';
            optionElement.setAttribute('data-price-once', option.purchasePrice);
        } else if (purchaseOption === 'mieten') {
            if (Object.keys(option.rentPrices).length > 0) {
                optionElement.text = option.name;
                optionElement.setAttribute('data-rent-prices', JSON.stringify(option.rentPrices));
            } else {
                // Gerät nicht verfügbar zur Miete
                return;
            }
        }

        // Zusätzliche Datenattribute für spezielle Gebühren
        if (option.name === 'Moto G14 Terminal') {
            optionElement.setAttribute('data-sim-fee', '7.90');
        } else if (option.name === 'Tap2Pay Lizenz') {
            optionElement.setAttribute('data-sim-fee', '0.00');
        } else {
            optionElement.setAttribute('data-sim-fee', '3.90');
        }

        hardwareSelect.add(optionElement);
    });

    updateRentalPrices();
    updateSimServiceFee();
}

function updateRentalPrices() {
    var hardwareSelect = document.getElementById('hardware');
    var rentalPeriodSelect = document.getElementById('rentalPeriod');

    var selectedOption = hardwareSelect.options[hardwareSelect.selectedIndex];
    var rentPrices = JSON.parse(selectedOption.getAttribute('data-rent-prices') || '{}');

    rentalPeriodSelect.innerHTML = '';

    for (var period in rentPrices) {
        var option = document.createElement('option');
        option.value = period;
        option.text = period + ' Monate - ' + rentPrices[period].toFixed(2) + ' €/Monat';
        option.setAttribute('data-monthly-price', rentPrices[period]);
        rentalPeriodSelect.add(option);
    }
}

function calculate() {
    var activeTab = document.querySelector('.tab-link.active').getAttribute('data-calculator');

    if (activeTab === 'pay') {
        calculatePay();
    } else if (activeTab === 'pos') {
        calculatePos();
    } else if (activeTab === 'tools') {
        calculateTools();
    }
}

// Weitere Funktionen zur Berechnung und Anzeige der Ergebnisse
// PAY Berechnung
function calculatePay() {
    // Eingabeüberprüfung
    var monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    var transactions = parseInt(document.getElementById('transactions').value);
    var girocardPercent = parseFloat(document.getElementById('girocard').value);
    var mastercardVisaPercent = parseFloat(document.getElementById('mastercardVisa').value);

    if (isNaN(monthlyVolume) || isNaN(transactions) || isNaN(girocardPercent) || isNaN(mastercardVisaPercent)) {
        displayInfoMessage('Bitte füllen Sie alle erforderlichen Felder aus.');
        return;
    }

    // Berechnung der Anteile
    var girocardVolume = monthlyVolume * (girocardPercent / 100);
    var mastercardVisaVolume = monthlyVolume * (mastercardVisaPercent / 100);

    var maestroVolume = 0;
    var businessCardVolume = 0;

    if (document.getElementById('maestro').value) {
        var maestroPercent = parseFloat(document.getElementById('maestro').value) || 0;
        maestroVolume = monthlyVolume * (maestroPercent / 100);
    }

    if (document.getElementById('businessCard').value) {
        var businessCardPercent = parseFloat(document.getElementById('businessCard').value) || 0;
        businessCardVolume = monthlyVolume * (businessCardPercent / 100);
    }

    // Gebühren berechnen
    var girocardFeeRate = 0.0039;
    if (monthlyVolume > 10000) {
        girocardFeeRate = 0.0029;
    }

    var girocardFee = girocardVolume * girocardFeeRate;
    var mastercardVisaFee = mastercardVisaVolume * 0.0089;
    var maestroFee = maestroVolume * 0.0089;
    var businessCardFee = businessCardVolume * 0.0289;
    var transactionFee = transactions * 0.06;

    var totalFees = girocardFee + mastercardVisaFee + maestroFee + businessCardFee + transactionFee;

    // Hardwarekosten
    var purchaseOption = document.getElementById('purchaseOption').value;
    var hardwareSelect = document.getElementById('hardware');
    var selectedHardwareText = hardwareSelect.options[hardwareSelect.selectedIndex].text;
    var hardwareName = hardwareSelect.value;
    var hardwareCost = 0;
    var hardwareMonthly = 0;
    var oneTimeCosts = 0;

    var simServiceFee = 0;

    if (purchaseOption === 'kaufen') {
        hardwareCost = parseFloat(hardwareSelect.options[hardwareSelect.selectedIndex].getAttribute('data-price-once')) || 0;
        oneTimeCosts += hardwareCost;

        // SIM/Service-Gebühr beim Kauf
        simServiceFee = parseFloat(hardwareSelect.options[hardwareSelect.selectedIndex].getAttribute('data-sim-fee')) || 0;
    } else {
        var rentalPeriodSelect = document.getElementById('rentalPeriod');
        var rentalPeriod = rentalPeriodSelect.value;
        var hardwareMonthlyPrice = parseFloat(rentalPeriodSelect.options[rentalPeriodSelect.selectedIndex].getAttribute('data-monthly-price')) || 0;
        hardwareMonthly = hardwareMonthlyPrice;

        // Keine SIM/Service-Gebühr bei Miete
        simServiceFee = 0;
    }

    // Gesamte monatliche Gebühren
    var totalMonthlyFees = hardwareMonthly + simServiceFee + totalFees;

    // Rabatt anwenden
    var discountType = document.getElementById('discountTypePay').value;
    var discountAmount = 0;
    var freeMonths = 0;

    if (discountType === 'oneTimeAmount') {
        discountAmount = parseFloat(document.getElementById('oneTimeAmountPay').value) || 0;
        oneTimeCosts -= discountAmount;
    } else if (discountType === 'freeMonths') {
        freeMonths = parseInt(document.getElementById('freeMonthsPay').value) || 0;
        totalMonthlyFees -= (totalMonthlyFees * freeMonths);
    }

    // Wettbewerbergebühren berechnen, falls angegeben
    var competitorContent = '';
    var competitorTotalFees = 0;
    if (document.getElementById('competitorGirocardFee').value || document.getElementById('competitorMastercardVisaFee').value || document.getElementById('competitorMaestroFee').value || document.getElementById('competitorBusinessCardFee').value) {
        var competitorGirocardFeePercent = parseFloat(document.getElementById('competitorGirocardFee').value) || 0;
        var competitorMastercardVisaFeePercent = parseFloat(document.getElementById('competitorMastercardVisaFee').value) || 0;
        var competitorMaestroFeePercent = parseFloat(document.getElementById('competitorMaestroFee').value) || 0;
        var competitorBusinessCardFeePercent = parseFloat(document.getElementById('competitorBusinessCardFee').value) || 0;

        var competitorGirocardFee = girocardVolume * (competitorGirocardFeePercent / 100);
        var competitorMastercardVisaFee = mastercardVisaVolume * (competitorMastercardVisaFeePercent / 100);
        var competitorMaestroFee = maestroVolume * (competitorMaestroFeePercent / 100);
        var competitorBusinessCardFee = businessCardVolume * (competitorBusinessCardFeePercent / 100);
        var competitorTransactionFee = 0; // Wettbewerber haben keine Transaktionsgebühren

        competitorTotalFees = competitorGirocardFee + competitorMastercardVisaFee + competitorMaestroFee + competitorBusinessCardFee + competitorTransactionFee;

        competitorContent = `
            \n\n**Wettbewerber Gebühren:**\n
            Girocard: ${competitorGirocardFee.toFixed(2)} €\n
            Mastercard/VISA: ${competitorMastercardVisaFee.toFixed(2)} €\n
            Maestro/VPAY: ${competitorMaestroFee.toFixed(2)} €\n
            Business Card: ${competitorBusinessCardFee.toFixed(2)} €\n
            **Gesamtgebühren beim Wettbewerber:** ${competitorTotalFees.toFixed(2)} €\n
        `;
    }

    // Ersparnis berechnen
    var savingsContent = '';
    if (document.getElementById('calculationType').value === 'ausführlich' && competitorTotalFees > 0) {
        var savings = competitorTotalFees - totalMonthlyFees;
        savingsContent = `\n\n**Ersparnis mit DISH PAY:** ${savings.toFixed(2)} €\n`;
    }

    // Ergebnisse anzeigen
    var resultContent = `
        **DISH PAY Gebühren**\n
        ${purchaseOption === 'kaufen' ? `
        Hardware (${hardwareName}): ${hardwareCost.toFixed(2)} €\n
        ` : `
        Hardware Miete (${hardwareName}): ${hardwareMonthly.toFixed(2)} € / Monat\n
        `}
        ${simServiceFee > 0 ? `SIM/Service-Gebühr: ${simServiceFee.toFixed(2)} € / Monat\n` : ''}
        Kartenumsatzgebühren: ${(totalFees).toFixed(2)} € / Monat\n
        ${purchaseOption === 'kaufen' ? `**Einmalige Kosten gesamt:** ${oneTimeCosts.toFixed(2)} €\n` : ''}
        **Gesamte monatliche Gebühren:** ${totalMonthlyFees.toFixed(2)} €\n
        ${competitorContent}
        ${savingsContent}
    `;

    displayResult(resultContent);
}

// Ergebnis anzeigen
function displayResult(content) {
    // Entferne bestehende Ergebnisse
    var existingResult = document.querySelector('.result-section');
    if (existingResult) {
        existingResult.parentElement.removeChild(existingResult);
    }

    // Füge das neue Ergebnis dem aktiven Rechner hinzu
    var activeCalculator = document.querySelector('.tab-content.active');
    var resultDiv = document.createElement('div');
    resultDiv.classList.add('result-section');
    resultDiv.innerHTML = '<pre>' + content + '</pre>';
    activeCalculator.appendChild(resultDiv);
}

// Funktion zum Anzeigen von Info-Nachrichten
function displayInfoMessage(message) {
    // Entferne bestehende Info-Nachrichten
    var existingInfo = document.querySelector('.info-message');
    if (existingInfo) {
        existingInfo.parentElement.removeChild(existingInfo);
    }

    var activeCalculator = document.querySelector('.tab-content.active');
    var infoDiv = document.createElement('div');
    infoDiv.classList.add('info-message');
    infoDiv.innerText = message;
    activeCalculator.insertBefore(infoDiv, activeCalculator.firstChild);
}

// Funktion zum Umschalten der Rabattfelder
function toggleDiscountFields(calculator) {
    var discountType = document.getElementById('discountType' + capitalizeFirstLetter(calculator)).value;
    var freeMonthsField = document.getElementById('freeMonthsField' + capitalizeFirstLetter(calculator));
    var oneTimeAmountField = document.getElementById('oneTimeAmountField' + capitalizeFirstLetter(calculator));

    if (discountType === 'freeMonths') {
        freeMonthsField.classList.remove('hidden');
        oneTimeAmountField.classList.add('hidden');
    } else if (discountType === 'oneTimeAmount') {
        oneTimeAmountField.classList.remove('hidden');
        freeMonthsField.classList.add('hidden');
    } else {
        freeMonthsField.classList.add('hidden');
        oneTimeAmountField.classList.add('hidden');
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Plus/Minus Funktionen
function increment(id) {
    var input = document.getElementById(id);
    input.value = parseInt(input.value) + 1;
    if (id === 'mobileDevicePos') {
        updateMobileLicenses();
    }
}

function decrement(id) {
    var input = document.getElementById(id);
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
        if (id === 'mobileDevicePos') {
            updateMobileLicenses();
        }
    }
}

// Aktualisierung der mobilen Gerätelizenzen
function updateMobileLicenses() {
    var mobileDeviceCount = parseInt(document.getElementById('mobileDevicePos').value) || 0;
    document.getElementById('mobileDeviceLicense').value = mobileDeviceCount;
    if (mobileDeviceCount > 0) {
        document.getElementById('mobileLicenseWarning').classList.remove('hidden');
    } else {
        document.getElementById('mobileLicenseWarning').classList.add('hidden');
    }
}

// Zusätzliche Funktionen für PAY Rechner
function toggleCalculationFields() {
    var calculationType = document.getElementById('calculationType').value;
    var maestroField = document.getElementById('maestroField');
    var businessCardField = document.getElementById('businessCardField');
    var competitorSection = document.getElementById('competitorSection');

    if (calculationType === 'ausführlich') {
        maestroField.classList.remove('hidden');
        businessCardField.classList.remove('hidden');
        competitorSection.classList.remove('hidden');
    } else {
        maestroField.classList.add('hidden');
        businessCardField.classList.add('hidden');
        competitorSection.classList.add('hidden');
    }
}

function toggleRentalOptions() {
    var purchaseOption = document.getElementById('purchaseOption').value;
    var rentalOptions = document.getElementById('rentalOptions');

    if (purchaseOption === 'mieten') {
        rentalOptions.style.display = 'block';
    } else {
        rentalOptions.style.display = 'none';
    }

    populateHardwareOptions();
}

function updateSimServiceFee() {
    var hardwareSelect = document.getElementById('hardware');
    var selectedOption = hardwareSelect.options[hardwareSelect.selectedIndex];
    var simFee = parseFloat(selectedOption.getAttribute('data-sim-fee')) || 0;

    // Aktualisiere die SIM/Service-Gebühr-Anzeige, falls nötig
}

// E-Mail senden
function sendEmail() {
    var customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        alert('Bitte geben Sie den Kundennamen ein.');
        return;
    }

    var activeTab = document.querySelector('.tab-link.active').getAttribute('data-calculator');
    var subject = '';
    var bodyContent = '';

    if (activeTab === 'pay') {
        subject = 'Ihr DISH PAY Angebot';
        bodyContent = document.querySelector('#pay .result-section').innerText;
    } else if (activeTab === 'pos') {
        subject = 'Ihr DISH POS Angebot';
        bodyContent = document.querySelector('#pos .result-section').innerText;
    } else if (activeTab === 'tools') {
        subject = 'Ihr DISH TOOLS Angebot';
        bodyContent = document.querySelector('#tools .result-section').innerText;
    }

    if (!bodyContent) {
        alert('Bitte führen Sie zuerst eine Berechnung durch.');
        return;
    }

    var offerContent = `
Sehr geehrte/r ${customerName},

vielen Dank für Ihr Interesse an unseren Produkten.
Im Folgenden finden Sie unser unverbindliches Angebot,
das individuell auf Ihre Anforderungen zugeschnitten ist:

${bodyContent}

Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben.
Wir freuen uns darauf, Ihnen einen echten Mehrwert bieten zu dürfen.

Mit freundlichen Grüßen,

Ihr DISH Team

Rechtlicher Hinweis:

Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. 
Die angegebenen Preise und Konditionen können sich ändern.
Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.
    `;

    // Angebot im Modal anzeigen
    var offerModal = document.getElementById('offerModal');
    var offerContentDiv = document.getElementById('offerContent');
    offerContentDiv.innerHTML = `<pre>${offerContent}</pre>`;
    offerModal.style.display = 'block';
}

// Funktion zum Kopieren des Angebots in die Zwischenablage
function copyOfferToClipboard() {
    var offerContentDiv = document.getElementById('offerContent');

    // Erstellen eines Textbereichs
    var textarea = document.createElement('textarea');
    textarea.value = offerContentDiv.innerText;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        var successful = document.execCommand('copy');
        if (successful) {
            alert('Angebot wurde in die Zwischenablage kopiert.');
        } else {
            alert('Kopieren nicht erfolgreich. Bitte versuchen Sie es manuell zu kopieren.');
        }
    } catch (err) {
        alert('Kopieren nicht unterstützt. Bitte kopieren Sie den Inhalt manuell.');
    }

    document.body.removeChild(textarea);
}

// Öffnet das E-Mail-Programm mit vorausgefülltem Betreff und Inhalt
function openEmailClient() {
    var subject = '';
    var activeTab = document.querySelector('.tab-link.active').getAttribute('data-calculator');

    if (activeTab === 'pay') {
        subject = 'Ihr DISH PAY Angebot';
    } else if (activeTab === 'pos') {
        subject = 'Ihr DISH POS Angebot';
    } else if (activeTab === 'tools') {
        subject = 'Ihr DISH TOOLS Angebot';
    }

    var offerContent = document.getElementById('offerContent').innerText;
    var mailtoLink = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(offerContent);
    window.location.href = mailtoLink;
}

// Modal schließen
function closeModal() {
    var offerModal = document.getElementById('offerModal');
    offerModal.style.display = 'none';
}

// Klick außerhalb des Modals schließt dieses
window.onclick = function(event) {
    var modal = document.getElementById('offerModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
