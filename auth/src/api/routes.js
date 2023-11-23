const routes = (handler) => [
    {
        method: "GET",
        path: "/user/token",
        handler: (request, h) => handler.verifyNewUsernameHandler(request, h),
    }
]

module.exports = routes;