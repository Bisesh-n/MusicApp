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

            document.getElementById('show-users').style.background = '#2b2b4f'
            document.getElementById('show-artists').style.background = '#e7e7ff'
            document.getElementById('show-songs').style.background = '#e7e7ff'

            document.getElementById('user-list').innerHTML = 
                users.map(user => `
                    <div>
                        <h2>
                            ${user.username}
                            <button id="deleteUser" class="danger" onclick="deleteUser('${user._id}', '${user.username}')">Delete</button>
                        </h2>
                        <span><b>Full Name</b>: ${user.firstname} ${user.lastname}</span>
                        <span><b>Email</b>: ${user.email}</span>
                        <span><b>Created At</b>: ${new Date(user.createdAt).toLocaleString()}</span>
                        <span><b>Updated At</b>: ${new Date(user.createdAt).toLocaleString()}</span>
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

            document.getElementById('show-artists').style.background = '#2b2b4f'
            document.getElementById('show-users').style.background = '#e7e7ff'
            document.getElementById('show-songs').style.background = '#e7e7ff'

            document.getElementById('artist-list').innerHTML = '';
                // To Loop through each artist and their songs
            artists.forEach(artist => {
                // Create a div for each artist
                const artistDiv = document.createElement('div');
                const updatedAt = new Date(artist.updatedAt).toLocaleString();
                
                artistDiv.innerHTML = `
                    <h2>
                        ${artist.name} (${artist.songs.length} songs)
                        <button id="deleteArtist" class="danger" onclick="deleteArtist('${artist._id}', '${artist.name}')">Delete</button>
                    </h2>
                    <span>Last Updated: ${updatedAt}</span>
                `;
    
                // Create a list for songs
                const songList = document.createElement('ul');
                
                if (artist.songs && artist.songs.length > 0) {
                    // List each song with timestamps
                    artist.songs.forEach(song => {
                        const songItem = document.createElement('li');

                        songItem.innerHTML = `
                            ${song.title}, <i>(${song.year})</i>
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

            
            document.getElementById('show-songs').style.background = '#2b2b4f'
            document.getElementById('show-users').style.background = '#e7e7ff'
            document.getElementById('show-artists').style.background = '#e7e7ff'

            const songList = document.getElementById('song-list');
            songList.innerHTML = '';
    
            songs.forEach(song => {
                const songItem = document.createElement('div');
                songItem.innerHTML = `
                    <h2>
                        ${song.title}
                        <button id="deleteSong" class="danger" onclick="deleteSong('${song._id}', '${song.title}')">Delete</button>
                    </h2>
                    <ul>
                        <li>By: ${song.artist.name}</li>
                        <li>Album: ${song.album}</li>
                        <li>Genre: ${song.genre}</li>
                        <li>Year: ${song.year}</li>
                        <li>Last updated: ${new Date(song.updatedAt).toLocaleString()}</li>
                    </ul>
                `;
                songList.appendChild(songItem);
            });
    
        } catch (error) {
            console.error('Error fetching artists:', error);
        }
    });




    //to delete user
    async function deleteUser(userId) {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
    
            if (response.ok) {
                alert('User deleted');
                // loadUsers();
            } else {
                const error = await response.json();
                alert(`Error deleting user: ${error.msg}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }




    //logout
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});
