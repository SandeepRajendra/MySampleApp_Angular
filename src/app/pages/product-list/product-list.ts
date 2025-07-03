import { Component, inject, OnInit,ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Master } from '../../service/master';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

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
  cart: any[] = [];
  isLoading = false;
  errorMessage = '';
  toastMessage = '';

  @ViewChild('cartModalRef') cartModalRef!: ElementRef;

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

  getCartQuantity(product: any): number {
    const item = this.cart.find(x => x.name === product.name);
    return item ? item.quantity : 0;
  }
  
  addToCart(product: any) {
    const existing = this.cart.find(item => item.name === product.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.showToast(`🛒 ${product.name} added to cart`);
  }
  
  increaseQuantity(product: any) {
    this.addToCart(product); // same as add
  }
  
  decreaseQuantity(product: any) {
    const index = this.cart.findIndex(item => item.name === product.name);
    if (index !== -1) {
      this.cart[index].quantity -= 1;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
        this.showToast(`🗑️ ${product.name} removed from cart`);
      } else {
        this.showToast(`➖ ${product.name} quantity decreased`);
      }
    }
  }

  removeFromCart(product: any) {
    this.cart = this.cart.filter(item => item.name !== product.name);
    this.showToast(`🗑️ ${product.name} removed from cart`);
  }

  getCartItemCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  get cartTotal(): number {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  toggleCartModal() {
    const modal = new bootstrap.Modal(this.cartModalRef.nativeElement);
    modal.show();
  }

  checkout() {
    this.showToast('✅ Checkout successful!');
    this.cart = [];
  }
}


