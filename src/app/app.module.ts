
// Angular 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Components
import { BasicSliderComponent } from './components/chronologies/basic-slider/basic-slider.component';
import { ChronologyRealTimeComponent } from './components/chronologies/chronology-realtime/chronology-realtime.component';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SingleProductComponent } from './components/single-product/single-product.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { HeaderComponent } from './components/header/header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

// Services, Routing, Interceptors
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { UsersService } from './services/users.service';
import { DarkModeService } from './services/dark-mode.service';

// Material
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ProductListComponent,
    SingleProductComponent,
    ProductFormComponent,
    HeaderComponent,
    PageNotFoundComponent,
    ChronologyRealTimeComponent,
    BasicSliderComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSliderModule,
    MatAutocompleteModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UsersService,
    DarkModeService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
