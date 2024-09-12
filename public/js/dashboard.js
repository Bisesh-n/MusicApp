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
            document.getElementById('artist-list').innerHTML = ''
            document.getElementById('user-list').innerHTML = 
                users.map(user => `<p>${user.username}</p>`).join('');
            
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
            document.getElementById('user-list').innerHTML = ''
            document.getElementById('artist-list').innerHTML = 
                artists.map(artist => `<p>${artist.name}</p>`).join('');
            
        } catch (error) {
            console.error('Error fetching artists:', error);
        }
    });


    // show songs
    document.getElementById('show-songs').addEventListener('click', async () => {
        const response = await fetch('http://localhost:5000/api/songs', {
            headers: {
                'x-auth-token': token
            }
        });
        const data = await response.json();
        document.getElementById('content').innerHTML = JSON.stringify(data, null, 2);
    });


    //logout
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});
