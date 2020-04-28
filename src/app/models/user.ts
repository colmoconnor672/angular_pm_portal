import { Role } from './role';

export class User {
    
    constructor(
        public email: string, 
        public id: string,
        public name: string,
        public orgId: number,
        public authorities: string,
        public roles: Role[],
        public password: string,
        private _token?: string,
        private _tokenExpirationDate?: Date
    ){}

    setPassword(pword:string){
        this.password = pword;
    }

    get token(){
        if(!this._tokenExpirationDate 
            || new Date() > this._tokenExpirationDate){
            return null;
        }
        return this._token;
    }
}
