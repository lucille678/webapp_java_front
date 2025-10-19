import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    // Utilisation du mock pour tester sans BDD
    this.auth.loginMock(email, password);

    // Naviguer vers l'espace connecté (par exemple "creation")
    this.router.navigate(['/creation']);
/*
    if (isValid) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Email ou mot de passe incorrect';
    }
*/
  }

  goToRegister() {
    this.router.navigate(['/inscription']);
  }
}



