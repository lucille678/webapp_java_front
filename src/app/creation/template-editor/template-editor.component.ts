import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SectionService } from '../../services/section.service';
import { PortfolioService } from '../../services/portfolio.service';
import { AuthService } from '../../services/auth.service';

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
  portfolioName: string = '';
  config: { title: string; sections: Section[] } | null = null;
  formData: any = {};
  customSectionOpen = false;
  newSection = {
    name: '',
    hasText: false,
    hasImage: false,
    hasFile: false,
    hasDate: false,
    hasPeriod: false,
  };
  customSections: Section[] = [];
  showDialog = false;
  showSavePopup = false;
  portfolioNameInput = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private sectionService: SectionService,
    private portfolioService: PortfolioService,
    private authService: AuthService
  ) {}

ngOnInit() {
  this.templateName = this.route.snapshot.paramMap.get('templateName');
  this.portfolioName = history.state.portfolioName || 'Sans nom';

  if (this.templateName) {
    const savedCustomSections = localStorage.getItem(`customSections_${this.portfolioName}`);
    if (savedCustomSections) {
      this.customSections = JSON.parse(savedCustomSections);
      this.customSections.forEach(section => section.open = false);
    }

    const savedData = localStorage.getItem(`portfolio_${this.portfolioName}`);

    this.http.get(`assets/templates/${this.templateName}/config.json`)
      .subscribe({
        next: (data: any) => {
          this.config = data;
          
          // Initialiser toutes les sections à fermées
          if (this.config?.sections) {
            this.config.sections.forEach(section => {
              section.open = false;
            });
          }
          
          if (this.customSections.length > 0 && this.config) {
            this.config.sections = [...(this.config.sections || []), ...this.customSections];
          }

          if (savedData) {
            const parsed = JSON.parse(savedData);
            this.formData = parsed.data || {};
          } else {
            this.formData = this.initializeFormData();
          }

          if (!this.formData.contact) {
            this.initializeContactData();
          }

          console.log('FormData initialisé pour', this.portfolioName, ':', this.formData);
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
      open: false
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
    if (this.newSection.hasFile) {
      newSection.fields.push({
        name: 'file',
        label: 'Fichier',
        type: 'file'
      });
    }

    // Ajouter la section aux sections personnalisées
    this.customSections.push(newSection);

    // Mettre à jour config.sections
    if (this.config) {
      this.config.sections = [...this.config.sections, newSection];
    }

    // Initialiser les données pour la nouvelle section
    this.formData[newSection.name] = {};

    // 🔥 CORRECTION : Sauvegarder les sections personnalisées avec la bonne clé
    if (this.templateName) {
      // Sauvegarder les sections personnalisées séparément
      localStorage.setItem(`customSections_${this.portfolioName}`, JSON.stringify(this.customSections));
      
      // Sauvegarder les données du portfolio
      localStorage.setItem(`portfolio_${this.portfolioName}`, JSON.stringify({
        template: this.templateName,
        data: this.formData
      }));
    
    }

    // Réinitialiser le formulaire
    this.newSection = {
      name: '',
      hasText: false,
      hasImage: false,
      hasFile: false,
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

  const maxSize = 7 * 1024 * 1024; // 7MB
  if (file.size > maxSize) {
    alert('Le fichier est trop volumineux. Taille maximale : 7MB');
    input.value = ''; // Reset l'input
    return;
  }

  // Si c'est une image, la compresser
  if (file.type.startsWith('image/')) {
    this.compressImage(file, (compressedDataUrl) => {
      const fileData = {
        name: file.name,
        type: file.type,
        content: compressedDataUrl
      };

      if (index !== undefined) {
        this.formData[sectionName][index][fieldName] = fileData;
      } else {
        this.formData[sectionName][fieldName] = fileData;
      }
      
      // Sauvegarder immédiatement
      this.saveToLocalStorage();
    });
  } else {
    // Pour les fichiers non-image (PDF, etc.)
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
      
      this.saveToLocalStorage();
    };
    reader.readAsDataURL(file);
  }
}

// Nouvelle méthode pour compresser les images
  // 🔥 Compression d'images AMÉLIORÉE
  private compressImage(file: File, callback: (dataUrl: string) => void) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // 🔥 Redimensionnement plus agressif
        let width = img.width;
        let height = img.height;
        const maxDimension = 800; // Réduit de 1200 à 800px
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
        
        const sizeInBytes = (compressedDataUrl.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        
        callback(compressedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

// Nouvelle méthode pour sauvegarder avec gestion d'erreur
private saveToLocalStorage() {
  if (!this.templateName) return;
  
  try {
    localStorage.setItem(`portfolio_${this.portfolioName}`, JSON.stringify({
      template: this.templateName,
      data: this.formData
    }));
  } catch (error: any) {
    if (error.name === 'QuotaExceededError') {
      alert('Espace de stockage insuffisant. Veuillez réduire la taille ou le nombre de fichiers.');
      console.error('LocalStorage quota exceeded');
    } else {
      console.error('Error saving to localStorage:', error);
    }
  }
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
    if (!file) return;
    
    // Vérifier la taille
    const maxSize = 7 * 1024 * 1024; // 7MB
    if (file.size > maxSize) {
      alert('Le fichier est trop volumineux. Taille maximale : 7MB');
      event.target.value = '';
      return;
    }

    if (file.type.startsWith('image/')) {
      this.compressImage(file, (compressedDataUrl) => {
        this.formData.competences.certificates[index].file = {
          name: file.name,
          type: file.type,
          content: compressedDataUrl
        };
        this.saveToLocalStorage();
      });
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.formData.competences.certificates[index].file = {
          name: file.name,
          type: file.type,
          content: reader.result
        };
        this.saveToLocalStorage();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
  if (!this.templateName) return;
  
  // Save to localStorage
  localStorage.setItem(`portfolio_${this.portfolioName}`, JSON.stringify({
    template: this.templateName,
    data: this.formData
  }));

  // Sauvegarder aussi les sections personnalisées
  localStorage.setItem(`customSections_${this.portfolioName}`, JSON.stringify(this.customSections));

  // Navigate to preview with data
  this.router.navigate(['/preview'], {
    state: { 
      data: this.formData, 
      template: this.templateName,
      portfolioName: this.portfolioName
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
      localStorage.setItem(`customSections_${this.portfolioName}`, JSON.stringify(this.customSections));
      localStorage.setItem(`portfolio_${this.portfolioName}`, JSON.stringify({
      template: this.templateName,
      data: this.formData
    }));
    }
  }

  removeFile(sectionName: string, fieldName: string, index?: number) {
    if (index !== undefined) {
      delete this.formData[sectionName][index][fieldName];
    } else {
      delete this.formData[sectionName][fieldName];
    }

    if (this.templateName) {
      localStorage.setItem(`portfolio_${this.portfolioName}`, JSON.stringify({
        template: this.templateName,
        data: this.formData
      }));

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
      localStorage.setItem(`portfolio_${this.portfolioName}`, JSON.stringify({
        template: this.templateName,
        data: this.formData
      }));

    }
  }

  removeItem(sectionName: string, index: number) {
    if (Array.isArray(this.formData[sectionName])) {
      this.formData[sectionName].splice(index, 1);
      
      // Save changes
      if (this.templateName) {
        localStorage.setItem(`portfolio_${this.portfolioName}`, JSON.stringify({
        template: this.templateName,
        data: this.formData
      }));
      }
    }
  }

  savePortfolio() {
    if (!this.templateName) return;

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.error('❌ Utilisateur non connecté');
      return;
    }

    //generer un lien unique
    const timestamp = Date.now();
    const portfolioSlug = this.portfolioName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Remplacer les caractères spéciaux par des tirets
      .replace(/(^-|-$)/g, '');

    // ✅ Format correct pour le backend
    const portfolioData = {
      name: this.portfolioName || 'Mon Portfolio',
      templateName: this.templateName,
      link: `https://portfolio-${userId}-${portfolioSlug}-${timestamp}.com`,
      linkedin: 'https://linkedin.com/in/mon-profil',
      jsonData: JSON.stringify(this.formData)  // ← Convertir en string JSON
    };

    console.log('🔵 Création portfolio pour user:', userId);
    console.log('📦 Données:', portfolioData);

    this.portfolioService.createPortfolio(userId, portfolioData).subscribe({
      next: (response: any) => {
        console.log('✅ Portfolio créé:', response);
        this.router.navigate(['/myportfolio']);
      },
      error: (error: any) => {
        console.error('❌ Erreur création:', error);
        console.error('Détails:', error.error);
        alert('Erreur lors de la sauvegarde du portfolio');
      }
    });
  }

  showSaveDialog() {
    this.portfolioNameInput = this.portfolioName || '';
    this.showSavePopup = true;
  }

  closeSaveDialog() {
    this.showSavePopup = false;
  }

  confirmSave() {
    if (!this.portfolioNameInput.trim()) {
      alert('Veuillez entrer un nom pour votre portfolio');
      return;
    }

    this.portfolioName = this.portfolioNameInput.trim();
    this.showSavePopup = false;
    this.savePortfolio();
  }
  

}