import Video from "../models/Video";

export const trending = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ createdAt: 'desc' });
        return res.render('home', { pageTitle: 'Home', videos: videos?.reverse() });
    } catch (error) {
        console.warn(error)
    }
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render('404', { pageTitle: 'Video Not Found' });
    }
    return res.render('watch', { pageTitle: video.title, video });
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render('404', { pageTitle: 'Video Not Found' });
    }
    return res.render('Edit', {
        pageTitle: `Editing ${video.title}`,
        video
    });
}

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.render('404', { pageTitle: 'Video Not Found' });
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    })
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render('upload', { pageTitle: `Upload Video` });
}

export const postUpload = async (req, res) => {
    try {
        const { title, description, hashtags } = req.body;
        const saveRes = await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        console.log(saveRes);
        return res.redirect('/');
    } catch (error) {
        console.error('error => ', error);
        return res.render('upload', {
            pageTitle: `Upload Video`,
            errorMessage: error?._message
        });
    }
}

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await Video.findByIdAndDelete(id);
        return res.redirect('/');
    } catch (error) {
        console.error('error while delete => ', error);
    }
}

export const search = async (req, res) => {
    try {
        const { keyword } = req.query;
        const videos = keyword ? await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        }) : [];

        return res.render('search', { pageTitle: `Search`, videos: videos ?? [], keyword });
    } catch (error) {
        console.error('error while Search => ', error);
    }
}
