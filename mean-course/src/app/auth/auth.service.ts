import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({
  providedIn: "root"
})
export class AuthService{
  private isAuthenticated = false
  private token: string;
  private authStatusListener = new Subject<boolean>();
  // What does this do..? inits with the httpclient? Makes the httpclient available?
  constructor(private http: HttpClient, private router: Router) {}


  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    // Any part of the app can subscribe to this observable and get notified when the function is called
    // The function will be called with either true or false to inform everyone wether the user is authenticated or not
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}
    console.log(authData)
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response)
      })
  }
  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}

    this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/'])
        }
      })
  }
  logout(){
    this.token = null;
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    this.router.navigate(['/'])
  }
}
