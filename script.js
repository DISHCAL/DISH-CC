function updateHardwareCosts() {
    const hardwareSelect = document.getElementById('hardwareOption');
    const selectedOption = hardwareSelect.options[hardwareSelect.selectedIndex];
    
    const rentalPeriod = parseInt(document.getElementById('rentalPeriod').value);
    let monthlyCost;

    // Mietpreis basierend auf der Mietdauer
    if (rentalPeriod === 12) {
        monthlyCost = parseFloat(selectedOption.getAttribute('data-12m-cost').replace(',', '.'));
    } else if (rentalPeriod === 36) {
        monthlyCost = parseFloat(selectedOption.getAttribute('data-36m-cost').replace(',', '.'));
    } else if (rentalPeriod === 60) {
        monthlyCost = parseFloat(selectedOption.getAttribute('data-60m-cost').replace(',', '.'));
    }

    document.getElementById('results').innerHTML = '';
}

function toggleCompetitorFields() {
    const competitorSection = document.getElementById('competitorSection');
    const competitorInclude = document.getElementById('competitorInclude').value;
    competitorSection.style.display = competitorInclude === 'ja' ? 'block' : 'none';
}

function validateInputs() {
    const monthlyVolume = document.getElementById('monthlyVolume').value;
    const transactions = document.getElementById('transactions').value;
    const girocard = document.getElementById('girocard').value;
    const maestro = document.getElementById('maestro').value;
    const mastercardVisa = document.getElementById('mastercardVisa').value;
    const businessCard = document.getElementById('businessCard').value;
    const rentalPeriod = document.getElementById('rentalPeriod').value;

    if (!monthlyVolume || !transactions || !girocard || !maestro || !mastercardVisa || !businessCard || !rentalPeriod) {
        alert('Daten unvollständig: Bitte füllen Sie alle erforderlichen Felder aus.');
        return false;
    }
    return true;
}

function calculateCosts() {
    if (!validateInputs()) {
        return; // Abbrechen, wenn Eingaben nicht validiert sind
    }

    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value);
    const transactions = parseInt(document.getElementById('transactions').value);
    
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) / 100;
    const maestroPercentage = parseFloat(document.getElementById('maestro').value) / 100;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) / 100;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) / 100;

    const hardwareSelect = document.getElementById('hardwareOption');
    const selectedOption = hardwareSelect.options[hardwareSelect.selectedIndex];
    const rentalPeriod = parseInt(document.getElementById('rentalPeriod').value);
    
    let monthlyHardwareCost;
    if (rentalPeriod === 12) {
        monthlyHardwareCost = parseFloat(selectedOption.getAttribute('data-12m-cost').replace(',', '.'));
    } else if (rentalPeriod === 36) {
        monthlyHardwareCost = parseFloat(selectedOption.getAttribute('data-36m-cost').replace(',', '.'));
    } else if (rentalPeriod === 60) {
        monthlyHardwareCost = parseFloat(selectedOption.getAttribute('data-60m-cost').replace(',', '.'));
    }
    
    // Gebührenberechnung
    const girocardFee = girocardPercentage * monthlyVolume * 0.0039; 
    const maestroFee = maestroPercentage * monthlyVolume * 0.0079; 
    const mastercardFee = mastercardVisaPercentage * monthlyVolume * 0.0089; 
    const businessCardFee = businessCardPercentage * monthlyVolume * 0.0289; 

    const totalMonthlyFees = girocardFee + maestroFee + mastercardFee + businessCardFee + monthlyHardwareCost;

    let resultHtml = `
        <h3>Berechnungsergebnisse:</h3>
        <p>Gesamte monatliche Gebühren (inkl. Hardware): ${totalMonthlyFees.toFixed(2)} €</p>
    `;
    
    // Wettbewerberkostenberechnung
    if (document.getElementById('competitorInclude').value === 'ja') {
        const competitorFee = parseFloat(document.getElementById('competitorFee').value);
        const competitorGirocardFee = parseFloat(document.getElementById('competitorGirocardFee').value) / 100;
        const competitorMaestroFee = parseFloat(document.getElementById('competitorMaestroFee').value) / 100;
        const competitorMastercardFee = parseFloat(document.getElementById('competitorMastercardFee').value) / 100;
        const competitorBusinessFee = parseFloat(document.getElementById('competitorBusinessFee').value) / 100;

        const totalCompetitorFees = (competitorFee * transactions) + 
            (competitorGirocardFee * monthlyVolume * 0.0039) +
            (competitorMaestroFee * monthlyVolume * 0.0079) +
            (competitorMastercardFee * monthlyVolume * 0.0089) +
            (competitorBusinessFee * monthlyVolume * 0.0289);

        resultHtml += `
            <p>Gesamte monatliche Gebühren Wettbewerber: ${totalCompetitorFees.toFixed(2)} €</p>
        `;
    }

    document.getElementById('results').innerHTML = resultHtml;
}

function downloadOffer() {
    // Hier können Sie die Logik für den Download des Angebots hinzufügen.
}
