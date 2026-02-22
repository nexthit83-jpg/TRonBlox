// pages/index.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Link from 'next/link'

interface Shirt {
  id: string
  title: string
  description: string
  image_url: string
  roblox_link: string
  likes: number
  views: number
  creator_id: string
}

export default function HomePage() {
  const [shirts, setShirts] = useState<Shirt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShirts = async () => {
      const { data, error } = await supabase
        .from('shirts')
        .select('*')
        .order('likes', { ascending: false }) // highest likes first
      if (error) console.log('Error fetching shirts:', error)
      else setShirts(data || [])
      setLoading(false)
    }

    fetchShirts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">TronBlox Shirts</h1>
        <nav>
          <Link href="/" className="mr-4 hover:text-blue-400">Home</Link>
          <Link href="/upload" className="mr-4 hover:text-blue-400">Upload</Link>
          <Link href="/login" className="hover:text-blue-400">Login</Link>
        </nav>
      </header>

      {loading ? (
        <p>Loading shirts...</p>
      ) : shirts.length === 0 ? (
        <p>No shirts uploaded yet!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shirts.map((shirt) => (
            <div
              key={shirt.id}
              className="bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <Link href={`/shirt/${shirt.id}`}>
                <img
                  src={shirt.image_url}
                  alt={shirt.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-1">{shirt.title}</h2>
                <p className="text-gray-300 text-sm mb-2">
                  {shirt.description.length > 50
                    ? shirt.description.slice(0, 50) + '...'
                    : shirt.description}
                </p>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>❤️ {shirt.likes}</span>
                  <span>👁️ {shirt.views}</span>
                  {shirt.roblox_link && (
                    <a
                      href={shirt.roblox_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Roblox
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}