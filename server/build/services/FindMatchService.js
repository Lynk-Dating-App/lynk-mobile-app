"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Matcher {
    users;
    constructor(users) {
        this.users = users;
    }
    jaccardIndex(str1, str2) {
        const set1 = new Set(str1.split(' '));
        const set2 = new Set(str2.split(' '));
        const intersection = new Set([...set1].filter((word) => set2.has(word)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size;
    }
    findMatches(user, preferences) {
        return this.users.filter((otherUser) => {
            // Exclude the user themselves
            if (otherUser.id === user.id) {
                return false;
            }
            // Check age preference
            if (+otherUser.age < +preferences.pMinAge ||
                +otherUser.age > +preferences.pMaxAge) {
                return false;
            }
            // Check location preference
            // if (
            //   otherUser.state && otherUser.state !== preferences.pState
            // ) {
            //   return false;
            // }
            //check height
            if (otherUser.height !== null &&
                (+otherUser.height < +preferences.pMinHeight ||
                    +otherUser.height > +preferences.pMaxHeight)) {
                return false;
            }
            // Check gender preference
            if (otherUser.gender && otherUser.gender !== preferences.pGender) {
                return false;
            }
            if (preferences.pAbout) {
                const about = otherUser.about ? otherUser.about.toLowerCase() : '';
                const preferredAbout = preferences.pAbout.toLowerCase();
                const similarity = this.jaccardIndex(about, preferredAbout);
                const similarityThreshold = 0.1;
                if (similarity < similarityThreshold) {
                    return false;
                }
            }
            return true;
        });
    }
}
exports.default = Matcher;
//Threshhold
//   You can adjust the similarityThreshold value to 
//   control how strict or lenient the text matching 
//   should be. A higher threshold will require a closer 
//   match, while a lower threshold will allow for looser matches.
// Example usage:
//   const users = /* Your array of user objects */;
//   const matcher = new Matcher(users);
//   const user = /* The user for whom you want to find matches */;
//   const preferences = /* User's preferences */;
//   const matches = matcher.findMatches(user, preferences);
