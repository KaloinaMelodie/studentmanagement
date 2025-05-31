let { User } = require("../model/schemas");
const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

function getAll(req, res) {
    User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.send(err);
    });
}

function findUserConnection(req, res) {

    const data = {
        username: req.body.username, 
        password: req.body.password,
    }

    if(req.body.student!=null){
        data.student = req.body.student
    }

    User.findOne(data)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "Nom d'utilisateur ou Mot de passe Incorrect." });
            }
            const userDto = user.toObject();
            delete userDto.password;

            const token = jwt.sign(
                {
                    userId: user._id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );
            userDto.token = token;

            res.send(userDto);
        })
        .catch((err) => {
            res.status(500).send({ message: "Erreur serveur", error: err });
        });
    }

async function register(req, res) {
  try {
    const { student, username, password } = req.body;

    if (!student || !username || !password) {
      return res.status(400).json({ message: 'student, username et password sont requis' });
    }
    const accountExists = await User.exists({ student }); 
    if (accountExists) {
      return res.status(409).json({ message: 'Cet étudiant possède déjà un compte.' });
    }
    const newUser = await User.create({
      student,
      username,
      password,
      role: 'STUDENT'
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const userDto = newUser.toObject();
    delete userDto.password;

    res.status(201).json({ ...userDto, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
}

    async function requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send({ message: "Utilisateur introuvable" });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const resetLink = `${process.env.FRONT_URL}/reset-password?token=${token}`; // URL frontend

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: 'Réinitialisation du compte',
  html: `
    <html>
      <body>
        <p>Bonjour,</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Veuillez cliquer sur le lien ci-dessous :</p>
        <p>
          <a href="${resetLink}" target="_blank" style="background-color: #007bff; color: #ffffff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Ou copiez-collez ce lien dans votre navigateur :</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
        <p>Si vous n'avez pas demandé cette opération, vous pouvez ignorer cet e-mail.</p>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} - Student Management App</p>
      </body>
    </html>
  `
});



        res.send({ message: 'Email envoyé' });

    } catch (err) {
        console.log("🚀 ~ requestPasswordReset ~ err:", err)
        res.status(500).send({ error: err.message });
    }
}

async function resetPassword(req, res) {
    const { token, password } = req.body;

    try {
        let decoded;
        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        }catch(err){
            res.status(400).send({ error: 'Lien invalide ou expiré.' });
        }

        const userId = decoded.userId;

        // const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(userId, { password });

        res.status(200).json({ message: 'Mot de passe modifié avec succès.' });
    } catch (err) {
        console.log("🚀 ~ resetPassword ~ err:", err)
        res.status(500).send({ error: err });
    }
}

module.exports = { findUserConnection , requestPasswordReset , resetPassword , findUserConnection, register };
