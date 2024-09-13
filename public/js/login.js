document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
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