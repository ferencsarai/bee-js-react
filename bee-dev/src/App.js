import {useState, useEffect} from 'react';
import {Bee, BeeDebug}  from '@ethersphere/bee-js';

function App() {
  const [image, setImage] = useState({ preview: '', data: '' })
  const [uploadFile, setUploadFile] = useState('');
  const [references, setReferences] = useState(() => {
    return JSON.parse(localStorage.getItem("references")) || [];
  });
  useEffect(() => {
    localStorage.setItem('references', JSON.stringify(references));
  }, [references]);

  // Bee
  const bee = new Bee("http://localhost:1633");           // upload, download
  const beeDebug = new BeeDebug("http://localhost:1635"); // stamps,  accounting

  const read = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const stamps = await beeDebug.getAllPostageBatch();
    const batchId = stamps[0].batchID;
    const data = await read(uploadFile)
    const dataArray = new Uint8Array(data)
    const uploadRes = await bee.uploadFile(batchId, dataArray, uploadFile.name, {contentType: uploadFile.type})
    const newReferences = references.slice();
    newReferences.push(uploadRes.reference);
    setReferences(newReferences);
    //const downloadedFile = await bee.downloadFile(uploadRes.reference)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    setUploadFile(file)
    setImage({ preview: URL.createObjectURL(file), data: file })
  };

  const refList = references.map((ref) => (
    <li>
      <img width='32' src={`http://localhost:1633/bzz/${ref}/`}/>
      <br/>
      <div style={{ fontSize: '50%' }}>{ref}</div>
      <hr/>
    </li>
  ));
  return (
    <div>
      <h1>Upload to Swarm</h1>
      {image.preview && <img src={image.preview} width='100' alt='preview' />}
      <br/>
      <form onSubmit={handleFileSubmit}>
        <input type='file' name='file' onChange={handleFileChange}></input>
        <button type='submit'>Submit</button>
      </form>
      <ol>{refList}</ol>
    </div>
  );
}

export default App;

