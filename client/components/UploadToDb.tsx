import { ChangeEvent, FormEvent, useState, useEffect} from "react";
import * as Base64 from "base64-arraybuffer";
import { getUploads, createUpload } from '../apis/uploadImgs';
import { Profiles } from "./Profile";
import * as Img from '../../models/character';

type InputChange = ChangeEvent<HTMLInputElement>
type AreaChange = ChangeEvent<HTMLTextAreaElement>;


function UploadToDb() {
  const [category, setCategory] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState(null as null | File)
  const [users, setUsers] = useState([] as Img.UploadImg[])



  useEffect(() => {
    getUploads()
    .then((data) => {
      setUsers(data);
    })
    .catch((err) => alert(err.message));
  }, []);

  const refreshList = () => {
    getUploads()
    .then((data) => {
      setUsers(data);
    })
    .catch((err) => alert(err.message));
  }


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
      if (!category) return alert('please add a category')
      if (!file || !file.type.includes('image')) return alert('please add a picture')

    const fileAsBytes = await file.arrayBuffer()
    
    const newUser = {
      category,
      notes,
      image: Base64.encode(fileAsBytes)
    }

    createUpload(newUser)
    .then(data => setUsers([...users, data]))
    .catch(err => console.error(err))

    setNotes('')
    setCategory('')
    setFile(null)
  }

  const updateFile = (e: InputChange) => {
    const fileArr = e.target.files as FileList
    setFile(fileArr[0])
  }

  const tempUrl = file ? URL.createObjectURL(file) : 'https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'

  return (
    <section>
      <h2>Upload to db</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor='category'>Category</label>
            <input id='category' type='text' onChange={(e: InputChange) => setCategory(e.target.value)} />
          </div>

          <div>
            <label htmlFor='image'>Select Image</label>
            <input id='image' type='file' onChange={updateFile} />
          </div>
        </div>

         <div>
        <label htmlFor='notes'>Notes</label>
            <textarea rows={5}  id="notes" onChange={(e: AreaChange) => setNotes(e.target.value)}/>
        </div>  

        <div className='temp_profile'>
          <img src={tempUrl} alt={file ? 'chosen picture' : 'profile icon'} />
        </div>

        <button>Add</button>
      </form>

      {/* Render Profiles component and pass users data as a prop */}
      <Profiles users={users} refreshList={refreshList}/>
    </section>
  )
}



export default UploadToDb
