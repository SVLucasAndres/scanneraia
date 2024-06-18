import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonService } from '../pokemon.service';
import { Storage } from '@ionic/storage-angular';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import {CapacitorBarcodeScanner, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerTypeHintALLOption} from '@capacitor/barcode-scanner'
import { Database, object } from '@angular/fire/database';
import { orderByChild, query, ref } from 'firebase/database';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ingreso:any;
  pokemonName:any;
  pokemonID:any;
  pokemonType:any;
  pokemonSprite:any;
  color:any;
  ruta:any;
  isSupported = false;
  barcode:any;
  pedidos:any[]=[];
  constructor(private database:Database,private router:NavController,private alert:AlertController, private loadingCtrl:LoadingController,private api: PokemonService, private alertController: AlertController) {}
  async ngOnInit(){
    
  }
  async scan(): Promise<void> {
    const val = CapacitorBarcodeScanner.scanBarcode({
      hint:CapacitorBarcodeScannerTypeHintALLOption.ALL,
      cameraDirection:CapacitorBarcodeScannerCameraDirection.BACK,

    });
    val.then(async result=>{
      this.pokemonName = result.ScanResult;
      const consulta = await ref(this.database,'pedidos')
      await object(consulta).subscribe(attributes =>{
        this.pedidos = [];
        
       
          attributes.snapshot.forEach(element=>{
            if(element.key == result.ScanResult){
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
              
            }else if(state == "Listo"){
              color = 'success';
              
            }else if(state == "Cancelado"){
              color = 'danger';
              
            }else if(state == "Completado"){
              color = 'dark';
            
          }else{
            console.log("no");
          }
          this.pedidos.push({state,price,prod,ci,cus,color,method,qr,fecha,dir,tipoci,tel,email,trans,retiro});
          }
        })
        })
      })
    
  }

  async presentAlert(message:any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  async ir(){
    this.router.navigateRoot('blue');
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Conectando...',
      duration: 10000,
      spinner: 'dots'
    });

    loading.present();
  }

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