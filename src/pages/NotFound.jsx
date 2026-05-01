import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return <EmptyState message="页面不存在" actionText="返回首页" actionTo="/" />
}
