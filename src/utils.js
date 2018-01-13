export function errorWrap(handler) {
    return function (...args) {
        handler(...args).catch(args[args.length - 1])
    }
}

export function assertOrThrow(statement, errorType, ...errorArgs) {
    if (!statement) {
        throw new errorType(...errorArgs)
    }
}

export function pick(object, properties) {
    const _object = {}

    if (!object || (!properties || !properties.split)) {
        return object
    }

    properties = properties.split(' ')

    for (const [k, v] of Object.entries(object)) {
        if (properties.includes(k)) {
            _object[k] = v
        }
    }

    return _object
}
