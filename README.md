# Movie-Cue

Movie-Cue is a MERN stack MVP web application that allows users to create and manage their personal movie watchlist. With JWT-based authentication, users can sign up, log in, and safely manage their account. The app enables users to perform CRUD operations on movies, including storing titles, posters, release years, and their watched status. Additionally, Movie-Cue integrates with the OMDB API for movie searches, letting users easily add new titles to their list and mark them as watched or unwatched.

## Features

- User authentication with JWT (sign-up, log in, log out)
- Search movies or TV series using the OMDB API
- Add movies/series to a personal watchlist
- Mark movies/series as watched or unwatched
- Remove movies/series from the watchlist
- "Surprise Me" feature to suggest a random unwatched movie

## Installation

To run the project locally, follow these steps:

### Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following variables:
   ```env
   MONGODB_URI=<your_mongodb_connection_string>
   SECRET_KEY=<your_secret_key>
   SALT_ROUND=<a_number_between_10_and_12>
   OMDB_API_KEY=<your_omdb_api_key>
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

## Deployment  
You can test the live version of Movie-Cue here:  
🔗 [Movie-Cue Live Demo](https://katsakos-movie-cue.netlify.app/)

> **Note:** On Render.com’s free plan, backend servers go idle after 15 minutes of inactivity. If the app hasn’t been used recently, the first request may take up to one minute to respond.

## Usage

### Pages & Functionality

- **Movie Search:** Users can search for movies/series by title. Results are sorted by relevance and then chronologically. Each result includes title, release year, type (movie/series), rating, plot, and poster. Users can add/remove items from their watchlist.
- **Watchlist:** Displays all saved movies/series. Users can mark items as watched or remove them from the list.
- **Unwatched:** Displays all unwatched movies/series. Includes a "Surprise Me" button that suggests a random unwatched movie, and a "Show All Unwatched" button to revert to the full list.

## Technologies Used

- **Frontend:** React, React Router, Bootstrap, Axios
- **Backend:** Node.js, Express, Mongoose, JWT, Bcrypt, CORS
- **Database:** MongoDB
- **External API:** OMDB API

## Contribution

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.

## License

This project is open-source under the **MIT License**.  
See the [LICENSE](./LICENSE) file for more details.

## Acknowledgments

This project was developed as part of the **Social Hackers Academy Bootcamp**.

🦖
