import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'myportfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myportfolio.component.html',
  styleUrls: ['./myportfolio.component.scss']
})
export class MyportfolioComponent implements OnInit {
  portfolios: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadPortfolios();
  }

  loadPortfolios() {
    this.portfolios = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      if (key.startsWith('portfolio_')) {
        const saved = JSON.parse(localStorage.getItem(key)!);
        this.portfolios.push({
          name: key.replace('portfolio_', ''),
          template: saved.template
        });
      }
    }
  }

  createPortfolio() {
    this.router.navigate(['/templates']);
  }

  editPortfolio(name: string, template: string) {
    const saved = localStorage.getItem(`portfolio_${name}`);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    this.router.navigate(['/creation/template-editor', template], {
      state: { portfolioName: name, data: parsed.data }
    });
  }

  previewPortfolio(name: string, template: string) {
    const saved = localStorage.getItem(`portfolio_${name}`);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    this.router.navigate(['/preview'], {
      state: { template, data: parsed.data, portfolioName: name }
    });
  }

  deletePortfolio(name: string) {
    if (confirm(`Supprimer le portfolio "${name}" ?`)) {
      localStorage.removeItem(`portfolio_${name}`);
      this.loadPortfolios();
    }
  }
}
