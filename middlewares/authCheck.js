exports.isAuthenticated = async (req, res, next) => {
  try {
    if (req.session.user) {
      return next();
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Is Authenticated Invalid' })
  }

}

exports.ifLoggedIn = async (req, res, next) => {
  try {
    if (req.session.user) {
      return res.redirect('/home');
    }
    next();
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'If Logged In Invalid' })
  }
}