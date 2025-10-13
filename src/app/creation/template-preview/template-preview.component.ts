import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-template-preview',
  templateUrl: './template-preview.component.html',
  standalone: true,
  styleUrls: ['./template-preview.component.scss']
})
export class TemplatePreviewComponent implements OnInit {
  data: any;            // les données du formulaire
  templateName: string | null = null;
  templateHtml: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const navState = history.state; // on récupère les données passées
    this.data = navState.data;
    this.templateName = navState.template;

    if (this.templateName) {
      // Charger le HTML du template depuis assets
      this.http.get(`assets/templates/${this.templateName}/template.html`, { responseType: 'text' })
        .subscribe(html => {
          this.templateHtml = this.replacePlaceholders(html, this.data);
        });
    }
  }

  replacePlaceholders(html: string, data: any): string {
    let result = html;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
      }
    }
    return result;
  }
}
