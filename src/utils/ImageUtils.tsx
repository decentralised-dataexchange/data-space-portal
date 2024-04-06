export const imageBlobToBase64 = (imageBlob: any) => {
    return btoa(
      new Uint8Array(imageBlob).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )
  }