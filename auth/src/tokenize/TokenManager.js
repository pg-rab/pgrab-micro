const Jwt = require('@hapi/jwt');
const Boom = require('@hapi/boom');

const TokenManager = {
    generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
    verifyAccessToken: (accessToken) => {
        try {
            const artifacts = Jwt.token.decode(accessToken);
            Jwt.token.verifySignature(artifacts, process.env.ACCESS_TOKEN_KEY);
            const { payload } = artifacts.decoded;
            return payload;
        } catch (error) {
            throw new Boom.badRequest('Refresh token tidak valid');
        }
    },
};

module.exports = TokenManager;