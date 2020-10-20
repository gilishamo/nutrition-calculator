/*inputElement is the text field element */
function autocompleteFunc(inputElement){
	var curretnFocus;
	getArrayForAutocomplete(inputElement);
}

function createAutocompleteText(inputElement, array){
	var listElement = inputElement.list;

	closeAllLists(listElement);

	for(var i = 0; i < array.length; i++){
		var option = document.createElement("option");
		option.value = array[i].toLowerCase();
		listElement.appendChild(option);
	}
}

function getArrayForAutocomplete(inputElement){
	var val = inputElement.value
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
			var array = JSON.parse(xhttp.responseText);
			createAutocompleteText(inputElement, array);
		}
	}
	xhttp.open("POST", "http://127.0.0.1:5000/getAutocomplete", true);
	xhttp.setRequestHeader("Content-Type", "application/json");
	myData = JSON.stringify(val);
	xhttp.send(myData);
}

function closeAllLists(listElement){
	while(listElement.firstElementChild){
		listElement.removeChild(listElement.lastElementChild);
	}

}

