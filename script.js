function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const rentalPeriod = document.getElementById('rentalPeriod').value;
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];

    let monthlyCost = 0;
    const onceCost = parseFloat(selectedHardware.getAttribute('data-once-cost'));

    if (rentalPeriod === "mieten") {
        const selectedPeriodCost = rentalPeriod === "mieten" ? 
            selectedHardware.getAttribute(`data-${document.getElementById('rentalPeriod').value}-cost`) : 0;
        monthlyCost = parseFloat(selectedPeriodCost);
    }

    return { onceCost, monthlyCost };
}

function toggleCompetitorFields() {
    const competitorSection = document.getElementById('competitorSection');
    competitorSection.style.display = document.getElementById('competitorInclude').value === "ja" ? 'block' : 'none';
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    const transactions = parseInt(document.getElementById('transactions').value);
    const girocard = parseFloat(document.getElementById('girocard').value) / 100;
    const maestro = parseFloat(document.getElementById('maestro').value) / 100;
    const mastercardVisa = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    const businessCard = parseFloat(document.getElementById('businessCard').value) / 100;

    const competitorInclude = document.getElementById('competitorInclude').value;

    // Hardwarekosten ermitteln
    const { onceCost, monthlyCost } = updateHardwareCosts();

    // Validierung der Eingaben
    if (isNaN(monthlyVolume) || isNaN(transactions) || 
        isNaN(girocard) || isNaN(maestro) || 
        isNaN(mastercardVisa) || isNaN(businessCard)) {
       Hier ist die vollständige und optimierte Version des DISH PAY Rechners, die alle gewünschten Features umfasst, einschließlich der Kauf- oder Mietoptionen und der korrekten Hardwarepreise. Das Design ist modern und in knalligem Orange gehalten.

### HTML-Datei: `index.html`

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DISH PAY Rechner</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>

<div class="container">
    <h1>DISH PAY Rechner</h1>
    <h3>Monatliche Kostenberechnung</h3>

    <label for="monthlyVolume">Geplantes Kartenumsatz pro Monat (€):</label>
    <input type="number" id="monthlyVolume" placeholder="z.B. 20000" required>

    <label for="transactions">Erwartete Anzahl an monatlichen Transaktionen:</label>
    <input type="number" id="transactions" placeholder="z.B. 400" required>

    <label for="girocard">Girocard (%):</label>
    <input type="number" id="girocard" placeholder="z.B. 70" step="0.01" required>

    <label for="maestro">Maestro / VPAY (%):</label>
    <input type="number" id="maestro" placeholder="z.B. 5" step="0.01" required>

    <label for="mastercardVisa">Mastercard / VISA (%):</label>
    <input type="number" id="mastercardVisa" placeholder="z.B. 10" step="0.01" required>

    <label for="businessCard">Business Card (%):</label>
    <input type="number" id="businessCard" placeholder="z.B. 5" step="0.01" required>

    <label for="hardwareOption">Hardware Option:</label>
    <select id="hardwareOption" onchange="updateHardwareCosts()">
        <option value="S1F2" data-once-cost="499" data-12m-cost="44.90" data-36m-cost="18.90" data-60m-cost="14.90">S1F2</option>
        <option value="V400C" data-once-cost="399" data-12m-cost="39.90" data-36m-cost="16.90" data-60m-cost="12.90">V400C</option>
        <option value="MotoG14" data-once-cost="119" data-12m-cost="7.90" data-36m-cost="0" data-60m-cost="0">Moto G14</option>
        <option value="Tap2Pay" data-once-cost="0" data-12m-cost="7.90" data-36m-cost="0" data-60m-cost="0">Tap2Pay</option>
    </select>

    <label for="rentalPeriod">Mieten oder Kaufen:</label>
    <select id="rentalPeriod" onchange="updateHardwareCosts()">
        <option value="kaufen">Kaufen</option>
        <option value="mieten">Mieten</option>
    </select>

    <label for="competitorInclude">Wettbewerber berechnen?</label>
    <select id="competitorInclude" onchange="toggleCompetitorFields()">
        <option value="nein">Nein</option>
        <option value="ja">Ja</option>
    </select>

    <div id="competitorSection" style="display: none;">
        <h3>Wettbewerber Daten</h3>
        <label for="competitorFee">Wettbewerber Gebühr pro Transaktion (€):</label>
        <input type="number" id="competitorFee" placeholder="z.B. 0.08" step="0.01">

        <label for="competitorGirocardFee">Girocard Gebühr (%):</label>
        <input type="number" id="competitorGirocardFee" placeholder="z.B. 0.39" step="0.01">

        <label for="competitorMaestroFee">Maestro Gebühr (%):</label>
        <input type="number" id="competitorMaestroFee" placeholder="z.B. 0.79" step="0.01">

        <label for="competitorMastercardFee">Mastercard Gebühr (%):</label>
        <input type="number" id="competitorMastercardFee" placeholder="z.B. 0.89" step="0.01">

        <label for="competitorBusinessFee">Business Card Gebühr (%):</label>
        <input type="number" id="competitorBusinessFee" placeholder="z.B. 2.89" step="0.01">
    </div>

    <button onclick="calculateCosts()">Kosten Berechnen</button>
    <div id="results"></div>

    <h3>Wichtige Informationen zu den Gebühren</h3>
    <div id="info">
        <p><strong>Gebührenübersicht:</strong></p>
        <ul>
            <li>EC-Karten Gebühr unter 10.000 €: 0,39 %</li>
            <li>EC-Karten Gebühr über 10.000 €: 0,29 %</li>
            <li>Maestro / VPAY Gebühr: 0,79 %</li>
            <li>Mastercard Gebühr: 0,89 %</li>
            <li>Business Card Gebühr: 2,89 %</li>
        </ul>
    </div>
</div>

</body>
</html>
