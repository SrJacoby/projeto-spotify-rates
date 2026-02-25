import dotenv from "dotenv"
import express from "express"
import { getSpotifyToken } from "./server.js"

dotenv.config()

const app = express()

app.get("/health", (req, res) => {
    res.json({status: "ok"})
})

app.get("/spotify/test", async(req, res) => {
    try{
        const data = await getSpotifyToken()

        res.json({
            success: true,
            token_type: data.token_type,
            expires_in: data.expires_in
        })
    } catch(error){
        res.status(500).json({
            sucess: false,
            error: error.message
        })
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})