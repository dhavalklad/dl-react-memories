export interface IPost {
    _id?: string,
    title: string,
    message: string,
    image: string,
    creator?: number,
    created_by?: {
        firstName: string,
        lastName: string
    },
    created_at?: string,
    tags?: string[]
}