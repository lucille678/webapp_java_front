import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {
  templateName: string | null = null;
  config: any;
  formData: any = {};

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  onFileChange(event: any, sectionName: string, fieldName: string, index?: number) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const fileData = {
        name: file.name,
        type: file.type,
        content: reader.result // base64
      };

      if (index !== undefined) {
        this.formData[sectionName][index][fieldName] = fileData;
      } else {
        this.formData[sectionName][fieldName] = fileData;
      }
    };

    // On lit le fichier comme Base64 (pour preview image ou pdf)
    reader.readAsDataURL(file);
  }

  ngOnInit(): void {
    // Load config comme avant
    this.templateName = this.route.snapshot.paramMap.get('templateName');
    if (this.templateName) {
      this.http.get(`assets/templates/${this.templateName}/config.json`).subscribe((data: any) => {
        this.config = data;
        // Initialiser formData
        this.config.sections.forEach((section: any) => {
          if (section.repeatable) {
            this.formData[section.name] = [];
          } else {
            this.formData[section.name] = {};
          }
        });
        const savedData = localStorage.getItem(`formData_${this.templateName}`);
        if (savedData) {
          this.formData = JSON.parse(savedData);
        }
      });
    }
  }

  addItem(sectionName: string) {
    const sectionConfig = this.config.sections.find((s: any) => s.name === sectionName);
    const newItem: any = {};
    sectionConfig.fields.forEach((f: any) => newItem[f.name] = '');
    this.formData[sectionName].push(newItem);
  }

  removeItem(sectionName: string, index: number) {
    this.formData[sectionName].splice(index, 1);
  }


  onSubmit() {
    // Sauvegarde locale
    localStorage.setItem(`formData_${this.templateName}`, JSON.stringify(this.formData));

    this.router.navigate(['/preview'], {
      state: { data: this.formData, template: this.templateName }
    });
  }


}





