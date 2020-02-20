// Converts objects into query strings with the format ?key=value&key2=value;
// Undefined values or empty strings will be ignored.
const writeQueries = obj => {
    return `?${Object.entries(obj)
        .filter(([key, value]) => value !== undefined && value !== '')
        .map(([key, value])=>`${key}=${value}`)
        .join('&')}`;
}

export default writeQueries;