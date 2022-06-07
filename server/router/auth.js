const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../model/userSchema');
router.get('/', (req, res) => {
  res.send('Hello from auth.js');
});

//Using Promises Post request
// router.post('/register', (req, res) => {
//   // console.log(req.body);
//   // res.json({ message: req.body });
//   const { name, email, phone, work, password, cpassword } = req.body;
//   if (!name || !email || !phone || !work || !password || !cpassword)
//     return res.status(422).json({ error: 'Fill data' });

//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: 'Email already Exists' });
//       }
//       const user = new User({ name, email, phone, work, password, cpassword });
//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: 'user created successfully' });
//         })
//         .catch((err) => res.status(501).json({ error: 'error occured' }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// Using Async Await
router.post('/register', async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword)
    return res.status(422).json({ error: 'Fill data' });
  try {
    const userReg = await User.findOne({ email: email });
    if (userReg) {
      return res.status(422).json({ error: 'Email already Exists' });
    } else if (password != cpassword) {
      return res.status(422).json({ error: 'Password not matching' });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      //yaha pe pass ko hash krna hai save se pehle

      await user.save();

      res.status(201).json({ message: 'User created' });
    }
  } catch (err) {
    console.log(err);
  }
});

//login route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Fill all the fields' });
    }
    const user = await User.findOne({ email: email });
    // console.log(user);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      const token = await user.generateAuthToken();
      console.log(token);
      res.cookie('jwtoken', token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: 'Invalid Credentials' });
      } else {
        res.status(201).json({ message: 'user signedin successfully' });
      }
    } else {
      res.status(400).json({ error: 'Invalid Credentials' });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
