// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialisierung: Zeige den PAY-Rechner standardmäßig an
    showCalculator('pay');
});

/* Ebene 2: Rechnerumschaltung */
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
    document.getElementById(calculatorType).classList.add('active');
}

/* Berechnungsfunktionen */
function calculate() {
    // Bestimme, welcher Rechner aktiv ist
    const activeCalculator = document.querySelector('.tab-content.active').id;

    if (activeCalculator === 'pay') {
        calculatePay();
    } else if (activeCalculator === 'pos') {
        calculatePos();
    } else if (activeCalculator === 'tools') {
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
    const ownGirocardFee = (girocardPercent / 100) * monthlyVolume * 0.0039; // 0,39%
    const ownMastercardVisaFee = (mastercardVisaPercent / 100) * monthlyVolume * 0.0089; // 0,89%
    const ownMaestroFee = (maestroPercent / 100) * monthlyVolume * 0.0089; // 0,89%
    const ownBusinessCardFee = (businessCardPercent / 100) * monthlyVolume * 0.0289; // 2,89%
    const ownTotalFees = ownGirocardFee + ownMastercardVisaFee + ownMaestroFee + ownBusinessCardFee;

    // Wettbewerber Gebührenberechnung (nur im ausführlichen Modus)
    const calculationType = document.getElementById('calculationType').value;
    let competitorTotalFees = 0;
    if (calculationType === 'ausführlich') {
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100 || 0;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100 || 0;
        const competitorMastercardVisaFee = parseFloat(document.getElementById('competitorMastercardVisaFee').value) / 100 || 0;
        const competitorBusinessCardFee = parseFloat(document.getElementById('competitorBusinessCardFee').value) / 100 || 0;

        const competitorGirocardCost = (girocardPercent / 100) * monthlyVolume * competitorGirocardFee;
        const competitorMaestroCost = (maestroPercent / 100) * monthlyVolume * competitorMaestroFee;
        const competitorMastercardVisaCost = (mastercardVisaPercent / 100) * monthlyVolume * competitorMastercardVisaFee;
        const competitorBusinessCardCost = (businessCardPercent / 100) * monthlyVolume * competitorBusinessCardFee;

        competitorTotalFees = competitorGirocardCost + competitorMaestroCost + competitorMastercardVisaCost + competitorBusinessCardCost;
    }

    // Ersparnis berechnen
    let savings = 0;
    if (calculationType === 'ausführlich') {
        savings = competitorTotalFees - ownTotalFees;
    }

    // Transaktionsgebühren
    const transactionFee = transactions * 0.06; // 0,06 € pro Transaktion

    // Berechnung der Mehrwertsteuer (19%)
    const mwstRate = 0.19;
    const ownTotalFeesBrutto = ownTotalFees * (1 + mwstRate);
    const competitorTotalFeesBrutto = competitorTotalFees * (1 + mwstRate);
    const savingsBrutto = savings * (1 + mwstRate);

    // Ergebnis anzeigen
    let payResult = `
        <h3>Ergebnisse:</h3>
        <div class="result-section">
            <h4>PAY Rechner Details</h4>
            <ul>
                <li><strong>Eigene Gebühren:</strong> Netto: ${ownTotalFees.toFixed(2)} €, MwSt: ${(ownTotalFees * mwstRate).toFixed(2)} €, Brutto: ${ownTotalFeesBrutto.toFixed(2)} €</li>
                ${calculationType === 'ausführlich' ? `<li><strong>Wettbewerber Gebühren:</strong> Netto: ${competitorTotalFees.toFixed(2)} €, MwSt: ${(competitorTotalFees * mwstRate).toFixed(2)} €, Brutto: ${competitorTotalFeesBrutto.toFixed(2)} €</li>` : ''}
                ${calculationType === 'ausführlich' ? `<li><strong>Ersparnis mit DISH PAY:</strong> Netto: ${savings.toFixed(2)} €, MwSt: ${(savings * mwstRate).toFixed(2)} €, Brutto: ${savingsBrutto.toFixed(2)} €</li>` : ''}
                <li><strong>Transaktionsgebühren:</strong> ${transactionFee.toFixed(2)} €</li>
            </ul>
            ${calculationType === 'ausführlich' ? `<p><em>Hinweis: Die Wettbewerbergebühren wurden in die Berechnung einbezogen.</em></p>` : ''}
        </div>
    `;
    displayResult(payResult);
}

/* POS Rechner Funktion */
function calculatePos() {
    // Erfasse Hardware-Eingaben
    const sunmiScreenQty = parseInt(document.getElementById('sunmiScreen').value) || 0;
    const mobileDeviceQty = parseInt(document.getElementById('mobileDevice').value) || 0;

    // Erfasse Lizenz-Eingaben
    const mainLicenseChecked = document.getElementById('mainLicense').checked;
    const additionalHandheldLicenses = parseInt(document.getElementById('additionalHandheldLicenses').value) || 0;
    const additionalLicense1Checked = document.getElementById('additionalLicense1').checked;
    const additionalLicense2Checked = document.getElementById('additionalLicense2').checked;

    // Berechnung der Hardware-Kosten
    const sunmiScreenCost = sunmiScreenQty * 493.00;
    const mobileDeviceCost = mobileDeviceQty * 220.00;

    // Berechnung der Lizenz-Kosten
    let mainLicenseCost = 0;
    if (mainLicenseChecked) {
        mainLicenseCost = 69.00;
    }

    const additionalHandheldLicensesCost = additionalHandheldLicenses * 29.00;

    let additionalLicense1Cost = 0;
    if (additionalLicense1Checked) {
        additionalLicense1Cost = 50.00;
    }

    let additionalLicense2Cost = 0;
    if (additionalLicense2Checked) {
        additionalLicense2Cost = 75.00;
    }

    const totalHardwareCost = sunmiScreenCost + mobileDeviceCost;
    const totalLicenseCost = mainLicenseCost + additionalHandheldLicensesCost + additionalLicense1Cost + additionalLicense2Cost;

    // Berechnung der Mehrwertsteuer (19%)
    const mwstRate = 0.19;
    const totalOneTimeNetto = totalHardwareCost + totalLicenseCost;
    const totalOneTimeMwSt = totalOneTimeNetto * mwstRate;
    const totalOneTimeBrutto = totalOneTimeNetto + totalOneTimeMwSt;

    // Ergebnis anzeigen
    const posResult = `
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
                    ${sunmiScreenQty > 0 ? `
                    <tr>
                        <td>Bildschirm Sunmi</td>
                        <td>${sunmiScreenQty}</td>
                        <td>493,00</td>
                        <td>${sunmiScreenCost.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${mobileDeviceQty > 0 ? `
                    <tr>
                        <td>Mobiles Handgerät</td>
                        <td>${mobileDeviceQty}</td>
                        <td>220,00</td>
                        <td>${mobileDeviceCost.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${mainLicenseChecked ? `
                    <tr>
                        <td>Hauptlizenz Software</td>
                        <td>1</td>
                        <td>69,00</td>
                        <td>${mainLicenseCost.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${additionalHandheldLicenses > 0 ? `
                    <tr>
                        <td>Zusätzliche Lizenz für Handgeräte</td>
                        <td>${additionalHandheldLicenses}</td>
                        <td>29,00</td>
                        <td>${additionalHandheldLicensesCost.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${additionalLicense1Checked ? `
                    <tr>
                        <td>Zusätzliche Lizenz 1</td>
                        <td>1</td>
                        <td>50,00</td>
                        <td>${additionalLicense1Cost.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                    ${additionalLicense2Checked ? `
                    <tr>
                        <td>Zusätzliche Lizenz 2</td>
                        <td>1</td>
                        <td>75,00</td>
                        <td>${additionalLicense2Cost.toFixed(2)}</td>
                    </tr>
                    ` : ''}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"><strong>Gesamt einmalige Kosten</strong></td>
                        <td>${totalOneTimeBrutto.toFixed(2)} €</td>
                    </tr>
                </tfoot>
            </table>

            <h4>Zusammenfassung</h4>
            <ul>
                <li><strong>Einmalige Kosten:</strong> Netto: ${totalOneTimeNetto.toFixed(2)} €, MwSt.: ${totalOneTimeMwSt.toFixed(2)} €, Gesamtbetrag: ${totalOneTimeBrutto.toFixed(2)} €</li>
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
        totalOneTimeNetto += 69.00; // Aktivierungsgebühr
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
        if (orderValue === '12') {
            orderPrice = 49.90;
        } else if (orderValue === '3') {
            orderPrice = 59.90;
        }
        totalMonthlyNetto += orderPrice;
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
        if (premiumValue === '12') {
            premiumPrice = 69.90;
        } else if (premiumValue === '3') {
            premiumPrice = 79.90;
        }
        totalMonthlyNetto += premiumPrice;
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

    // Ergebnis anzeigen
    const toolsResult = `
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
                        <td>${totalOneTimeBrutto.toFixed(2)} €</td>
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
                        <td>${totalMonthlyBrutto.toFixed(2)} €</td>
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

/* Ergebnis anzeigen */
function displayResult(content) {
    // Entferne vorherige Ergebnisse im aktiven Rechner
    const activeCalculator = document.querySelector('.tab-content.active');
    const existingResult = activeCalculator.querySelector('.result-section');
    if (existingResult) {
        existingResult.remove();
    }

    // Füge das neue Ergebnis dem aktiven Rechner hinzu
    activeCalculator.insertAdjacentHTML('beforeend', content);
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

${payResultHTML}

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

${posResultHTML}

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

${toolsResultHTML}

---
Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unseren DISH-Lösungen einen echten Mehrwert bieten zu dürfen.

Mit freundlichen Grüßen,  
Ihr DISH Team

Rechtlicher Hinweis:  
Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. Die angegebenen Preise und Konditionen können sich ändern. Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.
        `;
    }

    // Erstellen eines HTML-E-Mail-Inhalts
    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${emailSubject}</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        h2 { color: #e67e22; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table, th, td { border: 1px solid #ddd; }
        th { background-color: #e67e22; color: #fff; padding: 8px; }
        td { padding: 8px; }
        ul { list-style-type: none; padding: 0; }
        ul li { margin-bottom: 5px; }
        .summary { font-weight: bold; }
    </style>
</head>
<body>
    <p>Sehr geehrte/r ${customerName},</p>
    <p>vielen Dank für Ihr Interesse an unserem DISH PAY. Im Folgenden finden Sie unser unverbindliches Angebot, das individuell auf Ihre Anforderungen zugeschnitten ist. Alle Komponenten und Kosten sind detailliert aufgeführt, um Ihnen eine transparente Übersicht der einmaligen und monatlichen Kosten zu bieten.</p>
    ${emailBody}
    <p>---
    <br>Kontaktieren Sie uns gerne, wenn Sie weitere Informationen benötigen oder Fragen haben. Wir freuen uns darauf, Ihnen mit unserem Kassensystem DISH PAY einen echten Mehrwert bieten zu dürfen.
    </p>
    <p>Mit freundlichen Grüßen,<br>Ihr DISH Team</p>
    <p><strong>Rechtlicher Hinweis:</strong><br>
    Dieses Angebot ist unverbindlich und dient ausschließlich zu Informationszwecken. Die angegebenen Preise und Konditionen können sich ändern. Für eine rechtsverbindliche Auskunft kontaktieren Sie uns bitte direkt.</p>
</body>
</html>
    `;

    // Öffnen des E-Mail-Clients mit vorgefertigtem Inhalt (HTML)
    const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(stripHTML(emailContent))}`;
    window.location.href = mailtoLink;

    // Hinweis: Viele E-Mail-Clients unterstützen kein HTML in mailto-Links. 
    // Eine Alternative wäre, den Benutzer zu bitten, den Inhalt manuell zu kopieren.
    alert('Bitte kopieren Sie den Inhalt aus dem angezeigten Fenster und fügen Sie ihn in Ihre E-Mail ein.');
    document.getElementById('emailContent').innerHTML = emailContent;
    openModal();
}

/* Funktion zum Entfernen von HTML-Tags für mailto-Link */
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

/* Plus/Minus Buttons für POS Rechner */
document.addEventListener('DOMContentLoaded', () => {
    // POS Rechner: Zusätzliche Lizenzen Handgeräte
    const plusBtn = document.getElementById('plusHandheldLicense');
    const minusBtn = document.getElementById('minusHandheldLicense');
    const licenseInput = document.getElementById('additionalHandheldLicenses');

    if (plusBtn && minusBtn && licenseInput) {
        plusBtn.addEventListener('click', () => {
            licenseInput.value = parseInt(licenseInput.value) + 1;
        });

        minusBtn.addEventListener('click', () => {
            if (parseInt(licenseInput.value) > 0) {
                licenseInput.value = parseInt(licenseInput.value) - 1;
            }
        });
    }
});
