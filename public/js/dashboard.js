//to delete user
async function deleteUser(userId, username) {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }

    const confirmDelete = confirm(`Are you sure you want to delete the user: ${username}?`);

    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                alert('User deleted');
                // Reload the user list after deletion
                document.getElementById('show-users').click();  // Re-fetch and display updated list
            } else {
                const error = await response.json();
                alert(`Error deleting user: ${error.msg}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    } else {
        // User clicked "Cancel", so do nothing
        alert('Deletion canceled');
    }
}



//to delete artist
async function deleteArtist(artistId, artistName) {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }

    const confirmDelete = confirm(`Are you sure you want to delete the artist: ${artistName}? This will also delete all their songs.`);

    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:5000/api/artists/${artistId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                alert('Artist and related songs deleted');
                // Reload the artist list after deletion
                document.getElementById('show-artists').click();  // Re-fetch and display updated list
            } else {
                const error = await response.json();
                alert(`Error deleting artist: ${error.msg}`);
            }
        } catch (error) {
            console.error('Error deleting artist:', error);
        }
    } else {
        alert('Deletion canceled');
    }
}



//to delete song
async function deleteSong(songId, songTitle) {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }

    const confirmDelete = confirm(`Are you sure you want to delete the song: ${songTitle}?`);

    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:5000/api/songs/${songId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                alert('Song deleted');
                // Reload the song list after deletion
                document.getElementById('show-songs').click();  // Re-fetch and display updated list
            } else {
                const error = await response.json();
                alert(`Error deleting song: ${error.msg}`);
            }
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    } else {
        alert('Deletion canceled');
    }
}



/////////////////////////////////////////////////////////////////////



document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
    }


    // show users
    document.getElementById('show-users').addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                headers: { 'x-auth-token': token }
            });
    
            const users = await response.json();

            document.getElementById('artist-tab').style.display = 'none'
            document.getElementById('song-tab').style.display = 'none'
            document.getElementById('user-tab').style.display = 'block'

            document.getElementById('show-users').classList.add("li-active")
            document.getElementById('show-artists').classList.remove("li-active")
            document.getElementById('show-songs').classList.remove("li-active")

            document.getElementById('user-list').innerHTML = 
                users.map(user => `
                    <div class="info-div">
                        <h2>
                            ${user.username}
                            <span id="deleteUser" class="delete-btn" title="Delete user" onclick="deleteUser('${user._id}', '${user.username}')">🗑️</span>
                        </h2>
                        <span><b>Full Name</b>: ${user.firstname} ${user.lastname}</span>
                        <span><b>Email</b>: ${user.email}</span>
                        <span><b>Phone</b>: ${user.phone}</span>
                        <span><b>Date of Birth</b>: ${user.dob}</span>
                        <span><b>Gender</b>: ${user.gender}</span>
                        <span><b>Address</b>: ${user.address}</span>
                        <span><b>Created At</b>: ${new Date(user.createdAt).toLocaleString()}</span>
                        <span><b>Last updated</b>: ${new Date(user.createdAt).toLocaleString()}</span>
                    </div>`)
                    .join('');
            
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    });
    
    


    // show artists
    document.getElementById('show-artists').addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:5000/api/artists', {
                headers: { 'x-auth-token': token }
            });
            const artists = await response.json();
            
            document.getElementById('user-tab').style.display = 'none'
            document.getElementById('song-tab').style.display = 'none'
            document.getElementById('artist-tab').style.display = 'block'

            document.getElementById('show-artists').classList.add("li-active")
            document.getElementById('show-users').classList.remove("li-active")
            document.getElementById('show-songs').classList.remove("li-active")

            document.getElementById('artist-list').innerHTML = '';
                // To Loop through each artist and their songs
            artists.forEach(artist => {
                // Create a div for each artist
                const artistDiv = document.createElement('div');
                artistDiv.classList.add("info-div");
                const updatedAt = new Date(artist.updatedAt).toLocaleString();
                const createdAt = new Date(artist.createdAt).toLocaleString();
                
                artistDiv.innerHTML = `
                    <h2>
                        ${artist.name} (${artist.songs.length} songs)
                        <span id="deleteArtist" class="delete-btn" title="Delete Artist" onclick="deleteArtist('${artist._id}', '${artist.name}')">🗑️</span>
                    </h2>
                    <span><b>Date of Birth</b>: ${artist.dob}</span>
                    <span><b>Gender</b>: ${artist.gender}</span>
                    <span><b>Address</b>: ${artist.address}</span>
                    <span><b>Debut Year</b>: ${artist.first_release_year}</span>
                    <span><b>Albums Released</b>: ${artist.no_of_albums_released}</span>
                    <span><b>Created at</b>: ${createdAt}</span>
                    <span><b>Last Updated</b>: ${updatedAt}</span>
                    <span><b>Songs</b>:</span>
                `;
    
                // Create a list for songs
                const songList = document.createElement('ul');
                
                if (artist.songs && artist.songs.length > 0) {
                    // List each song with year
                    artist.songs.forEach(song => {
                        const songItem = document.createElement('li');

                        songItem.innerHTML = `
                            ${song.title} <i>(${song.year})</i>
                        `;
                        songList.appendChild(songItem);
                    });
                } else {
                    // If no songs are available, show a message
                    const noSongsItem = document.createElement('li');
                    noSongsItem.textContent = 'No songs available';
                    songList.appendChild(noSongsItem);
                }
    
                // Append the song list to the artist div
                artistDiv.appendChild(songList);
    
                // Append the artist div to the artist-list container
                document.getElementById('artist-list').appendChild(artistDiv);
            });
    
        } catch (error) {
            console.error('Error fetching artists:', error);
        }
    });
    
    


    // show songs
    document.getElementById('show-songs').addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:5000/api/songs', {
                headers: { 'x-auth-token': token }
            });
            const songs = await response.json();

            
            document.getElementById('user-tab').style.display = 'none'
            document.getElementById('artist-tab').style.display = 'none'
            document.getElementById('song-tab').style.display = 'block'

            
            document.getElementById('show-songs').classList.add("li-active")
            document.getElementById('show-users').classList.remove("li-active")
            document.getElementById('show-artists').classList.remove("li-active")

            const songList = document.getElementById('song-list');
            songList.innerHTML = '';
    
            songs.forEach(song => {
                const songItem = document.createElement('div');
                songItem.classList.add("info-div");
                
                songItem.innerHTML = `
                    <h2>
                        ${song.title}
                        <span id="deleteSong" class="delete-btn" title="Delete Song" onclick="deleteSong('${song._id}', '${song.title}')">🗑️</span>
                    </h2>
                    <ul>
                        <li><b>Artist</b>: ${song.artist.name}</li>
                        <li><b>Album</b>: ${song.album}</li>
                        <li><b>Genre</b>: ${song.genre}</li>
                        <li><b>Year</b>: ${song.year}</li>
                        <li><b>Last updated</b>: ${new Date(song.updatedAt).toLocaleString()}</li>
                    </ul>
                `;
                songList.appendChild(songItem);
            });
    
        } catch (error) {
            console.error('Error fetching artists:', error);
        }
    });




    //logout
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});