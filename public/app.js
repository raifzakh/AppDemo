// Initialize Stripe with your public key
const stripe = Stripe('pk_test_51QOqzCLlnrhCHPZe1g7rrMt1k6XPD974idNp2fZTox4xEbu9m7F1Z8PFQuPV6B0HQX4mVjoUVyY0Khqrhf8OH6bz00tIH5BLYv');

// Create an instance of Elements
const elements = stripe.elements();

// Create a Card Element
const cardElement = elements.create('card');

// Mount the Card Element into a DOM element
cardElement.mount('#card-element');

// Get the payment button and add an event listener
document.getElementById('pay-button').addEventListener('click', async () => {
    try {
        // Fetch the clientSecret from your backend (create-payment-intent route)
        const response = await fetch('http://localhost:3000/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: 5000 }), // Amount in cents ($50.00)
        });

        const data = await response.json();
        const clientSecret = data.clientSecret;

        // Confirm the payment with the clientSecret
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement, // This assumes you have a card input element for card details
            },
        });

        if (error) {
            console.error(error.message);
            alert('Payment failed: ' + error.message);
        } else if (paymentIntent.status === 'succeeded') {
            alert('Payment successful!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
