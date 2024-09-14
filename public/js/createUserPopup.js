document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }
    
    document.getElementById('openCreateUserPopup').addEventListener('click', async () => {
        try {
            // Load the popup HTML
            const response = await fetch('createUserPopup.html');
            const popupHtml = await response.text();
            document.getElementById('popup-container').innerHTML = popupHtml;

            // Show the popup
            document.getElementById('createUserPopup').style.display = 'flex';

            // Close popup button
            document.getElementById('closePopup').addEventListener('click', () => {
                document.getElementById('createUserPopup').style.display = 'none';
            });

            // Handle form submission
            document.getElementById('createUserForm').addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent form from submitting normally

                const firstname = document.getElementById('firstname').value;
                const lastname = document.getElementById('lastname').value;
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const dob = document.getElementById('dob').value;
                const gender = document.getElementById('gender').value;
                const address = document.getElementById('address').value;
                const password = document.getElementById('password').value;

                try {
                    const response = await fetch('http://localhost:5000/api/users/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        },
                        body: JSON.stringify({ firstname, lastname, username, email, phone, dob, gender, address, password })
                    });

                    if (response.ok) {
                        alert('User created successfully');
                        document.getElementById('createUserPopup').style.display = 'none';
                        document.getElementById('show-users').click();  // Reload user list
                    } else {
                        const error = await response.json();
                        alert(`Error creating user: ${error.msg}`);
                    }
                } catch (error) {
                    console.error('Error creating user:', error);
                }
            });
        } catch (error) {
            console.error('Error loading popup HTML:', error);
        }
    });
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