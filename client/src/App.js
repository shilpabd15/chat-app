import './App.css';
import { useState } from "react";
import  io from 'socket.io-client';
import Chat from "./chats";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? 
      
      (<div className="joinChatContainer">
      <h1>Join A chat</h1>

      <input type="text" placeholder="Sam" 
      onChange={(event)=>{setUsername(event.target.value)}}
      />

      <input type="text" placeholder="Room ID"
      onChange={(event) => {setRoom(event.target.value)}}
      />

      <button onClick={joinRoom}>Join a room</button>

      </div>)
      :
    
      (<Chat socket={socket} username={username} room={room}/>)
    }

   
    </div>
  );
}

export default App;
