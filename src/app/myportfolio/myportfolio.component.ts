import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../services/portfolio.service';
import { AuthService } from '../services/auth.service';

interface Portfolio {
  id: number;
  name: string;
  template: string;
  data: any;
}

@Component({
  selector: 'myportfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myportfolio.component.html',
  styleUrls: ['./myportfolio.component.scss']
})
export class MyportfolioComponent implements OnInit {
  portfolios: Portfolio[] = [];

  constructor(
    private router: Router,
    private portfolioService: PortfolioService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPortfolios();
  }

  loadPortfolios() {
    const userId = this.authService.getCurrentUserId();
    //logs pour debugger
    const currentUser = this.authService.getCurrentUser();
    console.log('🔍 User ID:', userId);
    console.log('🔍 Current User:', currentUser);
    console.log('🔍 LocalStorage user:', localStorage.getItem('user'));
    //
    if (userId) {
      this.portfolioService.getPortfoliosByUser(userId).subscribe({
        next: (portfolios: any) => {
          console.log('Portfolios chargés:', portfolios);
          this.portfolios = portfolios;
        },
        error: (error: any) => {
          console.error('Erreur:', error);
        }
      });
    } else {
      console.error('Utilisateur non connecté');
      // Rediriger vers login si nécessaire
      this.router.navigate(['/login']);
    }
  }

  createPortfolio() {
    this.router.navigate(['/templates']);
  }

  editPortfolio(id: number, template: string) {
    const portfolio = this.portfolios.find(p => p.id === id);
    if (!portfolio) return;

    this.router.navigate(['/creation/template-editor', template], {
      state: { portfolioId: id, data: portfolio.data }
    });
  }

  previewPortfolio(id: number, template: string) {
    const portfolio = this.portfolios.find(p => p.id === id);
    if (!portfolio) return;

    this.router.navigate(['/preview'], {
      state: { template, data: portfolio.data, portfolioId: id }
    });
  }

  deletePortfolio(id: number, name: string) {
    if (confirm(`Supprimer le portfolio "${name}" ?`)) {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.portfolioService.deletePortfolio(userId, id).subscribe({
          next: () => {
            console.log('Portfolio supprimé');
            // Recharger la liste
            this.loadPortfolios();
          },
          error: (error: any) => {
            console.error('Erreur:', error);
          }
        });
      }
    }
  }
}
