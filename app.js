var express= require("express");
var seneca = require("seneca")();
var plugin = require("./product-storage.js");
seneca.use(plugin);
seneca.use("seneca-entity");

let getreq = 0;
let postreq = 0;
seneca.add("role:api, cmd:product", function (args, done) {
    // for the POST method
    if (args.req$.method == "POST") {
        postreq++;
        console.log("> products POST: received the request")
        var pro = {
            pro: args.pro,
            price: args.price,
            category: args.category,
        };
        seneca.act({
                role: "pro",
                cmd: "add",
                data: pro
            },
            function (err, print) {
                console.log("< products POST: sending the response")
                done(err, print);
            }
        );
    }
    // for the GET method
    if (args.req$.method == "GET") {
        getreq++;
        console.log("> products GET: received the request")
        seneca.act({
            role: "pro",
            cmd: "get-all"
        }, function (err, print) {
            console.log("< products GET: sending the response")
            done(err, print);
        });
    }
    // for the DELETE method
    if (args.req$.method == "DELETE") {
        console.log("> products DELETE: received the request")
        seneca.act({
            role: "pro",
            cmd: "get-all"
        }, function (err, print) {
            for (const item of print) {
                seneca.act({
                        role: "pro",
                        cmd: "delete",
                        id: item.id
                    },
                    function (err, print) {}
                );
            }
            console.log("< products DELETE: sending response")
            done(err, {
                message: "It is Deleted successfully."
            });
        });
    }
    console.log(`Processed Request Count--> Get:${getreq}, Post:${postreq}`)
    
});

seneca.act("role:web", {
    use: {
        prefix: "/api",
        pin: {
            role: "api",
            cmd: "*"
        },
        map: {
            pro: {
                GET: true,
                POST: true,
                DELETE: true
            },
        },
    },
});

var application = express();
application.use(require("body-parser").json());
application.use(seneca.export("web"));
const HOST = "127.0.0.1"
const PORT = 3009;
application.listen(PORT, HOST, function(){
    console.log(`Server is listening on ${HOST}:${PORT}`);
    console.log("The Endpoints are");
    console.log(`The POST method is: POST -->  http://${HOST}:${PORT}/api/pro 
    example: {“product name”:”Laptop”, “price”:201.99, “category”:”PC”}`);
    console.log(`The GET method is: GET --> http://${HOST}:${PORT}/api/pro`);
    console.log(`The DELETE method is: DELETE --> http://${HOST}:${PORT}/api/pro`);
});