import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';  
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'; 
import { get, ref, remove, set, update } from 'firebase/database';
import { Database, object } from '@angular/fire/database';
@Component({
  selector: 'app-blue',
  templateUrl: './blue.page.html',
  styleUrls: ['./blue.page.scss'],
})
export class BluePage implements OnInit {
  mensaje:any;
  constructor(private database:Database, private router:NavController,private alert:AlertController, private loadingCtrl:LoadingController) { }
  fact:any;
  pedidos:any[] = [];
  chips:any[] = [];
  async ngOnInit() {
    await object(ref(this.database,'pedidos')).subscribe(attributes =>{
      this.pedidos = [];
      attributes.snapshot.forEach(element=>{
          const data = element.val() as pedido;
          const state = data.estado;
          const price = data.precio;
          const prod = data.reserva.substring(0,data.reserva.length);
          const ci = data.factura.id;
          const retiro = data.retiro;
          const cus = data.factura.cliente;
          const dir = data.factura.direccion;
          const tipoci = data.factura.tipoId;
          const method = data.factura.metodo;
          const tel = data.factura.celular;
          const email = data.factura.mail;
          const trans = data.factura.compTransferencia;
          const qr = element.key;
          const fecha = data.fecha;
          console.log(trans);
          let color;
          
          if(state == "Por reservar"){
            color = 'warning';
            this.fact = true;
          }else if(state == "Listo"){
            color = 'success';
            this.fact = false;
          }else if(state == "Cancelado"){
            color = 'danger';
            this.fact = true;
          }else if(state == "Completado"){
            color = 'dark';
            this.fact = false;
          
        }else{
          console.log("no");
        }
        this.pedidos.push({state,price,prod,ci,cus,color,method,qr,fecha,dir,tipoci,tel,email,trans,retiro});
      })
    })
  }
  async ir(){
    this.router.navigateRoot('home');
  }
  async presentAlert(meserror:any) {
    const alert = await this.alert.create({
      header: meserror,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async changeChip(chip:any,route:any){
    await update(ref(this.database,'pedidos/'+route),{estado:chip});
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Conectando...',
      duration: 10000,
      spinner: 'dots'
    });

    loading.present();
  }
  bleuser:any;
}
interface pedido {
  factura:{
    celular:string,
    cliente:string,
    direccion:string,
    id:string,
    mail:string,
    metodo:string,
    tipoId:string,
    compTransferencia:string,
  }
  estado:string,//
  precio:string,//
  reserva:string,//
  retiro:string,//
  fecha:string,//
}