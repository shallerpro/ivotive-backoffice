import {inject, Injectable} from '@angular/core';
import {Auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword,} from '@angular/fire/auth';
import {UserModel, UserRole} from "../models/user.model";
import {doc, Firestore, getDoc, setDoc} from "@angular/fire/firestore";
import {HostService} from "./host.service";
import {HostModel} from "../models/host.model";
import {DocumentReference} from "@angular/fire/compat/firestore";
import {SettingsService} from "./settings.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {PostModel} from "../models/post.model";


@Injectable({
    providedIn: 'root',
})
export class UserService {
    public currentUser: any = null;
    public currentHost: BehaviorSubject<HostModel | null> = new BehaviorSubject<HostModel | null>(null);
    public user$: BehaviorSubject<UserModel| null > = new BehaviorSubject<UserModel | null>(null);

    public currentHostRef: DocumentReference | null = null;
    private auth: Auth = inject(Auth);
    private firestore: Firestore = inject(Firestore);
    private host: HostService = inject(HostService);
    private settings: SettingsService = inject(SettingsService);
    private readonly router: Router = inject(Router);

    constructor() {
        const auth = getAuth();
        console.log("initializing... user.services");
        onAuthStateChanged(auth, async (user) => {

            console.log ("UserService onAuthStateChanged" , user )

            if (user) {
                await this.setCurrentUser(user.uid);

                if ( await this.isAdmin()) {
                    await this.router.navigate(['/admin']);
                } else
                await this.router.navigate(['/main']);
            } else {
                await this.router.navigate(['/']);
            }
        });
    }

    isConnected(): boolean {
        return (this.currentUser.value != null);

    }

    public obsCurrentHost() {
        return this.currentHost;
    }

    public getCurrentHost() {
        return this.currentHost.value;
    }

    public obsCurrentUser() {
        return this.currentUser;
    }

    public getCurrentUser() {

        if ( this.currentUser && this.currentUser.value ) {
            return this.currentUser.value as UserModel;
        } else return null ;
    }


    async changeCurrentHost(host: HostModel) {
        this.currentHost.next(host);
        this.currentHostRef =
            this.settings.getDocRef(this.settings.HOST_COLLECTION, host.id);

    }


    async isAdmin() {

        if ( this.currentUser && this.currentUser.role === UserRole.admin ) {
            return true
        } else return false



    }

    async getUserById ( uid : string ) {
        const userRef: any = doc(this.firestore, 'users', uid);
        const userDoc: any = await getDoc(userRef);
        if (userDoc) {
            return new UserModel(userDoc.data(), userDoc.id);
        } else return false ;

    }

    async edit( user : UserModel ) {
        try {
            const ref: any = doc(this.firestore, this.settings.USER_COLLECTION, user.id);
            let ret: any = await setDoc(ref, user.toJSON(['id']), {merge: true});
            return ret;
        } catch (e) {
            console.error("edit", e);
        }
    }

    async setCurrentUser(uid: string) {

        this.currentUser = await this.getUserById( uid) ;

        if ( this.user$ )
            this.user$.next( this.currentUser );

        let hosts: any = await this.host.getHostsByUser( this.currentUser );

        if (hosts.length > 0 )
            await this.changeCurrentHost(hosts[0]);

    }

    async signInByEmail(email: string, password: string) {

        try {
            console.log("signInByEmail", email, password , this.auth );

            const userCredential : any = await signInWithEmailAndPassword(this.auth, email, password);

            console.log("signInByEmail userCredential", userCredential );

            if (userCredential) {
                return true;
            }
        } catch (e) {
            console.error("Error while signing in", e);
        }
        return false;
    }


    async logout() {
        this.user$.next(null);
        await this.auth.signOut();

    }


}
