import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.scss']
})
export class TemplatePreviewComponent implements OnInit {
  data: any;
  template: string = '';

  isScrolled: boolean = false;
  mobileMenuOpen: boolean = false;

  sections = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'formations', label: 'Formations' },
    { id: 'experiences', label: 'Expériences' },
    { id: 'competences', label: 'Compétences' }
  ];
  activeSection: string = 'accueil';

  constructor(private router: Router, private http: HttpClient, private renderer: Renderer2) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;

    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          this.activeSection = section.id;
          break;
        }
      }
    }
  }

  ngOnInit(): void {
    const state = history.state;
    this.template = state.template;
    this.data = state.data;

    // Charger le CSS du template pour garder le style
    if (this.template) {
      const link = this.renderer.createElement('link');
      link.rel = 'stylesheet';
      link.href = `assets/templates/${this.template}/style.css`;
      this.renderer.appendChild(document.head, link);
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  goBackToEdit() {
    this.router.navigate(['/creation/template-editor', this.template], { 
      state: { data: this.data }
    });
  }

  publish() {
    alert('Fonctionnalité de publication à venir !');
  }

  formatDateRange(startDate: string, endDate: string): string {
    const formatDate = (date: string) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('fr-FR', { 
        month: 'long', 
        year: 'numeric'
      });
    };

    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Aujourd\'hui';

    return `${start} - ${end}`;
  }
}
