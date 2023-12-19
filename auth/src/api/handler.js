const autoBind = require("auto-bind");
const Boom = require("@hapi/boom");

class UsersHandler {
  constructor(usersService) {
    this._usersService = usersService;

    autoBind(this);
  }

  async verifyNewUsernameHandler(request, h) {
    // const data = await this._usersService.verifyNewUsername();
    const data = await this._usersService.verifyUserCredential(
      "afdi",
      "afdi12345"
    );
    return h.response(data);
    // return Boom.unauthorized();
  }
}

module.exports = UsersHandler;
