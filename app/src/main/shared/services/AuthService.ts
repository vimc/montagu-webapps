import { LocalService } from "./LocalService";

export class AuthService extends LocalService {
    logIn(email: string, password: string) {
        this.setOptions({
            Authorization: 'Basic ' + btoa(`${email}:${password}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        return this.postNoProcess("/authenticate/", "grant_type=client_credentials")
    }

    authToShiny() {
        this.setOptions({credentials: "include"});
        return this.get("/set-shiny-cookie/");
    }

    unauthFromShiny() {
        this.setOptions({credentials: "include"});
        return this.get("/clear-shiny-cookie/");
    }
}