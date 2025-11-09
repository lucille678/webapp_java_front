import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private baseUrl = 'http://localhost:8080/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getPortfoliosByUser(userId: number): Observable<any> {
    const url = `${this.baseUrl}/${userId}/portfolios`;
    console.log('Calling API:', url);
    return this.http.get(url);
  }

  createPortfolio(userId: number, portfolioData: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/${userId}/portfolios`, portfolioData, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur création portfolio:', error);
          throw error;
        })
      );
  }

  deletePortfolio(userId: number, portfolioId: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/${userId}/portfolios/${portfolioId}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur suppression portfolio:', error);
          throw error;
        })
      );
  }
  getPortfolioById(id: number): Observable<any> {
  return this.http.get(`http://localhost:8080/portfolios/${id}`);
}
}