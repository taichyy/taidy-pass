import NavResponsive from "./(components)/navbar/nav-responsive";

const HomeLayout = ({
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

export default HomeLayout;