import NavResponsive from "./(components)/navbar/nav-responsive";

const PublicLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <>
            <NavResponsive />
            {children}
        </>
    );
}

export default PublicLayout;