export class CommandeModel {
  id: any ;
  commandeDate?: any ;
  clientName?: string ;
  clientPrenom?: string ;
  clientAdresse?: string | null ;
  clientEmail?: string | null ;
  clientTel?: string | null ;
  productName?: string ;
  productPrice: any ;
  quantityChoiced: any | null ;
  totalPrice: any ;
  colorChoiced?: string | null ;
  sizeChoiced?: string | null ;
  particularity?: string | null ;
  done?: boolean ;
  commandeDoneDate?: any  ;
  _links: any ;
}

