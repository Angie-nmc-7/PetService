const express = require("express");
const router = express.Router();
const admin = require("../firebase");

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    console.log("Usuario creado:", userRecord.uid);
    res.redirect("/login");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).send("Error al registrar usuario");
  }
});

module.exports = router;
