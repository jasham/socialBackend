const { saveFeed } = require("../services/feed");
const express = require("express");
const router = express.Router();

const FeedController = {

    async save(req, res) {
        try {
            const saveRes = await saveFeed(req.body);
            res.status(201).json(saveRes);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async list(req, res) {
        try {
            let userId = req.params.userid;
            const list = await userFeeds(userId);
            res.status(201).json(list);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

router.post("/feed", FeedController.save);
router.get("/feed/:userid", FeedController.list);

module.exports = router;
