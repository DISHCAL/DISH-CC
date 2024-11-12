/* styles.css */

/* Allgemeine Stile */
body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #fff;
}

h1, h2, h3, h4 {
    color: #FF7F00; /* Orange */
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.language-selector {
    display: flex;
    align-items: center;
}

.language-selector label {
    margin-right: 5px;
}

.customer-input {
    display: flex;
    flex-direction: column;
}

.name-group {
    display: flex;
}

.name-group select,
.name-group input {
    margin-right: 5px;
}

.input-group {
    margin-bottom: 15px;
}

.input-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
}

.input-group input,
.input-group select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

.input-group input.error,
.input-group select.error {
    border: 2px solid red;
}

.error-message {
    color: red;
    font-size: 12px;
}

.button-group {
    margin-top: 20px;
}

.button-group button {
    padding: 10px 20px;
    margin-right: 10px;
    background-color: #FF7F00; /* Orange */
    color: #fff;
    border: none;
    cursor: pointer;
}

.button-group button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.result-section {
    margin-top: 30px;
}

.result-section p {
    margin-bottom: 10px;
}

.result-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.result-table th,
.result-table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.result-table th {
    background-color: #FF7F00; /* Orange */
    color: white;
}

.tabs {
    display: flex;
    margin-bottom: 20px;
}

.tab-link {
    flex: 1;
    padding: 10px;
    background-color: #eee;
    border: none;
    cursor: pointer;
    text-align: center;
    font-size: 16px;
}

.tab-link.active {
    background-color: #FF7F00; /* Orange */
    color: #fff;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.hidden {
    display: none;
}

.competitor-section {
    margin-top: 20px;
    padding: 10px;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    clear: both;
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.5);
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border: 1px solid #FF7F00; /* Orange */
    width: 80%;
    max-width: 600px;
    position: relative;
}

.close-button {
    color: #aaa;
    position: absolute;
    right: 20px;
    top: 10px;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close-button:hover,
.close-button:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
