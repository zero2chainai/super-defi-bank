export interface User {
    _id: string,
    name: string,
    walletAddress: string,
    balance: string
}

export const EmptyUser: Omit<User, "_id"> = {
    name: "",
    walletAddress: "",
    balance: ""
}