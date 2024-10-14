document.getElementById('calculateBtn').addEventListener('click', function() {
    const monthlySales = parseFloat(document.getElementById('monthlySales').value);
    const terminal1 = parseFloat(document.getElementById('terminal1').value);
    const terminal2 = parseFloat(document.getElementById('terminal2').value);
    const transactionPrice = parseFloat(document.getElementById('transactionPrice').value);

    // Monatliche Kosten berechnen
    const monthlyCostDISH = terminal1 + terminal2;
    const transactionCount = 400; // Aus der Dokumentation gegeben
    const totalTransactionCost = transactionCount * transactionPrice;

    const totalMonthlyCost = monthlyCostDISH + totalTransactionCost;

    // Ergebnisse anzeigen
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p>Monatliche Kosten DISH: €${totalMonthlyCost.toFixed(2)}</p>
        <p>Gesamtumsatz pro Monat: €${monthlySales.toFixed(2)}</p>
    `;
});
