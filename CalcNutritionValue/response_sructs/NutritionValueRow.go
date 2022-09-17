package response_sructs

// -----------------------------------------------------------------------------
type NutritionValueRow struct {
	Energy       float64 `json:"energy"`
	Fat          float64 `json:"fat"`
	Sodium       float64 `json:"sodium"`
	Protein      float64 `json:"protein"`
	Carbohydrate float64 `json:"carbohydrate"`
	Sugars       float64 `json:"sugars"`
}

//-----------------------------------------------------------------------------
