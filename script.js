function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const rentalPeriod = document.getElementById('rentalPeriod').value;
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    let monthlyCost = 0;
    
    if (rentalPeriod === "12") {
        monthlyCost = selectedHardware.getAttribute('data-12m-cost');
    } else if (rentalPeriod === "36") {
        monthlyCost = selectedHardware.getAttribute('data-36m-cost');
    } else if (rentalPeriod === "60") {
        monthlyCost = selectedHardware.getAttribute('data-60m-cost');
    }

    // Hier könnten Sie auch die monatlichen Kosten in einer Anzeige darstellen
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    const transactions = parseInt(document.getElementById('transactions').value);
    const girocard = parseFloat(document.getElementById('girocard').value);
   Hier ist die vollständige JavaScript-Datei (`script.js`) mit den erforderlichen Funktionen zur Berechnung der Kosten und zur Validierung der Eingabefelder:

### JavaScript-Datei: `script.js`

```javascript
function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const rentalPeriod = document.getElementById('rentalPeriod').value;
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    let monthlyCost = 0;

    if (rentalPeriod === "12") {
        monthlyCost = parseFloat(selectedHardware.getAttribute('data-12m-cost'));
    } else if (rentalPeriod === "36") {
        monthlyCost = parseFloat(selectedHardware.getAttribute('data-36m-cost'));
    } else if (rentalPeriod === "60") {
        monthlyCost = parseFloat(selectedHardware.getAttribute('data-60m-cost'));
    }

    return monthlyCost;
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    const transactions = parseInt(document.getElementById('transactions').value);
    const girocard = parseFloat(document.getElementById('girocard').value) / 100;
    const maestro = parseFloat(document.getElementById('maestro').value) / 100;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    const businessCard = parseFloat(document.getElementById('businessCard').value) / 100;

    const competitorInclude = document.getElementById('competitorInclude').value;

    // Berechnungen für Hardwarekosten
    const monthlyHardwareCost = updateHardwareCosts();

    // Validierung der Eingaben
    if (!monthlyVolume || !transactions || !girocard || !maestro || !mastercardVisa || !businessCard) {
        alert("Daten unvollständig. Bitte alle Felder ausfüllen.");
        return;
    }

    // Berechnung der Gesamtkosten
    const totalGirocardCosts = (monthlyVolume * girocard) + (monthlyHardwareCost * 12);
    const totalMaestroCosts = (monthlyVolume * maestro) + (monthlyHardwareCost * 12);
    const totalMastercardVisaCosts = (monthlyVolume * mastercardVisa) + (monthlyHardwareCost * 12);
    const totalBusinessCardCosts = (monthlyVolume * businessCard) + (monthlyHardwareCost * 12);

    let resultText = `<h4>Gesamtkosten pro Monat:</h4>
                      <p>Girocard: ${totalGirocardCosts.toFixed(2)} €</p>
                      <p>Maestro: ${totalMaestroCosts.toFixed(2)} €</p>
                      <p>Mastercard / VISA: ${totalMastercardVisaCosts.toFixed(2)} €</p>
                      <p>Business Card: ${totalBusinessCardCosts.toFixed(2)} €</p>`;

    // Wettbewerber Berechnungen
    if (competitorInclude === "ja") {
        const competitorFee = parseFloat(document.getElementById('competitorFee').value);
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100;
        const competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) / 100;
        const competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) / 100;

        const totalCompetitorCosts = (competitorFee * transactions);

        resultText += `<h4>Wettbewerber Gesamtkosten:</h4>
                       <p>Gesamte Gebühren: ${totalCompetitorCosts.toFixed(2)} €</p>`;
    }

    document.getElementById('results').innerHTML = resultText;
}

function toggleCompetitorFields() {
    const competitorSection = document.getElementById('competitorSection');
    const competitorInclude = document.getElementById('competitorInclude').value;

    if (competitorInclude === "ja") {
        competitorSection.style.display = 'block';
    } else {
        competitorSection.style.display = 'none';
    }
}

function downloadOffer() {
    // Download-Funktion hier implementieren
    alert("Angebot herunterladen ist derzeit nicht implementiert.");
}
