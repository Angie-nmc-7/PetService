const express = require("express");
const router = express.Router();
const admin = require("../firebase");  // apunta a tu archivo firebase.js

// Ruta para recibir el token del cliente
router.post("/sessionLogin", async (req, res) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res.status(400).send("Token no proporcionado");
  }

  // Duración de la sesión (ejemplo: 5 días)
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: true };

    res.cookie("session", sessionCookie, options);
    res.status(200).send("Sesión iniciada");
  } catch (error) {
    console.error("Error al crear cookie de sesión:", error);
    res.status(401).send("Token inválido");
  }
});

module.exports = router;
