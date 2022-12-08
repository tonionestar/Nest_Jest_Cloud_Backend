export interface User {
    id?: string;
    username?: string;
    email?: string;
    salt?: string;
    session?: string;
    hash?: string;
    forename?: string;
    surname?: string;
}
