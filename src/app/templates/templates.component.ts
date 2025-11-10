import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Template {
  name: string;
  displayName: string;
  image: string;
}

@Component({
  selector: 'templates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent {
  templates: Template[] = [
    { name: 'classic', displayName: 'Classique', image: 'assets/templates/classic/preview.png' },
    { name: 'modern', displayName: 'Moderne', image: 'assets/templates/modern/preview.png' },
    { name: 'creative', displayName: 'Créatif', image: 'assets/templates/creative/preview.png' }
  ];

  constructor(private router: Router) {}

  selectTemplate(templateName: string) {
    // Génère un nom par défaut basé sur la date
    const defaultName = `Portfolio ${new Date().toLocaleDateString('fr-FR')}`;
    
    this.router.navigate(['/creation/template-editor', templateName], {
      state: { portfolioName: defaultName }
    });
  }
}