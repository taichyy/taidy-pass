const VaultLayout = ({
    children,
}:{
    children: React.ReactNode
}) => {
    return (
        <main className="bg-gray-50 dark:bg-black/90 min-h-screen">
            {children}
        </main>
    );
}
 
export default VaultLayout;