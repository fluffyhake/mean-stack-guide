import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  constructor(private authService: AuthService) {}
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;

    ngOnInit(){
      this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated

      });
    }

    onLogout(){
      this.authService.logout()
    }
    ngOnDestroy() {
      this.authListenerSubs.unsubscribe()

    }
}
