import authEndpoints from "./auth.endpoints";
import roleEndpoints from "./role.endpoints";
import subscriptionEndpoints from "./subscription.endpoint";
import adminEndpoints from "./admin.endpoints";
import userEndpoints from "./user.endpoints";

const endpoints = adminEndpoints
    .concat(roleEndpoints)
    .concat(authEndpoints)
    .concat(userEndpoints)
    .concat(subscriptionEndpoints);

export default endpoints;