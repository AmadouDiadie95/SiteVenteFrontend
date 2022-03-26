import { Component, OnInit } from '@angular/core';
import {RestApiService} from "../services/rest-api.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {CommandeModel} from "../models/commande.model";
import {error} from "@angular/compiler/src/util";

@Component({
  selector: 'app-command-list',
  templateUrl: './command-list.component.html',
  styleUrls: ['./command-list.component.scss']
})
export class CommandListComponent implements OnInit {
  table: any;
  httpResponse: any;
  allCommandes: Array<CommandeModel> = new Array<CommandeModel>() ;
  commandOnModal: CommandeModel = new CommandeModel() ;
  closeModal: boolean = false ;

  constructor(private restApiService: RestApiService,
              private router: Router,private modalService: NgbModal,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.initAllCommandes() ;

  }

  initAllCommandes(){
    this.restApiService.findAll('commandes').subscribe(data => {
      this.httpResponse = data ;
      let obtained = false;
      while (!obtained) {
        if (this.httpResponse != null) {
          obtained = true ;
          this.allCommandes = this.httpResponse ;
        }
      } // Fin While
    }, error => {
      this.toastrService.error('Erreur lors du chargement des Categories, Veuillez Rechargez la page !') ;
      console.log(error) ;
    }) ;
  }

  sortTable(n: any) {
    var  table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    this.table = document.getElementById("myTable");
    table = this.table ;
    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table.rows ;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  onCommandModalOpen(command: CommandeModel) {
    this.closeModal = false ;
    this.commandOnModal = command ;
  }

  DoneCommand() {
    let respone = confirm('Confirmez la commande Effectuée (Action Irreversible) ?') ;
    if (respone) {
      this.commandOnModal.done = true ;
      this.commandOnModal.commande_done_date = ''+ new Date() ;
      this.restApiService.put('commandes', this.commandOnModal.id, this.commandOnModal).subscribe(data => {
        this.toastrService.success('Success') ;
      }, error => {
        this.toastrService.error('Erreur lors de la Sauvegarde, Veuillez Ressayer !') ;
        console.log(error) ;
      })
    }
  }

  DeleteCommand() {
    let respone = confirm('Confirmez la Suppression (Action Irreversible) ?') ;
    if (respone) {
      this.restApiService.deleteById('commandes', this.commandOnModal.id).subscribe(data => {
        this.toastrService.success('Success') ;
        this.closeModal = true ;
        this.initAllCommandes() ;
      }, error => {
        this.toastrService.error('Erreur lors de la Sauvegarde, Veuillez Ressayer !') ;
        console.log(error) ;
      })
    }
  }
}
