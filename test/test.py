import requests
import json

url = 'http://localhost:3333/short'
payload = {'origUrl': 'https://www.google.com/'}

req = requests.post(url, json=payload)
print('Status: ', req.status_code)
print(json.dumps(req.json(), indent=4))
