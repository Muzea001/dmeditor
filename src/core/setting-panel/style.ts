import styled from '@emotion/styled';

export const SettingHeader = styled.div`
  font-weight: bold;
  margin: 10px 0px;
`;

export const SettingDescription = styled.div`
   color: #999999;
   padding: 10px 0px 20px 10px;
   font-size: 90%;
   font-style: italic;
`;


export const PageTitle = styled.div`
   padding: 5px;
   font-size: 18px;
   &:hover{
    outline: 1px dashed #333333; 
  }
`;

export const Space = styled.div`
  height: 10px
`

export const PathItem = styled.span<{ canClick?: boolean, selected?:boolean }>`
  font-size: 90%;
  cursor: pointer;
  display: inline-block;
  vertical-align: bottom;
  font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};
  color: ${(props) => (props.canClick ? '#0c0c0c' : '#666666')};

  ${(props) =>
    props.canClick
      ? `
    &:hover{
        color: var(--dme-hover-font-color);
    }
    `
      : ''};
`;

export const RightElement = styled.div`
    float: right;
`


export const TabBodyContainer = styled.div`
    padding: 15px 20px;
`


export const ActionPanel = styled.div`
    border-top: 1px solid #cccccc;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 100%;
    text-align: center;
    padding: 20px 0px;
`


export const PathContainer = styled.div`
    padding: 0px 10px;
`

export const AddBlockContainer = styled.div`
    padding: 10px;
`

