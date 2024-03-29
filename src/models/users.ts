export default interface User {
    id: number;
    username: string;
    email: string;
    dob: string;
    gender: string;
    height: number;
    weight: number;
    rating: number;
    budget: number;
    bio: string;
    profile_pic: string | undefined;
    profile_visibility: boolean;
}
