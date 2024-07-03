export const useToast = () => {

    const items = useState('items', () => [])

    const addToast =  (toast) => {
            items.value.unshift({
                key : Symbol(),
                ...toast
            })
            
    }

    const removeToast = (index) => {
        items.value.splice(index, 1)
    }

    return { items, addToast, removeToast }
    
}