
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';


@NgModule({
  declarations: [
    // Add new modules/components here:
    AppComponent,
    HeaderComponent,

    ErrorComponent
  ],
  imports: [
    AppRoutingModule,
    AngularMaterialModule,
    PostsModule,
    AuthModule
  ],
  // Add an additional HTTP interceptor:
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  //inform angular that this component is going to get used even though angular cant figure it out automatically
  entryComponents: [ErrorComponent]

})
export class AppModule { }
