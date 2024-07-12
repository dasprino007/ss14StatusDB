const moongose = require('mongoose')
const fs = require('fs');
const { writeFile } = require('fs/promises');
const { default: mongoose } = require('mongoose');
const roundSchema = require('./schema/round');
const playerSchema = require('./schema/playersTime')
const mapSchema = require('./schema/maps')
let rawdata = fs.readFileSync('Data/servers.json')
let serversUrl = JSON.parse(rawdata)

// varibles
let timer = 60000; // 60000 = 1 min
const db = "test"

conectar("mongodb://127.0.0.1:27017/"+ db).catch(erro => console.error(erro))

async function conectar(url){
    await moongose.connect(url)
    .then(() => console.log("Mongo conectado"))
}

// transfomar isso em uma classe
// TODO melhorar esse codigo
async function MapServers(){
    serversUrl.servers.map(server => {
        let obj;
            fetch(`http://${server.ip}/status`)
            .then(data => data.json())
            .then(data => {
                obj = data
            })
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
                addMapList(obj.name, obj.map)
                await roundModel.findOneAndUpdate({round_id : obj.round_id}, {map: obj.map});
                console.log(round)
                console.log("atualizo round")
                addPlayerTime(obj.name, obj.round_id,obj.map, obj.players, obj.preset)
            })
        })
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

async function addMapList(name, mapp){
    const roundModel = mongoose.model(name, roundSchema)
    const mapModel = moongose.model(`${name} - MapsCount`, mapSchema)
    const findMap = await roundModel.find({map: mapp}).exec()
    const findCountMap = await mapModel.find({map: mapp}).exec()
    console.log(findMap.length)
    console.log(findCountMap.length)
    if(findMap.length == 0 || findMap.length == null)
    return
    
    else if(mapp == null)
    return

    else if(findCountMap.length == 0){
    const mapping = new mapModel({
        name: name,
        map: mapp,
        HowManyTimesWasPlayed : findMap.length
    })
    await mapping.save()
    }
    else if( findMap.length > 1 && findMap.length > findCountMap.HowManyTimesWasPlayed){
        await mapModel.findOneAndUpdate({map: mapp},{HowManyTimesWasPlayed :  findMap.length})
        console.log("mapa atualizado")
    }
    
}

setInterval(MapServers, timer*15)
