import express from "express";
import bodyParser from "body-parser";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
var band_name ="";


app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req, res) => {

  res.sendFile(__dirname + "/public/index.html");

});


function bandname_generator(req,res,next){

  band_name = req.body["street"] + req.body["pet"];
  next();
}

app.use(bandname_generator);

app.post("/submit", (req, res) => {

  res.send(`<h1>Your Band Name is: </h1><h2>${band_name} ✌</h2>`)

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
