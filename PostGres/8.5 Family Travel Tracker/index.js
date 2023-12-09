import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3001;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "P05tB7ad3$",
  port: 5433,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let current_user_id = 1;

//storing database information into a array
async function update_users(){
const user_info = await db.query(
  "SELECT * FROM users"
  );
//update "users" array
let users = user_info.rows;
console.log("users: ", users);
return users;
}
let users = await update_users();

//check if a country is visited
async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1;",
  [current_user_id]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

//load base page
app.get("/", async (req, res) => {
  let users = await update_users();
  let current_user = users.find((user) => user.id == current_user_id);
  console.log("GET_current_user: ", current_user);
  const countries = await checkVisisted();
  console.log("countries: ", countries);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: current_user.color,
  });
});

//Add countries to user
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      let current_user = users.find((user) => user.id == current_user_id);
      console.log("ADD_current_user: ", current_user);
      await db.query(
        "INSERT INTO visited_countries (country_code,user_id) VALUES ($1,$2)",
        [countryCode,current_user.id]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

//disply the information of user user based on selected tab
app.post("/user", async (req, res) => {

  //process if "Add Family Member" tab is selected
  if (req.body["add"] === "new"){
  res.render("new.ejs");
  } else{

    //find user id
    current_user_id = req.body["user"];
    console.log("current_user_id: ", current_user_id);

    res.redirect("/");
  }
});

//add new user information
app.post("/new", async (req, res) => {
  //collect user selection
  const new_user_name = req.body["name"];
  const new_user_color = req.body["color"];

  console.log("users:", users,"\n",
              "new_user_name:", new_user_name, "\n",
              users.find((user) => user.name == new_user_name)
              );

  //prevent user from entering name again
  if (users.find((user) => user.name == new_user_name )){
      console.log("You aleady have a profile");
      res.render("new.ejs",{
        name_message:"You already have a profile",
      });
   
  //prevent user from selecting a already chosen color  
  } else if(users.find((user) => user.color == new_user_color )){
    console.log("Color aleady picked, please select a different color");
    res.render("new.ejs",{
      name_message:"Choose a different color",
    });
 
  }else{
    //add new user to database
    const new_user_data = await db.query(
      "INSERT INTO users(name, color ) VALUES($1, $2) RETURNING id;",
      [new_user_name, new_user_color]
      );
    const current_user_id = new_user_data.rows[0];
    console.log("current_user: ", current_user_id);  
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
