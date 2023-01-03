import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";


// Importing an operator to remap array
import { map } from "rxjs/operators";
import { identifierName } from "@angular/compiler";
import { Form } from "@angular/forms";

// import env variables
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();


  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // Dynamically add values into a normal string:
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, posts: any, maxPosts: number }>(BACKEND_URL  + queryParams)
      // ADD LOGIC
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          }
        }), maxPosts: postData.maxPosts
      };


      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string){
    return this.http.get<{_id: string; title: string; content: string, imagePath: string, creator: string}>(
      BACKEND_URL  + id)
  }


  addPost(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{message: string, post: Post}>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"])
      })
  }
  updatePost(id: string, title: string, content: string, image: File | string){
    let postData: Post | FormData
    // const post: Post = { id: id, title: title, content: content, imagePath: null};
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id)
      postData.append("title", title)
      postData.append("content", content)
      postData.append("image", image, title)
    }else{
      postData = {
        id: id,
        title : title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    this.http.put(BACKEND_URL  + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"])
      })
  }
  deletePost(postId: string){
    return this.http.delete(BACKEND_URL + postId);
  }
}
