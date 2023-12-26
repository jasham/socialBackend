const con = require("../helper/db");

const CredentialService = {

    async saveCredential(credential) {
        try {
            const saveRes = await con.credential.create(credential);
            return saveRes;
        } catch (error) {
            return null
        }
    },
};

module.exports = CredentialService;
