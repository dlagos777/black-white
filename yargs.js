//Se Instalan modulos
const yargs = require('yargs');
const cp = require('child_process');

const key = '123'

const argv = yargs
    .command('acceso', 'Clave de acceso', {
        key: {
            describe: 'key',
            demand: true,
            alias: 'k'
        }
    }, (args) => {
        if (args.key == key) {
            const child = cp.fork("servidor.js")
            child.on("message",(message)=>{
                console.log(message)
            })
            console.log("Acceso permitido")
        } else {
            console.log('Clave incorrecta, Acceso denegado');
        }
    })
    .help()
    .argv