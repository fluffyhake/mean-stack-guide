import { NgModule } from "@angular/core";
import { NgModel } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router"
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";


// Routes is an array of javascript objects
const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'create', component: PostCreateComponent},
  // /: makes the path dynamic, the word after ":" defines what variable name will be assigned to the uri value
  { path: 'edit/:postId', component: PostCreateComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent }
]

@NgModule({
  // Import routes to angular
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]


})
export class AppRoutingModule {}
