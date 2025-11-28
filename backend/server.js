const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const puerto = 3000;
const path = require('path');

//clave super secreta
const JWT_SECRET = process.env.JWT_SECRET || 'Jovenes_A_Programar304_Grupo3';

const USERS = [
  { id: 1, username: 'admin', password: 'JaP304_Grupo3' }
];

//middleware body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//frontend static
app.use(express.static(path.join(__dirname, '..')));

//**END POST**
app.post('/login', (req, res) => {
  const body = req.body || {};
  const { username, password } = body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Falta usuario o contraseña' });
  }

  const existingUser = USERS.find(u => u.username === username);

  if (!existingUser || existingUser.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const payload = { id: existingUser.id, username: existingUser.username };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return res.json({ token });
});
//**Final END POST**

// **Middleware de autentificación**
function authMiddleware(req, res, next) {
  //token
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

//api rutas
app.use('/cart', authMiddleware, express.static(path.join(__dirname, 'cart')));
app.use('/cats', authMiddleware, express.static(path.join(__dirname, 'cats')));
app.use('/cats_products', authMiddleware, express.static(path.join(__dirname, 'cats_products')));
app.use('/products', authMiddleware, express.static(path.join(__dirname, 'products')));
app.use('/products_comments', authMiddleware, express.static(path.join(__dirname, 'products_comments')));
app.use('/sell', authMiddleware, express.static(path.join(__dirname, 'sell')));
app.use('/user_cart', authMiddleware, express.static(path.join(__dirname, 'user_cart')));


//servidor inicio
app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});