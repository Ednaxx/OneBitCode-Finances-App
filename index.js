import { newTransactionWindow, loadDb } from "./scripts/transactions.js";
import { switchMode } from "./scripts/colorMode.js";

// dark/light mode button
document.getElementById('color-mode-ico').addEventListener('click', switchMode)

// Shows window to create a new transaction
document.getElementById('new-transaction').addEventListener('click', newTransactionWindow)

// Loads last dark/light mode used
if (localStorage.getItem('mode') === 'dark') localStorage.setItem('mode', 'light')
else if (localStorage.getItem('mode') === 'light') localStorage.setItem('mode', 'dark')
else localStorage.setItem('mode', 'dark')

switchMode()

// Loads the db on screen
loadDb()