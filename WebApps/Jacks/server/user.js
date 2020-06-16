class User {
    constructor(id, username, hash, frequent) {

        if (id != null) {
            this.id = id;
        }

        this.username = username;
        this.hash = hash;
        this.frequent = frequent;
    }

}

module.exports = User;