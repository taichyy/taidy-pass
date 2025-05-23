const AuthLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        // Hide data-aos first inisialization x-bar.
        <main className="overflow-x-hidden">
            {children}
        </main>
    );
}
 
export default AuthLayout;