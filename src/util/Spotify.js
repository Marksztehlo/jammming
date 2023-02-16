const ClientID = '05b06d7c81f042848d5825a71ee0aec4';
const redirectUri = 'http://localhost:3000/';
let accessToken = '';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresTokenMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresTokenMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresTokenMatch[1]);

      // Wipe out parameters so allowing to require new token is the old one expired
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${ClientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
    }
  },

  // Pass search term to spotyfy and receive data from the api
  async search(term) {
    const accessToken = this.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const jsonResponse = await response.json();
    if (!jsonResponse) {
      return [];
    }
    return jsonResponse.tracks.items.map(track => ({
      track: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
      id: track.id
    }));
  },

  // Save the tracks to a new playlist in spotify
  savePlaylist(nameOfPlaylist, trackUris) {
    if (!nameOfPlaylist || !trackUris) {
      return;
    }

    const accessToken = this.getAccessToken();
    let headers = { Authorization: `Bearer ${accessToken}` };
    let userID;

    return fetch('https://api.spotify.com/v1/me', { headers: headers })
      .then(response => response.json())
      .then(jsonResponse => {
        userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
          {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: nameOfPlaylist })
          })
          .then(response => response.json())
          .then(jsonResponse => {
            const playlistID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
              {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris })
              })
          })
      })
  }
}



export default Spotify;