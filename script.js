const moongose = require('mongoose')
const fs = require('fs');
const { writeFile } = require('fs/promises');
const { default: mongoose } = require('mongoose');
const roundSchema = require('./schema/round');
const playerSchema = require('./schema/playersTime')
let rawdata = fs.readFileSync('Data/servers.json')
let serversUrl = JSON.parse(rawdata)

// varibles
let timer = 60000; // 60000 = 1 min
const db = "test"

conectar("mongodb://127.0.0.1:27017/"+ db).catch(erro => console.error(erro))

// TODO melhorar esse codigo
async function MapServers(){
    serversUrl.servers.map(server => {
            fetch(`http://${server.ip}/status`)
            .then(data => data.json())
            .then(data => {
                const obj = data
                console.log(obj.name)
                addround(obj.name, obj.round_id, obj.players, obj.map, obj.preset, obj.round_start_time)
                addPlayerTime(obj.name, obj.round_id, obj.map, obj.players, obj.preset)
            })
        })
}

// functions

async function conectar(url){
    await moongose.connect(url)
    .then(() => console.log("Mongo conectado"))
}

async function addround(name, round_id, players, map, preset, round_start_time){
    const roundModel = mongoose.model(name, roundSchema)
    const round = new roundModel({
    name:name,
    round_id:round_id,
    players:players,
    map:map,
    preset:preset,
    round_start_time: round_start_time
})
const FindRound = roundModel.findOne({round_id: round_id}).exec()
// limpar codigo
if(await FindRound == null){
    console.log("novo round")
    round.save()
    return
}
else if(map == null){
    console.log("esta no lobby")
    return;
}
    await roundModel.findOneAndUpdate({round_id : round_id}, {map: map, round_start_time:round_start_time});
    console.log(round)
    console.log("atualizo round")
}

async function addPlayerTime(name, round_id, map, players, preset){
    const playerModel = moongose.model(`${name} - playerTime`, playerSchema)
    const playertime = new playerModel({
        name : name,
        round_id: round_id,
        players : players,
        map : map,
        preset: preset,
    })
    playertime.save()
    console.log("player time salvo")
}

setInterval(MapServers, timer*15)