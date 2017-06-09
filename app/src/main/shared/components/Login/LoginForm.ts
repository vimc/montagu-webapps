import { AuthStoreBaseInterface } from "../../stores/AuthStoreBase";
import AltReform, { Reform } from "alt-reform";
import { alt } from "../../alt";
import fetcher from "../../sources/Fetcher";
import FormActions from "../../../FormActions";
import * as Validation from "../../../Validation";

const { submitFailed } = FormActions("Login");

export interface LoginFields {
    email: string;
    password: string;
}

export function loginForm(authStore: AuthStoreBaseInterface<any>): Reform<LoginFields> {
    return AltReform("Login", alt, {
        fields: {
            email: Validation.required("Email address"),
            password: Validation.required("Password"),
            errors: () => {
            },
        },
        onSubmit: (state: LoginFields) => {
            const data = "grant_type=client_credentials";
            return fetcher.fetch("/authenticate/", {
                method: "POST",
                headers: {
                    'Authorization': 'Basic ' + btoa(`${state.email}:${state.password}`),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: data
            }, false);
        },
        onSubmitSuccess: (response: any) => {
            response.json().then((json: any) => {
                if (json.error) {
                    alt.dispatch(submitFailed("Your username or password is incorrect"));
                } else {
                    authStore.logIn(json.access_token);
                }
            });
        },
        onSubmitFail: (response: any) => {
            console.log("Error logging in: " + response);
            alt.dispatch(submitFailed("An error occurred logging in"));
        }
    });
}