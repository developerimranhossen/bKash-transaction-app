const pymentBtn = document.getElementById("payment-btn");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-btn");
const modalOverlay = document.getElementById("modalOverlay");

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
