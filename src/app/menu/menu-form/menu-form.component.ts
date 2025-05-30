import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../menu.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss'],
})
export class MenuFormComponent {
  form: FormGroup;
  selectedImage: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private menuService: MenuService) {
    this.form = this.fb.group({
      itemCode: [''],
      itemName: [''],
      description: [''],
      gstPercentage: [0],
      mrp: [0],
      salesRate: [0],
      categoryId: [0],
      isAvailable: [true],
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.selectedImage = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(this.selectedImage!);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.menuService.addMenuItem(formData).subscribe(() => {
      this.form.reset();
      this.selectedImage = null;
      this.previewImage = null;
    });
  }
}
