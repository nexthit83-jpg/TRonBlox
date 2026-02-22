import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useRouter } from 'next/router'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [robloxLink, setRobloxLink] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file!')
      return
    }

    // 1️⃣ Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('shirts')
      .upload(fileName, file)

    if (storageError) {
      setMessage(storageError.message)
      return
    }

    // 2️⃣ Get public URL
 const { data } = supabase
  .storage
  .from('shirts')
  .getPublicUrl(fileName)

const publicUrl = data.publicUrl
    // 3️⃣ Insert shirt into database
    const user = supabase.auth.getUser()
    const { error: dbError } = await supabase
      .from('shirts')
      .insert([{
        title,
        description,
        roblox_link: robloxLink,
        image_url: publicUrl,
        likes: 0,
        dislikes: 0,
        views: 0,
        creator_id: (await user).data.user?.id
      }])

    if (dbError) {
      setMessage(dbError.message)
      return
    }

    setMessage('Upload successful!')
    router.push('/') // redirect to homepage
  }

  return (
    <div>
      <h1>Upload Shirt</h1>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="Roblox Link" value={robloxLink} onChange={e => setRobloxLink(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  )
}