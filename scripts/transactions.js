
// loads the db and renders on screen

async function loadDb() {
    const db = await fetch('http://localhost:3000/transactions/').then((response) => response.json())
    document.getElementById('balance').innerText = 0

    db.forEach((transaction) => renderTransaction(transaction))
}

// render a new transaction on screen

function renderTransaction(transaction) {
    // main container
    const newTransaction = document.createElement('div')
    newTransaction.classList.add('list')
    newTransaction.id = "transaction-#" + transaction.id

    // render id 
    const id = document.createElement('div')
    id.classList.add('list-id')
    id.innerText = transaction.id


    // render name
    const name = document.createElement('div')
    name.classList.add('list-name')
    name.innerText = transaction.name


    // render value
    const valueDiv = document.createElement('div')
    valueDiv.classList.add('list-value')
    valueDiv.innerText = 'R$'

    const value = document.createElement('span')
    value.innerText = Number(transaction.value).toFixed(2)
    if (value.innerText < 0) valueDiv.style.color = 'var(--negative-color)'
    else valueDiv.style.color = 'var(--positive-color)'
    value.id = `value-#${transaction.id}`
    valueDiv.appendChild(value)


    // render formatted date (dd/mm/yyy)
    const date = document.createElement('div')
    date.classList.add('list-date')
    date.dataset.transactionDate = transaction.date

    const year = transaction.date.slice(0,4)
    const month = transaction.date.slice(5,7)
    const day = transaction.date.slice(8,)
    date.innerText = `${day}/${month}/${year}`


    // render edit button
    const editIcon = document.createElement('img')
    editIcon.classList.add('list-edit')
    if (localStorage.getItem('mode') === 'dark') editIcon.src = "./ico/edit-dark-mode.png"
    else editIcon.src = "./ico/edit-light-mode.png"
    editIcon.addEventListener("click", editTransaction)


    // render delete button
    const deleteIcon = document.createElement('img')
    deleteIcon.classList.add('list-delete')
    deleteIcon.src = "./ico/delete.png"
    deleteIcon.addEventListener('click', deleteTransaction)

    // appends elements on main container
    newTransaction.append(id, name, valueDiv, date, editIcon, deleteIcon)
    document.getElementById('transaction-list').appendChild(newTransaction)

    // Update balance
    document.getElementById('balance').innerText = (Number(document.getElementById('balance').innerText) + Number(transaction.value)).toFixed(2)
}

// Shows window to create a new transaction

function newTransactionWindow() {
    document.getElementById('transaction-window').classList.remove('pop-up-window-hidden')
    document.getElementById('transaction-window').classList.add('pop-up-window-show')

    // Submit button sends transaction to db, renders it on screen and closes pop up

    document.querySelector('#transaction-window form').addEventListener('submit', newTransaction)

    async function newTransaction(ev) {
        ev.preventDefault()
    
        document.getElementById('transaction-window').classList.remove('pop-up-window-show')
        document.getElementById('transaction-window').classList.add('pop-up-window-hidden')
    
    
        const transactionData = {
            name: document.querySelector('#transaction-name').value,
            value: document.querySelector('#transaction-value').value,
            date: document.querySelector('#transaction-date').value
        }
    
        const response = await fetch('http://localhost:3000/transactions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        })
        const transaction = await response.json()

        renderTransaction(transaction)
        ev.target.reset()
        document.querySelector('#transaction-window form').removeEventListener("submit", newTransaction)
    }
    
    // Cancel button close pop up

    document.getElementById('cancel-button').addEventListener('click', (ev) => {
        ev.preventDefault()
        document.getElementById('transaction-window').classList.remove('pop-up-window-show')
        document.getElementById('transaction-window').classList.add('pop-up-window-hidden')
        document.querySelector('#transaction-window form').removeEventListener("submit", newTransaction)
    })
}



// Shows edit transaction confirmation window

async function editTransaction(ev) {
    let transactionId = ev.target.parentNode.id.slice(13,)

    document.getElementById('edit-transaction-window').classList.remove('pop-up-window-hidden')
    document.getElementById('edit-transaction-window').classList.add('pop-up-window-show')

    // Placeholders on inputs

    let date = document.querySelector(`div[id="transaction-#${transactionId}"] .list-date`)
    document.getElementById('transaction-date-edit').value = date.dataset.transactionDate
    document.getElementById('transaction-name-edit').value = document.querySelector(`div[id="transaction-#${transactionId}"] .list-name`).innerText
    document.getElementById('transaction-value-edit').value = document.querySelector(`span[id="value-#${transactionId}"]`).innerText

    // Submit button sends to db and renders alterations

    document.querySelector('#edit-transaction-window form').addEventListener('submit', editSubmit)

    async function editSubmit(ev) {
        ev.preventDefault()

        const transactionData = {
            name: document.querySelector('#transaction-name-edit').value,
            value: document.querySelector('#transaction-value-edit').value,
            date: document.querySelector('#transaction-date-edit').value
        }
    
        await fetch(`http://localhost:3000/transactions/${transactionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        })
        


        // Subtracts old value from balance
        document.getElementById('balance').innerText =
         (Number(document.getElementById('balance').innerText) - Number(document.querySelector(`span[id="value-#${transactionId}"]`).innerText)).toFixed(2)

        // Change transaction name and value
        document.querySelector(`div[id="transaction-#${transactionId}"] .list-name`).innerText = document.getElementById('transaction-name-edit').value
        document.querySelector(`span[id="value-#${transactionId}"]`).innerText = document.getElementById('transaction-value-edit').value

        // Change transaction date and renders it formatted (dd/mm/yyyy)
        date.dataset.transactionDate = document.querySelector('#transaction-date-edit').value
        const year = date.dataset.transactionDate.slice(0,4)
        const month = date.dataset.transactionDate.slice(5,7)
        const day = date.dataset.transactionDate.slice(8,)
        date.innerText = `${day}/${month}/${year}`

        // Changes value color depending on value
        if (document.querySelector(`span[id="value-#${transactionId}"]`).innerText < 0) {
            document.querySelector(`div[id="transaction-#${transactionId}"] .list-value`).style.color = 'var(--negative-color)'}
        else {
            document.querySelector(`div[id="transaction-#${transactionId}"] .list-value`).style.color = 'var(--positive-color)'}


        // Adds new value to balance
        document.getElementById('balance').innerText =
         (Number(document.getElementById('balance').innerText) + Number(document.querySelector(`span[id="value-#${transactionId}"]`).innerText)).toFixed(2)

        

        document.getElementById('edit-transaction-window').classList.remove('pop-up-window-show')
        document.getElementById('edit-transaction-window').classList.add('pop-up-window-hidden')

        document.querySelector('#edit-transaction-window form').removeEventListener("submit", editSubmit)
    }

    // Cancel button closes pop up

    document.getElementById('cancel-button-edit').addEventListener('click', (ev) => {
        ev.preventDefault()
        document.querySelector('#edit-transaction-window form').removeEventListener("submit", editSubmit)
        

        document.getElementById('transaction-name-edit').value = ""
        document.getElementById('transaction-value-edit').value = ""
        document.getElementById('transaction-date-edit').value = ""

        document.getElementById('edit-transaction-window').classList.remove('pop-up-window-show')
        document.getElementById('edit-transaction-window').classList.add('pop-up-window-hidden')
    })
}





// Shows remove transaction confirmation window

function deleteTransaction(ev) {
    const transactionId = ev.target.parentNode.id.slice(13,)

    document.getElementById('confirm-delete-window').classList.remove('pop-up-window-hidden')
    document.getElementById('confirm-delete-window').classList.add('pop-up-window-show')

    // Confirms, removes transaction from screen and db and finally, removes the window

    document.getElementById('confirm-delete-button').addEventListener('click', confirmDeleteButton)

    async function confirmDeleteButton() {
    
        document.getElementById('balance').innerText = 
        (Number(document.getElementById('balance').innerText) - Number(document.getElementById(`value-#${transactionId}`).innerText)).toFixed(2)
        
    
        document.getElementById(`transaction-#${transactionId}`).remove()
    
        await fetch(`http://localhost:3000/transactions/${transactionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    
        document.getElementById('confirm-delete-window').classList.remove('pop-up-window-show')
        document.getElementById('confirm-delete-window').classList.add('pop-up-window-hidden')
        
        document.getElementById('confirm-delete-button').removeEventListener("click", confirmDeleteButton)
    }

    // Cancel confirmation and removes window
    
    document.getElementById('cancel-delete-button').addEventListener('click', () => {
        document.getElementById('confirm-delete-button').removeEventListener("click", confirmDeleteButton)

        document.getElementById('confirm-delete-window').classList.remove('pop-up-window-show')
        document.getElementById('confirm-delete-window').classList.add('pop-up-window-hidden')
    })
    
    
}



export { newTransactionWindow, loadDb }