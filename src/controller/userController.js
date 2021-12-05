import User from '../models/User';
import fetch from 'node-fetch'
import { compare } from 'bcrypt';

export const getJoin = (req, res) => res.render('join', { pageTitle: 'Join' });

export const postJoin = async (req, res) => {
    const pageTitle = 'Join'
    try {
        const { email, name, password, password2, location } = req.body;
        if (password !== password2) {
            throw { message: 'Password confirmation does not match', status: 400 };
        }
        const exists = await User.exists({$or: [{ email }]});
        if (exists) throw { message: 'UserName or Email is already taken', status: 400 };
        await User.create({
            name,
            email,
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
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, socialOnly: false });
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
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: 'read:user user:email',
    }
    const params = new URLSearchParams(config).toString()
    return res.redirect(`${baseUrl}?${params}`);
}

export const finishGithubLogin = async (req, res) => {
    try {
        const baseUrl = 'https://github.com/login/oauth/access_token';
        const config = {
            client_id: process.env.GH_CLIENT,
            client_secret: process.env.GH_SECRET,
            code: req.query.code
        }

        const params = new URLSearchParams(config).toString();
        const finalUrl = `${baseUrl}?${params}`;
        // get AccessToken
        const tokenRequest = await (
            await fetch(finalUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json' // 설정 안하면 response가 text로 반환됨
                }
            })
        ).json();
        if ('access_token' in tokenRequest) {
            const {access_token} = tokenRequest;
            const apiUrl = 'https://api.github.com';
            const userData = await (
                await fetch(`${apiUrl}/user`, {
                    headers: {
                        Authorization: `token ${access_token}`
                    }
                })
            ).json();
            const emailData = await (
                await fetch(`${apiUrl}/user/emails`, {
                    headers: {
                        Authorization: `token ${access_token}`,
                        Accept: 'application/json'
                    }
                })
            ).json();
            const emailObj = emailData.find(email => email.primary && email.verified)
            if (!emailObj) {
                throw { status: 404, message: 'Email Not found' }
            }
            const existingUser = await User.findOne({ email: emailObj.email });
            if (existingUser) {
                req.session.loggedIn = true;
                req.session.user = existingUser;
                return res.redirect('/')
            } else {
                const user = User.create({
                    avatarUrl: userData.avatar_url,
                    name: userData.name,
                    email: emailObj.email,
                    password: '',
                    location: userData.location,
                    socialOnly: true,
                });
                req.session.loggedIn = true;
                req.session.user = user;
                return res.redirect('/')
            }
        } else {
            throw { status: 404, message: 'AccessToken Not found' }
        }
    } catch (error) {
        console.log('error => ', error);
        return res.redirect('/login')
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

export const edit = (req, res) => res.send('Edit User');

export const remove = (req, res) => res.send('Remove User');


export const see = (req, res) => res.send('See');