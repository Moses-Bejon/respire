export function getUniqueStringWithPrefix(prefix:string,existingStrings:string[]) {
    let uniqueString = prefix;
    let i = 0;

    while (existingStrings.includes(uniqueString)){
        i++;

        uniqueString = `${prefix} (${i})`;
    }

    return uniqueString;
}