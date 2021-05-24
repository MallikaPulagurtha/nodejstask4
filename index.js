const express = require("express");
const cors = require("cors");
let DB = "studentMentor";

const mongodb = require("mongodb");
const URL = "mongodb://localhost:27017";

const app = express();
app.use(cors());
app.use(express.json());

let students = [];
let mentors = [];

// API to create student
app.post("/student", async (req, res) => {
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    await db.collection("student").insertOne(req.body);
    await db.collection("mentor").updateOne({ _id: mongodb.ObjectID(req.params.id) }, { $set: req.body });
    await connection.close();
    res.json({
        message: "Student Created"
    })
});

// API to create mentor
app.post("/mentor", async (req, res) => {
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    await db.collection("mentor").insertOne(req.body);
    await connection.close();
    res.json({
        message: "mentor Created"
    })
});

//Assign student to mentor
app.put("/mentor/:id", async (req, res) => {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        await db.collection("mentor").updateOne({ _id: mongodb.ObjectID(req.params.id) }, { $push: req.body });
        connection.close();
        res.send({ message: "students added" });
    } catch (error) {
        console.log(error);
    }
})

//Assign mentor to Student
app.put("/student/:id", async (req, res) => {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        await db.collection("student").updateOne({ _id: mongodb.ObjectID(req.params.id) }, { $set: req.body });
        connection.close();
        res.send({ message: "students added" });
    } catch (error) {
        console.log(error);
    }
})

//Show all students of particular mentor
app.get("/mentor/:id", async (req, res) => {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let ment = await db.collection("mentor").findOne({ _id: mongodb.ObjectID(req.params.id) }, { $set: req.body });
        await connection.close();
        res.json(ment.students);
    } catch (error) {
        console.log(error);
    }
})

//displaying all the students
app.get("/student", async (req, res) => {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let stud = await db.collection("student").find().toArray();
        await connection.close();
        res.json(stud);
    } catch (error) {
        console.log(error);
    }
})

//displaying all the mentors
app.get("/mentor", async (req, res) => {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let ment = await db.collection("mentor").find().toArray();
        await connection.close();
        res.json(ment);
    } catch (error) {
        console.log(error);
    }
})

app.listen(3002);
