/* eslint-disable default-case */
import { observer } from 'mobx-react-lite'
import { useEffect, useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import canvasState from '../store/canvasState'
import toolState from '../store/toolState'
import '../styles/canvas.scss'
import Brush from '../tools/Brush'
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';

const Canvas = observer(() => {
  const canvasRef = useRef()
  const usernameRef = useRef()
  const [modal, setModal] = useState(true)
  const params = useParams()

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    // toolState.setTool(new Brush(canvasRef.current))
  }, [])

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket('ws://localhost:5000')
      canvasState.setSocket(socket)
      canvasState.setSessionId(params.id)
      toolState.setTool(new Brush(canvasRef.current, socket, params.id))
      socket.onopen = () => {
        console.log('Подключение установлено');
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: 'connection',
        }))
      }
      socket.onmessage = (event) => {
        let msg
        try {
          msg = JSON.parse(event.data)
        } catch (e) {}
        
        if(!msg) return
        switch (msg.method) {
          case 'connection':
            console.log(`Пользователь ${msg.username} подключился`);
            break
            
          case 'draw':
            drawHandler(msg)
            break
        }

          
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasState.username])

  const drawHandler = (msg) => {
    const figure = msg.figure
    const ctx = canvasRef.current.getContext('2d')
    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y)
        break
      
      case 'rect':
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height)
        break
      
      case 'finish':
        ctx.beginPath()
        break
      
    }
  }

  const mouseDownHandler = () =>  {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
  }

  const connectHandler = () => {
    canvasState.setUsername(usernameRef.current.value)
    setModal(false)
  }

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectHandler()}>
            Войти
          </Button>

        </Modal.Footer>
      </Modal>
      <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400} />
    </div>
  )
})

export default Canvas