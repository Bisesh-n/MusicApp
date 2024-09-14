document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }


    const openPopupButton = document.getElementById('openCreateSongPopup');
    const popupContainer = document.getElementById('popup-container');

    // Function to load and display the popup
    const loadPopup = async () => {
        try {
            // Load the popup HTML
            const response = await fetch('createSongPopup.html');
            const popupHtml = await response.text();
            popupContainer.innerHTML = popupHtml;

            // Show the popup
            document.getElementById('createSongPopup').style.display = 'flex';

            // Close popup button
            document.getElementById('closeSongPopup').addEventListener('click', () => {
                document.getElementById('createSongPopup').style.display = 'none';
            });

            // Load available artists
            const artistResponse = await fetch('http://localhost:5000/api/artists', {
                headers: { 'x-auth-token': token }
            });
            const artists = await artistResponse.json();
            const artistSelect = document.getElementById('artist');

            artistSelect.innerHTML = artists.map(artist => 
                `<option value="${artist._id}">${artist.name}</option>`
            ).join('');

            // Handle form submission
            document.getElementById('createSongForm').addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent form from submitting normally

                const title = document.getElementById('title').value;
                const album = document.getElementById('album').value;
                const year = document.getElementById('year').value;
                const genre = document.getElementById('genre').value;
                const artist = document.getElementById('artist').value;

                try {
                    const response = await fetch('http://localhost:5000/api/songs', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token // Ensure you have token available here
                        },
                        body: JSON.stringify({ title, album, year, genre, artist })
                    });

                    if (response.ok) {
                        alert('Song created successfully');
                        document.getElementById('createSongPopup').style.display = 'none';
                        document.getElementById('show-songs').click();  // Reload song list
                    } else {
                        const error = await response.json();
                        alert(`Error creating song: ${error.msg}`);
                    }
                } catch (error) {
                    console.error('Error creating song:', error);
                }
            });
        } catch (error) {
            console.error('Error loading popup HTML:', error);
        }
    };

    // Event listener for opening the popup
    openPopupButton.addEventListener('click', loadPopup);
});
