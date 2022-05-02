import { Component, OnInit } from '@angular/core';
import {CategoryModel} from "../models/category.model";
import {RestApiService} from "../services/rest-api.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categoryToUpdate: CategoryModel = new CategoryModel() ;
  closeModal?: boolean ;
  httpResponseAllCategories: any;
  allCategories: Array<CategoryModel> = new Array<CategoryModel>() ;
  uploadedImage: any ;
  isAuthenticated = localStorage.getItem('authenticated');
  fileToSend: any;
  categoryModalImage: string | ArrayBuffer | null;
  updateCategory: boolean = false ;

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
          this.allCategories = this.httpResponseAllCategories ;
          // console.log(this.allCategories) ;
        }
      } // Fin While
    }, error => {
      // console.log(error) ;
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !');
      console.log(error);
    }) ;
  }

  onUploadCategoryImage(event: any) {
    this.uploadedImage = event.target.files[0];
    const files = event.target.files;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      //this.message = "Only images are supported.";
      this.toastrService.warning('Veuillez Selectionner une image !') ;
      return;
    }
    const reader = new FileReader();
    //this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      // this.categoryToUpdate.image = reader.result;
      this.categoryModalImage = reader.result ;
      this.fileToSend = event.target.files ;
    }
  }

  onCloseModal() {
    // this.router.navigateByUrl('/home') ;
    this.initAllCategories() ;
    new Promise(resolve => {
      setTimeout(() => {
        this.closeModal = false ;
      }, 1000);
    }) ;
  }

  testAndSaveCategory() {
    if ( this.categoryToUpdate.name == null || this.categoryToUpdate.name == '' || this.categoryToUpdate.name == ' ' ) {
      this.toastrService.error('Veuillez indiquer le Nom de la Categorie !')
    } else  if ( this.fileToSend == null ) {
      this.saveCategory();
    } else {
      this.categoryToUpdate.image = this.fileToSend.item(0).name ;
      const file: File | null = this.fileToSend.item(0) ;
      if (file) {
        let cpt = 1 ;
        this.restApiService.uploadFile(file).subscribe(data => {
          if (cpt == 1) {
            this.saveCategory();
            cpt++
          }
        }, error => {
          this.toastrService.warning("Le chargement de l'image peut prendre un certain Temps, Veuillez Recharger si l'image n'apparaît pas !!")
          console.log(error) ;
        });
      }
    }
  }

  private saveCategory() {
    if (this.updateCategory) {
      this.restApiService.put('categories', this.categoryToUpdate.id, this.categoryToUpdate).subscribe(data => {
        this.toastrService.success('Success');
        this.closeModal = true;
        this.categoryToUpdate = new CategoryModel();
        this.fileToSend = null;
        this.categoryModalImage = null;
      }, error => {
        // this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de donnée, Veuillez Ressayer !') ;
        console.log(error);
      });
    } else {
      this.restApiService.save('categories', this.categoryToUpdate).subscribe(data => {
        this.toastrService.success('Success');
        this.closeModal = true;
        this.categoryToUpdate = new CategoryModel();
        this.fileToSend = null;
        this.categoryModalImage = null;
      }, error => {
        // this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de donnée, Veuillez Ressayer !') ;
        console.log(error);
      });
    }
  }

  onCategoryModalOpen(category?: CategoryModel) {
    this.closeModal = false;
    if (category) {
      this.updateCategory = true ;
      this.categoryToUpdate = category;
      this.categoryModalImage = 'assets/images/mimipedro/' + category.image ;
    } else {
      this.updateCategory = false ;
      this.categoryToUpdate = new CategoryModel() ;
    }
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

  DeleteCategory(data: any) {
    let respone = confirm('Confirmez la Suppression (Action Irreversible) ?') ;
    if (respone) {
      this.restApiService.deleteById('categories', data.id).subscribe(data => {
        this.toastrService.success('Success') ;
        this.closeModal = true ;
        this.initAllCategories() ;
      }, error => {
        this.toastrService.error('Erreur lors de la Sauvegarde, Veuillez Ressayer !') ;
        console.log(error) ;
      })
    }
  }
}
