document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }

    // Event listener for dynamically created update buttons
    document.getElementById('song-list').addEventListener('click', async (event) => {
        if (event.target && event.target.classList.contains('updateSong')) {
            const songId = event.target.id.split('_')[1];

            try {
                const songResponse = await fetch(`http://localhost:5000/api/songs/${songId}`, {
                    headers: { 'x-auth-token': token }
                });

                const song = await songResponse.json();
                
                // Load the update popup HTML
                const response = await fetch('updateSongPopup.html');
                const popupHtml = await response.text();
                document.getElementById('popup-container').innerHTML = popupHtml;
                
                // Show the update popup
                document.getElementById('updateSongPopup').style.display = 'flex';

                // Close the update popup
                document.getElementById('closePopup').addEventListener('click', () => {
                    document.getElementById('updateSongPopup').style.display = 'none';
                });


                // Populate the popup form with the song's data
                document.getElementById('updateTitle').value = song.title || '';
                document.getElementById('updateAlbum').value = song.album || '';
                document.getElementById('updateYear').value = song.year || '';
                document.getElementById('updateGenre').value = song.genre || '';

               
                // Fetch all artists for the artist dropdown
                const artistResponse = await fetch('http://localhost:5000/api/artists', {
                    headers: { 'x-auth-token': token }
                });
                
                const artists = await artistResponse.json();
                const artistSelect = document.getElementById('updateArtist');
                
                artists.forEach(artist => {
                    const option = document.createElement('option');
                    option.value = artist._id;
                    option.text = artist.name;
                    if (artist._id === song.artist._id) {
                        option.selected = true; // Set the current artist as selected
                    }
                    artistSelect.appendChild(option);
                });
                

                // Handle form submission
                document.getElementById('updateSong').addEventListener('click', async (event) => {
                    event.preventDefault(); 

                    const title = document.getElementById('updateTitle').value;
                    const album = document.getElementById('updateAlbum').value;
                    const year = document.getElementById('updateYear').value;
                    const genre = document.getElementById('updateGenre').value;
                    const artist = document.getElementById('updateArtist').value;

                    try {
                        const response = await fetch(`http://localhost:5000/api/songs/${songId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-token': token
                            },
                            body: JSON.stringify({ title, album, year, genre, artist })
                        });

                        if (response.ok) {
                            alert('Song updated successfully');
                            document.getElementById('updateSongPopup').style.display = 'none';
                            document.getElementById('show-songs').click();  // Reload user list
                        } else {
                            const error = await response.json();
                            alert(`Error updating song: ${error.msg}`);
                        }
                    } catch (error) {
                        console.error('Error updating song:', error);
                    }
                });

            } catch (error) {
                console.error('Error fetching artist song:', error);
            }
        }
    });
});
