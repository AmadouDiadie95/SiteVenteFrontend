import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {FullLayoutComponent} from "./full-layout/full-layout.component";
import {ProductListComponent} from "./product-list/product-list.component";
import {CategoryListComponent} from "./category-list/category-list.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {AboutComponent} from "./about/about.component";
import {ContactComponent} from "./contact/contact.component";
import {Error404Component} from "./error404/error404.component";
import {CommandListComponent} from "./command-list/command-list.component";

const routes: Routes = [
  { path: '', redirectTo:'/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'shop',
    component: FullLayoutComponent,
    children:[
      { path: 'product-list', component: ProductListComponent},
      { path: 'category-list', component: CategoryListComponent},
      { path: 'command-list', component: CommandListComponent},
      { path: 'product-detail/:id', component: ProductDetailComponent},
      { path: 'about', component: AboutComponent},
      { path: 'contact', component: ContactComponent},
      { path: '404', component: Error404Component},
    ]
  },
  { path: '**', redirectTo:'/shop/404', pathMatch: 'full'},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
