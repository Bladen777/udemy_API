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
  port: 5433
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// function to check the visited_countries to prevent duplication
async function check_visited(){

  // store connecting to target database column in a variable
  const data = await db.query("SELECT country_code FROM visited_countries");

  //refresh the "countries" array
  let countries = [];

  // access the rows of the chosen column
    // use ".forEach" with a arrow function and store the current value in "country"
  data.rows.forEach((country) => {
    // for each row "push" the value into the "countries" array
    countries.push(country.country_code);
  });

  //  return the value of "countries" when called
  return countries;
}


app.get("/", async (req, res) => {
  //call the function to extract values
    const countries = await check_visited();

  // console log the data in the data base for comparison checking

  console.log("countries: ", countries);

  // respond with the EJS data needed to colour the chosen countries
  res.render("index.ejs", {
    countries: countries,
    total: countries.length
  });
});

app.post("/add", async(req, res)=>{

  // store user input into a variable
  const input = req.body.country;
  console.log("input: ", input);

  // check for multiple valid inputs, and if country exists
  try{
    const add_country = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
      );
      const add_country_code = add_country.rows[0].country_code;

    console.log(
      "add_country.rows: ",
      add_country.rows, '\n',
      "add_country.rowCount",
      add_country.rowCount, 
      );

    async function dup_chk(add_country_code){  
      //check for duplicates
      const duplicate_id = await db.query(
        "SELECT country_code FROM visited_countries WHERE LOWER(country_code) = $1 ",
        [add_country_code.toLowerCase()]
      );
      
      console.log(
        "duplicate_id.rowCount: ",
        duplicate_id.rowCount, "\n",
        "add_country_code: ",
        add_country_code
      );

      if (duplicate_id.rowCount !== 0){
        const countries = await check_visited();
        res.render("index.ejs",{
          countries: countries,
          total: countries.length,
          error: "Country already added, please add a different country, like come on."
        });
      }else{
        // insert value into database
        await db.query(
          "INSERT INTO visited_countries(country_code) VALUES($1);",
          [add_country_code]
          );
    
        //if no errors, redirect the page
        res.redirect("/");
      };
    }

    if(add_country.rowCount > 1){
      //try to see if input exactly matches a value
      try{
        // convert country into country code
        const add_country_chk = await db.query(
          "SELECT country_code FROM countries WHERE LOWER(country_name)=$1;",
          [input.toLowerCase()]
          );
          const add_country_code = add_country_chk.rows[0].country_code;
    
          dup_chk(add_country_code);
         

      }catch(err){
        const countries = await check_visited();
        res.render("index.ejs",{
          countries: countries,
          total: countries.length,
          error: "Please be more specific with your country name"
        });
      }
    }else if (add_country.rowCount = 1){
            //try if country is a duplicate
              dup_chk(add_country_code);
    };
  //Error if country doesn't exist
  }catch (err){
    console.log(err);
    const countries = await check_visited();
    res.render("index.ejs",{
      countries: countries,
      total: countries.length,
      error: "Country doesn't exist, please try again."
    });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
