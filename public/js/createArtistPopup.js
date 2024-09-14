document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }
    
    document.getElementById('openCreateArtistPopup').addEventListener('click', async () => {
        try {
            // Load the popup HTML
            const response = await fetch('createArtistPopup.html');
            const popupHtml = await response.text();
            document.getElementById('popup-container').innerHTML = popupHtml;

            // Show the popup
            document.getElementById('createArtistPopup').style.display = 'flex';

            // Close popup button
            document.getElementById('closePopup').addEventListener('click', () => {
                document.getElementById('createArtistPopup').style.display = 'none';
            });

            // Handle form submission
            document.getElementById('createArtistForm').addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent form from submitting normally

                const name = document.getElementById('artistname').value;

                try {
                    const response = await fetch('http://localhost:5000/api/artists', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        },
                        body: JSON.stringify({ name })
                    });

                    if (response.ok) {
                        alert('User created successfully');
                        document.getElementById('createArtistPopup').style.display = 'none';
                        document.getElementById('show-artists').click();  // Reload user list
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