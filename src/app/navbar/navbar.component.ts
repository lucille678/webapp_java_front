import { Component } from "@angular/core"
import { Link } from "models/links.model"

@Component({
  selector: "navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  links: Link[] = [
    { name: 'Mes Portfolios', href: '/creation' },
    { name: 'Mon Audience', href: '/statistics' },
  ];
}

