export interface IUser {
    id: number;
    name: string;
    email: string;
    phone: string;
}

class User implements IUser {

    public id: number;
    public name: string;
    public email: string;
    public phone: string;

    constructor(nameOrUser: string | IUser, email?: string, id?: number, phone?: string) {
        if (typeof nameOrUser === 'string') {
            this.name = nameOrUser;
            this.email = email || '';
            this.id = id || -1;
            this.phone = phone || '';
        } else {
            this.name = nameOrUser.name;
            this.email = nameOrUser.email;
            this.id = nameOrUser.id;
            this.phone = nameOrUser.phone
        }
    }
}

export default User;
