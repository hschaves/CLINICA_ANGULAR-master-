import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AuthGuardModule } from '@angular/fire/auth-guard';


import { AppComponent } from './app.component'; //prueba commit
import { AppRoutingModule } from './app-routing.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';

import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Importamos los componentes que usamos aquí
import { PacientesComponent } from './pacientes/pacientes.component';
import { SpecialtiesComponent } from './specialties/specialties.component';
import { DoctoresComponent } from './doctores/doctores.component';
import { CitasComponent } from './citas/citas.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MisCitasComponent } from './mis-citas/mis-citas.component';
import { PacientesService } from './services/pacientes.service';
import { CitasService } from './services/citas.service';
import { UsuariosService } from './services/usuarios.service';
import { AuthService } from './services/auth.service';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [AppComponent, PacientesComponent, SpecialtiesComponent, DoctoresComponent, CitasComponent, LandingPageComponent, MisCitasComponent],
  entryComponents: [],
  imports: [
  BrowserModule,
  IonicModule.forRoot(),
  AppRoutingModule, provideFirebaseApp(() => initializeApp(environment.firebase)), // también
  provideAuth(() => getAuth()), // Servicios que necesitamos para conectar base de datos-proyecto
  provideFirestore(() => getFirestore()),
  AuthGuardModule,
  FormsModule,
  ReactiveFormsModule
  ],
  providers: [
    DatePipe,
    CitasService,
    UsuariosService,
    PacientesService,
    AuthService, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],

})
export class AppModule {}
