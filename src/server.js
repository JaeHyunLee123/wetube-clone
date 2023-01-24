import express, { request } from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not allowed</h1>");
  }
  next();
};

const handleHome = (req, res) => {
  return res.send("<h1>Hello world!</h1>");
};

const handleLogin = (rep, res) => {
  return res.send("login here");
};

const handleProtected = (req, res) => {
  return res.send("private page");
};

const handleListening = () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
};

app.use(logger);
app.use(privateMiddleware);

app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);

app.listen(PORT, handleListening);
