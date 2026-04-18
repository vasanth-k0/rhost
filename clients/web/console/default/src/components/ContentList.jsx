import ShowContent from './ShowContent'; 
import { useContext } from 'react';
import MenuItemContext from './context/MenuItemContext';

const ContentList = ({activeContent, colorPalette, context})=>{

    const {showContentList} = useContext(MenuItemContext);
    const ContentListComponent = [...Object.keys(showContentList.default), ...Object.keys(showContentList.user)]
                                                            .map((page, index)=>{
                                                                return <div 
                                                                                style={{ width: '100%', height: '100%', display: ((activeContent==page) ? 'block':'none') }}
                                                                            >
                                                                                <ShowContent content={page} colorPalette={colorPalette} context={context} />
                                                                            </div> 
                                                            });    
    return <> {ContentListComponent} </>;
}

export default ContentList