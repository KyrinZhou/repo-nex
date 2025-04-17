import { loadMicroApp, type MicroApp } from "qiankun"
import { useCallback, useEffect, useRef, useState } from "react"
import type { SubApp } from "../common/sub-apps"
import type { AuthUserData } from "../types/global"

// 定义该 Hook 返回的数据结构类型，包含加载状态、微应用实例引用以及容器元素引用
interface QiankunReturn {
  loading: boolean
  appInstance: React.RefObject<MicroApp | null>
  containerRef: React.RefObject<HTMLDivElement | null>
}

const useQiankun = (app: SubApp): QiankunReturn => {
  const [loading, setLoading] = useState(true)
  const appInstance = useRef<MicroApp | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const loadFn = useCallback(async (): Promise<void> => {
    // 这里是一个非常关键的判断逻辑，在 Next.js 环境下，需要这样判断 window（next会预先服务端执行一次）
    // 千万不能简单地写成 typeof window === 'undefined' 然后直接 return，
    // 否则会出现问题（详细可参考：https://github.com/umijs/qiankun/issues/2037）
    if (typeof window !== "undefined" && containerRef.current) {
      try {
        // 调用 qiankun 的 loadMicroApp 方法来加载微应用，传入相应的配置参数，包括微应用的基本信息、承载容器以及要传递给微应用的用户数据等
        const microApp = loadMicroApp<AuthUserData>({
          ...app,
          container: containerRef.current,
          props: {
            user: {
              user_id: "123456",
              user_name: "zifer",
              user_email: "super-test@test.com",
              avatar: "",
            },
          },
        })
        appInstance.current = microApp
        // 等待微应用挂载完成，确保在挂载成功后再进行后续操作
        await microApp.mountPromise
      } catch (error) {
        console.error("Failed to load micro app:", error)
      } finally {
        // 无论加载成功与否，最终都将加载状态设置为 false，表示加载过程结束
        setLoading(false)
      }
    }
  }, [app, containerRef])

  useEffect(() => {
    void loadFn()

    return (): void => {
      if (appInstance.current) {
        // 卸载对应的微应用，不用特别判断微应用是否加载完成，否则会卸载失败
        // 如果判断了微应用加载完成再去卸载，会发现当路由切换再回来时，微应用加载失败，一片空白
        void appInstance.current.unmount().catch(() => {
          console.error(`Failed to unmount ${app.name} micro app`)
        })
      }
    }
  }, [loadFn, app])

  return {
    loading,
    appInstance,
    containerRef,
  }
}

export default useQiankun
