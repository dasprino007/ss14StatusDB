const moongose = require('mongoose')
const fs = require('fs');
const { writeFile } = require('fs/promises');
const { default: mongoose } = require('mongoose');
const roundSchema = require('./schema/round');
let timer = 60000; // 60000 = 1 min
let rawdata = fs.readFileSync('Data/servers.json')
let serversUrl = JSON.parse(rawdata)

conectar().catch(erro => console.error(erro))

async function conectar(){
    await moongose.connect("mongodb://127.0.0.1:27017/test")
    .then(() => console.log("Mongo conectado"))
}

// TODO melhorar esse codigo
async function MapServers(){
    serversUrl.servers.map(server => {
        let obj;
            fetch(`http://${server.ip}/status`)
            .then(data => data.json())
            .then(data => obj = data)
            .then(async () => {
                const roundModel = await mongoose.model(obj.name, roundSchema)
                const round = await new roundModel({
                    name:obj.name,
                    round_id:obj.round_id,
                    players:obj.players,
                    map:obj.map,
                    preset:obj.preset,
                    round_start_time: obj.round_start_time
                })
                if(await roundModel.findOne({round_id: obj.round_id}).exec() == null)
                {
                    console.log("novo round")
                    round.save()
                    return
                }
                else if(obj.map == null){
                    console.log("esta no lobby")
                    return;
                }
                await roundModel.findOneAndUpdate({round_id : obj.round_id}, {map: obj.map});
                console.log(round)
                console.log("atualizo round")
            })
        })
}

