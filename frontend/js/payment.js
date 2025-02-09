
document.addEventListener('DOMContentLoaded', () => {
    const shipmentData = JSON.parse(localStorage.getItem('shipmentData'));
  
    if (!shipmentData) {
        alert("No shipment details found. Redirecting...");
        window.location.href = "shipnow.html";
        return;
    }
  
    // Populate payment details
    document.getElementById('pickup-address').textContent = shipmentData.pickupAddress;
    document.getElementById('delivery-address').textContent = shipmentData.deliveryAddress;
    document.getElementById('package-weight').textContent = shipmentData.weight;
    document.getElementById('transit-type').textContent = shipmentData.transitType;
    document.getElementById('payment-method').textContent = shipmentData.paymentMethod;
  
    if (shipmentData.paymentMethod === 'Cryptocurrency') {
        document.getElementById('wallet-section').style.display = 'block';
        document.getElementById('wallet-address').textContent = shipmentData.walletAddress;
    }
  
    // Confirm payment button
    document.getElementById('confirm-payment').addEventListener('click', () => {
        alert("Payment processing...");
        // You can now send the details to the backend for processing
    });
  });
  