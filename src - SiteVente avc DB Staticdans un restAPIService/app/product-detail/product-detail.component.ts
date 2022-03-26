import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductModel} from "../models/product.model";
import {RestApiService} from "../services/rest-api.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {CommandeModel} from "../models/commande.model";
import {error} from "@angular/compiler/src/util";
import {CategoryModel} from "../models/category.model";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  httpResponse: any ;
  productDetail: ProductModel = new ProductModel() ;
  mainImage: string = '' ;
  promoSearchKey: string = '' ;
  promoProduct1: ProductModel = new ProductModel() ;
  relatedProuctList: Array<ProductModel> = new Array<ProductModel>() ;
  closeModal?: boolean ;
  mode: string = 'saisie' ;
  newCommand: CommandeModel = new CommandeModel() ;
  isAuthenticated = localStorage.getItem('authenticated');
  httpResponseOneProduct: any;
  uploadedImage: any;
  productFormMode: string = 'detail';
  httpResponseAllCategories: any;
  // allCategories: Array<CategoryModel> = new Array<CategoryModel>() ;
  allCategories: Array<CategoryModel> = this.restApiService.allCategories ;

  constructor(private route: ActivatedRoute,private restApiService: RestApiService,
              private router: Router,private modalService: NgbModal,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.newCommand.quantityChoiced = 1 ;
    this.productDetail.id = this.route.snapshot.paramMap.get('id') ;
    /*this.restApiService.findById('products', this.productDetail.id).subscribe(data => {
      this.httpResponse = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true ;
          this.productDetail = this.httpResponse ;
          this.mainImage = this.productDetail.image ;
          this.httpResponse = null ;
          this.getRelatedProduct(this.productDetail.categoryName) ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement du Produit, Veuillez Rechargez la page !') ;
      console.log(error) ;
    }) ;*/
    this.restApiService.allProducts.forEach(p => {
      if (p.id == this.productDetail.id) {
        this.productDetail = p ;
        this.mainImage = this.productDetail.image ;
        this.getRelatedProduct2(this.productDetail.categoryName) ;
      }
      if (p.particularity == 'promoProduct1') {
        this.promoProduct1 = p ;
      }
    }) ;


    /*this.restApiService.findByOneAttribut('products', 'ByParticularity',
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
    }) ;*/

    // this.initAllCategories() ;

  }

  getRelatedProduct2(categoryName: any) {
    this.relatedProuctList = new Array<ProductModel>() ;
    this.restApiService.allProducts.forEach(product => {
      if (product.categoryName == categoryName) {
        this.relatedProuctList.push(product) ;
      }
    }) ;
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

  showPromoProduct() {
    let product = this.productDetail ;
    this.productDetail = this.promoProduct1 ;
    this.mainImage = this.promoProduct1.image ;
    this.promoProduct1 = product ;
    this.getRelatedProduct2(this.productDetail.categoryName) ;
  }

  showRelatedOneProduct(productToShow: ProductModel) {
    this.productDetail = productToShow ;
    this.mainImage = this.productDetail.image ;
  }

  getRelatedProduct(categoryName: any) {
    this.restApiService.findByOneAttribut('products', 'ByCategoryName',
      'categoryName', categoryName).subscribe(data => {
      this.httpResponse = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true ;
          this.relatedProuctList = this.httpResponse._embedded.products ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement de la page, Veuillez Rechargez !') ;
      console.log(error) ;
    }) ;
  }


  onCloseModal() {
    // this.router.navigateByUrl('/home') ;
    new Promise(resolve => {
      setTimeout(() => {
        this.closeModal = false ;
      }, 1000);
    }) ;
  }

  onCommandModalOpen() {
    this.newCommand.quantityChoiced = 1 ;
    this.newCommand.totalPrice = this.productDetail.price ;
    this.newCommand.productPrice = this.productDetail.price ;
    this.newCommand.commandeDate = new Date() ;
    this.newCommand.productName = this.productDetail.name ;
  }


  testCommandBeforeChangeMode() {
    let commandValid = true ;
    if (this.newCommand.clientName == null || this.newCommand.clientName == '' ||  this.newCommand.clientName == ' ' ||
      this.newCommand.clientPrenom == null || this.newCommand.clientPrenom == '' || this.newCommand.clientPrenom == ' ')  {
      this.toastrService.error('Veuillez Indiquez votre Nom et votre Prenom !') ;
      commandValid = false ;
    }

    if (this.newCommand.clientTel == null || this.newCommand.clientTel == '' ||  this.newCommand.clientTel == ' ')  {
      this.toastrService.error('Veuillez Indiquez au moins votre Numero de Telephone !') ;
      commandValid = false ;
    }

    if (this.newCommand.quantityChoiced < 1)  {
      this.toastrService.error('La Quantité Choisie ne peut etre 0 !') ;
      commandValid = false ;
    }

    if (commandValid) {
      this.mode = 'detail';
    }

  }

  SaveCommand() {
    this.restApiService.save('commandes', this.newCommand).subscribe(data => {
      this.toastrService.success('Commande Effectué avec Success', 'Merci de votre Confiance !') ;
      this.closeModal = true ;
    }, error => {
      this.toastrService.error("Une Erreur s'est Produite, Veuillez Ressayer ! ") ;
      this.closeModal = false ;
      console.log(error) ;
    })
  }

  testAndSaveProduct() {
    let valid = true ;
    if (this.productDetail.name == null || this.productDetail.name == '' || this.productDetail.name == ' ') {
      valid = false ;
      this.toastrService.error('Veuillez Indiquer le Nom du Produit !')
    } else {
      this.restApiService.findByOneAttribut('products', 'ByName',
        'name', this.productDetail.name).subscribe(data => {
        this.httpResponseOneProduct = data ;
        let obtained = false;
        while (!obtained) {
          if (this.httpResponseOneProduct != null) {
            obtained = true ;
            console.log(this.httpResponseOneProduct) ;
            if (this.httpResponseOneProduct.id) {
              if (this.httpResponseOneProduct.id != this.productDetail.id ) {
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

    if (this.productDetail.price == null || this.productDetail.quantity == null) {
      valid = false ;
      this.toastrService.warning('Veuillez Indiquer le prix et la Quantité !') ;
    }

    if (this.productDetail.categoryName == null) {
      valid = false ;
      this.toastrService.warning('Veuillez Indiquez la Categorie !') ;
    }

    if (valid) {
        this.restApiService.put('products', this.productDetail.id, this.productDetail)
          .subscribe(data => {
              this.toastrService.success('Success');
              this.closeModal = true;
              this.productFormMode = 'detail' ;
            }, error => {
              this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de données, Veuillez Ressayer !');
            }
          );
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
        this.productDetail.image2 = reader.result ;
      } else if (imageNumber == 3) {
        this.productDetail.image3 = reader.result ;
      } else if (imageNumber == 4) {
        this.productDetail.image4 = reader.result ;
      } else if (imageNumber == 5) {
        this.productDetail.image5 = reader.result ;
      } else if (imageNumber == 1) {
        this.productDetail.image = reader.result ;
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
        this.productDetail = new ProductModel() ;
      }, error => {
        this.toastrService.error('Erreur lors de la Sauvegarde, Veuillez Ressayer !') ;
        console.log(error) ;
      })
    }
  }
}
