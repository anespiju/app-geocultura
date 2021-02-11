import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapaComponent } from './mapa/mapa.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PerfectScrollbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
