import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Template {
  name: string;
  displayName: string;
  image: string;
}

@Component({
  selector: 'templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent {
  templates: Template[] = [
    { name: 'classic', displayName: 'Classique', image: 'assets/templates/classic/preview.png' },
    { name: 'modern', displayName: 'Moderne', image: 'assets/templates/modern/preview.png' },
    { name: 'creative', displayName: 'Créatif', image: 'assets/templates/creative/preview.png' }
  ];

  showDialog = false;
  selectedTemplate: string | null = null;
  portfolioName: string = '';

  constructor(private router: Router) {}

  openNameDialog(templateName: string) {
    this.selectedTemplate = templateName;
    this.showDialog = true;
  }

  cancelDialog() {
    this.showDialog = false;
    this.portfolioName = '';
  }

  confirmDialog() {
    if (!this.portfolioName.trim() || !this.selectedTemplate) return;
    this.showDialog = false;

    this.router.navigate(['/creation/template-editor', this.selectedTemplate], {
      state: { portfolioName: this.portfolioName }
    });
  }
}
