import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {

  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  var f_name = req.body["fName"];
  var l_name = req.body["lName"];  

  var name_length = f_name.length + l_name.length;
 
  res.render("index.ejs", {name_chars: name_length});  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
