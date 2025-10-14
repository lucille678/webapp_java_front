import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Template {
  name: string;
  displayName: string;
  image: string;
}

@Component({
  selector: 'templates',
  standalone: true,
  imports: [],
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

  chooseTemplate(templateName: string) {
    this.router.navigate(['/creation/template-editor', templateName]);
  }
}

