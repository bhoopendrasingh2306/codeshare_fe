import React, { useState } from "react";
import {v4 as uuidv4} from "uuid"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo3.svg';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setroomId] = useState('');
  const [username, setuserName] = useState('');
  const createNewRoom=(e)=>{
    e.preventDefault();
    const id = uuidv4();
    setroomId(id);
    toast.success("Room created successfully");
    
  }
  const joinRoom=(e)=>{
    e.preventDefault();  
    if(!roomId||!username){
      toast.error("Please enter both ROOM ID and USERNAME");
      return;
    }
    navigate(`/editor/${roomId}`,{
      state:{
        username,
        roomId
      }
    });
  }

  const handleInputEnter=(e)=>{
    if(e.code==='Enter'){
      joinRoom();
    }
  }
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* <h1 className="text-3xl font-bold text-white text-center mb-6">Code Share</h1> */}
        <img src={logo} alt="codeshare" className="h-28 w-full mb-4" />
        {/* <p className="text-green-400 text-center mb-6">Realtime collaboration</p> */}

        <form>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="room-id">
              Paste invitation ROOM ID
            </label>
            <input
              id="room-id"
              type="text"
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200"
              placeholder="ROOM ID"
              onChange={(e)=>setroomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
              
            />
          </div>

          <div className="mb-6">
            <input
              id="username"
              type="text"
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200"
              placeholder="USERNAME"
              onChange={(e)=>setuserName(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={joinRoom}
          >
            Join
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          If you don't have an invite then create{" "}
          <a onClick={createNewRoom} href="" className="text-green-500 hover:underline">
            new room
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;
