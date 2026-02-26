import express from "express"
import spotifyRoutes from "./routes/spotifyRoutes.js"

const app = express()

app.get("/health", (req, res) => {
    res.json({status: "ok"})
})

app.use("/spotify", spotifyRoutes)

export default app