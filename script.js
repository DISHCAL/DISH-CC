document.getElementById('calculateBtn').addEventListener('click', function() {
    const monthlySales = parseFloat(document.getElementById('monthlySales').value);
    const terminal1 = parseFloat(document.getElementById('terminal1').value);
    const terminal2 = parseFloat(document.getElementById('terminal2').value);
    const transactionPrice = parseFloat(document.getElementById('transactionPrice').value);
    const transactionCount = parseInt(document.getElementById('transactionCount').value);

    // Monatliche Kosten berechnen
    const monthlyCostDISH = terminal1 + terminal2;
    const totalTransactionCost = transactionCount * transactionPrice;
    const totalMonthlyCost = monthlyCostDISH + totalTransactionCost;

    // Monatliche Ersparnis zu Wettbewerber (hier als Beispiel)
    const competitorMonthlyCost = 245.19; // Beispielwert
    const monthlySavings = competitorMonthlyCost - totalMonthlyCost;

    // Ergebnisse anzeigen
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p><strong>Monatliche Kosten DISH:</strong> €${totalMonthlyCost.toFixed(2)}</p>
        <p><strong>Gesamtumsatz pro Monat:</strong> €${monthlySales.toFixed(2)}</p>
        <p><strong>Monatliche Ersparnis zu Wettbewerber:</strong> €${monthlySavings.toFixed(2)}</p>
    `;
});
