"use client"

import { Bubble } from "@ant-design/x"

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24  bg-cover bg-center bg-no-repeat">
      <div className="App">
        <Bubble content="Hello world!" />
      </div>
    </main>
  )
}
