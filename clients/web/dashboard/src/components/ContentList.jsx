import ShowContent from './ShowContent'; 
import { useContext } from 'react';
import MenuItemContext from './context/MenuItemContext';

const ContentList = ({activeContent, colorPalette})=>{

    const {showContentList} = useContext(MenuItemContext);
    const ContentListComponent = [...showContentList.default, ...showContentList.user].map((page, index)=>{
        return <div 
                        style={{ display: ((activeContent==page) ? 'block':'none') }}
                    >
                        <ShowContent content={page} colorPalette={colorPalette} />
                    </div> 
    });    
    return <> {ContentListComponent} </>;
}

export default ContentList