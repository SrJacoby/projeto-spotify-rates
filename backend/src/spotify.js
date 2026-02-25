import fetch from "node-fetch"

export async function getSpotifyToken(){
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization":
                "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
        },
        body: "grant_type=client_credentials"
    })

    if(!response.ok){
        console.error("STATUS:", response.status)
        console.error("SPOTIFY RESPONSE:", data)
        throw new Error(data.error_description || "Erro ao autenticar com Spotify")
    }

    return response.json(
}