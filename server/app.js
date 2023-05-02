// this is a javascript file
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// implement dot env to read env variables
require("dotenv").config();

// connect mongodb with mongoose
mongoose
 .connect(process.env.MONGODB_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
 })
 .then(() => {
   console.log("Connected to MongoDB database");
 })
 .catch((err) => console.log(err));

 app.listen(3000, () => {
    console.log("Server is listening on port 3000");
   });

   app.post("/create", async (req, res) => {
    const title = req.body.title;
    const reps = req.body.reps;
    const load = req.body.load;
    const workout = new WorkoutModel({
      title: title,
      reps: reps,
      load: load,
    });
    try {
      await workout.save();
      res.status(201).json({
        message: "Workout created",
        workout,
      });
    } catch (error) {
      console.log(error);
    }
   });