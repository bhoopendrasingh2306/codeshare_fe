import React from 'react'
import "codemirror/mode/javascript/javascript"
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from 'codemirror';
import { useRef,useEffect } from 'react';

const Editor=({socketRef, roomId, onCodeChange})=> {
    const editorRef =  useRef(null);
    useEffect(() => {
        const init = async ()=>{
            editorRef.current = CodeMirror.fromTextArea(
                document.getElementById("realTimeEditor"),
                {
                    mode: {name: "javascript" , json: true},
                    theme : "dracula",
                    autoCloseTags : true,
                    autoCloseBrackets:true,
                    lineNumbers: true

                }
            );
            // editor.setSize(null,"100%")
            editorRef.current.on('change',(instance,changes)=>{
                // console.log('changes',changes);
                // console.log('socket ref changes',socketRef.current)
                const {origin}=changes;
                const code = instance.getValue();
                onCodeChange(code);
                if(origin !=='setValue'){
                    // console.log("working",code)
                    socketRef.current.emit('code-change',{
                        roomId,
                        code
                    });
                }
                // console.log("wooooowii->",code);
            })
        };
        init();
    },[])

    useEffect(()=>{
        if(socketRef.current){
            socketRef.current.on('code-change',({code})=>{
                console.log('code base',code);
                if(code !== null){
                     editorRef.current.setValue(code);
                }
            })
        }
        return ()=>{
            socketRef.current?.off('code-change');
        }
    },[socketRef.current])

  return (
    <div className='h-screen' >
        <textarea 
        id="realTimeEditor" placeholder='//code here'></textarea>

    </div>
  )
}

export default Editor