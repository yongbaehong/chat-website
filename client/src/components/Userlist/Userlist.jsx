import { useContext, createContext, useEffect, useState, useLayoutEffect } from 'react'
import { connect } from 'react-redux'
import { Image, Badge } from 'react-bootstrap'
import { updateCommune } from '../../pages/Commune/actions/action'
import './Userlist.css'

function Userlist({ user, commune, updateCommune }) {
  const [show, setShow] = useState(false)
  const socket = useContext(createContext(user.socket))

  useEffect(() => {
    socket.on('RECEIVE_USERLIST', (data) => {
      updateCommune({ type: 'UPDATE_USERLIST', userlist: data })
    })

    return () => {
      socket.off('RECEIVE_USERLIST')
    }
  }, [])

  useLayoutEffect(() => {
    window.addEventListener("resize", function () {
      if (window.innerWidth < 767) {
        setShow(true)
      }
      if (window.innerWidth > 767) {
        setShow(false)
      }
    })
  })

  return (
    <>
      <div id="Userlist-button" role="button" onClick={() => setShow(prev => !prev)}
        className={`d-flex align-items-center bg-dark bg-gradient px-2 py-1 rounded-pill ${show ? 'Userlist-button-show' : 'Userlist-button-hide'}`}
      >
        <i className="fa fa-users text-light" role="button"></i>
        {!!commune.userlist.length ?
          <Badge className="Userlist-length" pill bg="light">{commune.userlist.length}</Badge>
          : null
        }
      </div>

      <div className={`Userlist2-container Userlist-show ${show ? 'show' : 'hide'}`}>
        <ul className="list-unstyled px-1 mt-md-2 mt-5">
          <p className="text-center font-noteworthy-light">Current Users</p>
          {!!commune.userlist.length ?
            commune.userlist
              .map((ind, idx) => {
                return (<li key={idx.toString()} >
                  <Image
                    src={`/user-photos/${ind.id}/${ind.avatar}`}
                    height="50"
                    width="50"
                    className="img-clip-circle"
                    alt="avatar"
                  /><span className={`${ind.username === user.username ? "fw-bold text-dark px-2 py-1 rounded " : "fw-bold text-dark px-2 py-1 rounded "}`}>{ind.username}</span>
                </li>)
              })
            : null
          }
        </ul>
      </div>
    </>
  )
}

const mapStateToProps = STATE => {
  return {
    ...STATE
  }
}

export default connect(mapStateToProps, { updateCommune })(Userlist);