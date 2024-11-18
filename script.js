document.addEventListener('DOMContentLoaded', () => {
    // Initialisierung: Zeige den PAY-Rechner standardmäßig an
    document.querySelector('#pay').classList.add('active');

    // Event-Listener für Tabs
    document.querySelectorAll('.tab-link').forEach(button => {
        button.addEventListener('click', (event) => {
            const calculatorType = button.getAttribute('data-calculator');
            openCalculator(event, calculatorType);
        });
    });

    // Event-Listener für Berechnungsart Dropdown im PAY-Rechner
    const calculationTypeSelect = document.getElementById('calculationType');
    if (calculationTypeSelect) {
        calculationTypeSelect.addEventListener('change', toggleCalculationFields);
    }

    // Event-Listener für Kauf/Miete Dropdown im PAY-Rechner
    const purchaseOptionSelect = document.getElementById('purchaseOption');
    if (purchaseOptionSelect) {
        purchaseOptionSelect.addEventListener('change', toggleRentalOptions);
    }

    // Event-Listener für Hardware Auswahl Dropdown im PAY-Rechner
    const hardwareSelect = document.getElementById('hardware');
    if (hardwareSelect) {
        hardwareSelect.addEventListener('change', updateRentalPrices);
    }
});

/* Rechnerumschaltung */
function openCalculator(event, calculatorType) {
    // Entferne die aktive Klasse von allen Tab-Links
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.classList.remove('active'));

    // Verstecke alle Tab-Inhalte
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Füge die aktive Klasse zum geklickten Tab-Button hinzu
    event.currentTarget.classList.add('active');

    // Zeige den ausgewählten Rechner an
    const activeTab = document.getElementById(calculatorType);
    activeTab.classList.add('active');

    // Scroll zum oberen Rand des Containers
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
}

/* Berechnen-Funktion */
function calculate() {
    const activeCalculator = document.querySelector('.tab-content.active');
    if (!activeCalculator) {
        alert('Kein aktiver Rechner ausgewählt.');
        return;
    }

    if (activeCalculator.id === 'pay') {
        calculatePay();
    } else if (activeCalculator.id === 'pos') {
        calculatePos();
    } else if (activeCalculator.id === 'tools') {
        calculateTools();
    }
}

/* PAY Rechner Funktion */
function calculatePay() {
    // Erfasse Eingaben
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseInt(document.getElementById('transactions').value) || 0;
    const girocardPercent = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaPercent = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const maestroPercent = parseFloat(document.getElementById('maestro').value) || 0;
    const businessCardPercent = parseFloat(document.getElementById('businessCard').value) || 0;

    // Validierung der Prozentsätze
    const totalPercent = girocardPercent + mastercardVisaPercent + maestroPercent + businessCardPercent;
    if (totalPercent !== 100) {
        alert('Die Summe der Girocard-, Mastercard/VISA-, Maestro/VPAY- und Business Card-Anteile muss genau 100% betragen.');
        return;
    }

    // Eigene Gebührenberechnung
    let girocardRevenue = monthlyVolume * (girocardPercent / 100);
    let mastercardVisaRevenue = monthlyVolume * (mastercardVisaPercent / 100);
    let maestroRevenue = monthlyVolume * (maestroPercent / 100);
    let businessCardRevenue = monthlyVolume * (businessCardPercent / 100);

    // DISH Gebühren (Sätze)
    const ownGirocardFeeRate = 0.0039; // 0,39%
    const ownMastercardVisaFeeRate = 0.0089; // 0,89%
    const ownMaestroFeeRate = 0.0089; // 0,89%
    const ownBusinessCardFeeRate = 0.0289; // 2,89%

    const ownGirocardFee = girocardRevenue * ownGirocardFeeRate;
    const ownMastercardVisaFee = mastercardVisaRevenue * ownMastercardVisaFeeRate;
    const ownMaestroFee = maestroRevenue * ownMaestroFeeRate;
    const ownBusinessCardFee = businessCardRevenue * ownBusinessCardFeeRate;

    const ownTotalFees = ownGirocardFee + ownMastercardVisaFee + ownMaestroFee + ownBusinessCardFee;

    // Wettbewerber Gebührenberechnung (ausführlich)
    const calculationType = document.getElementById('calculationType').value;
    let competitorTotalFees = 0;
    let competitorSavings = 0;

    if (calculationType === 'ausführlich') {
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100 || 0;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100 || 0;
        const competitorMastercardVisaFee = parseFloat(document.getElementById('competitorMastercardVisaFee').value) / 100 || 0;
        const competitorBusinessCardFee = parseFloat(document.getElementById('competitorBusinessCardFee').value) / 100 || 0;

        const competitorGirocardCost = girocardRevenue * competitorGirocardFee;
        const competitorMastercardVisaCost = mastercardVisaRevenue * competitorMastercardVisaFee;
        const competitorMaestroCost = maestroRevenue * competitorMaestroFee;
        const competitorBusinessCardCost = businessCardRevenue * competitorBusinessCardFee;

        competitorTotalFees = competitorGirocardCost + competitorMastercardVisaCost + competitorMaestroCost + competitorBusinessCardCost;
    }

    // Transaktionsgebühr
    const transactionFee = transactions * 0.06; // 0,06 € pro Transaktion

    // Gesamte eigene Gebühren
    const ownTotalFeesWithTransaction = ownTotalFees + transactionFee;

    // Wettbewerber Gesamte Gebühren inklusive Transaktionen
    if (calculationType === 'ausführlich') {
        competitorTotalFees += transactionFee;
        competitorSavings = competitorTotalFees - ownTotalFeesWithTransaction;
    }

    // Berechnung der Mehrwertsteuer (19%)
    const mwstRate = 0.19;
    const ownTotalFeesBrutto = ownTotalFeesWithTransaction * (1 + mwstRate);
    const competitorTotalFeesBrutto = calculationType === 'ausführlich' ? competitorTotalFees * (1 + mwstRate) : 0;
    const savingsBrutto = calculationType === 'ausführlich' ? competitorSavings * (1 + mwstRate) : 0;

    // Ergebnis anzeigen
    let payResult = `
        <h3>Ergebnisse:</h3>
        <div class="result-section">
            <h4>PAY Rechner Details</h4>
            <table>
                <thead>
                    <tr>
                        <th>Beschreibung</th>
                        <th>Netto (€)</th>
                        <th>MwSt. (€)</th>
                        <th>Brutto (€)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Girocard Gebühr</td>
                        <td>${ownGirocardFee.toFixed(2)}</td>
                        <td>${(ownGirocardFee * mwstRate).toFixed(2)}</td>
                        <td>${(ownGirocardFee * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Mastercard/VISA Gebühr</td>
                        <td>${ownMastercardVisaFee.toFixed(2)}</td>
                        <td>${(ownMastercardVisaFee * mwstRate).toFixed(2)}</td>
                        <td>${(ownMastercardVisaFee * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Maestro/VPAY Gebühr</td>
                        <td>${ownMaestroFee.toFixed(2)}</td>
                        <td>${(ownMaestroFee * mwstRate).toFixed(2)}</td>
                        <td>${(ownMaestroFee * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Business Card Gebühr</td>
                        <td>${ownBusinessCardFee.toFixed(2)}</td>
                        <td>${(ownBusinessCardFee * mwstRate).toFixed(2)}</td>
                        <td>${(ownBusinessCardFee * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Transaktionsgebühr</td>
                        <td>${transactionFee.toFixed(2)}</td>
                        <td>${(transactionFee * mwstRate).toFixed(2)}</td>
                        <td>${(transactionFee * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Gesamt PAY Gebühren</strong></td>
                        <td><strong>${ownTotalFeesWithTransaction.toFixed(2)}</strong></td>
                        <td><strong>${(ownTotalFeesWithTransaction * mwstRate).toFixed(2)}</strong></td>
                        <td><strong>${ownTotalFeesBrutto.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
    `;

    if (calculationType === 'ausführlich') {
        payResult += `
            <h4>Wettbewerber Gebühren:</h4>
            <table>
                <thead>
                    <tr>
                        <th>Beschreibung</th>
                        <th>Netto (€)</th>
                        <th>MwSt. (€)</th>
                        <th>Brutto (€)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Girocard Gebühr (Wettbewerber)</td>
                        <td>${(girocardRevenue * parseFloat(document.getElementById('competitorGirocardFee').value) / 100).toFixed(2)}</td>
                        <td>${((girocardRevenue * parseFloat(document.getElementById('competitorGirocardFee').value) / 100) * mwstRate).toFixed(2)}</td>
                        <td>${((girocardRevenue * parseFloat(document.getElementById('competitorGirocardFee').value) / 100) * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Mastercard/VISA Gebühr (Wettbewerber)</td>
                        <td>${(mastercardVisaRevenue * parseFloat(document.getElementById('competitorMastercardVisaFee').value) / 100).toFixed(2)}</td>
                        <td>${((mastercardVisaRevenue * parseFloat(document.getElementById('competitorMastercardVisaFee').value) / 100) * mwstRate).toFixed(2)}</td>
                        <td>${((mastercardVisaRevenue * parseFloat(document.getElementById('competitorMastercardVisaFee').value) / 100) * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Maestro/VPAY Gebühr (Wettbewerber)</td>
                        <td>${(maestroRevenue * parseFloat(document.getElementById('competitorMaestroFee').value) / 100).toFixed(2)}</td>
                        <td>${((maestroRevenue * parseFloat(document.getElementById('competitorMaestroFee').value) / 100) * mwstRate).toFixed(2)}</td>
                        <td>${((maestroRevenue * parseFloat(document.getElementById('competitorMaestroFee').value) / 100) * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Business Card Gebühr (Wettbewerber)</td>
                        <td>${(businessCardRevenue * parseFloat(document.getElementById('competitorBusinessCardFee').value) / 100).toFixed(2)}</td>
                        <td>${((businessCardRevenue * parseFloat(document.getElementById('competitorBusinessCardFee').value) / 100) * mwstRate).toFixed(2)}</td>
                        <td>${((businessCardRevenue * parseFloat(document.getElementById('competitorBusinessCardFee').value) / 100) * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Gesamt Wettbewerber Gebühren</strong></td>
                        <td><strong>${competitorTotalFees.toFixed(2)}</strong></td>
                        <td><strong>${(competitorTotalFees * mwstRate).toFixed(2)}</strong></td>
                        <td><strong>${(competitorTotalFees * (1 + mwstRate)).toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>

            <h4>Ersparnis mit DISH PAY:</h4>
            <table>
                <thead>
                    <tr>
                        <th>Beschreibung</th>
                        <th>Netto (€)</th>
                        <th>MwSt. (€)</th>
                        <th>Brutto (€)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ersparnis Netto</td>
                        <td>${competitorSavings.toFixed(2)}</td>
                        <td>${(competitorSavings * mwstRate).toFixed(2)}</td>
                        <td>${(competitorSavings * (1 + mwstRate)).toFixed(2)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Gesamt Ersparnis</strong></td>
                        <td><strong>${competitorSavings.toFixed(2)}</strong></td>
                        <td><strong>${(competitorSavings * mwstRate).toFixed(2)}</strong></td>
                        <td><strong>${(competitorSavings * (1 + mwstRate)).toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
            <p><em>Hinweis: Die Wettbewerbergebühren wurden in die Berechnung einbezogen.</em></p>
        </div>
    `;

    displayResult(payResult);
}

/* POS Rechner Funktion */
function calculatePos() {
    // Erfasse Hardware-Eingaben mit Mengen
    const posProducts = [
        { id: 'sunmiScreen', name: 'Bildschirm Sunmi', price: 493.00 },
        { id: 'tseUsage', name: 'TSE Hardwarenutzung für 5 Jahre', price: 159.00 },
        { id: 'menuInputService', name: 'Menü-Eingabeservice', price: 300.00 },
        { id: 'setupService', name: 'Einrichtungsservice vor Ort', price: 599.00 },
        { id: 'mobileDevicePos', name: 'Mobiles Handgerät', price: 220.00 },
        { id: 'epsonPrinter', name: 'Epson Drucker', price: 229.00 },
        { id: 'chargingStation', name: 'Ladestation für mobiles Handgerät', price: 79.00 },
        { id: 'accessPoint', name: 'Access Point', price: 189.00 },
        { id: 'posRouter', name: 'POS Router ER605', price: 55.00 },
        { id: 'switchLite', name: 'Switch Lite Ubiquiti UniFi', price: 107.00 }
    ];

    const optionalAccessories = [
        { id: 'cashDrawer', name: 'Kassenschublade', price: 69.00 },
        { id: 'qrOrdering', name: 'QR Ordering', price: 49.00 },
        { id: 'dishAggregator', name: 'DISH Aggregator (API für Lieferando, UberEats etc.)', price: 59.00 }
    ];

    const monthlyLicenses = [
        { id: 'mainLicensePos', name: 'Hauptlizenz Software', price: 69.00 },
        { id: 'datevApi', name: 'DATEV „MeinFiskal“ API', price: 25.00 },
        { id: 'voucherFunction', name: 'Gutschein Funktion', price: 10.00 },
        { id: 'tapToPay', name: 'Tap to Pay Lizenz', price: 7.50 }
    ];

    let totalHardwareCost = 0;
    let totalOptionalAccessoriesCost = 0;
    let totalMonthlyLicenseCost = 0;

    let hardwareDetails = '';
    let optionalAccessoriesDetails = '';
    let monthlyLicensesDetails = '';

    // Berechnung der Hardware-Kosten
    posProducts.forEach(product => {
        const qty = parseInt(document.getElementById(product.id).value) || 0;
        if (qty > 0) {
            const cost = qty * product.price;
            totalHardwareCost += cost;
            hardwareDetails += `
                <tr>
                    <td>${product.name}</td>
                    <td>${qty}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>${cost.toFixed(2)}</td>
                </tr>
            `;
        }
    });

    // Berechnung der optionalen Zubehörkosten
    optionalAccessories.forEach(accessory => {
        const qty = parseInt(document.getElementById(accessory.id).value) || 0;
        if (qty > 0) {
            const cost = qty * accessory.price;
            totalOptionalAccessoriesCost += cost;
            optionalAccessoriesDetails += `
                <tr>
                    <td>${accessory.name}</td>
                    <td>${qty}</td>
                    <td>${accessory.price.toFixed(2)}</td>
                    <td>${cost.toFixed(2)}</td>
                </tr>
            `;
        }
    });

    // Berechnung der monatlichen Lizenzkosten
    monthlyLicenses.forEach(license => {
        const isChecked = document.getElementById(license.id).checked;
        if (isChecked) {
            totalMonthlyLicenseCost += license.price;
            monthlyLicensesDetails += `
                <tr>
                    <td>${license.name}</td>
                    <td>1</td>
                    <td>${license.price.toFixed(2)}</td>
                    <td>${license.price.toFixed(2)}</td>
                </tr>
            `;
        }
    });

    // Berechnung der Mehrwertsteuer (19%)
    const mwstRate = 0.19;
    const totalOneTimeNetto = totalHardwareCost + totalOptionalAccessoriesCost;
    const totalOneTimeMwSt = totalOneTimeNetto * mwstRate;
    const totalOneTimeBrutto = totalOneTimeNetto + totalOneTimeMwSt;

    const totalMonthlyNetto = totalMonthlyLicenseCost;
    const totalMonthlyMwSt = totalMonthlyNetto * mwstRate;
    const totalMonthlyBrutto = totalMonthlyNetto + totalMonthlyMwSt;

    // Zusammenfassung der Gesamtkosten
    const totalOneTimeCost = totalOneTimeBrutto;
    const totalMonthlyCost = totalMonthlyBrutto;

    // Ergebnis anzeigen
    let posResult = `
        <h3>Ergebnisse:</h3>
        <div class="result-section">
            <h4>Einmalige Kosten</h4>
            <table>
                <thead>
                    <tr>
                        <th>Produkt / Service</th>
                        <th>Menge</th>
                        <th>Preis pro Stück (€)</th>
                        <th>Gesamtkosten (€)</th>
                    </tr>
                </thead>
                <tbody>
                    ${hardwareDetails}
                    ${optionalAccessoriesDetails}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"><strong>Gesamt einmalige Kosten</strong></td>
                        <td>${totalOneTimeCost.toFixed(2)} €</td>
                    </tr>
                </tfoot>
            </table>

            <h4>Monatliche Kosten</h4>
            <table>
                <thead>
                    <tr>
                        <th>Lizenz / Service</th>
                        <th>Menge</th>
                        <th>Preis pro Stück (€)</th>
                        <th>Gesamtkosten (€)</th>
                    </tr>
                </thead>
                <tbody>
                    ${monthlyLicensesDetails}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"><strong>Gesamt monatliche Kosten</strong></td>
                        <td>${totalMonthlyCost.toFixed(2)} €</td>
                    </tr>
                </tfoot>
            </table>

            <h4>Zusammenfassung</h4>
            <ul>
                <li><strong>Einmalige Kosten:</strong> Netto: ${totalOneTimeNetto.toFixed(2)} €, MwSt.: ${totalOneTimeMwSt.toFixed(2)} €, Gesamtbetrag: ${totalOneTimeBrutto.toFixed(2)} €</li>
                <li><strong>Monatliche Kosten:</strong> Netto: ${totalMonthlyNetto.toFixed(2)} €, MwSt.: ${totalMonthlyMwSt.toFixed(2)} €, Gesamtbetrag: ${totalMonthlyBrutto.toFixed(2)} €</li>
            </ul>
        </div>
    `;

    displayResult(posResult);
}

/* TOOLS Rechner Funktion */
function calculateTools() {
    // Erfasse Auswahl der DISH Lösungen
    const starterChecked = document.getElementById('starter').checked;
    const reservationValue = document.getElementById('reservation').value;
    const orderValue = document.getElementById('order').value;
    const premiumValue = document.getElementById('premium').value;

    let totalOneTimeNetto = 0;
    let totalMonthlyNetto = 0;

    let oneTimeDetails = '';
    let monthlyDetails = '';

    // DISH STARTER
    if (starterChecked) {
        totalOneTimeNetto += 69.00; // Einmalige Aktivierungsgebühr
        totalMonthlyNetto += 10.00; // Monatliche Gebühr
        oneTimeDetails += `
            <tr>
                <td>DISH STARTER Aktivierungsgebühr</td>
                <td>1</td>
                <td>69,00</td>
                <td>69,00</td>
            </tr>
        `;
        monthlyDetails += `
            <tr>
                <td>DISH STARTER</td>
                <td>1</td>
                <td>10,00</td>
                <td>10,00</td>
            </tr>
        `;
    }

    // DISH RESERVATION
    if (reservationValue !== 'none') {
        let reservationPrice = 0;
        if (reservationValue === '36') {
            reservationPrice = 34.90;
        } else if (reservationValue === '12') {
            reservationPrice = 44.00;
        } else if (reservationValue === '3') {
            reservationPrice = 49.00;
        }
        totalMonthlyNetto += reservationPrice;
        // Aktivierungsgebühr für DISH RESERVATION hinzufügen, falls vorhanden
        // Im Originalcode wurde keine Aktivierungsgebühr für RESERVATION erwähnt
        // oneTimeDetails += `
        //     <tr>
        //         <td>DISH RESERVATION Aktivierungsgebühr</td>
        //         <td>1</td>
        //         <td>69,00</td>
        //         <td>69,00</td>
        //     </tr>
        // `;
        monthlyDetails += `
            <tr>
                <td>DISH RESERVATION (${reservationValue} Monate)</td>
                <td>1</td>
                <td>${reservationPrice.toFixed(2)}</td>
                <td>${reservationPrice.toFixed(2)}</td>
            </tr>
        `;
    }

    // DISH ORDER
    if (orderValue !== 'none') {
        let orderPrice = 0;
        let activationFee = 299.00; // Einmalige Aktivierungsgebühr
        if (orderValue === '12') {
            orderPrice = 49.90;
        } else if (orderValue === '3') {
            orderPrice = 59.90;
        }
        totalMonthlyNetto += orderPrice;
        totalOneTimeNetto += activationFee;
        oneTimeDetails += `
            <tr>
                <td>DISH ORDER Aktivierungsgebühr</td>
                <td>1</td>
                <td>299,00</td>
                <td>299,00</td>
            </tr>
        `;
        monthlyDetails += `
            <tr>
                <td>DISH ORDER (${orderValue} Monate)</td>
                <td>1</td>
                <td>${orderPrice.toFixed(2)}</td>
                <td>${orderPrice.toFixed(2)}</td>
            </tr>
        `;
    }

    // DISH PREMIUM
    if (premiumValue !== 'none') {
        let premiumPrice = 0;
        let activationFee = 279.00; // Einmalige Aktivierungsgebühr
        if (premiumValue === '12') {
            premiumPrice = 69.90;
        } else if (premiumValue === '3') {
            premiumPrice = 79.90;
        }
        totalMonthlyNetto += premiumPrice;
        totalOneTimeNetto += activationFee;
        oneTimeDetails += `
            <tr>
                <td>DISH PREMIUM Aktivierungsgebühr</td>
                <td>1</td>
                <td>279,00</td>
                <td>279,00</td>
            </tr>
        `;
        monthlyDetails += `
            <tr>
                <td>DISH PREMIUM (${premiumValue} Monate)</td>
                <td>1</td>
                <td>${premiumPrice.toFixed(2)}</td>
                <td>${premiumPrice.toFixed(2)}</td>
            </tr>
        `;
    }

    // Berechnung der Mehrwertsteuer (19%)
    const mwstRate = 0.19;
    const totalOneTimeMwSt = totalOneTimeNetto * mwstRate;
    const totalOneTimeBrutto = totalOneTimeNetto + totalOneTimeMwSt;

    const totalMonthlyMwSt = totalMonthlyNetto * mwstRate;
    const totalMonthlyBrutto = totalMonthlyNetto + totalMonthlyMwSt;

    // Zusammenfassung der Gesamtkosten
    const totalOneTimeCost = totalOneTimeBrutto;
    const totalMonthlyCost = totalMonthlyBrutto;

    // Ergebnis anzeigen
    let toolsResult = `
        <h3>Ergebnisse:</h3>
        <div class="result-section">
            <h4>Einmalige Kosten</h4>
            <table>
                <thead>
                    <tr>
                        <th>Produkt / Service</th>
                        <th>Menge</th>
                        <th>Preis pro Stück (€)</th>
                        <th>Gesamtkosten (€)</th>
                    </tr>
                </thead>
                <tbody>
                    ${oneTimeDetails}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"><strong>Gesamt einmalige Kosten</strong></td>
                        <td>${totalOneTimeCost.toFixed(2)} €</td>
                    </tr>
                </tfoot>
            </table>

            <h4>Monatliche Kosten</h4>
            <table>
                <thead>
                    <tr>
                        <th>Lizenz / Service</th>
                        <th>Menge</th>
                        <th>Preis pro Stück (€)</th>
                        <th>Gesamtkosten (€)</th>
                    </tr>
                </thead>
                <tbody>
                    ${monthlyDetails}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"><strong>Gesamt monatliche Kosten</strong></td>
                        <td>${totalMonthlyCost.toFixed(2)} €</td>
                    </tr>
                </tfoot>
            </table>

            <h4>Zusammenfassung</h4>
            <ul>
                <li><strong>Einmalige Kosten:</strong> Netto: ${totalOneTimeNetto.toFixed(2)} €, MwSt.: ${totalOneTimeMwSt.toFixed(2)} €, Gesamtbetrag: ${totalOneTimeBrutto.toFixed(2)} €</li>
                <li><strong>Monatliche Kosten:</strong> Netto: ${totalMonthlyNetto.toFixed(2)} €, MwSt.: ${totalMonthlyMwSt.toFixed(2)} €, Gesamtbetrag: ${totalMonthlyBrutto.toFixed(2)} €</li>
            </ul>
        </div>
    `;

    displayResult(toolsResult);
}

/* E-Mail senden Funktion */
function sendEmail() {
    const activeCalculator = document.querySelector('.tab-content.active').id;
    const customerName = document.getElementById('customerName').value.trim();

    if (!customerName) {
        alert('Bitte geben Sie den Kundennamen ein.');
        return;
    }

    let emailSubject = '';
    let emailBody = '';

    if (activeCalculator === 'pay') {
        emailSubject = 'Ihr DISH PAY Angebot';
        const payResultHTML = document.querySelector('#pay .result-section').innerHTML;
        emailBody = `
Sehr geehrte/r ${customerName},

vielen Dank für Ihr Interesse an unserem DISH PAY. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.

${stripHTML(payResultHTML)}

---
Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unserem Kassensystem DISH PAY einen echten Mehrwert bieten zu dürfen.

Mit freundlichen Grüßen,  
Ihr DISH Team

Rechtlicher Hinweis:  
Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. Die angegebenen Preise und Konditionen können sich ändern. Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.
        `;
    } else if (activeCalculator === 'pos') {
        emailSubject = 'Ihr DISH POS Angebot';
        const posResultHTML = document.querySelector('#pos .result-section').innerHTML;
        emailBody = `
Sehr geehrte/r ${customerName},

vielen Dank für Ihr Interesse an unserem DISH POS. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.

${stripHTML(posResultHTML)}

---
Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unserem Kassensystem DISH POS einen echten Mehrwert bieten zu dürfen.

Mit freundlichen Grüßen,  
Ihr DISH Team

Rechtlicher Hinweis:  
Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. Die angegebenen Preise und Konditionen können sich ändern. Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.
        `;
    } else if (activeCalculator === 'tools') {
        emailSubject = 'Ihr DISH TOOLS Angebot';
        const toolsResultHTML = document.querySelector('#tools .result-section').innerHTML;
        emailBody = `
Sehr geehrte/r ${customerName},

vielen Dank für Ihr Interesse an unseren DISH-Lösungen. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.

${stripHTML(toolsResultHTML)}

---
Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unseren DISH-Lösungen einen echten Mehrwert bieten zu dürfen.

Mit freundlichen Grüßen,  
Ihr DISH Team

Rechtlicher Hinweis:  
Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. Die angegebenen Preise und Konditionen können sich ändern. Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.
        `;
    }

    // Öffne das Modal mit dem E-Mail-Inhalt
    document.getElementById('emailContent').innerHTML = `
        <h2>${emailSubject}</h2>
        <pre>${emailBody}</pre>
    `;
    openModal();

    // Automatisches Öffnen des E-Mail-Clients mit formatierter E-Mail
    const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
}

/* Funktion zum Entfernen von HTML-Tags */
function stripHTML(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

/* Modal Funktionen */
function openModal() {
    document.getElementById('emailModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('emailModal').style.display = 'none';
}

// Schließe das Modal, wenn der Benutzer außerhalb des Inhalts klickt
window.onclick = function(event) {
    const modal = document.getElementById('emailModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

/* Plus/Minus Funktionen für POS Rechner */
function increment(id) {
    const input = document.getElementById(id);
    let currentValue = parseInt(input.value) || 0;
    input.value = currentValue + 1;
}

function decrement(id) {
    const input = document.getElementById(id);
    let currentValue = parseInt(input.value) || 0;
    if (currentValue > 0) {
        input.value = currentValue - 1;
    }
}

/* Berechnungsart Umschaltung für PAY Rechner */
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const maestroField = document.getElementById('maestroField');
    const businessCardField = document.getElementById('businessCardField');
    const competitorSection = document.getElementById('competitorSection');

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

/* Mietoptionen Umschalten für PAY Rechner */
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalOptions = document.getElementById('rentalOptions');

    if (purchaseOption === "mieten") {
        rentalOptions.style.display = 'block';
    } else {
        rentalOptions.style.display = 'none';
    }
}

/* Aktualisierung der Mietpreise basierend auf der Auswahl */
function updateRentalPrices() {
    // Hier können Sie zusätzliche Logik hinzufügen, falls benötigt
    // Momentan ist diese Funktion leer, da die Mietpreise bereits im HTML definiert sind
}

/* Ergebnis anzeigen */
function displayResult(content) {
    // Entferne bestehende Ergebnisse
    const existingResult = document.querySelector('.result-section');
    if (existingResult) {
        existingResult.parentElement.removeChild(existingResult);
    }

    // Füge das neue Ergebnis dem aktiven Rechner hinzu
    const activeCalculator = document.querySelector('.tab-content.active');
    activeCalculator.insertAdjacentHTML('beforeend', content);
}
