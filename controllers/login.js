const bcrypt = require('bcryptjs');
const db = require('../models/viewEmFull.js');
const dbUser = require('../models/user');
const dbDepartment = require('../models/departments');
const dbEm = require('../models/employee');

// Verification function using async/await
async function comparePassword(password, storedHash) {
  try {
    const result = await bcrypt.compare(password, storedHash);
    return result;
  } catch (err) {
    console.error('Error comparing password:', err);
    return false;
  }
}

exports.getHome = async (req, res) => {
  try {
    const results = await db.findAll();
    res.render('home', {
      title: 'Home',
      products: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Home invalid.' })
  }
}

exports.getLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/');
  } catch {
    console.error('Error logout :', err)
    res.status(500).json({ error: 'Logout invalid.' })
  }
}


exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await dbUser.findOne({ where: { email: email } });
    if (user) {
      const isCorrect = await comparePassword(password, user.password);

      if (isCorrect) {
        const employee = await dbEm.findOne({ where: { userID: user.id } });
        const department = await dbDepartment.findOne({ where: { id: employee.departmentID } });

        const profileSessions = {
          id: user.id,
          idEM: employee.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          image: employee.image,
          nameTH: employee.nameTH,
          depName: department.nameTH
        }

        req.session.user = profileSessions;
        res.render('home', {
          title: 'Home',
          user: profileSessions,
          dataAlert: null,
          lengthAlert: 0
        });
      } else {
        res.render('login', {
          title: 'login',
          error_msg: "Password ไม่ถูกต้อง!!"
        });
      }
    } else {
      return res.render('login', {
        success: false,
        title: 'login',
        error_msg: "Email ไม่ถูกต้องกรุณากรอก email ใหม่ !!!"
      });
    }
  } catch (err) {
    console.error('Error login :', err)
    res.status(500).json({ error: 'Login invalid.' })
  }
}
