// import { getCookie, sessionId } from './utils';
/* eslint-disable import/default */
const baseUrl = 'http://localhost:8000'
const TIMEOUT = 300000;
const getAccessToken = () => localStorage.getItem('react_token');

const headers = (id?) => {
  const  accessToken = getAccessToken();
  // const  reactCookie = getCookie('myfarm_user');
  // const accessToken = JSON.parse(reactCookie).accessToken;
  const header = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  return id ? { ...header, 'session-id' : id } : header;
};

/**
* @description function to handle the time out error
* @param  {Promise} promise - promise
* @param  {number} timeout - millseconds
* @param  {string} error - errorcode
* @return
*/
function timeoutPromise(promise, timeout, error) {
  return new Promise((resolve, reject) => {
    const clearTimeOut = setTimeout(() => {
      const err = { status: error };
      reject(err);
    }, timeout);
    promise.then((data) => {
      clearTimeout(clearTimeOut);
      resolve(data);
    }, (data) => {
      clearTimeout(clearTimeOut);
      reject(data);
    });
  });
}

export const statusCheck = (data) => {
  const { status } = data;
  return data.json().then((res) => {
    const resData = { status, ...res };
    if (data.status >= 200 && data.status < 300) {
      return Promise.resolve(resData);
    }
    return Promise.reject(resData);
  }).catch((error) => {
    let resData = { status };
    if (error && error.errors) {
      resData = { status, ...error };
    }
    return error;
  });
};

export const statusCheckBlob = (data) => {
  if (data.status >= 200 && data.status < 300) {
    return Promise.resolve(data.blob());
  }
  return Promise.reject(data);
};

/** @description calls a native fetch method and returns a promise Object
 * @param {string} url
 * @param {string} urlPrefix
 * @returns {Promise}
 */
export const fetchURL = (url, id?) => timeoutPromise(fetch(`${baseUrl}${url}`,
  Object.assign({}, {
    headers: headers(id),
  }),
), TIMEOUT, 504);

/** @description Sending a GET request to JSON API.
 * doGet method resolves or rejects the promise that is obtained
 * from the fetchURl method
 * @param {string} url
 * @returns {object}
 */
export const doApiGet = (url, id?) => {
  const fetchData = fetchURL(`${baseUrl}${url}`, id).then(statusCheck);
  return fetchData;
};

/** @description Sending a GET request to Blob.
 * @param {string} url
 * @returns {Promise}
 */
export const doApiGetBlob = (url, sessionId, header?) => {
    let _header = headers({
        'Content-Disposition': 'inline',
        responseType: 'arraybuffer',
    });
    if ( header != undefined ) _header = {..._header,...header};
    return timeoutPromise(fetch(`${baseUrl}${url}`,
        Object.assign({}, {
            method: 'get',
            headers: _header,
        }),
    ), TIMEOUT, 504)
        .then(statusCheckBlob);
};

/** @description Sending a POST request.
 * @param {string} url
 * @param {object} body
 * @returns {Promise}
 */
export const doApiPost = (url: string, body) => {
  return timeoutPromise(fetch(`${baseUrl}${url}`,
    Object.assign({}, {
      method: 'post',
      headers: headers(),
      body: JSON.stringify(body),
    }),
  ), TIMEOUT, 504)
    .then(statusCheck);
};

/** @description Sending a POST request to Blob.
 * @param {string} url
 * @param {object} body
 * @returns {Promise}
 */
export const doApiPostBlob = (url, body) => {
  const reqBody = { ...body };
  return timeoutPromise(fetch(`${baseUrl}${url}`,
    Object.assign({}, {
      method: 'post',
      headers: headers({
        'Content-Disposition': 'inline',
        responseType: 'arraybuffer',
      }),
      body: JSON.stringify(reqBody),
    }),
  ), TIMEOUT, 504)
    .then(statusCheckBlob);
};

/** @description Sending a PUT request.
 * @param {string} url
 * @param {object} body
 * @returns {Promise}
 */
export const doApiPut = (url, body, sessionId) => {
  const reqBody = { ...body };
  

  return timeoutPromise(fetch(`${baseUrl}${url}`,
    Object.assign({}, {
      method: 'put',
      headers: headers(sessionId),
      credentials: 'include' as RequestCredentials,
      body: JSON.stringify(reqBody),
    }),
  ), TIMEOUT, 504)
    .then(statusCheck);
};

/** @description Sending a DELETE request.
 * @param {string} url
 * @param {object} body
 * @returns {Promise}
 */
export const doApiDelete = (url, body?, id?) => timeoutPromise(fetch(`${baseUrl}${url}`,

  Object.assign({}, {
    method: 'delete',
    headers: headers(id),
    credentials: 'include' as RequestCredentials,
    body: JSON.stringify(body ? body : ''),
  }),
), TIMEOUT, 504)
  .then(statusCheck);