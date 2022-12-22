import {Injectable} from "@angular/core";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {Post} from "./post.model";
import {map, tap} from "rxjs";
import * as events from "events";

@Injectable({providedIn: "root"})

export class PostService {
    constructor(private http: HttpClient) { }
    createAndStorePost(title: string, content:string){
        const postData: Post = {title: title, content: content};
        this.http
                .post<{name: string}>(
            'https://angular-http-course-guide-default-rtdb.firebaseio.com/posts.json',
            postData,
                    {
                        observe: 'response'
                    }
        )
            .subscribe(responseData =>{
            console.log(responseData);
        })
    }

    fetchPost() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        return this.http
            .get<{[key: string]: Post}>
            ('https://angular-http-course-guide-default-rtdb.firebaseio.com/posts.json',
            {
                headers: new HttpHeaders({ 'Custom-Header': 'Hello'}),
                params: searchParams,
                responseType: 'json'
            })
            .pipe(
                map(responseData => {
                    const postsArray: Post[] = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postsArray.push({...responseData[key], id: key});
                        }
                    }
                    return postsArray;
                })
            );
    }

    deletePost() {
        return this.http.delete('https://angular-http-course-guide-default-rtdb.firebaseio.com/posts.json',
            {
                observe: 'events',
                responseType: 'json'
            }
        ).pipe(tap(event => {
            console.log(event);
                if (event.type === HttpEventType.Sent) {
                    //...
                }
                    if (event.type === HttpEventType.Response) {
                console.log(event.body);
            }
        })
        );
    }

}
