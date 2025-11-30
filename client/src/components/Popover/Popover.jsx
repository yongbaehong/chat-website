import React from 'react'
import { Link } from 'react-router-dom'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import './Popover.css'

export const popoverMin = (
  <Popover id="popover-basic" className="rounded-1" >
    <em>Minimum Reached</em>
  </Popover>
)

export const popoverMax = (
  <Popover id="popover-basic" className="rounded-1" >
    <em>Maximum Reached</em>
  </Popover>
)

export const cog = (
  <Popover id="popover-basic" className="rounded-1 shadow" >
    <p className="mb-2"><Link className="text-c-primary text-decoration-none" to="/user/SETTINGS_PROFILE">Profile</Link></p>
    <p className="mb-2"><Link className="text-c-primary text-decoration-none" onClick={() => fetch('/logout')} to="/">Logout</Link></p>
  </Popover>
)

export const IconButtonOverLay = ({ icon, popover, customClass, children, show, trigger }) => (
  <OverlayTrigger trigger={trigger} show={show} placement="auto" overlay={popover} delay={{ show: 150 }}>
    {children}
  </OverlayTrigger>
)