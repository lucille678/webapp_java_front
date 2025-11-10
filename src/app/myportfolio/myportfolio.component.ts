import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../services/portfolio.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';


interface Portfolio {
  idPortfolio: number;
  namePortfolio: string;
  templateName: string;
  jsonData: string;
  link?: string;
  linkedin?: string;
  creationDate?: string;
  editionDate?: string;
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
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.loadPortfolios();
       
  }

  loadPortfolios() {
    const userId = this.authService.getCurrentUserId();
    console.log('🔍 User ID:', userId);
    
    if (userId) {
      this.portfolioService.getPortfoliosByUser(userId).subscribe({
        next: (portfolios: any) => {
          console.log(' Portfolios chargés:', portfolios);
          this.portfolios = portfolios;
        },
        error: (error: any) => {
          console.error(' Erreur:', error);
        }
      });
    } else {
      console.error(' Utilisateur non connecté');
      this.router.navigate(['/login']);
    }
  }

  createPortfolio() {
    this.router.navigate(['/templates']);
  }

  editPortfolio(portfolio: Portfolio) {
    console.log(' Édition portfolio:', portfolio);
    
    try {
      const data = JSON.parse(portfolio.jsonData || '{}');
      
      this.router.navigate(['/creation/template-editor', portfolio.templateName], {
        state: { 
          isEditMode: true,
          portfolioId: portfolio.idPortfolio,
          portfolioName: portfolio.namePortfolio,
          data: data
        }
      });
    } catch (error) {
      console.error(' Erreur parsing JSON:', error);
      alert('Erreur lors du chargement du portfolio');
    }
  }

  previewPortfolio(portfolio: Portfolio) {
    console.log(' Aperçu portfolio:', portfolio);
    
    try {
      const data = JSON.parse(portfolio.jsonData || '{}');
      
      this.router.navigate(['/preview'], {
        state: { 
          portfolioId: portfolio.idPortfolio,
          portfolioName: portfolio.namePortfolio,
          template: portfolio.templateName,
          data: data
        }
      });
    } catch (error) {
      console.error(' Erreur parsing JSON:', error);
      alert('Erreur lors du chargement du portfolio');
    }
  }

  deletePortfolio(portfolio: Portfolio) {
    if (confirm(`Supprimer le portfolio "${portfolio.namePortfolio}" ?`)) {
      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.portfolioService.deletePortfolio(userId, portfolio.idPortfolio).subscribe({
          next: () => {
            console.log(' Portfolio supprimé');
            this.loadPortfolios();
          },
          error: (error: any) => {
            console.error(' Erreur:', error);
          }
        });
      }
    }
  }
}