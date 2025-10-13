import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements OnInit {
  templateName: string | null = null;
  config: any;
  formData: any = {};

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  onFileChange(event: Event, fieldName: string) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.formData[fieldName] = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    this.templateName = this.route.snapshot.paramMap.get('templateName');
    if (this.templateName) {
      this.http.get(`assets/templates/${this.templateName}/config.json`).subscribe(data => {
        this.config = data;
      });
    }
  }

  onSubmit() {
    console.log(this.formData);
    this.router.navigate(['/preview'], { state: { data: this.formData, template: this.templateName } });
  }
}





