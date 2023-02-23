import React, { useState } from 'react'
import axios from 'axios'

export function Upload() {
  const [videoFile, setVideoFile] = useState(null)

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('video', videoFile)

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="video">Select a video file:</label>
        <input type="file" id="video" onChange={handleFileChange} />
      </div>
      <button type="submit">Upload</button>
    </form>
  )
}
