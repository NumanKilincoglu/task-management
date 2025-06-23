//filtre degistikce surekli calismamasi icin delay fonksiyonu
export function debounce(fn, delay = 300) {
    let timeout

    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}