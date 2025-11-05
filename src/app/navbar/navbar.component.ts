import { Component, OnInit } from '@angular/core';
import { Link } from '../models/links.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  links: Link[] = [
    { name: 'Accueil', href: '/home' },
    { name: 'Mes Portfolios', href: '/myportfolio' },
  ];

  isAuthenticated = false;
  showDropdown = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  login() {
    this.router.navigate(['/login']);
    this.showDropdown = false;
  }

  register() {
    this.router.navigate(['/inscription']);
    this.showDropdown = false;
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
    this.showDropdown = false;
  }
}


