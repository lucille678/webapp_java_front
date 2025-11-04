import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface FileData {
  name: string;
  type: string;
  content: string;
}

interface FormData {
  accueil?: {
    firstName?: string;
    lastName?: string;
    photo?: { content: string };
    objective?: string;
    bio?: string;
    locations?: string;
  };
  formation?: Array<{
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  experience?: Array<{
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  competences?: {
    softSkills?: string;
    hardSkills?: string;
    languages?: string;
    certificates?: Array<{
      name: string;
      file?: FileData;
    }>;
    customCategories?: Array<{
      name: string;
      content: string;
    }>;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    [key: string]: any;
  };
}

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.scss'],
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100vh;
      background: #fff;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 9999;
    }
  `]
})
export class TemplatePreviewComponent implements OnInit {
  data: FormData = {};
  template: string = '';
  templateName: string | null = null;
  customSections: any[] = [];
  currentYear = new Date().getFullYear();

  isScrolled: boolean = false;
  mobileMenuOpen: boolean = false;

  sections = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'formations', label: 'Formations' },
    { id: 'experiences', label: 'Expériences' },
    { id: 'competences', label: 'Compétences' },
    { id: 'contact', label: 'Contact' }
  ];
  activeSection: string = 'accueil';

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private renderer: Renderer2
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Utiliser le scroll du :host au lieu de window
    const scrollTop = (event?.target as HTMLElement)?.scrollTop || 0;
    this.isScrolled = scrollTop > 50;

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

  // Écouter le scroll sur l'élément host
  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.isScrolled = target.scrollTop > 50;

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

  private loadTemplateStyle(templateName: string) {
    const existingLink = document.getElementById(`template-style-${templateName}`);
    if (existingLink) {
      existingLink.remove();
    }

    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.id = `template-style-${templateName}`;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `assets/templates/${templateName}/style.css`;
    head.appendChild(link);
  }

  ngOnInit(): void {
    // Cacher le body scroll et la navbar principale
    document.body.style.overflow = 'hidden';
    
    // Récupérer le state de la navigation
    const state = history.state;
    
    console.log('State reçu:', state);

    // Récupérer le template
    if (state?.template) {
      this.template = state.template;
      this.templateName = state.template;
      console.log('Template:', this.template);
    } else {
      const urlParts = this.router.url.split('/');
      this.template = urlParts[urlParts.length - 1];
      this.templateName = this.template;
      console.log('Template depuis URL:', this.template);
    }

    // Récupérer les données
    if (state?.data && Object.keys(state.data).length > 0) {
      this.data = state.data;
      console.log('Données du state:', this.data);
    } else if (this.templateName) {
      const savedData = localStorage.getItem(`formData_${this.templateName}`);
      if (savedData) {
        this.data = JSON.parse(savedData);
        console.log('Données du localStorage:', this.data);
      } else {
        console.warn('Aucune donnée trouvée dans localStorage');
      }
    }

    // Charger les sections personnalisées
    if (this.templateName) {
      const portfolioName = history.state.portfolioName || localStorage.getItem('currentPortfolioName');
      const savedCustomSections = localStorage.getItem(`customSections_${portfolioName}`);

      if (savedCustomSections) {
        this.customSections = JSON.parse(savedCustomSections);
        
        this.customSections.forEach(section => {
          if (!this.sections.some(s => s.id === section.name)) {
            this.sections.push({
              id: section.name,
              label: section.label
            });
          }
        });
        console.log('Sections personnalisées:', this.customSections);
      }
    }

    // Charger le CSS du template
    if (this.template) {
      this.loadTemplateStyle(this.template);
    }

    console.log('Données finales chargées:', this.data);
  }

  ngOnDestroy() {
    // Restaurer le scroll du body
    document.body.style.overflow = 'auto';
    
    // Nettoyer les styles du template
    if (this.templateName) {
      const styleLink = document.getElementById(`template-style-${this.templateName}`);
      if (styleLink) {
        styleLink.remove();
      }
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbar = document.querySelector('.portfolio-nav') as HTMLElement;
      const navbarHeight = navbar ? navbar.offsetHeight : 60;

      // Utiliser scrollIntoView pour un scroll plus fiable
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - navbarHeight;

      // Récupérer l'élément host qui scroll
      const hostElement = document.querySelector('app-template-preview') as HTMLElement;
      
      if (hostElement) {
        hostElement.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }

    // Ferme le menu mobile
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

  formatDateRange(startDate: string, endDate: string, current?: boolean): string {
    if (!startDate) return '';

    const formatDate = (date: string) => {
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        const month = d.toLocaleDateString('fr-FR', { month: 'long' });
        const year = d.getFullYear();
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
      } catch {
        return date;
      }
    };

    const start = formatDate(startDate);
    const end = current ? 'Aujourd\'hui' : endDate ? formatDate(endDate) : '';

    return `${start}${end ? ' - ' + end : ''}`;
  }

  getSectionData(sectionName: string): any {
    return this.data ? this.data[sectionName as keyof FormData] : null;
  }

 openInNewTab(dataUrl: string | undefined) {
  if (!dataUrl) return;
  
  // Ouvrir l'image dans un nouvel onglet
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>Aperçu</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #000;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Aperçu">
        </body>
      </html>
    `);
  }
}
  getSectionFieldData(sectionName: string, fieldName: string): any {
    const sectionData = this.getSectionData(sectionName);
    return sectionData ? sectionData[fieldName] : null;
  }
}