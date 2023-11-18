const express = require('express');
const fs = require('fs').promises;

const app = express();
const PORT = 8080;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas para productos
const productsRouter = express.Router();

// Función para leer los productos desde el archivo
async function readProducts() {
  try {
    const data = await fs.readFile('productos.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Función para escribir los productos en el archivo
async function writeProducts(products) {
  await fs.writeFile('productos.json', JSON.stringify(products, null, 2));
}

productsRouter.get('/', async (req, res) => {
  // Implementa la lgica para listar todos los productos
  const products = await readProducts();
  res.json(products);
});

productsRouter.get('/:pid', async (req, res) => {
  // Implementa la logica para obtener un producto por su id
  const products = await readProducts();
  const product = products.find((p) => p.id === req.params.pid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productsRouter.post('/', async (req, res) => {
  // Implementa la logica para agregar un nuevo producto
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const newProduct = {
    id: Math.random().toString(36).substr(2, 9), // Genera un id único
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status: true, // Valor por defecto
  };

  const products = await readProducts();
  products.push(newProduct);

  await writeProducts(products);

  res.json(newProduct);
});

productsRouter.put('/:pid', async (req, res) => {
  // Implementa la lógica para actualizar un producto por su id
  const products = await readProducts();
  const index = products.findIndex((p) => p.id === req.params.pid);

  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    await writeProducts(products);
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  // Implementa la logica para eliminar un producto por su id
  const products = await readProducts();
  const filteredProducts = products.filter((p) => p.id !== req.params.pid);

  if (filteredProducts.length < products.length) {
    await writeProducts(filteredProducts);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.use('/api/products', productsRouter);

// Rutas para carrritos
const cartsRouter = express.Router();

// Funcion para leer los carritos desde el archivo
async function readCarts() {
  try {
    const data = await fs.readFile('carrito.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Función para escribir los carritos en el archivo
async function writeCarts(carts) {
  await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));
}

cartsRouter.post('/', async (req, res) => {
  // Implementa la logica para crear un nuevo carrito
  const newCart = {
    id: Math.random().toString(36).substr(2, 9), // Genera un id único
    products: [],
  };

  const carts = await readCarts();
  carts.push(newCart);

  await writeCarts(carts);

  res.json(newCart);
});

cartsRouter.get('/:cid', async (req, res) => {
  // Implementa la logica para obtener un carrito por su id
  const carts = await readCarts();
  const cart = carts.find((c) => c.id === req.params.cid);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  // Implementa la lógica para agregar un producto al carrito por su id
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const carts = await readCarts();
  const cartIndex = carts.findIndex((c) => c.id === cid);

  if (cartIndex !== -1) {
    const productToAdd = { id: pid, quantity: quantity || 1 };
    const existingProductIndex = carts[cartIndex].products.findIndex((p) => p.id === pid);

    if (existingProductIndex !== -1) {
      // Incrementa la cantidad si el producto ya existe
      carts[cartIndex].products[existingProductIndex].quantity += productToAdd.quantity;
    } else {
      // Agrega un nuevo producto al carrito
      carts[cartIndex].products.push(productToAdd);
    }

    await writeCarts(carts);
    res.json(carts[cartIndex]);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

app.use('/api/carts', cartsRouter);

// iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
