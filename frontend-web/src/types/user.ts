export interface User {
    _id: string,
    name: string,
    walletAddress: string,
    bankTokens: string,
    depositedTokens: string
}

export const EmptyUser: Omit<User, "_id"> = {
    name: "",
    walletAddress: "",
    bankTokens: "",
    depositedTokens: ""
}