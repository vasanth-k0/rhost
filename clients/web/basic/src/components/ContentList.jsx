import ActiveContent from './ActiveContent'; 

const ContentList = ({activeContent, colorPalette})=>{

    const list = ['Apps', 'Files', 'Accounts', 'Members', 'System'].map((page, index)=>{
        return <div style={{
            display: ((activeContent==page) ? 'block':'none')
        }}>
            <ActiveContent activeContent={page} colorPalette={colorPalette} />
        </div> 
    });

    return <> {list} </>;
}

export default ContentList