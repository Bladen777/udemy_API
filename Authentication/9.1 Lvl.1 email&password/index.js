import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"secrets",
  password:"P05tB7ad3$",
  port:5433,
});

db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});


async function user_check(user_name){

  const user_scan = await db.query(
    "SELECT * FROM users WHERE email =$1",
    [user_name]
  );

  console.log(
    "amount of users with this email: ", user_scan.rows.length, "\n",
  );
  return user_scan.rows.length;
}


app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try{
    let user_exists = await user_check(username);

    if (user_exists === 0){
      const add_user = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [username, password]
      );
      console.log("The result of add_user: ", add_user);
      res.render("secrets.ejs");
    } else {
      res.send("email already exists, try logging in instead.")
    };
  } catch(err){
    console.log("the error in post /register: ", err);
  };

});

app.post("/login", async (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];
  console.log("username: ", username, "\n",
              "password: ", password,   
  );

  try{
  let user_exists = await user_check(username);

  if (user_exists === 0){
    res.send("email is not registered");
  } else  {
    const password_match = await db.query(
      "SELECT password FROM users WHERE email = $1",
      [username]
    );
    let password_result = password_match.rows[0].password;
    console.log("result of password check: ", password_result);
    if (password_result === password){
      console.log("the passwords matched");
      res.render("secrets.ejs");
    } else {
      res.send("the password for this email is incorrect")
    }; 
  };
} catch(err){
  console.log("the error in post /login: ", err);
};
  

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
