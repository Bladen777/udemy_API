import express from "express";

const app = express();
const port = 3000;


//start thr middleware
app.get("/", (req,res) => {

// get day
// const d = new Date();
// let day = d.getDay();
let day = 6;


//define the content
const txt_weekday = "work hard";
const txt_weekend = "have fun";
var txt_content = "";
var txt_day ="";

//determine the day

if (day==0 || day===6){
    txt_day="weekend";
    txt_content=txt_weekend;
}

else{
    txt_day="weekday";
    txt_content=txt_weekday;
}
//push the info
res.render("index.ejs",{
    day_type:txt_day,
    advice:txt_content,

});
});


// confirm port is working 
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });
  