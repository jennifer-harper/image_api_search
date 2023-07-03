import { ChangeEvent, FormEvent, useState, useEffect} from "react";
import * as Base64 from "base64-arraybuffer";
import { getUploads, createUpload } from '../apis/uploadImgs';
import {Home} from './Home'
import {Notes } from "./Notes";
import * as Img from '../../models/uploads'
import { useAuth0 } from '@auth0/auth0-react' 
import { IfAuthenticated, IfNotAuthenticated } from './Authenticated'

type InputChange = ChangeEvent<HTMLInputElement>
type AreaChange = ChangeEvent<HTMLTextAreaElement>;


function UploadToDb() {

  const { getAccessTokenSilently, isLoading } = useAuth0()
  const [file, setFile] = useState(null as null | File)
  const [graphic,  setGraphic] = useState([] as Img.UploadUser[])

  const [dataForm, setDataForm] = useState({
    category:'',
    notes:'',
    image:''
  } as Img.UploadImgData)

  const fetchUploads = async () => {
    try {
      const data = await getUploads()
      setGraphic(data.reverse())
    } catch (err) {
      alert((err as Error).message)
    }
  }
  
  useEffect(() => {
    if (!isLoading) {
      fetchUploads()
    }
  }, [isLoading])
  
  const refreshList = () => {fetchUploads()}

  const handleUpdate = (e: InputChange | AreaChange) => {
    setDataForm({...dataForm, [e.target.name]: e.target.value}) 
  } 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!file || !file.type.includes('image')) return alert('please add a picture')

    const fileAsBytes = await file.arrayBuffer() 

    const newData = {
      category: dataForm.category,
      notes: dataForm.notes,
      image: Base64.encode(fileAsBytes),
    }

    const token = await getAccessTokenSilently() 

    createUpload(newData, token)
    .then(data => {
      setGraphic([data, ...graphic])
      setDataForm({category: '', notes: '', image: ''}) 

    // reset file input field value
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement 
      fileInput.value = ''
      setFile(null)
    })    
    .catch(err => console.error(err))
  }

  const updateFile = (e: InputChange) => {
    const fileArr = e.target.files as FileList
    const selectedFile = fileArr[0]
    setFile(selectedFile)
  }  

  const tempUrl = file ? URL.createObjectURL(file) : 'https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }
  
  return (
    <>
    <IfAuthenticated>
    <section className="flex-wrapper">
      <div className="form-wrapper">
        <h1>Upload image and notes</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='image'>Select Image</label>
            <input id='image' name="image" type='file' onChange={updateFile} />
          </div>
          <div>
            <label htmlFor='category'>Category</label>
            <input type="text" id="category" name="category" value={dataForm.category} onChange={handleUpdate}/>
          </div>
          <div>
            <label htmlFor='notes'>Notes</label>
            <textarea rows={5} name="notes" id="notes" value={dataForm.notes} onChange={handleUpdate}/>
          </div>
          <button>Add</button>
          <div className='temp_profile'>
            <img src={tempUrl} alt={file ? 'chosen picture' : 'profile icon'} />
          </div>          
        </form>
      </div>
      <Notes graphic={graphic} refreshList={refreshList}/>
    </section>
    </IfAuthenticated>

    <IfNotAuthenticated>
      <Home />
    </IfNotAuthenticated>
    </>
  )
}



export default UploadToDb
