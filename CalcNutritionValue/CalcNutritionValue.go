package CalcNutritionValue

import (
	"NutritionCalculator/CalcNutritionValue/request_structs"
	"NutritionCalculator/CalcNutritionValue/response_sructs"
	"NutritionCalculator/utils"
	"encoding/json"
	"fmt"
	"github.com/labstack/echo/v4"
	"io"
	"strings"
)

// -----------------------------------------------------------------------------
var KEY = "5qQcXubJLrxma9dVuAMnjmSwLq7dJYLgwor07ULI"

// -----------------------------------------------------------------------------
type CalcNutritionValue struct {
	client         *utils.HttpClient
	ingredientRows []request_structs.RequestIngredientRow
}

// -----------------------------------------------------------------------------
func NewCalcNutritionValue(c echo.Context) (*CalcNutritionValue, error) {
	reqBody := c.Request().Body
	reqData, err := io.ReadAll(reqBody)
	if err != nil {
		return nil, fmt.Errorf("io.ReadAll returned an error: %v", err)
	}
	var ingredientRows []request_structs.RequestIngredientRow
	err = json.Unmarshal(reqData, &ingredientRows)
	if err != nil {
		return nil, fmt.Errorf("json.Unmarshal returned an error: %v", err)
	}
	fmt.Println("INFO: GetNutritionValue reqMap")
	fmt.Printf("%#v", ingredientRows)
	return &CalcNutritionValue{
		utils.NewHttpClient(),
		ingredientRows,
	}, nil
}

// -----------------------------------------------------------------------------
func (this *CalcNutritionValue) GetNutritionValue() (*response_sructs.NutritionValueRow, error) {
	res := &response_sructs.NutritionValueRow{}

	for _, key := range this.ingredientRows {
		foodData, err := this.getNutritionDataForQuery(key.Ingredient)
		if err != nil {
			return nil, fmt.Errorf("getNutritionDataForQuery returned an error: %v", err)
		}

		for _, nutrient := range foodData.FoodNutrients {
			//todo request measurement unit... nutrient.UnitName
			nutrientValue, err := this.calcNutrientValue(nutrient.Value, key.Quantity, key.Unit)
			if err != nil {
				return nil, fmt.Errorf("calcNutrientValue returned an error: %v", err)
			}

			switch nutrient.NutrientName {
			case "Energy":
				res.Energy += nutrientValue
			case "Protein":
				res.Protein += nutrientValue
			case "Total lipid (fat)":
				res.Fat += nutrientValue
			case "Carbohydrate, by difference":
				res.Carbohydrate += nutrientValue
			case "Sugars, total including NLEA":
				res.Sugars += nutrientValue
			case "Sodium, Na":
				res.Sodium += nutrientValue
			default:
				fmt.Printf("Info: unknown nutrient name: %v\n", nutrient.NutrientName)
			}
		}
	}

	return res, nil
}

// -----------------------------------------------------------------------------
func (this *CalcNutritionValue) calcNutrientValue(nutrientValue float64, qty float64, measurementUnit string) (float64, error) {
	var value float64

	switch strings.ToLower(measurementUnit) {
	case "grams":
		value = qty * nutrientValue
	case "cups":
		value = 8 * 29.57 * qty * nutrientValue
	case "tbsp":
		value = 0.5 * 29.57 * qty * nutrientValue
	case "tsp":
		value = 1 / 6 * 29.57 * qty * nutrientValue
	default:
		return 0, fmt.Errorf("calcNutrientValue, unkown type of measurement: %v", measurementUnit)
	}

	return value / 100, nil
}

// -----------------------------------------------------------------------------
func (this *CalcNutritionValue) getNutritionDataForQuery(query string) (*response_sructs.FoodData, error) {
	var res *response_sructs.FoodData
	var err error

	for i := 1; i < 11 && res == nil; i++ {
		res, err = this.getNutritionDataForQueryByPage(query, i)
		if err != nil {
			return nil, fmt.Errorf("getNutritionDataForQueryByPage returned an error: %v", err)
		}
	}

	if res == nil {
		return nil, fmt.Errorf("getNutritionDataForQueryByPage failed to find a match for query: %v, please try a different search", query)
	}

	return res, nil
}

// -----------------------------------------------------------------------------
func (this *CalcNutritionValue) getNutritionDataForQueryByPage(query string, page int) (*response_sructs.FoodData, error) {
	//query = strings.ToUpper(query)
	params := map[string]string{"api_key": KEY, "query": query, "numberOfResultsPerPage": "15", "pageSize": "15", "pageNumber": "1"}
	headers := map[string]string{"api_key": KEY}
	res, err := this.client.SendGetRequest("https://api.nal.usda.gov/fdc/v1/foods/search", nil, params, headers)
	if err != nil {
		return nil, fmt.Errorf("getRequestWithHeader returned an error: %v", err)
	}
	defer func() {
		err = res.Body.Close()
		if err != nil {
			fmt.Printf("INFO: res.Body.Close(), returned an error: %v", err)
		}
	}()

	bodyData, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("io.ReadAll returned an error: %v", err)
	}
	var data map[string]interface{}
	var foodData *response_sructs.FoodsData
	err = json.Unmarshal(bodyData, &data)
	if err != nil {
		return nil, fmt.Errorf("json.Unmarshal returned an error: %v", err)
	}
	err = json.Unmarshal(bodyData, &foodData)
	if err != nil {
		return nil, fmt.Errorf("json.Unmarshal returned an error: %v", err)
	}

	for _, food := range foodData.Foods {
		if strings.ToLower(food.Description) == strings.ToLower(query) {
			return &food, nil
		}
	}

	return nil, nil
}

//-----------------------------------------------------------------------------
