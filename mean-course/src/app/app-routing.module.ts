import { NgModule } from "@angular/core";
import { NgModel } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router"
import { AuthGuard } from "./auth/auth.guard";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";


// Routes is an array of javascript objects
const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  // /: makes the path dynamic, the word after ":" defines what variable name will be assigned to the uri value
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
]

@NgModule({
  // Import routes to angular
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]


})
export class AppRoutingModule {}
