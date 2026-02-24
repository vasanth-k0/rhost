
import FolderBrick from "./sub_components/FolderBrick"

const FileExplorer = ({ FoldersList, colorPalette, FolderClickAction})=>{
    return <> 
        <div className="space-align-container" style={{padding: '10px'}}>
                            <div className="space-align-block" align='start' direction="vertical">
                                {
                                    Object.keys(FoldersList).map((name, index)=>{
                                        let path = FoldersList[name][0];
                                        let dir = FoldersList[name][1];
                                        return (
                                            <FolderBrick 
                                                path={path} 
                                                name={name} 
                                                dir = {dir}
                                                colorPalette={colorPalette} 
                                                active={null} 
                                                setActive={()=>{}}
                                                FolderClickAction={FolderClickAction}
                                            > </FolderBrick>
                                        )
                                    })
                                }
                                </div>
                        </div>
    </>
}

export default FileExplorer;