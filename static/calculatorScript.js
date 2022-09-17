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

        // var list = clone.getElementsByTagName("datalist")[0];
        // list.id = "list " + ++this.count;

        var input = clone.getElementsByTagName("input")[1].list = list.id;

        document.getElementById(id).appendChild(clone);
    }

}

function appendChildWithSep(parent, child, sep) {
    parent.appendChild(child);
    parent.append(sep);
}

function addNewIngRow(IngListId) {
    var ul = document.getElementById(IngListId);
    ul.appendChild(createNewIngRow())
}

function createNewIngRow(){
    var ingRow = document.createElement("li");
    ingRow.class = "ingRow";

    var quantityIn = QuantityInput();
    appendChildWithSep(ingRow, quantityIn, " ");

    var unitsDropDown = UnitsDropDown();
    appendChildWithSep(ingRow, unitsDropDown, " ");

    var ingredientInput = IngredientInput();
    appendChildWithSep(ingRow, ingredientInput, " ");

    var deleteButton = DeleteButton();
    appendChildWithSep(ingRow, deleteButton, " ");

    return ingRow;
}

function QuantityInput(){
    var inputForQty = document.createElement("input");
    inputForQty.id = "qty";
    inputForQty.type = "number";
    inputForQty.name = "qty";
    inputForQty.class = "qty";
    inputForQty.step = "0.25";
    inputForQty.placeholder = "Quantity";
    inputForQty.setAttribute("required", "ture");

    return inputForQty
}

function UnitsDropDown() {
    var select = document.createElement("select");
    select.id = "unit";
    select.name = "unit";
    select.class = "unit";
    select.setAttribute("required", "true");

    addOptionToSelect(select, "", "Choose unit:", true)
    addOptionToSelect(select, "grams", "Grams", false);
    addOptionToSelect(select, "cups", "Cups", false);
    addOptionToSelect(select, "tbsp", "Tbsp", false);
    addOptionToSelect(select, "tsp", "Tsp", false);

    return select
}

function IngredientInput() {
    var ingredientInput = document.createElement("input");
    ingredientInput.id = "ingredient_name";
    ingredientInput.type = "text";
    ingredientInput.name = "ingredient";
    ingredientInput.class = "ingredient";
    ingredientInput.placeholder="Ingredient:"
    //ingredientInput.list="Ingredient 1"
    ingredientInput.setAttribute("required", "true");

    return ingredientInput
}

function DeleteButton() {
    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.onclick = function() {deleteElement(deleteButton.parentElement);};
    var deleteText = document.createTextNode("Delete");
    deleteButton.appendChild(deleteText);

    return deleteButton
}

// function makeStruct(names) {
//     var names = names.split(' ');
//     var count = names.length;
//     function constructor() {
//         for (var i = 0; i < count; i++) {
//             this[names[i]] = arguments[i];
//         }
//     }
//     return constructor;
// }


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
    element.parentElement.removeChild(element);
    // var ul = document.getElementById(IngListId);
    // element.remove();
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
    var ingDataRows = [];

    for(var i = 0; i < numOfIng; i++){
        var curr = rows[i];

        var quantity = curr.querySelector("[id='qty']");
        var unit = curr.querySelector("[id='unit']");
        var ingredientName = curr.querySelector("[id='ingredient_name']");

        var qtyDict = {};
        qtyDict["ingredient"] = ingredientName.value
        qtyDict["quantity"] = parseFloat(quantity.value)
        qtyDict["unit"] = (unit.value).trim().toLowerCase();

        ingDataRows.push(qtyDict);
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            var nutrientDict = JSON.parse(this.responseText);
            var keys = Object.keys(nutrientDict);
            var tableElement = document.createElement("table");

            document.getElementById("output").innerHTML = nutrientDict
            // for(var i = 0; i < keys.length; i++){
            //     var tableRow = document.createElement("tr");
            //     tableElement.appendChild(tableRow);
            //
            //     var nutTableData = document.createElement("td");
            //     var textData = document.createTextNode(keys[i]);
            //     nutTableData.appendChild(textData);
            //
            //     var qtyTableData = document.createElement("td");
            //     var qtyText = document.createTextNode(nutrientDict[keys[i]]);
            //     qtyTableData.appendChild(qtyText);
            //
            //     tableRow.appendChild(nutTableData);
            //     tableRow.appendChild(qtyTableData);
            // }
            // document.getElementById("output").appendChild(tableElement);
        }
    }
    xhttp.open("POST", "/getIngs", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(ingDataRows));
}