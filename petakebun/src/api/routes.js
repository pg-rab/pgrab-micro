const routes = (handler) => [
    {
        method: "GET",
        path: "/petaks",
        handler: (request, h) => handler.getPetaksHandler(request, h)
    },
    {
        method: "GET",
        path: "/petaks/{id}",
        handler: (request, h) => handler.getPetakByIdHandler(request, h)
    },
    {
        method: "PUT",
        path: "/petaks/{id}",
        handler: (request, h) => handler.putPetakByIdHandler(request, h)
    },
]

module.exports = routes;