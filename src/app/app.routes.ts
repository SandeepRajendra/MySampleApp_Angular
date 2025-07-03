import { Routes } from '@angular/router';
import { ProductList } from './pages/product-list/product-list';
import { NewProduct } from './pages/new-product/new-product';

export const routes: Routes = [

    {
        path : '',
        redirectTo:"list",
        pathMatch:'full'
      },
      {
       path:'list',
       component:ProductList
      },
      {
        path:'createNew',
        component:NewProduct
       }
];
