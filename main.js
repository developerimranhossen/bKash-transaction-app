import { trxId, formatDateTime } from "./utils.js";

const pymentBtn = document.getElementById("payment-btn");
const closeBtn = document.getElementById("close-btn");
const modalOverlay = document.getElementById("modalOverlay");
const newTransactionForm = document.getElementById("create_transaction_form");
const query = document.getElementById("search-input");
const totalBalance = document.getElementById("total-balance");

// Function to initialize transactions in local storage
function initializeTransactions() {
  const existingData = JSON.parse(localStorage.getItem("transaction"));

  if (!existingData || existingData.length === 0) {
    const initialTransactions = [
      {
        id: trxId(),
        name: "Nur",
        phone: "01712345678",
        type: "Cash Out",
        amount: "2200",
        date: formatDateTime(new Date()),
        photo: "https://avatars.githubusercontent.com/u/138699187?v=4",
      },
      {
        id: trxId(),
        name: "Akash",
        phone: "01898765432",
        type: "Cash In",
        amount: "2200",
        date: formatDateTime(new Date()),
        photo: "https://avatars.githubusercontent.com/u/112241372?v=4",
      },
    ];

    localStorage.setItem("transaction", JSON.stringify(initialTransactions));
  }

  renderTransaction();
}

// Call the initialization function
initializeTransactions();

pymentBtn.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  document.body.style.opacity = "0.5";
});

closeBtn.addEventListener("click", () => {
  closeModal();
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

const closeModal = () => {
  modalOverlay.style.display = "none";
  document.body.style.opacity = "1";
};

// Handle new transaction submission
newTransactionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);

  let transactions = JSON.parse(localStorage.getItem("transaction")) ?? [];

  // Recalculate balance before checking cash-out eligibility
  let cashIn = transactions
    .filter((t) => t.type === "Cash In")
    .reduce((sum, t) => sum + parseInt(t.amount), 0);

  let cashOut = transactions
    .filter((t) => t.type === "Cash Out")
    .reduce((sum, t) => sum + parseInt(t.amount), 0);

  let totalBalanceValue = cashIn - cashOut;

  if (data.type === "Cash Out" && totalBalanceValue < parseInt(data.amount)) {
    alert("Insufficient balance! You cannot cash out.");
    return;
  }

  transactions.push({
    id: trxId(),
    date: formatDateTime(new Date()),
    ...data,
  });

  localStorage.setItem("transaction", JSON.stringify(transactions));
  renderTransaction();
  closeModal();
  this.reset();
});

function renderTransaction() {
  const queryValue = query.value.toLowerCase();

  let transactionUi = "";
  let transactions = JSON.parse(localStorage.getItem("transaction")) ?? [];

  // Reset cashIn and cashOut before recalculating
  let cashIn = 0;
  let cashOut = 0;

  transactions
    .filter((transaction) =>
      queryValue === ""
        ? true
        : transaction.id.toLowerCase().includes(queryValue) ||
          transaction.phone.toLowerCase().includes(queryValue)
    )
    .reverse()
    .forEach((transaction) => {
      if (transaction.type === "Cash In") {
        cashIn += parseInt(transaction.amount);
      } else {
        cashOut += parseInt(transaction.amount);
      }

      transactionUi += `
        <div class="transaction-item">
          <div class="trans-info">
            <img src="${transaction.photo}" alt="${transaction.name}">
            <div class="details">
              <span class="trans-type">${transaction.type}</span>
              <span class="trans-user">${transaction.name}</span>
              <span class="trans-id">TrxID: ${transaction.id}</span>
            </div>
          </div>
          <div class="trans-data">
            <span class="trans-amount ${
              transaction.type === "Cash In" ? "" : "not-cash-in"
            }">${transaction.type === "Cash In" ? "+" : "-"}${transaction.amount} BDT</span>
            <span class="trans-time">${transaction.date}</span>
          </div>
        </div>
      `;
    });

  document.getElementById("transaction-list").innerHTML = transactionUi;

  // Calculate total balance dynamically
  let totalBalanceValue = cashIn - cashOut;
  totalBalance.innerText = `${totalBalanceValue} BDT`;
}

query.addEventListener("input", function () {
  renderTransaction();
});
