import { NgFor } from "@angular/common";
import { Component, OnDestroy, OnInit} from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";

import { PostsService } from "../posts.service";

import { mimeType } from "./mime-type.validator"


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle ='';
  enteredContent = '';
 // Used in the html:
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription
  // Create form and store it in a property. Top level object, groups all the controls of the form.
  form: FormGroup;
  imagePreview: string;


  constructor(public postService: PostsService, public route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false
      }
    )
    // Describing the form
    this.form = new FormGroup({
      // Form control is another constructor that is imported.
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image' : new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }
      )




    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            'title' : this.post.title,
            'content' : this.post.content,
            'image' : this.post.imagePath
          });
        });
      }else{
        this.mode = 'create';
        this.postId = null;
      }

    });
  }



  newPost = 'NO CONTENT';



  onAddPost(form: NgForm) {
    if(form.invalid){
      return;
    }
    this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    form.resetForm();
  }

  onImagePicked(event: Event){
    // Type conversion to tell typescript that event.target is a HTML element
    const file = (event.target as HTMLInputElement).files[0];
    // Targets a single control in the form
    this.form.patchValue({image: file});
    // Validate the input
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      // Try this with "reader.result as string" if it presents an error
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    console.log(file);
    console.log(this.form);


  }


  onSavePost() {
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create'){
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else{
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        )
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }
}
