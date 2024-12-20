const blockchainState = [];
let pendingTransactions = [];
let transactionCounter = 1;

const createTransactionButton = document.getElementById('create-transaction');
const mineBlockButton = document.getElementById('mine-block');
const resetButton = document.getElementById('reset');
const transactionListDisplay = document.getElementById('scrollable-transactions');
const blockchainDisplay = document.getElementById('scrollable-blockchain');

const persons = ["Alice", "Bob", "Charlie", "Dave", "Eve"];

createTransactionButton.addEventListener('click', () => {
    const sender = persons[Math.floor(Math.random() * persons.length)];
    let recipient;
    do {
        recipient = persons[Math.floor(Math.random() * persons.length)];
    } while (recipient === sender);

    const newTransaction = {
        transactionId: transactionCounter++,
        timestamp: new Date().toISOString(),
        sender,
        recipient,
        value: (Math.random() * 10).toFixed(2),
        currency: "ETH",
    };
    pendingTransactions.push(newTransaction);
    updateTransactionDisplay();

    if (pendingTransactions.length >= 2) {
        mineBlockButton.disabled = false;
        mineBlockButton.classList.remove("disabled");
    }
});

mineBlockButton.addEventListener('click', () => {
    if (pendingTransactions.length < 2) return;

    const lastBlock = blockchainState[blockchainState.length - 1];
    const transactionsToMine = pendingTransactions.splice(0, 2).map(tx => ({
        transactionId: tx.transactionId,
        timestamp: tx.timestamp,
        sender: generateUID(tx.sender),
        recipient: generateUID(tx.recipient),
        value: tx.value,
        currency: tx.currency,
    }));

    const newBlock = {
        blockId: blockchainState.length + 1,
        previousHash: lastBlock ? lastBlock.hash : '0',
        transactions: transactionsToMine,
        hash: generateHash(transactionsToMine),
    };

    blockchainState.push(newBlock);
    updateBlockchainDisplay();
    updateTransactionDisplay();

    if (pendingTransactions.length < 2) {
        mineBlockButton.disabled = true;
        mineBlockButton.classList.add("disabled");
    }
});

resetButton.addEventListener('click', () => {
    blockchainState.length = 0;
    pendingTransactions.length = 0;
    transactionCounter = 1;
    updateBlockchainDisplay();
    updateTransactionDisplay();
    mineBlockButton.disabled = true;
    mineBlockButton.classList.add("disabled");
});

function generateHash(transactions) {
    const data = transactions.map(tx => `${tx.transactionId}${tx.sender}${tx.recipient}${tx.value}`).join('');
    return btoa(data + Date.now()).substring(0, 15);
}

function generateUID(name) {
    return btoa(name + Date.now()).substring(0, 10);
}

function updateBlockchainDisplay() {
    blockchainDisplay.textContent = JSON.stringify(blockchainState, null, 2).trim();
    blockchainDisplay.textContent = blockchainDisplay.textContent.replace(/^\s*\n/gm, '');
}

function updateTransactionDisplay() {
    transactionListDisplay.textContent = JSON.stringify(pendingTransactions, null, 2).trim();
    transactionListDisplay.textContent = transactionListDisplay.textContent.replace(/^\s*\n/gm, '');
}
