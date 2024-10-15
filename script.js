function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const businessCardField = document.getElementById('businessCardField');
    const maestroField = document.getElementById('maestroField');
    const competitorSection = document.getElementById('competitorSection');

    if (calculationType === 'schnell') {
        businessCardField.classList.add('hidden');
        maestroField.classList.add('hidden');
        competitorSection.classList.add('hidden');
    } else {
        businessCardField.classList.remove('hidden');
        maestroField.classList.remove('hidden');
        competitorSection.classList.remove('hidden');
    }
}

function calculateCosts() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const transactions = parseFloat(document.getElementById('transactions').value) || 0;
    const girocardFeePercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaFeePercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const maestroFeePercentage = parseFloat(document.getElementById('maestro').value) || 0;
    const businessCardFeePercentage = parseFloat(document.getElementById('businessCard').value) || 0;

    const totalPercentage = girocardFeePercentage + mastercardVisaFeePercentage + maestroFeePercentage + businessCardFeePercentage;

    if (totalPercentage !== 100) {
        alert("Die Summe der Kartenprozentsätze muss 100% ergeben.");
        return;
    }

    // Rest der Berechnungslogik ...
}
