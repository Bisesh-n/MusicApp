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
            document.getElementById('user-list').style.display = 'block'
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
            const response = await fetch('http://localhost:5000/api/artists/', {
                headers: { 'x-auth-token': token }
            });
    
            const artists = await response.json();
            document.getElementById('user-list').style.display = 'none'
            document.getElementById('artist-list').style.display = 'block'
            document.getElementById('artist-list').innerHTML = 
                artists.map(artist => `
                    <div>
                        <h2>${artist.name}</h2>
                        <span><b>Id</b>: ${artist._id}</span>
                    </div>`)
                    .join('');
            
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
