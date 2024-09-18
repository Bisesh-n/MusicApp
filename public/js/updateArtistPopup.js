document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }

    // Event listener for dynamically created update buttons
    document.getElementById('artist-list').addEventListener('click', async (event) => {
        if (event.target && event.target.classList.contains('updateArtist')) {
            const artistId = event.target.id.split('_')[1];

            try {
                const artistResponse = await fetch(`http://localhost:5000/api/artists/${artistId}`, {
                    headers: { 'x-auth-token': token }
                });

                const artist = await artistResponse.json();
                
                // Load the update popup HTML
                const response = await fetch('updateArtistPopup.html');
                const popupHtml = await response.text();
                document.getElementById('popup-container').innerHTML = popupHtml;
                
                // Show the update popup
                document.getElementById('updateArtistPopup').style.display = 'flex';

                // Close the update popup
                document.getElementById('closePopup').addEventListener('click', () => {
                    document.getElementById('updateArtistPopup').style.display = 'none';
                });


                // Populate the popup form with the artist's data
                document.getElementById('updateArtistName').value = artist.name || '';
                document.getElementById('UpdateArtistDob').value = artist.dob || '';
                document.getElementById('UpdateArtistGender').value = artist.gender || '';
                document.getElementById('UpdateArtistAddress').value = artist.address || '';
                document.getElementById('UpdateArtistDebut').value = artist.first_release_year || '';
                document.getElementById('UpdateArtistAlbums').value = artist.no_of_albums_released || '';
                

                // Handle form submission
                document.getElementById('updateArtist').addEventListener('click', async (event) => {
                    event.preventDefault(); 

                    const name = document.getElementById('updateArtistName').value;
                    const dob = document.getElementById('UpdateArtistDob').value;
                    const gender = document.getElementById('UpdateArtistGender').value;
                    const address = document.getElementById('UpdateArtistAddress').value;
                    const first_release_year = document.getElementById('UpdateArtistDebut').value;
                    const no_of_albums_released = document.getElementById('UpdateArtistAlbums').value;

                    try {
                        const response = await fetch(`http://localhost:5000/api/artists/${artistId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-token': token
                            },
                            body: JSON.stringify({ name, dob, gender, address, first_release_year, no_of_albums_released })
                        });

                        if (response.ok) {
                            alert('Artist updated successfully');
                            document.getElementById('updateArtistPopup').style.display = 'none';
                            document.getElementById('show-artists').click();  // Reload user list
                        } else {
                            const error = await response.json();
                            alert(`Error updating artist: ${error.msg}`);
                        }
                    } catch (error) {
                        console.error('Error updating artist:', error);
                    }
                });

            } catch (error) {
                console.error('Error fetching artist data:', error);
            }
        }
    });
});
