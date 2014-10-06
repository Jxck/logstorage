package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	log.Println(r.Method)
	if r.Method == "OPTIONS" {
		w.Header().Add("Access-Control-Allow-Headers", "content-type, authorization")
		w.Header().Add("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
		w.Header().Add("Access-Control-Allow-Origin", "*")
		log.Println(w.Header())
		w.WriteHeader(200)
	}

	if r.Method == "POST" {
		// the FormFile function takes in the POST input id file
		file, header, err := r.FormFile("file")
		if err != nil {
			fmt.Fprintln(w, err)
			return
		}
		defer file.Close()

		out, err := os.Create(header.Filename)
		if err != nil {
			fmt.Fprintf(w, "Unable to create the file for writing. Check your write access privilege")
			return
		}

		defer out.Close()

		// write the content from POST to the file
		_, err = io.Copy(out, file)
		if err != nil {
			fmt.Fprintln(w, err)
		}

		fmt.Fprintf(w, "File uploaded successfully : ")
		fmt.Fprintf(w, header.Filename)
	}
}

func main() {
	http.Handle("/", http.FileServer(http.Dir(".")))
	http.HandleFunc("/receive", uploadHandler)
	http.ListenAndServe(":8080", nil)
}
