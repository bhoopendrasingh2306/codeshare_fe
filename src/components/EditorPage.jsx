// src/App.js
import React, { useEffect, useState , useRef } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../socket";
import {useNavigate,useLocation,useParams, Navigate} from 'react-router-dom'
import toast from "react-hot-toast";
import logo from "../assets/logo3.svg"

function EditorPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const [clients, setClients] = useState([])

  useEffect(()=>{
    const init = async()=>{
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error',(err)=>handleError(err))
      socketRef.current.on('connect_failed',(err)=>handleError(err))
      const handleError = (e)=>{
        toast.error("Socket connection failed");
        navigate("/");
      }
      socketRef.current.emit('join',{
        roomId,
        username: location.state?.username,  
        
      });

      //listening for joined events
      socketRef.current.on(
        'user-joined',
        ({clients,username,socketId})=>{
          if(username !== location.state?.username){
            toast.success(`${username} ${" "}joined the room`);
          }
          setClients(clients);
          socketRef.current.emit('sync-code',{
            code:codeRef.current,
            socketId
          })
        }
      )
      
      //listening for disconnected events
      socketRef.current.on(
        'disconnected',
        ({username,socketId})=>{
          toast.success(`${username} left the room`);
          setClients((prev)=>{
            return prev.filter(client=>client.socketId!==socketId);
          })
        }
      )
      
      //listening for new messages
      socketRef.current.on(
        'new-message',
        ({message,username,socketId})=>{
          console.log(`${username}: ${message}`);
        }
      )
      
      //listening for typing events
      socketRef.current.on(
        'typing',
        ({username, isTyping})=>{
          if(isTyping){
            console.log(`${username} is typing...`);
          }else{
            console.log(`${username} stopped typing...`);
          }
        }
      )


    };
    init();
    return ()=>{
      socketRef.current?.disconnect();
      socketRef.current.off('user-joined');
      socketRef.current.off('disconnected');
    }
  },[])
 

  if(!location.state){
    return <Navigate to="/"/>
  }

  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    }catch(err){
      toast.error("couldn't copy roomId")
      console.log('error',err);
    }
  }

  const leaveRoom =()=>{
    navigate("/")
  }
  return (
    <div className="flex min-h-screen min-w-screen bg-gray-900 text-white">
      
      {/* Sidebar */}
      <div className="bg-gray-800 w-64 p-4 flex flex-col">
        {/* <div className="text-white text-xl font-bold mb-4">CODESHARE</div> */}
        <img src={logo} alt="codeshare" className="mb-4" />
        <div className="text-gray-400 mb-2">Members</div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex flex-col overflow-auto" >
            {clients.map((client)=>(
              <Client key={client.socketid} username={client.username}/>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 mb-2 rounded" onClick={copyRoomId}>
            Copy Room ID
          </button>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded" onClick={leaveRoom}>
            Leave Room
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="w-5/6 text-gray-300 flex flex-col h-full"> 
        <Editor socketRef={socketRef} roomId = {roomId} onCodeChange={(code)=>{codeRef.current=code}} />
      </div>
    </div>
  );
}

export default EditorPage;
