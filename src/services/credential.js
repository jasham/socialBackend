const con = require("../helper/db");
const { fbFeeds } = require("./socialConnect/fb");

const CredentialService = {

    async saveCredential(credential) {
        try {
            const saveRes = await con.credential.create(credential);
            if (saveRes) {
                const feeds = await fbFeeds(credential.accessToken)
                return feeds
            }
            return null;
        } catch (error) {
            return null
        }
    },
};

module.exports = CredentialService;
