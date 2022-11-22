import { TitleOutlined } from '@mui/icons-material';
import { RenderMainProps, RenderSettingProps } from '../blocktype';
import { BlockData, BlockLayoutData } from '../types';
import { Ranger } from '../utils/Ranger';
import { BlockProperty } from "../BlockProperty"
import { ToolDefinition, ToolRenderProps } from "../ToolDefinition";
import React, {useEffect ,useState,useRef} from 'react';
import { AnyAaaaRecord } from 'dns';
import { CommonSettings } from '../CommonSettings';
import { PropertyItem } from '../utils';

const Heading = (props:any)=>{
    const [text,setText] = useState(props.data.data);
    const [level,setLevel] = useState(props.data.settings.level);
    const [commonSettings,setCommonSettings] = useState(props.data.common?props.data.common:{});
    const headRef:any=useRef(null);

    const changeText = (e?:any)=>{
        const texts=headRef.current.innerText
        if(props.onChange){
          setText(texts);
        }
    }

    const common = { onBlur:changeText,ref:headRef, contentEditable: props.active, style:commonSettings,}
    const render = ()=>{
      switch(level){
        case 1:
            return <h1 suppressContentEditableWarning {...common}>{text}</h1>
            break;
        case 2:
            return <h2 suppressContentEditableWarning {...common}>{text}</h2>
            break;
        case 3:
            return <h3 suppressContentEditableWarning {...common}>{text}</h3>
            break;
        case 4:
            return <h4 suppressContentEditableWarning {...common}>{text}</h4>
            break;
        case 5:
            return <h5 suppressContentEditableWarning {...common}>{text}</h5>
            break;
        default:
            return <h2 suppressContentEditableWarning {...common}>{text}</h2>
      }
    }

    useEffect(()=>{
      let newData = {type:'heading',data:{text:text, level:level},settings:{common: {...commonSettings}}}
      props.onChange(newData);
    },[text,level,commonSettings])

    return (
      <>
        <BlockProperty title={'Heading'} active={props.active}>
          <PropertyItem label="Level">
                <Ranger defaultValue={level} min={1} max={5} step={1} onChange={v=>setLevel(v)} />
          </PropertyItem>       
        <div><CommonSettings commonSettings={commonSettings} onChange={(settings)=>setCommonSettings(settings)} /></div>
        </BlockProperty>
        {render()}  
    </> 
    )
}

 export const toolHeading:ToolDefinition = {
  type: 'heading',
  isComposited: false,
  menu:  {text:"Heading", category:'basic',icon: <TitleOutlined /> },
  initData: {
    type:'heading', 
    data:'heading',
    common:{width:'auto'},
    settings:{level: 2},
  },
  view: (props:{data:any})=><Heading data={props.data} active={false} onChange={()=>{}} />,
  render: (props:{data:any, active:boolean})=><Heading {...props} />
}