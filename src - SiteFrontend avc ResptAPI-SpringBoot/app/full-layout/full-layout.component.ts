import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../services/rest-api.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {CategoryModel} from "../models/category.model";

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent implements OnInit {

  httpResponseAllCategories: any;
  allCategories: Array<CategoryModel> = new Array<CategoryModel>() ;
  productSearchKey: any;
  username: string = '' ;
  password: string = '' ;
  closeModal: boolean = false ;
  isAuthenticated = localStorage.getItem('authenticated');

  constructor(private restApiService: RestApiService,
              private router: Router,private modalService: NgbModal,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initAllCategories() ;
  }

  initAllCategories(){
    this.restApiService.findAll('categories').subscribe(data => {
      this.httpResponseAllCategories = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseAllCategories != null) {
          obtained = true ;
          this.allCategories = this.httpResponseAllCategories._embedded.categories ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement des Categories, Veuillez Rechargez la page !') ;
      console.log(error) ;
    }) ;
  }

  redirectOnProductList(byAttributName?: any, params1Name?: any, params1Value?: any){
    if (!byAttributName) {
      localStorage.removeItem('byAttributName') ;
      localStorage.removeItem('params1Name') ;
      localStorage.removeItem('params1Value') ;
      this.router.navigateByUrl('shop/product-list') ;
    } else {
      localStorage.setItem('byAttributName', byAttributName) ;
      localStorage.setItem('params1Name', params1Name) ;
      localStorage.setItem('params1Value', params1Value) ;
      this.router.navigateByUrl('shop/product-list') ;
    }
  }

  Login() {
    if (this.username != 'ADMIN') {
      this.toastrService.warning('Username Incorrect') ;
    } else {
      if (this.password != 'Mimi@@Pedro00') {
        this.toastrService.warning('Mot de Passe Incorrect !') ;
      } else {
        this.toastrService.success('Authentification Reussie !') ;
        localStorage.setItem('authenticated', 'true') ;
        this.closeModal = true ;
      }
    }
  }

  onCloseModal() {
    // this.router.navigateByUrl('/home') ;
    new Promise(resolve => {
      setTimeout(() => {
        this.closeModal = false ;
        this.router.navigateByUrl('home') ;
      }, 1000);
    }) ;
  }

  Logout() {
    let response = confirm('Voulez-vous vous deconnecter ?') ;
    if (response) {
      localStorage.removeItem('authenticated') ;
      this.isAuthenticated = null ;
      this.toastrService.info('Deconnecté !') ;
      this.router.navigateByUrl('home') ;
    }
  }

}
