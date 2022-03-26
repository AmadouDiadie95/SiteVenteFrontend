import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductModel} from "../models/product.model";
import {RestApiService} from "../services/rest-api.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {CommandeModel} from "../models/commande.model";
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
  allCategories: Array<CategoryModel> = new Array<CategoryModel>() ;
  productImage1fileToSend: any;
  productImage2fileToSend: any;
  productImage3fileToSend: any;
  productImage4fileToSend: any;
  productImage5fileToSend: any;
  productDetailImage1: string | ArrayBuffer | null;
  productDetailImage2: string | ArrayBuffer | null;
  productDetailImage3: string | ArrayBuffer | null;
  productDetailImage4: string | ArrayBuffer | null;
  productDetailImage5: string | ArrayBuffer | null;

  constructor(private route: ActivatedRoute,private restApiService: RestApiService,
              private router: Router,private modalService: NgbModal,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.newCommand.quantity_choiced = 1 ;
    this.productDetail.id = this.route.snapshot.paramMap.get('id') ;
    this.restApiService.findById('products', this.productDetail.id).subscribe(data => {
      this.httpResponse = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true ;
          this.productDetail = this.httpResponse ;
          this.mainImage = this.productDetail.image ;
          this.httpResponse = null ;
          this.productDetailImage1 = 'assets/images/mimipedro/' + this.productDetail.image ;
          if (this.productDetail.image2) {
            this.productDetailImage2 = 'assets/images/mimipedro/' + this.productDetail.image2;
          }
          if (this.productDetail.image3) {
            this.productDetailImage3 = 'assets/images/mimipedro/' + this.productDetail.image3;
          }
          if (this.productDetail.image4) {
            this.productDetailImage4 = 'assets/images/mimipedro/' + this.productDetail.image4;
          }
          if (this.productDetail.image5) {
            this.productDetailImage5 = 'assets/images/mimipedro/' + this.productDetail.image5;
          }
          this.getRelatedProduct(this.productDetail.category_name) ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement du Produit, Veuillez Rechargez la page !') ;
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

    this.initAllCategories() ;

  }

  initAllCategories(){
    this.restApiService.findAll('categories').subscribe(data => {
      this.httpResponseAllCategories = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponseAllCategories != null) {
          obtained = true ;
          this.allCategories = this.httpResponseAllCategories;
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
    this.getRelatedProduct(this.productDetail.category_name) ;
  }

  showRelatedOneProduct(productToShow: ProductModel) {
    this.productDetail = productToShow ;
    this.mainImage = this.productDetail.image ;
  }

  getRelatedProduct(categoryName: any) {
    this.restApiService.findByOneAttribut('products', 'ByCategoryName',
      'category_name', categoryName).subscribe(data => {
      this.httpResponse = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true ;
          this.relatedProuctList = this.httpResponse ;
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
    this.newCommand.quantity_choiced = 1 ;
    this.newCommand.total_price = this.productDetail.price ;
    this.newCommand.product_price = this.productDetail.price ;
    this.newCommand.commande_date = '' + new Date() ;
    this.newCommand.product_name = this.productDetail.name ;
  }


  testCommandBeforeChangeMode() {
    let commandValid = true ;
    if (this.newCommand.client_name == null || this.newCommand.client_name == '' ||  this.newCommand.client_name == ' ' ||
      this.newCommand.client_prenom == null || this.newCommand.client_prenom == '' || this.newCommand.client_prenom == ' ')  {
      this.toastrService.error('Veuillez Indiquez votre Nom et votre Prenom !') ;
      commandValid = false ;
    }

    if (this.newCommand.client_tel == null || this.newCommand.client_tel == '' ||  this.newCommand.client_tel == ' ')  {
      this.toastrService.error('Veuillez Indiquez au moins votre Numero de Telephone !') ;
      commandValid = false ;
    }

    if (this.newCommand.quantity_choiced < 1)  {
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
      /*this.restApiService.findByOneAttribut('products', 'ByName',
        'name', this.productDetail.name).subscribe(data => {
        this.httpResponseOneProduct = data ;
        let obtained = false;
        while (!obtained) {
          if (this.httpResponseOneProduct != null) {
            obtained = true ;
            console.log(this.httpResponseOneProduct) ;
            if (this.httpResponseOneProduct.id) {
              if ( this.httpResponseOneProduct.id != this.productDetail.id ) {
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
          this.continueSaveProduct() ;
        } else {
          this.toastrService.error('Erreur lors du Chargement, Veuillez Ressayez !') ;
          console.log(error) ;
        }
      }) ;*/
      this.continueSaveProduct() ;
    }


  }

  continueSaveProduct() {
    let valid = true ;

    if (this.productDetail.price == null || this.productDetail.quantity == null) {
      valid = false ;
      this.toastrService.warning('Veuillez Indiquer le prix et la Quantité !') ;
    }

    if (this.productDetail.category_name == null) {
      valid = false ;
      this.toastrService.warning('Veuillez Indiquez la Categorie !') ;
    }

    if (valid) {
      if (this.productImage1fileToSend) {
        this.productDetail.image = this.productImage1fileToSend.item(0).name;
        this.saveProductImageFile(this.productImage1fileToSend.item(0), 1);
      }
      if (this.productImage2fileToSend) {
        this.productDetail.image2 = this.productImage2fileToSend.item(0).name ;
        this.saveProductImageFile(this.productImage2fileToSend.item(0), 2) ;
      }
      if (this.productImage3fileToSend) {
        this.productDetail.image3 = this.productImage3fileToSend.item(0).name ;
        this.saveProductImageFile(this.productImage3fileToSend.item(0), 3) ;
      }
      if (this.productImage4fileToSend) {
        this.productDetail.image4 = this.productImage4fileToSend.item(0).name ;
        this.saveProductImageFile(this.productImage4fileToSend.item(0), 4) ;
      }
      if (this.productImage5fileToSend) {
        this.productDetail.image5 = this.productImage5fileToSend.item(0).name ;
        this.saveProductImageFile(this.productImage5fileToSend.item(0), 5) ;
      }
      // console.log(this.new_product) ;
        this.restApiService.put('products', this.productDetail.id, this.productDetail)
          .subscribe(data => {
              this.toastrService.success('Success');
              this.closeModal = true;
              this.productDetail = new ProductModel();
            }, error => {
              this.toastrService.error('Erreur lors de la Sauvegarde dans la Base de données, Veuillez Ressayer !');
            }
          );
    } // If Valid

  }

  saveProductImageFile(fileToSave: File, numero: number) {
    this.restApiService.uploadFile(fileToSave).subscribe(data => {
      if (numero == 1) { this.productImage1fileToSend = null } ;
      if (numero == 2) { this.productImage2fileToSend = null } ;
      if (numero == 3) { this.productImage3fileToSend = null } ;
      if (numero == 4) { this.productImage4fileToSend = null } ;
      if (numero == 5) { this.productImage5fileToSend = null } ;
    }, error => {
      this.toastrService.warning("La sauvegarde des images peut prendre un certain temps, veuillez rechargez la page " +
        "si l'image ne vient pas !") ;
      console.log(error) ;
    });
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
      if (imageNumber == 1) {
        this.productDetailImage1 = reader.result ;
        this.productImage1fileToSend = event.target.files ;
      } else if (imageNumber == 2) {
        this.productDetailImage2 = reader.result ;
        this.productImage2fileToSend = event.target.files ;
      } else if (imageNumber == 3) {
        this.productDetailImage3 = reader.result ;
        this.productImage3fileToSend = event.target.files ;
      } else if (imageNumber == 4) {
        this.productDetailImage4 = reader.result ;
        this.productImage4fileToSend = event.target.files ;
      } else if (imageNumber == 5) {
        this.productDetailImage5 = reader.result ;
        this.productImage5fileToSend = event.target.files ;
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
