// Check status of Fetch API
export const responseParser = response => response.json()
export const status = async (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  }
  const parseResponse = await responseParser(response)
  return Promise.reject(new Error(`${response.status}: ${parseResponse.message}`))
}
