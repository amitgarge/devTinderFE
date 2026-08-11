export type Gender = "male" | "female" | "others";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    age?: number;
    gender?: Gender;
    about: string;
    skills: string[];
    photoURL: string
}

export type UserCardData = Pick<User, "firstName" | "lastName" | "age" | "gender" | "about" | "skills" | "photoURL"> 