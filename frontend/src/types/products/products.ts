export interface Product {
    id: string;
    title: string;
    img?: string;
    price: number;
    cost: number;
    description: string;
    active: boolean;
    images?: ProductImage[];
    firstImage?: ProductImage;
    isLoading?: boolean;
}

export interface ProductCreate {
    title: string;
    description: string;
    price: number;
    cost: number;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface ProductImageWithFile extends ProductImage {
    file?: File;
    deleted?: boolean;
}

export interface ProductImage {
    id: string;
    product_id: string;
    path: string;
    url: string;
    order: number;
    deleted?: boolean;
    file?: File;
    isDeleting?: boolean;
    isLoading?: boolean;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface ProductResponse {
    message: string;
    data: Product;
}