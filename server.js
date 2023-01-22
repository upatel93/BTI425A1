const express = require("express");
const cors = require("cors");
const { response } = require("express");
const dotenv = require("dotenv").config();


//Code in next two line is supplied by Prof. S. Shariatmadari
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;
const app = express();
app.use(cors()); 
app.use(express.json());



app.get("/",(request,response)=>{
    response.json({ message: "API Listening" });
});

//Code in next Function is supplied by Prof. S. Shariatmadari
db.initialize(process.env.MONGODB_CONN_STRING)
.then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
})
.catch((err)=>{
    console.log(err);
});

//Routes for the Assigmment

/* POST /api/movies
This route uses the body of the request to add a new "Movie"
document to the collection and return the newly created movie
object / fail message to the client. 
*/

app.post("/api/movies",(request,response)=>{
    db.addNewMovie(request.body)
    .then((newMovie)=>{
        console.log(newMovie); // For Debugging Purpose
        response.status(201).json(newMovie);
    })
    .catch((error)=>{
        console.log(error); // For Debugging Purpose
        response.status(500).json({message:error.message});
    })

});

/*
GET /api/movies
This route must accept the numeric query parameters "page" 
and "perPage" as well as the (optional) string parameter
"title", ie: /api/movies?page=1&perPage=5&title=The Avengers.
It will use these values to return all "Movie" objects for a 
specific "page" to the client as well as optionally filtering
by "title", if provided (in this case, it will show both 
“The Avengers” films).
*/

app.get("/api/movies",(request,response)=>{
    console.log(request.query);
    db.getAllMovies(request.query.page, request.query.perPage, request.query.title)
    .then((movies)=>{
        response.status(200).json(movies);
    })
    .catch((error)=>{
        console.log(error); // For Debugging Purpose
        response.status(500).json({message:error.message});
    })
});

/*
GET /api/movies
This route must accept a route parameter that represents 
the _id of the desired movie object, i
e: /api/movies/573a1391f29313caabcd956e. 
It will use this parameter to return a specific "Movie" object
to the client.
*/
app.get("/api/movies/:_id",(request,response)=>{
    db.getMovieById(request.params._id)
    .then((movie)=>{
        if(movie)
        response.status(200).json(movie);
        else
        response.status(404).json({message:`Movie with id: ${request.params._id} is not found`});
    })
    .catch((error)=>{
        console.log(error); // For Debugging Purpose
        response.status(500).json({message:error.message});
    })
});

/*
PUT /api/movies
This route must accept a route parameter that represents 
the _id of the desired movie object, 
ie: /api/movies/573a1391f29313caabcd956e as well as read 
the contents of the request body. It will use these values 
to update a specific "Movie" document in the collection and 
return a success / fail message to the client.
*/

app.put("/api/movies/:_id",(request,response)=>{
    db.updateMovieById(request.body,request.params._id)
    .then((resp)=>{
        console.log(resp);
        if(resp.acknowledged)
        response.status(200).json({message:"Movie Successfully Updated"});
        else
        response.status(404).json({message:`Movie with id: ${request.params._id} is not found`});
    })
    .catch((error)=>{
        console.log(error); // For Debugging Purpose
        response.status(500).json({message:error.message});
    })
});

/*
DELETE /api/movies
This route must accept a route parameter that represents 
the _id of the desired movie object, 
ie: /api/movies/573a1391f29313caabcd956e. 
It will use this value to delete a specific "Movie" document 
from the collection and return a success / fail message to 
the client.
*/

app.delete("/api/movies/:_id",(request,response)=>{
    db.deleteMovieById(request.params._id)
    .then((resp)=>{
        console.log(resp);
        if(resp.deletedCount > 0)
        response.status(200).json({message:"Movie Successfully Deleted"});
        else
        response.status(404).json({message:`Movie with id: ${request.params._id} is not in the database`})
    })
    .catch((error)=>{
        console.log(error); // For Debugging Purpose
        response.status(500).json({message:error.message});
    })
});
