## Node.js and Express

Working toward implementing functionality on the server side of the stack. We will implement a simple REST API in Node.js by using the Express library and application'data will be stored in a MongoDB database.

NodeJS - JavaScript runtime based on Google's Chrom V8 engine.

The newest features of JS often the browser don't support yet, that is why browser must be transpiled with `babel`.
However, JS in the backend doesn't need to transpile since the newest version of Node support a large majority of the latest features of JS.

---

`npm init` to create a new template for the application. It will auto generated a `package.json` at the root of the project that contains information about the project.

Make a run script: `"start" : "node index.js"`. It will tell node to run the `index.js` file.

### Simple web server

```javascript
const http = require("http");

const app = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World");
});

const port = 3001;
app.listen(port);
console.log(`Server running on port ${port}`);
```

`http` is Node's built-in web server module. Using the `createServer` method of the http module to create a new web server. An event handler is registered to the server, that is called every time an HTTP request is made to the server's address.

## Web and express

import express and use it as a function to create an express application and stored in the app variable.

```javascript
const express = require("express");
const app = express();

app.get("/", (request, respond) => {
  res.send("<h1>Hello World!</h1>");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

The app listen to the http requests made to the application's / root and the respone parameter. In this case, the respone is call the send method contain the string Hello World. Express auto sets the value of the Content-Type header to be text/html and the status code to 200.

```javascript
const notes = [...];
app.get('/notes', (request, response) => {
  response.json(notes)
})
```

In this case, the app listen to the http request made to the /notes page. Then responded with the json method of the respone object. It will sents the note array as a JSON formatted string.

## Nodemon

> nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.

```javascript
    "watch": "nodemon index.js"
```

## REST

Notes, persons are called **resources** in RESTful thinking. Every resource has an associated URL which is the resource's unique address.

One convention is to create the unique address for resources by combining the name of the resource type with the resource's unique identifier.

Let's assume that the root URL of our service is www.example.com/api.

This way of interpreting REST falls under the second level of RESTful maturity in the Richardson Maturity Model

## Fetch a single resource

```javascript
app.get("/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find(note => note.id === id);
  response.json(note);
});
```

Difference between find and filter

## Delete resources

```javascript
app.delete("/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);

  response.status(204).end();
});
```

## Receiving data

`body-parser` is a body parsing middleware.
Parse imcoming request bodies in the a middleware before the handlers, available under the `req.body` property. It extract the entire body portion of an incoming request stream and exposes it on `req.body`.

Import body-parse and implement an initial handler for dealing with the HTTP POST requests.

```javascript
const bodyParser = require("body-parser");

app.use(bodyParser.json());
```

The middleware allows we can view the body property of the `request` object.

```javascript
app.post("/", (request, respone) => {
  const note = request.body;
  console.log(note);

  respone.json(note);
});
```

so whatever the request.body is it will return that.

```javascript
 { name: 'saod dsadw', number: '23123-231-12', id: 5 } //req.body
```

## HTTP request types

`HTTP standard` talks about two properties related to request types, **safety** and **idempotence**.

HTTP GET request should be **safe** - GET or HEAD method **should not** have the significance of taking an action other than retrieval. These methods ought to be considered "safe".

Safety means the executing request must not cause any side effects in thet server. In practice GET and HEAD does not return anything but the status code and respone headers. The respone body will not be returned.

all other request **except** POST should be **idempotent** - if a request has side effects then the result should be same regardless.

## Middleware

Middlware are functions that can be used for handling `request` and `respone` objects.

For example, the `body-parser` takes the raw data from the requests that stored in the `request` object, parses it into JS object and assign to `request` object as a new property _body_.

# b. Deploying app to internet

## Same origin policty and CORS

CORS is a mechanism that allows restricted resources (e.g. fonts) on the web page to be requested from another domain outside of the domain that the first resource was served.

By default, JS code runs in a browser can only communicate with a server in the same origin. So our frontend runs in port 3000 while server runs in different port 3001 - they don't have the same origin.

Can allow requests from other origins by using `cors middleware`.

```javascript
const cors = require("cors");
app.use(cors());
```

## Application to the internet

## serving static files from the backend

One option is to copy the production build to the root of the backend repo and config the backend to show the frontend main page as its main page.

To make express show static content and page's JS - need a built-in middleware from express called static and declare

```javascript
app.use(express.static("build"));
```

# C - Saving data to MongoDB

## Schema

```javascript
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
});

const Note = mongoose.model("Note", noteSchema);
```

The schema define how the objects are to be stored in the database. The document databases are schemaless - database itself does not care about the structure of the data that is stored in the database.

## Fetching objects from database

```javascript
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note);
  });
  mongoose.connection.close();
});
```

The object are retrieved from the database with the `find` method of the `Note` model. The parameter `{}` of the method is an object expressing search conditions. Since the parameter is `{}` is empty - we get all the notes stored in the `notes` collection.

## Backend connected to a database

First thing needed is to use the enviroment variables, by using `dotenv` package.

```javascript
require("dotenv").config();
```

Add this line in the `index.js` to ensure the env variables from `.env` file are available globally.

One way to format the objects returned by Mongoose is to modify the `toJSON` method of the objects.

---

## Error handling

If we try to visit the url of a person http://localhost:3001/api/persons/:id

```javascript
http://localhost:3001/api/persons/5dd1205a82b4e1dc6189a37e
```

then we can extract the content with that id. However if the id isn't there, the server seem to be 'stuck' since the server never responds to the request.

The request has failed and the associated promise has been rejected. Hence we need to handling error

```javascript
app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person.toJSON());
    })
    .catch(err => {
      console.log("error in", err);
      res.status(404).end();
    });
});
```

When refesh the page, the page will respone a blank page.

## Moving error handling into the middleware

It is better to implement all error handling in a single place. This can be particularly useful if we later on want to report data related to errors to an external error tracking system such as Sentry.

for example, the error forward with the `next` function. The next function is passed to the handler as the third parameter

```javascript
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});
```

The error passed forward is given to the `next` function as a parameter.

If `next` was called without a parameter, then the execution simply move onto the next route or middleware.

If `next` was call with a parameter, then the execution will continue to the _error handler middleware_.

Express `error handlers` are middleware that are defined with a function that accepts `four paramters`.

So if the error was passed to the `next` function, it will be handled by the built-in error handler .

```javascript
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);
```

## The order of middleware loading

1. express build
2. bodyParsers json
3. logger
4. HTTP POST/GET requests
5. handler of unknown endpoints
6. handler of requests with results to errrors

## Other operations

HTTP delete is to use `findByIdAndRemove` method.

```javascript
app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});
```

HTTP PUT request method creates a new resource or update existing resource - goes along with `findByIdAndUpdate` method.

---

# Validation and Eslint

There are constraint that we want to apply to the data that is stored in our app database such that not accept entry that have a missing property. For example,

```javascript
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  // ...
});
```

One smarter way is to use **validation** functionality available in Mongoose. We can define specific validation rules for each field in the schema as

```javascript
const noteSchema = new mongoose.Schema({
  content: { type: String, minlength: 5, required: true },
  date: { type: Date, required: true },
  important: Boolean
});
```
