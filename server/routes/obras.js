const express = require("express");
const router = express.Router();

const Artist = require("../models/Artist")

router.get("/obras", (req, res) => {
 Artist.find()
    .then(data=>res.json(data))
    .catch(err=>console.log(err))
   
} )
// router.post("/postobra", (req, res)=>{  
//  Artist.find()
//    .then(data =>  res.json(dasta[0].obras.push("data")))
//    .catch(err=>console.log(err))
// })


 router.get("/artist-profile/:id", (req, res) => {
     Obra.find({ author: req.params.id})
     .populate("author")
     .then(data=>console.log(data))
     .catch(err=>console.log(err))
 })
 



module.exports = router;