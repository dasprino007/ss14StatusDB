const fs = require('fs')
const promp = require('prompt-sync')();
const serversUrl = "./Data/servers.json"
const Rawfile = fs.readFileSync(serversUrl)
const file = JSON.parse(Rawfile)
let ip = promp("Coloque o ip do servidor: ")

fetch(`http://${ip}/status`)
.then(data => data.json())
.then(data => escreverArquivo(data.name, ip))
.catch(erro => console.error(erro))

function escreverArquivo(name, ip){
    let ipExist = false
    file.servers.map(files => {
        if(files.ip === ip){
        ipExist = true
        return
        }
    })
    if(ipExist){
    console.log("esse ip ja existe")
    return
    }

    file.servers.push({
        name:name,
        ip:ip
    })
    fs.writeFileSync(serversUrl,JSON.stringify(file, null, "\t"))
    console.log(`O Servidor ${name} adicionado`)
}

