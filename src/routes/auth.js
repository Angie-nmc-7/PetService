// routes/auth.js
const express = require('express');
const router = express.Router();
const admin = require('../firebase');
const { checkAuth } = require('../middlewares/auth');


// Mostrar formulario login
router.get('/login', (req, res) => {
  res.render('login');
});

// Recibir el idToken desde el frontend y validar usuario
router.post('/login', async (req, res) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res.status(400).render('login', { error: 'Token no proporcionado' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Guardar datos del usuario en sesión (requiere express-session)
    req.session.user = { uid: decodedToken.uid, email: decodedToken.email };

    res.redirect('/profile');
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).render('login', { error: 'Token inválido o expirado' });
  }
});

// Crear cookie de sesión con idToken (opcional si quieres manejar cookies)
router.post('/sessionLogin', async (req, res) => {
  const idToken = req.body.idToken;
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días

  if (!idToken) {
    return res.status(400).send('Token no proporcionado');
  }

  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: false }; // En desarrollo, secure false

    res.cookie('session', sessionCookie, options);
    res.status(200).send('Sesión iniciada');
  } catch (error) {
    console.error('Error al crear cookie de sesión:', error);
    res.status(401).send('Token inválido');
  }
});

// Cerrar sesión
router.post('/logout', (req, res) => {
  res.clearCookie('session');
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


module.exports = router;
