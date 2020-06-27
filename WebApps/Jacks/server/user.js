class User {
  constructor(id, username, password, frequent) {
    if (id != null) {
      this.id = id;
    }

    this.username = username;
    this.password = password;
    this.frequent = frequent;
  }
}

module.exports = User;
