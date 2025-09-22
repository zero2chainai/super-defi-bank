export interface User {
    _id: string,
    name: string,
    walletAddress: string,
    bankTokens: Number,
    depositedTokens: Number
}

export const EmptyUser: Omit<User, "_id"> = {
    name: "",
    walletAddress: "",
    bankTokens: 0,
    depositedTokens: 0
}