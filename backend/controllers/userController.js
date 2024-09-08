const User = require('../models/User');
const { encrypt } = require('../utils/encryptionUtil');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

let otps = {};
// Sign up
exports.signup = async (req, res) => {
    const { name, email, phone, username, password, role } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Set the role to the provided value or default to 1 (regular user)
        const userRole = role || 1;

        // Create a new user
        user = new User({
            name,
            email,
            phone,
            username,
            password,
            role: userRole
        });

        await user.save();

        res.status(201).json({ 
            message: 'User created successfully',
            user: { email: user.email, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// exports.signup = async (req, res) => {
//     const { name, email, phone, username, password, role } = req.body;

//     try {
//         // Check if the user already exists
//         let user = await User.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         user = await User.findOne({ username });
//         if (user) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Encrypt sensitive data
//         const encryptedName = encrypt(name);
//         const encryptedEmail = encrypt(email);
//         const encryptedPhone = encrypt(phone);
//         const encryptedUsername = encrypt(username);

//         // Set the role to the provided value or default to 1 (regular user)
//         const userRole = role || 1;

//         // Create a new user with encrypted data
//         user = new User({
//             name: encryptedName,
//             email: encryptedEmail,
//             phone: encryptedPhone,
//             username: encryptedUsername,
//             password, // Assuming password is hashed using bcrypt
//             role: userRole
//         });

//         await user.save();

//         res.status(201).json({ 
//             message: 'User created successfully',
//             user: { email: user.email, username: user.username, role: user.role }
//         });
//     } catch (error) {
//         console.error('Error during signup:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };



//login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      otps[username] = otp;
  
      // Send OTP to user's email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'sureshkarunanayaka1900@gmail.com',
          pass: 'rxao fbrx yqgp fxeq',
        },
      });
  
      const mailOptions = {
        from: 'sureshkarunanayaka1900@gmail.com',
        to: user.email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  // Verify OTP
  exports.verifyOtp = async (req, res) => {
    const { username, otp } = req.body;
  
    if (otps[username] === otp) {
      const user = await User.findOne({ username });
      delete otps[username]; // Clear the OTP after successful verification
      res.status(200).json({ message: 'OTP verified', user });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  };

// Fetch all users
exports.getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  };
  
  // Update user role
  exports.updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.role = role;
      await user.save();
  
      res.status(200).json({ message: 'Role updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating role', error });
    }
  };
