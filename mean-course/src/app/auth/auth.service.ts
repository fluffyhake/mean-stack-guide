import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";


// import env variables
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";


@Injectable({
  providedIn: "root"
})
export class AuthService{
  private isAuthenticated = false
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  // What does this do..? inits with the httpclient? Makes the httpclient available?
  constructor(private http: HttpClient, private router: Router) {}


  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId
  }

  getAuthStatusListener() {
    // Any part of the app can subscribe to this observable and get notified when the function is called
    // The function will be called with either true or false to inform everyone wether the user is authenticated or not
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}
    console.log(authData)
    this.http.post(BACKEND_URL + "/signup", authData)
    .subscribe(() => {
      this.router.navigate(["/"])
    }, error => {
      this.authStatusListener.next(false)
    } );


  }
  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password}

    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + "/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn
          this.setAuthTimer(expiresInDuration)
          console.log(expiresInDuration)
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
          console.log(expirationDate)
          this.saveAuthData(token, expirationDate, this.userId)
          this.router.navigate(['/'])
        }
      }, error => {
        this.authStatusListener.next(false)
      })
  }
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true);
    }
  }


  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  setAuthTimer(duration: number){
    console.log("Setting timer: " + duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    // TO ISOSTRING IS BETTER for recreating?
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem("userId", userId)

  }
  private clearAuthData(){
    localStorage.removeItem("token")
    localStorage.removeItem("expiration")
    localStorage.removeItem("userId")
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration")
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return false
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
