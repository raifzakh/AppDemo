// Initializing Stripe with the public key
const stripe = Stripe('pk_test_51QOqzCLlnrhCHPZe1g7rrMt1k6XPD974idNp2fZTox4xEbu9m7F1Z8PFQuPV6B0HQX4mVjoUVyY0Khqrhf8OH6bz00tIH5BLYv');

// Creating an instance of Elements
const elements = stripe.elements();

// Creating a Card Element
const cardElement = elements.create('card');

// Mounting the Card Element into a DOM element
cardElement.mount('#card-element');

// Getting the payment button and adding an event listener
document.getElementById('pay-button').addEventListener('click', async () => {
    try {
        // Fetching the clientSecret from the backend (create-payment-intent route)
        const response = await fetch('http://localhost:3000/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: 5000 }), // Amount in cents ($50.00)
        });

        const data = await response.json();
        const clientSecret = data.clientSecret;

        // Confirming the payment with the clientSecret
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement, // This assumes we have a card input element for card details
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
