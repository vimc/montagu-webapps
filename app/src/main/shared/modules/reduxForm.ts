export const validations = {
    required: (value: string) => (value
        ? undefined
        : ' is required'),
    email: (value: string) => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? ' is invalid'
        : undefined),
    minLength: (min: number) => (value: string) => (value && value.length < min
        ? ` must be at least ${min} characters`
        : undefined)

}

