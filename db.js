// import express from 'express';
// const app = express();
// import mysql from 'mysql';
const express=require("express");
const mysql = require("mysql");

// app.use(express.json());
var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "db1",
});

mysqlConnection.connect((err) => {
   if (!err) {
       console.log("connected to MYSQL");
    } 
   else {
    console.log(err);
    }
})

// app.listen(3000)
// export default mysqlConnection;