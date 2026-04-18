export const ComposeProviders = ({providers, children}) => {
    return providers.reduceRight((accumulator, Provider)=>{
        return <Provider>{accumulator}</Provider>;
    }, children);
}