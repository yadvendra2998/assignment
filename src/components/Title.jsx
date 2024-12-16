import React from 'react'

const Title = ({title}) => {
  return (
    <div className='title'>
      <h1>Demo editor by {title || "<Name>"}</h1>
    </div>
  )
}

export default Title