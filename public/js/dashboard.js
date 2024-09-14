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

            document.getElementById('artist-list').style.display = 'none'
            document.getElementById('song-list').style.display = 'none'
            document.getElementById('user-list').style.display = 'block'

            document.getElementById('show-users').style.background = '#2b2b4f'
            document.getElementById('show-artists').style.background = '#e7e7ff'
            document.getElementById('show-songs').style.background = '#e7e7ff'

            document.getElementById('user-list').innerHTML = 
                users.map(user => `
                    <div>
                        <h2>${user.username}</h2>
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
            
            document.getElementById('user-list').style.display = 'none'
            document.getElementById('song-list').style.display = 'none'
            document.getElementById('artist-list').style.display = 'block'

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
                    <h2>${artist.name} <i>(${artist.songs.length} songs)</i></h2>
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
            const response = await fetch('http://localhost:5000/api/artists', {
                headers: { 'x-auth-token': token }
            });
            const artists = await response.json();

            
            document.getElementById('user-list').style.display = 'none'
            document.getElementById('artist-list').style.display = 'none'
            document.getElementById('song-list').style.display = 'block'

            
            document.getElementById('show-songs').style.background = '#2b2b4f'
            document.getElementById('show-users').style.background = '#e7e7ff'
            document.getElementById('show-artists').style.background = '#e7e7ff'

            document.getElementById('song-list').innerHTML = '';
    
            
    
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
