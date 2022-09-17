package request_structs

// -----------------------------------------------------------------------------
type RequestIngredientRows []RequestIngredientRow

// -----------------------------------------------------------------------------
type RequestIngredientRow struct {
	Ingredient string  `json:"ingredient"`
	Quantity   float64 `json:"quantity"`
	Unit       string  `json:"unit"`
}

//-----------------------------------------------------------------------------
