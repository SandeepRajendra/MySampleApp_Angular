import { Component, inject } from '@angular/core';
import { FormsModule, NgForm  } from '@angular/forms';
import { Master } from '../../service/master';
import { Observable } from 'rxjs';
import { CommonModule, AsyncPipe} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './new-product.html',
  styleUrl: './new-product.css'
})
export class NewProduct {
  masterService = inject(Master);
  router = inject(Router);
  newProductObj: any = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    quantity: 0
  }

  dropDown1: Observable<any> = new Observable<any>();
  dropDown2: Observable<any> = new Observable<any>();

  // Pass data to the Observable 
  constructor(){
    this.dropDown1 = this.masterService.dropDown1();
    this.dropDown2 = this.masterService.dropDown2()
  }

  submitted = false;
  showSuccess = false;

  onSave(form: NgForm): void {
    this.submitted = true;

    if (!form.valid) {
      return;
    }

    this.masterService.createProduct(this.newProductObj).subscribe({
      next: (result: any) => {
        console.log('Product saved successfully', result);
        this.showSuccess = true;
        this.resetForm(form);
        this.router.navigate(['/list']);
      },
      error: (error) => {
        console.error('Error saving product:', error);
      }
    });
  }

  resetForm(form?: NgForm): void {
    this.submitted = false; // ✅ clear validation state
    this.newProductObj = {
      name: '',
      description: '',
      price: 0,
      quantity: 0
    };

    if (form) {
      form.resetForm(); // ✅ clears Angular form states too
    }

    this.showSuccess = false;
  }

  cancelForm(): void {
    this.router.navigate(['/list']);
  }
}
