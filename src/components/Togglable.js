import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  const [loginVisible, setLoginVisible] = useState(false)

  const toggleLoginVisible = () => {
    setLoginVisible(!loginVisible)
  }

  useImperativeHandle(ref, () => {
    return { toggleLoginVisible }
  })

  if (loginVisible) {
    return (
      <div>
        {props.children}
        <button onClick={toggleLoginVisible}>Cancel</button>
      </div>
    )
  } else {
    return <button onClick={toggleLoginVisible}>{props.cta}</button>
  }
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  cta: PropTypes.string.isRequired
}

export default Togglable
