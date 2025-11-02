import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CustomSection {
  name: string;
  label: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private customSections = new BehaviorSubject<CustomSection[]>([]);

  constructor() {
    // Charger les sections personnalisées depuis le localStorage au démarrage
    const savedSections = localStorage.getItem('customSections');
    if (savedSections) {
      this.customSections.next(JSON.parse(savedSections));
    }
  }

  addCustomSection(newSection: any): void {
    const section: CustomSection = {
      name: newSection.name.toLowerCase(),
      label: newSection.name,
      fields: []
    };

    // Ajouter les champs en fonction des options sélectionnées
    if (newSection.hasText) {
      section.fields.push({ name: 'text', label: 'Texte', type: 'textarea' });
    }
    if (newSection.hasImage) {
      section.fields.push({ name: 'image', label: 'Image', type: 'file' });
    }
    if (newSection.hasDate) {
      section.fields.push({ name: 'date', label: 'Date', type: 'date' });
    }

    const currentSections = this.customSections.getValue();
    const updatedSections = [...currentSections, section];
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('customSections', JSON.stringify(updatedSections));
    this.customSections.next(updatedSections);
  }

  getCustomSections(): Observable<CustomSection[]> {
    return this.customSections.asObservable();
  }

  removeCustomSection(sectionName: string): void {
    const currentSections = this.customSections.getValue();
    const updatedSections = currentSections.filter(s => s.name !== sectionName);
    
    localStorage.setItem('customSections', JSON.stringify(updatedSections));
    this.customSections.next(updatedSections);
  }
}