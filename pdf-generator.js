function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor("#e67e22");
    doc.text("DISH PAY Angebot", 10, 10);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const totalCostText = document.getElementById('totalCost').innerText.split(":")[1] || "-";
    const monthlyCostText = document.getElementById('monthlyCost').innerText.split(":")[1] || "-";
    const simServiceFeeText = document.getElementById('simServiceFee').innerText.split(":")[1] || "-";
    const oneTimeCostText = document.getElementById('oneTimeCost').innerText.split(":")[1] || "-";

    doc.autoTable({
        startY: 20,
        head: [['Beschreibung', 'Betrag (€)']],
        body: [
            ['Gebühren gesamt', totalCostText.trim()],
            ['Monatliche Hardwarekosten', monthlyCostText.trim()],
            ['SIM/Servicegebühr', simServiceFeeText.trim()],
            ['Einmalige Kosten (bei Kauf)', oneTimeCostText.trim()]
        ]
    });

    doc.save("DISH_Angebot.pdf");
}
