const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} = require('../validators/authValidator');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

// Multer config for profile image
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('profileImage'), updateProfile);
router.put('/change-password', auth, changePasswordValidator, validate, changePassword);

module.exports = router;
