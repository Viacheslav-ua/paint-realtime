import toolState from '../store/toolState'
import '../styles/toolbar.scss'

const SettingBar = () => {
  return (
    <div className="setting-bar">
      <label style={{margin: '0 10px'}} htmlFor="line-width">Толщина линии</label>
      <input
        onChange={e => toolState.setLineWidth(e.target.value)}
        style={{ margin: '0 10px' }}
        id='line-width' type="number"
        defaultValue={1} min={1} max={50} />
      
      <label style={{margin: '0 10px'}} htmlFor="line-color">Цвет обводки</label>
      <input
        onChange={e => toolState.setStrokeColor(e.target.value)}
        style={{ margin: '0 10px' }}
        id='line-color' type="color"/>
    </div>
  )
}

export default SettingBar