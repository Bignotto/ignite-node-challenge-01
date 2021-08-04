const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // TODO: check user midleware
  const { id } = request.body;

  const foundUser = users.find((user) => user.id === id);

  if (foundUser)
    return response.status(403).json({ message: "user already exists" });

  next();
}

app.post("/users", checksExistsUserAccount, (request, response) => {
  // TODO: Post user
  // Complete aqui
  /*
  { 
    id: 'uuid', // precisa ser um uuid
    name: 'Danilo Vieira', 
    username: 'danilo', 
    todos: []
  }
  */

  const { id, name, username, todos } = request.body;

  users.push({ id, name, username, todos });
  return response.json({ id, name, username, todos });
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
