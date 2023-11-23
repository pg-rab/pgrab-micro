const autoBind = require('auto-bind');

class UsersHandler {
    constructor(usersService) {
        this._usersService = usersService;

        autoBind(this);
    }

    async verifyNewUsernameHandler(request, h) {
        const data = await this._usersService.verifyNewUsername();
        return h.response(data);
    }
}

module.exports = UsersHandler;