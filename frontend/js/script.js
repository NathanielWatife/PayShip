// // Backend base URL
const BASE_URL = 'https://payship-api.onrender.com'; 

/************ Authentication Utilities ************/
// Check if the user is authenticated
// function isAuthenticated() {
//     const token = localStorage.getItem('token');
//     if (!token) return false;

//     try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         const currentTime = Math.floor(Date.now() / 1000); 
//         return payload.exp > currentTime; 
//     } catch (err) {
//         console.error('Error decoding token:', err);
//         return false;
//     }
// }

// Redirect to login if user is not authenticated
// function requireAuth() {
//     const currentPage = window.location.pathname.split('/').pop();

//     if (['login.html', 'signup.html'].includes(currentPage)) return;
//     if (!isAuthenticated()) {
//         // console.log('Token expired or unauthorized. Logging out.');
//         localStorage.removeItem('token');
//         window.location.href = 'login.html'; // Redirect to login
//     }
// }

// // Redirect logged-in users away from login/signup
// function redirectAuthenticatedUsers() {
//     const currentPage = window.location.pathname.split('/').pop();
//     if (isAuthenticated() && ['signup.html'].includes(currentPage)) {
//         window.location.href = 'index.html';
//     }
// }

// Global authentication checks
// document.addEventListener('DOMContentLoaded', () => {
//     requireAuth(); // Protect authenticated pages
//     redirectAuthenticatedUsers(); // Redirect logged-in users on login/signup pages
// });

// /************ SIGNUP ************/
// document.getElementById('signup-form')?.addEventListener('submit', async (event) => {
//     event.preventDefault(); // Prevent form submission
//     showLoader('Creating your account...'); // Show loader with message

//     const name = document.getElementById('name').value.trim();
//     const email = document.getElementById('email').value.trim();
//     const phone = document.getElementById('phone').value.trim();
//     const password = document.getElementById('password').value.trim();

//     try {
//         clearError();
//         const response = await fetch(`${BASE_URL}/register`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, email, phone, password }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//             window.location.href = 'login.html'; // Redirect to login
//         } else {
//             showError(data.message || 'Failed to sign up. Please try again.');
//         }
//     } catch (err) {
//         console.error('Error during signup:', err.message);
//         showError('An error occurred. Please try again later.');
//     } finally {
//         setTimeout(hideLoader, 1500); // Delay to allow UI update
//     }
// });

/************ LOGIN ************/
// document.getElementById('login-form')?.addEventListener('submit', async (event) => {
//     event.preventDefault(); // Prevent form submission
//     showLoader('Logging you in...');

//     const email = document.getElementById('email').value.trim();
//     const password = document.getElementById('password').value.trim();

//     try {
//         clearError();
//         const response = await fetch(`${BASE_URL}/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password }),
//         });

//         const data = await response.json();
//         if (response.ok) {
//             localStorage.setItem('token', data.token);
//             window.location.href = 'index.html'; // Redirect to homepage
//         } else {
//             showError(data.message || 'Invalid email or password.');
//         }
//     } catch (err) {
//         console.error('Error during login:', err.message);
//         showError('An error occurred. Please try again later.');
//     } finally {
//         setTimeout(hideLoader, 1500);
//     }
// });

/************ LOGOUT ************/
// document.getElementById('logout')?.addEventListener('click', () => {
//     localStorage.removeItem('token');
//     window.location.href = 'login.html'; // Redirect to login page
// });
/************ LOGOUT END ************/

/************ PROFILE ************/
// Load profile details
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (document.getElementById('profile-form')) {
        try {
            const response = await fetch(`${BASE_URL}/profile`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const user = await response.json();
                document.getElementById('name').value = user.name;
                document.getElementById('email').value = user.email;
                document.getElementById('phone').value = user.phone;
            } else {
                throw new Error('Failed to fetch profile details.');
            }
        } catch (err) {
            showError('Error loading profile details.');
            console.error('Error loading profile:', err.message);
        }
    }
});

// Update profile
document.getElementById('profile-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    try {
        const response = await fetch(`${BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, phone }),
        });

        if (response.ok) {
            alert('Profile updated successfully.');
        } else {
            showError('Failed to update profile.');
        }
    } catch (err) {
        showError('An error occurred while updating profile.');
        console.error('Error updating profile:', err.message);
    }
});
/************ PROFILE END ************/

/************ TRACK PACKAGE ************/
document.getElementById('track-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const trackingId = document.getElementById('tracking-id').value.trim();
    if (!trackingId) {
        alert('Please enter a tracking ID.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/packages/${trackingId}`, {
            method: 'GET',
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('package-id').textContent = data.packageId || 'N/A';
            document.getElementById('status').textContent = data.status || 'N/A';
            document.getElementById('current-location').textContent =
                data.currentLocation ? `${data.currentLocation.latitude}, ${data.currentLocation.longitude}` : 'N/A';
        } else {
            showError(data.message || 'Failed to fetch tracking details.');
        }
    } catch (err) {
        showError('An error occurred. Please try again later.');
        console.error('Error fetching tracking details:', err.message);
    }
});
/************ TRACK END ************/

/************ SUPPORT ************/
document.getElementById('contact-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    try {
        const response = await fetch('http://localhost:5000/api/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
            alert('Message sent successfully.');
        } else {
            showError('Failed to send message. Please try again.');
        }
    } catch (err) {
        showError('An error occurred. Please try again later.');
        console.error('Error sending message:', err.message);
    }
});
/************ SUPPORT END ************/

/************ HELPER FUNCTIONS ************/
function showError(message) {
    const errorSection = document.getElementById('error-section');
    if (errorSection) {
        errorSection.textContent = message;
        errorSection.classList.remove('hidden');
    }
}

function clearError() {
    const errorSection = document.getElementById('error-section');
    if (errorSection) {
        errorSection.textContent = '';
        errorSection.classList.add('hidden');
    }
}

// Show Loader with a Message
function showLoader(message = 'Loading...') {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    if (loader && loaderText) {
        loaderText.textContent = message;
        loader.classList.remove('hidden');
    }
}

// Hide the Loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}


/************ END HELPER FUNCTIONS ************/
