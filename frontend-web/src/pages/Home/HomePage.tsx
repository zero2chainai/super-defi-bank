import { useUser } from '../../hooks/useUser'

const HomePage = () => {
  const { user } = useUser();

  return (
    <div>Welcome, { user?.name || "Guest" }</div>
  )
}

export default HomePage