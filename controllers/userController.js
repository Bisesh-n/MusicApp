const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//register user
exports.register = async (req, res) => {
  const { firstname, lastname, username, email, phone, dob, gender, address, password } = req.body;

  if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({ message: 'First Name, Last Name, Username, email, phone, dob, gender, address and password are required' });
    }

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create a new user object
        user = new User({
            firstname,
            lastname,
            username,
            email,
            phone,
            dob,
            gender,
            address,
            password
        });

        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token and user details (excluding password)
        res.status(201).json({
            token,
            user: {
                id: user._id,
                firstname: user.firstname, 
                lastname: user.lastname, 
                username: user.username,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                gender: user.gender,
                address:  user.address,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt 
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};



//login user
exports.login = async (req, res) => {
  try {
        const user = await User.findOne({ username: req.body.username });

            if (!user) return res.status(400).send('Invalid credentials');

        const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user._id }, 'secretkey');
        res.json({ token });

    } catch (error) {
        res.status(400).send(error.message);
    }
};



//get users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ updatedAt: -1 }).select('firstname lastname username email phone dob gender address createdAt updatedAt');
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};



//update user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
};



//delete user
exports.deleteUser = async (req, res) => {
  try {
      // Find user by ID and delete
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
