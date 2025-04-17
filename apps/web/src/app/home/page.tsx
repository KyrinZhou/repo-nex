'use client'

import React from 'react'
import { Spin } from '@repo/ui'
import useQiankun from '../../../hooks/use-qiankun'
import { merchantApp } from '../../../common/sub-apps'

const MerchantApp: React.FC = () => {
  const { loading, containerRef } = useQiankun(merchantApp)
  return (
    <div className="w-screen ">
      <Spin spinning={loading}>
        <div ref={containerRef} />
      </Spin>
    </div>
  )
}

export default MerchantApp
