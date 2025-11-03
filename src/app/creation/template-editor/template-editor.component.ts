import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SectionService } from '../../services/section.service';

interface TemplateField {
  name: string;
  label: string;
  type: string;
  multiple?: boolean;
}

interface Section {
  name: string;
  label: string;
  fields: TemplateField[];
  repeatable?: boolean;
  open?: boolean;
}

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {
  templateName: string | null = null;
  config: { title: string; sections: Section[] } | null = null;
  formData: any = {};
  customSectionOpen = false;
  newSection = {
    name: '',
    hasText: false,
    hasImage: false,
    hasDate: false,
    hasPeriod: false
  };
  customSections: Section[] = [];
  showDialog = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private sectionService: SectionService
  ) {}

  ngOnInit() {
    this.templateName = this.route.snapshot.paramMap.get('templateName');
    if (this.templateName) {
      // Load saved custom sections specific to this template
      const savedCustomSections = localStorage.getItem(`customSections_${this.templateName}`);
      if (savedCustomSections) {
        this.customSections = JSON.parse(savedCustomSections);
      }

      // Load saved form data
      const savedData = localStorage.getItem(`formData_${this.templateName}`);
      
      this.http.get(`assets/templates/${this.templateName}/config.json`)
        .subscribe({
          next: (data: any) => {
            this.config = data;
            // Add custom sections to config sections
            if (this.customSections.length > 0 && this.config) {
              this.config.sections = [...(this.config.sections || []), ...this.customSections];
            }
            this.formData = savedData ? JSON.parse(savedData) : this.initializeFormData();
            
            // S'assurer que contact est toujours initialisé
            if (!this.formData.contact) {
              this.initializeContactData();
            }
            
            console.log('FormData initialisé:', this.formData);
          },
          error: (error) => console.error('Error loading config:', error)
        });
    }
  }

  private initializeFormData() {
    const data: any = {};
    this.config?.sections.forEach((section: any) => {
      if (section.name === 'competences') {
        data[section.name] = {
          softSkills: '',
          hardSkills: '',
          languages: '',
          certificates: [],
          customCategories: []
        };
      } else if (section.name === 'contact') {
        // Initialisation explicite de tous les champs de contact
        data[section.name] = {
          email: '',
          phone: '',
          address: '',
          linkedin: '',
          github: '',
          twitter: ''
        };
      } else if (section.repeatable) {
        data[section.name] = [];
      } else {
        data[section.name] = {};
      }
    });
    return data;
  }

  private initializeContactData() {
    this.formData.contact = {
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      twitter: ''
    };
  }

  createNewSection() {
    if (this.newSection.name) {
      // Créer la nouvelle section
      const newSection: Section = {
        name: this.newSection.name.toLowerCase(),
        label: this.newSection.name,
        fields: [],
        open: true
      };

      // Ajouter les champs selon les options sélectionnées
      if (this.newSection.hasText) {
        newSection.fields.push({
          name: 'text',
          label: 'Texte',
          type: 'textarea'
        });
      }
      if (this.newSection.hasImage) {
        newSection.fields.push({
          name: 'image',
          label: 'Image',
          type: 'file'
        });
      }
      if (this.newSection.hasDate) {
        newSection.fields.push({
          name: 'date',
          label: 'Date',
          type: 'date'
        });
      }
      if (this.newSection.hasPeriod) {
        newSection.fields.push(
          { name: 'startDate', label: 'Date de début', type: 'date' },
          { name: 'endDate', label: 'Date de fin', type: 'date' }
        );
      }

      // Ajouter la section aux sections personnalisées
      this.customSections.push(newSection);

      // Mettre à jour config.sections
      if (this.config) {
        this.config.sections = [...this.config.sections, newSection];
      }

      // Initialiser les données pour la nouvelle section
      this.formData[newSection.name] = {};

      // Sauvegarder les sections personnalisées
      if (this.templateName) {
        localStorage.setItem(`customSections_${this.templateName}`, JSON.stringify(this.customSections));
        localStorage.setItem(`formData_${this.templateName}`, JSON.stringify(this.formData));
      }

      // Réinitialiser le formulaire
      this.newSection = {
        name: '',
        hasText: false,
        hasImage: false,
        hasDate: false,
        hasPeriod: false
      };
      
      this.customSectionOpen = false;
    }
  }

  onFileChange(event: Event, sectionName: string, fieldName: string, index?: number) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const fileData = {
        name: file.name,
        type: file.type,
        content: reader.result
      };

      if (index !== undefined) {
        this.formData[sectionName][index][fieldName] = fileData;
      } else {
        this.formData[sectionName][fieldName] = fileData;
      }
    };

    reader.readAsDataURL(file);
  }

  getFieldValue(sectionName: string, fieldName: string, index?: number) {
    if (index !== undefined) {
      return this.formData[sectionName][index][fieldName];
    }
    return this.formData[sectionName][fieldName];
  }

  isImage(file: any) {
    return file?.type?.startsWith('image/');
  }

  isPDF(file: any) {
    return file?.type === 'application/pdf';
  }

  getCustomCategories() {
    if (!this.formData.competences.customCategories) {
      this.formData.competences.customCategories = [];
    }
    return this.formData.competences.customCategories;
  }

  addCategory() {
    if (!this.formData.competences.customCategories) {
      this.formData.competences.customCategories = [];
    }
    this.formData.competences.customCategories.push({
      name: '',
      content: ''
    });
  }

  removeCategory(index: number) {
    this.formData.competences.customCategories.splice(index, 1);
  }

  getCertificates() {
    if (!this.formData.competences.certificates) {
      this.formData.competences.certificates = [];
    }
    return this.formData.competences.certificates;
  }

  addCertificate() {
    if (!Array.isArray(this.formData.competences.certificates)) {
      this.formData.competences.certificates = [];
    }
    this.formData.competences.certificates.push({
      name: '',
      file: null
    });
  }

  removeCertificate(index: number) {
    this.formData.competences.certificates.splice(index, 1);
  }

  onCertificateFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formData.competences.certificates[index].file = {
          name: file.name,
          type: file.type,
          content: reader.result
        };
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.templateName) return;
    
    // Save to localStorage
    localStorage.setItem(`formData_${this.templateName}`, JSON.stringify(this.formData));

    // Navigate to preview with data
    this.router.navigate(['/preview'], {
      state: { 
        data: this.formData, 
        template: this.templateName 
      }
    });
  }

  showNewSectionDialog() {
    this.showDialog = true;
  }

  cancelNewSection() {
    this.showDialog = false;
  }

  isCustomSection(sectionName: string): boolean {
    return this.customSections.some(s => s.name === sectionName);
  }

  removeCustomSection(sectionName: string) {
    // Supprimer la section des sections personnalisées
    this.customSections = this.customSections.filter(s => s.name !== sectionName);
    
    // Supprimer la section de config.sections
    if (this.config) {
      this.config.sections = this.config.sections.filter(s => s.name !== sectionName);
    }
    
    // Supprimer les données associées
    delete this.formData[sectionName];
    
    // Sauvegarder les modifications
    if (this.templateName) {
      localStorage.setItem(`customSections_${this.templateName}`, JSON.stringify(this.customSections));
      localStorage.setItem(`formData_${this.templateName}`, JSON.stringify(this.formData));
    }
  }

  removeFile(sectionName: string, fieldName: string, index?: number) {
    if (index !== undefined) {
      delete this.formData[sectionName][index][fieldName];
    } else {
      delete this.formData[sectionName][fieldName];
    }

    if (this.templateName) {
      localStorage.setItem(`formData_${this.templateName}`, JSON.stringify(this.formData));
    }
  }

  addItem(sectionName: string) {
    if (!Array.isArray(this.formData[sectionName])) {
      this.formData[sectionName] = [];
    }

    const newItem: any = {
      startDate: '',
      endDate: '',
      current: false
    };

    this.config?.sections
      .find(s => s.name === sectionName)
      ?.fields.forEach(field => {
        if (field.name !== 'dates') {
          newItem[field.name] = '';
        }
      });

    this.formData[sectionName].push(newItem);

    // Save changes
    if (this.templateName) {
      localStorage.setItem(`formData_${this.templateName}`, JSON.stringify(this.formData));
    }
  }

  removeItem(sectionName: string, index: number) {
    if (Array.isArray(this.formData[sectionName])) {
      this.formData[sectionName].splice(index, 1);
      
      // Save changes
      if (this.templateName) {
        localStorage.setItem(`formData_${this.templateName}`, JSON.stringify(this.formData));
      }
    }
  }
}