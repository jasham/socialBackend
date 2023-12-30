const con = require("../helper/db");
const { saveFeed } = require("./feed");
const { fbFeeds, checkAccessTokenExpiry } = require("./socialConnect/fb");

const CredentialService = {

    async saveCredential(credential) {
        try {
            const accessTokenValidity = await checkAccessTokenExpiry(credential.accessToken)
            credential.expireOn = accessTokenValidity.expireOn;
            credential.createdOn = accessTokenValidity.createdOn
            const saveRes = await con.credential.create(credential);
            if (saveRes) {
                const feeds = await fbFeeds(credential.accessToken, accessTokenValidity.status)
                const saveFeedsRes = await saveFeed({ feeds, userId: credential.userId })
                console.log("saveFeedsRes=", saveFeedsRes)
                return true
            }
            return null;
        } catch (error) {
            return null
        }
    },
};

module.exports = CredentialService;
