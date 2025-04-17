export interface AuthUser {
  avatar: string // 头像
  user_email: string // 邮箱
  user_id: string // 用户id
  user_name: string // 用户名
}

export interface AuthUserData {
  user?: AuthUser
}
