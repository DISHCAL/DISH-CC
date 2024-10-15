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

function updateRentalPrices() {
    const hardwareSelect = document.getElementById('hardware');
    const selectedHardware = hardwareSelect.options[hardwareSelect.selectedIndex];
    const rentalPeriodSelect = document.getElementById('rentalPeriod');
    const price12 = selectedHardware.getAttribute('data-price-12');
    const price36 = selectedHardware.getAttribute('data-price-36');
    const price60 = selectedHardware.getAttribute('data-price-60');

    rentalPeriodSelect.options[0].text = `12 Monate - ${price12} €/Monat`;
    rentalPeriodSelect.options[1].text = `36 Monate - ${price36} €/Monat`;
    rentalPeriodSelect.options[2].text = `60 Monate - ${price60} €/Monat`;
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

    // Berechnungslogik hier ...
}
