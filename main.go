package main

import (
	"NutritionCalculator/CalcNutritionValue"
	"encoding/json"
	"github.com/labstack/echo/v4"
	"html/template"
	"io"
	"net/http"
)

// -----------------------------------------------------------------------------
// TemplateRenderer is a custom html/template renderer for Echo framework
type TemplateRenderer struct {
	templates *template.Template
}

// -----------------------------------------------------------------------------
// Render renders a template document
func (t *TemplateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

// -----------------------------------------------------------------------------
func main() {

	e := echo.New()
	e.Static("/static", "static")
	renderer := &TemplateRenderer{templates: template.Must(template.ParseFiles("templates/NutritionCalculator-template.html"))}
	e.Renderer = renderer
	e.GET("/", func(c echo.Context) error {
		return c.Render(http.StatusOK, "NutritionCalculator-template.html", nil)
	})
	e.POST("/getIngs", func(c echo.Context) error {
		myCalculator, err := CalcNutritionValue.NewCalcNutritionValue(c)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"res": err.Error()})
		}
		res, err := myCalculator.GetNutritionValue()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"res": err.Error()})
		}
		jsonRes, err := json.Marshal(res)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"res": err.Error()})
		}
		return c.JSON(http.StatusOK, string(jsonRes))
	})
	e.Logger.Fatal(e.Start(":8080"))
}

//-----------------------------------------------------------------------------
