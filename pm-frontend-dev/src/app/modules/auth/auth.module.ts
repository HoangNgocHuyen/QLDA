import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {AuthComponent} from './auth.component';
import {TranslationModule} from '../i18n/translation.module';
import {LayoutModule} from "../../pages/layout.module";

@NgModule({
    declarations: [
        LoginComponent,
        AuthComponent,
    ],
    imports: [
        CommonModule,
        TranslationModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        LayoutModule,
    ]
})
export class AuthModule {
}
