let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let student = require('./routes/students');
let course = require('./routes/courses');
let grade = require('./routes/grades');
let user = require('./routes/users');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const morgan = require('morgan');
app.use(morgan('dev'));

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// TODO remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud
const uri = process.env.MONGO_URI

const options = {};

mongoose.connect(uri, options)
    .then(() => {
            console.log("Connexion à la base OK");
        },
        err => {
            console.log('Erreur de connexion: ', err);
        });


//app.use(cors());
// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});


// OAuth2Client Google
const cookieParser = require('cookie-parser');
const { OAuth2Client } = require('google-auth-library');

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use(cookieParser());

// const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
// // Route to verify Google token
// app.post('/api/auth/google', async (req, res) => {
//   const { token } = req.body;

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();
//     const { name, email, picture } = payload;

//     //  Crée le token après avoir extrait les infos
//     const myToken = jwt.sign({ email, name }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     //  Envoie le cookie avec le token
//     res
//       .cookie('token', myToken, { httpOnly: true })
//       .status(200)
//       .json({ name, email, picture });

//   } catch (error) {
//     res.status(401).json({ error: 'Invalid Google token' });
//   }
// });


// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

const authenticate = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    // console.log("You are here",authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Non autorisé, token manquant.' });
    }
    
    
    const token = authHeader.split(' ')[1];
   
    try {
        console.log(process.env.JWT_SECRET);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        
        req.user = decoded;
        
        next();
    } catch (error) {
        console.log(error);
        
        res.status(401).json({ message: 'Token invalide.' });
    }
};

// les routes
const prefix = '/api';

app.route(prefix +'/auth/google')
    .post(user.signInWithGoogle);

app.route(prefix + '/register')
    .post(user.register);

app.route(prefix + '/login')
    .post(user.findUserConnection);

app.route(prefix + '/students')
    .get(student.getAll)
    .post(student.create)

app.route(prefix + '/forgetPassword')
    .post(user.requestPasswordReset);

app.route(prefix + '/resetPassword')
    .post(user.resetPassword);

app.route(prefix + '/students') .post(student.create)
    .delete(student.deleteEtudiant);

app.use(authenticate); 
    
app.route(prefix + '/students/:id')
    .get(student.getById)
    .put(student.update)
    .delete(student.deleteEtudiant)

app.route(prefix + '/courses')
    .get(course.getAll)
    .post(course.create);

app.route(prefix + '/courses/:id')
    .put(course.update)
    .delete(course.deleteCourse)

app.route(prefix + '/grades')
    .get(grade.getAll)
    .post(grade.create);

app.route(prefix + '/grades/:id')
    .delete(grade.deleteGrade)
    .put(grade.update);

app.route(prefix + '/grades/student/:id')
    .get(grade.getNotes)

app.route(prefix + '/student')
    .get(student.getStudent)
// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;