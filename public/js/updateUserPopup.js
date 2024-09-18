document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }

    // Event listener for dynamically created update buttons
    document.getElementById('user-list').addEventListener('click', async (event) => {
        if (event.target && event.target.classList.contains('updateUser')) {
            const userId = event.target.id.split('_')[1];

            try {
                const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
                    headers: { 'x-auth-token': token }
                });

                const user = await userResponse.json();
                
                // Load the update popup HTML
                const response = await fetch('updateUserPopup.html');
                const popupHtml = await response.text();
                document.getElementById('popup-container').innerHTML = popupHtml;
                
                // Show the update popup
                document.getElementById('updateUserPopup').style.display = 'flex';

                // Close the update popup
                document.getElementById('closePopup').addEventListener('click', () => {
                    document.getElementById('updateUserPopup').style.display = 'none';
                });


                // Populate the popup form with the user's data
                document.getElementById('updateFirstname').value = user.firstname || '';
                document.getElementById('updateLastname').value = user.lastname || '';
                document.getElementById('updateUsername').value = user.username || '';
                document.getElementById('updateEmail').value = user.email || '';
                document.getElementById('updatePhone').value = user.phone || '';
                document.getElementById('updateDob').value = user.dob || '';
                document.getElementById('updateGender').value = user.gender || '';
                document.getElementById('updateAddress').value = user.address || '';
                // document.getElementById('updatePassword').value = user.password || '';
                

                // Handle form submission
                document.getElementById('updateUser').addEventListener('click', async (event) => {
                    event.preventDefault(); // Prevent form from submitting normally

                    const firstname = document.getElementById('updateFirstname').value;
                    const lastname = document.getElementById('updateLastname').value;
                    const username = document.getElementById('updateUsername').value;
                    const email = document.getElementById('updateEmail').value;
                    const phone = document.getElementById('updatePhone').value;
                    const dob = document.getElementById('updateDob').value;
                    const gender = document.getElementById('updateGender').value;
                    const address = document.getElementById('updateAddress').value;
                    // const password = document.getElementById('updatePassword').value;

                    try {
                        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-token': token
                            },
                            body: JSON.stringify({ firstname, lastname, username, email, phone, dob, gender, address })
                        });

                        if (response.ok) {
                            alert('User updated successfully');
                            document.getElementById('updateUserPopup').style.display = 'none';
                            document.getElementById('show-users').click();  // Reload user list
                        } else {
                            const error = await response.json();
                            alert(`Error updating user: ${error.msg}`);
                        }
                    } catch (error) {
                        console.error('Error updating user:', error);
                    }
                });

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    });
});
