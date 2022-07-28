export interface ImgurData
{
    accessToken: string,
    refreshToken: string,
    expire: string,
    state: string,
    account_id: string,
    account_username: string,
}

export interface ImgurGallery {
    account_id: number,
    comment_count: number,
    datetime: number,
    downs: number,
    favorite: boolean,
    id: string,
    title: string,
    ups: number,
    views: number,
    image: ImgurPicture,
}

export interface ImgurPicture
{
    width: number,
    id: string,
    height: number,
    type: string,
}

export interface ImgurPictureFavorited
{
    id: string,
    favorite: boolean,
}