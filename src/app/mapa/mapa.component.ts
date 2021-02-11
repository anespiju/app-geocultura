import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';  


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  item:any=null;
  estados=[];
  config = {
    suppressScrollX: false
  };
  map: any;

  tiles=[
    {url:"https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",maxZoom:20,attribution:'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',img:"./assets/img/tile1.jpg",orden:3,activo:true},
    {url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",maxZoom:20,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',img:"./assets/img/tile2.jpg",orden:2,activo:false},
    {url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",maxZoom:20,attribution:'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',img:"./assets/img/tile3.jpg",orden:1,activo:false}

  ];
  tilesActivos=[];
  tilesInactivos=[];
  tileLayer:any=null;
  tileLayerGroup:any=null;
  MostrarInactivos:boolean=false;
  constructor() { }

  ngOnInit(): void {

    this.tileLayerGroup = L.layerGroup();
    this.OrdenarTiles();


    setTimeout(() => {
      this.GenerarMapa();
    }, 100);
  }
  CargarShapeDB(){}

  GenerarMapa() {
    this.map = L.map('map').setView([-9.19476685199992, -74.99019817149986], 5);

    let tactivo=this.tiles.find(x=>x.activo==true);
    this.tileLayer=L.tileLayer(tactivo.url, {maxZoom:tactivo.maxZoom,
      attribution: tactivo.attribution
    });
    
    this.tileLayerGroup.addLayer(this.tileLayer).addTo(this.map);
    L.marker([51.5, -0.09]).addTo(this.map)


     this.map.pm.addControls({  
      position: 'bottomright',  
      drawCircle: false,  
    });  



    this.CargarShapeDB();
  }
  FlotanteUbigeo(){
    document.getElementById("ubigeo").classList.toggle("active");
  }
  FlotanteCapa(){
    document.getElementById("capa").classList.toggle("active");
  }
  SeleccionarTile(item:any){
    this.tiles.forEach((ele:any)=>{
      ele.activo=false;
    });

    item.activo=true;
    this.OrdenarTiles();
    this.ProcesarTileSeleccionado();
  }
  OrdenarTiles(){
    this.tilesActivos=[];
    this.tilesInactivos=[];
    this.tilesActivos=this.tiles.filter(x=>x.activo==true);
    this.tilesInactivos=this.tiles.filter(x=>x.activo==false);
  }
  ProcesarTileSeleccionado(){
    this.tileLayerGroup.removeLayer(this.tileLayer);
    let tactivo=this.tiles.find(x=>x.activo==true);

    this.tileLayer=L.tileLayer(tactivo.url, {maxZoom:tactivo.maxZoom,
      attribution: tactivo.attribution
    });
    this.tileLayerGroup.addLayer(this.tileLayer);
  }

  MostrarControles(){

    document.getElementsByClassName("leaflet-pm-edit")[0].classList.toggle("active");
    document.getElementsByClassName("leaflet-pm-draw")[0].classList.toggle("active");
  }
}
