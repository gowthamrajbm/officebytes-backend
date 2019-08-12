const Admin = require('../models/admin.model');

module.exports = (req, res, next) => {
    const userId = req.userData.userId;
    Admin.find({ user: userId })
        .exec()
        .then((admin) => {
            console.log('admin', admin)
            if (admin.length < 1) {
                return res.status(401).json({
                    success: false,
                    response: 'Not an admin'
                })
            }

            req.adminId = admin[0]._id;
            next();
        })
        .catch((err) => {
            return res.status(401).json({
                success: false,
                response: 'Not an admin'
            })
        })
};