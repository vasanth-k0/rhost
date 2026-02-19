import FolderBrick from "../sub_components/FolderBrick.jsx"

const FilesPage = ({colorPalette}) => {
    const basePath = 'app/storage/' 
    const FoldersList = {
        'Internal': 'internal/admin',
        'External': 'external',
        'Mysite': 'mysite',
        'Network': 'network',
        'Shared': 'shared'
    }

    return (
        <>
            <div className="space-align-container">
                <div className="space-align-block" align='start' direction="vertical">
                    {
                        Object.keys(FoldersList).map((name, index)=>{
                            let path = basePath + FoldersList[name]
                            return (<FolderBrick path={path} name={name} colorPalette={colorPalette} > </FolderBrick>)
                        })
                    }
                    </div>
            </div>
        </>
    )
}

export default FilesPage;