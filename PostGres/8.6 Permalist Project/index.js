import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "P05tB7ad3$",
  port: 5433,
});
db.connect();

/*
let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
*/

app.get("/", async (req, res) => {
  const load_list = await db.query(
    "SELECT * FROM items ORDER BY id ASC"
  );
  let items = load_list.rows; 
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.query(
      "INSERT INTO items (title) VALUES ($1)",
      [item]
    );
  } catch (err) {
    console.log(err);
  }
  
  // items.push({ title: item });

  res.redirect("/");
});

app.post("/edit",async (req, res) => {
  const item_id = req.body.updatedItemId;
  const new_item = req.body.updatedItemTitle;
  
    try{
      db.query(
        "UPDATE items SET title = $1 WHERE id = $2",
        [new_item, item_id]
      )
      res.redirect("/");
    } catch (err){
      console.log(err);
    }
});

app.post("/delete", (req, res) => {
  const item_id = req.body.deleteItemId;

  try{
    db.query(
      "DELETE FROM items WHERE id = $1",
      [item_id]
    )
    res.redirect("/");
  } catch (err){
    console.log(err);
  }

});
  


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
