function NavBottom_Icon({ click, text, children, defaultClass }) {
  return (
    <>
      <div className={`d-flex flex-column align-items-center text-light ${defaultClass}`} role="button" onClick={click}>
        {children}
        <span className="">{text}</span>
      </div>
    </>
  )
}

export default NavBottom_Icon