import { DMEData } from "Src/core/types";
import { registerWidget, registerWidgetStyle, registerWidgetVariant } from "..";
import heroTextWidget from "./definition";
import { HeroText } from "./HeroText";
import { nanoid } from "nanoid";

const register = () =>{
    registerWidget(heroTextWidget, HeroText );
    registerWidgetVariant(
        {widget: 'hero-text', 
        identifier: 'image',
        name: 'Image text',
        allowedTypes:['heading', 'list:button'],
        getDefaultData:():DMEData.Block=>{
            return {
                id: nanoid(),
                type: 'hero-text:image',
                data: {
                    heroPosition:'left'
                },
                style:{space:'big'},
                children:[            
                {
                    id: nanoid(),
                    type: 'heading',
                    data: {
                        value: 'This is a new block',
                        level: 2,                  
                    },
                },
                {
                    id:nanoid(),
                    type:'list',
                    data:{align: 'right'},
                    children:[
                        {
                            id: nanoid(),
                            type: 'heading',
                            data: {
                                value: 'This is a new block 1',
                                level: 2,                         
                            },
                        },
                        {
                            id: nanoid(),
                            type:'list:button',
                            data:{direction: 'horizontal'},
                            children: [{
                                id: nanoid(),
                                type: 'button',
                                data:{value: 'Button'},
                                style:{type:'primary'},                    
                            }]
                        }
                    ]
                }
                ]
            };
        }
    }
    );
    registerWidgetStyle('hero-text:image', {
        name: 'Space', 
        identifier:'space',
        display:'inline-block',
        options:[
            {identifier:'small',
             name: 'Small',
             cssStyle:`
                background: #cccccc;
                & > .dme-w-list > .dme-block-container{
                    padding: 5px;
                }
             `
          },
          {identifier:'big',
             name: 'Big',
             cssStyle:`
                background: #333333;
                color: white;
                & > .dme-w-list > .dme-block-container{
                    padding: 10px;
                }
             `
          }
        ]
    })
}

export default register ;