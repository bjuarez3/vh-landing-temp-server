const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

const result = dotenv.config();

if (result.error) {
  if (process.env.NODE_ENV === 'production' && result.error.code === 'ENOENT') {
    console.info(
      'expected this error because we are in production without a .env file'
    );
  } else {
    throw result.error;
  }
}

const app = express();
app.use(cors());
const port = process.env.PORT || result.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Your port is ${process.env.PORT}`);
});

app.get('/', (req, res) => {
  try {
    res.status(200).send('Hello from Varsity Hype!').end();
  } catch (e) {
    console.log(e.toString());
    res.status(500).json({ error: e.toString() });
  }
});

app.post('/api/sendMessage', (req, res) => {
  try {
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

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(error);
        res.staus(500).send(error);
      } else {
        console.log(response);
        res.send('Success');
      }
      transporter.close();
    });
  } catch (e) {
    console.log(e.toString());
    res.status(500).json({ error: e.toString() }).end();
  }
});
