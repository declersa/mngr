const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS pour autoriser une origine sp�cifique et g�rer les cookies
app.use(cors({
  origin: 'https://www.cyber-securite.fr', // Autorise uniquement ce domaine
  methods: ['POST'], // Autorise uniquement la m�thode POST si n�cessaire
  credentials: true // Permet d'envoyer les cookies avec les requ�tes CORS
}));

// Middleware pour analyser les cookies
app.use(cookieParser());

// Configuration des sessions avec stockage s�curis�
app.use(session({
  secret: 'your-secret-key', // Cl� secr�te pour chiffrer la session
  resave: false, 
  saveUninitialized: true, 
  cookie: {
    secure: true, // Doit �tre en HTTPS
    httpOnly: true, // Emp�che l'acc�s JavaScript (s�curis� contre XSS)
    sameSite: 'Lax', // Prot�ge contre certaines attaques CSRF
    maxAge: 1000 * 60 * 30 // Session expire apr�s 30 minutes
  }
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/styles', express.static(path.join(__dirname, 'public/styles')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.set('view engine', 'ejs');

// Middleware pour attribuer une session unique par utilisateur
app.use((req, res, next) => {
    if (!req.session.userID) {
        req.session.userID = Math.random().toString(36).substr(2, 9); // G�n�re un ID unique
    }
    next();
});

// Servir le fichier robots.txt
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { sessionID: req.session.userID });
});

app.post('/submit', (req, res) => {
  res.render('results', { layout: false, sessionID: req.session.userID });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
