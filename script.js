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
});

// Berechnungsfunktion
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
    var girocardFee = girocardVolume * 0.0039;
    var mastercardVisaFee = mastercardVisaVolume * 0.0089;
    var maestroFee = maestroVolume * 0.0089;
    var businessCardFee = businessCardVolume * 0.0289;
    var transactionFee = transactions * 0.06;

    var totalFees = girocardFee + mastercardVisaFee + maestroFee + businessCardFee + transactionFee;

    // Hardwarekosten
    var purchaseOption = document.getElementById('purchaseOption').value;
    var hardwareSelect = document.getElementById('hardware');
    var selectedHardwareText = hardwareSelect.options[hardwareSelect.selectedIndex].text;
    var hardwareName = selectedHardwareText.split(' - ')[0];
    var hardwareCost = 0;
    var hardwareMonthly = 0;
    var oneTimeCosts = 0;

    if (purchaseOption === 'kaufen') {
        hardwareCost = parseFloat(hardwareSelect.options[hardwareSelect.selectedIndex].getAttribute('data-price-once')) || 0;
        oneTimeCosts += hardwareCost;
    } else {
        var rentalPeriodSelect = document.getElementById('rentalPeriod');
        var rentalPeriod = rentalPeriodSelect.value;
        var hardwareMonthlyPrice = parseFloat(rentalPeriodSelect.options[rentalPeriodSelect.selectedIndex].text.split(' - ')[1].replace(' €/Monat', '').replace(',', '.')) || 0;
        hardwareMonthly = hardwareMonthlyPrice;
    }

    // SIM/Service-Gebühr
    var simServiceFee = 5.00;

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
    if (document.getElementById('competitorGirocardFee').value || document.getElementById('competitorMastercardVisaFee').value) {
        var competitorGirocardFeePercent = parseFloat(document.getElementById('competitorGirocardFee').value) || 0;
        var competitorMastercardVisaFeePercent = parseFloat(document.getElementById('competitorMastercardVisaFee').value) || 0;
        var competitorMaestroFeePercent = parseFloat(document.getElementById('competitorMaestroFee').value) || 0;
        var competitorBusinessCardFeePercent = parseFloat(document.getElementById('competitorBusinessCardFee').value) || 0;

        var competitorGirocardFee = girocardVolume * (competitorGirocardFeePercent / 100);
        var competitorMastercardVisaFee = mastercardVisaVolume * (competitorMastercardVisaFeePercent / 100);
        var competitorMaestroFee = maestroVolume * (competitorMaestroFeePercent / 100);
        var competitorBusinessCardFee = businessCardVolume * (competitorBusinessCardFeePercent / 100);
        var competitorTransactionFee = transactionFee; // Angenommen, gleiche Transaktionsgebühren

        competitorTotalFees = competitorGirocardFee + competitorMastercardVisaFee + competitorMaestroFee + competitorBusinessCardFee + competitorTransactionFee;

        competitorContent = `
            <h3>Wettbewerber Gebühren</h3>
            <table>
                <thead>
                    <tr>
                        <th>Kartentyp</th>
                        <th>Gebühr (€)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Girocard</td>
                        <td>${competitorGirocardFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Mastercard/VISA</td>
                        <td>${competitorMastercardVisaFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Maestro/VPAY</td>
                        <td>${competitorMaestroFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Business Card</td>
                        <td>${competitorBusinessCardFee.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Transaktionsgebühren</td>
                        <td>${competitorTransactionFee.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Gesamtgebühren beim Wettbewerber: ${competitorTotalFees.toFixed(2)} €</strong></p>
        `;
    }

    // Ersparnis berechnen
    var savingsContent = '';
    if (document.getElementById('calculationType').value === 'ausführlich' && competitorTotalFees > 0) {
        var savings = competitorTotalFees - totalMonthlyFees;
        savingsContent = `<p class="highlight">Ersparnis mit DISH PAY: ${savings.toFixed(2)} €</p>`;
    }

    // Ergebnisse anzeigen
    var resultContent = `
        <h3>DISH PAY Gebühren</h3>
        <table>
            <thead>
                <tr>
                    <th>Beschreibung</th>
                    <th>Betrag (€)</th>
                </tr>
            </thead>
            <tbody>
                ${purchaseOption === 'kaufen' ? `
                <tr>
                    <td>Hardware (${hardwareName})</td>
                    <td>${hardwareCost.toFixed(2)}</td>
                </tr>
                ` : `
                <tr>
                    <td>Hardware Miete (${hardwareName})</td>
                    <td>${hardwareMonthly.toFixed(2)} / Monat</td>
                </tr>
                `}
                <tr>
                    <td>SIM/Service-Gebühr</td>
                    <td>${simServiceFee.toFixed(2)} / Monat</td>
                </tr>
                <tr>
                    <td>Kartenumsatzgebühren</td>
                    <td>${(totalFees).toFixed(2)} / Monat</td>
                </tr>
                ${purchaseOption === 'kaufen' ? `
                <tr>
                    <td><strong>Einmalige Kosten gesamt</strong></td>
                    <td><strong>${oneTimeCosts.toFixed(2)}</strong></td>
                </tr>
                ` : ''}
                <tr>
                    <td><strong>Gesamte monatliche Gebühren</strong></td>
                    <td><strong>${totalMonthlyFees.toFixed(2)}</strong></td>
                </tr>
            </tbody>
        </table>
        ${competitorContent}
        ${savingsContent}
    `;

    displayResult(resultContent);
}

// POS Berechnung
function calculatePos() {
    // Erfasse Hardware-Eingaben mit Mengen
    var products = [
        { id: 'sunmiScreen', name: 'Bildschirm Sunmi', price: 493.00 },
        { id: 'tseUsage', name: 'TSE Hardwarenutzung für 5 Jahre', price: 159.00 },
        { id: 'menuInputService', name: 'Menü-Eingabeservice', price: 300.00 },
        { id: 'setupService', name: 'Einrichtungsservice vor Ort', price: 599.00 },
        { id: 'mobileDevicePos', name: 'Mobiles Handgerät', price: 220.00 },
        { id: 'epsonPrinter', name: 'Epson Drucker', price: 229.00 },
        { id: 'chargingStation', name: 'Ladestation für mobiles Handgerät', price: 79.00 },
        { id: 'accessPoint', name: 'Access Point', price: 189.00 },
        { id: 'posRouter', name: 'POS Router ER605', price: 55.00 },
        { id: 'switchLite', name: 'Switch Lite Ubiquiti UniFi', price: 107.00 },
        { id: 'cashDrawer', name: 'Kassenschublade', price: 69.00 },
    ];

    var total = 0;
    var details = '';

    products.forEach(function(product) {
        var quantity = parseInt(document.getElementById(product.id).value) || 0;
        if (quantity > 0) {
            var cost = quantity * product.price;
            total += cost;
            details += '<tr><td>' + product.name + '</td><td>' + quantity + '</td><td>' + product.price.toFixed(2) + ' €</td><td>' + cost.toFixed(2) + ' €</td></tr>';
        }
    });

    // Monatliche Lizenzen
    var licenses = [
        { id: 'mainLicensePos', name: 'Hauptlizenz Software', price: 69.00 },
        { id: 'datevApi', name: 'DATEV „MeinFiskal“ API', price: 25.00 },
        { id: 'voucherFunction', name: 'Gutschein Funktion', price: 10.00 },
        { id: 'tapToPay', name: 'Tap to Pay Lizenz', price: 7.50 },
        { id: 'qrOrderingLicense', name: 'QR Ordering', price: 49.00 },
        { id: 'dishAggregatorLicense', name: 'DISH Aggregator', price: 59.00 },
    ];

    var monthlyTotal = 0;
    var monthlyDetails = '';

    licenses.forEach(function(license) {
        var checked = document.getElementById(license.id).checked;
        if (checked) {
            monthlyTotal += license.price;
            monthlyDetails += '<tr><td>' + license.name + '</td><td>1</td><td>' + license.price.toFixed(2) + ' €</td><td>' + license.price.toFixed(2) + ' €</td></tr>';
        }
    });

    // Zusatzlizenz für mobile Geräte
    var mobileDeviceCount = parseInt(document.getElementById('mobileDevicePos').value) || 0;
    var mobileLicenseCount = parseInt(document.getElementById('mobileDeviceLicense').value) || 0;

    if (mobileLicenseCount !== mobileDeviceCount) {
        mobileLicenseCount = mobileDeviceCount;
        document.getElementById('mobileDeviceLicense').value = mobileLicenseCount;
        document.getElementById('mobileLicenseWarning').classList.remove('hidden');
    } else {
        document.getElementById('mobileLicenseWarning').classList.add('hidden');
    }

    if (mobileLicenseCount > 0) {
        var mobileLicenseCost = mobileLicenseCount * 29.00;
        monthlyTotal += mobileLicenseCost;
        monthlyDetails += '<tr><td>Zusatzlizenz für mobile Geräte</td><td>' + mobileLicenseCount + '</td><td>29.00 €</td><td>' + mobileLicenseCost.toFixed(2) + ' €</td></tr>';
    }

    // Rabatt anwenden
    var discountType = document.getElementById('discountTypePos').value;
    var discountAmount = 0;
    var freeMonths = 0;

    if (discountType === 'oneTimeAmount') {
        discountAmount = parseFloat(document.getElementById('oneTimeAmountPos').value) || 0;
        total -= discountAmount;
    } else if (discountType === 'freeMonths') {
        freeMonths = parseInt(document.getElementById('freeMonthsPos').value) || 0;
        monthlyTotal -= (monthlyTotal * freeMonths);
    }

    // MwSt. berechnen
    var mwstRate = 0.19;
    var mwstAmount = total * mwstRate;
    var totalBrutto = total + mwstAmount;

    // Ergebnisse anzeigen
    var resultContent = `
        <h3>Einmalige Kosten:</h3>
        <table>
            <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Menge</th>
                    <th>Preis/Stück</th>
                    <th>Gesamtpreis</th>
                </tr>
            </thead>
            <tbody>
                ${details}
            </tbody>
        </table>
        <p><strong>Zwischensumme netto: ${total.toFixed(2)} €</strong></p>
        <p><strong>MwSt. (19%): ${mwstAmount.toFixed(2)} €</strong></p>
        <p><strong>Gesamtsumme brutto: ${totalBrutto.toFixed(2)} €</strong></p>
        <h3>Monatliche Kosten:</h3>
        <table>
            <thead>
                <tr>
                    <th>Lizenz</th>
                    <th>Menge</th>
                    <th>Preis/Monat</th>
                    <th>Gesamtpreis</th>
                </tr>
            </thead>
            <tbody>
                ${monthlyDetails}
            </tbody>
        </table>
        <p><strong>Monatliche Gesamtsumme netto: ${monthlyTotal.toFixed(2)} €</strong></p>
        <p><strong>MwSt. (19%): ${(monthlyTotal * mwstRate).toFixed(2)} €</strong></p>
        <p><strong>Monatliche Gesamtsumme brutto: ${(monthlyTotal * (1 + mwstRate)).toFixed(2)} €</strong></p>
    `;

    displayResult(resultContent);
}

// TOOLS Berechnung
function calculateTools() {
    // Erfasse die Auswahl des Benutzers
    var starterChecked = document.getElementById('starter').checked;
    var reservationValue = document.getElementById('reservation').value;
    var orderValue = document.getElementById('order').value;
    var premiumValue = document.getElementById('premium').value;
    var installationChecked = document.getElementById('installationFee').checked;

    var totalOnce = 0;
    var totalMonthly = 0;
    var detailsOnce = '';
    var detailsMonthly = '';

    // Starter
    if (starterChecked) {
        totalOnce += 69.00; // Aktivierungsgebühr
        totalMonthly += 10.00;
        detailsOnce += '<tr><td>DISH STARTER Aktivierungsgebühr</td><td>1</td><td>69.00 €</td><td>69.00 €</td></tr>';
        detailsMonthly += '<tr><td>DISH STARTER</td><td>1</td><td>10.00 €</td><td>10.00 €</td></tr>';
    }

    // Installation
    if (installationChecked) {
        totalOnce += 99.00;
        detailsOnce += '<tr><td>Installation</td><td>1</td><td>99.00 €</td><td>99.00 €</td></tr>';
    }

    // Reservation
    if (reservationValue !== 'none') {
        var reservationPrice = 0;
        if (reservationValue === '36') {
            reservationPrice = 34.90;
        } else if (reservationValue === '12') {
            reservationPrice = 44.00;
        } else if (reservationValue === '3') {
            reservationPrice = 49.00;
        }
        totalMonthly += reservationPrice;
        detailsMonthly += '<tr><td>DISH RESERVATION (' + reservationValue + ' Monate)</td><td>1</td><td>' + reservationPrice.toFixed(2) + ' €</td><td>' + reservationPrice.toFixed(2) + ' €</td></tr>';
    }

    // Order
    if (orderValue !== 'none') {
        var orderPrice = 0;
        if (orderValue === '12') {
            orderPrice = 49.90;
        } else if (orderValue === '3') {
            orderPrice = 59.90;
        }
        totalMonthly += orderPrice;
        detailsMonthly += '<tr><td>DISH ORDER (' + orderValue + ' Monate)</td><td>1</td><td>' + orderPrice.toFixed(2) + ' €</td><td>' + orderPrice.toFixed(2) + ' €</td></tr>';
    }

    // Premium
    if (premiumValue !== 'none') {
        var premiumPrice = 0;
        if (premiumValue === '12') {
            premiumPrice = 69.90;
        } else if (premiumValue === '3') {
            premiumPrice = 79.90;
        }
        totalMonthly += premiumPrice;
        detailsMonthly += '<tr><td>DISH PREMIUM (' + premiumValue + ' Monate)</td><td>1</td><td>' + premiumPrice.toFixed(2) + ' €</td><td>' + premiumPrice.toFixed(2) + ' €</td></tr>';
    }

    // Rabatt anwenden
    var discountType = document.getElementById('discountTypeTools').value;
    var discountAmount = 0;
    var freeMonths = 0;

    if (discountType === 'oneTimeAmount') {
        discountAmount = parseFloat(document.getElementById('oneTimeAmountTools').value) || 0;
        totalOnce -= discountAmount;
    } else if (discountType === 'freeMonths') {
        freeMonths = parseInt(document.getElementById('freeMonthsTools').value) || 0;
        totalMonthly -= (totalMonthly * freeMonths);
    }

    // MwSt. berechnen
    var mwstRate = 0.19;

    // Ergebnisse anzeigen
    var resultContent = '';

    if (detailsOnce !== '') {
        var mwstOnce = totalOnce * mwstRate;
        var totalBruttoOnce = totalOnce + mwstOnce;
        resultContent += `
            <h3>Einmalige Kosten:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Menge</th>
                        <th>Preis/Stück</th>
                        <th>Gesamtpreis</th>
                    </tr>
                </thead>
                <tbody>
                    ${detailsOnce}
                </tbody>
            </table>
            <p><strong>MwSt. (19%): ${mwstOnce.toFixed(2)} €</strong></p>
            <p><strong>Gesamtsumme brutto: ${totalBruttoOnce.toFixed(2)} €</strong></p>
        `;
    }

    if (detailsMonthly !== '') {
        var mwstMonthly = totalMonthly * mwstRate;
        var totalBruttoMonthly = totalMonthly + mwstMonthly;
        resultContent += `
            <h3>Monatliche Kosten:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Produkt</th>
                        <th>Menge</th>
                        <th>Preis/Monat</th>
                        <th>Gesamtpreis</th>
                    </tr>
                </thead>
                <tbody>
                    ${detailsMonthly}
                </tbody>
            </table>
            <p><strong>MwSt. (19%): ${mwstMonthly.toFixed(2)} €</strong></p>
            <p><strong>Monatliche Gesamtsumme brutto: ${totalBruttoMonthly.toFixed(2)} €</strong></p>
        `;
    }

    if (resultContent === '') {
        resultContent = '<p>Bitte wählen Sie mindestens ein Produkt aus.</p>';
    }

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
    resultDiv.innerHTML = content;
    activeCalculator.appendChild(resultDiv);
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
        updateRentalPrices();
    } else {
        rentalOptions.style.display = 'none';
    }
}

function updateRentalPrices() {
    var hardwareSelect = document.getElementById('hardware');
    var rentalPeriodSelect = document.getElementById('rentalPeriod');

    var selectedOption = hardwareSelect.options[hardwareSelect.selectedIndex];
    var price12 = selectedOption.getAttribute('data-price-12');
    var price36 = selectedOption.getAttribute('data-price-36');
    var price60 = selectedOption.getAttribute('data-price-60');

    rentalPeriodSelect.innerHTML = '';

    if (price12 && price12 !== '0') {
        var option12 = document.createElement('option');
        option12.value = '12';
        option12.text = '12 Monate - ' + price12 + ' €/Monat';
        rentalPeriodSelect.add(option12);
    }
    if (price36 && price36 !== '0') {
        var option36 = document.createElement('option');
        option36.value = '36';
        option36.text = '36 Monate - ' + price36 + ' €/Monat';
        rentalPeriodSelect.add(option36);
    }
    if (price60 && price60 !== '0') {
        var option60 = document.createElement('option');
        option60.value = '60';
        option60.text = '60 Monate - ' + price60 + ' €/Monat';
        rentalPeriodSelect.add(option60);
    }
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
        bodyContent = document.querySelector('#pay .result-section').innerHTML;
    } else if (activeTab === 'pos') {
        subject = 'Ihr DISH POS Angebot';
        bodyContent = document.querySelector('#pos .result-section').innerHTML;
    } else if (activeTab === 'tools') {
        subject = 'Ihr DISH TOOLS Angebot';
        bodyContent = document.querySelector('#tools .result-section').innerHTML;
    }

    if (!bodyContent) {
        alert('Bitte führen Sie zuerst eine Berechnung durch.');
        return;
    }

    var offerContent = `
        <h2>${subject}</h2>
        <p>Sehr geehrte/r ${customerName},</p>
        <p>vielen Dank für Ihr Interesse an unseren Produkten. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist:</p>
        ${bodyContent}
        <p>---</p>
        <p>Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen einen echten Mehrwert bieten zu dürfen.</p>
        <p>Mit freundlichen Grüßen,<br>Ihr DISH Team</p>
        <p><strong>Rechtlicher Hinweis:</strong><br>Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. Die angegebenen Preise und Konditionen können sich ändern. Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.</p>
    `;

    // Angebot im Modal anzeigen
    var offerModal = document.getElementById('offerModal');
    var offerContentDiv = document.getElementById('offerContent');
    offerContentDiv.innerHTML = offerContent;
    offerModal.style.display = 'block';
}

// Funktion zum Kopieren des Angebots in die Zwischenablage
function copyOfferToClipboard() {
    var offerContentDiv = document.getElementById('offerContent');

    // Erstellen eines versteckten Textbereichs
    var textarea = document.createElement('textarea');
    textarea.innerHTML = offerContentDiv.innerHTML;
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

// Öffnet das E-Mail-Programm mit vorausgefülltem Betreff
function openEmailClient() {
    var subject = document.querySelector('#offerModal h2').innerText;

    var mailtoLink = 'mailto:?subject=' + encodeURIComponent(subject);
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
