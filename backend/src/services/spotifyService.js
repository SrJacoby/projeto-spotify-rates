import fetch from "node-fetch"

let spotifyToken = null
let tokenExpireAt = null

export async function getSpotifyToken(){
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

    if(spotifyToken && tokenExpireAt > Date.now()){
        return spotifyToken
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization":
                "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
        },
        body: "grant_type=client_credentials"
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(
            data.error_description || "Erro ao autenticar com Spotify"
        )
    }

    spotifyToken = data.access_token
    tokenExpireAt = Date.now() + data.expires_in * 1000

    return spotifyToken

}

//Função de busca

export async function searchSpotify(query, type = "track,album") {
    const token = await getSpotifyToken()

    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        }
    )

    const text = await response.text()

    if (!response.ok) {
        console.error("SPOTIFY SEARCH ERROR:", text)
        throw new Error(text)
    }

    return JSON.parse(text)
}

//Detalhes - Álbum

export async function getAlbumById(id){
    const token = await getSpotifyToken()

    const response = await fetch(
        `https://api.spotify.com/v1/albums/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            },
        }
    )

    const text = await response.text()

    if (!response.ok) {
        console.error("SPOTIFY ERROR:", text)
        throw new Error(text)
    }

    return JSON.parse(text)
}

//Detalhes - Música
export async function getTrackById(id){
    const token = await getSpotifyToken()

    const response = await fetch(
        `https://api.spotify.com/v1/tracks/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            },
        }
    )

    const text = await response.text()

    if (!response.ok) {
        console.error("SPOTIFY ERROR:", text)
        throw new Error(text)
    }

    return JSON.parse(text)
}
