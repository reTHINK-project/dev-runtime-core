/**
* The UserProfile according to User Identity Data Model
*/


class UserProfile {

  constructor(username, userURL, picture, name, locale, profile) {

    if (username) { this.preferred_username = username; }
    if (picture) { this.picture = picture; }
    if (name) { this.name = name; }
    if (locale) { this.locale = locale; }
    if (userURL) { this.userURL = userURL; }
    if (profile) Object.assign(this, profile);

  }
}

export default UserProfile;
