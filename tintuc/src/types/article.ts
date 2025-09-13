// export type Article = {
//   id: string;
//   slug: string;
//   title: string;
//   excerpt?: string;
//   content?: string;
//   author?: string;
//   image?: string;
//   publishedAt?: string | null;
// };


// ✅ Kiểu dùng chung cho Article
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  publishedAt?: string | null; // cho phép null
}

// Input khi tạo/sửa
// export type PostInput = Omit<Post, "id">;

// ✅ Phân trang chuẩn
export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type PostInput = {
  title: string;
  slug: string;                     // <— thêm
  excerpt?: string;
  content: string;
  image?: string | null;
  author?: string | null;
  publishedAt?: string | null;
};


