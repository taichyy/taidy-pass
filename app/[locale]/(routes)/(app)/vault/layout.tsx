const VaultLayout = (props:{
    children: React.ReactNode;
}) => {
    const { children } = props;

    return (
        <main className="bg-gray-50 dark:bg-black/90 min-h-screen flex flex-col">
            {children}
        </main>
    );
};
 
export default VaultLayout;