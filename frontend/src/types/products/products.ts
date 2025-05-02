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
}

export interface ProductImage {
    id: string;
    product_id: string;
    path: string;
    url: string;
    order: number;
    deleted: boolean;
    file?: File;
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