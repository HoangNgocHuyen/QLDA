export class AuthModel {
    id_token: string;

    setAuth(auth: any) {
        this.id_token = auth.id_token;
    }
}
