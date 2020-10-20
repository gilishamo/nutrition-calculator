function duplicate(id){
	var children = document.getElementById(id).children;
	var len = children.length;
	var originalRow = children[0]; 

	if(originalRow == null){
		createNewIngRow(id);
		this.count = 'undifined';
	}
	
	else{
		if(!this.count || this.count == 'undifined'){
			this.count = 1;
		}
		var clone = originalRow.cloneNode(true);

		clearInput(clone);
		
		var list = clone.getElementsByTagName("datalist")[0];
		list.id = "list " + ++this.count;

		var input = clone.getElementsByTagName("input")[1].list = list.id;

		document.getElementById(id).appendChild(clone);
	}

}

function createNewIngRow(id){
		var div = document.createElement("div");
		div.class = "ingRow";

		var inputForQty = document.createElement("input");
		inputForQty.type = "number";
		inputForQty.name = "qty";
		inputForQty.class = "qty";
		inputForQty.step = "0.25";
		inputForQty.placeholder = "Quantity";
		inputForQty.setAttribute("required", "ture");

		div.appendChild(inputForQty);

		var select = document.createElement("select");
		select.name = "unit";
		select.class = "unit";
		select.setAttribute("required", "true");

		addOptionToSelect(select, "", "Choose unit:", true)
		addOptionToSelect(select, "grams", "Grams", false);
		addOptionToSelect(select, "cups", "Cups", false);
		addOptionToSelect(select, "tbsp", "Tbsp", false);
		addOptionToSelect(select, "tsp", "Tsp", false);

		div.appendChild(select);

		var inputForIngredient = document.createElement("input");
		inputForIngredient.type = "text";
		inputForIngredient.name = "ingredient";
		inputForIngredient.class = "ingredient";
		inputForIngredient.placeholder="Ingredient:"
		inputForIngredient.list="Ingredient 1"
		inputForIngredient.setAttribute("required", "true");

		div.appendChild(inputForIngredient);

		var datalist = document.createElement("datalist");
		datalist.id = "list 1";

		inputForIngredient.list = datalist.id;

		div.appendChild(datalist);

		var deleteButtom = document.createElement("button");
		deleteButtom.type = "button";
		deleteButtom.onClick = "deleteElement(this.parentElement)"
		deleteText = document.createTextNode("Delete");
		deleteButtom.appendChild(deleteText);

		div.appendChild(deleteButtom);

		document.getElementById(id).appendChild(div);
}



function addOptionToSelect(element, elementValue, text, disabled){
	var option = document.createElement("option");
		option.setAttribute("value", elementValue);
		text = document.createTextNode(text);
		if(disabled){
			option.setAttribute("selected", "true");
			option.setAttribute("disabled", "selected");
		}
		option.appendChild(text);
		element.appendChild(option);
}

function deleteElement(element){
	element.remove();
}

function clearInput(element){
	var inputArray = element.getElementsByTagName("input");
	var selectArray = element.getElementsByTagName("select");
	for(var i = 0; i < inputArray.length; i++){
		var curr = inputArray[i];
		switch(curr.type){
			case 'text':
				curr.value = '';
				break;
			case 'number':
				curr.value = '';
				break
		}
	}

	for(i = 0; i < selectArray.length; i++){
		var curr = selectArray[i];
		curr.value = '';
	}
}


function calculateNutritionValue(id){
	var numOfIng = document.getElementById(id).childElementCount;
	var ingArray = [], qtyArray = [], rows = document.getElementById(id).children;
	var ingQtyDict = {};

	for(var i = 0; i < numOfIng; i++){
		var curr = rows[i];
		
		var input = curr.getElementsByTagName("input");
		var select = curr.getElementsByTagName("select");
		

		ingArray.push(((input[1].value).trim()).toLowerCase());
		console.log(input[1].value);
		var qty = [];
		qty.push(((input[0].value).trim()).toLowerCase());
		qty.push(select[0].value);

		qtyArray.push(qty);

		ingQtyDict[ingArray[i]] = qtyArray[i];

	}

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
			var nutrientDict = JSON.parse(this.responseText);
			var keys = Object.keys(nutrientDict);
			var tableElement = document.createElement("table");

			for(var i = 0; i < keys.length; i++){
				var tableRow = document.createElement("tr");
				tableElement.appendChild(tableRow);

				var nutTableData = document.createElement("td");
				var textData = document.createTextNode(keys[i]);
				nutTableData.appendChild(textData);

				var qtyTableData = document.createElement("td");
				var qtyText = document.createTextNode(nutrientDict[keys[i]]);
				qtyTableData.appendChild(qtyText);

				tableRow.appendChild(nutTableData);
				tableRow.appendChild(qtyTableData);
			}
			document.getElementById("output").appendChild(tableElement);
		}
	}
	xhttp.open("POST", "http://127.0.0.1:5000/getIngs", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send(JSON.stringify(ingQtyDict));
}


