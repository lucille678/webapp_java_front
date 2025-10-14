import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'myportfolio',
  standalone: true,
  imports: [],
  templateUrl: './myportfolio.component.html',
  styleUrls: ['./myportfolio.component.scss']
})

export class MyportfolioComponent  {

  constructor(private router: Router) {}

  createPortfolio() {
    this.router.navigate(['/templates'])
  }
}
