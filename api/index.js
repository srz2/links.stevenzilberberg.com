const bodyParser = require('body-parser')
const config = require('../config/config');
const Link = require('../models/Link')
const mongoose = require('mongoose')

const express = require('express');
const app = express();

// Setup body parser
const parser = bodyParser.json();
bodyParser.urlencoded({extended: true})
app.use(parser)

// Setup Db
const uri = `mongodb+srv://${config.DB.LINKS.Username}:${config.DB.LINKS.Password}@cluster0.5398r.mongodb.net/${config.DB.LINKS.Name}?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(uri, {

})
.then(() => {
    console.log('Connected to the Database')
})
.catch(err => {
    console.log('Database Connect Error:', err)
    console.log('Terminating application')
    process.exit(1);
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Short link api"        
    })
})

app.get('/links/list', async (req, res) => {
    const links = await Link.find({});
    let shortLinks = []
    links.map(x => {
        shortLinks.push(x.ShortUrl)
    })
    res.status(200).json({
        count: links.length,
        message: "list all the links",
        shortLinks: shortLinks,
        links: links
    })
});

// Redirect to an existing link
app.get('/:linkId', async (req, res) => {
    const part = req.params.linkId;

    const existingLink = await Link.findOne({
        ShortUrl: part
    }).then(link => {
        if (link) {
            // res.status(200).json({
            //     "message": "go to link",
            //     link: link,
            //     ShortUrl: `${config.REDIRECT_URL}/${link.ShortUrl}`,
            //     RedirectUrl: link.OriginalUrl
            // })
            res.redirect(link.OriginalUrl);
        } else {
            res.status(404).json({
                "message": 'Short link does not exist',
            })
        }
    })
    .catch(err => {
        console.log('Unexpected error')
        console.log(err)
        res.status(500).json({
            "message": 'unknown error',
            error: err,
            status: 500
        })
    })
});

// Get an existing link stats
app.get('/:linkId/stats', async (req, res) => {
    const linkId = req.params.linkId;
    console.log(linkId)

    const existingLink = await Link.findOne({
        ShortUrl: linkId
    }).then(link => {
        if (link) {
            res.status(200).json({
                "message": 'Short link stats for: ' + linkId,
                "link": link
            })
        } else {
            res.status(404).json({
                "message": 'Short link stats does not exist'
            })
        }
    }).catch(err => {
        console.log('Unexpected error')
        console.log(err)
        res.status(500).json({
            "message": 'unknown error',
            error: err,
            status: 500
        })
    })
})

// Create a new short link
app.post('/', async (req, res) => {    
    const existingLink = await Link.findOne({ShortUrl: req.body.ShortUrl})
    if (existingLink) {
        res.status(409).json({
            "message": "Link already exists",
            "id": existingLink._id,
            "RedirectUrl": existingLink.OriginalUrl
        })
        return;
    }

    // Prevent 'links' to be created
    if (req.body.ShortUrl === 'links'){
        res.status(405).json({
            "message": "short link url of 'links' is not allowed",
        })
        return;
    }

    // Require Short and Original Urls
    if (!req.body.ShortUrl || !req.body.OriginalUrl){
        res.status(400).json({
            "message": "short and original urls are required",
            "ShortUrl": req.body.ShortUrl ?? 'Not Given',
            'OriginalUrl': req.body.OriginalUrl ?? 'Not Given'
        })
        return;
    }

    // Append http to url if missing
    let redirectUrl = req.body.OriginalUrl;
    if (!(req.body.OriginalUrl.startsWith('http://') || req.body.OriginalUrl.startsWith('https://'))){
        console.log('Adding missing protocol')
        redirectUrl = `https://${redirectUrl}`
    }

    const newLink = new Link({
        ShortUrl: req.body.ShortUrl,
        OriginalUrl: redirectUrl
    })
    await newLink.save();

    return res.status(201).json({
        "message": "created link",
        "id": newLink._id,
        "Link": newLink
    })
});

app.delete('/:linkId', async (req, res) => {
    const linkId = req.params.linkId;
    console.log(linkId);

    const existingLink = await Link.findOne({_id: linkId})
    .then(async (link) => {
        if (!link){
            res.status(404).json({
                'message': 'Unable to delete link, it does not exist',
                'id': linkId
            })
        } else {
            await Link.deleteOne({
                _id: linkId
            }).then(result => {
                console.log('Successfully deleted ' + linkId)
                res.status(200).json({
                    message: 'Successfully deleted link',
                    id: linkId
                })
            }).catch(err => {
                console.log('Failed to delete ' + linkId)
                res.status(500).json({
                    message: 'Failed to delete link',
                    error: err
                })
            })
        }
    })
})

// Start the server
console.log('Starting server...')
app.listen(config.PORT, () => {
    console.log(`Listening to ${config.PORT}`)
})

module.exports = app;