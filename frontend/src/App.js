import * as React from 'react';
import {useState,useEffect} from 'react';
import ReactMapGL,{Marker,Popup} from 'react-map-gl';
import {Room,Star} from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import {format} from "timeago.js"
import Register from './components/Register';
import Login from './components/Login';

 
function App() {
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("username"));
  const [pins,setPins] = useState([]);
  const [currentPlaceId,setCurrentPlaceId] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setTitle] = useState(null);
  const [description,setdesc] = useState(null);
  const [rating,setRating] = useState(0);
  const [showRegister,setShowRegister] = useState(false);
  const [showLogin,setShowLogin] = useState(false);

  


  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 48.858093 ,//, 
    longitude: 2.294694,
    zoom: 4
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);
  const handleMarkerClick = (id,lat,long) =>
  {
    setCurrentPlaceId(id);
    setViewport({...viewport,latitude:lat,longitude:long,zoom:15,transitionDuration:"1000" });
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long});
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    const newPin =
    {
      username : currentUser,
      title,
      description,
      rating,
      lat:newPlace.lat,
      long:newPlace.long

    }
    try
    {
      const res = await axios.post("/pins",newPin);
      setPins([...pins,res.data]);
      setNewPlace(null);
    }
    catch(error)
    {
      console.log(error);
    }
  };
  const handleLogout = () => 
  {
    myStorage.removeItem("username");
    setCurrentUser(null);
  }


  return (
    <div>
    <ReactMapGL
    {...viewport}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
    onViewportChange={nextViewport => setViewport(nextViewport)}
    mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
    onDblClick={handleAddClick}
    transitionDuration="200"
    >

    {
      pins.map((p=>(
    <>
    
    <Marker 
    latitude = {p.lat}
    longitude = {p.long}
    offsetLeft={-viewport.zoom*7 }
    offsetTop={-viewport.zoom*7}>
    <Room 
      style={{fontSize:viewport.zoom*7 ,
              color : p.username === currentUser ? "tomato": 'slateblue',
              cursor:'pointer'}} 
      onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
      

      /> 
    </Marker>
    {p._id === currentPlaceId && (

    <Popup
      latitude={p.lat}
      longitude={p.long}
      closeButton={true}
      closeOnClick={false}
      anchor="left"
      onClose={()=>setCurrentPlaceId(null)}
      >


      <div className='card'>
      <label>Place</label>
      <h4 className="place">{p.title}</h4>
      <label>Review</label>
      <p>{p.description}</p>
      <label> Rating : {p.rating}</label>
      
      <div className = "star">
      {Array(p.rating).fill(<Star />)}
      </div>
      
      <label>Information</label>
      <span className = "user">Created by <b>{p.username}</b></span>
      <span className = "user"><b> {format(p.createdAt)}</b></span>
      </div>
    </Popup>
      )}
    </>
      )))}

      {newPlace && (
      <Popup
      latitude={newPlace.lat}
      longitude={newPlace.long}
      closeButton={true}
      closeOnClick={false}
      anchor="left"
      onClose={()=>setNewPlace(null)}
      >
      <div>
        <form onSubmit={handleSubmit}>
          <lable>Title</lable>
          <input placeholder = "Enter a Title" onChange={(e)=>  setTitle(e.target.value)}/>
          <lable>Review</lable>
          <textarea placeholder = "Say us something about this place" onChange={(e)=>setdesc(e.target.value)}/>
          <lable>Rating</lable>
          <select onChange={(e)=>setRating(e.target.value)}>
            <option value = "1">1</option>
            <option value = "2">2</option>
            <option value = "3">3</option>
            <option value = "4">4</option>
            <option value = "5">5</option>
          </select>
          <button className='submitButton'>Add Pin</button>
        </form>
      </div>
      Hello</Popup>
      )}
      {currentUser ?(<button className='button logout' onClick={handleLogout}>Log Out</button>) :(
        
        <div className = "buttons">
        <button className='button login' onClick={()=> setShowLogin(true)}>Log In</button>
        <button className = "button register" onClick={()=>setShowRegister(true)}>Register</button>
        </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister}/>}
        {showLogin && <Login setShowLogin={setShowLogin} 
        myStorage ={myStorage} 
        setCurrentUser={setCurrentUser}/>}
    </ReactMapGL>

  
  </div>

);}
export default App;