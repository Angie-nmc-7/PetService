const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const admin = require("./firebase"); // Firebase Admin SDK
const { checkAuth } = require("./middlewares/auth");
const authRoutes = require("./routes/auth");

const app = express();

// Configuraciones
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.create({ defaultLayout: "main", extname: ".hbs" }).engine);
app.set("view engine", ".hbs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Archivos estáticos
app.use("/public", express.static(path.join(__dirname, "public")));

// -----------------------------
// RUTAS PÚBLICAS
// -----------------------------

// Página principal
app.get("/", (req, res) => {
  res.render("index");
});

// Registro
app.use("/register", require("./routes/register"));

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

// -----------------------------
// RUTAS PROTEGIDAS
// -----------------------------

// Rutas públicas y autenticación
app.use("/", authRoutes); 
app.get("/profile", checkAuth, (req, res) => {
  res.render("profile", { user: req.user });
});


// Citas (la ruta base es /citas, y dentro están las subrutas: /, /new-cita, etc.)
app.use("/citas", checkAuth, require("./routes/citas"));


module.exports = app;