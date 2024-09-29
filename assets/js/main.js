const quantityInput = document.querySelector('.order-quantity input');
const incrementButton = document.querySelector('.order-quantity button:nth-child(3)');
const decrementButton = document.querySelector('.order-quantity button:nth-child(1)');

incrementButton.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
});

decrementButton.addEventListener('click', () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});
