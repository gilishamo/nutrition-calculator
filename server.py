from flask import Flask
from flask import request
#from flask import render_html
from flask_cors import CORS
import urllib
import json

KEY = "5qQcXubJLrxma9dVuAMnjmSwLq7dJYLgwor07ULI"

app = Flask(__name__, static_url_path='')
CORS(app)

@app.route('/')
def calcPage():
	#return render_html('calculator.htm')
	page = open('calculator.htm', 'r').read()
	return page

@app.route('/getAutocomplete', methods=['POST'])
def getAutocomplete():
	ing = str(request.json)

	url = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + KEY + "&query="

	searchWord = ing.replace(" ", "%20")
	data = urllib.request.urlopen(url + searchWord + "&pageSize=10&requireAllWords=true").read()
	dictionary = json.loads(data)

	foodArray = []
	for food in dictionary['foods']:
		foodArray.append(food['description'])

	return json.dumps(foodArray)


@app.route('/getIngs' , methods=['POST'])
def myGetIngs():
	ingQtyDict = request.json
	ingArray = list(ingQtyDict.keys())
	ingIdArray = getId(ingQtyDict)
	nutValDict = getNutVal(ingArray, ingIdArray)

	calcDict = {'energy':0, 'fat':0, 'sodium':0, 'protein':0, 'carbohydrate':0, 'sugars':0}

	for ing in nutValDict:
		for item in nutValDict[ing]:
			nutrient = item['nutrient']['name']
			calc = clacNutrientValForItem(float(item['amount']), float(ingQtyDict[ing.strip().lower()][0]), ingQtyDict[ing.strip().lower()][1])
			if (nutrient == 'Total lipid (fat)'):
				calcDict['fat'] += calc

			elif(nutrient == 'Sodium, Na'):
				calcDict['sodium'] += calc

			elif(nutrient == 'Protein'):
				calcDict['protein'] += calc

			elif(nutrient == 'Carbohydrate, by difference'):
				calcDict['carbohydrate'] += calc

			elif(nutrient == 'Energy'):
				calcDict['energy'] += calc

			elif(nutrient == 'Sugars, total including NLEA'):
				calcDict['sugars'] += calc

	return json.dumps(calcDict)

def clacNutrientValForItem(amount, qty, measurmentUnit):
	calc = 0

	if (measurmentUnit == 'grams'):
		calc = qty * amount

	elif(measurmentUnit == 'cups'):
		calc = 8 * 29.57 * qty * amount 

	elif(measurmentUnit == 'tbsp'):
		calc = 0.5 * 29.57 * qty * amount

	elif(measurmentUnit == 'tsp'):
		calc = 1/6 * 29.57 * qty * amount

	return calc/100
	
def getId(ingQtyDict):
	url = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + KEY + "&query="
	ingArray = list(ingQtyDict.keys())
	ingIdArray = []

	for i in range(len(ingArray)):
		ing = ingArray[i]
		searchWord = ing.replace(" ", "%20")
		pageNumber = 1 
		data = urllib.request.urlopen(url + searchWord + "&requireAllWords=true").read()
		dictionary = json.loads(data)
		j = 0;
		while(((dictionary['foods'][j]['description']).strip()).lower() != (ing.strip()).lower()):
			j+= 1
			if (j == 49): #each page contains 50 results, if j==49 we reached the end of the current page hence we request the next page
				pageNumber += 1
				data = urllib.request.urlopen(url + searchWord + "&pageNumber=" + str(pageNumber) + "&requireAllWords=true").read()
				dictionary = json.loads(data)
				j = 0

		ingIdArray.append(dictionary['foods'][j]['fdcId'])
	
	return ingIdArray

def getNutVal(ingArray, ingIdArray):
	url = "https://api.nal.usda.gov/fdc/v1/food/"
	nutValDict = dict();

	for i in range(len(ingArray)):
		ingId = ingIdArray[i]
		ing = ingArray[i]

		data = urllib.request.urlopen(url + str(ingId) + "?api_key=" + KEY).read()
		dictionary = json.loads(data)
		nutValOfIngList = dictionary['foodNutrients']

		nutValDict[ing] = nutValOfIngList

	return nutValDict
