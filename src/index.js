const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const foundUser = users.find((user) => user.username === username);
  if (!foundUser)
    return response.status(403).json({ message: "user do not found" });
  next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const foundUser = users.find((user) => user.username === username);

  if (foundUser)
    return response.status(400).json({ error: "user already exists" });

  const id = uuidv4();
  const todos = [];

  users.push({ id, name, username, todos: [] });
  return response.status(201).json({ id, name, username, todos: [] });
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;

  const user = users.find((user) => user.username === username);

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const user = users.find((user) => user.username === username);

  const userTodos = user.todos;
  const foundTodo = userTodos.filter((todo) => todo.id === id);

  if (foundTodo.length === 0)
    return response.status(404).json({ error: "todo not found" });

  const filteredTodos = userTodos.filter((todo) => todo.id !== id);

  const newTodo = {
    id: foundTodo.id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: foundTodo.created_at,
  };
  filteredTodos.push(newTodo);

  user.todos = filteredTodos;

  return response.status(200).json(newTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find((user) => user.username === username);

  const userTodos = user.todos;
  const foundTodo = userTodos.filter((todo) => todo.id === id);

  if (foundTodo.length === 0)
    return response.status(404).json({ error: "todo not found" });

  const filteredTodos = userTodos.filter((todo) => todo.id !== id);

  const newTodo = {
    id: foundTodo[0].id,
    title: foundTodo[0].title,
    done: true,
    deadline: foundTodo[0].deadline,
    created_at: foundTodo[0].created_at,
  };
  filteredTodos.push(newTodo);

  user.todos = filteredTodos;
  return response.status(200).json(newTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const user = users.find((user) => user.username === username);

  const userTodos = user.todos;
  const todoCount = userTodos.length;
  const userFilteredTodos = userTodos.filter((todo) => todo.id !== id);

  if (todoCount === userFilteredTodos.length)
    return response.status(404).json({ error: "todo not found" });

  user.todos = userFilteredTodos;

  return response.status(204).send();
});

module.exports = app;
