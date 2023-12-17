import React, { useEffect, useState } from 'react'
import './App.css'
import CopyImg from './copy-img.png'
import axios from 'axios'


const App = () => {

  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [links, setLinks] = useState([])

  const generateUrl = async () => {
    const response = await axios.post('/api/link', {
      url,
      slug
    })

    setShortUrl(response?.data?.data?.shortUrl)
  }

  const copyUrl = async () => {
    if(!shortUrl)
    {
      alert("ShortUrl is required!")
      return
    }
    navigator.clipboard.writeText(shortUrl)
    alert("The ShortUrl is copied!")
  }

  const loadLinks = async () => {
    const response = await axios.get('/api/links')
    setLinks(response?.data?.data)
  }

  useEffect(() => {
    loadLinks();
  }, [])

  
  return (
    <div className='link-generation-container'>
      <h1 className='heading'><span className='heading-color'>R</span>apid <span className='heading-color'>L</span>inks🔗</h1>
      <div className='link-generation'>
        <div>
          <h2><span className='heading-color'>G</span>enerate <span className='heading-color'>L</span> ink</h2>
          <div className='generate-links'>
            <input type='text' placeholder='Enter Your Link' value={url} onChange={(e) => {
              setUrl(e.target.value)
            }} className='user-input' />

            <input type='text' placeholder='Enter short Link' value={slug} onChange={(e) => {
              setSlug(e.target.value)
            }} className='user-input' />

            <div className='shortUrl'>
              <input type='text' placeholder='Short Link' value={shortUrl}
                className='user-input' disabled />
              <img src={CopyImg} className='copy-img' onClick={copyUrl} />
            </div>


            <button type='button' className='generate-btn' onClick={generateUrl}> Generate Link</button>
          </div>
        </div>

        <div>
          <h2><span className='heading-color'>A</span>ll <span className='heading-color'>L</span> ink</h2>
          <div className='all-links'>
            {
              links.map((links , index) => {
               const {url , slug , clicks} = links
               return(
                <div className='all-links-container'>
                  <p className='links'><span className='link-color'>Original Link</span> : {url}</p>
                  <p className='links'> <span className='link-color'>Short Link </span>: {process.env.REACT_APP_BASE_URL}/{slug}</p> 
                  <p className='links'> <span className='link-color'>Visits </span>: {clicks}</p>
                </div>
               )
              })
              
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
