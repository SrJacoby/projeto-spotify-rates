import { Router } from "express";
import { getSpotifyLoginURL, exchangeCodeForToken, searchSpotify, getAlbumById, getTrackById, getCurrentUser } from "../services/spotifyService.js";

const router = Router()

//Login
router.get("/login", (req, res) => {
    res.redirect(getSpotifyLoginURL())
})

//Callback
router.get("/callback", async(req, res) => {
    const {code} = req.query

    try{
        await exchangeCodeForToken(code)
        res.send("Autenticado com sucesso! Feche essa aba.")
    }catch(error){
        res.status(500).send(error.message)
    }
})

//Pesquisa
router.get("/search", async(req, res) => {
    try{
        const {q, type} = req.query

        if(!q) {
            return res
                .status(400)
                .json({error: "Parâmetro 'q' é obrigatório"})
        }

        const data = await searchSpotify(q, type)
        res.json(data)
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

//Álbum
router.get("/album/:id", async (req, res) => {
    try{
        const album = await getAlbumById(req.params.id)
        res.json(album)
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

//Música
router.get("/track/:id", async(req, res) => {
    try{
        const track = await getTrackById(req.params.id)
        res.json(track)
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

router.get("/me", async (req, res) => {
    try {
        const user = await getCurrentUser()
        res.json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router