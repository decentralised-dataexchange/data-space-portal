const apiUrl = 'https://643c05604477945573656f73.mockapi.io/api/v1';

const headers = () => {
  const header = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
  return header;
};

export const doApiGet = (endPoints: string) => {
  const uri = `${apiUrl}/${endPoints}` as string;
  let fetchData = fetch(uri, Object.assign({}, {
    headers: headers(),
  }),
).then((res) => res.json())
.then((data) => {
  return data;
}).catch((err) => {
  console.log(err);
})
  return fetchData;
};

export const doApiPost = (endPoints, reqBody) => {
  const uri = `${apiUrl}/${endPoints}` as string;
  let fetchData = fetch(uri, Object.assign({}, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(reqBody)
  }),
).then((res) => res.json())
.then((data) => data)
.catch((err) => {
  console.log(err);
})
  return fetchData;
};

export const doApiPut = (endPoints, reqBody) => {
  const uri = `${apiUrl}/${endPoints}` as string;
  let fetchData = fetch(uri, Object.assign({}, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(reqBody)
  }),
).then((res) => res.json())
.then((data) => data)
.catch((err) => {
  console.log(err);
})
  return fetchData;
}

export const doApiDelete = (endPoints) => {
  const uri = `${apiUrl}/${endPoints}` as string;
  let fetchData = fetch(uri, Object.assign({}, {
    method: 'DELETE',
    headers: headers()
  }),
).then((res) => res.json())
.then((data) => data)
.catch((err) => {
  console.log(err);
})
  return fetchData;
}