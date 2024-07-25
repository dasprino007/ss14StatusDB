from pymongo import MongoClient
import datetime
import json
from bson import json_util
import re
import matplotlib.pyplot as plt
from zoneinfo import ZoneInfo

client = MongoClient("localhost",27017)
db = client.test
pirata = db["[br][mrp] estação pirata - playertimes"]
deltav = db["[en][mrp] delta-v (ψ) | apoapsis [us east 1] - playertimes"]

teste = re.compile(r"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)")
date_format = '%Y-%m-%dT%H:%M:%S.%fZ'
fig, ax = plt.subplots()
tempo = 1 ## grafico das ultimas 24 horas

def arraymapa(db, name, data1, data2):
    ## variaveis para o grafico
    d = data1
    d1 = data2
    players = []
    timePlayers = []

    for round in db.find({"Time_date": {"$lte": d1, "$gte":d}}) :
        round_sanitized = json.loads(json_util.dumps(round))
        data = teste.search(str(round_sanitized["Time_date"])).group()
        date = datetime.datetime.strptime(data, date_format)
        date = date.strftime("%H:%M")
        
        timePlayers.append(date) 
        players.append(round_sanitized["players"]) 
    
    ax.plot(timePlayers, players, label = name)
    ax.scatter(timePlayers, players)

arraymapa(deltav, "delta-v", datetime.datetime(2024,7,24),datetime.datetime(2024,7,25))
plt.gcf().autofmt_xdate()
ax.legend()
plt.show()