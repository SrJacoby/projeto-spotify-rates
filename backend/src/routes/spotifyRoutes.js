import { Router } from "express";
import { searchSpotify, getAlbumById, getTrackById } from "../services/spotifyService.js";

const router = Router()

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

export default router