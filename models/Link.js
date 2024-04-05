const mongoose = require('mongoose');

const LinkSchema = mongoose.Schema({
    ShortUrl: {
        type: String,
        require
    },
    OriginalUrl: {
        type: String,
        require
    },
    Count: {
        type: Number,
        default: 0
    }
});

const Link = mongoose.model('Link', LinkSchema);


module.exports = Link;