const express = require('express');
const fs = require('fs').promises;
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const exphbs = require('express-handlebars');

// Configurar Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

// Importa express-handlebars
const exphbs = require('express-handlebars');

// configurar Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main', // Nombre del layout
  extname: 'handlebars' // Extensión de los archivos de plant
}));
app.set('view engine', 'handlebars');
app.set('views', 'src/views');


app.use(express.json());

// Rutas para productos
const productsRouter = express.Router();

async function readProducts() {
  try {
    const data = await fs.readFile('productos.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeProducts(products) {
  await fs.writeFile('productos.json', JSON.stringify(products, null, 2));
}

productsRouter.get('/', async (req, res) => {
  const products = await readProducts();
  res.json(products);
});

// Otras rutas para productos (post, put, delete) deben ser implementadas

app.use('/api/products', productsRouter);

// Rutas para carritos
const cartsRouter = express.Router();

async function readCarts() {
  try {
    const data = await fs.readFile('carrito.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeCarts(carts) {
  await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));
}

cartsRouter.post('/', async (req, res) => {
  const newCart = {
    id: Math.random().toString(36).substr(2, 9),
    products: [],
  };

  const carts = await readCarts();
  carts.push(newCart);

  await writeCarts(carts);

  res.json(newCart);
});

// Otras rutas para carritos (get, post) deben ser implementadas

app.use('/api/carts', cartsRouter);

// Rutas para vistas
app.get('/', (req, res) => {
  res.render('home', { productos: obtenerProductos() });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos: obtenerProductos() });
});


// configurar socket.io
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Eventos de socket.io deben ser implementados

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// arrancar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
