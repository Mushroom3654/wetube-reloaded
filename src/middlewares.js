import multer from 'multer';

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = 'Wetube';
    res.locals.loggedInUser = req.session.user || {};
    return next();
}

export const protectorMiddleware = (req, res, next) => {
    return req.session.loggedIn ? next() : res.redirect('/login');
}

export const publicOnlyMiddleware = (req, res, next) => {
    return req.session.loggedIn ? res.redirect('/') : next();
}

export const avatarUpload = multer({
    dest: 'uploads/avatar/',
    limits: {
        fileSize: 300000,
    }
});
export const videoUpload = multer({
    dest: 'uploads/video/',
    limits: {
        fileSiz: 10000000
    }
});
//     {
//     storage: multer.diskStorage({
//         destination: function(req, file, cb) {
//             cb(null, 'uploads/')
//         },
//         filename: function(req, file, cb) {
//             cb(null, file.originalname)
//         }
//     })
// })