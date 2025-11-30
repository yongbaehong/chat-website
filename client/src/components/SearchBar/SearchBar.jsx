import { useRef } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'

function SearchBar({ getSearchResults }) {
  const name = useRef(null)
  const city = useRef(null)
  const info = function () {
    const nameText = name.current.value
    const cityText = city.current.value
    getSearchResults(`/api/communities/search/get?name=` + encodeURIComponent(nameText) + '&city=' + encodeURIComponent(cityText))
  }

  return (
    <>
      <InputGroup className="">
        <FormControl placeholder="name" ref={name} />
        <FormControl placeholder="city" ref={city} />
        <InputGroup.Text role="button" onClick={info}><i className="fa fa-search"></i></InputGroup.Text>
      </InputGroup>
    </>
  )
}

export default SearchBar