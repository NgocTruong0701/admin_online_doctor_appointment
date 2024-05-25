export interface IUser {
    id: string;
    avatarUrl: string;
    name: string;
    company: string;
    isVerified: boolean;
    status: string | undefined;
    role: string | undefined;
}

export interface ISpecialization {
    id: string;
    name: string;
    icon: string;
}

export interface IPatient {
    id: string;
    name?: string;
    avatar?: string;
    email?: string;
    address?: string;
    gender?: Gender;
    dateOfBirth?: string;
}

export enum Gender {
    Male = 1,
    FeMale = 2
}

export interface IAppointment {
    id: number;
    date: Date;
    description: string;
    duration: number;
    status: string;
}

export interface IDoctor {
    id: number;
    name?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    avatar?: string;
    hospital?: string;
    specializationName?: string;
    yearsExperience?: number;
    schedule?: string;
}

export interface IPost {
    id: string;
    cover: string;
    title: string;
    view: number;
    comment: number;
    share: number;
    favorite: number;
    createdAt: Date;
    author: {
        name: string;
        avatarUrl: string;
    };
}

export interface IAccount {
    displayName: string;
    email: string;
    photoURL: string;
    role: string | undefined;
}

export interface IProduct {
    id: string;
    cover: string;
    name: string;
    price: number;
    priceSale: number | null;
    colors: string[];
    status: string | undefined;
}

export interface NavItemConfig {
    title: string;
    path: string;
    icon: JSX.Element;
    info?: string;
    children?;
}

export interface News {
    image;
    title;
    description;
    postedAt;
}

export interface Site {
    icon;
    value;
    name;
}

export interface HeaderLabel {
    id: string;
    label: string;
    alignRight: boolean;
}
