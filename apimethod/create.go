package apimethod

import (
	"net/http"
	"github.com/julienschmidt/httprouter"
	"encoding/json"
	"log"
        "os/exec"
)
type Request struct {
 panoid string `json:"panoid"`
}
// 取得結果のレスポンス
type Response struct {
	name          string  `json:"filename"`
	message       string  `json:"message"`
}

func Create(w http.ResponseWriter, r *http.Request, params httprouter.Params){
        log.Println("any access")
        // URLパラメータを取得する
        panoid := r.URL.Query().Get("panoid")
        log.Println(panoid)
	//response のjsonを作って書き込み
	responseJson := Response{name: "out.png", message: "success"}

        out, _ := exec.Command("sh", "getimage.sh", panoid).Output()
        log.Println(out)

	json.NewEncoder(w).Encode(responseJson)
	log.Println("create image success")
}

