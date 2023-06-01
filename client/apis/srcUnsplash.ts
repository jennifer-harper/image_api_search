import request from 'superagent'

//******************Unsplash API/
export function getUnsplash() {
  return request
    .get(`https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_KEY}&orientation=landscape`)

    .then((res) => {
      console.log(res.body)
      return res.body
    })
    .catch((err) => {
      console.log('Err message: ' + err)
    })
}

export async function SearchSaveUnsplash(query: string){
  const unsplashKey = process.env.UNSPLASH_KEY
  try {
    const res1 = await request
    .get(`https://api.unsplash.com/search/photos?client_id=48xo5zkXZ6Sh8EYO_etxPja_x05J4Zyhitdp7r7VH38&per_page=12&orientation=landscape&query=${query}`)

    const totalPages = res1.body.total_pages
    const randomPageNumber = Math.floor(Math.random() * totalPages) + 1

    const res2 = await request.get(`https://api.unsplash.com/search/photos?client_id=48xo5zkXZ6Sh8EYO_etxPja_x05J4Zyhitdp7r7VH38&page=${randomPageNumber}&per_page=12&orientation=landscape&query=${query}`)
    console.log(res2.body)
    return res2.body

  } catch (err) {
    console.log('Err message: ' + err)
  }
}

