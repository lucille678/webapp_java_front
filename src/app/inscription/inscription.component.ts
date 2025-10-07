import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {
  formData = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  passwordMismatch = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm) {
    if (this.formData.password !== this.formData.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;
    this.errorMessage = '';

    if (form.valid) {
      this.isLoading = true;

      this.authService.register({
        nom: this.formData.nom,
        prenom: this.formData.prenom,
        email: this.formData.email,
        password: this.formData.password
      }).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur inscription:', error);
          this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onPasswordChange() {
    if (this.passwordMismatch) {
      this.passwordMismatch = false;
    }
  }
}
