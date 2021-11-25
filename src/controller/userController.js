import User from '../models/User';

export const getJoin = (req, res) => res.render('join', { pageTitle: 'Join' });

export const postJoin = async (req, res) => {
    const pageTitle = 'Join'
    try {
        const { email, name, userName, password, password2, location } = req.body;
        if (password !== password2) {
            throw Error('Password confirmation does not match')
        }
        const exists = await User.exists({$or: [{ userName }, { email }]});
        if (exists) throw Error('UserName or Email is already taken');
        await User.create({
            name,
            email,
            userName,
            password,
            location
        });
        return res.redirect('/login');
    } catch (error) {
        res.render('join', { pageTitle, errorMessage: error.message })
    }
};

export const getLogin = (req, res) => res.render('login');

export const postLogin = (req, res) => {
    res.end();
}

export const edit = (req, res) => res.send('Edit User');

export const remove = (req, res) => res.send('Remove User');


export const logout = (req, res) => res.send('Logout');

export const see = (req, res) => res.send('See');