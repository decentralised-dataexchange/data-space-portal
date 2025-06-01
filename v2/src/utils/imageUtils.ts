export const imageBlobToBase64 = (imageBlob: any) => {
    const baseName = 'data:image/jpeg;charset=utf-8;base64';
    const base64 = btoa(
        new Uint8Array(imageBlob).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
        )
    )
    return `${baseName},${base64}`
}