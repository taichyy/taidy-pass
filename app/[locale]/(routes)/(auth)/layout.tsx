const AuthLayout = (props: {
    children: React.ReactNode
}) => {
    const { children } = props;

    return (
        // Hide data-aos first inisialization x-bar.
        <main className="overflow-x-hidden">
            {children}
        </main>
    );
}
 
export default AuthLayout;