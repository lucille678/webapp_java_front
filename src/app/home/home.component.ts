import { Component, OnInit } from "@angular/core"
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  createPortfolio() {
   /* if (this.authService.isLoggedIn()) {
      this.router.navigate(['/creation']);
    } else {
      this.router.navigate(['/login']);
    } */
  }

  ngOnInit(): void {}
}
