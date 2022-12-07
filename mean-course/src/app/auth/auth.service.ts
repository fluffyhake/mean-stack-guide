import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";

@Injectable({
  providedIn: "root"
})
export class AuthService{
  // What does this do..? inits with the httpclient? Makes the httpclient available?
  constructor(private http: HttpClient) {}


  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}
    console.log(authData)
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response)
      })
  }
}
