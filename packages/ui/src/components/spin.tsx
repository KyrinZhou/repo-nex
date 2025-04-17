import { PropsWithChildren } from 'react'

interface SpinProps {
  spinning: boolean
}

function Spin({ spinning, children }: SpinProps & PropsWithChildren) {
  return <div>{!spinning ? children : 'loading...'}</div>
}

export default Spin
