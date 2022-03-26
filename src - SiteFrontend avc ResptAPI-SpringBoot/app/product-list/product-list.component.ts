import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../services/rest-api.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ProductModel} from "../models/product.model";
import {AppDataState, DataStateEnum} from "../state/product.state";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {CategoryModel} from "../models/category.model";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  httpResponse: any ;
  // productsList: Array<ProductModel> = new Array<ProductModel>() ;
  productsList$: Observable<AppDataState<any[]>> | null = null ;
  DataStateEnum=DataStateEnum;
  productFormMode: string = 'detail';
  updateProduct: boolean = false ;
  productOnModal: ProductModel = new ProductModel() ;
  closeModal: boolean = false ;
  httpResponseOneProduct: any;
  uploadedImage: any;
  httpResponseAllCategories: any;
  allCategories: Array<CategoryModel> = new Array<CategoryModel>() ;
  numberOfProducts: any ;
  isAuthenticated = localStorage.getItem('authenticated');

  constructor(private restApiService: RestApiService,
              private router: Router,private modalService: NgbModal,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getProductsList() ;
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

  getProductsList(){
    if (localStorage.getItem('byAttributName') != null ) {
      this.productsList$ = this.restApiService.findByOneAttribut('products',
        localStorage.getItem('byAttributName'), localStorage.getItem('params1Name'),
        localStorage.getItem('params1Value')).pipe(
        map(data => {
          // console.log(data);
          this.numberOfProducts = data._embedded.products.length ;
          return ({dataState: DataStateEnum.LOADED, data: data})
        }),
        startWith({dataState: DataStateEnum.LOADING}),
        catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
      );
    } else {
      this.productsList$ =
        this.restApiService.findAll('products').pipe(
          map(data => {
            // console.log(data);
            this.numberOfProducts = data._embedded.products.length ;
            return ({dataState: DataStateEnum.LOADED, data: data})
          }),
          startWith({dataState: DataStateEnum.LOADING}),
          catchError(err => of({dataState: DataStateEnum.ERROR, errorMessage: err.message}))
        );
    }
  }


  onProductModalOpen(productToUpdate?: ProductModel) {
    this.productFormMode = 'detail' ;
    if (!productToUpdate) {
      this.productOnModal = new ProductModel() ;
      this.updateProduct = false ;
    } else {
      this.productOnModal = productToUpdate ;
      this.updateProduct = true ;
    }
  }

  onCloseModal() {
    // this.router.navigateByUrl('/home') ;
    this.getProductsList() ;
    new Promise(resolve => {
      setTimeout(() => {
        this.closeModal = false ;
      }, 1000);
    }) ;
  }

  testAndSaveProduct() {

    let valid = true ;
    if (this.productOnModal.name == null || this.productOnModal.name == '' || this.productOnModal.name == ' ') {
      valid = false ;
      this.toastrService.error('Veuillez Indiquer le Nom du Produit !')
    } else {
      this.restApiService.findByOneAttribut('products', 'ByName',
        'name', this.productOnModal.name).subscribe(data => {
        this.httpResponseOneProduct = data ;
        let obtained = false;
        while (!obtained) {
          if (this.httpResponseOneProduct != null) {
            obtained = true ;
            console.log(this.httpResponseOneProduct) ;
            if (this.httpResponseOneProduct.id) {
              if (!this.updateProduct || this.updateProduct && this.httpResponseOneProduct.id != this.productOnModal.id ) {
                console.log(!this.updateProduct || this.updateProduct && this.httpResponseOneProduct == this.productOnModal) ;
                valid = false;
                this.toastrService.error('Un autre produit possède déjà ce nom, Veuillez Saisir un autre nom !');
              } else {
                this.continueSaveProduct() ;
              }
            } else {
              this.continueSaveProduct() ;
            }
          }
        } // Fin While

      }, error => {
        if (error.status == 404) {
          this.continueSaveProduct()
        } else {
          this.toastrService.error('Erreur lors du Chargement, Veuillez Ressayez !') ;
          console.log(error) ;
        }
      })
    }


  }

  continueSaveProduct() {
    let valid = true ;

    if (this.productOnModal.price == null || this.productOnModal.quantity == null) {
      valid = false ;
      this.toastrService.warning('Veuillez Indiquer le prix et la Quantité !') ;
    }

    if (this.productOnModal.categoryName == null) {
      valid = false ;
      this.toastrService.warning('Veuillez Indiquez la Categorie !') ;
    }

    if (valid) {
      if (!this.updateProduct) {
        this.productOnModal.addDate = new Date();
        this.restApiService.save('products', this.productOnModal)
          .subscribe(data => {
              this.toastrService.success('Success');
              this.closeModal = true;
              this.productOnModal = new ProductModel();
              this.getProductsList() ;
            }, error => {
              this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de données, Veuillez Ressayer !');
            }
          );
      } else {
        this.restApiService.put('products', this.productOnModal.id, this.productOnModal)
          .subscribe(data => {
              this.toastrService.success('Success');
              this.closeModal = true;
              this.productOnModal = new ProductModel();
              this.getProductsList() ;
            }, error => {
              this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de données, Veuillez Ressayer !');
            }
          );
      }
    } // If Valid

  }

  public onProductImage2345Upload(event: any, imageNumber: number) {
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
      // console.log(reader.result) ;
      if (imageNumber == 2) {
        this.productOnModal.image2 = reader.result ;
      } else if (imageNumber == 3) {
        this.productOnModal.image3 = reader.result ;
      } else if (imageNumber == 4) {
        this.productOnModal.image4 = reader.result ;
      } else if (imageNumber == 5) {
        this.productOnModal.image5 = reader.result ;
      } else if (imageNumber == 1) {
        this.productOnModal.image = reader.result ;
      }
    } ;
  }

  showOneProduct(id: any) {
    this.router.navigateByUrl('shop/product-detail/' + id) ;
  }

  DeleteProduct(data: any) {
    let respone = confirm('Confirmez la Suppression (Action Irreversible) ?') ;
    if (respone) {
      this.restApiService.deleteById('products', data.id).subscribe(data => {
        this.toastrService.success('Success') ;
        this.closeModal = true ;
        this.getProductsList() ;
      }, error => {
        this.toastrService.error('Erreur lors de la Sauvegarde, Veuillez Ressayer !') ;
        console.log(error) ;
      })
    }
  }

}
