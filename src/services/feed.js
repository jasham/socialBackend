const con = require("../helper/db");

const FeedService = {

    async saveFeed(feed) {
        try {
            const saveRes = await con.feed.create(feed);
            return saveRes;
        } catch (error) {
            return null
        }
    },

    async userFeeds(feed) {
        try {
            //const saveRes = await con.feed.find();
            return true;
        } catch (error) {
            return null
        }
    },
};

module.exports = FeedService;
