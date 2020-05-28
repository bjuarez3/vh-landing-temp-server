const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.listen(port, () => {
  console.log(`Your port is ${process.env.PORT}`);
});

app.post('/api/sendMessage', (req, res) => {
  const data = req.body;
  console.log(data);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  const mailOptions = {
    from: data.email,
    to: 'hello@varsityhype.com',
    subject: 'Varsity Hype Contact Form',
    html: `<p>Name: ${data.name}</p>
          <p>Email: ${data.email}</p>
          <p>Message: ${data.message}</p>`,
  };

  transporter.sendMail(mailOptions, (error, res) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(res);
      res.send('Success');
    }
    transporter.close();
  });
});
