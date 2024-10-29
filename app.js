const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB Connection secured!!!");
  })
  .catch((err) => {
    console.log(err);
  });

const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

// app.get('/msg',(req,res)=>{
//     res.status(200).json({msg:"Hello from the server !!!"})
// })

// GET AllUsers

app.get("/users", (req, res) => {
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

//  ADD New User

app.post("/users", (req, res) => {
  //   console.log(req.body);
  const id = users[users.length - 1].id + 1;
  const newUser = Object.assign({ id: id }, req.body);
  users.push(newUser);
  fs.writeFile("./users.json", JSON.stringify(users), "utf-8", (err) => {
    res.status(201).json({
      status: "success",
      message: "User Added !!!",
    });
  });
});
