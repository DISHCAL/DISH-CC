// Übersetzungen
const translations = {
    de: {
        title: "DISH PAY Rechner",
        salutationLabel: "Anrede und Name:",
        languageLabel: "Sprache auswählen:",
        calculationTypeLabel: "Berechnungsart:",
        // ... weitere Übersetzungen
    },
    en: {
        title: "DISH PAY Calculator",
        salutationLabel: "Salutation and Name:",
        languageLabel: "Select Language:",
        calculationTypeLabel: "Calculation Type:",
        // ... weitere Übersetzungen
    }
};

// Funktion zum Ändern der Sprache
function changeLanguage() {
    const selectedLang = document.getElementById('languageSelect').value;
    localStorage.setItem('selectedLanguage', selectedLang);
    applyTranslations(selectedLang);
}

// Funktion zum Anwenden der Übersetzungen
function applyTranslations(lang) {
    document.title = translations[lang].title;
    document.querySelector('h1').innerText = translations[lang].title;
    document.querySelector('label[for="salutation"]').innerText = translations[lang].salutationLabel;
    document.querySelector('label[for="languageSelect"]').innerText = translations[lang].languageLabel;
    document.querySelector('label[for="calculationType"]').innerText = translations[lang].calculationTypeLabel;
    // ... weitere Elemente aktualisieren
}

// Beim Laden der Seite Sprache setzen
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'de';
    document.getElementById('languageSelect').value = savedLang;
    applyTranslations(savedLang);

    // Eingaben laden
    loadSavedInputs();

    // Event Listener für Eingabefelder
    const inputFields = document.querySelectorAll('input, select');
    inputFields.forEach(field => {
        field.addEventListener('change', saveInputs);
    });

    // Tooltips initialisieren
    tippy('[data-tippy-content]', {
        placement: 'right',
    });

    // Hardware-Optionen initialisieren
    updateHardwareOptions();
});

// Funktion zum Laden gespeicherter Eingaben
function loadSavedInputs() {
    const fields = ['salutation', 'customerName', 'monthlyVolume', 'transactions', 'girocard', 'mastercardVisa', 'vpay', 'businessCard', 'calculationType', 'purchaseOption', 'rentalDuration', 'hardware'];
    fields.forEach(fieldId => {
        const savedValue = localStorage.getItem(fieldId);
        if (savedValue !== null) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = savedValue;
            }
        }
    });
}

// Funktion zum Speichern der Eingaben
function saveInputs() {
    const fields = ['salutation', 'customerName', 'monthlyVolume', 'transactions', 'girocard', 'mastercardVisa', 'vpay', 'businessCard', 'calculationType', 'purchaseOption', 'rentalDuration', 'hardware'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            localStorage.setItem(fieldId, field.value);
        }
    });
}

// Funktion zum Umschalten der Berechnungsfelder
function toggleCalculationFields() {
    const calculationType = document.getElementById('calculationType').value;
    const competitorSection = document.getElementById('competitorSection');
    const vpayField = document.getElementById('vpayField');
    const businessCardField = document.getElementById('businessCardField');

    if (calculationType === 'ausführlich') {
        competitorSection.classList.add('show');
        competitorSection.classList.remove('hidden');
        vpayField.classList.add('show');
        vpayField.classList.remove('hidden');
        businessCardField.classList.add('show');
        businessCardField.classList.remove('hidden');
    } else {
        competitorSection.classList.add('hidden');
        competitorSection.classList.remove('show');
        vpayField.classList.add('hidden');
        vpayField.classList.remove('show');
        businessCardField.classList.add('hidden');
        businessCardField.classList.remove('show');
    }
}

// Funktion zum Umschalten der Mietoptionen
function toggleRentalOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const rentalDurationSection = document.getElementById('rentalDurationSection');

    if (purchaseOption === 'mieten') {
        rentalDurationSection.classList.add('show');
        rentalDurationSection.classList.remove('hidden');
    } else {
        rentalDurationSection.classList.add('hidden');
        rentalDurationSection.classList.remove('show');
    }

    // Hardware-Dropdown aktualisieren
    updateHardwareOptions();
}

// Funktion zum Aktualisieren der Hardware-Optionen basierend auf Kauf oder Miete
function updateHardwareOptions() {
    const purchaseOption = document.getElementById('purchaseOption').value;
    const hardwareSelect = document.getElementById('hardware');

    // Aktuelle Auswahl speichern
    const currentSelection = hardwareSelect.value;

    // Hardware-Optionen zurücksetzen
    hardwareSelect.innerHTML = '';

    if (purchaseOption === 'kaufen') {
        hardwareSelect.innerHTML = `
            <option value="S1F2">S1F2 Terminal - Kauf: 499,00 €</option>
            <option value="V400C">V400C Terminal - Kauf: 399,00 €</option>
            <option value="Moto G14">Moto G14 Terminal - Kauf: 119,00 €</option>
        `;
    } else {
        hardwareSelect.innerHTML = `
            <option value="S1F2">S1F2 Terminal - Miete ab: 14,90 €/Monat</option>
            <option value="V400C">V400C Terminal - Miete ab: 12,90 €/Monat</option>
            <option value="Tap2Pay">Tap2Pay Lizenz - Miete: 7,90 €/Monat</option>
        `;
    }

    // Wenn die vorherige Auswahl noch vorhanden ist, diese wieder auswählen
    if (hardwareSelect.querySelector(`option[value="${currentSelection}"]`)) {
        hardwareSelect.value = currentSelection;
    }
}

// Funktion zur Validierung der Eingaben
function validateInputs() {
    let isValid = true;

    // Pflichtfelder überprüfen
    const requiredFields = ['customerName', 'monthlyVolume', 'transactions', 'girocard', 'mastercardVisa'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorField = document.getElementById(fieldId + 'Error');
        if (!field.value || field.value.trim() === '') {
            field.classList.add('error');
            if (errorField) errorField.textContent = 'Dieses Feld ist erforderlich.';
            isValid = false;
        } else {
            field.classList.remove('error');
            if (errorField) errorField.textContent = '';
        }
    });

    // Numerische Felder überprüfen
    const numericFields = ['monthlyVolume', 'transactions', 'girocard', 'mastercardVisa', 'vpay', 'businessCard'];
    numericFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const value = parseFloat(field.value);
        if (isNaN(value) || value < 0) {
            field.classList.add('error');
            alert('Bitte geben Sie gültige positive Zahlen ein.');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    // Prozentangaben validieren
    const girocardPercentage = parseFloat(document.getElementById('girocard').value) || 0;
    const mastercardVisaPercentage = parseFloat(document.getElementById('mastercardVisa').value) || 0;
    const vpayPercentage = parseFloat(document.getElementById('vpay').value) || 0;
    const businessCardPercentage = parseFloat(document.getElementById('businessCard').value) || 0;
    const totalPercentage = girocardPercentage + mastercardVisaPercentage + vpayPercentage + businessCardPercentage;

    if (totalPercentage !== 100) {
        const percentageError = document.getElementById('percentageError');
        percentageError.textContent = 'Die Summe der Prozentangaben muss 100% ergeben.';
        isValid = false;
    } else {
        document.getElementById('percentageError').textContent = '';
    }

    return isValid;
}

// Hauptfunktion zur Berechnung der Kosten
function calculateCosts() {
    // Eingaben validieren
    if (!validateInputs()) {
        return;
    }

    // Fortschrittsanzeige einblenden
    document.getElementById('loadingOverlay').classList.remove('hidden');

    setTimeout(() => {
        // Berechnungen durchführen
        const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
        const transactions = parseInt(document.getElementById('transactions').value) || 0;

        // Weitere Berechnungen wie zuvor...

        // Beispielwerte für die Demonstration
        const totalMonthlyCost = 500; // Ersetzen durch die tatsächliche Berechnung
        const totalCompetitorCost = 600; // Ersetzen durch die tatsächliche Berechnung

        // Ergebnisbereich aktualisieren
        document.getElementById('resultArea').innerHTML = resultHtml;

        // Diagramm erstellen
        renderChart(totalMonthlyCost, totalCompetitorCost);

        // Fortschrittsanzeige ausblenden
        document.getElementById('loadingOverlay').classList.add('hidden');

        document.getElementById('downloadPdfButton').disabled = false;
    }, 500); // Simulierte Berechnungszeit
}

// Diagramm erstellen
function renderChart(dishPayCost, competitorCost) {
    const ctx = document.getElementById('costChart').getContext('2d');
    if (window.costChartInstance) {
        window.costChartInstance.destroy();
    }
    window.costChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['DISH PAY', 'Wettbewerber'],
            datasets: [{
                label: 'Monatliche Kosten (€)',
                data: [dishPayCost, competitorCost],
                backgroundColor: ['#e67e22', '#3498db'],
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Funktion zum Versenden des Angebots per E-Mail
function sendEmail() {
    const customerName = document.getElementById('customerName').value;
    const subject = encodeURIComponent('Ihr DISH PAY Angebot');
    const body = encodeURIComponent('Sehr geehrte/r ' + customerName + ',\n\nanbei erhalten Sie Ihr DISH PAY Angebot.\n\nMit freundlichen Grüßen,\nIhr Team');
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Interaktiver Assistent starten
function startTour() {
    const tour = new Shepherd.Tour({
        useModalOverlay: true,
    });

    tour.addStep({
        id: 'salutation',
        text: 'Bitte wählen Sie Ihre Anrede und geben Sie Ihren Namen ein.',
        attachTo: {
            element: '#salutation',
            on: 'bottom',
        },
        buttons: [
            {
                text: 'Weiter',
                action: tour.next,
            },
        ],
    });

    // Weitere Schritte hinzufügen...

    tour.start();
}
