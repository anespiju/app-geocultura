import { Component, OnInit } from '@angular/core';
import 'leaflet';
declare let L;
var wkx = require("wkx");
var Buffear = require('buffer').Buffer;
import '@geoman-io/leaflet-geoman-free';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalVideoComponent } from '../modal-video/modal-video.component';
import { ServiceGeneralService } from '../shared/services/service-general.service';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  item: any = null;
  estados = [];
  config = {
    suppressScrollX: false,
    
  };
  map: any;

  tiles = [
    { url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", maxZoom: 20, attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors', img: "./assets/img/tile1.jpg", orden: 3, activo: true },
    { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", maxZoom: 20, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', img: "./assets/img/tile2.jpg", orden: 2, activo: false },
    { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", maxZoom: 20, attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community', img: "./assets/img/tile3.jpg", orden: 1, activo: false }

  ];
  tilesActivos = [];
  tilesInactivos = [];
  tileLayer: any = null;
  tileLayerGroup: any = null;
  MostrarInactivos: boolean = false;

  lstRegion = [];
  lstProvincia = [];
  lstProvinciaData = [];
  lstDistrito = [];
  lstDistritoData = [];

  ubigeoSeleccionado = '';
  dataShape: any;
  Lgeojson: any;

  BsModalRef: BsModalRef;

  constructor(private BsModalService: BsModalService, private mapaGeneralSvc: ServiceGeneralService) { }

  ngOnInit(): void {

    this.tileLayerGroup = L.layerGroup();
    this.OrdenarTiles();

    setTimeout(() => {
      this.GenerarMapa();
      this.VerModalVideo();
    }, 100);

    this.cargarCombosUbigeo();
  }

  CargarShapeDB(ubigeo: string) {
    if (ubigeo.length == 0) {
      // this.ubigeoSeleccionado = '';
    } else {
      this.ubigeoSeleccionado = ubigeo;
    }

    let paramEnvio = { ubigeo: this.ubigeoSeleccionado };

    this.mapaGeneralSvc.listarGeometriaUbigeo(JSON.stringify(paramEnvio)).subscribe((data: any) => {
      if (data.estado > 0) {
        this.dataShape = data.mensaje;
        this.addGeojson();
      }
    });
  }

  cargarCombosUbigeo() {
    this.mapaGeneralSvc.getUbigeo().subscribe(
      (data: any) => {
        if (data.estado > 0) {
          this.lstRegion = data.mensaje.departamento;
          this.lstProvinciaData = data.mensaje.provincia;
          this.lstDistritoData = data.mensaje.distrito;
        }
      }
    );
  }

  GenerarMapa() {
    this.map = L.map('map').setView([-9.19476685199992, -74.99019817149986], 5);

    let tactivo = this.tiles.find(x => x.activo == true);
    this.tileLayer = L.tileLayer(tactivo.url, {
      maxZoom: tactivo.maxZoom,
      attribution: tactivo.attribution
    });

    this.tileLayerGroup.addLayer(this.tileLayer).addTo(this.map);
    L.marker([51.5, -0.09]).addTo(this.map)


    this.map.pm.addControls({
      position: 'bottomright',
      drawCircle: false,
    });

    this.CargarShapeDB('');
  }

  addGeojson() {
    this.removeGeojson();
    var twkbBuffer = [];
    var geojsonFeaturePolygon = [];
    let geometry;

    let data = this.dataShape.geometria;

    twkbBuffer = new Buffear((data).substring(2, data.length), 'hex');
    geometry = wkx.Geometry.parse(twkbBuffer);
    let geo = geometry.toGeoJSON();
    geojsonFeaturePolygon.push({
      type: "Feature",
      properties: {

      },
      geometry: geo
    });


    this.Lgeojson = L.geoJSON(geojsonFeaturePolygon, {
      onEachFeature: function (feature, layer) {
        layer.myTag = 'myGeoJSON';
        layer.on('click', function (e) {
          if (this.ubigeoSeleccionado.length < 6) {
            this.CargarShapeDB(this.ubigeoSeleccionado);
          }
        });
        layer.on('mouseover', function (e) {

        });
      }
    });
    this.Lgeojson.addTo(this.map);
    this.map.fitBounds(this.Lgeojson.getBounds());
  }

  removeGeojson() {
    let map = this.map
    map.eachLayer(function (layer) {
      if (layer.hasOwnProperty('myTag')) {
        if (layer.myTag && layer.myTag === 'myGeoJSON') {
          map.removeLayer(layer);
        }
      }
    });
  }

  onEachFeature(feature, layer) {
  }

  FlotanteUbigeo() {
    document.getElementById("ubigeo").classList.toggle("active");
  }

  FlotanteCapa() {
    document.getElementById("capa").classList.toggle("active");
  }

  SeleccionarTile(item: any) {
    this.tiles.forEach((ele: any) => {
      ele.activo = false;
    });

    item.activo = true;
    this.OrdenarTiles();
    this.ProcesarTileSeleccionado();
  }
  OrdenarTiles() {
    this.tilesActivos = [];
    this.tilesInactivos = [];
    this.tilesActivos = this.tiles.filter(x => x.activo == true);
    this.tilesInactivos = this.tiles.filter(x => x.activo == false);
  }

  ProcesarTileSeleccionado() {
    this.tileLayerGroup.removeLayer(this.tileLayer);
    let tactivo = this.tiles.find(x => x.activo == true);

    this.tileLayer = L.tileLayer(tactivo.url, {
      maxZoom: tactivo.maxZoom,
      attribution: tactivo.attribution
    });
    this.tileLayerGroup.addLayer(this.tileLayer);
  }

  MostrarControles() {
    document.getElementsByClassName("leaflet-pm-edit")[0].classList.toggle("active");
    document.getElementsByClassName("leaflet-pm-draw")[0].classList.toggle("active");
  }

  VerModalVideo() {
    let config = {
      class: "modal-video modal-lg",
      ignoreBackdropClick: true
    }
    this.BsModalRef = this.BsModalService.show(ModalVideoComponent, config)
  }

  regionSeleccionado(codRegion: any) {
    if (codRegion != undefined) {
      let item = codRegion.cod_departamento;
      this.lstProvincia = [];
      this.lstDistrito = [];
      this.lstProvincia = this.lstProvinciaData.filter(c => c.cod_departamento == item);
      this.CargarShapeDB(item);

    } else {
      this.lstProvincia = [];
      this.lstDistrito = [];
    }
  }

  provinciaSeleccionada(codProvincia: any) {
    if (codProvincia != undefined) {
      let item = codProvincia.cod_provincia;
      this.lstDistrito = [];
      this.lstDistrito = this.lstDistritoData.filter(c => c.cod_provincia == item);
      this.CargarShapeDB(item);
    } else {
      this.lstDistrito = [];
    }
  }

  distritoSeleccionado(codDistrito: any) {
    if (codDistrito != undefined) {
      let item = codDistrito.cod_distrito;
      this.CargarShapeDB(item);
    }
  }
}
