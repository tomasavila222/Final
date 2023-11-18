const express = require('express');
const fs = require('fs').promises;
const router = express.Router();


router.get('/', (req, res) => {
    // manejar  solicitud GET en la ruta raíz
    res.send('Holaaaa desde /api/products');
  });


//rutas relacionadas con productos

module.exports = router;
