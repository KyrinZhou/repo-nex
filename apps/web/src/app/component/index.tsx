import React from 'react'
import Image from 'next/image'

const CusImg = () => {
  return (
    <div className="size-16">
      <Image src={'/images/home/bg.png'} alt="11" layout="fill" objectFit="cover" />
    </div>
  )
}

export default CusImg
