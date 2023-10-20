//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from "express";
import bodyParser from "body-parser";

// get path info //
import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const password_correct = "ILoveProgramming";
var password = "";

// get info from inputs //
app.use(bodyParser.urlencoded({extended:false}));


// launch site 
app.get("/", (req,res)=> {
    res.sendFile(__dirname + "/public/index.html");
})

//post the submit//
app.post("/check", (req, res) => {

    password = req.body["password"];
    if (password == password_correct){
            res.sendFile(__dirname + "/public/secret.html");
        }
        else{
            res.sendFile(__dirname + "/public/index.html");
        }
        });



//show that the server is running
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });





