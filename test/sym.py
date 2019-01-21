import json
from pprint import pprint

with open("symptom_list.json") as f:
	symptom_list = json.load(f)

o = open("sym.csv", "w")
for symptom in symptom_list:
	name = symptom["Name"].replace(",", "")
	o.write(name + "," + str(symptom["ID"]) + "\n")

