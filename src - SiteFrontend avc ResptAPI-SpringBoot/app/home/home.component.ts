import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../services/rest-api.service";
import {Observable} from "rxjs";
import {catchError, map, startWith} from "rxjs/operators";
import {of} from "rxjs";
import {AppDataState, DataStateEnum} from "../state/product.state";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ProductModel} from "../models/product.model";
import {CategoryModel} from "../models/category.model";
import {ImageModel} from "../models/image.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listCategories$: Observable<AppDataState<any[]>> | null = null ;
  imageToChange$: Observable<AppDataState<any[]>> | null = null ;
  promoProductSearch$: Observable<AppDataState<any>> | null = null ;
  DataStateEnum=DataStateEnum;
  DataStateEnum2=DataStateEnum;
  uploadedImage: any ;
  dbImage: any;
  postResponse: any;
  successResponse: string = '';
  newProduct: ProductModel = new ProductModel() ;
  newCategory: CategoryModel = new CategoryModel() ;
  closeModal?: boolean ;
  httpResponseOneProduct: any;
  httpResponseAllCategories: any;
  httpResponseAllnewProducts: any;
  httpResponseAllPopularsProducts: any;
  httpResponseAllHeaderCar: any;
  httpResponseImages: any;
  allCategories: Array<CategoryModel> = new Array<CategoryModel>() ;
  imageHeaderCar1: ImageModel = new ImageModel() ;
  imageHeaderCar2: ImageModel = new ImageModel() ;
  imageHeaderBanner1: ImageModel = new ImageModel() ;
  imageHeaderBanner2: ImageModel = new ImageModel() ;
  imageHeaderBanner3: ImageModel = new ImageModel() ;
  imageMiddleBanner: ImageModel = new ImageModel() ;
  imageMiddleBanner2: ImageModel = new ImageModel() ;
  productFormMode: string = 'detail' ;
  allNewProducts: Array<ProductModel> = new Array<ProductModel>() ;
  allPopularsProducts: Array<ProductModel> = new Array<ProductModel>() ;
  updateProduct: boolean = false ;
  promoSearchKey: string = '' ;
  promoProduct1: ProductModel = new ProductModel() ;
  promoProduct2: ProductModel = new ProductModel() ;
  promoProductModalSelected: number = 1 ;
  productSearchKey: string = '';
  isAuthenticated = localStorage.getItem('authenticated');

  constructor(private restApiService: RestApiService, private httpClient: HttpClient,
              private router: Router,private modalService: NgbModal,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initAllImage() ;
    this.initAllProducts() ;
    /*this.listCategories$ =
      this.restApiService.findAll('categories').pipe(
        map(data=>{
          console.log(data);
          return ({dataState:DataStateEnum.LOADED,data:data})
        }),
        startWith({dataState:DataStateEnum.LOADING}),
        catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
      ) ;*/
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

  initAllImage(){
    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'header-caroussel-1').subscribe(data => {
      this.httpResponseImages = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseImages != null) {
          obtained = true ;
          this.imageHeaderCar1 = this.httpResponseImages;
          this.httpResponseImages = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'header-caroussel-2').subscribe(data => {
      this.httpResponseImages = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseImages != null) {
          obtained = true ;
          this.imageHeaderCar2 = this.httpResponseImages;
          this.httpResponseImages = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'header-banner-1').subscribe(data => {
      this.httpResponseImages = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseImages != null) {
          obtained = true ;
          this.imageHeaderBanner1 = this.httpResponseImages ;
          this.httpResponseImages = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'header-banner-2').subscribe(data => {
      this.httpResponseImages = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseImages != null) {
          obtained = true ;
          this.imageHeaderBanner2 = this.httpResponseImages ;
          this.httpResponseImages = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'header-banner-3').subscribe(data => {
      this.httpResponseImages = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseImages != null) {
          obtained = true ;
          this.imageHeaderBanner3 = this.httpResponseImages ;
          this.httpResponseImages = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'middle-banner-1').subscribe(data => {
      this.httpResponseImages = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseImages != null) {
          obtained = true ;
          this.imageMiddleBanner = this.httpResponseImages ;
          this.httpResponseImages = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

    this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', 'middle-banner-2').subscribe(data => {
      this.httpResponseImages = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseImages != null) {
          obtained = true ;
          this.imageMiddleBanner2 = this.httpResponseImages ;
          this.httpResponseImages = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;



  }

  initAllProducts() {
    this.restApiService.findByOneAttribut('products', 'ByPopulary',
      'populary', true).subscribe(data => {
      this.httpResponseAllPopularsProducts = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseAllPopularsProducts != null) {
          obtained = true ;
          this.allPopularsProducts = this.httpResponseAllPopularsProducts._embedded.products ;
          this.httpResponseAllPopularsProducts = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

    this.restApiService.findByOneAttribut('products', 'ByNewProduct',
      'newProduct', true).subscribe(data => {
      this.httpResponseAllnewProducts = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseAllnewProducts != null) {
          obtained = true ;
          this.allNewProducts = this.httpResponseAllnewProducts._embedded.products ;
          this.httpResponseAllnewProducts = null ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

    this.restApiService.findByOneAttribut('products', 'ByParticularity',
      'particularity', 'promoProduct1').subscribe(data => {
      this.promoProduct1 = data ;
      let obtained = false;
      while (!obtained) {
        if (this.promoProduct1.id != null) {
          obtained = true ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

    this.restApiService.findByOneAttribut('products', 'ByParticularity',
      'particularity', 'promoProduct2').subscribe(data => {
      this.promoProduct2 = data ;
      let obtained = false;
      while (!obtained) {
        if (this.promoProduct2.id != null) {
          obtained = true ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;

  }

  public onImageUpload(event: any) {
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
      this.dbImage = reader.result;
    }
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
        this.newProduct.image2 = reader.result ;
      } else if (imageNumber == 3) {
        this.newProduct.image3 = reader.result ;
      } else if (imageNumber == 4) {
        this.newProduct.image4 = reader.result ;
      } else if (imageNumber == 5) {
        this.newProduct.image5 = reader.result ;
      } else if (imageNumber == 6) {
        this.newCategory.image = reader.result ;
      }
    } ;
  }

  /*viewImage() {
    this.httpClient.get('http://localhost:9091/get/image/info/' + this.image)
      .subscribe(
        res => {
          console.log(res) ;
          this.postResponse = res;
          this.dbImage = 'data:image/jpeg;base64,' + this.postResponse.image;
        }
      );
  }*/

  openVerticallyCentered(content3: any, product?: any) {
    // this.courseToChange = course ;
    this.modalService.open(content3);
  }

  testAndSaveProduct() {

    let valid = true ;
    if (this.newProduct.name == null || this.newProduct.name == '' || this.newProduct.name == ' ') {
      valid = false ;
      this.toastrService.error('Veuillez Indiquer le Nom du Produit !')
    } else {
      this.restApiService.findByOneAttribut('products', 'ByName',
        'name', this.newProduct.name).subscribe(data => {
        this.httpResponseOneProduct = data ;
        let obtained = false;
        while (!obtained) {
          if (this.httpResponseOneProduct != null) {
            obtained = true ;
            console.log(this.httpResponseOneProduct) ;
            if (this.httpResponseOneProduct.id) {
              if (!this.updateProduct || this.updateProduct && this.httpResponseOneProduct.id != this.newProduct.id ) {
                console.log(!this.updateProduct || this.updateProduct && this.httpResponseOneProduct == this.newProduct) ;
                valid = false;
                this.toastrService.error('Un autre produit possède déjà ce nom, Veuillez Saisir un autre nom !');
              } else {
                this.httpResponseOneProduct == null ;
                this.continueSaveProduct() ;
              }
            } else {
              this.httpResponseOneProduct == null ;
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
      }) ;
    }


  }

  continueSaveProduct() {
    let valid = true ;

    if (this.newProduct.price == null || this.newProduct.quantity == null) {
      valid = false ;
      this.toastrService.warning('Veuillez Indiquer le prix et la Quantité !') ;
    }

    if (this.newProduct.categoryName == null) {
      valid = false ;
      this.toastrService.warning('Veuillez Indiquez la Categorie !') ;
    }

    if (valid) {
      this.newProduct.image = this.dbImage ;
      // console.log(this.newProduct) ;
      if (!this.updateProduct) {
        this.newProduct.addDate = new Date();
        this.restApiService.save('products', this.newProduct)
          .subscribe(data => {
              this.toastrService.success('Success');
              this.closeModal = true;
              this.newProduct = new ProductModel();
              this.dbImage = null;
              this.initAllProducts() ;
            }, error => {
              this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de données, Veuillez Ressayer !');
            }
          );
      } else {
        this.restApiService.put('products', this.newProduct.id, this.newProduct)
          .subscribe(data => {
              this.toastrService.success('Success');
              this.closeModal = true;
              this.newProduct = new ProductModel();
              this.dbImage = null;
              this.initAllProducts() ;
            }, error => {
              this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de données, Veuillez Ressayer !');
            }
          );
      }
      this.updateProduct = false ;
    } // If Valid

  }

  testAndSaveCategory() {
    if ( this.newCategory.name == null || this.newCategory.name == '' || this.newCategory.name == ' ' ) {
      this.toastrService.error('Veuillez indiquer le Nom de la Categorie !')
    } else {
      this.restApiService.save('categories', this.newCategory).subscribe(data => {
        this.toastrService.success('Success') ;
        this.closeModal = true ;
        this.newCategory = new CategoryModel() ;
      }, error => {
        this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de donnée, Veuillez Ressayer !') ;
        console.log(error) ;
      }) ;
    }
  }


  onCloseModal() {
    // this.router.navigateByUrl('/home') ;
    this.initAllImage() ;
    new Promise(resolve => {
      setTimeout(() => {
        this.closeModal = false ;
      }, 1000);
    }) ;
  }


  onChangeImage(imageIdentifier: string) {
    this.imageToChange$ = this.restApiService.findByOneAttribut('images', 'ByIdentifier',
      'identifier', imageIdentifier).pipe(
      map(data=>{
        // console.log(data);
        this.dbImage = data.image ;
        return ({dataState:DataStateEnum.LOADED,data:data})
      }),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    ) ;
  }

  testAndSaveImage(data: ImageModel) {
    console.log(data) ;
    data.image = this.dbImage ;
    this.restApiService.put('images', data.id, data).subscribe(data => {
      this.toastrService.success('Success') ;
      this.closeModal = true ;
    }, error => {
      this.toastrService.error('Erreur lors de la Sauvegarde, Veuillez Ressayer !') ;
      console.log(error) ;
    }) ;
  }

  onImageUploadForImageChange(event: any): any {
    this.uploadedImage = event.target.files[0];
    const files = event.target.files;
    const mimeType = files[0].type;
    let response ;
    if (mimeType.match(/image\/*/) == null) {
      //this.message = "Only images are supported.";
      this.toastrService.warning('Veuillez Selectionner une image !') ;
    } else {
      this.toastrService.info('Image mise a jour !') ;
      const reader = new FileReader();
      //this.imagePath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        response = reader.result;
      } ;
    }

    return response ;

  }

  onProductModalOpen(productToUpdate?: ProductModel) {
    this.productFormMode = 'detail' ;
    if (!productToUpdate) {
      // this.newProduct = new ProductModel()
    } else {
      this.newProduct = productToUpdate ;
      this.dbImage = productToUpdate.image ;
      this.updateProduct = true ;
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

  getPromoProduct() {
    this.promoProductSearch$ = this.restApiService.findByOneAttribut('products', 'ByName',
      'name', this.promoSearchKey).pipe(
      map(data=>{
        console.log(data);
        return ({dataState:this.DataStateEnum2.LOADED,data:data})
      }),
      startWith({dataState:this.DataStateEnum2.LOADING}),
      catchError(err=>of({dataState:this.DataStateEnum2.ERROR, errorMessage:err.message}))
    ) ;
  }


  affectPromoProduct(data: any) {
    if (this.promoProductModalSelected == 1) {
      this.updateOldPromoProduct(this.promoProduct1) ;
      this.promoProduct1 = data ;
      this.updateNewPromoProduct(this.promoProduct1, 'promoProduct1') ;
    } else if (this.promoProductModalSelected == 2) {
      this.updateOldPromoProduct(this.promoProduct2) ;
      this.promoProduct2 = data ;
      this.updateNewPromoProduct(this.promoProduct2, 'promoProduct2') ;
    }
    new Promise(resolve => {
      setTimeout(() => {
        this.promoSearchKey = '' ;
        this.promoProductSearch$ = null ;
      }, 1000);
    }) ;

  }

  updateOldPromoProduct(promoProduct: ProductModel) {
    if (promoProduct.id) {
      promoProduct.particularity = '' ;
      this.restApiService.put('products', promoProduct.id, promoProduct).subscribe(
        data => {
          this.toastrService.success('Success') ;
        }, error => {
          this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de données, Veuillez Ressayer !') ;
          console.log(error) ;
        }) ;
    }
  }

  updateNewPromoProduct(promoProduct: ProductModel, particularity: string) {
    promoProduct.particularity = particularity ;
    this.restApiService.put('products', promoProduct.id, promoProduct).subscribe(
      data => {
        this.toastrService.success('Success') ;
      }, error => {
        this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de données, Veuillez Ressayer !') ;
        console.log(error) ;
      }) ;
  }

  showOneProduct(id: any) {
    this.router.navigateByUrl('shop/product-detail/' + id) ;
  }

  /*searchProduct(){
    this.restApiService.findByTwoAttribut('products','ByNameOrDescriptionContains',
      'name', this.productSearchKey,
        'description', '').subscribe(data => {

    }) ;
  }*/

  Logout() {
    let response = confirm('Voulez-vous vous deconnecter ?') ;
    if (response) {
      localStorage.removeItem('authenticated') ;
      this.isAuthenticated = null ;
      this.toastrService.info('Deconnecté !') ;
      this.router.navigateByUrl('home') ;
    }
  }

  DeleteProduct(data: any) {
    let respone = confirm('Confirmez la Suppression (Action Irreversible) ?') ;
    if (respone) {
      this.restApiService.deleteById('products', data.id).subscribe(data => {
        this.toastrService.success('Success') ;
        this.closeModal = true ;
        this.initAllProducts() ;
      }, error => {
        this.toastrService.error('Erreur lors de la Sauvegarde, Veuillez Ressayer !') ;
        console.log(error) ;
      })
    }
  }
}
