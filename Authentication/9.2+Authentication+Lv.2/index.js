import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3001;
const salt_rounds = 10;

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"secrets",
  password:"P05tB7ad3$",
  port:5433,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //Password Hashing
      bcrypt.hash(password, salt_rounds, async (err, hash) =>{
        if (err){
          console.log("Errir hashing password: ", err);
        }
    
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, hash]
      );
      console.log(result);
      res.render("secrets.ejs");
    });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const login_password = req.body.password;



  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const stored_hash_password = user.password;

      //Password Comparison
      bcrypt.compare(login_password, stored_hash_password, (err,result)=>{
        if(err){
          console.log("Error comparing passwords: ", err);
        } else {
          if (result){
            res.render("secrets.ejs");
          } else {
            res.send("Incorrect Password");
          };
        };
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
