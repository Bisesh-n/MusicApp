document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })  // Send username and password
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            // Store token and username in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('username', result.username);  // Store the username

            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        } else {
            alert(result.msg || 'An error occurred. Please try again.');
        }

        
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred. Please try again.');
    }

    
});


function togglePassword() {
    const passwordField = document.getElementById('password');
    const passwordFieldType = passwordField.getAttribute('type');

    if (passwordFieldType === 'password') {
        passwordField.setAttribute('type', 'text');
    } else {
        passwordField.setAttribute('type', 'password');
    }
}