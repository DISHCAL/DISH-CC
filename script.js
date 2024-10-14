document.addEventListener('DOMContentLoaded', () => {
    const cardRevenueInput = document.getElementById('cardRevenue');
    const girocardInput = document.getElementById('girocard');
    const maestroInput = document.getElementById('maestro');
    const mastercardPrivatInput = document.getElementById('mastercardPrivat');
    const mastercardBusinessInput = document.getElementById('mastercardBusiness');
    const transactionsInput = document.getElementById('transactions');

    const monthlyCostDisplay = document.getElementById('monthlyCost');
    const savingsDisplay = document.getElementById('savings');

    // Function to calculate monthly costs
    function calculateMonthlyCosts() {
        const girocardRevenue = parseFloat(girocardInput.value);
        const maestroRevenue = parseFloat(maestroInput.value);
        const mastercardPrivatRevenue = parseFloat(mastercardPrivatInput.value);
        const mastercardBusinessRevenue = parseFloat(mastercardBusinessInput.value);
        const transactions = parseInt(transactionsInput.value);

        // Example calculation (these can be replaced with the actual formulas)
        const girocardFee = girocardRevenue * 0.0039; // 0.39%
        const maestroFee = maestroRevenue * 0.0089; // 0.89%
        const mastercardPrivatFee = mastercardPrivatRevenue * 0.0089; // 0.89%
        const mastercardBusinessFee = mastercardBusinessRevenue * 0.0289; // 2.89%

        const totalFees = girocardFee + maestroFee + mastercardPrivatFee + mastercardBusinessFee;
        const monthlyCost = totalFees + (transactions * 0.06); // Example transaction cost

        // Update the display
        monthlyCostDisplay.textContent = monthlyCost.toFixed(2) + ' €';
        savingsDisplay.textContent = (245.19 - monthlyCost).toFixed(2) + ' €'; // Example savings
    }

    // Add event listeners to input fields to recalculate on change
    cardRevenueInput.addEventListener('input', calculateMonthlyCosts);
    girocardInput.addEventListener('input', calculateMonthlyCosts);
    maestroInput.addEventListener('input', calculateMonthlyCosts);
    mastercardPrivatInput.addEventListener('input', calculateMonthlyCosts);
    mastercardBusinessInput.addEventListener('input', calculateMonthlyCosts);
    transactionsInput.addEventListener('input', calculateMonthlyCosts);

    // Initial calculation
    calculateMonthlyCosts();
});

