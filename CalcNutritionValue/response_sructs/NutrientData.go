package response_sructs

// -----------------------------------------------------------------------------
type FoodsData struct {
	Foods []FoodData `json:"foods"`
}

// -----------------------------------------------------------------------------
type FoodData struct {
	Description     string         `json:"description"`
	FoodNutrients   []NutrientData `json:"foodNutrients"`
	ServingSizeUnit string         `json:"servingSizeUnit"`
}

// -----------------------------------------------------------------------------
type NutrientData struct {
	NutrientId                    int     `json:"nutrientId"`
	NutrientName                  string  `json:"nutrientName"`
	NutrientNumber                string  `json:"nutrientNumber"`
	UnitName                      string  `json:"unitName"`
	DerivationCode                string  `json:"derivationCode"`
	DerivationDescription         string  `json:"derivationDescription"`
	DerivationId                  int     `json:"derivationId"`
	Value                         float64 `json:"value"`
	FoodNutrientSourceId          int     `json:"foodNutrientSourceId"`
	FoodNutrientSourceCode        string  `json:"foodNutrientSourceCode"`
	FoodNutrientSourceDescription string  `json:"foodNutrientSourceDescription"`
	Rank                          int     `json:"rank"`
	IndentLevel                   int     `json:"indentLevel"`
	FoodNutrientId                int     `json:"foodNutrientId"`
	PercentDailyValue             float64 `json:"percentDailyValue"`
}

//-----------------------------------------------------------------------------
