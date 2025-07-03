import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Master {

  private readonly baseUrl = 'https://localhost:7206/api/Products';

  constructor(private http: HttpClient) { }
  createProduct(product: any){
    return this.http.post(this.baseUrl,product)
  }

  GetAllProduct(){
    return this.http.get(this.baseUrl)
  }

  updateProduct(product: any){
    return this.http.put(`${this.baseUrl}/${product.id}`, product)
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  dropDown1(){
    return this.http.get("https://localhost:7206/api/Products")
  }

  dropDown2(){
    return this.http.get("https://localhost:7206/api/Products")
  }
}
