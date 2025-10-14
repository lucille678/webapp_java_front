import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preview-container" [innerHTML]="templateHtml"></div>
  `,
  styleUrls: ['./template-preview.component.scss']
})
export class TemplatePreviewComponent implements OnInit {
  data: any;
  templateHtml: string = '';
  template: string = '';

  constructor(private router: Router, private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit(): void {
    const state = history.state;
    this.template = state.template;
    this.data = state.data;

    if (this.template) {
      this.http.get(`assets/templates/${this.template}/template.html`, { responseType: 'text' })
        .subscribe(html => {
          this.templateHtml = this.interpolate(html, this.data);

          const link = this.renderer.createElement('link');
          link.rel = 'stylesheet';
          link.href = `assets/templates/${this.template}/style.css`;
          this.renderer.appendChild(document.head, link);
        });
    }
  }

  interpolate(html: string, data: any): string {
    html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
      const keys = path.split('.');
      let value = data;
      for (let key of keys) value = value?.[key];
      return value ?? '';
    });

    html = html.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, arrayName, innerHtml) => {
      const arr = data[arrayName];
      if (!Array.isArray(arr)) return '';
      return arr.map(item => this.interpolate(innerHtml, item)).join('');
    });

    return html;
  }

}


