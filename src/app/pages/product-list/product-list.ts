import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Master } from '../../service/master';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  masterService = inject(Master);
  router = inject(Router);

  productList: any [] = [];
  editingIndex: number | null = null;
  updateProduct: any = {};
  
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.masterService.GetAllProduct().subscribe({
      next: (result: any) => {
        this.productList = result;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products.';
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  deleteProduct(index: number): void {
    const product = this.productList[index];
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.masterService.deleteProduct(product.id).subscribe({
        next: () => {
          this.productList.splice(index, 1); // remove from UI
        },
        error: (error) => {
          console.error('Delete error:', error);
          alert('Failed to delete the product.');
        }
      });
    }
  }

  updateProductClick(index: number): void {
    this.editingIndex = index;
    this.updateProduct = { ...this.productList[index] }; // deep copy
  }

  saveEdit(): void {
    if (this.editingIndex !== null) {
      const updatedProduct = { ...this.updateProduct};
      this.masterService.updateProduct(updatedProduct).subscribe({
        next: () => {
          this.productList[this.editingIndex!] = updatedProduct;
          this.cancelEdit();
        },
        error: (error) => {
          console.error('Update error:', error);
          alert('Failed to update the product.');
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingIndex = null;
    this.updateProduct = {};
  }
  
  createProduct(): void {
    this.router.navigate(['/createNew']);
  }
}


