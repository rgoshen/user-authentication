const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());

// mock db
const users = [];

// first route
app.get('/users', (req, res) => {
  res.json(users);
});

// create user
app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(); // nothing provided so default=10
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // user data from body of request and hashedpassword
    const user = { name: req.body.name, password: hashedPassword };

    // add to mock db
    users.push(user);

    //send status back successfully done
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send();
  }
});

// login user
app.post('/users/login', async (req, res) => {
  // look for user in mock db
  const user = users.find((user) => user.name === req.body.name);

  // if user does not exits
  if (user === null) {
    return res.status(400).send('Cannot find user');
  }

  // compare supplied password to stores hashed password
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success');
    } else {
      res.send('Not allowed');
    }
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(3000);
