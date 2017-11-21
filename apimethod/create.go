package apimethod

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"encoding/json"
	"log"
        "os/exec"
)
// 取得結果のレスポンス
type Response struct {
	name          string  `json:"filename"`
	message       string  `json:"message"`
}

func Create(w http.ResponseWriter, r *http.Request, params httprouter.Params){

	//response のjsonを作って書き込み
	responseJson := Response{name: "out.png", message: "success"}

        out, _ := exec.Command("sh", "getimage.sh").Output()
        log.Println(out)

	json.NewEncoder(w).Encode(responseJson)
	log.Println("create image success")
}

