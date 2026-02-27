import fetch from "node-fetch"

let accessToken = null
let refreshToken = null
let tokenExpireAt = null

//URL de login

export function getSpotifyLoginURL(){
    const scope = "user-read-private user-read-email"

    return `https://accounts.spotify.com/authorize?` +
        new URLSearchParams({
            response_type: "code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI
        }).toString()
}

//Trocar code por token

export async function exchangeCodeForToken(code) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"),
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(JSON.stringify(data))
    }

    accessToken = data.access_token
    refreshToken = data.refresh_token
    tokenExpireAt = Date.now() + data.expires_in * 1000
}

//Refresh automático

async function refreshAcessToken(){
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"),
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    })

    const data = await response.json()

    accessToken = data.access_token
    tokenExpireAt = Date.now() + data.expires_in * 1000
}

async function getValidToken(){
    if(!accessToken){
        throw new Error("Usuário não autenticado")
    }

    if(Date.now() > tokenExpireAt){
        await refreshAcessToken()
    }

    return accessToken
}

//Função genérica

async function spotifyFetch(url){
    const token = await getValidToken()

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const text = await response.text()

    if(!response.ok){
        throw new Error(text)
    }

    return JSON.parse(text)
}

//Função de busca

export async function searchSpotify(query, type = "track,album") {
    return spotifyFetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`
    )
}

//Detalhes - Álbum

export async function getAlbumById(id){
    return spotifyFetch(
        `https://api.spotify.com/v1/albums/${id}`
    )
}

//Detalhes - Música
export async function getTrackById(id){
    return spotifyFetch(
        `https://api.spotify.com/v1/tracks/${id}`
    )
}

export async function getCurrentUser() {
    return spotifyFetch("https://api.spotify.com/v1/me")
}