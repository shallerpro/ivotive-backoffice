import {inject, Injectable} from '@angular/core';
import {
    addDoc,
    collection,
    collectionData,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    query,
    setDoc,
    where
} from "@angular/fire/firestore";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PostService {

    private firestore: Firestore = inject(Firestore);



    constructor() {
    }

    /*


    async getPostById(id: string) {
        let postRef: any = doc(this.firestore, this.settings.POST_COLLECTION, id);

        if (postRef) {
            let snapshot = await getDoc(postRef);
            let post: PostModel = new PostModel(snapshot.data(), snapshot.id);

            post.catIds = [];

            if (post.raw.catRefs)
                for (let cat of post.raw.catRefs)
                    post.catIds.push(cat.id);


            return post;
        }

        return null;
    }

    async getPostsByHost(host: HostModel) {

        const postRef = list(this.firestore, this.settings.POST_COLLECTION);
        const postQuery = query(postRef, where('hostId', '==', host.id));

        const docs = await getDocs(postQuery);
        const posts: PostModel[] = [];

        docs.docs.map(doc => {
            posts.push(new PostModel(doc.data(), doc.id));
        });

        return posts;


    }

    async addPost(host: HostModel, post: PostModel) {
        const postRef = list(this.firestore, this.settings.POST_COLLECTION);
        let ret: any = await addDoc(postRef, post.toJSON(['id']));
        return ret;
    }


    async editPost(post: PostModel) {
        try {
            const postRef: any = doc(this.firestore, this.settings.POST_COLLECTION, post.id);
            let ret: any = await setDoc(postRef, post.toJSON(['id', 'wpId', 'organizationRef', 'hostRef']), {merge: true});
            return ret;
        } catch (e) {
            console.error("editPost", e);
        }
    }

    async deletePost(postId: string) {
        try {
            const postRef: any = doc(this.firestore, this.settings.POST_COLLECTION, postId);
            await deleteDoc(postRef);

        } catch (e) {
            console.error("deletePost", e);
        }
    }
*/

}
