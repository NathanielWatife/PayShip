document.addEventListener('DOMContentLoaded', () => {
    const shipmentForm = document.getElementById('shipment-form');
    const paymentMethod = document.getElementById('payment-method');
    const walletAddressField = document.querySelector('.wallet-address');

    // Show/hide wallet address field based on payment selection
    paymentMethod.addEventListener('change', () => {
        if (paymentMethod.value === 'Cryptocurrency') {
            walletAddressField.style.display = 'block';
        } else {
            walletAddressField.style.display = 'none';
        }
    });

    // Handle shipment form submission
    shipmentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const pickupAddress = document.getElementById('pickup-address').value.trim();
        const deliveryAddress = document.getElementById('delivery-address').value.trim();
        const weight = document.getElementById('package-weight').value.trim();
        const transitType = document.getElementById('transit-type').value.trim();
        const selectedPaymentMethod = paymentMethod.value.trim();
        const walletAddress = document.getElementById('wallet-address').value.trim(); // Only applicable for crypto

        if (!selectedPaymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        // Store shipment details in localStorage to retrieve in payment.html
        const shipmentData = {
            pickupAddress,
            deliveryAddress,
            weight,
            transitType,
            paymentMethod: selectedPaymentMethod,
            walletAddress: selectedPaymentMethod === 'Cryptocurrency' ? walletAddress : ''
        };

        localStorage.setItem('shipmentData', JSON.stringify(shipmentData));

        // Redirect to the payment page
        window.location.href = 'payment.html';
    });
});
