import {inject, Injectable} from '@angular/core';
import {Auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword,} from '@angular/fire/auth';
import {UserModel, UserRole} from "../models/user.model";
import {doc, Firestore, getDoc, setDoc} from "@angular/fire/firestore";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {EngineService} from "./engine.service";



@Injectable({
    providedIn: 'root',
})
export class UserService {
    public currentUser: any = null;
    public user$: BehaviorSubject<UserModel| null > = new BehaviorSubject<UserModel | null>(null);
    private auth: Auth = inject(Auth);
    private firestore: Firestore = inject(Firestore);
    private engineService: EngineService = inject(EngineService);
    private readonly router: Router = inject(Router);

    constructor() {
        const auth = getAuth();

        onAuthStateChanged(auth, async (user : any ) => {

            if (user) {
                if ( this.isAdmin( user )) {
                    let route : string = '/main/collection/' + this.engineService.settings.collections[0].name ;


                    await this.router.navigate([ route ]);
                }
            } else {
                await this.router.navigate(['/']);
            }
        });
    }

    async setCurrentUser(uid: string) {
        this.currentUser = await this.getUserById( uid) ;

        if ( this.user$ )
            this.user$.next( this.currentUser );
    }


    isAdmin( user : any) {

        let ca : any =  JSON.parse( user.reloadUserInfo.customAttributes );
        if ( user && ca.role === this.engineService.settings.adminRoleName ) {
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

    async signInByEmail(email: string, password: string) {

        try {
            const userCredential : any = await signInWithEmailAndPassword(this.auth, email, password);

            if (userCredential) {

                let user : UserModel | false = await this.getUserById( userCredential );

                if ( user && this.isAdmin( user ) )
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
