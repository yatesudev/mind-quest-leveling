import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routes';
import { provideHttpClient } from '@angular/common/http'; // Import HttpClientModule instead of using provideHttpClient
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from "./footer/footer.component";
import { CharacterCreationComponent } from './character-creation/character-creation.component';
import { InventoryComponent } from './inventory/inventory.component';

import { ItemService } from './item.service';
import { AuthService } from './auth.service';
import { CharacterService } from './character.service';

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        DashboardComponent,
        FooterComponent,
        CharacterCreationComponent,
        InventoryComponent
    ],
    providers: [provideHttpClient(), ItemService, AuthService, CharacterService],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
    ]
})
export class AppModule {}
