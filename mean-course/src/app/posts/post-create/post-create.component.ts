import { NgFor } from "@angular/common";
import { Component, OnInit} from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ParamMap } from "@angular/router";
import { Post } from "../post.model";

import { PostsService } from "../posts.service";


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle ='';
  enteredContent = '';
 // Used in the html:
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId: string;
  // Create form and store it in a property. Top level object, groups all the controls of the form.
  form: FormGroup;


  constructor(public postService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(){
    // Describing the form
    this.form = new FormGroup({
      // Form control is another constructor that is imported.
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      })



    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
          this.form.setValue({
            'title' : this.post.title,
            'content' : this.post.content
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
    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
  onSavePost() {
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create'){
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else{
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content)
    }
    this.form.reset();
  }
}
