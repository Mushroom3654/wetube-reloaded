import User from '../models/User';
import { compare } from 'bcrypt';

export const getJoin = (req, res) => res.render('join', { pageTitle: 'Join' });

export const postJoin = async (req, res) => {
    const pageTitle = 'Join'
    try {
        const { email, name, userName, password, password2, location } = req.body;
        if (password !== password2) {
            throw { message: 'Password confirmation does not match', status: 400 };
        }
        const exists = await User.exists({$or: [{ userName }, { email }]});
        if (exists) throw { message: 'UserName or Email is already taken', status: 400 };
        await User.create({
            name,
            email,
            userName,
            password,
            location
        });
        return res.redirect('/login');
    } catch (error) {
        res.status(error.status ?? 400).render('join', { pageTitle, errorMessage: error.message })
    }
};

export const getLogin = (req, res) => {
    res.render('login', { pageTitle: 'Login' });
}

export const postLogin = async (req, res) => {
    // check if account exist
    // check password match
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });
        if (!user) throw { message: 'User Not found', status: 404 };

        const match = await compare(password, user.password);

        if (!match) {
            throw { message: 'Password Not Matched', status: 400 };
        }

        req.session.loggedIn = true;
        req.session.user = user;

        res.redirect('/');
    } catch (error) {
        console.log(error.message)
        res.status(error.status ?? 400).render('login', { pageTitle: 'Login', errorMessage: error.message })
    }
}

export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: 'bb6e400fa64c2aa805ff',
        allow_signup: false,
        scope: 'read:user user:email',
    }
    const params = new URLSearchParams(config).toString()
    return res.redirect(`${baseUrl}?${params}`);

}

export const edit = (req, res) => res.send('Edit User');

export const remove = (req, res) => res.send('Remove User');

export const logout = (req, res) => res.send('Logout');

export const see = (req, res) => res.send('See');