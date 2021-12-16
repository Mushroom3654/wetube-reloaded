import User from '../models/User';
import fetch from 'node-fetch'
import { compare } from 'bcrypt';
import Video from "../models/Video";

export const getJoin = (req, res) =>
    res.render('join', { pageTitle: 'Join' });

export const postJoin = async (req, res) => {
    const pageTitle = 'Join'
    try {
        const { email, name, password, password2, location } = req.body;
        if (password !== password2) {
            throw { message: 'Password confirmation does not match', status: 400 };
        }
        const exists = await User.exists({$or: [{ email }]});
        if (exists) throw { message: 'Email is already taken', status: 400 };
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

export const getLogin = (req, res) =>
    res.render('login', { pageTitle: 'Login' });

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
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: 'read:user user:email',
    }
    const params = new URLSearchParams(config).toString()
    return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}

export const finishGithubLogin = async (req, res) => {
    try {
        const config = {
            client_id: process.env.GH_CLIENT,
            client_secret: process.env.GH_SECRET,
            code: req.query.code
        }

        const params = new URLSearchParams(config).toString();
        const finalUrl = `https://github.com/login/oauth/access_token?${params}`;
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
                res.locals.loggedInUser = existingUser;
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
                res.locals.loggedInUser = user;
            }
            return res.redirect('/')
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

export const getEdit = (req, res) =>
    res.render('users/edit-profile', { pageTitle: 'Edit Profile' });

export const postEdit = async (req, res) => {
    const pageTitle = 'Edit Profile';
    try {
        const {
            session: {
                user: { _id, email: sessionEmail }
            },
            body: { name, email, location },
            file,
        } = req;

        if (sessionEmail !== email) {
            const emailAlreadyUsed = await User.exists({ email });
            if (emailAlreadyUsed) {
                throw { message: 'email is aleady taken', status: 400 }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(_id, {
            avatarUrl: file?.path ?? req.session.user.avatarUrl,
            name,
            email,
            location
        }, { new: true })

        req.session.user = updatedUser;

        return res.redirect('/users/edit');
    } catch (error) {
        res
            .status(error.status ?? 400)
            .render('users/edit-profile', { pageTitle, errorMessage: error.message })
    }
};

export const getChangePassword = (req, res) =>
    res.render('users/change-password', { pageTitle: 'Change Password' });

export const postChangePassword = async (req, res) => {
    try {
        const {
            session: {
                user: { _id }
            },
            body: { oldPassword, newPassword, newPasswordConfirm }
        } = req;
        const user = await User.findById(_id);
        const ok = await compare(oldPassword, user.password);
        if (!ok) {
            throw { message: 'The current Password is incorrect', status: 400}
        }
        if (newPassword !== newPasswordConfirm) {
            throw { message: 'New Password not confirm', status: 400}
        }
        user.password = newPassword;
        await user.save();

        return res.redirect('/users/logout');
    } catch (error) {
        console.warn(error)
        res
            .status(error.status ?? 400)
            .render('users/change-password', { pageTitle: 'Change Password', errorMessage: error.message })
    }
}

export const watch = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('videos');
        if (!user) {
            throw { message: 'User not Found', status: 404 }
        }
        console.log(user)
        return res.render('users/profile', {
            pageTitle: `${user.name} Profile`,
            user,
        })
    } catch (error) {
        console.log(error);
        switch (error.status) {
            case 404:
                return res
                    .status(error.status)
                    .render('404', {
                        pageTitle: `User not Found`,
                        errorMessage: error.message
                    })
            default:
                return res.redirect('/');
        }
    }
};

export const remove = (req, res) => res.send('Remove User');
