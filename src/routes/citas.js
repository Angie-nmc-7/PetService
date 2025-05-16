const { db } = require("../firebase");
const { Router } = require("express");
const { checkAuth } = require("../middlewares/auth");
const router = Router();

// Middleware para proteger todas las rutas de este router
router.use(checkAuth);

// Mostrar lista de citas
router.get("/", async (req, res) => {
  try {
    const querySnapshot = await db.collection("Citas").get();
    const citas = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.render("citas", { citas });
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    res.status(500).send("Error al obtener las citas.");
  }
});

router.post("/new-cita", async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { nombre, servicio, fecha, precio } = req.body;

  try {
    await db.collection("Citas").add({
      nombre,
      servicio,
      fecha,
      precio,
    });
//res.redirect("/citas");
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).send(`Error al crear la cita: ${error.message}`);
  }
});


// Eliminar cita
router.get("/delete-cita/:id", async (req, res) => {
  try {
    await db.collection("Citas").doc(req.params.id).delete();
    res.redirect("/citas");
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    res.status(500).send("Error al eliminar la cita.");
  }
});

// Editar cita
router.get("/edit-cita/:id", async (req, res) => {
  try {
    const doc = await db.collection("Citas").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send("Cita no encontrada.");
    }
    res.render("citas", { cita: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error al obtener la cita:", error);
    res.status(500).send("Error al obtener la cita.");
  }
});

// Actualizar cita
router.post("/update-cita/:id", async (req, res) => {
  const { nombre, servicio, fecha, precio } = req.body;
  const { id } = req.params;
  try {
    await db.collection("Citas").doc(id).update({
      nombre,
      servicio,
      fecha,
      precio,
    });
    res.redirect("/citas");
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    res.status(500).send("Error al actualizar la cita.");
  }
});

module.exports = router;
