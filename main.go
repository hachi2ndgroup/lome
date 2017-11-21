package main

import (
        "./apimethod"
	"log"
	"net/http"
	"github.com/julienschmidt/httprouter"
)

/* 画像を作成する */
func create(w http.ResponseWriter, r *http.Request, params httprouter.Params) {
	setContentJsonHeader(w)
	apimethod.Create(w, r, params)
}


/* APIのHTTP-HeaderにJsonを入れる*/
func setContentJsonHeader(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
}

func main() {
	router := httprouter.New()
	router.GET("/create", create)
	router.ServeFiles("/image/*filepath", http.Dir("image/"))
	log.Fatal(http.ListenAndServe(":9999", router))
}
