/**
 * API'den gelen (GET) BlogDto'ya karşılık gelir.
 * Kategori adını da içerir.
 */
export interface Blog {
  id: number;
  title: string;
  imgUrl?: string | null;
  categoryId: number;
  categoryName?: string | null;
}

/**
 * API'ye gönderilecek (POST) CreateBlogDto'ya karşılık gelir.
 */
export interface CreateBlogDto {
  title: string;
  imgUrl?: string | null;
  categoryId: number;
}

/**
 * API'ye gönderilecek (PUT) UpdateBlogDto'ya karşılık gelir.
 */
export interface UpdateBlogDto {
  id: number;
  title: string;
  imgUrl?: string | null;
  categoryId: number;
}