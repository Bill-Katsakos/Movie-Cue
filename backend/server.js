const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors"); 
const axios = require("axios");

const authMiddleware = require("./middleware/auth");

const port = process.env.PORT || 4000;
const app = express();
const URI = process.env.MONGODB_URI;
const saltsRound = Number(process.env.SALT_ROUND);

// middleware / parser
app.use(express.json());
app.use(cors());

// connection
main()
  .then(() => console.log("DB is connected successfully"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(URI);
}

// User schema

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

// User Model
const User = mongoose.model("User", userSchema);

// ___________Movies schema_________
const movieSchema = new mongoose.Schema({
    title: String,
    year: String,
    type: String,
    imdbRating: String,
    plot: String,
    poster: String,
    imdbID: String,  
    watched: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });
  

// Movie Model
const Movie = mongoose.model("Movie", movieSchema);

// app.get("/testRoute", authMiddleware, (req, res) => {
//   let userId = req.user.userId;
//   let user = req.user
//   console.log(user);
//   console.log(userId);
  
// });


//  // Test 2
// app.get("/testRoute", authMiddleware, async (req, res) => {
//     let userId = req.user.userId;
//     let user = req.user
//     console.log(user);
//     console.log(userId);
//         try {
//         //   const users = await User.find();
//           res.status(200).json({msg:"Here is the user:", user });
//       } catch (error) {
//           res
//               .status(500)
//               .json({ msg: "Cannot retrieve users", error: error.message });
//       }
//   });

// _________Users Route ________
// get all Users

// const getAllUsers = async (req, res) => {
//     try {
//       let allUsers = await User.find()
//       res.send(allUsers);
//     } catch (error) {
//       res.send(error);
//     }
//   };
  
//   app.get("/users", getAllUsers); 


// _________Movies Route ________

// get all Movies

// const getAllMovies = async (req, res) => {
//   try {
//     let allMovies = await Movie.find().populate("user", "-password");
//     res.send(allMovies);
//   } catch (error) {
//     res.send(error);
//   }
// };

// app.get("/movies", getAllMovies); 

// __________Create a Movie________
const createMovie = async (req, res) => {
    try {
      let userId = req.user.userId;
      const { title, year, type, imdbRating, plot, poster, imdbID } = req.body;
  
      // Check if it already exists
      const existingMovie = await Movie.findOne({ user: userId, imdbID });
      if (existingMovie) {
        return res.status(400).json({
          msg: "The film is already on your watch list.",
        });
      }
  
      let createdMovie = await Movie.create({
        title,
        year,
        type,
        imdbRating,
        plot,
        poster,
        imdbID,
        user: userId,
      });
  
      res.send({ msg: "A movie is been added successfully", createdMovie });
    } catch (error) {
      res.send(error);
    }
  };
  
app.post("/movies/create", authMiddleware, createMovie);

// _________Get specific user Movies_________
app.get("/movies/user", authMiddleware, async (req, res) => {
  try {
    let userId = req.user.userId;
    let userMovies = await Movie.find({ user: userId });
    return res.send(userMovies);
  } catch (error) {
    res.send(error);
  }
});

// __________Delete a users Movie________
const deleteMovie = async (req, res) => {
    try {
      const { movieId } = req.body;
      if (!movieId)
        return res.status(400).json({ msg: "Please provide the movie ID." });
  
      // Find the movie by its ID
      const movie = await Movie.findById(movieId);
      if (!movie)
        return res.status(404).json({ msg: "Movie not found." });
  
      // Check if the current user is the creator of the movie
      if (movie.user.toString() !== req.user.userId)
        return res.status(403).json({ msg: "You are not authorized to delete this movie." });
  
      // Delete the movie
      await Movie.findByIdAndDelete(movieId);
      return res.status(200).json({ msg: "Movie successfully deleted." });
    } catch (error) {
      return res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  
  app.delete("/movies/delete", authMiddleware, deleteMovie);
  
  // __________Update a users Movie________
const updateMovie = async (req, res) => {
  try {
    // Retrieve the movie by its ID from the request body
    const movie = await Movie.findById(req.body.movieId);
    if (!movie)
      return res.status(404).json({ msg: "Movie not found." });
    
    // Check if the current user is the creator of the movie
    if (movie.user.toString() !== req.user.userId)
      return res.status(403).json({ msg: "You are not authorized to update this movie." });
    
    // Update the movie using the request body data
    const updatedMovie = await Movie.findByIdAndUpdate(req.body.movieId, req.body, { new: true });
    
    return res.status(200).json({ msg: "Movie successfully updated.", updatedMovie });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};
  
  app.put("/movies/update", authMiddleware, updateMovie);  
  
  
// _________________API_________________
app.get("/api/omdb", async (req, res) => {
    try {
        const apiKey = process.env.OMDB_API_KEY;
        const { s, i, plot } = req.query;
        let omdbUrl = `http://www.omdbapi.com/?apikey=${apiKey}`;
        if (s) omdbUrl += `&s=${s}`;
        if (i) omdbUrl += `&i=${i}`;
        if (plot) omdbUrl += `&plot=${plot}`;
        const response = await axios.get(omdbUrl);
        res.json(response.data);
    } catch (error) {
        console.error("OMDB API Error:", error);
        res.status(500).json({ error: "Failed to fetch data from OMDB API" });
    }
});


// _________________Register Route_________________

const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.send({ msg: "All fields are required" });
    }
    let isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.send({
        msg: "User already exists. Please login, Or register with new email",
      });
    }

    let hashedPassword = await bcrypt.hash(password, saltsRound);
    await User.create({ email, username, password: hashedPassword });
    return res.send({ msg: "Registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

app.post("/user/register", registerUser);

// ______________Login____________

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    let oldRegisteredUser = await User.findOne({ email });
    if (!oldRegisteredUser) {
      return res.status(404).json({ msg: "User not found, please register first." });
    }
    let isPasswordCorrect = await bcrypt.compare(
      password,
      oldRegisteredUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Wrong password." });
    }
    let payload = {
      userId: oldRegisteredUser._id,
      email: oldRegisteredUser.email,
      username: oldRegisteredUser.username,
    };
    let token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "10h",
    });
    return res.status(200).json({ msg: "Login Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


app.post("/user/login", loginUser);

app.listen(port, () => console.log(`Server is start listening on port ${port}`));
// 🦖