const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expanseDisplay = document.querySelector('#money-minus');
const balanceDispay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const addButton = document.getElementById('addBtn');

addButton.disabled = true;

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'));
let transactions = localStorage
.getItem('transactions') !== null ? localStorageTransactions : [];


const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID);
    updateLocalStorage();
    init();
}

const addtransactionIntoDOM = ({amount, name, id}) => {
    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? 'minus' : 'plus';
    const amoutWithoutOperator = Math.abs(amount);
    const li = document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${name} 
        <span>${operator} R$ ${amoutWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `
    transactionsUl.append(li);
}

const getTotal = transactionsAmounts => transactionsAmounts
.reduce((accumulator, transaction) => accumulator + transaction, 0)
.toFixed(2);

const getIncome = transactionsAmounts => transactionsAmounts
.filter(value => value > 0)
.reduce((accumulator, value) => accumulator + value, 0)
.toFixed(2);

const getExpense = transactionsAmounts => Math.abs(transactionsAmounts.filter(value => value < 0)
.reduce((accumulator, value) => accumulator + value, 0))
.toFixed(2);

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({amount}) => amount);
    const total = getTotal(transactionsAmounts);
    const income = getIncome(transactionsAmounts);
    const expense = getExpense(transactionsAmounts);

    balanceDispay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expanseDisplay.textContent = `R$ ${expense}`;
}

const init = () => {
    transactionsUl.innerHTML = '';
    transactions.forEach(addtransactionIntoDOM);
    updateBalanceValues();
}

init();

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = () => {
    const transactionName = inputTransactionName.value;
    const transactionAmount = inputTransactionAmount.value;
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    });
}

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
}


const checkForm = () => {
    const isNotEmpty = inputTransactionName.value !== '' && inputTransactionAmount.value !== '';
    if (isNotEmpty) {
        addButton.removeAttribute('disabled');
    } else {
        addButton.setAttribute('disabled', 'disabled');
    }
};

const disableButton = () => addButton.setAttribute('disabled', 'disabled');

const handleFormSubmit = event => {
    event.preventDefault();

    addToTransactionsArray();
    init();
    updateLocalStorage();
    cleanInputs();
    disableButton();

};

form.addEventListener('input', checkForm);
form.addEventListener('submit', handleFormSubmit);
