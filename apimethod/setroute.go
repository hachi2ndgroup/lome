package apimethod

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
        "io"
	"os"
        _"encoding/json"
        "io/ioutil"
	"log"
        "fmt"
)
// type Request struct {
//  panoid string `json:"panoid"`
// }
// 取得結果のレスポンス
// type Response struct {
//	name          string  `json:"filename"`
//	message       string  `json:"message"`
//}

func Setroute(w http.ResponseWriter, r *http.Request, params httprouter.Params){
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576)) // 1MiB
	if err != nil {
		panic(err)
	 }
	defer r.Body.Close()
	ioutil.WriteFile("route/route.json", body, os.ModePerm)

	log.Println("create new route.json")
        fmt.Fprintf(w, "success")

}

