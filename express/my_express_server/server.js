const express = require("express");

const app = express();

const port = 3000;

app.get("/", function(req, res){
    console.log(req);
    res.send("Hello world");
});

app.get("/contact", function(req, res){
    res.send("Hello, contact me at blagh@blahblah.blaugh");
});

app.get("/about", function(req, res){
    res.send(bio);
})


app.listen(port, function() {
    console.log(`Server started on port ${port}`)
});



const bio = "heyo, this is me bio. I wanna be, the very best, like no one ever was..."