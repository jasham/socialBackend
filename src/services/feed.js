const con = require("../helper/db");

const FeedService = {

    async saveFeed(userFeeds) {
        try {
            console.log("userFeeds=", userFeeds)
            const feedsToSave = userFeeds.feeds.map(feed => ({
                socialPlatformPostId: feed.id || null,
                feedData: feed.message || null,
                image: feed.picture || null,
                createdDate: feed.created_time || null,
                updatedDate: feed.updated_time || null,
                userId: userFeeds.userId, // Replace 'yourUserId' with the actual user ID
                accountId: 1, // Replace 'yourAccountId' with the actual account ID
            }));

            const savedFeeds = await con.feed.insertMany(feedsToSave);
            return savedFeeds;
        } catch (error) {
            console.error("Error saving feeds:", error);
            return null;
        }

    },

    async userFeeds(userId) {
        try {
            const userFeeds = await con.feed.find({ userId: userId });
            return userFeeds;
        } catch (error) {
            return null
        }
    },
};

module.exports = FeedService;
