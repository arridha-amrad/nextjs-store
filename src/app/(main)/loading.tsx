import { Loader } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-10">
      <Loader className="animate-spin" />
    </div>
  )
}
