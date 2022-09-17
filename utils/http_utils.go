package utils

import (
	"fmt"
	"io"
	"net/http"
)

//-----------------------------------------------------------------------------
type HttpClient struct {
	c *http.Client
}

//-----------------------------------------------------------------------------
func NewHttpClient() *HttpClient {
	return &HttpClient{
		&http.Client{},
	}
}

//-----------------------------------------------------------------------------
func (this *HttpClient) Do(req *http.Request) (*http.Response, error) {
	res, err := this.c.Do(req)
	if err != nil {
		return nil, fmt.Errorf("'Do' returned an error: %v", err)
	}

	return res, nil
}

//-----------------------------------------------------------------------------
func (this *HttpClient) SendGetRequest(path string, body io.Reader, params map[string]string, headers map[string]string) (*http.Response, error) {
	req, err := this.GetRequestWithHeader("GET", path, body, params, headers)
	if err != nil {
		return nil, fmt.Errorf("GetRequestWithHeader returned an error: %v", err)
	}

	return this.Do(req)
}

//-----------------------------------------------------------------------------
func (this *HttpClient) GetRequestWithHeader(method string, path string, body io.Reader, params map[string]string, headers map[string]string) (*http.Request, error) {
	req, err := this.GetRequest(method, path, body, params)
	if err != nil {
		return nil, fmt.Errorf("getRequestWithHeader returned an error: %v", err)
	}

	for key, val := range headers {
		req.Header.Set(key, val)
	}

	return req, nil
}

//-----------------------------------------------------------------------------
func (this *HttpClient) GetRequest(method string, path string, body io.Reader, params map[string]string) (*http.Request, error) {
	req, err := http.NewRequest(method, path, body)
	if err != nil {
		return nil, fmt.Errorf("getRequest returned an error: %v", err)
	}

	q := req.URL.Query()
	for key, val := range params {
		q.Add(key, val)
	}

	req.URL.RawQuery = q.Encode()

	return req, nil
}

//-----------------------------------------------------------------------------
