//Se Instalan modulos
const Jimp = require('jimp');
const http = require('http');
const url = require('url');
const fs = require('fs');

//Se Crea servidor
http
    .createServer((req, res) => {
        if (req.url == "/") {
            try {
                //Se asigna archivo HTML de Pagina Principal
                res.writeHead(200, {"Content-Type": "text/html"});
                let html = fs.readFileSync("index.html", "utf8");
                res.end(html);
            } catch (error) {
                res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"});
                res.end("<h1>Error del servidor</h1>");
            }
            //Se asigna archivo CSS para Pagina Principal
        } else if (req.url == '/estilos') {
            res.writeHead(200, {'Content-Type': 'text/css'})
            fs.readFile('./assets/css/style.css', (err, css) => {
                if (err) {
                    res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"});
                    res.end("<h1>Error del servidor</h1>");
                } else {
                    res.end(css);
                }
            });
            //Se asigna archivo CSS para Pagina de Error
        } else if (req.url == '/estilos_error') {
            res.writeHead(200, {'Content-Type': 'text/css'})
            fs.readFile('./assets/css/style2.css', (err, css) => {
                if (err) {
                    res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"});
                    res.end("<h1>Error del servidor</h1>");
                } else {
                    res.end(css);
                }
            });
        } else if (req.url.includes("/imagen")) {
            try {
                //Se envia dato URL de forma dinamica atravez del formulario
                let params = url
                    .parse(req.url, true)
                    .query;
                let {imagen} = params;
                Jimp.read(imagen, (err, imagen) => {
                    if (!err) {
                        {
                            //Se asignan valores a JIMP para procesamiento de imagen
                            imagen
                                .grayscale()
                                .quality(60)
                                .resize(350, Jimp.AUTO)
                                .writeAsync("newImg.jpg")
                                .then(() => {
                                    fs.readFile("newImg.jpg", (err, Imagen) => {
                                        res.writeHead(200, {"Content-Type": "image/jpeg"});
                                        res.end(Imagen);
                                    });
                                });
                        }
                    } else {
                        let respuestaHtml = fs.readFileSync("error.html", "utf8");
                        res.writeHead(400, {"Content-Type": "text/html; charset=utf-8"});
                        res.end(respuestaHtml);
                    }
                });
            } catch (error) {
                res.writeHead(400, {"Content-Type": "text/html; charset=utf-8"});
                res.end("<h1>Error del usuario/h1>");
            }
            //Se validan todos los demas datos atraves de un Try Catch
        } else {
            try {
                let respuestaHtml = fs.readFileSync("error.html", "utf8");
                res.writeHead(404, {"Content-Type": "text/html; charset=utf-8"});
                res.end(respuestaHtml);
            } catch (error) {
                console.log(error.message);
                res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"});
                res.end("<h1>Error del servidor</h1>");
            }
        }
    })
    //Se levanta servidor mediante puerto 8080
    .listen(8080, () => {
        console.log("Servidor corriendo en http://localhost:8080")
        //Se entrega PID desde .fork en yargs
        process.send(process.pid)
    });