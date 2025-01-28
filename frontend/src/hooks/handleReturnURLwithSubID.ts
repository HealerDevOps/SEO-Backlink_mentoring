import { useEffect } from 'react';

const HandleReturnUrl = () => {
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const subscriptionId = queryParams.get('subscriptionId'); // Or 'token'

        if (subscriptionId) {
            validateSubscription(subscriptionId);
        }
    }, []);

    const validateSubscription = async (subscriptionId : string) => {
        try {
            const response = await fetch('/api/validate-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Subscription successful!'); // Grant access
            } else {
                alert('Subscription validation failed.');
            }
        } catch (error) {
            console.error('Error validating subscription:', error);
        }
    };

    // return <div>Processing...</div>;
};

export default HandleReturnUrl;
