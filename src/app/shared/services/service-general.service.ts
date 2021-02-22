import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceGeneralService {

  constructor(private http: HttpClient) { }

  host = environment.host;

  getUbigeo() {
    const href = `${this.host}api/DataGeneral/listarUbigeo`;
    return this.http.get(href);
  }

  listarGeometriaUbigeo(ipInput: string) {
    const href = `${this.host}api/DataGeneral/listarUbigeoGeometria`;
    return this.http.get(`${href}?ipInput=${ipInput}`);
  }
}
