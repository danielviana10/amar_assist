export const emailRules = [
    (v: string) => !!v || 'E-mail é obrigatório',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
    (v: string) => (v && v.length <= 100) || 'Máximo de 100 caracteres'
]

export const passwordRules = [
    (v: string) => !!v || 'Senha é obrigatória',
    (v: string) => (v && v.length >= 4) || 'Senha deve ter pelo menos 4 caracteres',
    (v: string) => (v && v.length <= 50) || 'Máximo de 40 caracteres'
]

export const titleRules = [
    (v: string) => !!v || 'Título é obrigatório',
    (v: string) => (v && v.length <= 40) || 'Máximo de 40 caracteres'
]

export const descriptionRules = [
    (v: string) => !!v || 'Descrição é obrigatória',
    (v: string) => (v && v.length <= 200) || 'Máximo de 200 caracteres'
]

export const priceRules = (cost: number) => [
    (v: number) => !!v || 'Preço é obrigatório',
    (v: number) => v >= 0 || 'Preço não pode ser negativo',
    (v: number) => v >= cost * 1.1 || 'O preço deve ser no mínimo 10% maior que o custo'
]

export const costRules = (price: number) => [
    (v: number) => !!v || 'Custo é obrigatório',
    (v: number) => v >= 0 || 'Custo não pode ser negativo',
    (v: number) => v <= price / 1.1 || 'O custo deve ser no máximo 90% do preço'
];

export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg']
export const imageNamePattern = /^[a-zA-Z0-9_-]+-(\d+)\.(jpe?g|png)$/i;

export const validateImageFormat = (file: File): boolean => {
    return imageNamePattern.test(file.name) && allowedImageTypes.includes(file.type);
};

export const getImageOrder = (fileName: string): number => {
    const match = fileName.match(imageNamePattern);
    return match ? parseInt(match[1]) : 0;
};

export const validateUniqueOrders = (files: File[]): boolean => {
    const orders = files.map(file => getImageOrder(file.name));
    const uniqueOrders = new Set(orders);
    return uniqueOrders.size === orders.length;
};

export const imageRules = [
    (files: File[]) => !files || files.every(validateImageFormat) || 'Formato inválido (ex: produto-1.jpg)',
    (files: File[]) => !files || validateUniqueOrders(files) || 'Números de ordem não podem repetir'
];

export const sanitizeDescription = (description: string): string => {
    if (!description) return ''

    return description
        .replace(/<(?!\/?(p|br|b|strong)(\s[^>]*)?>)[^>]+>/gi, '')
        .replace(/<(p|b|strong)\s+[^>]*>/gi, '<$1>')
}