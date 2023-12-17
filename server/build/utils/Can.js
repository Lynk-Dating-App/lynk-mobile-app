"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ability_1 = require("@casl/ability");
class Can {
    static defineRulesFor = (req) => {
        const permissions = req.permissions; //Get permissions from json payload
        const { can, rules } = new ability_1.AbilityBuilder(ability_1.Ability);
        //Loop through permissions and define Casl rules for handling permissions
        permissions.forEach((value) => {
            can(value.action, value.subject); //set actions and subject for Casl permission
        });
        return rules;
    };
}
exports.default = Can;
