export const emailRules = [
    (v: string) => !!v || 'E-mail é obrigatório',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
    (v: string) => (v && v.length <= 50) || 'Máximo de 60 caracteres'
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

export const imageRules = [
    (files: File[]) => !files || files.every(file =>
        /^[a-zA-Z0-9_-]+-[1-9]\d*\.(jpe?g|png)$/i.test(file.name) &&
        allowedImageTypes.includes(file.type)
    ) || 'Padrão: produto-1.jpg ou produto-2.png (números ≥ 1)'
]

export const sanitizeDescription = (description: string): string => {
    if (!description) return ''

    return description
        .replace(/<(?!\/?(p|br|b|strong)(\s[^>]*)?>)[^>]+>/gi, '')
        .replace(/<(p|b|strong)\s+[^>]*>/gi, '<$1>')
}